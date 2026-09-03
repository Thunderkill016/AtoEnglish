import { describe, expect, it } from "vitest";

import { evaluateNếpAction, evaluateNếpActionResponse, feedbackForNếpEvaluation } from "../evaluator";
import { firstMeetingLessonV1 } from "../lesson-contract";

function action(kind: "comprehend" | "retrieve" | "produce" | "repair" | "retry" | "transfer") {
  return firstMeetingLessonV1.actions.find((item) => item.kind === kind)!;
}

describe("Nếp deterministic evaluator", () => {
  it("evaluates comprehension as the declared exact choice", () => {
    expect(evaluateNếpActionResponse(action("comprehend"), "name")).toBe(true);
    expect(evaluateNếpActionResponse(action("comprehend"), "country")).toBe(false);
  });

  it("emits structured comprehension errors", () => {
    expect(evaluateNếpAction(action("comprehend"), "country")).toEqual({
      success: false,
      evaluator: "nep-evaluator-v2",
      observedResponse: true,
      matchedTargetGroupIndexes: [],
      missingTargetGroupIndexes: [0],
      errorTags: ["incorrect-choice", "missing-target-group:0"],
    });
  });

  it("accepts normalized introduction variants", () => {
    expect(evaluateNếpActionResponse(action("produce"), "I'm Hoang.")).toBe(true);
    expect(evaluateNếpActionResponse(action("produce"), "I’m Hoang!")).toBe(true);
  });

  it("identifies a missing introduction separately from a missing repair move", () => {
    const repairOnly = evaluateNếpAction(
      action("transfer"),
      "Sorry, could you say that again?",
    );
    expect(repairOnly).toMatchObject({
      success: false,
      matchedTargetGroupIndexes: [0],
      missingTargetGroupIndexes: [1],
      errorTags: ["partial-target-coverage", "missing-target-group:1"],
    });
    expect(feedbackForNếpEvaluation(action("transfer"), repairOnly)).toBe(
      "Đã có repair move nhưng còn thiếu phần tự giới thiệu tên.",
    );

    const introductionOnly = evaluateNếpAction(action("transfer"), "My name is Hoang.");
    expect(introductionOnly).toMatchObject({
      success: false,
      matchedTargetGroupIndexes: [1],
      missingTargetGroupIndexes: [0],
      errorTags: ["partial-target-coverage", "missing-target-group:0"],
    });
    expect(feedbackForNếpEvaluation(action("transfer"), introductionOnly)).toBe(
      "Thiếu bước xin nhắc lại trước khi tiếp tục.",
    );
  });

  it("awards transfer only when every required signal group is present", () => {
    const result = evaluateNếpAction(
      action("transfer"),
      "Sorry, could you say that again? My name is Hoang.",
    );

    expect(result).toMatchObject({
      success: true,
      matchedTargetGroupIndexes: [0, 1],
      missingTargetGroupIndexes: [],
      errorTags: [],
    });
  });

  it("marks no response separately from a learner language error", () => {
    const result = evaluateNếpAction(action("produce"), "   ");

    expect(result).toMatchObject({
      success: false,
      observedResponse: false,
      matchedTargetGroupIndexes: [],
      missingTargetGroupIndexes: [0],
      errorTags: ["no-response", "missing-target-group:0"],
    });
    expect(feedbackForNếpEvaluation(action("produce"), result)).toContain(
      "không nên tạo oral mastery evidence",
    );
  });

  it("holds the supported retry to the same multi-demand language coverage", () => {
    expect(evaluateNếpActionResponse(action("retry"), "Could you say that again?")).toBe(false);
    expect(evaluateNếpActionResponse(action("retry"), "I'm Hoang.")).toBe(false);
    expect(evaluateNếpActionResponse(action("retry"), "Could you say that again? I'm Hoang.")).toBe(true);
  });
});
