export const CATEGORIES = [
  "cpu",
  "motherboard",
  "memory",
  "gpu",
  "psu",
  "case",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Socket = "AM5" | "LGA1700";
export type MemoryType = "DDR4" | "DDR5";
export type FormFactor = "ITX" | "mATX" | "ATX";

export interface PerfScores {
  office: number;
  gaming: number;
  edit: number;
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  blurb: string;
  specs: string[];
  socket?: Socket;
  hasIgpu?: boolean;
  tdp?: number;
  chipset?: string;
  memoryType?: MemoryType;
  formFactor?: FormFactor;
  supportedFormFactors?: FormFactor[];
  capacityGB?: number;
  wattage?: number;
  lengthMm?: number;
  gpuClearanceMm?: number;
  tdpComfort?: number;
  perf: PerfScores;
}

export type InstalledMap = Partial<Record<Category, string>>;

export type IssueLevel = "hard" | "warn";

export interface CompatIssue {
  id: string;
  level: IssueLevel;
  text: string;
}

export interface BuildStats {
  price: number;
  tdp: number;
  requiredWattage: number;
  office: number;
  gaming: number;
  edit: number;
  overall: number;
  ramGB: number;
  hasDedicatedGpu: boolean;
}

export type StarCount = 1 | 2 | 3 | 4 | 5;

export interface ScenarioGoal {
  id: string;
  label: string;
  check: (stats: BuildStats, issues: CompatIssue[]) => boolean;
}

export interface Scenario {
  id: string;
  name: string;
  tagline: string;
  budget: number;
  story: string;
  hints: string[];
  goals: ScenarioGoal[];
}

export interface PowerOnResult {
  blocked: boolean;
  blockLine: string | null;
  stars: StarCount | null;
  roast: string | null;
  stats: BuildStats;
  scenarioPassed: boolean | null;
  scenarioNotes: string[];
}
