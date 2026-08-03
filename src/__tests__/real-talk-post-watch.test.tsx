import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { privateDraftPreviewLesson } from "@/__fixtures__/real-talk/private-draft-preview";
import {
  click,
  findButton,
  renderClientComponent,
  setTextValue,
} from "@/__tests__/helpers/render-client-component";
import PostWatchPhase from "@/components/real-talk/PostWatchPhase";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motionOnlyProps = new Set([
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "whileHover",
    "whileTap",
    "layout",
  ]);
  const motion = new Proxy(
    {},
    {
      get: (_target, property) =>
        (props: Record<string, unknown>) => {
          const domProps = Object.fromEntries(
            Object.entries(props).filter(
              ([key]) => key !== "children" && !motionOnlyProps.has(key),
            ),
          );
          return React.createElement(
            typeof property === "string" ? property : "div",
            domProps as never,
            props.children as ReactNode,
          );
        },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children?: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

let unmountCurrent: (() => void) | undefined;

beforeAll(() => {
  (
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT: boolean;
    }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  unmountCurrent?.();
  unmountCurrent = undefined;
  document.body.innerHTML = "";
  vi.clearAllMocks();
});

function renderPostWatch(onComplete = vi.fn()) {
  const rendered = renderClientComponent(
    <PostWatchPhase
      content={privateDraftPreviewLesson.postWatch}
      culturalNotes={privateDraftPreviewLesson.postWatch.culturalNotes}
      transferTask={privateDraftPreviewLesson.transferTask}
      onComplete={onComplete}
    />,
  );
  unmountCurrent = rendered.unmount;
  return { ...rendered, onComplete };
}

function completeRecognitionAndRecall(container: ParentNode) {
  click(findButton(container, "Alex"));
  click(findButton(container, "Kiểm tra"));
  click(findButton(container, "Câu tiếp theo"));

  const fillInput = container.querySelector<HTMLInputElement>(
    'input[placeholder="Nhập phần còn thiếu"]',
  );
  if (!fillInput) throw new Error("Fill input not found");
  setTextValue(fillInput, "repeat");
  click(findButton(container, "Kiểm tra"));
  click(findButton(container, "Tiếp tục"));
}

function acknowledgeAllSpeakingDrills(container: ParentNode) {
  for (
    let index = 0;
    index < privateDraftPreviewLesson.postWatch.speakingDrills.length;
    index += 1
  ) {
    click(findButton(container, "Tôi đã nói thành tiếng"));
  }
}

describe("Real Talk post-watch production and transfer gates", () => {
  it("does not unlock transfer until every source-backed phrase is acknowledged as spoken", () => {
    const { container, onComplete } = renderPostWatch();
    completeRecognitionAndRecall(container);

    expect(container.textContent).toContain("Nice to meet you");
    expect(container.textContent).not.toContain(
      "Bạn gặp một đồng nghiệp mới trong ngày đầu đi làm.",
    );
    expect(container.textContent).not.toContain("Hoàn thành bài học");
    expect(onComplete).not.toHaveBeenCalled();

    click(findButton(container, "Tôi đã nói thành tiếng"));

    expect(container.textContent).toContain("Could you repeat that again");
    expect(container.textContent).not.toContain(
      "Bạn gặp một đồng nghiệp mới trong ngày đầu đi làm.",
    );
    expect(container.textContent).not.toContain("Hoàn thành bài học");
    expect(onComplete).not.toHaveBeenCalled();

    click(findButton(container, "Tôi đã nói thành tiếng"));

    expect(container.textContent).toContain(
      "Bạn gặp một đồng nghiệp mới trong ngày đầu đi làm.",
    );
    expect(container.textContent).toContain("Phản hồi của bạn bằng tiếng Anh");
    expect(container.textContent).not.toContain("Hoàn thành bài học");
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("keeps transfer disabled until a response and independent-attempt confirmation exist", () => {
    const { container, onComplete } = renderPostWatch();
    completeRecognitionAndRecall(container);
    acknowledgeAllSpeakingDrills(container);

    const transferButton = findButton(
      container,
      "Ghi nhận lượt transfer",
    ) as HTMLButtonElement;
    expect(transferButton.disabled).toBe(true);

    const response = container.querySelector<HTMLTextAreaElement>(
      "#real-talk-transfer",
    );
    if (!response) throw new Error("Transfer response not found");
    setTextValue(response, "Nice to meet you");

    expect(
      (findButton(container, "Ghi nhận lượt transfer") as HTMLButtonElement)
        .disabled,
    ).toBe(true);

    const confirmation = container.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    if (!confirmation) throw new Error("Transfer confirmation not found");
    click(confirmation);

    const enabledTransfer = findButton(
      container,
      "Ghi nhận lượt transfer",
    ) as HTMLButtonElement;
    expect(enabledTransfer.disabled).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();

    click(enabledTransfer);

    expect(container.textContent).toContain("Đã hoàn thành một chu trình thật");
    expect(container.textContent).toContain("2/2");
    expect(container.textContent).toContain("Transfer");
    expect(onComplete).not.toHaveBeenCalled();

    click(findButton(container, "Hoàn thành bài học"));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it("states the speech limitation honestly and makes no unsupported pronunciation or mastery claim", () => {
    const { container } = renderPostWatch();
    completeRecognitionAndRecall(container);

    const speakingText = container.textContent ?? "";
    expect(speakingText).toContain("Trang này chưa chấm âm thanh");
    expect(speakingText).toContain(
      "hệ thống không giả vờ rằng nút mic là điểm phát âm",
    );
    expect(speakingText).not.toContain("Phát âm của bạn đạt");
    expect(speakingText).not.toContain("Bạn đã thành thạo");
    expect(speakingText).not.toContain("Tự động lưu vào SRS");
    expect(speakingText).not.toContain("AI đã chấm giọng nói của bạn");
  });
});
