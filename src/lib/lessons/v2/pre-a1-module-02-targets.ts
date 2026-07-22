import type { LanguageTarget } from "./schema";

export const PRICE_TARGETS: LanguageTarget[] = [
  {
    id: "m02-how-much",
    kind: "chunk",
    form: "How much is it?",
    meaningVi: "Món này giá bao nhiêu?",
    exampleEn: "How much is it?",
    exampleVi: "Món này giá bao nhiêu?",
    priority: "core",
  },
  {
    id: "m02-price",
    kind: "chunk",
    form: "It is five dollars.",
    meaningVi: "Giá là năm đô-la.",
    exampleEn: "It is five dollars.",
    exampleVi: "Giá là năm đô-la.",
    priority: "core",
    pronunciationGoal: "Nói rõ số tiền và âm cuối của dollars.",
  },
  {
    id: "m02-cash",
    kind: "chunk",
    form: "Cash, please.",
    meaningVi: "Tôi trả tiền mặt.",
    exampleEn: "Cash, please.",
    exampleVi: "Tiền mặt nhé.",
    priority: "core",
  },
  {
    id: "m02-card",
    kind: "chunk",
    form: "Card, please.",
    meaningVi: "Tôi trả bằng thẻ.",
    exampleEn: "Card, please.",
    exampleVi: "Thẻ nhé.",
    priority: "core",
  },
];
