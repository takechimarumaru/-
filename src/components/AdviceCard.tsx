"use client";

import { CategoryId } from "@/types";
import { categoryAdvice } from "@/lib/questions";

interface AdviceCardProps {
  category: CategoryId;
  score: number;
}

const labelMap: Record<CategoryId, string> = {
  body: "身体",
  mind: "心",
  habit: "習慣",
  relation: "関係",
  work: "仕事",
  environment: "環境",
};

const accentMap: Record<CategoryId, string> = {
  body: "#C4956A",
  mind: "#B8956E",
  habit: "#C45B5B",
  relation: "#5B4A3A",
  work: "#8A8078",
  environment: "#A09080",
};

export default function AdviceCard({ category, score }: AdviceCardProps) {
  const advices = categoryAdvice[category];
  const advice = advices[Math.floor(Math.random() * advices.length)];

  return (
    <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-xs px-3 py-1 rounded-full text-white font-medium"
          style={{ backgroundColor: accentMap[category] }}
        >
          {labelMap[category]} {score.toFixed(1)}
        </span>
        <span className="text-xs text-text-secondary">
          改善で寿命が伸びる可能性
        </span>
      </div>
      <p className="text-sm text-text-primary leading-relaxed">{advice}</p>
    </div>
  );
}
