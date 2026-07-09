# Curriculum v1 — Archived (logical freeze)

> Product rebuild v2 (2026-07). Outcome still **B1**; content & lesson format are new.

## What is v1?

- **50 units** under `src/lib/data/units/unit*.ts` (A0–B2)
- Metadata: `src/lib/constants/units.ts`
- Player: `UnitTemplate` + IPOR 10 sections (`learning-flow.ts`)
- Blueprint / content-standard for mega `UnitData`

## Policy until cutover

1. **Do not add new v1 units.**  
2. **Do not expand v1 pedagogy** unless production hotfix.  
3. Files remain in `src/lib/data/units/` while v1 is still default (`CURRICULUM_V2` off) so production stays green.  
4. **Physical move** into this folder happens when v2 is default and imports are deleted — then update this README with commit SHA.

## Mapping note

| v1 concept | v2 replacement |
|------------|----------------|
| `unit-1` … `unit-32` core-ish | `l-a0-*` … `l-b1-*` new path |
| `UnitData` | `LessonSpec` (`src/lib/v2/lesson-spec.ts`) |
| Complete via quiz/unit action | Task + quiz floor + can-do |
| XP-first progress | % to B1 + speak minutes + gates |

## Recovery

Git history retains full v1. Tag before physical archive: `curriculum-v1-final`.
