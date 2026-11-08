export type ActiveTab = 'units' | 'tools' | 'estimation' | 'word-problems' | 'number-line' | 'challenge';

export type AppLanguage = 'en' | 'tl';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  station: ActiveTab;
}

export interface UnitItem {
  id: string;
  name: string;
  correctUnit: 'cm' | 'm';
  reason: string;
  iconName: string;
  typicalSize: string;
}

export interface ToolScenario {
  id: string;
  question: string;
  correctTool: 'ruler' | 'tape' | 'meter_stick';
  explanation: string;
  hint: string;
  iconName: string;
}

export interface MeasureLabItem {
  id: string;
  name: string;
  actualLengthCm: number;
  color: string;
  svgShape: 'pencil' | 'eraser' | 'candy' | 'crayon' | 'leaf' | 'key' | 'spoon';
}

export interface EstimationItem {
  id: string;
  name: string;
  visualDescription: string;
  unit: 'cm' | 'm';
  actualValue: number;
  options: number[];
  benchmarkHint: string;
  category: 'small' | 'large';
  icon: string;
}

export interface WordProblem {
  id: string;
  title: string;
  story: string;
  category: 'addition' | 'subtraction' | 'comparison' | 'distance';
  partA: number;
  partB: number;
  unit: 'cm' | 'm';
  operation: '+' | '-';
  correctAnswer: number;
  barModelType: 'part-part-whole' | 'comparison' | 'take-away';
  hint: string;
  stepExplanation: string;
}

export interface HopStep {
  from: number;
  to: number;
  amount: number;
  label: string;
}

export interface NumberLineChallenge {
  id: string;
  title: string;
  start: number;
  subtract: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}
