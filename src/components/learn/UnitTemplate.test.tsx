import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

import UnitTemplate, { type UnitData } from "./UnitTemplate";

const actionMocks = vi.hoisted(() => ({
  completeUnit: vi.fn(),
  getUnitCompletionStatus: vi.fn(),
  getDueWarmupCards: vi.fn(),
  seedUnitVocabToSRS: vi.fn(),
  scheduleWrongWordsForReview: vi.fn(),
}));

vi.mock("@/app/actions/unit", () => ({
  completeUnit: actionMocks.completeUnit,
  getUnitCompletionStatus: actionMocks.getUnitCompletionStatus,
}));

vi.mock("@/app/actions/cards", () => ({
  getDueWarmupCards: actionMocks.getDueWarmupCards,
  seedUnitVocabToSRS: actionMocks.seedUnitVocabToSRS,
  scheduleWrongWordsForReview: actionMocks.scheduleWrongWordsForReview,
}));

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }: { href: string; children: ReactNode }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const stripMotionProps = (props: Record<string, unknown>) => {
    const domProps = { ...props };
    for (const key of [
      "initial",
      "animate",
      "exit",
      "transition",
      "whileHover",
      "whileTap",
      "layout",
      "layoutId",
    ]) {
      delete domProps[key];
    }
    return domProps;
  };
  const MotionDiv = (props: Record<string, unknown>) =>
    React.createElement("div", stripMotionProps(props));
  const MotionParagraph = (props: Record<string, unknown>) =>
    React.createElement("p", stripMotionProps(props));

  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
    motion: {
      div: MotionDiv,
      p: MotionParagraph,
    },
  };
});

vi.mock("@/features/streak/hooks/useStreakMilestone", () => ({
  useStreakMilestone: () => ({
    showOverlay: false,
    pendingMilestone: null,
    checkMilestone: vi.fn(),
    dismissMilestone: vi.fn(),
  }),
}));

vi.mock("@/features/streak/components/StreakMilestoneOverlay", () => ({
  default: () => null,
}));

interface SectionMockProps {
  unit: UnitData;
  goNext: () => void;
  handleCompleteUnit?: () => Promise<void>;
}

vi.mock("./sections/WarmupSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-warmup", onClick: goNext }, "Warmup"),
  };
});

vi.mock("./sections/VocabSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-vocab", onClick: goNext }, "Vocab"),
  };
});

vi.mock("./sections/GrammarSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-grammar", onClick: goNext }, "Grammar"),
  };
});

vi.mock("./sections/PracticeSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-practice", onClick: goNext }, "Practice"),
  };
});

vi.mock("./sections/DialogueSection", async () => {
  const React = await import("react");
  return {
    default: ({ unit, goNext }: SectionMockProps) =>
      React.createElement(
        "button",
        {
          "data-testid": "section-dialogue",
          "data-dialogue-title": unit.dialogues[0]?.title ?? "",
          onClick: goNext,
        },
        "Dialogue",
      ),
  };
});

vi.mock("./sections/FluencySection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-fluency", onClick: goNext }, "Fluency"),
  };
});

vi.mock("./sections/TranslateSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-translate", onClick: goNext }, "Translate"),
  };
});

vi.mock("./sections/ShadowingSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-shadowing", onClick: goNext }, "Shadowing"),
  };
});

vi.mock("./sections/SpeakingSection", async () => {
  const React = await import("react");
  return {
    default: ({ goNext }: SectionMockProps) =>
      React.createElement("button", { "data-testid": "section-speaking", onClick: goNext }, "Speaking"),
  };
});

vi.mock("./sections/QuizSection", async () => {
  const React = await import("react");
  return {
    default: ({ handleCompleteUnit }: SectionMockProps) =>
      React.createElement(
        "button",
        { "data-testid": "section-quiz", onClick: () => void handleCompleteUnit?.() },
        "Complete unit",
      ),
  };
});

function makeUnit(overrides: Partial<UnitData> = {}): UnitData {
  return {
    unitId: "unit-test",
    title: "Test Unit",
    level: "A1",
    xp: 100,
    estimatedTime: 15,
    description: "A focused UnitTemplate test fixture",
    badgeName: "Tester",
    badgeEmoji: "🧪",
    warmupGreetings: [],
    culturalNote: "",
    vocab: [],
    dialogues: [
      {
        id: 1,
        title: "Default dialogue",
        audio: "",
        desc: "",
        lines: [],
      },
    ],
    listenAndChoose: [],
    speaking: {
      level1Prompt: "",
      level1Placeholder: "",
      level2Situation: "",
      level2Hint: "",
    },
    quiz: [],
    ...overrides,
  };
}

function findButton(container: HTMLElement, text: string): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll("button")).find((candidate) =>
    candidate.textContent?.includes(text),
  );
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Missing button containing text: ${text}`);
  }
  return button;
}

describe("UnitTemplate behavior foundation", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    localStorage.clear();
    actionMocks.completeUnit.mockReset();
    actionMocks.getUnitCompletionStatus.mockReset();
    actionMocks.getDueWarmupCards.mockReset();
    actionMocks.seedUnitVocabToSRS.mockReset();
    actionMocks.scheduleWrongWordsForReview.mockReset();

    actionMocks.getDueWarmupCards.mockResolvedValue({ success: true, cards: [] });
    actionMocks.getUnitCompletionStatus.mockResolvedValue({ success: true, completed: false });
    actionMocks.completeUnit.mockResolvedValue({ success: false, error: "Bạn cần đăng nhập" });
    actionMocks.seedUnitVocabToSRS.mockResolvedValue({ success: true });
    actionMocks.scheduleWrongWordsForReview.mockResolvedValue({ success: true });

    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        speak: vi.fn(),
      },
    });
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(globalThis, "requestAnimationFrame", {
      configurable: true,
      value: vi.fn(() => 1),
    });
    Object.defineProperty(globalThis, "cancelAnimationFrame", {
      configurable: true,
      value: vi.fn(),
    });

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  async function renderUnit(unit = makeUnit(), nextRoute = "/dashboard") {
    await act(async () => {
      root.render(<UnitTemplate unit={unit} nextRoute={nextRoute} />);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function click(element: HTMLElement) {
    await act(async () => {
      element.click();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("restores a saved section using the pedagogical section order", async () => {
    localStorage.setItem("lesson-progress-unit-test", JSON.stringify({ section: 9 }));

    await renderUnit();

    expect(container.querySelector('[data-testid="section-translate"]')).not.toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      "aria-label",
      "Tiến độ bài học: bước 7 / 10",
    );
  });

  it("normalizes dialogues_list before passing the unit to DialogueSection", async () => {
    localStorage.setItem("lesson-progress-unit-test", JSON.stringify({ section: 5 }));
    const preferredDialogue = {
      id: 2,
      title: "Preferred dialogue list",
      audio: "",
      desc: "",
      lines: [],
    };

    await renderUnit(makeUnit({ dialogues_list: [preferredDialogue] }));

    expect(container.querySelector('[data-testid="section-dialogue"]')).toHaveAttribute(
      "data-dialogue-title",
      "Preferred dialogue list",
    );
  });

  it("uses quick review to jump from Practice directly to Quiz and clears saved progress", async () => {
    await renderUnit();

    await click(findButton(container, "Ôn nhanh"));

    expect(container.querySelector('[data-testid="section-practice"]')).not.toBeNull();
    expect(JSON.parse(localStorage.getItem("lesson-progress-unit-test") ?? "null")).toEqual({ section: 4 });

    await click(container.querySelector('[data-testid="section-practice"]') as HTMLButtonElement);

    expect(container.querySelector('[data-testid="section-quiz"]')).not.toBeNull();
    expect(localStorage.getItem("lesson-progress-unit-test")).toBeNull();
  });

  it("records guest completion locally without changing the server action contract", async () => {
    await renderUnit(makeUnit(), "/learn/next-unit");
    await click(findButton(container, "Ôn nhanh"));
    await click(container.querySelector('[data-testid="section-practice"]') as HTMLButtonElement);
    await click(container.querySelector('[data-testid="section-quiz"]') as HTMLButtonElement);

    expect(actionMocks.completeUnit).toHaveBeenCalledWith("unit-test", 3);
    expect(JSON.parse(localStorage.getItem("guest_completed_units") ?? "[]")).toEqual(["unit-test"]);
    expect(container.textContent).toContain("Xuất sắc! 🏆");
    expect(container.querySelector('a[href="/learn/next-unit"]')).not.toBeNull();
  });

it("ignores malformed saved progress without leaving the warmup", async () => {
  const key = "lesson-progress-unit-test";
  localStorage.setItem(key, "{broken-json");

  await renderUnit();

  expect(container.querySelector('[data-testid="section-warmup"]')).not.toBeNull();
  expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
    "aria-label",
    "Tiến độ bài học: bước 1 / 10",
  );
  expect(localStorage.getItem(key)).toBe("{broken-json");
});

it.each([0, 1, 10, 11])(
  "ignores non-restorable saved section %s",
  async (savedSection) => {
    const key = "lesson-progress-unit-test";
    localStorage.setItem(key, JSON.stringify({ section: savedSection }));

    await renderUnit();

    expect(container.querySelector('[data-testid="section-warmup"]')).not.toBeNull();
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      "aria-label",
      "Tiến độ bài học: bước 1 / 10",
    );
    expect(JSON.parse(localStorage.getItem(key) ?? "null")).toEqual({
      section: savedSection,
    });
  },
);

it("isolates progress reads and writes by unit id", async () => {
  const currentKey = "lesson-progress-unit-test";
  const otherKey = "lesson-progress-unit-other";
  localStorage.setItem(otherKey, JSON.stringify({ section: 9 }));

  await renderUnit();

  expect(container.querySelector('[data-testid="section-warmup"]')).not.toBeNull();
  await click(container.querySelector('[data-testid="section-warmup"]') as HTMLButtonElement);

  expect(container.querySelector('[data-testid="section-vocab"]')).not.toBeNull();
  expect(JSON.parse(localStorage.getItem(currentKey) ?? "null")).toEqual({ section: 2 });
  expect(JSON.parse(localStorage.getItem(otherKey) ?? "null")).toEqual({ section: 9 });
});

it("removes only the current unit progress key on the final section", async () => {
  const currentKey = "lesson-progress-unit-test";
  const otherKey = "lesson-progress-unit-other";
  localStorage.setItem(currentKey, JSON.stringify({ section: 7 }));
  localStorage.setItem(otherKey, JSON.stringify({ section: 4 }));

  await renderUnit();

  expect(container.querySelector('[data-testid="section-speaking"]')).not.toBeNull();
  await click(container.querySelector('[data-testid="section-speaking"]') as HTMLButtonElement);

  expect(container.querySelector('[data-testid="section-quiz"]')).not.toBeNull();
  expect(localStorage.getItem(currentKey)).toBeNull();
  expect(JSON.parse(localStorage.getItem(otherKey) ?? "null")).toEqual({ section: 4 });
});

});
