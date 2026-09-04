# Nếp Core Truth v1

**Status:** active engineering direction  
**Owner decision:** 2026-09-04  
**Primary issue:** #109

## Mission

Build a vendor-independent English intelligence and learning core before further product/UI expansion.

The current AtoEnglish web remains intact as a compatibility client and research surface. It is not the owner of learning logic. The core must eventually be usable from a web app, mobile app, CLI, experiment harness, teacher tool, or another interface without rewriting its learning model.

"Best in the world" is a benchmark target, not a repository claim. A subsystem may only be promoted when its held-out evidence beats explicit baselines on the population and task it is meant to serve.

## What the core must understand

The ontology is broader than the traditional four skills. It must represent:

- phonetics, phonology and prosody;
- orthography, spelling and punctuation;
- morphology and word formation;
- vocabulary, senses, frequency, collocation, phraseology and formulaic language;
- syntax and grammar;
- semantics and meaning relations;
- pragmatics, speech acts and implicature;
- sociolinguistics, register, politeness, dialect and variation;
- discourse, cohesion, coherence, information structure, rhetoric and genre;
- listening and audiovisual reception;
- reading and visual reception;
- spoken production;
- written production;
- spoken and written interaction;
- mediation, paraphrase, summarisation and explanation;
- communication strategies, repair and clarification;
- fluency, automaticity, processing speed and intelligibility;
- metacognitive strategies for planning, monitoring and evaluating performance;
- domain/context knowledge needed to complete real communicative tasks.

No single scalar "English level" may replace this multidimensional state.

## Core architecture

```text
external knowledge / corpora / models / human research
                    |
                    v
        Source & Provenance Registry
                    |
                    v
          English Knowledge Graph
                    |
        +-----------+-----------+
        |                       |
        v                       v
 Linguistic/Speech          Task Graph
 Intelligence              & Assessment
        |                       |
        +-----------+-----------+
                    v
              Typed Evidence
                    |
                    v
              Learner Model
                    |
       +------------+------------+
       |            |            |
       v            v            v
 Error Memory   Memory/FSRS   Transfer State
       \            |            /
        +-----------+-----------+
                    v
             Adaptive Planner
                    |
                    v
          Pedagogical Policy
          feedback -> retry
                    |
                    v
        Benchmark / Experiment Loop
```

## The ten core subsystems

### 1. Source and provenance
Every external paper, corpus, lexicon, model, benchmark and rule has a source record, license classification, version/fingerprint and allowed-use status. Unknown licensing is research-blocked, not production-safe.

### 2. English knowledge graph
A canonical, versioned graph describes learnable constructs and communicative capabilities. Nodes may be atomic or composite. Edges include prerequisite, component-of, confusion-with, contrast-with, commonly-cooccurs-with, enables, transfers-to and variant-of.

### 3. Task graph
Knowledge is never equated with exposure. A task declares the target construct, activity, context, support, response modality, evidence role, scoring contract and transfer distance.

### 4. Linguistic and speech intelligence
Deterministic analyzers and self-hosted models emit bounded observations. They never write mastery directly. Speech and text models are replaceable adapters behind artifact-fingerprinted contracts.

### 5. Evidence and assessment
Evidence records what was actually observed: recognition, retrieval, comprehension, production, repair, transfer and retention, qualified by language activity, modality, support, context, confidence and evaluator provenance.

### 6. Learner model
State is uncertainty-aware and evidence-backed. Unknown is not zero. Recognition is not production. Reading is not listening. Rehearsed performance is not transfer. Recent supported success does not imply durable independent mastery.

### 7. Memory and retention
Reuse the existing FSRS/retrieval infrastructure where appropriate. Spacing is a scheduling mechanism, not the definition of mastery. Memory state must coexist with language-skill evidence and transfer evidence.

### 8. Error memory and diagnosis
Errors are hypotheses with evidence, recurrence, context, confidence and remediation history. The system distinguishes slips, knowledge gaps, processing failures, acoustic uncertainty and task misunderstanding where evidence permits.

### 9. Adaptive planning and pedagogy
The planner chooses the next best task from learner state, prerequisites, uncertainty, due retrieval, transfer needs, error memory, task value and cognitive load. Pedagogical policy controls scaffolding, feedback, retry, fading, interleaving and later retrieval; model scores do not control pedagogy directly.

### 10. Benchmark and experiment system
Every promoted algorithm/model has a frozen evaluation set, baseline, metric, confidence interval, artifact fingerprint and decision. Research may move quickly; learner-facing authority moves slowly.

## Non-negotiable invariants

1. **Unknown != failure.** Absence of evidence cannot become a zero-skill observation.
2. **Exposure != evidence.** Seeing/hearing material never proves learning by itself.
3. **Recognition != retrieval != production.** Evidence does not silently cross roles.
4. **Modality is explicit.** Typed/text fallbacks cannot become acoustic speaking evidence; reading success cannot silently become listening success.
5. **Context is explicit.** Same-task repetition is not transfer.
6. **Support is explicit.** Hints, reveals, scripts and scaffolds reduce or invalidate stronger evidence claims.
7. **Raw model output is observation.** It is not a learner truth or mastery event.
8. **Calibration is population/task specific.** A provider or model does not globally "pass".
9. **Human-grounded benchmarks precede authority.** Learner-facing corrective claims must meet precision-first gates where false accusations are costly.
10. **Feedback is bounded.** Prefer one or two high-impact corrections, then immediate retry and later retrieval.
11. **Core logic is UI-independent.** UI may collect/render; it may not own progression or mastery policy.
12. **External models are replaceable.** Model names never become domain semantics.
13. **Licenses are first-class.** Research-only assets cannot leak into commercial production weights or redistributed datasets.
14. **No autonomous publication.** Generated lessons/tasks remain candidates until deterministic and pedagogical quality gates pass.
15. **No "world-class" claim without evidence.** Architecture quality, CI success and benchmark quality are separate evidence levels.

## Evidence hierarchy

1. repository evidence — contracts/tests/build consistency;
2. measurement evidence — model/evaluator agreement, calibration and reliability;
3. usability evidence — learners can complete the intended tasks;
4. learning evidence — delayed retention and transfer improve;
5. market evidence — learners pay, return, renew or refer.

A lower level cannot substitute for a higher one.

## Relationship to existing code

The new core extends rather than discards:

- `src/lib/learning/evidence.ts`;
- `src/lib/learning/error-memory.ts`;
- learner-state coverage/read models;
- session planning;
- FSRS/review infrastructure;
- `src/lib/nep/*` capability/evaluator/remediation work;
- the Pronunciation Shadow trust boundary.

The first foundation slice must not require a production DB migration, UI redesign, new paid provider or production deploy.

## Current implementation boundary

Before further web feature work, establish:

1. the comprehensive ontology contract;
2. task/activity/context contracts;
3. observation/provenance/calibration contracts;
4. benchmark and promotion policy;
5. source/model/data registry;
6. one pure-core end-to-end reference test.

Only after those contracts are stable should product surfaces consume them.