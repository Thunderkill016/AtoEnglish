const TARGET_SAMPLE_RATE = 16_000;
const MIN_RECORDING_SECONDS = 0.15;
const MAX_RECORDING_SECONDS = 8;
const SILENCE_PEAK_THRESHOLD = 0.001;
const SILENCE_RMS_THRESHOLD = 0.0001;

export type LocalRecordingResult = {
  recording: Blob;
  samples: Float32Array;
  durationSeconds: number;
  peakAmplitude: number;
  rmsAmplitude: number;
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

function measureSignal(samples: Float32Array) {
  let peakAmplitude = 0;
  let squareSum = 0;

  for (const sample of samples) {
    const absolute = Math.abs(sample);
    if (absolute > peakAmplitude) peakAmplitude = absolute;
    squareSum += sample * sample;
  }

  return {
    peakAmplitude,
    rmsAmplitude: samples.length > 0 ? Math.sqrt(squareSum / samples.length) : 0,
  };
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodePcm16Wav(samples: Float32Array, sampleRate: number) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (const value of samples) {
    const sample = Math.max(-1, Math.min(1, value));
    const pcm = sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7fff);
    view.setInt16(offset, pcm, true);
    offset += bytesPerSample;
  }

  return new Blob([new Uint8Array(buffer)], { type: "audio/wav" });
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
    const { peakAmplitude, rmsAmplitude } = measureSignal(samples);

    if (
      peakAmplitude < SILENCE_PEAK_THRESHOLD &&
      rmsAmplitude < SILENCE_RMS_THRESHOLD
    ) {
      throw new Error("recording_signal_missing");
    }

    return {
      recording: encodePcm16Wav(samples, TARGET_SAMPLE_RATE),
      samples,
      durationSeconds: samples.length / TARGET_SAMPLE_RATE,
      peakAmplitude,
      rmsAmplitude,
    };
  } finally {
    await context.close();
  }
}

async function openMicrophoneStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
      video: false,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "OverconstrainedError") {
      return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    }

    throw error;
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

  const stream = await openMicrophoneStream();
  const audioTrack = stream.getAudioTracks()[0];

  if (!audioTrack || audioTrack.readyState !== "live") {
    for (const track of stream.getTracks()) track.stop();
    throw new Error("microphone_track_unavailable");
  }

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

  recorder.start(250);

  return { stop, cancel };
}

export const LOCAL_PRONUNCIATION_MAX_SECONDS = MAX_RECORDING_SECONDS;
