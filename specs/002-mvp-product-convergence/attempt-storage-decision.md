# Attempt Storage Decision

**Decision date:** 2026-08-03

## Decision

Use a dedicated bounded `public.real_talk_attempts` table and an owner-derived
`save_real_talk_attempt` RPC for the YouTube-to-private-lesson MVP.

## Rejected alternatives

- `real_talk_progress`: not present on the hosted project and its historical
  migration is coupled to static catalog slugs and legacy fields.
- `user_v2_lesson_progress`: quiz/task semantics do not represent support,
  speaking confirmation, and changed-context transfer separately.
- `lesson_v2_evidence`: generic JSON risks accepting unbounded learner content and
  does not provide the desired typed completion constraint.

## Stored fields

Only bounded state is stored:

- lesson/user identity;
- checkpoint and status;
- first-listen boolean;
- comprehension counts;
- maximum support level;
- retrieval-attempt boolean;
- speaking self-confirmation boolean;
- transfer-attempt boolean;
- timestamps.

Raw audio, speech transcript, learner free text, names, and employers are not
stored.

## Security

- user identity is derived from `auth.uid()`;
- lesson access must be public or owner-private;
- completion is derived by the RPC from required evidence, not trusted from the
  browser;
- RLS allows users to read only their own attempts;
- duplicate writes upsert `(user_id, lesson_id)` idempotently.

The migration is added to the repository but is not applied to hosted Supabase
until an explicit hosted-DDL gate is authorized.
