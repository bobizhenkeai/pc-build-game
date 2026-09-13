import { CATEGORIES, type Category, type InstalledMap, type Part } from "../types/game";
import { SLOT_LABELS } from "../engine/copy";
import { getPart } from "../engine/catalog";

interface Props {
  installed: InstalledMap;
  holding: Part | undefined;
  onSlot: (category: Category) => void;
  onCancel: () => void;
  onClear: () => void;
}

export function Workbench({ installed, holding, onSlot, onCancel, onClear }: Props) {
  return (
    <section className="panel bench">
      <div className="bench-head">
        <h2>工作台</h2>
        <p className="hint">空槽显示类别。手持配件时，同类别插槽会亮起来。已装配件再点一次即可拆下。</p>
      </div>
      {holding ? (
        <div className="holding-bar">
          <div>
            手持：<strong>{holding.name}</strong>
            <div className="hint">点对应插槽安装或替换，Esc / 取消 放下。</div>
          </div>
          <button className="btn" type="button" onClick={onCancel}>
            取消
          </button>
        </div>
      ) : (
        <div className="holding-bar" style={{ borderStyle: "solid", borderColor: "var(--line)", background: "transparent" }}>
          <div className="hint">没有手持配件。从左边柜子点一件，再点插槽。</div>
          <button className="btn btn-ghost" type="button" onClick={onClear}>
            清空工作台
          </button>
        </div>
      )}
      <div className="slots">
        {CATEGORIES.map((category) => {
          const part = getPart(installed[category]);
          const match = holding?.category === category;
          return (
            <button
              key={category}
              type="button"
              className={`slot ${part ? "filled" : ""} ${match ? "match" : ""}`}
              onClick={() => onSlot(category)}
            >
              <div className="slot-kicker">{SLOT_LABELS[category]}</div>
              {part ? (
                <>
                  <div className="name">{part.name}</div>
                  <div className="blurb">{part.specs.join(" · ")}</div>
                  <div className="price mono">¥{part.price}</div>
                </>
              ) : (
                <div className="slot-empty">{SLOT_LABELS[category]}</div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
