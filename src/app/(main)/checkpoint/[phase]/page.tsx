import { StatLine } from "@/components/ui/page";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/constants/units";
import CheckpointClient from "./CheckpointClient";

interface Props {
  params: Promise<{ phase: string }>;
}

// Phase definitions: which CEFR levels each phase covers
const PHASE_CONFIG: Record<string, {
  label: string;
  levels: string[];
  nextPhase: string | null;
  description: string;
}> = {
  a0: {
    label: "Nền Tảng A0",
    levels: ["A0"],
    nextPhase: "a1",
    description: "Kiểm tra bảng chữ cái, số đếm, chào hỏi và từ vựng cơ bản",
  },
  a1: {
    label: "Sơ Cấp A1",
    levels: ["A1"],
    nextPhase: "a2",
    description: "Kiểm tra thì hiện tại, câu hỏi Wh-, danh từ và cấu trúc câu cơ bản",
  },
  a2: {
    label: "Tiền Trung Cấp A2",
    levels: ["A2"],
    nextPhase: "b1",
    description: "Kiểm tra thì quá khứ, so sánh, liên từ và từ vựng hàng ngày",
  },
  b1: {
    label: "Trung Cấp B1",
    levels: ["B1"],
    nextPhase: "b2",
    description: "Kiểm tra thì hoàn thành, điều kiện và giao tiếp công việc",
  },
  b2: {
    label: "Trên Trung Cấp B2",
    levels: ["B2"],
    nextPhase: null,
    description: "Kiểm tra cấu trúc nâng cao, idioms và văn phong học thuật",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phase } = await params;
  const cfg = PHASE_CONFIG[phase];
  if (!cfg) return { title: "Checkpoint | AtoEnglish" };
  return {
    title: `Kiểm Tra ${cfg.label} | AtoEnglish`,
    description: cfg.description,
    robots: { index: false },
  };
}

export default async function CheckpointPage({ params }: Props) {
  const { phase } = await params;
  const cfg = PHASE_CONFIG[phase];

  if (!cfg) redirect("/learn");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get completed units for this phase
  const phaseUnits = UNITS.filter(u => cfg.levels.includes(u.level));
  const phaseUnitIds = phaseUnits.map(u => u.id);

  const { data: completedRows } = await supabase
    .from("user_lesson_progress")
    .select("unit_id")
    .eq("user_id", user.id)
    .in("unit_id", phaseUnitIds);

  const completedUnitIds = new Set((completedRows ?? []).map(r => r.unit_id));
  const completedCount = completedUnitIds.size;
  const totalCount = phaseUnitIds.length;
  const isUnlocked = completedCount === totalCount;

  return (
    <CheckpointClient
      phase={phase}
      phaseLabel={cfg.label}
      description={cfg.description}
      levels={cfg.levels}
      completedCount={completedCount}
      totalCount={totalCount}
      isUnlocked={isUnlocked}
      nextPhase={cfg.nextPhase}
      unitIds={phaseUnitIds}
    />
  );
}
