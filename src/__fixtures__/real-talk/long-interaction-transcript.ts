import type { SourceTranscriptItem } from "@/lib/real-talk/generation-contract";

const naturalExchange = [
  "Hi, is this seat taken?",
  "No, go ahead. Are you here for the workshop?",
  "Yeah, it's my first time. What about you?",
  "I've been here once before.",
  "Sorry, could you say that again?",
  "Sure. I said I've been here once before.",
  "Okay, thanks. I'm Minh, by the way.",
  "Nice to meet you, Minh. I'm Alex.",
];

export const longInteractionTranscript: SourceTranscriptItem[] = Array.from(
  { length: 140 },
  (_, index) => {
    if (index >= 92 && index < 92 + naturalExchange.length) {
      return {
        text: naturalExchange[index - 92] ?? "",
        offset: index * 4,
        duration: 3.5,
      };
    }

    return {
      text:
        index < 30
          ? "Background music and opening titles continue"
          : "The presenter continues a long prepared explanation",
      offset: index * 4,
      duration: 3.5,
    };
  },
);
