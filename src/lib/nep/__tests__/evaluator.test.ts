import { describe, expect, it } from "vitest";

import { evaluateNếpActionResponse } from "../evaluator";
import { firstMeetingLessonV1 } from "../lesson-contract";

function action(kind: "comprehend" | "retrieve" | "produce" | "repair" | "retry" | "transfer") {
  return firstMeetingLessonV1.actions.find((item) => item.kind === kind)!;
}

describe("Nếp deterministic evaluator", () => {
  it("evaluates comprehension as the declared exact choice", () => {
    expect(evaluateNếpActionResponse(action("comprehend"), "name")).toBe(true);
    expect(evaluateNếpActionResponse(action("comprehend"), "country")).toBe(false);
  });

  it("accepts normalized introduction variants", () => {
    expect(evaluateNếpActionResponse(action("produce"), "I'm Hoang.")).toBe(true);
    expect(evaluateNếpActionResponse(action("produce"), "I’m Hoang!")).toBe(true);
  });

  it("does not award transfer for the repair move alone", () => {
    expect(evaluateNếpActionResponse(action("transfer"), "Sorry, could you say that again?")).toBe(false);
  });

  it("does not award transfer for self-introduction alone", () => {
    expect(evaluateNếpActionResponse(action("transfer"), "My name is Hoang.")).toBe(false);
  });

  it("awards transfer only when every required signal group is present", () => {
    expect(
      evaluateNếpActionResponse(
        action("transfer"),
        "Sorry, could you say that again? My name is Hoang.",
      ),
    ).toBe(true);
  });

  it("holds the supported retry to the same multi-demand language coverage", () => {
    expect(evaluateNếpActionResponse(action("retry"), "Could you say that again?")).toBe(false);
    expect(evaluateNếpActionResponse(action("retry"), "I'm Hoang.")).toBe(false);
    expect(evaluateNếpActionResponse(action("retry"), "Could you say that again? I'm Hoang.")).toBe(true);
  });
});
