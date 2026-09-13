import { HARD_BLOCK_LINE, ROAST_LINES } from "./copy";
import { evaluateCompatibility, hasHardIssues } from "./compatibility";
import { computeBuildStats } from "./stats";
import { getScenario } from "./scenarios";
import type { InstalledMap, PowerOnResult, StarCount } from "../types/game";

export function starsFromScore(score: number): StarCount {
  if (score < 40) return 1;
  if (score < 54) return 2;
  if (score < 69) return 3;
  if (score < 83) return 4;
  return 5;
}

export function roastForStars(stars: StarCount): string {
  return ROAST_LINES[stars];
}

export function powerOn(installed: InstalledMap, scenarioId: string | null): PowerOnResult {
  const issues = evaluateCompatibility(installed);
  const stats = computeBuildStats(installed);
  const scenario = getScenario(scenarioId);

  if (hasHardIssues(issues)) {
    return {
      blocked: true,
      blockLine: HARD_BLOCK_LINE,
      stars: null,
      roast: null,
      stats,
      scenarioPassed: scenario ? false : null,
      scenarioNotes: scenario ? ["红字还在，挑战不算过。"] : [],
    };
  }

  let score = stats.overall;
  const scenarioNotes: string[] = [];
  let scenarioPassed: boolean | null = null;

  if (scenario) {
    const goalResults = scenario.goals.map((goal) => ({
      label: goal.label,
      ok: goal.check(stats, issues),
    }));
    scenarioPassed = goalResults.every((goal) => goal.ok);
    for (const goal of goalResults) {
      scenarioNotes.push(goal.ok ? `✓ ${goal.label}` : `✗ ${goal.label}`);
    }

    const focus =
      scenario.id === "office"
        ? stats.office
        : scenario.id === "esport"
          ? stats.gaming
          : stats.edit;
    const leftover = scenario.budget - stats.price;
    const budgetBonus = leftover >= 0 ? Math.min(8, leftover / 220) : Math.max(-14, leftover / 180);
    score = Math.max(0, Math.min(100, focus * 0.72 + stats.overall * 0.2 + 12 + budgetBonus));
    if (!scenarioPassed) score = Math.min(score, 52);
  }

  const stars = starsFromScore(score);
  return {
    blocked: false,
    blockLine: null,
    stars,
    roast: roastForStars(stars),
    stats,
    scenarioPassed,
    scenarioNotes,
  };
}
