import type { InstalledMap, Scenario } from "../types/game";

export const SCENARIOS: Scenario[] = [
  {
    id: "office",
    name: "入门办公",
    tagline: "能亮、能打字、别超 2800。",
    budget: 2800,
    story: "同事只要一台不吵的文书机。核显就够，独显是智商税。平台随便挑，别把插座插反。",
    hints: [
      "路线 A：炎核带核显 + 星轨 B650 小板 + DDR5 16GB + 静音机箱。",
      "路线 B：蓝讯 i3 核显 + 蓝桥 DDR4 小板 + 16GB + 450W 铜芯。",
    ],
    goals: [
      {
        id: "office-budget",
        label: "造价不超过 ¥2800",
        check: (stats) => stats.price <= 2800,
      },
      {
        id: "office-score",
        label: "办公性能至少 58",
        check: (stats) => stats.office >= 58,
      },
      {
        id: "office-quiet",
        label: "别上高功耗独显（TDP ≤ 220）",
        check: (stats) => stats.tdp <= 220,
      },
    ],
  },
  {
    id: "esport",
    name: "中档电竞",
    tagline: "1080p 高帧，预算锁 6800。",
    budget: 6800,
    story: "室友要打竞技，核显免谈。炎核 + 霜刃，或蓝讯 F 系列 + 赤电，两条路都能过线。",
    hints: [
      "路线 A：炎核 R5-8600 + 星轨 B650-A + DDR5 32GB + 霜刃 760。",
      "路线 B：蓝讯 i5-14400F + 蓝桥 B760-A D5 + DDR5 32GB + 赤电 C60。F 必须插独显。",
    ],
    goals: [
      {
        id: "esport-budget",
        label: "造价不超过 ¥6800",
        check: (stats) => stats.price <= 6800,
      },
      {
        id: "esport-gpu",
        label: "必须有独显",
        check: (stats) => stats.hasDedicatedGpu,
      },
      {
        id: "esport-score",
        label: "游戏性能至少 68",
        check: (stats) => stats.gaming >= 68,
      },
    ],
  },
  {
    id: "edit",
    name: "卡预算剪辑",
    tagline: "时间线要顺，钱包只给 8800。",
    budget: 8800,
    story: "短视频剪 4K，内存别小于 32GB。多核 CPU + 能加速的显卡，两条平台都能做完。",
    hints: [
      "路线 A：炎核 R7-8700 + 64GB DDR5 + 霜刃 760 + 创作者塔。",
      "路线 B：蓝讯 i7-14700 + 32GB DDR5 + 赤电 C60 + 创作者塔。",
    ],
    goals: [
      {
        id: "edit-budget",
        label: "造价不超过 ¥8800",
        check: (stats) => stats.price <= 8800,
      },
      {
        id: "edit-ram",
        label: "内存至少 32GB",
        check: (stats) => stats.ramGB >= 32,
      },
      {
        id: "edit-score",
        label: "剪辑性能至少 70",
        check: (stats) => stats.edit >= 70,
      },
    ],
  },
];

export function getScenario(id: string | null | undefined): Scenario | undefined {
  if (!id) return undefined;
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export const CANONICAL_ROUTES: Record<string, InstalledMap[]> = {
  office: [
    {
      cpu: "cpu-r3-8500",
      motherboard: "mb-b650m",
      memory: "ram-d5-16",
      psu: "psu-550",
      case: "case-matx-quiet",
    },
    {
      cpu: "cpu-i3-14100",
      motherboard: "mb-b760m-d4",
      memory: "ram-d4-16",
      psu: "psu-450",
      case: "case-matx-quiet",
    },
  ],
  esport: [
    {
      cpu: "cpu-r5-8600",
      motherboard: "mb-b650a",
      memory: "ram-d5-32",
      gpu: "gpu-rx760",
      psu: "psu-750",
      case: "case-atx-esport",
    },
    {
      cpu: "cpu-i5-14400f",
      motherboard: "mb-b760a-d5",
      memory: "ram-d5-32",
      gpu: "gpu-c60",
      psu: "psu-650",
      case: "case-atx-air",
    },
  ],
  edit: [
    {
      cpu: "cpu-r7-8700",
      motherboard: "mb-b650a",
      memory: "ram-d5-64",
      gpu: "gpu-rx760",
      psu: "psu-750",
      case: "case-atx-create",
    },
    {
      cpu: "cpu-i7-14700",
      motherboard: "mb-z790e",
      memory: "ram-d5-32",
      gpu: "gpu-c60",
      psu: "psu-750",
      case: "case-atx-create",
    },
  ],
};
