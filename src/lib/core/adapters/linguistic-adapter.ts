export type LinguisticToken = {
  readonly text: string;
  readonly lemma: string;
  readonly pos: string;
  readonly tag: string;
  readonly dep: string;
  readonly headIndex: number;
};

export type GrammarDiagnostic = {
  readonly ruleId: string;
  readonly message: string;
  readonly offset: number;
  readonly length: number;
  readonly replacements: readonly string[];
  readonly category: string;
};

export type LinguisticAnalysisRequest = {
  readonly text: string;
  readonly language?: string;
  readonly enableGrammarCheck?: boolean;
};

export type LinguisticAnnotationObservation = {
  readonly observationType: "linguistic-annotation";
  readonly text: string;
  readonly tokens: readonly LinguisticToken[];
  readonly grammarDiagnostics?: readonly GrammarDiagnostic[];
  readonly engine: string;
  readonly occurredAt: string;
};

export type LinguisticAdapterResult =
  | { readonly ok: true; readonly observation: LinguisticAnnotationObservation }
  | { readonly ok: false; readonly error: string; readonly code: "empty-text" | "service-unavailable" };

export interface LinguisticAdapterContract {
  readonly engineName: string;
  analyze(request: LinguisticAnalysisRequest): Promise<LinguisticAdapterResult>;
}

export function createMockLinguisticAdapter(
  engineName = "mock-spacy-languagetool"
): LinguisticAdapterContract {
  return {
    engineName,
    async analyze(request: LinguisticAnalysisRequest): Promise<LinguisticAdapterResult> {
      if (!request.text || !request.text.trim()) {
        return Object.freeze({
          ok: false,
          error: "Text cannot be empty",
          code: "empty-text",
        });
      }

      const words = request.text.trim().split(/\s+/);
      const tokens: LinguisticToken[] = words.map((w, idx) =>
        Object.freeze({
          text: w,
          lemma: w.toLowerCase(),
          pos: idx === 0 ? "NOUN" : "VERB",
          tag: idx === 0 ? "NN" : "VB",
          dep: idx === 0 ? "nsubj" : "ROOT",
          headIndex: 0,
        })
      );

      const grammarDiagnostics: GrammarDiagnostic[] = [];
      if (request.enableGrammarCheck && request.text.includes("she go")) {
        const offset = request.text.indexOf("she go");
        grammarDiagnostics.push(
          Object.freeze({
            ruleId: "SUBJECT_VERB_AGREEMENT",
            message: "Third person singular requires 'goes'",
            offset,
            length: 6,
            replacements: Object.freeze(["she goes"]),
            category: "Grammar",
          })
        );
      }

      return Object.freeze({
        ok: true,
        observation: Object.freeze({
          observationType: "linguistic-annotation",
          text: request.text,
          tokens: Object.freeze(tokens),
          grammarDiagnostics: Object.freeze(grammarDiagnostics),
          engine: engineName,
          occurredAt: new Date().toISOString(),
        }),
      });
    },
  };
}
