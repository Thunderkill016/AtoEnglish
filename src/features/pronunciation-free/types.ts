export type PronunciationSensorCalibration = "unvalidated";

export type PhoneAlignmentKind =
  | "match"
  | "substitution"
  | "deletion"
  | "insertion";

export type PhoneAlignment = {
  kind: PhoneAlignmentKind;
  expected: string | null;
  observed: string | null;
};

export type LocalPhonemeRuntime = {
  device: "webgpu" | "wasm";
  dtype: "q4f16" | "q4";
};

export type LocalPhonemeObservation = {
  calibration: PronunciationSensorCalibration;
  model: {
    id: string;
    revision: string;
    runtime: LocalPhonemeRuntime;
  };
  target: {
    word: string;
    ipa: string;
  };
  expectedPhones: string[];
  observedPhones: string[];
  alignment: PhoneAlignment[];
};

export type PhonemeWorkerProgress = {
  status: string;
  file: string | null;
  progress: number | null;
};
