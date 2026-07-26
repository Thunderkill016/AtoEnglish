import type { UnitData } from "@/components/learn/UnitTemplate";
import { UNITS } from "@/lib/constants/units";

export type UnitPageMetadata = Pick<UnitData, "title" | "description">;

export function resolveUnitPageMetadata(
  unitSlug: string,
  lessonData?: UnitPageMetadata,
): UnitPageMetadata | null {
  if (unitSlug === "unit-a0-1") {
    return lessonData ?? null;
  }

  const catalogEntry = UNITS.find((unit) => unit.id === unitSlug);
  if (!catalogEntry) return null;

  return {
    title: catalogEntry.title,
    description: catalogEntry.description,
  };
}
