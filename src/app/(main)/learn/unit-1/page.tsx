"use client";

import UnitTemplate from "@/components/learn/UnitTemplate";
import { unit1 } from "@/lib/data/units/unit1";

export default function Unit1Page() {
  return <UnitTemplate unit={unit1} nextRoute="/learn/unit-2" />;
}
