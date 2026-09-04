import {
  COMMUNICATION_ACTIVITIES,
  LANGUAGE_SYSTEM_FAMILIES,
  buildOntologyGraph,
  type CommunicationActivity,
  type CommunicationActivityOntologyNode,
  type LanguageSystemFamily,
  type LanguageSystemOntologyNode,
  type OntologyBuildResult,
  type OntologyNode,
} from "./ontology";

const HUMAN_LABELS: Record<LanguageSystemFamily | CommunicationActivity, string> = {
  "phonetics-phonology": "Phonetics and phonology",
  orthography: "Orthography",
  morphology: "Morphology",
  "lexis-phraseology": "Lexis and phraseology",
  "syntax-grammar": "Syntax and grammar",
  semantics: "Semantics",
  "pragmatics-sociolinguistics": "Pragmatics and sociolinguistics",
  "discourse-genre": "Discourse and genre",
  "processing-strategic-competence": "Processing and strategic competence",
  "listening-reception": "Listening reception",
  "audiovisual-reception": "Audiovisual reception",
  "reading-reception": "Reading reception",
  "spoken-production": "Spoken production",
  "written-production": "Written production",
  "spoken-interaction": "Spoken interaction",
  "written-interaction": "Written interaction",
  "text-mediation": "Text mediation",
  "concept-mediation": "Concept mediation",
  "communication-mediation": "Communication mediation",
  "multimodal-interaction": "Multimodal interaction",
};

function languageSystemNode(family: LanguageSystemFamily): LanguageSystemOntologyNode {
  return {
    id: `nep.en.v1.language-system.${family}`,
    contractVersion: 1,
    domain: "language-system",
    family,
    label: HUMAN_LABELS[family],
    definition: `Top-level scope for ${HUMAN_LABELS[family].toLowerCase()} constructs.`,
    kind: family === "processing-strategic-competence" ? "strategy" : "knowledge",
    granularity: "domain-capability",
    modalities: ["multimodal"],
    taskConstraints: [],
    contextConstraints: [],
    allowedEvidenceRoles: ["meaning-recognition", "free-recall", "near-transfer"],
    sources: [],
  };
}

function activityNode(activity: CommunicationActivity): CommunicationActivityOntologyNode {
  const receptive = activity.includes("reception");
  const interaction = activity.includes("interaction");
  const spoken = activity.includes("spoken");
  const written = activity.includes("written");
  return {
    id: `nep.en.v1.communication-activity.${activity}`,
    contractVersion: 1,
    domain: "communication-activity",
    activity,
    label: HUMAN_LABELS[activity],
    definition: `Top-level scope for ${HUMAN_LABELS[activity].toLowerCase()} tasks.`,
    kind: receptive ? "perception" : interaction ? "interaction" : activity.includes("mediation") ? "mediation" : "production",
    granularity: "task-capability",
    modalities: receptive
      ? activity === "reading-reception"
        ? ["text-input"]
        : activity === "audiovisual-reception"
          ? ["audiovisual-input"]
          : ["audio-input"]
      : interaction
        ? ["live-interaction"]
        : spoken
          ? ["speech-output"]
          : written
            ? ["text-output"]
            : ["multimodal"],
    taskConstraints: [],
    contextConstraints: [],
    allowedEvidenceRoles: receptive
      ? ["receptive-discrimination", "meaning-recognition"]
      : interaction
        ? ["free-production", "interactional-repair", "near-transfer"]
        : ["controlled-production", "free-production", "near-transfer"],
    sources: [],
  };
}

export const ENGLISH_ONTOLOGY_V1_SEED_NODES: readonly OntologyNode[] = Object.freeze([
  ...LANGUAGE_SYSTEM_FAMILIES.map(languageSystemNode),
  ...COMMUNICATION_ACTIVITIES.map(activityNode),
]);

export function buildEnglishOntologyV1(): OntologyBuildResult {
  return buildOntologyGraph({ nodes: ENGLISH_ONTOLOGY_V1_SEED_NODES });
}
