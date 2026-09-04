# Nếp Core Research & Source Registry v1

This registry prevents attractive external technology from silently becoming product authority. Every artifact must be pinned and reviewed again at adoption time; licenses for code, weights and training data are separate questions.

## Classification

- **candidate-production:** permissive/compatible enough to benchmark for commercial production; not automatically approved.
- **research-only:** useful for experiments/benchmarking but restricted or unresolved for production use.
- **reference-only:** may inform human design/research but content must not be ingested/reproduced as a product dataset without permission.
- **adapter-only:** library/runtime is acceptable, but each downloaded model/data artifact needs its own review.

## Standards and competency references

| Source | Use | Status | Notes |
| --- | --- | --- | --- |
| CEFR / Companion Volume | communication modes, competence taxonomy, external crosswalk | reference-only | Council of Europe material is copyrighted; commercial reuse of text requires permission. Cite concepts; do not copy descriptor corpus into Nếp. |
| ACTFL Proficiency Guidelines 2024 | external proficiency comparison and assessment research | reference-only | ACTFL terms restrict commercial use and AI ingestion. Do not copy/derive an internal descriptor corpus from the Guidelines. |

Nếp owns its ontology and descriptors. External standards may later receive empirically validated mappings.

## Open linguistic resources

| Artifact | Candidate use | License/status |
| --- | --- | --- |
| CMU Pronouncing Dictionary | US-English pronunciation lexicon / ARPAbet seeds | candidate-production; unrestricted research/commercial use with requested acknowledgement |
| Princeton WordNet 3.0 | sense relations, synonymy/hypernymy and lexical semantics | candidate-production; WordNet license permits use/modification/distribution for any purpose with notices |
| Universal Dependencies English EWT | syntax/morphology parser evaluation/training | candidate-production with share-alike review; CC BY-SA 4.0 |
| Universal Dependencies English ESLSpok | spoken L2 syntax research | candidate-production with share-alike review; CC BY-SA 4.0 |
| UD English ESL | learner syntax research | adapter/research: annotations CC BY-SA but underlying text must be separately obtained |

Avoid mixing NonCommercial UD treebanks into production training.

## Deterministic / NLP stack candidates

| Artifact | Role | Status |
| --- | --- | --- |
| spaCy | tokenization, morphology/syntax pipeline framework | candidate-production; MIT code; model packages reviewed separately |
| Stanford Stanza | alternative trainable tokenizer/POS/lemma/dependency pipeline | candidate-production; Apache-2.0 code; model/data artifacts reviewed separately |
| LanguageTool core | grammar/style deterministic rules and baseline | adapter-only; LGPL core, isolate/review distribution obligations |
| ERRANT | grammatical error extraction/classification/evaluation | candidate-production code pending exact version/license review; never treat its labels as learner truth without evaluator validation |
| sentence-transformers | embedding/reranking framework | adapter-only; Apache-2.0 library, model-specific licenses |

## Speech stack candidates

| Artifact | Role | Status |
| --- | --- | --- |
| Silero VAD | speech segmentation / quality gate | candidate-production; MIT code/model |
| OpenAI Whisper | self-hosted transcript support / listening-content tooling | candidate-production; code and weights MIT; ASR transcript is not pronunciation ground truth |
| WavLM | shared speech representation / future pronunciation & fluency heads | candidate-production research; source code MIT; fingerprint and review exact checkpoint before adoption |
| OpenPronounce | pronunciation baseline / research comparison | research baseline until Vietnamese-English human calibration passes |
| Kokoro | local TTS candidate for listening/reference audio | adapter-only; Apache-2.0 weights reported, but inference stack includes GPLv3 `espeak-ng`; deployment/distribution architecture needs license review |

## Local generative intelligence

| Artifact | Role | Status |
| --- | --- | --- |
| Qwen3-8B | local LLM candidate for semantic/pragmatic/writing candidate analysis | candidate-production model license Apache-2.0; must be benchmarked and constrained behind typed observations |
| llama.cpp | local/portable LLM inference runtime | candidate-production; MIT |

No LLM may directly mutate mastery or publish curriculum. It can propose structured observations, candidates, explanations or task drafts which pass deterministic schemas and domain gates.

## Learning-science evidence accepted as design input

Current research base supports these policies as hypotheses worth encoding and testing:

- spaced practice improves L2 learning over massed practice; scheduling remains construct/task dependent;
- retrieval and delayed evidence are stronger than passive re-exposure for retention claims;
- corrective feedback has positive average effects, but type/timing/task/proficiency matter;
- written corrective feedback can improve accuracy, with strong moderation by learner/task context;
- extensive reading produces positive effects across reading, vocabulary, fluency, motivation and other language outcomes;
- listening metacognitive strategy instruction has substantial evidence of benefit;
- lexical coverage is strongly related to comprehension; roughly 95–98% known-word coverage is a useful text-selection signal, not a universal mastery threshold;
- formulaic language/chunks contribute to fluent processing and production;
- task-based interaction provides useful conditions for language development;
- multimedia vocabulary support can help, but representation choices must be benchmarked rather than maximized blindly.

These findings define planner priors and experiment ideas, not hard-coded universal effect sizes.

## Production dataset rule

For any training/evaluation dataset record:

```text
artifact_id
version/hash
source_url
owner
license
commercial_use
redistribution
share_alike
attribution
personal_data_risk
population
language_variety
collection_method
annotation_method
known_biases
allowed_uses
forbidden_uses
reviewed_at
```

`unknown` in a rights field blocks production promotion.

## Vietnamese-English data strategy

External L2 corpora are useful for research, but Nếp's long-term defensible asset must be a consented Vietnamese-English learner corpus with:

- speaker-disjoint train/dev/test splits;
- modality/task/context metadata;
- raw media separated from product analytics;
- multiple annotators for high-stakes labels;
- explicit uncertainty/disagreement;
- retention/deletion policy;
- production rights suitable for model development;
- versioned annotation instructions;
- benchmark subsets frozen before threshold selection.

L2-ARCTIC is valuable for Vietnamese-English research but its NonCommercial licensing means it must not become a production-training dependency for a commercial Nếp model.