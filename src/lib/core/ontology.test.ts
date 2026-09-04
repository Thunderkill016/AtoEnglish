import { describe, expect, it } from "vitest";

import { COMMUNICATION_ACTIVITIES as LEGACY_ACTIVITIES } from "./domain";
import { CORE_EVIDENCE_ROLES as LEGACY_EVIDENCE_ROLES } from "./evidence-role";
import {
  COMMUNICATION_ACTIVITIES,
  LANGUAGE_SYSTEM_FAMILIES,
  ONTOLOGY_CONTRACT_ID,
  buildOntologyGraph,
  type FrameworkCrosswalk,
  type LearnerHypothesisOverlay,
  type OntologyNode,
  type OntologyRelation,
} from "./ontology";
import { ENGLISH_ONTOLOGY_V1_SEED_NODES, buildEnglishOntologyV1 } from "./ontology-seed";

function node(id: string, overrides: Partial<OntologyNode> = {}): OntologyNode {
  return {
    id,
    contractVersion: 1,
    domain: "language-system",
    family: "semantics",
    label: id,
    definition: id,
    kind: "knowledge",
    granularity: "feature",
    modalities: ["multimodal"],
    taskConstraints: [],
    contextConstraints: [],
    allowedEvidenceRoles: ["meaning-recognition"],
    sources: [],
    ...overrides,
  } as OntologyNode;
}

function expectProblem(result: ReturnType<typeof buildOntologyGraph>, code: string): void {
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.problems.some((problem) => problem.code === code)).toBe(true);
}

describe("English ontology V1 seed", () => {
  it("covers exactly nine language systems and eleven independent activities", () => {
    const result = buildEnglishOntologyV1();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.contractId).toBe(ONTOLOGY_CONTRACT_ID);
    expect(result.graph.nodes).toHaveLength(20);
    expect(result.graph.nodes.filter((item) => item.domain === "language-system").map((item) => item.family)).toEqual([...LANGUAGE_SYSTEM_FAMILIES].sort());
    expect(result.graph.nodes.filter((item) => item.domain === "communication-activity").map((item) => item.activity)).toEqual([...COMMUNICATION_ACTIVITIES].sort());
  });

  it("normalizes graph output independent of insertion order and freezes the result", () => {
    const forward = buildOntologyGraph({ nodes: ENGLISH_ONTOLOGY_V1_SEED_NODES });
    const reverse = buildOntologyGraph({ nodes: [...ENGLISH_ONTOLOGY_V1_SEED_NODES].reverse() });
    expect(JSON.stringify(forward)).toBe(JSON.stringify(reverse));
    if (forward.ok) {
      expect(Object.isFrozen(forward.graph)).toBe(true);
      expect(Object.isFrozen(forward.graph.nodes)).toBe(true);
    }
  });
});

describe("fail-closed graph validation", () => {
  const a = node("nep.en.v1.language-system.a");
  const b = node("nep.en.v1.language-system.b");
  const c = node("nep.en.v1.language-system.c");

  it.each([
    ["duplicate-node", { nodes: [a, a] }],
    ["invalid-id", { nodes: [node("invalid")] }],
    ["invalid-node", { nodes: [node("nep.en.v1.language-system.invalid", { label: "" })] }],
    ["missing-node", { nodes: [a], relations: [{ from: a.id, to: b.id, type: "enables" }] }],
    ["self-relation", { nodes: [a], relations: [{ from: a.id, to: a.id, type: "enables" }] }],
  ] as const)("rejects %s", (code, input) => expectProblem(buildOntologyGraph(input), code));

  it.each(["prerequisite-of", "component-of", "enables"] as const)("rejects direct and multi-node %s cycles", (type) => {
    expectProblem(buildOntologyGraph({ nodes: [a, b], relations: [{ from: a.id, to: b.id, type }, { from: b.id, to: a.id, type }] }), "dependency-cycle");
    expectProblem(buildOntologyGraph({ nodes: [a, b, c], relations: [{ from: a.id, to: b.id, type }, { from: b.id, to: c.id, type }, { from: c.id, to: a.id, type }] }), "dependency-cycle");
  });

  it("canonicalizes symmetric relations once and rejects reverse duplicates", () => {
    const relation: OntologyRelation = { from: b.id, to: a.id, type: "confusable-with" };
    const single = buildOntologyGraph({ nodes: [a, b], relations: [relation] });
    expect(single.ok && single.graph.relations).toEqual([{ from: a.id, to: b.id, type: "confusable-with" }]);
    expectProblem(buildOntologyGraph({ nodes: [a, b], relations: [relation, { ...relation, from: a.id, to: b.id }] }), "duplicate-relation");
  });

  it("keeps transfer directional and does not infer its reverse", () => {
    const result = buildOntologyGraph({ nodes: [a, b], relations: [{ from: b.id, to: a.id, type: "transfers-to" }] });
    expect(result.ok && result.graph.relations).toEqual([{ from: b.id, to: a.id, type: "transfers-to" }]);
  });

  it("sorts failures independent of input order", () => {
    const relations: OntologyRelation[] = [{ from: "missing-z", to: a.id, type: "enables" }, { from: "missing-a", to: a.id, type: "component-of" }];
    expect(JSON.stringify(buildOntologyGraph({ nodes: [a], relations }))).toBe(JSON.stringify(buildOntologyGraph({ nodes: [a], relations: [...relations].reverse() })));
  });

  it("rejects invalid modality, context, and evidence-role combinations", () => {
    expectProblem(buildOntologyGraph({ nodes: [node(a.id, { kind: "production", modalities: ["audio-input"], allowedEvidenceRoles: ["meaning-recognition"] })] }), "invalid-compatibility");
    expectProblem(buildOntologyGraph({ nodes: [node(a.id, { contextConstraints: [{ dimension: "register", value: "" }] })] }), "invalid-compatibility");
    expectProblem(buildOntologyGraph({ nodes: [node(a.id, { allowedEvidenceRoles: [] })] }), "invalid-compatibility");
  });
});

describe("non-authoritative overlays", () => {
  const canonical = node("nep.en.v1.language-system.semantics");
  const provenance = { sourceId: "coe.cefr", version: "2020", locator: "companion-volume", license: { classification: "copyrighted-reference" as const, permittedUse: "reference-only" as const } };

  it("accepts provenance-aware crosswalks and population hypotheses without mutating nodes", () => {
    const crosswalk: FrameworkCrosswalk = { id: "cw.cefr.semantics", nodeId: canonical.id, frameworkId: "cefr", frameworkVersion: "2020", externalTargetId: "external-ref", mapping: "related", provenance };
    const overlay: LearnerHypothesisOverlay = { id: "overlay.vi.semantics", nodeId: canonical.id, populationTag: "vi-L1", hypothesis: "Candidate transfer risk for validation", reviewStatus: "unreviewed", provenance };
    const result = buildOntologyGraph({ nodes: [canonical], crosswalks: [crosswalk], overlays: [overlay] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.graph.nodes[0]).toEqual(canonical);
  });

  it.each(["authority", "calibration", "evidence", "mastery", "observation", "replacementNode"])("rejects injected %s fields", (field) => {
    const injected = { id: `cw.${field}`, nodeId: canonical.id, frameworkId: "x", frameworkVersion: "1", externalTargetId: "x", mapping: "related", provenance, [field]: true } as unknown as FrameworkCrosswalk;
    expectProblem(buildOntologyGraph({ nodes: [canonical], crosswalks: [injected] }), "forbidden-authority-field");
  });

  it("rejects authority metadata injected into a canonical node", () => {
    const injected = { ...canonical, promotion: { status: "certified" } } as unknown as OntologyNode;
    expectProblem(buildOntologyGraph({ nodes: [injected] }), "forbidden-authority-field");
  });

  it("rejects incomplete provenance", () => {
    const overlay = { id: "overlay.invalid", nodeId: canonical.id, populationTag: "vi-L1", hypothesis: "x", reviewStatus: "unreviewed", provenance: { ...provenance, version: "" } } as LearnerHypothesisOverlay;
    expectProblem(buildOntologyGraph({ nodes: [canonical], overlays: [overlay] }), "invalid-provenance");
  });

  it("does not alter legacy evidence or activity contracts", () => {
    expect(COMMUNICATION_ACTIVITIES).toEqual(LEGACY_ACTIVITIES);
    expect(LEGACY_EVIDENCE_ROLES).toContain("near-transfer");
  });
});
