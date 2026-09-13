import { POWER_PRIMARY, SCENARIO_SECONDARY, TITLE } from "./engine/copy";
import { PartCatalog } from "./components/PartCatalog";
import { PowerModal } from "./components/PowerModal";
import { ScenarioDrawer } from "./components/ScenarioDrawer";
import { StatusPanel } from "./components/StatusPanel";
import { Workbench } from "./components/Workbench";
import { useGame } from "./game/useGame";
import "./App.css";

export default function App() {
  const game = useGame();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{TITLE}</h1>
          <p>自由组装优先 · 点配件，再点插槽</p>
        </div>
        <div className="top-actions">
          <span className="mode-chip">{game.scenario ? game.scenario.name : "自由组装"}</span>
          <span className="price-chip">
            当前造价 <strong className="mono">¥{game.stats.price}</strong>
          </span>
          <button className="btn" type="button" onClick={() => game.setScenarioOpen(true)}>
            {SCENARIO_SECONDARY}
          </button>
          <button className="btn btn-primary" type="button" onClick={game.tryPowerOn}>
            {POWER_PRIMARY}
          </button>
        </div>
      </header>

      <main className="workspace">
        <PartCatalog
          activeCategory={game.activeCategory}
          onCategory={game.setActiveCategory}
          holdingId={game.holdingId}
          onPick={game.pickPart}
        />
        <Workbench
          installed={game.installed}
          holding={game.holding}
          onSlot={game.clickSlot}
          onCancel={game.cancelHold}
          onClear={game.clearBench}
        />
        <StatusPanel issues={game.issues} stats={game.stats} scenario={game.scenario} />
      </main>

      <p className="footer-note">配件数据是虚构型号。红字硬伤挡开机，黄字警告仍可点亮。</p>

      <ScenarioDrawer
        open={game.scenarioOpen}
        activeId={game.scenarioId}
        onClose={() => game.setScenarioOpen(false)}
        onChoose={game.chooseScenario}
      />
      <PowerModal
        result={game.powerResult}
        scenario={game.scenario}
        onClose={() => game.setPowerResult(null)}
      />
    </div>
  );
}
