import { SLOT_LABELS } from "./copy";
import { resolveBuild } from "./catalog";
import type { CompatIssue, InstalledMap } from "../types/game";
import { computeBuildStats } from "./stats";

const REQUIRED: Array<"cpu" | "motherboard" | "memory" | "psu" | "case"> = [
  "cpu",
  "motherboard",
  "memory",
  "psu",
  "case",
];

export function evaluateCompatibility(installed: InstalledMap): CompatIssue[] {
  const build = resolveBuild(installed);
  const issues: CompatIssue[] = [];
  const cpu = build.cpu;
  const motherboard = build.motherboard;
  const memory = build.memory;
  const gpu = build.gpu;
  const psu = build.psu;
  const pcCase = build.case;

  for (const category of REQUIRED) {
    if (!build[category]) {
      issues.push({
        id: `missing-${category}`,
        level: "hard",
        text: `还没装${SLOT_LABELS[category]}，这台主机连骨架都没有。`,
      });
    }
  }

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push({
      id: "socket-mismatch",
      level: "hard",
      text: `CPU 是 ${cpu.socket}，主板是 ${motherboard.socket}，针脚对不上就是两块砖。`,
    });
  }

  if (memory && motherboard && memory.memoryType !== motherboard.memoryType) {
    issues.push({
      id: "memory-mismatch",
      level: "hard",
      text: `内存是 ${memory.memoryType}，主板只吃 ${motherboard.memoryType}。`,
    });
  }

  if (
    motherboard &&
    pcCase &&
    motherboard.formFactor &&
    pcCase.supportedFormFactors &&
    !pcCase.supportedFormFactors.includes(motherboard.formFactor)
  ) {
    issues.push({
      id: "form-factor",
      level: "hard",
      text: `${pcCase.name} 装不下 ${motherboard.formFactor} 主板。`,
    });
  }

  if (
    gpu &&
    pcCase &&
    gpu.lengthMm != null &&
    pcCase.gpuClearanceMm != null &&
    gpu.lengthMm > pcCase.gpuClearanceMm
  ) {
    issues.push({
      id: "gpu-length",
      level: "hard",
      text: `显卡 ${gpu.lengthMm}mm，机箱只让到 ${pcCase.gpuClearanceMm}mm，物理超模。`,
    });
  }

  if (cpu && !cpu.hasIgpu && !gpu) {
    issues.push({
      id: "no-display",
      level: "hard",
      text: `${cpu.name} 没有核显，不插独显就没有画面。`,
    });
  }

  const stats = computeBuildStats(installed);
  if (psu && stats.requiredWattage > 0) {
    if (psu.wattage != null && psu.wattage < stats.requiredWattage) {
      issues.push({
        id: "psu-hard",
        level: "hard",
        text: `整机大约需要 ${stats.requiredWattage}W，${psu.name} 只有 ${psu.wattage}W。`,
      });
    } else if (psu.wattage != null && psu.wattage < Math.round(stats.requiredWattage * 1.25)) {
      issues.push({
        id: "psu-tight",
        level: "warn",
        text: `电源余量偏紧（需求约 ${stats.requiredWattage}W / ${psu.wattage}W），满载会开始哼歌。`,
      });
    }
  }

  if (cpu && !gpu && cpu.hasIgpu) {
    issues.push({
      id: "igpu-only",
      level: "warn",
      text: "核显能亮，但大作请把期待值放回盒子里。",
    });
  }

  if (memory && memory.capacityGB != null && memory.capacityGB <= 8) {
    issues.push({
      id: "low-ram",
      level: "warn",
      text: "内存只有 8GB，浏览器一开多标签就会开始换气。",
    });
  }

  if (cpu && gpu && cpu.perf.gaming + 18 < gpu.perf.gaming) {
    issues.push({
      id: "cpu-bottleneck",
      level: "warn",
      text: "显卡很猛，CPU 在后面喘气，帧数会卡在处理器身上。",
    });
  }

  if (
    pcCase &&
    pcCase.tdpComfort != null &&
    stats.tdp > 0 &&
    stats.tdp > pcCase.tdpComfort
  ) {
    issues.push({
      id: "case-heat",
      level: "warn",
      text: "高功耗塞进这只箱子，风扇声能给你唱 lullaby。",
    });
  }

  if (motherboard && cpu && motherboard.price > cpu.price * 1.4 && cpu.price < 1600) {
    issues.push({
      id: "board-overkill",
      level: "warn",
      text: "主板比 CPU 还贵一截，面子工程可以，性价比在哭。",
    });
  }

  return issues;
}

export function hasHardIssues(issues: CompatIssue[]): boolean {
  return issues.some((issue) => issue.level === "hard");
}
