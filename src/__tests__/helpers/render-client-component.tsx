import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

export interface RenderedClientComponent {
  container: HTMLDivElement;
  root: Root;
  unmount: () => void;
}

export function renderClientComponent(
  node: ReactNode,
): RenderedClientComponent {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(node);
  });

  return {
    container,
    root,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

export function click(element: Element) {
  act(() => {
    (element as HTMLElement).click();
  });
}

export function setTextValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  if (!setter) throw new Error("Native value setter is unavailable");

  act(() => {
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

export function findButton(container: ParentNode, text: string) {
  const button = Array.from(container.querySelectorAll("button")).find((item) =>
    item.textContent?.includes(text),
  );
  if (!button) throw new Error(`Button not found: ${text}`);
  return button;
}

export function expectTextOrder(
  container: ParentNode & Node,
  first: string,
  second: string,
) {
  const text = container.textContent ?? "";
  const firstIndex = text.indexOf(first);
  const secondIndex = text.indexOf(second);

  if (firstIndex < 0) throw new Error(`Missing text: ${first}`);
  if (secondIndex < 0) throw new Error(`Missing text: ${second}`);
  if (firstIndex >= secondIndex) {
    throw new Error(`Expected "${first}" before "${second}"`);
  }
}
