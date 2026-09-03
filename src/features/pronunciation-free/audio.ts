const TARGET_SAMPLE_RATE = 16_000;
const MIN_RECORDING_SECONDS = 0.15;
const MAX_RECORDING_SECONDS = 8;
const SILENCE_PEAK_THRESHOLD = 0.001;
const SILENCE_RMS_THRESHOLD = 0.0001;
const PROCESSOR_BUFFER_SIZE = 4096;

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

function concatenateChunks(chunks: Float32Array[], totalLength: number) {
  const samples = new Float32Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    samples.set(chunk, offset);
    offset += chunk.length;
  }

  return samples;
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

async function openMicrophoneStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: { ideal: 1 },
        echoCancellation: { ideal: false },
        noiseSuppression: { ideal: false },
        autoGainControl: { ideal: false },
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
  const AudioContextClass = globalThis.AudioContext;

  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia ||
    !AudioContextClass
  ) {
    throw new Error("microphone_recording_unavailable");
  }

  const stream = await openMicrophoneStream();
  const audioTrack = stream.getAudioTracks()[0];

  if (!audioTrack || audioTrack.readyState !== "live") {
    for (const track of stream.getTracks()) track.stop();
    throw new Error("microphone_track_unavailable");
  }

  const context = new AudioContextClass();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(PROCESSOR_BUFFER_SIZE, 1, 1);
  const mute = context.createGain();
  mute.gain.value = 0;

  const chunks: Float32Array[] = [];
  let totalSamples = 0;
  let finalized = false;
  let stopPromise: Promise<LocalRecordingResult> | null = null;

  processor.onaudioprocess = (event) => {
    if (finalized) return;

    const chunk = downmixToMono(event.inputBuffer);
    chunks.push(chunk);
    totalSamples += chunk.length;
  };

  source.connect(processor);
  processor.connect(mute);
  mute.connect(context.destination);

  if (context.state === "suspended") {
    await context.resume();
  }

  const cleanup = () => {
    processor.onaudioprocess = null;

    try {
      source.disconnect();
      processor.disconnect();
      mute.disconnect();
    } catch {
      // Nodes may already be disconnected during browser teardown.
    }

    for (const track of stream.getTracks()) {
      track.stop();
    }
  };

  const stop = () => {
    if (stopPromise) return stopPromise;

    if (finalized) {
      return Promise.reject(new Error("recorder_not_recording"));
    }

    finalized = true;

    stopPromise = (async () => {
      cleanup();

      try {
        if (totalSamples === 0) {
          throw new Error("empty_audio_recording");
        }

        const sourceSamples = concatenateChunks(chunks, totalSamples);
        const sourceDuration = sourceSamples.length / context.sampleRate;

        if (sourceDuration < MIN_RECORDING_SECONDS) {
          throw new Error("recording_too_short");
        }

        if (sourceDuration > MAX_RECORDING_SECONDS + 0.75) {
          throw new Error("recording_too_long");
        }

        const samples = await resampleMono(
          sourceSamples,
          context.sampleRate,
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
    })();

    return stopPromise;
  };

  const cancel = () => {
    if (finalized) return;

    finalized = true;
    cleanup();
    void context.close();
  };

  return { stop, cancel };
}

export const LOCAL_PRONUNCIATION_MAX_SECONDS = MAX_RECORDING_SECONDS;
