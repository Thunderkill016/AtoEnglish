import type {
  CoreObservation,
  ObservationAuthority,
  CalibrationProfile,
  ObservationProvenance,
  ObservationContext,
} from "./observation";
import { normalizeObservationConfidence } from "./observation";
import type { DiagnosticPayload } from "./diagnostics";
import type { CommunicationActivity } from "./domain";

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
  readonly pinnedCommit: string; // Must be a valid 40-hex commit SHA
  readonly codeLicense: LicenseClassification;
  readonly modelLicense: LicenseClassification | "not-applicable";
  readonly modelLicenseNotes?: string;
  readonly runtime: string;
  readonly offlineSelfHostable: boolean;
  readonly footprint: PackageResourceFootprint;
  readonly footprintNotes?: string;
  readonly latencyProfile: string;
  readonly latencyNotes?: string;
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

export type DescriptorValidationResult = {
  readonly valid: boolean;
  readonly reason?: string;
};

export const VETTED_OSS_REGISTRY: Readonly<Record<VettedPackageId, VettedPackageDescriptor>> = Object.freeze({
  "cahlr-pybkt": Object.freeze({
    id: "cahlr-pybkt",
    name: "CAHLR/pyBKT",
    capability: "Bayesian Knowledge Tracing (BKT) baseline reference",
    upstreamUrl: "https://github.com/CAHLR/pyBKT",
    pinnedTag: "1.4.3",
    pinnedCommit: "06fc180ae72c117458acc527f8ec90cc8e0581c1",
    codeLicense: "permissive-mit",
    modelLicense: "not-applicable",
    modelLicenseNotes: "pyBKT is an algorithmic fitting library without external pretrained model weights.",
    runtime: "Python / C++ (NumPy, SciPy, Pandas, scikit-learn)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 100, diskMb: 50, gpuRequired: false }),
    footprintNotes: "Footprint represents Python runtime with NumPy/SciPy; TS forward step requires negligible memory (<1MB).",
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
    pinnedTag: "v20250625",
    pinnedCommit: "31243bad24cc746f07d4c8bfdd2d974872cb1803",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    modelLicenseNotes: "OpenAI Whisper model checkpoints (tiny, base, small, medium, large-v3) are released under MIT.",
    runtime: "Python / PyTorch (>=1.10, ffmpeg, tiktoken)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 1500, gpuRequired: true }),
    footprintNotes: "Resource footprint varies heavily by model size: tiny requires ~1GB RAM/75MB disk; large-v3 requires ~6GB RAM/3GB disk.",
    latencyProfile: "1.5-5.0s per utterance CPU, 150-400ms GPU",
    latencyNotes: "Latency depends on utterance length and GPU acceleration availability.",
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
    pinnedCommit: "65882eee9f5cdbeeb2d877f1131d48cf241b327d",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    modelLicenseNotes: "CTranslate2 converted Whisper weights preserve MIT license terms.",
    runtime: "CTranslate2 / C++ / Python (onnxruntime, tokenizers)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 600, diskMb: 240, gpuRequired: false }),
    footprintNotes: "Footprint measured using int8 quantized base.en model.",
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
    pinnedCommit: "be95df9152c0d7618fa1edfeb296fc3dae32376f",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    modelLicenseNotes: "Silero VAD ONNX model weights are distributed under MIT license alongside source code.",
    runtime: "ONNX Runtime (pure JS/TS onnxruntime-node/web) or Python",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 30, diskMb: 5, gpuRequired: false }),
    footprintNotes: "Lightweight ONNX model (<5MB disk, ~30MB memory buffer).",
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
    pinnedCommit: "d2dc283bd79667e086b1f93050a1855349f63f1f",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    modelLicenseNotes: "MFA code is MIT; acoustic models and pronunciation dictionaries may vary based on upstream training corpus.",
    runtime: "Python 3.10+ / Kaldi (C++) / OpenFST / Pynini",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 3000, diskMb: 2500, gpuRequired: false }),
    footprintNotes: "Requires Kaldi acoustic models and language model dictionaries on disk.",
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
    pinnedCommit: "093c105d405d5ca1537663f516fd587485201420",
    codeLicense: "permissive-apache2",
    modelLicense: "permissive-apache2",
    modelLicenseNotes: "SpeechBrain codebase is Apache-2.0; individual pretrained checkpoints on Hugging Face require per-model card license checks.",
    runtime: "Python / PyTorch (>=2.0, torchaudio, huggingface_hub)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 4000, diskMb: 2500, gpuRequired: true }),
    footprintNotes: "Speech embedding extraction with wav2vec2 or ECAPA-TDNN requires significant GPU VRAM.",
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
    pinnedCommit: "f13e71a7fe85a122290826fd691d267d64e97c33",
    codeLicense: "copyleft-lgpl",
    modelLicense: "copyleft-lgpl",
    modelLicenseNotes: "Rule definitions and morphological dictionaries are licensed under LGPL-2.1-or-later. Optional ngram data is separate.",
    runtime: "Java 17/21 (OpenJDK, Lucene, Morfologik)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 500, gpuRequired: false }),
    footprintNotes: "Embedded JVM process requires ~1.5-2GB heap for full English dictionary rules.",
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
    pinnedCommit: "1f4bfdd2bff400969444cf9f290d402448c9d6d5",
    codeLicense: "permissive-apache2",
    modelLicense: "permissive-apache2",
    modelLicenseNotes: "Stanza codebase is Apache-2.0; language models trained on Universal Dependencies are released for research and commercial use.",
    runtime: "Python / PyTorch (>=1.13, NumPy, protobuf)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 2048, diskMb: 1000, gpuRequired: false }),
    footprintNotes: "Standard English pipeline requires ~1GB disk for tokenizer, POS, and dependency parser models.",
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
    pinnedTag: "release-v3.8.9",
    pinnedCommit: "305ffd5560e8b94477294b6515ed07f7edf3c4fc",
    codeLicense: "permissive-mit",
    modelLicense: "permissive-mit",
    modelLicenseNotes: "spaCy core package and standard pipelines (en_core_web_sm, en_core_web_md) are released under MIT.",
    runtime: "Python / Cython / C (Thinc, Blis, Murmurhash)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 250, diskMb: 50, gpuRequired: false }),
    footprintNotes: "en_core_web_sm package requires ~15MB disk and ~150MB memory.",
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
    pinnedCommit: "2f4c83d8defb9176e81cc399d49f3a7cd63fad14",
    codeLicense: "permissive-bsd",
    modelLicense: "permissive-bsd",
    modelLicenseNotes: "CMUdict lexical data is released under BSD-2-Clause / public domain terms.",
    runtime: "Plain text / TypeScript hash trie (Zero runtime dependencies)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 16, diskMb: 4, gpuRequired: false }),
    footprintNotes: "In-memory compact prefix trie for ~134,000 words requires ~16MB RAM.",
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
    pinnedCommit: "f3b886731cc7e12b1ba0392857304657ef3a66bd",
    codeLicense: "copyleft-gpl",
    modelLicense: "copyleft-gpl",
    modelLicenseNotes: "GPL-3.0-or-later; strict viral copyleft terms.",
    runtime: "Python / espeak-ng C library",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 80, diskMb: 50, gpuRequired: false }),
    footprintNotes: "Requires espeak-ng binary and data files.",
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
    pinnedCommit: "bfc0a1960dfde4b4627ae4f4c8757b9211314963",
    codeLicense: "permissive-mit",
    modelLicense: "not-applicable",
    modelLicenseNotes: "Pure TypeScript mathematical scheduling library; no external model weights.",
    runtime: "Pure TypeScript (Zero dependencies)",
    offlineSelfHostable: true,
    footprint: Object.freeze({ ramMb: 1, diskMb: 1, gpuRequired: false }),
    footprintNotes: "Zero external dependencies, pure mathematical formula execution.",
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

const HEX_40_REGEX = /^[0-9a-f]{40}$/i;

export function validateVettedPackageDescriptor(descriptor: unknown): DescriptorValidationResult {
  if (typeof descriptor !== "object" || descriptor === null) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor must be a non-null object",
    });
  }

  const d = descriptor as Record<string, unknown>;

  if (typeof d.id !== "string" || !VETTED_PACKAGE_IDS.includes(d.id as VettedPackageId)) {
    return Object.freeze({
      valid: false,
      reason: `Invalid or unapproved package id: '${String(d.id)}'`,
    });
  }

  if (typeof d.name !== "string" || !d.name.trim() || d.name.trim().length < 2) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor name must be a non-empty string",
    });
  }

  if (typeof d.capability !== "string" || !d.capability.trim() || d.capability.trim().length < 10) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor capability must be a meaningful description of at least 10 characters",
    });
  }

  if (
    typeof d.upstreamUrl !== "string" ||
    (!d.upstreamUrl.startsWith("https://github.com/") && !d.upstreamUrl.startsWith("https://"))
  ) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor upstreamUrl must be a valid HTTPS URL (e.g. https://github.com/...)",
    });
  }

  if (typeof d.pinnedTag !== "string" || !d.pinnedTag.trim()) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor pinnedTag must be a non-empty string",
    });
  }

  if (typeof d.pinnedCommit !== "string" || !HEX_40_REGEX.test(d.pinnedCommit.trim())) {
    return Object.freeze({
      valid: false,
      reason: "pinnedCommit must be a valid 40-character hexadecimal git commit SHA",
    });
  }

  if (typeof d.codeLicense !== "string" || !LICENSE_CLASSIFICATIONS.includes(d.codeLicense as LicenseClassification)) {
    return Object.freeze({
      valid: false,
      reason: `Invalid codeLicense classification: '${String(d.codeLicense)}'`,
    });
  }

  if (
    typeof d.modelLicense !== "string" ||
    (d.modelLicense !== "not-applicable" && !LICENSE_CLASSIFICATIONS.includes(d.modelLicense as LicenseClassification))
  ) {
    return Object.freeze({
      valid: false,
      reason: `Invalid modelLicense classification: '${String(d.modelLicense)}'`,
    });
  }

  if (typeof d.runtime !== "string" || !d.runtime.trim() || d.runtime.trim().length < 3) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor runtime must specify execution environment",
    });
  }

  if (typeof d.offlineSelfHostable !== "boolean") {
    return Object.freeze({
      valid: false,
      reason: "Descriptor offlineSelfHostable must be a boolean",
    });
  }

  if (
    typeof d.footprint !== "object" ||
    d.footprint === null ||
    typeof (d.footprint as PackageResourceFootprint).ramMb !== "number" ||
    (d.footprint as PackageResourceFootprint).ramMb <= 0 ||
    typeof (d.footprint as PackageResourceFootprint).diskMb !== "number" ||
    (d.footprint as PackageResourceFootprint).diskMb <= 0 ||
    typeof (d.footprint as PackageResourceFootprint).gpuRequired !== "boolean"
  ) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor footprint must define positive ramMb, diskMb, and boolean gpuRequired",
    });
  }

  if (typeof d.integrationMode !== "string" || !INTEGRATION_MODES.includes(d.integrationMode as IntegrationMode)) {
    return Object.freeze({
      valid: false,
      reason: `Invalid integrationMode: '${String(d.integrationMode)}'`,
    });
  }

  if (typeof d.attributionNotice !== "string" || !d.attributionNotice.trim() || d.attributionNotice.trim().length < 5) {
    return Object.freeze({
      valid: false,
      reason: "Descriptor attributionNotice must be provided for legal compliance",
    });
  }

  return Object.freeze({ valid: true });
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

  if (mode === "rejected") {
    return Object.freeze({
      valid: true,
      reason: "Rejected package correctly excluded from production paths",
      copyleftIsolated: true,
    });
  }

  // GPL copyleft checks
  if (codeLicense === "copyleft-gpl") {
    if (mode === "direct-library") {
      return Object.freeze({
        valid: false,
        reason: "Direct linking of GPL-3.0 copyleft code into Core TypeScript is forbidden",
        copyleftIsolated: false,
      });
    }
    if (mode === "source-adaptation") {
      return Object.freeze({
        valid: false,
        reason: "Adapting GPL-3.0 copyleft code into Core TypeScript repository is forbidden",
        copyleftIsolated: false,
      });
    }
  }

  if (modelLicense === "copyleft-gpl") {
    if (mode === "direct-library") {
      return Object.freeze({
        valid: false,
        reason: "Direct bundling of GPL-3.0 model/data into Core TypeScript distribution is forbidden",
        copyleftIsolated: false,
      });
    }
    if (mode === "source-adaptation") {
      return Object.freeze({
        valid: false,
        reason: "Direct adaptation of GPL-3.0 data into Core TypeScript repository is forbidden",
        copyleftIsolated: false,
      });
    }
  }

  // LGPL copyleft checks
  if (codeLicense === "copyleft-lgpl") {
    if (mode === "direct-library") {
      return Object.freeze({
        valid: false,
        reason: "Direct bundling of LGPL code into Core TypeScript distribution is forbidden; must use isolated-service",
        copyleftIsolated: false,
      });
    }
    if (mode === "source-adaptation") {
      return Object.freeze({
        valid: false,
        reason: "Adapting LGPL code into Core TypeScript source files violates copyleft",
        copyleftIsolated: false,
      });
    }
  }

  if (modelLicense === "copyleft-lgpl") {
    if (mode === "direct-library") {
      return Object.freeze({
        valid: false,
        reason: "Direct bundling of LGPL model/data into Core TypeScript distribution is forbidden; must use isolated-service",
        copyleftIsolated: false,
      });
    }
  }

  // Isolated service boundary check for LGPL
  if ((codeLicense === "copyleft-lgpl" || modelLicense === "copyleft-lgpl") && mode === "isolated-service") {
    return Object.freeze({
      valid: true,
      copyleftIsolated: true,
    });
  }

  // Independent permissive license evaluation
  if (isPermissiveLicense(codeLicense)) {
    // Permissive code NEVER auto-approves incompatible model/data license!
    if (modelLicense === "copyleft-gpl" && (mode === "direct-library" || mode === "source-adaptation")) {
      return Object.freeze({
        valid: false,
        reason: "Permissive code cannot auto-approve copyleft-gpl model/data under direct library linking",
        copyleftIsolated: false,
      });
    }
    if (modelLicense === "copyleft-lgpl" && mode === "direct-library") {
      return Object.freeze({
        valid: false,
        reason: "Permissive code cannot auto-approve copyleft-lgpl model/data under direct library linking",
        copyleftIsolated: false,
      });
    }
    if (
      modelLicense === "not-applicable" ||
      isPermissiveLicense(modelLicense) ||
      (modelLicense === "copyleft-lgpl" && mode === "isolated-service") ||
      mode === "baseline-donor"
    ) {
      return Object.freeze({
        valid: true,
        copyleftIsolated: true,
      });
    }
  }

  return Object.freeze({
    valid: false,
    reason: `Incompatible license configuration: code=${codeLicense}, model=${modelLicense} under mode=${mode}`,
    copyleftIsolated: false,
  });
}

export function evaluateReuseDecision(descriptor: VettedPackageDescriptor): ReuseDecision {
  const descriptorValidation = validateVettedPackageDescriptor(descriptor);
  if (!descriptorValidation.valid) {
    return Object.freeze({
      packageId: descriptor.id ?? "unknown",
      status: "rejected",
      decisionTier: 5,
      mode: "rejected",
      justification: `Descriptor validation failed: ${descriptorValidation.reason}`,
    });
  }

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

export const FORBIDDEN_OBSERVATION_FIELDS = [
  "authority",
  "mastery",
  "calibration",
  "calibrationGrant",
  "durableAuthority",
  "canAffectDurableAssessment",
  "canBecomeMasteryCandidate",
  "certified",
  "validationState",
] as const;

export type CreateVettedCoreObservationOptions<TPayload extends DiagnosticPayload = DiagnosticPayload> = {
  readonly observationId?: string;
  readonly targetId: string;
  readonly activity: CommunicationActivity;
  readonly payload: TPayload;
  readonly confidence?: number | null;
  readonly evaluator: string;
  readonly evaluatorKind?: "model" | "deterministic" | "hybrid";
  readonly construct: string;
  readonly populationTags?: readonly string[];
  readonly occurredAt: string;
  readonly contextId?: string | null;
  readonly modelFingerprint?: string;
};

/**
 * Nếp-owned constructor that safely wraps validated adapter payloads into canonical CoreObservation
 * envelopes with explicit unvalidated shadow calibration and authority: "none".
 *
 * Fails closed immediately if caller or payload attempts to inject authority, mastery, or calibration fields.
 */
export function createVettedCoreObservation<TPayload extends DiagnosticPayload = DiagnosticPayload>(
  options: CreateVettedCoreObservationOptions<TPayload>
): CoreObservation<TPayload> {
  // 1. Strict timestamp validation (No ambient clock)
  if (!options.occurredAt || typeof options.occurredAt !== "string" || Number.isNaN(Date.parse(options.occurredAt))) {
    throw new Error("createVettedCoreObservation: Valid occurredAt ISO timestamp string is required");
  }

  // 2. Strict string fields validation
  if (!options.targetId || typeof options.targetId !== "string" || !options.targetId.trim()) {
    throw new Error("createVettedCoreObservation: targetId must be a non-empty string");
  }
  if (!options.evaluator || typeof options.evaluator !== "string" || !options.evaluator.trim()) {
    throw new Error("createVettedCoreObservation: evaluator must be a non-empty string");
  }
  if (!options.construct || typeof options.construct !== "string" || !options.construct.trim()) {
    throw new Error("createVettedCoreObservation: construct must be a non-empty string");
  }

  // 3. Fail-closed anti-injection check: scan payload and options for forbidden authority/mastery fields
  if (typeof options.payload !== "object" || options.payload === null) {
    throw new Error("createVettedCoreObservation: payload must be a valid non-null object");
  }

  const payloadRecord = options.payload as Record<string, unknown>;
  const optionsRecord = options as Record<string, unknown>;

  for (const forbiddenKey of FORBIDDEN_OBSERVATION_FIELDS) {
    if (forbiddenKey in payloadRecord) {
      throw new Error(
        `createVettedCoreObservation: Forbidden authority/mastery field injected in payload: '${forbiddenKey}'`
      );
    }
    if (forbiddenKey in optionsRecord) {
      throw new Error(
        `createVettedCoreObservation: Forbidden authority/mastery field injected in options: '${forbiddenKey}'`
      );
    }
  }

  // 4. Construct canonical CoreObservation envelope with explicit unvalidated shadow calibration and authority: "none"
  const observationId =
    options.observationId ??
    `obs_${options.evaluator.replace(/[^a-zA-Z0-9-]/g, "_")}_${options.targetId}_${Date.parse(options.occurredAt)}`;

  const observation: CoreObservation<TPayload> = {
    observationId,
    targetId: options.targetId,
    activity: options.activity,
    payload: Object.freeze({ ...(options.payload as object) }) as TPayload,
    confidence: normalizeObservationConfidence(options.confidence),
    authority: "none",
    calibration: {
      validationState: "unvalidated",
      decision: "shadow",
      benchmarkId: null,
      modelFingerprint: options.modelFingerprint ?? `${options.evaluator}:uncalibrated`,
      scope: {
        activity: options.activity,
        construct: options.construct,
        requiredPopulationTags: [...(options.populationTags ?? [])],
      },
      metrics: {
        sampleSize: 0,
      },
    },
    provenance: {
      evaluator: options.evaluator,
      evaluatorKind: options.evaluatorKind ?? "model",
    },
    context: {
      populationTags: [...(options.populationTags ?? [])],
      construct: options.construct,
    },
    contextId: options.contextId ?? null,
    createdAt: options.occurredAt,
  };

  return Object.freeze(observation);
}

