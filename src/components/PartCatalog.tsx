import { CATEGORIES, type Category, type Part } from "../types/game";
import { SLOT_LABELS } from "../engine/copy";
import { partsInCategory } from "../engine/catalog";

interface Props {
  activeCategory: Category;
  onCategory: (category: Category) => void;
  holdingId: string | null;
  onPick: (id: string) => void;
}

export function PartCatalog({ activeCategory, onCategory, holdingId, onPick }: Props) {
  const parts = partsInCategory(activeCategory);

  return (
    <section className="panel catalog">
      <div className="catalog-head">
        <h2>配件柜</h2>
        <p className="hint">先点配件，再点工作台上的插槽。再点一次取消手持。</p>
      </div>
      <div className="tabs">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`tab ${activeCategory === category ? "active" : ""}`}
            onClick={() => onCategory(category)}
            type="button"
          >
            {SLOT_LABELS[category]}
          </button>
        ))}
      </div>
      <div className="part-list">
        {parts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
            selected={holdingId === part.id}
            onPick={onPick}
          />
        ))}
      </div>
    </section>
  );
}

function PartCard({
  part,
  selected,
  onPick,
}: {
  part: Part;
  selected: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`part-card ${selected ? "holding" : ""}`}
      onClick={() => onPick(part.id)}
    >
      <div className="row">
        <span className="name">{part.name}</span>
        <span className="price mono">¥{part.price}</span>
      </div>
      <div className="blurb">{part.blurb}</div>
      <div className="specs">
        {part.specs.map((spec) => (
          <span key={spec}>{spec}</span>
        ))}
      </div>
    </button>
  );
}
