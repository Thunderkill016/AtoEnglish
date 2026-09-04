export const VETTED_OSS_CONTRACT_ID = "nep.vetted-oss-matrix.v1" as const;
export const VETTED_OSS_CONTRACT_VERSION = 1 as const;

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

export const LICENSE_CLASSIFICATIONS = [
  "permissive-mit",
  "permissive-apache2",
  "permissive-bsd",
  "copyleft-lgpl",
  "copyleft-gpl",
  "non-commercial",
  "unapproved",
] as const;

export type LicenseClassification = (typeof LICENSE_CLASSIFICATIONS)[number];

export const INTEGRATION_MODES = [
  "direct-library",
  "source-adaptation",
  "isolated-service",
  "baseline-donor",
  "rejected",
] as const;

export type IntegrationMode = (typeof INTEGRATION_MODES)[number];

export type PackageResourceFootprint = {
  readonly ramMb: number;
  readonly diskMb: number;
  readonly gpuRequired: boolean;
};

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
  readonly footprint: PackageResourceFootprint;
  readonly latencyProfile: string;
  readonly integrationMode: IntegrationMode;
  readonly attributionRequired: boolean;
  readonly adapterContract: string;
  readonly attributionNotice: string;
};

export type ReuseDecision = {
  readonly packageId: VettedPackageId;
  readonly status: "approved" | "rejected";
  readonly decisionTier: 1 | 2 | 3 | 4 | 5;
  readonly mode: IntegrationMode;
  readonly justification: string;
};

export type LicenseValidationResult = {
  readonly valid: boolean;
  readonly reason?: string;
  readonly copyleftIsolated: boolean;
};

export const VETTED_OSS_REGISTRY: Readonly<Record<VettedPackageId, VettedPackageDescriptor>> = Object.freeze({
  "cahlr-pybkt": Object.freeze({
    id: "cahlr-pybkt",
    name: "CAHLR/pyBKT",
    capability: "Bayesian Knowledge Tracing (BKT) baseline reference",
    upstreamUrl: "https://github.com/CAHLR/pyBKT",
    pinnedTag: "1.4.3",
    pinnedCommit: "b025227",
    codeLicense: "permissive-mit",
    modelLicense: "not-applicable",
    runtime: "Python / C++ (NumPy, SciPy, Pandas, scikit-learn)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 100, diskMb: 50, gpuRequired: false }),
    latencyProfile: "<0.1ms per step forward inference, 1-30s EM fit",
    integrationMode: "baseline-donor",
    attributionRequired: true,
    adapterContract: "BktAdapterContract",
    attributionNotice: "Copyright (c) CAHLR / Zachary Pardos et al. Corbett & Anderson (1994) knowledge tracing.",
  }),
  "openai-whisper": Object.freeze({
    id: "openai-whisper",
    name: "OpenAI Whisper",
    capability: "Speech-to-text gold-standard transcription baseline",
    upstreamUrl: "https://github.com/openai/whisper",
    pinnedTag: "20250625",
    pinnedCommit: "c0d2f62",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    runtime: "Python / PyTorch (>=1.10, ffmpeg, tiktoken)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 1500, gpuRequired: true }),
    latencyProfile: "1.5-5.0s per utterance CPU, 150-400ms GPU",
    integrationMode: "baseline-donor",
    attributionRequired: true,
    adapterContract: "AsrAdapterContract",
    attributionNotice: "Copyright (c) OpenAI. Licensed under the MIT License.",
  }),
  "systran-faster-whisper": Object.freeze({
    id: "systran-faster-whisper",
    name: "SYSTRAN faster-whisper",
    capability: "Fast self-hosted local speech-to-text inference",
    upstreamUrl: "https://github.com/SYSTRAN/faster-whisper",
    pinnedTag: "v1.2.1",
    pinnedCommit: "3b62f1c",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    runtime: "CTranslate2 / C++ / Python (onnxruntime, tokenizers)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 600, diskMb: 240, gpuRequired: false }),
    latencyProfile: "80-250ms CPU int8, <50ms GPU",
    integrationMode: "isolated-service",
    attributionRequired: true,
    adapterContract: "AsrAdapterContract",
    attributionNotice: "Copyright (c) SYSTRAN and faster-whisper contributors. Licensed under MIT License.",
  }),
  "silero-vad": Object.freeze({
    id: "silero-vad",
    name: "Silero VAD",
    capability: "Voice activity detection and streaming audio segmentation",
    upstreamUrl: "https://github.com/snakers4/silero-vad",
    pinnedTag: "v6.2",
    pinnedCommit: "be95df9",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    runtime: "ONNX Runtime (pure JS/TS onnxruntime-node/web) or Python",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 30, diskMb: 5, gpuRequired: false }),
    latencyProfile: "<1ms per 30ms audio chunk (streaming)",
    integrationMode: "direct-library",
    attributionRequired: true,
    adapterContract: "VadAdapterContract",
    attributionNotice: "Copyright (c) Silero Team. Licensed under the MIT License.",
  }),
  "montreal-forced-aligner": Object.freeze({
    id: "montreal-forced-aligner",
    name: "Montreal Forced Aligner (MFA)",
    capability: "Acoustic phoneme-to-text forced alignment and boundary detection",
    upstreamUrl: "https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner",
    pinnedTag: "v3.4.2",
    pinnedCommit: "v3.4.2",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    runtime: "Python 3.10+ / Kaldi (C++) / OpenFST / Pynini",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 3000, diskMb: 2500, gpuRequired: false }),
    latencyProfile: "0.8-3.0s per utterance (asynchronous batch alignment)",
    integrationMode: "isolated-service",
    attributionRequired: true,
    adapterContract: "AlignmentAdapterContract",
    attributionNotice: "Copyright (c) Montreal Corpus Tools (Michael McAuliffe et al.). Licensed under MIT.",
  }),
  "speechbrain": Object.freeze({
    id: "speechbrain",
    name: "SpeechBrain",
    capability: "Speech acoustic embeddings and baseline representation extraction",
    upstreamUrl: "https://github.com/speechbrain/speechbrain",
    pinnedTag: "v1.0.2",
    pinnedCommit: "v1.0.2",
    codeLicense: "permissive-apache2",
    modelLicense: "permissive-apache2",
    runtime: "Python / PyTorch (>=2.0, torchaudio, huggingface_hub)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 4000, diskMb: 2500, gpuRequired: true }),
    latencyProfile: "150-500ms GPU, 1-3s CPU",
    integrationMode: "baseline-donor",
    attributionRequired: true,
    adapterContract: "AcousticRepresentationContract",
    attributionNotice: "Copyright (c) SpeechBrain Team (Mirco Ravanelli et al.). Licensed under Apache-2.0.",
  }),
  "languagetool": Object.freeze({
    id: "languagetool",
    name: "LanguageTool",
    capability: "Rule-based grammar, style, and spelling diagnostic verification",
    upstreamUrl: "https://github.com/languagetool-org/languagetool",
    pinnedTag: "v6.6",
    pinnedCommit: "v6.6",
    codeLicense: "copyleft-lgpl",
    modelLicense: "copyleft-lgpl",
    runtime: "Java 17/21 (OpenJDK, Lucene, Morfologik)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 500, gpuRequired: false }),
    latencyProfile: "15-60ms per sentence via local HTTP loopback",
    integrationMode: "isolated-service",
    attributionRequired: true,
    adapterContract: "LinguisticAdapterContract",
    attributionNotice: "Copyright (c) Daniel Naber and LanguageTool contributors. Licensed under LGPL-2.1-or-later.",
  }),
  "stanfordnlp-stanza": Object.freeze({
    id: "stanfordnlp-stanza",
    name: "Stanford Stanza",
    capability: "Linguistic analysis and universal syntactic dependency parsing",
    upstreamUrl: "https://github.com/stanfordnlp/stanza",
    pinnedTag: "v1.14.0",
    pinnedCommit: "v1.14.0",
    codeLicense: "permissive-apache2",
    modelLicense: "permissive-apache2",
    runtime: "Python / PyTorch (>=1.13, NumPy, protobuf)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 1000, gpuRequired: false }),
    latencyProfile: "150-400ms per paragraph CPU",
    integrationMode: "baseline-donor",
    attributionRequired: true,
    adapterContract: "LinguisticAdapterContract",
    attributionNotice: "Copyright (c) The Board of Trustees of the Leland Stanford Junior University. Licensed under Apache-2.0.",
  }),
  "explosion-spacy": Object.freeze({
    id: "explosion-spacy",
    name: "Explosion spaCy",
    capability: "Industrial tokenization, POS tagging, and syntactic parsing",
    upstreamUrl: "https://github.com/explosion/spaCy",
    pinnedTag: "v3.8.16",
    pinnedCommit: "v3.8.16",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    runtime: "Python / Cython / C (Thinc, Blis, Murmurhash)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 250, diskMb: 50, gpuRequired: false }),
    latencyProfile: "2-10ms per sentence CPU",
    integrationMode: "isolated-service",
    attributionRequired: true,
    adapterContract: "LinguisticAdapterContract",
    attributionNotice: "Copyright (c) Explosion AI GmbH. Licensed under the MIT License.",
  }),
  "cmusphinx-cmudict": Object.freeze({
    id: "cmusphinx-cmudict",
    name: "CMU Pronouncing Dictionary",
    capability: "North American English phoneme pronunciation lexicon (ARPAbet to IPA)",
    upstreamUrl: "https://github.com/cmusphinx/cmudict",
    pinnedTag: "cmudict-0.7b",
    pinnedCommit: "d3da70f",
    codeLicense: "permissive-bsd",
    modelLicense: "permissive-bsd",
    runtime: "Plain text / TypeScript hash trie (Zero runtime dependencies)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 16, diskMb: 4, gpuRequired: false }),
    latencyProfile: "<0.01ms in-memory trie lookup",
    integrationMode: "direct-library",
    attributionRequired: true,
    adapterContract: "LexiconAdapterContract",
    attributionNotice: "Copyright (c) 1993-2014 Carnegie Mellon University. BSD-style license.",
  }),
  "bootphon-phonemizer": Object.freeze({
    id: "bootphon-phonemizer",
    name: "bootphon/phonemizer",
    capability: "Multilingual text-to-phoneme conversion",
    upstreamUrl: "https://github.com/bootphon/phonemizer",
    pinnedTag: "v3.4.0",
    pinnedCommit: "v3.4.0",
    codeLicense: "copyleft-gpl",
    modelLicense: "copyleft-gpl",
    runtime: "Python / espeak-ng C library",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 80, diskMb: 50, gpuRequired: false }),
    latencyProfile: "5-20ms per sentence",
    integrationMode: "rejected",
    attributionRequired: true,
    adapterContract: "PhonemizerAdapterContract",
    attributionNotice: "Copyright (c) Mathieu Bernard et al. Licensed under GPL-3.0-or-later. REJECTED from direct TS link.",
  }),
  "open-spaced-repetition-ts-fsrs": Object.freeze({
    id: "open-spaced-repetition-ts-fsrs",
    name: "Open Spaced Repetition ts-fsrs",
    capability: "Free Spaced Repetition Scheduler (FSRS-v5 19 parameters)",
    upstreamUrl: "https://github.com/open-spaced-repetition/ts-fsrs",
    pinnedTag: "v5.4.1",
    pinnedCommit: "v5.4.1",
    codeLicense: "permissive-mit",
    modelLicense: "not-applicable",
    runtime: "Pure TypeScript (Zero dependencies)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 1, diskMb: 1, gpuRequired: false }),
    latencyProfile: "<0.01ms review interval calculation",
    integrationMode: "direct-library",
    attributionRequired: true,
    adapterContract: "FsrsAdapterContract",
    attributionNotice: "Copyright (c) Open Spaced Repetition. Licensed under MIT.",
  }),
});

export function getVettedPackage(id: VettedPackageId): VettedPackageDescriptor | undefined {
  return VETTED_OSS_REGISTRY[id];
}

export function listVettedPackages(filter?: {
  mode?: IntegrationMode;
  capabilitySubstring?: string;
}): readonly VettedPackageDescriptor[] {
  const all = Object.values(VETTED_OSS_REGISTRY);
  return Object.freeze(
    all.filter((pkg) => {
      if (filter?.mode && pkg.integrationMode !== filter.mode) return false;
      if (
        filter?.capabilitySubstring &&
        !pkg.capability.toLowerCase().includes(filter.capabilitySubstring.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
  );
}

export function isPermissiveLicense(license: LicenseClassification): boolean {
  return (
    license === "permissive-mit" ||
    license === "permissive-apache2" ||
    license === "permissive-bsd"
  );
}

export function validateLicenseCompatibility(
  codeLicense: LicenseClassification,
  modelLicense: LicenseClassification | "not-applicable",
  mode: IntegrationMode
): LicenseValidationResult {
  if (codeLicense === "non-commercial" || modelLicense === "non-commercial") {
    return Object.freeze({
      valid: false,
      reason: "Non-commercial licenses are strictly forbidden in Core production path",
      copyleftIsolated: false,
    });
  }

  if (codeLicense === "unapproved" || modelLicense === "unapproved") {
    return Object.freeze({
      valid: false,
      reason: "Unapproved license is rejected fail-closed",
      copyleftIsolated: false,
    });
  }

  if (codeLicense === "copyleft-gpl" && mode === "direct-library") {
    return Object.freeze({
      valid: false,
      reason: "Direct linking of GPL-3.0 copyleft code into Core TypeScript is forbidden",
      copyleftIsolated: false,
    });
  }

  if (codeLicense === "copyleft-lgpl" && mode === "direct-library") {
    return Object.freeze({
      valid: false,
      reason: "Direct bundling of LGPL code into Core TypeScript distribution is forbidden; must use isolated-service",
      copyleftIsolated: false,
    });
  }

  if (codeLicense === "copyleft-lgpl" && mode === "isolated-service") {
    return Object.freeze({
      valid: true,
      copyleftIsolated: true,
    });
  }

  if (isPermissiveLicense(codeLicense)) {
    return Object.freeze({
      valid: true,
      copyleftIsolated: true,
    });
  }

  return Object.freeze({
    valid: false,
    reason: `Incompatible license configuration: ${codeLicense} under mode ${mode}`,
    copyleftIsolated: false,
  });
}

export function evaluateReuseDecision(descriptor: VettedPackageDescriptor): ReuseDecision {
  const licenseCheck = validateLicenseCompatibility(
    descriptor.codeLicense,
    descriptor.modelLicense,
    descriptor.integrationMode
  );

  if (!licenseCheck.valid) {
    return Object.freeze({
      packageId: descriptor.id,
      status: "rejected",
      decisionTier: 5,
      mode: "rejected",
      justification: licenseCheck.reason ?? "License validation failed",
    });
  }

  if (descriptor.integrationMode === "direct-library") {
    return Object.freeze({
      packageId: descriptor.id,
      status: "approved",
      decisionTier: 1,
      mode: "direct-library",
      justification: "Pure TS / lightweight wasm library with permissive license fits directly into core",
    });
  }

  if (descriptor.integrationMode === "source-adaptation") {
    return Object.freeze({
      packageId: descriptor.id,
      status: "approved",
      decisionTier: 2,
      mode: "source-adaptation",
      justification: "Stable bounded algorithm adapted into pure deterministic TypeScript with pinned provenance",
    });
  }

  if (descriptor.integrationMode === "isolated-service") {
    return Object.freeze({
      packageId: descriptor.id,
      status: "approved",
      decisionTier: 3,
      mode: "isolated-service",
      justification: "Native runtime / heavy compute / LGPL copyleft strictly isolated across local loopback service boundary",
    });
  }

  if (descriptor.integrationMode === "baseline-donor") {
    return Object.freeze({
      packageId: descriptor.id,
      status: "approved",
      decisionTier: 4,
      mode: "baseline-donor",
      justification: "Reference benchmark comparator for offline evaluation and calibration validation",
    });
  }

  return Object.freeze({
    packageId: descriptor.id,
    status: "rejected",
    decisionTier: 5,
    mode: "rejected",
    justification: "Candidate rejected due to unviable integration profile",
  });
}
