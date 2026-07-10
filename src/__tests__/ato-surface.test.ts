import { describe, it, expect } from "vitest";
import {
  APP_BUTTON_SIZE,
  APP_BUTTON_VARIANT,
  ATO_EYEBROW,
  ATO_FOCUS,
  SURFACE_VARIANT,
} from "@/lib/ui/ato-surface";

describe("Ato Surface tokens (TASK-260 / UI-01)", () => {
  it("defines all surface variants with glass markers", () => {
    for (const key of ["default", "interactive", "success", "warn", "danger"] as const) {
      expect(SURFACE_VARIANT[key]).toMatch(/rounded/);
      expect(SURFACE_VARIANT[key].length).toBeGreaterThan(20);
    }
    expect(SURFACE_VARIANT.default).toMatch(/backdrop-blur/);
  });

  it("primary button is brand gradient", () => {
    expect(APP_BUTTON_VARIANT.primary).toMatch(/emerald/);
    expect(APP_BUTTON_VARIANT.primary).toMatch(/teal|gradient/);
  });

  it("has three sizes with min touch height classes", () => {
    expect(APP_BUTTON_SIZE.sm).toMatch(/min-h/);
    expect(APP_BUTTON_SIZE.md).toMatch(/min-h/);
    expect(APP_BUTTON_SIZE.lg).toMatch(/min-h/);
  });

  it("exports a11y focus + eyebrow helpers", () => {
    expect(ATO_FOCUS).toMatch(/focus-visible/);
    expect(ATO_EYEBROW).toMatch(/uppercase|tracking/);
  });
});
