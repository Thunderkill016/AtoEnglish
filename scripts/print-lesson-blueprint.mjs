#!/usr/bin/env node
/** In checklist blueprint cho autopilot / agent khi sửa unit*.ts */
import { formatBlueprintChecklistForAgent, REFERENCE_UNIT_PATH } from "../src/lib/lessons/lesson-blueprint.ts";
import { formatCenterDesignGuideForAgent } from "../src/lib/lessons/lesson-center-reference.ts";

console.log(`Mẫu vàng: ${REFERENCE_UNIT_PATH}\n`);
console.log(formatCenterDesignGuideForAgent());
console.log("\n=== BLUEPRINT (field → section) ===\n");
console.log(formatBlueprintChecklistForAgent());