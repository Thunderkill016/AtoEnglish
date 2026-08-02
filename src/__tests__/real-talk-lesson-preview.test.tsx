import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  privateDraftPreviewLesson,
  privateDraftPreviewVideo,
} from "@/__fixtures__/real-talk/private-draft-preview";
import { expectTextOrder, renderClientComponent } from "@/__tests__/helpers/render-client-component";
import RealTalkLesson from "@/components/real-talk/RealTalkLesson";

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
            domProps,
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

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({
      children,
      href,
      ...props
    }: {
      children?: ReactNode;
      href: string;
      [key: string]: unknown;
    }) => React.createElement("a", { href, ...props }, children),
  };
});

vi.mock("@/app/actions/real-talk-srs", () => ({
  saveRealTalkVocabToSRS: vi.fn(async () => ({ success: true })),
}));

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
});

describe("Real Talk environment-first lesson preview", () => {
  it("shows the environment, learner role, partner role, and real-world goal before the academic phase content", () => {
    const rendered = renderClientComponent(
      <RealTalkLesson
        video={privateDraftPreviewVideo}
        lesson={privateDraftPreviewLesson}
      />,
    );
    unmountCurrent = rendered.unmount;

    const text = rendered.container.textContent ?? "";
    expect(text).toContain("Môi trường giao tiếp");
    expect(text).toContain("Vai của bạn: Khách tham dự mới");
    expect(text).toContain("Người đối diện: Một khách tham dự khác");
    expect(text).toContain("Trao đổi tên và xử lý khi bạn không nghe rõ.");
    expect(text).toContain("AI draft");
    expect(text).toContain("Bước 1/4: Bối cảnh & Khởi động");

    expectTextOrder(
      rendered.container,
      "Môi trường giao tiếp",
      "Bước 1/4: Bối cảnh & Khởi động",
    );
    expectTextOrder(
      rendered.container,
      "Việc cần làm ngoài đời",
      "Tiếp tục: Học từ vựng cốt lõi",
    );
  });
});
