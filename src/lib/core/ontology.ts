import { COMMUNICATION_ACTIVITIES, SKILL_NODE_KINDS } from "./domain";
import type { CommunicationActivity, SkillNodeKind } from "./domain";
import { CORE_EVIDENCE_ROLES } from "./evidence-role";
import type { CoreEvidenceRole } from "./evidence-role";

export const ONTOLOGY_CONTRACT_ID = "nep.english-ontology.v1" as const;
export const ONTOLOGY_NODE_ID_PATTERN = /^nep\.en\.v1\.(language-system|communication-activity)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LANGUAGE_SYSTEM_FAMILIES = [
  "phonetics-phonology",
  "orthography",
  "morphology",
  "lexis-phraseology",
  "syntax-grammar",
  "semantics",
  "pragmatics-sociolinguistics",
  "discourse-genre",
  "processing-strategic-competence",
] as const;
export type LanguageSystemFamily = (typeof LANGUAGE_SYSTEM_FAMILIES)[number];

export const ONTOLOGY_GRANULARITIES = [
  "feature",
  "phone",
  "syllable",
  "word-form",
  "phrase",
  "construction",
  "sentence-turn",
  "discourse-move",
  "task-capability",
  "domain-capability",
] as const;
export type OntologyGranularity = (typeof ONTOLOGY_GRANULARITIES)[number];

export const ONTOLOGY_MODALITIES = [
  "text-input",
  "text-output",
  "audio-input",
  "speech-output",
  "audiovisual-input",
  "live-interaction",
  "multimodal",
] as const;
export type OntologyModality = (typeof ONTOLOGY_MODALITIES)[number];

export const ONTOLOGY_RELATION_TYPES = [
  "prerequisite-of",
  "component-of",
  "enables",
  "contrasts-with",
  "confusable-with",
  "variant-of",
  "register-variant-of",
  "realization-of",
  "requires-context",
  "transfers-to",
  "remediated-by",
  "assessed-by",
] as const;
export type OntologyRelationType = (typeof ONTOLOGY_RELATION_TYPES)[number];

export const SYMMETRIC_ONTOLOGY_RELATION_TYPES = ["contrasts-with", "confusable-with"] as const;
export const ACYCLIC_ONTOLOGY_RELATION_TYPES = [
  "prerequisite-of",
  "component-of",
  "enables",
] as const;

export type OntologyTaskConstraint = {
  readonly taskType: string;
  readonly supportLevel?: "none" | "limited" | "guided";
};

export type OntologyContextConstraint = {
  readonly dimension: "audience" | "channel" | "domain" | "register" | "setting";
  readonly value: string;
};

export type OntologySourceRef = {
  readonly sourceId: string;
  readonly version: string;
  readonly locator?: string;
};

type OntologyNodeBase = {
  readonly id: string;
  readonly contractVersion: 1;
  readonly label: string;
  readonly definition: string;
  readonly kind: SkillNodeKind;
  readonly granularity: OntologyGranularity;
  readonly modalities: readonly OntologyModality[];
  readonly taskConstraints: readonly OntologyTaskConstraint[];
  readonly contextConstraints: readonly OntologyContextConstraint[];
  /** Compatibility only: this never records an observation or certifies learner state. */
  readonly allowedEvidenceRoles: readonly CoreEvidenceRole[];
  readonly sources: readonly OntologySourceRef[];
};

export type LanguageSystemOntologyNode = OntologyNodeBase & {
  readonly domain: "language-system";
  readonly family: LanguageSystemFamily;
};

export type CommunicationActivityOntologyNode = OntologyNodeBase & {
  readonly domain: "communication-activity";
  readonly activity: CommunicationActivity;
};

export type OntologyNode = LanguageSystemOntologyNode | CommunicationActivityOntologyNode;

export type OntologyRelation = {
  readonly from: string;
  readonly to: string;
  readonly type: OntologyRelationType;
  readonly contextTags?: readonly string[];
};

export type LicenseClassification = "open" | "copyrighted-reference" | "proprietary";
export type PermittedExternalUse = "reference-only" | "research" | "redistribution" | "production";

export type ExternalProvenance = {
  readonly sourceId: string;
  readonly version: string;
  readonly locator: string;
  readonly license: {
    readonly classification: LicenseClassification;
    readonly permittedUse: PermittedExternalUse;
  };
};

export type FrameworkCrosswalk = {
  readonly id: string;
  readonly nodeId: string;
  readonly frameworkId: string;
  readonly frameworkVersion: string;
  readonly externalTargetId: string;
  readonly mapping: "exact" | "close" | "broad" | "narrow" | "related";
  readonly provenance: ExternalProvenance;
};

export type LearnerHypothesisOverlay = {
  readonly id: string;
  readonly nodeId: string;
  readonly populationTag: string;
  readonly hypothesis: string;
  readonly reviewStatus: "unreviewed" | "reviewed-reference";
  readonly provenance: ExternalProvenance;
};

export type OntologyGraphInput = {
  readonly nodes: readonly OntologyNode[];
  readonly relations?: readonly OntologyRelation[];
  readonly crosswalks?: readonly FrameworkCrosswalk[];
  readonly overlays?: readonly LearnerHypothesisOverlay[];
};

export type OntologyGraph = {
  readonly contractId: typeof ONTOLOGY_CONTRACT_ID;
  readonly nodes: readonly Readonly<OntologyNode>[];
  readonly relations: readonly Readonly<OntologyRelation>[];
  readonly crosswalks: readonly Readonly<FrameworkCrosswalk>[];
  readonly overlays: readonly Readonly<LearnerHypothesisOverlay>[];
};

export type OntologyProblemCode =
  | "dependency-cycle"
  | "duplicate-crosswalk"
  | "duplicate-node"
  | "duplicate-overlay"
  | "duplicate-relation"
  | "forbidden-authority-field"
  | "invalid-activity"
  | "invalid-compatibility"
  | "invalid-family"
  | "invalid-id"
  | "invalid-node"
  | "invalid-provenance"
  | "invalid-relation"
  | "missing-node"
  | "self-relation";

export type OntologyProblem = {
  readonly code: OntologyProblemCode;
  readonly subject: string;
  readonly detail: string;
};

export type OntologyBuildResult =
  | { readonly ok: true; readonly graph: OntologyGraph }
  | { readonly ok: false; readonly problems: readonly OntologyProblem[] };

const INPUT_MODALITIES = new Set<OntologyModality>([
  "text-input",
  "audio-input",
  "audiovisual-input",
  "live-interaction",
  "multimodal",
]);
const OUTPUT_MODALITIES = new Set<OntologyModality>([
  "text-output",
  "speech-output",
  "live-interaction",
  "multimodal",
]);
const RECEPTIVE_EVIDENCE = new Set<CoreEvidenceRole>([
  "receptive-discrimination",
  "meaning-recognition",
]);
const PRODUCTIVE_EVIDENCE = new Set<CoreEvidenceRole>([
  "controlled-production",
  "free-production",
  "interactional-repair",
  "near-transfer",
  "far-transfer",
]);
const FORBIDDEN_AUTHORITY_FIELDS = new Set([
  "authority",
  "authorityGrant",
  "calibration",
  "evidence",
  "mastery",
  "observation",
  "promotion",
  "replacementNode",
]);
const CROSSWALK_KEYS = new Set([
  "id",
  "nodeId",
  "frameworkId",
  "frameworkVersion",
  "externalTargetId",
  "mapping",
  "provenance",
]);
const OVERLAY_KEYS = new Set([
  "id",
  "nodeId",
  "populationTag",
  "hypothesis",
  "reviewStatus",
  "provenance",
]);

export function buildOntologyGraph(input: OntologyGraphInput): OntologyBuildResult {
  const problems: OntologyProblem[] = [];
  const nodeIds = validateNodes(input.nodes, problems);
  const relations = normalizeRelations(input.relations ?? [], nodeIds, problems);
  validateDependencyCycles(relations, nodeIds, problems);
  validateExternalRecords(input.crosswalks ?? [], "crosswalk", nodeIds, problems);
  validateExternalRecords(input.overlays ?? [], "overlay", nodeIds, problems);

  if (problems.length > 0) {
    return { ok: false, problems: Object.freeze(problems.sort(compareProblems)) };
  }

  const graph: OntologyGraph = {
    contractId: ONTOLOGY_CONTRACT_ID,
    nodes: Object.freeze([...input.nodes].sort((a, b) => a.id.localeCompare(b.id)).map(freezeNode)),
    relations: Object.freeze(relations.map(freezeRelation)),
    crosswalks: Object.freeze(
      [...(input.crosswalks ?? [])].sort((a, b) => a.id.localeCompare(b.id)).map(freezeExternal),
    ),
    overlays: Object.freeze(
      [...(input.overlays ?? [])].sort((a, b) => a.id.localeCompare(b.id)).map(freezeExternal),
    ),
  };

  return { ok: true, graph: Object.freeze(graph) };
}

function validateNodes(nodes: readonly OntologyNode[], problems: OntologyProblem[]): Set<string> {
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id)) addProblem(problems, "duplicate-node", node.id, "Node ID occurs more than once");
    ids.add(node.id);
    if (!ONTOLOGY_NODE_ID_PATTERN.test(node.id)) {
      addProblem(problems, "invalid-id", node.id, "Node ID must use the nep.en.v1 namespace");
    }
    for (const key of Object.keys(node)) {
      if (FORBIDDEN_AUTHORITY_FIELDS.has(key)) {
        addProblem(problems, "forbidden-authority-field", node.id, key);
      }
    }
    if (
      node.contractVersion !== 1 ||
      !node.label.trim() ||
      !node.definition.trim() ||
      !SKILL_NODE_KINDS.includes(node.kind) ||
      !ONTOLOGY_GRANULARITIES.includes(node.granularity)
    ) {
      addProblem(
        problems,
        "invalid-node",
        node.id,
        "Version, label, definition, kind, or granularity is invalid",
      );
    }
    if (node.domain === "language-system" && !LANGUAGE_SYSTEM_FAMILIES.includes(node.family)) {
      addProblem(problems, "invalid-family", node.id, `Unknown family: ${String(node.family)}`);
    }
    if (
      node.domain === "communication-activity" &&
      !COMMUNICATION_ACTIVITIES.includes(node.activity)
    ) {
      addProblem(problems, "invalid-activity", node.id, `Unknown activity: ${String(node.activity)}`);
    }
    validateCompatibility(node, problems);
  }
  return ids;
}

function validateCompatibility(node: OntologyNode, problems: OntologyProblem[]): void {
  if (node.modalities.length === 0 || node.allowedEvidenceRoles.length === 0) {
    addProblem(problems, "invalid-compatibility", node.id, "Modalities and evidence roles must be non-empty");
    return;
  }
  if (!node.modalities.every((value) => ONTOLOGY_MODALITIES.includes(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Unknown modality");
  }
  if (!node.allowedEvidenceRoles.every((value) => CORE_EVIDENCE_ROLES.includes(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Unknown evidence role");
  }
  if (node.contextConstraints.some((constraint) => constraint.value.trim().length === 0)) {
    addProblem(problems, "invalid-compatibility", node.id, "Context constraint values must be non-empty");
  }
  if (node.kind === "perception" && !node.modalities.some((value) => INPUT_MODALITIES.has(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Perception requires an input modality");
  }
  if (node.kind === "perception" && !node.allowedEvidenceRoles.some((value) => RECEPTIVE_EVIDENCE.has(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Perception requires a receptive evidence role");
  }
  if (node.kind === "production" && !node.modalities.some((value) => OUTPUT_MODALITIES.has(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Production requires an output modality");
  }
  if (node.kind === "production" && !node.allowedEvidenceRoles.some((value) => PRODUCTIVE_EVIDENCE.has(value))) {
    addProblem(problems, "invalid-compatibility", node.id, "Production requires a productive evidence role");
  }
  if (node.kind === "interaction" && !node.modalities.some((value) => value === "live-interaction" || value === "multimodal")) {
    addProblem(problems, "invalid-compatibility", node.id, "Interaction requires an interaction modality");
  }
}

function normalizeRelations(
  relations: readonly OntologyRelation[],
  nodeIds: ReadonlySet<string>,
  problems: OntologyProblem[],
): OntologyRelation[] {
  const normalized: OntologyRelation[] = [];
  const keys = new Set<string>();
  for (const relation of relations) {
    if (!ONTOLOGY_RELATION_TYPES.includes(relation.type)) {
      addProblem(
        problems,
        "invalid-relation",
        `${relation.from}->${relation.to}`,
        String(relation.type),
      );
      continue;
    }
    let from = relation.from;
    let to = relation.to;
    if ((SYMMETRIC_ONTOLOGY_RELATION_TYPES as readonly OntologyRelationType[]).includes(relation.type) && from.localeCompare(to) > 0) {
      [from, to] = [to, from];
    }
    if (from === to) addProblem(problems, "self-relation", from, relation.type);
    if (!nodeIds.has(from)) addProblem(problems, "missing-node", from, relation.type);
    if (!nodeIds.has(to)) addProblem(problems, "missing-node", to, relation.type);
    const contextTags = [...(relation.contextTags ?? [])].sort();
    const key = `${relation.type}\u0000${from}\u0000${to}\u0000${contextTags.join("\u0000")}`;
    if (keys.has(key)) addProblem(problems, "duplicate-relation", `${from}->${to}`, relation.type);
    else {
      keys.add(key);
      normalized.push({ from, to, type: relation.type, ...(contextTags.length ? { contextTags } : {}) });
    }
  }
  return normalized.sort(compareRelations);
}

function validateDependencyCycles(
  relations: readonly OntologyRelation[],
  nodeIds: ReadonlySet<string>,
  problems: OntologyProblem[],
): void {
  for (const type of ACYCLIC_ONTOLOGY_RELATION_TYPES) {
    const adjacency = new Map<string, string[]>();
    for (const relation of relations) {
      if (relation.type !== type || !nodeIds.has(relation.from) || !nodeIds.has(relation.to)) continue;
      adjacency.set(relation.from, [...(adjacency.get(relation.from) ?? []), relation.to]);
    }
    for (const targets of adjacency.values()) targets.sort();
    const visited = new Set<string>();
    const active = new Set<string>();
    const stack: string[] = [];
    const visit = (id: string): string[] | undefined => {
      if (active.has(id)) return [...stack.slice(stack.indexOf(id)), id];
      if (visited.has(id)) return undefined;
      active.add(id);
      stack.push(id);
      for (const target of adjacency.get(id) ?? []) {
        const cycle = visit(target);
        if (cycle) return cycle;
      }
      stack.pop();
      active.delete(id);
      visited.add(id);
      return undefined;
    };
    for (const id of [...nodeIds].sort()) {
      const cycle = visit(id);
      if (cycle) {
        addProblem(problems, "dependency-cycle", type, cycle.join(" -> "));
        break;
      }
    }
  }
}

function validateExternalRecords(
  records: readonly FrameworkCrosswalk[] | readonly LearnerHypothesisOverlay[],
  kind: "crosswalk" | "overlay",
  nodeIds: ReadonlySet<string>,
  problems: OntologyProblem[],
): void {
  const ids = new Set<string>();
  const allowedKeys = kind === "crosswalk" ? CROSSWALK_KEYS : OVERLAY_KEYS;
  for (const record of records) {
    if (ids.has(record.id)) addProblem(problems, kind === "crosswalk" ? "duplicate-crosswalk" : "duplicate-overlay", record.id, "ID occurs more than once");
    ids.add(record.id);
    if (!nodeIds.has(record.nodeId)) addProblem(problems, "missing-node", record.nodeId, kind);
    for (const key of Object.keys(record)) {
      if (FORBIDDEN_AUTHORITY_FIELDS.has(key) || !allowedKeys.has(key)) {
        addProblem(problems, "forbidden-authority-field", record.id, key);
      }
    }
    if (!validProvenance(record.provenance)) {
      addProblem(problems, "invalid-provenance", record.id, "Complete versioned provenance and permitted use are required");
    }
  }
}

function validProvenance(value: ExternalProvenance): boolean {
  return Boolean(
    value?.sourceId?.trim() &&
      value.version?.trim() &&
      value.locator?.trim() &&
      value.license?.classification &&
      value.license?.permittedUse,
  );
}

function freezeNode(node: OntologyNode): Readonly<OntologyNode> {
  return Object.freeze({
    ...node,
    modalities: Object.freeze([...node.modalities].sort()),
    taskConstraints: Object.freeze(
      [...node.taskConstraints].sort(compareJson).map((constraint) => Object.freeze({ ...constraint })),
    ),
    contextConstraints: Object.freeze(
      [...node.contextConstraints].sort(compareJson).map((constraint) =>
        Object.freeze({ ...constraint }),
      ),
    ),
    allowedEvidenceRoles: Object.freeze([...node.allowedEvidenceRoles].sort()),
    sources: Object.freeze(
      [...node.sources].sort(compareJson).map((source) => Object.freeze({ ...source })),
    ),
  });
}

function freezeRelation(relation: OntologyRelation): Readonly<OntologyRelation> {
  return Object.freeze({ ...relation, ...(relation.contextTags ? { contextTags: Object.freeze([...relation.contextTags]) } : {}) });
}

function freezeExternal<T extends FrameworkCrosswalk | LearnerHypothesisOverlay>(value: T): Readonly<T> {
  return Object.freeze({
    ...value,
    provenance: Object.freeze({ ...value.provenance, license: Object.freeze({ ...value.provenance.license }) }),
  }) as Readonly<T>;
}

function compareRelations(a: OntologyRelation, b: OntologyRelation): number {
  return `${a.type}\u0000${a.from}\u0000${a.to}\u0000${(a.contextTags ?? []).join("\u0000")}`.localeCompare(
    `${b.type}\u0000${b.from}\u0000${b.to}\u0000${(b.contextTags ?? []).join("\u0000")}`,
  );
}

function compareProblems(a: OntologyProblem, b: OntologyProblem): number {
  return `${a.code}\u0000${a.subject}\u0000${a.detail}`.localeCompare(`${b.code}\u0000${b.subject}\u0000${b.detail}`);
}

function compareJson(a: object, b: object): number {
  return JSON.stringify(a).localeCompare(JSON.stringify(b));
}

function addProblem(problems: OntologyProblem[], code: OntologyProblemCode, subject: string, detail: string): void {
  problems.push({ code, subject, detail });
}

export { COMMUNICATION_ACTIVITIES, CORE_EVIDENCE_ROLES, SKILL_NODE_KINDS };
export type { CommunicationActivity, CoreEvidenceRole, SkillNodeKind };
