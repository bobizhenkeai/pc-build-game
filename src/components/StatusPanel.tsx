import type { BuildStats, CompatIssue, Scenario } from "../types/game";

interface Props {
  issues: CompatIssue[];
  stats: BuildStats;
  scenario: Scenario | undefined;
}

export function StatusPanel({ issues, stats, scenario }: Props) {
  const hard = issues.filter((issue) => issue.level === "hard");
  const warns = issues.filter((issue) => issue.level === "warn");

  return (
    <aside className="panel status">
      <div className="status-head">
        <h2>兼容性</h2>
        <p className="hint">红字挡开机，黄字只提醒。</p>
      </div>
      <div className="issues">
        {hard.length === 0 && warns.length === 0 ? (
          <div className="issue ok">插槽齐了，红字也灭了。可以炫技了。</div>
        ) : null}
        {hard.map((issue) => (
          <div key={issue.id} className="issue hard">
            {issue.text}
          </div>
        ))}
        {warns.map((issue) => (
          <div key={issue.id} className="issue warn">
            {issue.text}
          </div>
        ))}
      </div>
      <div className="meters">
        <Meter label="办公" value={stats.office} />
        <Meter label="游戏" value={stats.gaming} />
        <Meter label="剪辑" value={stats.edit} />
        <div className="hint">
          功耗约 {stats.tdp}W · 建议电源 ≥ {stats.requiredWattage}W
          {scenario ? ` · 挑战预算 ¥${scenario.budget}` : ""}
        </div>
      </div>
    </aside>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <label>
        <span>{label}</span>
        <b className="mono">{value}</b>
      </label>
      <div className="bar">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
