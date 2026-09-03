const TARGET_SAMPLE_RATE = 16_000;
const MIN_RECORDING_SECONDS = 0.15;
const MAX_RECORDING_SECONDS = 8;

export type LocalRecordingResult = {
  recording: Blob;
  samples: Float32Array;
  durationSeconds: number;
};

export type LocalRecordingSession = {
  stop(): Promise<LocalRecordingResult>;
  cancel(): void;
};

function preferredRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];

  return (
    candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? ""
  );
}

function downmixToMono(audioBuffer: AudioBuffer) {
  const mono = new Float32Array(audioBuffer.length);

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const channelSamples = audioBuffer.getChannelData(channel);

    for (let index = 0; index < channelSamples.length; index += 1) {
      mono[index] += channelSamples[index] / audioBuffer.numberOfChannels;
    }
  }

  return mono;
}

async function resampleMono(
  samples: Float32Array,
  sourceSampleRate: number,
  targetSampleRate: number,
) {
  if (sourceSampleRate === targetSampleRate) {
    return Float32Array.from(samples);
  }

  if (typeof OfflineAudioContext === "undefined") {
    throw new Error("offline_audio_context_unavailable");
  }

  const targetLength = Math.ceil(
    samples.length * (targetSampleRate / sourceSampleRate),
  );

  const context = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const sourceBuffer = context.createBuffer(1, samples.length, sourceSampleRate);
  sourceBuffer.getChannelData(0).set(samples);

  const source = context.createBufferSource();
  source.buffer = sourceBuffer;
  source.connect(context.destination);
  source.start(0);

  const rendered = await context.startRendering();
  return Float32Array.from(rendered.getChannelData(0));
}

async function decodeRecording(recording: Blob): Promise<LocalRecordingResult> {
  const AudioContextClass = globalThis.AudioContext;

  if (!AudioContextClass) {
    throw new Error("audio_context_unavailable");
  }

  const context = new AudioContextClass();

  try {
    const encoded = await recording.arrayBuffer();
    const decoded = await context.decodeAudioData(encoded.slice(0));

    if (!Number.isFinite(decoded.duration) || decoded.duration < MIN_RECORDING_SECONDS) {
      throw new Error("recording_too_short");
    }

    if (decoded.duration > MAX_RECORDING_SECONDS + 0.5) {
      throw new Error("recording_too_long");
    }

    const mono = downmixToMono(decoded);
    const samples = await resampleMono(
      mono,
      decoded.sampleRate,
      TARGET_SAMPLE_RATE,
    );

    return {
      recording,
      samples,
      durationSeconds: samples.length / TARGET_SAMPLE_RATE,
    };
  } finally {
    await context.close();
  }
}

export async function startLocalPronunciationRecording(): Promise<LocalRecordingSession> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined"
  ) {
    throw new Error("microphone_recording_unavailable");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });

  const mimeType = preferredRecorderMimeType();
  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);

  const chunks: Blob[] = [];
  let finalized = false;
  let stopPromise: Promise<LocalRecordingResult> | null = null;

  const stopTracks = () => {
    for (const track of stream.getTracks()) {
      track.stop();
    }
  };

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  });

  const stop = () => {
    if (stopPromise) return stopPromise;

    if (finalized || recorder.state !== "recording") {
      return Promise.reject(new Error("recorder_not_recording"));
    }

    finalized = true;

    stopPromise = new Promise<LocalRecordingResult>((resolve, reject) => {
      recorder.addEventListener(
        "stop",
        async () => {
          stopTracks();

          const recording = new Blob(chunks, {
            type: recorder.mimeType || chunks[0]?.type || "audio/webm",
          });

          if (recording.size === 0) {
            reject(new Error("empty_audio_recording"));
            return;
          }

          try {
            resolve(await decodeRecording(recording));
          } catch (error) {
            reject(error);
          }
        },
        { once: true },
      );

      recorder.addEventListener(
        "error",
        () => {
          stopTracks();
          reject(new Error("media_recorder_error"));
        },
        { once: true },
      );

      recorder.stop();
    });

    return stopPromise;
  };

  const cancel = () => {
    if (finalized) return;

    finalized = true;

    if (recorder.state === "recording") {
      recorder.stop();
    }

    stopTracks();
  };

  recorder.start();

  return { stop, cancel };
}

export const LOCAL_PRONUNCIATION_MAX_SECONDS = MAX_RECORDING_SECONDS;
