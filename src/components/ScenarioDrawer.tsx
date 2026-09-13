import { SCENARIO_SECONDARY } from "../engine/copy";
import { SCENARIOS } from "../engine/scenarios";

interface Props {
  open: boolean;
  activeId: string | null;
  onClose: () => void;
  onChoose: (id: string | null) => void;
}

export function ScenarioDrawer({ open, activeId, onClose, onChoose }: Props) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-label={SCENARIO_SECONDARY}>
        <h2>{SCENARIO_SECONDARY}</h2>
        <p className="hint">可选。不选就是自由组装。每个场景至少两条能过线的平台路线。</p>
        <div className="scenario-grid">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={`scenario-card ${activeId === scenario.id ? "active" : ""}`}
              onClick={() => onChoose(scenario.id)}
            >
              <div className="row">
                <strong>{scenario.name}</strong>
                <span className="price mono">¥{scenario.budget}</span>
              </div>
              <div>{scenario.tagline}</div>
              <p className="blurb">{scenario.story}</p>
              <ul>
                {scenario.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button className="btn" type="button" onClick={() => onChoose(null)}>
            回到自由组装
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
