# AtoEnglish product truth

**Status:** current product decision source  
**Updated:** 2026-07-24  
**Primary roadmap:** GitHub issue #20  
**Journey contract:** `docs/curriculum/28-day-speaking-journey-contract.md`

## What AtoEnglish is now

AtoEnglish is a Vietnamese-first guided speaking product for adults who know some English but freeze when they need to speak at work.

The first product is not the complete A0–B2 curriculum already present in the repository. It is one focused, measurable 28-day work-speaking pilot.

## Target learner

The initial learner is:

- a Vietnamese adult beginner or false beginner;
- able to recognize some common English but unable to retrieve it reliably while speaking;
- likely to need English for a colleague, client, receptionist, interview, service, or workplace interaction;
- willing to practice for 10–15 minutes per day;
- better served by clear Vietnamese guidance and controlled speaking progression than by open-ended conversation.

The current target segment is a product hypothesis. Interviews, paid pilot participation, completion, and learning evidence must validate it.

## Product promise

> In 28 days, practice 10–15 minutes per day to introduce yourself and your work, handle five predictable follow-up questions, and ask for repetition or slower speech.

This promise must remain consistent across landing, onboarding, dashboard, lessons, assessment, and support communication.

## Final learner outcome

At the end of the pilot, the learner should be able to:

1. greet and close a short workplace interaction;
2. state and spell their name;
3. state their role;
4. state their company or workplace type;
5. state one responsibility;
6. answer five predictable questions about their work;
7. independently ask for repetition or slower speech when needed;
8. deliver a 30–45 second work introduction without a full-script prompt.

This is a narrow product outcome, not a CEFR certification claim.

## Learning model

Every meaningful lesson should move through a controlled progression:

```text
real situation
→ short comprehensible model
→ notice useful chunks
→ controlled retrieval
→ supported speaking
→ reduced prompts
→ changed situation
→ concise feedback
→ immediate retry
→ later spaced retrieval
```

Vocabulary, grammar, XP, streaks, and quizzes support this progression. They are not the final learner outcome.

## Daily lesson contract

A daily lesson should:

- have one measurable can-do outcome;
- fit a credible 10–15 minute session;
- end in required spoken output;
- use only the language needed for that task;
- retrieve earlier chunks where relevant;
- reduce support over time;
- avoid showing the complete answer during the final performance;
- give no more than one or two high-impact feedback points;
- provide an immediate opportunity to speak again;
- preserve an explicit fallback when browser speech capability is unavailable.

## Product experience

The intended learner journey is:

```text
clear promise
→ start with minimal friction
→ learn today's small speaking task
→ perform the task
→ receive understandable feedback
→ retry
→ see the next step
→ return for spaced practice and the next daily outcome
```

The product must make the speaking task more important than browsing curriculum breadth or collecting points.

## Evidence hierarchy

Decisions should distinguish four evidence levels:

1. **Repository evidence:** code, tests, docs, routes, data, and current behavior.
2. **Usability evidence:** a learner can reach and complete the intended flow.
3. **Learning evidence:** baseline-to-checkpoint or baseline-to-final speaking performance improves.
4. **Market evidence:** target learners pay, complete, renew, or refer others.

A technical check cannot substitute for learner or market evidence.

## Existing foundation

The repository already contains substantial infrastructure:

- Next.js application and responsive lesson surfaces;
- Supabase authentication, progress, migrations, and RLS;
- 50 registered A0–B2 curriculum units;
- vocabulary, grammar, dialogue, translation, shadowing, speaking, quiz, and review sections;
- FSRS, XP, streak, league, progress, and guest flows;
- baseline/final speaking assessment and rubric;
- privacy-bounded pilot analytics;
- Vitest, content-standard checks, production build, and Playwright smoke coverage.

This foundation is available but not equivalent to a validated product. The current bottleneck is proving one coherent learner outcome.

## Product boundaries

Until the pilot is validated:

- keep the existing 50 units available but do not treat breadth as proof of value;
- build the 28-day journey in small, testable slices;
- preserve the modular monolith;
- use manual operations when they are cheaper and safer than building infrastructure;
- collect only bounded analytics required to answer activation, completion, learning, and support questions;
- do not store raw audio, transcripts, names, employers, or learner free text in analytics;
- do not claim learner improvement until baseline and later performance evidence exists.

## Success questions

AtoEnglish must be able to answer with evidence:

- who starts the first speaking task;
- who completes it;
- who returns after seven days;
- who completes the 28-day journey;
- whether speaking performance improves;
- which lesson or UX failures block learners;
- how much human support each learner requires;
- whether the target learner will pay, renew, or refer another learner.

## Product decision rule

When choosing between building more breadth and improving the validated journey, choose the smallest change that increases the chance of obtaining trustworthy learner evidence.
