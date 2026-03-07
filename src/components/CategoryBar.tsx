"use client";

import { CategoryScore, CategoryId } from "@/types";
import { categories } from "@/lib/questions";

interface CategoryBarProps {
  scores: CategoryScore[];
}

const accentMap: Record<CategoryId, string> = {
  body: "#C4956A",
  mind: "#B8956E",
  habit: "#C45B5B",
  relation: "#5B4A3A",
  work: "#8A8078",
  environment: "#A09080",
};

const labelMap: Record<CategoryId, string> = {
  body: "身体",
  mind: "心",
  habit: "習慣",
  relation: "関係",
  work: "仕事",
  environment: "環境",
};

export default function CategoryBar({ scores }: CategoryBarProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs tracking-[0.2em] text-text-secondary">
        CATEGORY SCORES
      </p>
      {scores.map((cs) => {
        const cat = categories.find((c) => c.id === cs.category)!;
        const pct = ((cs.score / 7) * 100).toFixed(0);
        return (
          <div key={cs.category} className="flex items-center gap-3">
            <span className="text-xs w-10 text-text-secondary shrink-0">
              {labelMap[cs.category]}
            </span>
            <div className="flex-1 h-2 bg-bar-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  backgroundColor: accentMap[cs.category],
                }}
              />
            </div>
            <span className="text-xs text-text-secondary tabular-nums w-8 text-right">
              {cs.score.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
