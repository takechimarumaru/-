import { BasicInfo, Answers, CategoryScore, CalculationResult, CategoryId } from "@/types";
import { questions } from "./questions";

const MAX_IMPACT: Record<CategoryId, number> = {
  body: 4.5,
  mind: 4.0,
  habit: 6.0,
  relation: 4.0,
  work: 3.5,
  environment: 3.5,
};

function getSleepScore(hours: number): number {
  const score = 7 - Math.abs(hours - 7) * 1.5;
  return Math.max(1, Math.min(7, score));
}

export function calculate(info: BasicInfo, answers: Answers): CalculationResult {
  const sleepQuestion = questions.find((q) => q.type === "sleep")!;
  const sleepHours = answers[sleepQuestion.id] || 7;

  const categoryIds: CategoryId[] = ["body", "mind", "habit", "relation", "work", "environment"];

  const categoryScores: CategoryScore[] = categoryIds.map((catId) => {
    const catQuestions = questions.filter((q) => q.category === catId);

    let weightedSum = 0;
    let totalWeight = 0;

    for (const q of catQuestions) {
      const raw = answers[q.id];
      if (raw === undefined) continue;

      let normalized: number;
      if (q.type === "sleep") {
        normalized = getSleepScore(raw);
      } else {
        normalized = q.dir === 1 ? raw : 8 - raw;
      }

      weightedSum += normalized * q.weight;
      totalWeight += q.weight;
    }

    const score = totalWeight > 0 ? weightedSum / totalWeight : 4.0;
    const impactYears = ((score - 4) / 3) * MAX_IMPACT[catId];

    return { category: catId, score, impactYears };
  });

  const ageMultiplier =
    info.age < 30 ? 1.15 :
    info.age < 50 ? 1.0 :
    info.age < 65 ? 0.85 :
    0.7;

  const baseLifespan =
    info.gender === "male" ? 81.5 :
    info.gender === "female" ? 87.6 :
    84.5;

  const totalAdjustment = categoryScores.reduce(
    (sum, cs) => sum + cs.impactYears * ageMultiplier,
    0
  );

  const estimatedLifespan = baseLifespan + totalAdjustment;
  const remainingYears = Math.max(0, estimatedLifespan - info.age);
  const remainingSeconds = remainingYears * 365.25 * 24 * 60 * 60;

  const awakeRatio = (24 - sleepHours) / 24;
  const awakeSeconds = remainingSeconds * awakeRatio;

  const healthyLifespan =
    info.gender === "male" ? 72 :
    info.gender === "female" ? 75 :
    73.5;
  const healthyRemainingYears = Math.max(0, healthyLifespan - info.age);
  const healthyRemainingSeconds = healthyRemainingYears * 365.25 * 24 * 60 * 60;
  const healthySeconds = healthyRemainingSeconds * awakeRatio;

  return {
    estimatedLifespan,
    remainingYears,
    remainingSeconds,
    awakeSeconds,
    healthyRemainingSeconds,
    healthySeconds,
    categoryScores,
    sleepHours,
  };
}
