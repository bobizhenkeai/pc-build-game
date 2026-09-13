import type { PowerOnResult, Scenario } from "../types/game";

interface Props {
  result: PowerOnResult | null;
  scenario: Scenario | undefined;
  onClose: () => void;
}

export function PowerModal({ result, scenario, onClose }: Props) {
  if (!result) return null;

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-label="开机结果">
        <h2>{result.blocked ? "没点亮" : "主机亮了"}</h2>
        {result.blocked ? (
          <p className="block-line">{result.blockLine}</p>
        ) : (
          <p className="roast">{result.roast}</p>
        )}
        <p>
          造价 ¥{result.stats.price} · 办公 {result.stats.office} · 游戏 {result.stats.gaming} · 剪辑{" "}
          {result.stats.edit}
        </p>
        {scenario ? (
          <div className="issues" style={{ padding: 0 }}>
            <div className={`issue ${result.scenarioPassed ? "ok" : "warn"}`}>
              {result.scenarioPassed ? `${scenario.name} 过线了。` : `${scenario.name} 还没过。`}
            </div>
            {result.scenarioNotes.map((note) => (
              <div key={note} className="hint">
                {note}
              </div>
            ))}
          </div>
        ) : null}
        <button className="btn btn-primary" type="button" onClick={onClose} style={{ marginTop: 16 }}>
          回到工作台
        </button>
      </div>
    </div>
  );
}
