# Real Talk generation hardening

Status: active implementation on `agent/rebuild-learning-core`.

## Pipeline

```text
YouTube URL
→ validate video ID
→ read available English captions
→ sanitize caption text
→ select a dense natural-interaction window
→ Gemini structured draft
→ Zod schema validation
→ source-evidence validation
→ preview or private draft
→ human review before any publication
```

## Product rule

The source recording is not selected to illustrate a predetermined grammar lesson. The compiler first identifies the real communication environment and events that occur in the selected interaction, then creates learner support and a changed-context transfer task.

## Publication rule

AI output is never public by default.

- Guest generation exists only in the current browser session.
- Signed-in generation may be stored as an owner-private draft.
- Catalog publication requires a separate human-review and approval path.
- A public YouTube URL does not by itself establish permission to copy captions or create derivative commercial lesson content.

## Evidence rule

The generator rejects drafts when:

- timestamps fall outside the selected caption window;
- activities reference unknown transcript segments;
- vocabulary context examples are absent from the source;
- speaking drills are absent from the source;
- completed fill-in-the-blank sentences are absent from the source;
- suggested transfer language is absent from the source.

## Trust boundary

Caption text is untrusted input. Instructions, URLs or prompt-like text inside captions are treated only as dialogue data and must not change the compiler instructions.

Speaker labels inferred from captions remain provisional. The UI must call the result an AI draft until a person checks the source audio, speaker turns, transcript, translation, suitability and rights.
