import { resolveBuild } from "./catalog";
import type { BuildStats, InstalledMap } from "../types/game";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ramScore(gb: number): number {
  if (gb <= 0) return 0;
  if (gb <= 8) return 36;
  if (gb <= 16) return 58;
  if (gb <= 32) return 76;
  return 92;
}

export function computeBuildStats(installed: InstalledMap): BuildStats {
  const build = resolveBuild(installed);
  const cpu = build.cpu;
  const gpu = build.gpu;
  const memory = build.memory;
  const motherboard = build.motherboard;
  const psu = build.psu;
  const pcCase = build.case;

  const ramGB = memory?.capacityGB ?? 0;
  const hasDedicatedGpu = Boolean(gpu);
  const igpuGaming = cpu?.hasIgpu ? Math.round(cpu.perf.gaming * 0.38) : 0;
  const gpuOffice = gpu?.perf.office ?? (cpu?.hasIgpu ? 48 : 8);
  const gpuGaming = gpu?.perf.gaming ?? igpuGaming;
  const gpuEdit = gpu?.perf.edit ?? (cpu?.hasIgpu ? 34 : 8);

  const tdp = (cpu?.tdp ?? 0) + (gpu?.tdp ?? (cpu ? 12 : 0)) + (cpu ? 48 : 0);
  const requiredWattage = tdp > 0 ? Math.round(tdp * 1.15) : 0;

  const office = cpu
    ? clamp(cpu.perf.office * 0.52 + ramScore(ramGB) * 0.28 + gpuOffice * 0.2)
    : 0;
  const gaming = cpu
    ? clamp(cpu.perf.gaming * 0.32 + gpuGaming * 0.56 + ramScore(ramGB) * 0.12)
    : 0;
  const edit = cpu
    ? clamp(cpu.perf.edit * 0.46 + ramScore(ramGB) * 0.26 + gpuEdit * 0.28)
    : 0;

  const support = ((motherboard?.perf.office ?? 50) + (pcCase?.perf.office ?? 50) + (psu?.perf.office ?? 50)) / 3;
  const overall = cpu ? clamp(office * 0.28 + gaming * 0.36 + edit * 0.26 + support * 0.1) : 0;

  const price =
    (cpu?.price ?? 0) +
    (motherboard?.price ?? 0) +
    (memory?.price ?? 0) +
    (gpu?.price ?? 0) +
    (psu?.price ?? 0) +
    (pcCase?.price ?? 0);

  return {
    price,
    tdp,
    requiredWattage,
    office,
    gaming,
    edit,
    overall,
    ramGB,
    hasDedicatedGpu,
  };
}
