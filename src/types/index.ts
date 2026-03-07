export type Gender = "male" | "female" | "other";

export type CategoryId =
  | "body"
  | "mind"
  | "habit"
  | "relation"
  | "work"
  | "environment";

export interface Question {
  id: number;
  category: CategoryId;
  text: string;
  dir: 1 | -1;
  weight: number;
  type: "scale" | "sleep";
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
}

export interface BasicInfo {
  age: number;
  gender: Gender;
}

export interface Answers {
  [questionId: number]: number;
}

export interface CategoryScore {
  category: CategoryId;
  score: number;
  impactYears: number;
}

export interface CalculationResult {
  estimatedLifespan: number;
  remainingYears: number;
  remainingSeconds: number;
  awakeSeconds: number;
  healthyRemainingSeconds: number;
  healthySeconds: number;
  categoryScores: CategoryScore[];
  sleepHours: number;
}

export type ScreenId =
  | "intro"
  | "basicInfo"
  | "questions"
  | "result";
