# AtoEnglish task handoffs

A task handoff is the compact, repository-owned continuation record for work that may span multiple AI sessions.

Use the pull-request body as the primary handoff when a PR already exists. Use a focused file under `docs/handoffs/` only when the task needs a durable handoff before a PR exists or when several agents must coordinate before review.

Do not copy full chat transcripts, speculative reasoning, secrets, credentials, cookies, temporary preview-share tokens, or personal learner data into a handoff.

## Required fields

```md
# <task name>

- Updated: YYYY-MM-DD HH:MM UTC
- Owner intent: <what the owner asked to achieve>
- Repository: Thunderkill016/AtoEnglish
- Base branch and SHA: <branch> @ <sha>
- Working branch: <branch>
- Pull request: <number or not opened>
- Exact head: <sha>
- State: <planning | implementing | blocked | ready for review>
- Merge state: <not merged | merged with sha>
- Deployment state: <none | preview ID | production ID>

## Scope

- Allowed: ...
- Forbidden: ...

## Completed

- ...

## Verification on exact head

- Passed: ...
- Failed: ...
- Not run or unavailable: ...

## Product or manual review

- Verified: ...
- Still required: ...

## Decisions and assumptions

- Owner decisions: ...
- Visible assumptions: ...
- Conflicts with current product documents: ...

## Blockers and risks

- ...

## Next safe action

<one concrete continuation step>

## Rollback or recovery

- ...
```

## Start-of-session use

A new session must:

1. read `AGENTS.md` and `PROJECT_MEMORY.md`;
2. inspect the live pull request, branch, exact head, checks, comments, and deployment state;
3. compare live state with the handoff;
4. report any mismatch before changing files;
5. continue only from verified repository evidence.

## End-of-session use

Before stopping:

1. update the PR body or handoff with the final exact head;
2. remove claims tied to an older head;
3. distinguish CI/build evidence from browser, learner, provider, or production evidence;
4. record unresolved blockers and one next safe action;
5. update `PROJECT_MEMORY.md` only when the project-wide snapshot or direction changed.

## Lifecycle

- Active handoffs describe only unfinished work.
- After merge or closure, Git history and the pull request become the record.
- Delete or archive a handoff that is no longer active instead of leaving it as a false current signal.
- Do not create handoff-only commits after every successful check; update the handoff when the task state materially changes or before review.
