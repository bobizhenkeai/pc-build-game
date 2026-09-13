import { describe, expect, it } from "vitest";
import { CATEGORIES } from "../types/game";
import { HARD_BLOCK_LINE, ROAST_LINES, SLOT_LABELS } from "./copy";
import { ALL_PARTS, countByCategory, PARTS_BY_ID } from "./catalog";
import { evaluateCompatibility, hasHardIssues } from "./compatibility";
import { powerOn, roastForStars, starsFromScore } from "./scoring";
import { CANONICAL_ROUTES, SCENARIOS } from "./scenarios";
import type { InstalledMap, StarCount } from "../types/game";

describe("catalog", () => {
  it("ships 6-8 fake parts per category", () => {
    const counts = countByCategory();
    for (const category of CATEGORIES) {
      expect(counts[category], category).toBeGreaterThanOrEqual(6);
      expect(counts[category], category).toBeLessThanOrEqual(8);
    }
    expect(ALL_PARTS.every((part) => PARTS_BY_ID[part.id])).toBe(true);
  });
});

describe("copy", () => {
  it("keeps roast lines exact", () => {
    expect(ROAST_LINES[1]).toBe("★☆☆ 「能亮就不错了，别指望它跑大作。」");
    expect(ROAST_LINES[2]).toBe("★★☆ 「能干活，但风扇声能给你唱 lullaby。」");
    expect(ROAST_LINES[3]).toBe("★★★ 「均衡局，预算没乱花。」");
    expect(ROAST_LINES[4]).toBe("★★★★ 「这台有点东西，邻居开始眼红。」");
    expect(ROAST_LINES[5]).toBe("★★★★★ 「天花板配置，钱包先躺平。」");
  });

  it("keeps the hard-block line exact", () => {
    expect(HARD_BLOCK_LINE).toBe("先把红字灭了再炫技。");
  });

  it("labels empty slots in Chinese categories", () => {
    expect(SLOT_LABELS.cpu).toBe("CPU");
    expect(SLOT_LABELS.motherboard).toBe("主板");
    expect(SLOT_LABELS.memory).toBe("内存");
    expect(SLOT_LABELS.gpu).toBe("显卡");
    expect(SLOT_LABELS.psu).toBe("电源");
    expect(SLOT_LABELS.case).toBe("机箱");
  });
});

describe("compatibility", () => {
  it("hard-blocks an empty bench and missing display", () => {
    const empty = evaluateCompatibility({});
    expect(hasHardIssues(empty)).toBe(true);
    expect(empty.some((issue) => issue.id.startsWith("missing-"))).toBe(true);

    const noDisplay: InstalledMap = {
      cpu: "cpu-i5-14400f",
      motherboard: "mb-b760a-d5",
      memory: "ram-d5-32",
      psu: "psu-650",
      case: "case-atx-air",
    };
    const issues = evaluateCompatibility(noDisplay);
    expect(issues.some((issue) => issue.id === "no-display" && issue.level === "hard")).toBe(true);
    expect(powerOn(noDisplay, null).blockLine).toBe(HARD_BLOCK_LINE);
  });

  it("hard-blocks socket, memory, case, length, and PSU mismatches", () => {
    expect(
      evaluateCompatibility({
        cpu: "cpu-r5-8600",
        motherboard: "mb-b760m-d4",
        memory: "ram-d4-16",
        psu: "psu-550",
        case: "case-matx-quiet",
      }).some((issue) => issue.id === "socket-mismatch" && issue.level === "hard"),
    ).toBe(true);

    expect(
      evaluateCompatibility({
        cpu: "cpu-r5-8600",
        motherboard: "mb-b650m",
        memory: "ram-d4-16",
        psu: "psu-550",
        case: "case-matx-quiet",
      }).some((issue) => issue.id === "memory-mismatch" && issue.level === "hard"),
    ).toBe(true);

    expect(
      evaluateCompatibility({
        cpu: "cpu-r3-8500",
        motherboard: "mb-b650a",
        memory: "ram-d5-16",
        psu: "psu-550",
        case: "case-itx",
      }).some((issue) => issue.id === "form-factor" && issue.level === "hard"),
    ).toBe(true);

    expect(
      evaluateCompatibility({
        cpu: "cpu-r9-8900x",
        motherboard: "mb-x670e",
        memory: "ram-d5-64",
        gpu: "gpu-c90",
        psu: "psu-1000",
        case: "case-itx",
      }).some((issue) => issue.id === "gpu-length" && issue.level === "hard"),
    ).toBe(true);

    expect(
      evaluateCompatibility({
        cpu: "cpu-r9-8900x",
        motherboard: "mb-x670e",
        memory: "ram-d5-32",
        gpu: "gpu-c90",
        psu: "psu-350",
        case: "case-atx-create",
      }).some((issue) => issue.id === "psu-hard" && issue.level === "hard"),
    ).toBe(true);
  });

  it("lets yellow warnings power on", () => {
    const igpuOnly: InstalledMap = {
      cpu: "cpu-r3-8500",
      motherboard: "mb-b650m",
      memory: "ram-d5-8",
      psu: "psu-550",
      case: "case-matx-quiet",
    };
    const issues = evaluateCompatibility(igpuOnly);
    expect(hasHardIssues(issues)).toBe(false);
    expect(issues.some((issue) => issue.level === "warn")).toBe(true);
    const result = powerOn(igpuOnly, null);
    expect(result.blocked).toBe(false);
    expect(result.roast).toBeTruthy();
  });
});

describe("scoring", () => {
  it("maps every star to the exact roast line", () => {
    const stars = [1, 2, 3, 4, 5] as StarCount[];
    for (const star of stars) {
      expect(roastForStars(star)).toBe(ROAST_LINES[star]);
    }
    expect(starsFromScore(10)).toBe(1);
    expect(starsFromScore(50)).toBe(2);
    expect(starsFromScore(60)).toBe(3);
    expect(starsFromScore(75)).toBe(4);
    expect(starsFromScore(90)).toBe(5);
  });

  it("roasts a ceiling build with five stars", () => {
    const ceiling: InstalledMap = {
      cpu: "cpu-r9-8900x",
      motherboard: "mb-x670e",
      memory: "ram-d5-64",
      gpu: "gpu-c90",
      psu: "psu-1000",
      case: "case-atx-create",
    };
    const result = powerOn(ceiling, null);
    expect(result.blocked).toBe(false);
    expect(result.stars).toBe(5);
    expect(result.roast).toBe(ROAST_LINES[5]);
  });
});

describe("scenarios", () => {
  it("offers three optional scenarios with two clear routes each", () => {
    expect(SCENARIOS.map((scenario) => scenario.name)).toEqual([
      "入门办公",
      "中档电竞",
      "卡预算剪辑",
    ]);

    for (const scenario of SCENARIOS) {
      const routes = CANONICAL_ROUTES[scenario.id];
      expect(routes.length).toBeGreaterThanOrEqual(2);
      for (const route of routes) {
        const result = powerOn(route, scenario.id);
        expect(result.blocked, `${scenario.id} route blocked`).toBe(false);
        expect(result.scenarioPassed, `${scenario.id} route failed`).toBe(true);
        expect(result.roast).toBeTruthy();
      }
    }
  });
});
