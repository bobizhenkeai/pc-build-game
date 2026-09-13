import partsJson from "../data/parts.json";
import { CATEGORIES, type Category, type InstalledMap, type Part } from "../types/game";

const grouped = partsJson as Record<Category, Part[]>;

export const ALL_PARTS: Part[] = CATEGORIES.flatMap((category) => grouped[category]);

export const PARTS_BY_CATEGORY: Record<Category, Part[]> = grouped;

export const PARTS_BY_ID: Record<string, Part> = Object.fromEntries(
  ALL_PARTS.map((part) => [part.id, part]),
);

export function getPart(id: string | undefined): Part | undefined {
  if (!id) return undefined;
  return PARTS_BY_ID[id];
}

export function resolveBuild(installed: InstalledMap): Partial<Record<Category, Part>> {
  const build: Partial<Record<Category, Part>> = {};
  for (const category of CATEGORIES) {
    const part = getPart(installed[category]);
    if (part) build[category] = part;
  }
  return build;
}

export function partsInCategory(category: Category): Part[] {
  return PARTS_BY_CATEGORY[category];
}

export function countByCategory(): Record<Category, number> {
  return Object.fromEntries(
    CATEGORIES.map((category) => [category, PARTS_BY_CATEGORY[category].length]),
  ) as Record<Category, number>;
}
