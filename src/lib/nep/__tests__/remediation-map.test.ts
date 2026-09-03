import { describe, expect, it } from "vitest";

import { evaluateNếpAction } from "../evaluator";
import { firstMeetingLessonV1 } from "../lesson-contract";
import {
  plannerCandidateId,
  remediationHintsForEvaluation,
  validateNếpRemediationMap,
} from "../remediation-map.v1";

function action(id: string) {
  return firstMeetingLessonV1.actions.find((item) => item.id === id)!;
}

describe("Nếp remediation map V1", () => {
  it("passes static content QA for the first-meeting lesson", () => {
    expect(validateNếpRemediationMap(firstMeetingLessonV1)).toEqual([]);
  });

  it("routes missing repair language in transfer to the repair candidate", () => {
    const transfer = action("transfer");
    const evaluation = evaluateNếpAction(transfer, "My name is Hoang.");

    expect(remediationHintsForEvaluation({
      lesson: firstMeetingLessonV1,
      action: transfer,
      evaluation,
    })).toEqual([{
      errorTag: "missing-target-group:0",
      candidateId: plannerCandidateId(firstMeetingLessonV1.id, "repair"),
    }]);
  });

  it("routes missing introduction language in transfer to the production candidate", () => {
    const transfer = action("transfer");
    const evaluation = evaluateNếpAction(transfer, "Could you say that again?");

    expect(remediationHintsForEvaluation({
      lesson: firstMeetingLessonV1,
      action: transfer,
      evaluation,
    })).toEqual([{
      errorTag: "missing-target-group:1",
      candidateId: plannerCandidateId(firstMeetingLessonV1.id, "produce"),
    }]);
  });

  it("routes a failed production frame back to retrieval practice", () => {
    const produce = action("produce");
    const evaluation = evaluateNếpAction(produce, "hello");

    expect(remediationHintsForEvaluation({
      lesson: firstMeetingLessonV1,
      action: produce,
      evaluation,
    })).toEqual([{
      errorTag: "missing-target-group:0",
      candidateId: plannerCandidateId(firstMeetingLessonV1.id, "retrieve"),
    }]);
  });

  it("emits no remediation hint for a successful response", () => {
    const transfer = action("transfer");
    const evaluation = evaluateNếpAction(
      transfer,
      "Could you say that again? My name is Hoang.",
    );

    expect(remediationHintsForEvaluation({
      lesson: firstMeetingLessonV1,
      action: transfer,
      evaluation,
    })).toEqual([]);
  });

  it("does not route attempt-only retry through the evidence-bearing planner catalog", () => {
    const retry = action("retry");
    const evaluation = evaluateNếpAction(retry, "hello");

    expect(remediationHintsForEvaluation({
      lesson: firstMeetingLessonV1,
      action: retry,
      evaluation,
    })).toEqual([]);
  });
});
