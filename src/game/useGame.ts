import { useEffect, useMemo, useState } from "react";
import { getPart } from "../engine/catalog";
import { evaluateCompatibility } from "../engine/compatibility";
import { powerOn } from "../engine/scoring";
import { computeBuildStats } from "../engine/stats";
import { getScenario } from "../engine/scenarios";
import type { Category, InstalledMap, PowerOnResult } from "../types/game";

export function useGame() {
  const [installed, setInstalled] = useState<InstalledMap>({});
  const [holdingId, setHoldingId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [powerResult, setPowerResult] = useState<PowerOnResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("cpu");

  const holding = getPart(holdingId ?? undefined);
  const issues = useMemo(() => evaluateCompatibility(installed), [installed]);
  const stats = useMemo(() => computeBuildStats(installed), [installed]);
  const scenario = getScenario(scenarioId);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoldingId(null);
        setScenarioOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function pickPart(id: string) {
    setHoldingId((current) => (current === id ? null : id));
    const part = getPart(id);
    if (part) setActiveCategory(part.category);
  }

  function cancelHold() {
    setHoldingId(null);
  }

  function clickSlot(category: Category) {
    if (holding) {
      if (holding.category !== category) return;
      setInstalled((current) => ({ ...current, [category]: holding.id }));
      setHoldingId(null);
      return;
    }
    if (installed[category]) {
      setInstalled((current) => {
        const next = { ...current };
        delete next[category];
        return next;
      });
    }
  }

  function clearBench() {
    setInstalled({});
    setHoldingId(null);
    setPowerResult(null);
  }

  function tryPowerOn() {
    setPowerResult(powerOn(installed, scenarioId));
  }

  function chooseScenario(id: string | null) {
    setScenarioId(id);
    setScenarioOpen(false);
    setPowerResult(null);
  }

  return {
    installed,
    holding,
    holdingId,
    issues,
    stats,
    scenario,
    scenarioId,
    scenarioOpen,
    setScenarioOpen,
    powerResult,
    setPowerResult,
    activeCategory,
    setActiveCategory,
    pickPart,
    cancelHold,
    clickSlot,
    clearBench,
    tryPowerOn,
    chooseScenario,
  };
}
