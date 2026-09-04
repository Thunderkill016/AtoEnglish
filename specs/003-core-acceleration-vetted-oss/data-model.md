# Data Model: Core Acceleration (Vetted OSS Registry & Adapter Contracts)

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-04 | **Status**: Draft

---

## 1. Core Data Entities

### 1.1 Vetted Package Identifier (`VettedPackageId`)
```typescript
export const VETTED_PACKAGE_IDS = [
  "cahlr-pybkt",
  "openai-whisper",
  "systran-faster-whisper",
  "silero-vad",
  "montreal-forced-aligner",
  "speechbrain",
  "languagetool",
  "stanfordnlp-stanza",
  "explosion-spacy",
  "cmusphinx-cmudict",
  "bootphon-phonemizer",
  "open-spaced-repetition-ts-fsrs",
] as const;

export type VettedPackageId = (typeof VETTED_PACKAGE_IDS)[number];
```

---

### 1.2 License & Integration Mode Enums
```typescript
export type LicenseClassification =
  | "permissive-mit"
  | "permissive-apache2"
  | "permissive-bsd"
  | "copyleft-lgpl"
  | "copyleft-gpl"
  | "non-commercial"
  | "unapproved";

export type IntegrationMode =
  | "direct-library"
  | "source-adaptation"
  | "isolated-service"
  | "baseline-donor"
  | "rejected";
```

---

### 1.3 Vetted Package Descriptor (`VettedPackageDescriptor`)
```typescript
export type VettedPackageDescriptor = {
  readonly id: VettedPackageId;
  readonly name: string;
  readonly capability: string;
  readonly upstreamUrl: string;
  readonly pinnedTag: string;
  readonly pinnedCommit: string;
  readonly codeLicense: LicenseClassification;
  readonly modelLicense: LicenseClassification | "not-applicable";
  readonly runtime: string;
  readonly offlineSelfHostable: boolean;
  readonly footprint: {
    readonly ramMb: number;
    readonly diskMb: number;
    readonly gpuRequired: boolean;
  };
  readonly latencyProfile: string;
  readonly integrationMode: IntegrationMode;
  readonly attributionRequired: boolean;
  readonly adapterContract: string;
};
```

---

### 1.4 Reuse Evaluation & Decision
```typescript
export type ReuseDecision = {
  readonly packageId: VettedPackageId;
  readonly status: "approved" | "rejected";
  readonly decisionTier: 1 | 2 | 3 | 4 | 5;
  readonly mode: IntegrationMode;
  readonly justification: string;
};
```

---

### 1.5 External Engine Adapter Observation Payloads (Strictly Observational)
All adapter outputs conform to typed `CoreObservation` extensions and are forbidden from containing authority or mastery fields:

```typescript
// 1. ASR Transcription
export type AsrTranscriptionObservation = {
  readonly observationType: "asr-transcription";
  readonly text: string;
  readonly durationMs: number;
  readonly tokens: readonly {
    readonly token: string;
    readonly startMs: number;
    readonly endMs: number;
    readonly confidence: number;
  }[];
  readonly noSpeechProbability: number;
  readonly engine: string;
};

// 2. VAD Speech Activity
export type VadSpeechObservation = {
  readonly observationType: "vad-speech-detection";
  readonly isSpeech: boolean;
  readonly speechProbability: number;
  readonly intervals: readonly {
    readonly startMs: number;
    readonly endMs: number;
  }[];
  readonly totalDurationMs: number;
};

// 3. Linguistic & Grammar Diagnostics
export type LinguisticAnnotationObservation = {
  readonly observationType: "linguistic-annotation";
  readonly tokens: readonly {
    readonly text: string;
    readonly lemma: string;
    readonly pos: string;
    readonly tag: string;
    readonly dep: string;
    readonly headIndex: number;
  }[];
  readonly grammarDiagnostics?: readonly {
    readonly ruleId: string;
    readonly message: string;
    readonly offset: number;
    readonly length: number;
    readonly replacements: readonly string[];
  }[];
};

// 4. Phoneme Alignment
export type PhonemeAlignmentObservation = {
  readonly observationType: "phoneme-alignment";
  readonly words: readonly {
    readonly word: string;
    readonly startMs: number;
    readonly endMs: number;
    readonly phonemes: readonly {
      readonly phone: string;
      readonly startMs: number;
      readonly endMs: number;
      readonly score?: number;
    }[];
  }[];
};

// 5. BKT Baseline Comparator
export type BktBaselineObservation = {
  readonly observationType: "bkt-baseline-comparator";
  readonly constructId: string;
  readonly priorMastery: number;
  readonly posteriorMastery: number;
  readonly parameters: {
    readonly pLearn: number;
    readonly pGuess: number;
    readonly pSlip: number;
    readonly pForget: number;
  };
};
```
