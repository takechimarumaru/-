"use client";

import { useState } from "react";
import { Question, CategoryId, Answers } from "@/types";
import { categories } from "@/lib/questions";

interface CategoryPageScreenProps {
  categoryId: CategoryId;
  categoryQuestions: Question[];
  categoryIndex: number;
  totalCategories: number;
  onComplete: (answers: Answers) => void;
}

const gradientClass: Record<CategoryId, string> = {
  body: "gradient-text-body",
  mind: "gradient-text-mind",
  habit: "gradient-text-habit",
  relation: "gradient-text-relation",
  work: "gradient-text-work",
  environment: "gradient-text-environment",
};

const glowClass: Record<CategoryId, string> = {
  body: "glow-body",
  mind: "glow-mind",
  habit: "glow-habit",
  relation: "glow-relation",
  work: "glow-work",
  environment: "glow-environment",
};

const barGradientClass: Record<CategoryId, string> = {
  body: "gradient-body",
  mind: "gradient-mind",
  habit: "gradient-habit",
  relation: "gradient-relation",
  work: "gradient-work",
  environment: "gradient-environment",
};

const categoryGlowColor: Record<CategoryId, string> = {
  body: "rgba(0,206,209,0.5)",
  mind: "rgba(155,89,182,0.5)",
  habit: "rgba(255,107,53,0.5)",
  relation: "rgba(0,229,160,0.5)",
  work: "rgba(74,144,217,0.5)",
  environment: "rgba(231,76,158,0.5)",
};

const categoryGradientCSS: Record<CategoryId, string> = {
  body: "linear-gradient(135deg, rgba(0,206,209,0.4), rgba(0,191,255,0.4))",
  mind: "linear-gradient(135deg, rgba(155,89,182,0.4), rgba(231,76,158,0.4))",
  habit: "linear-gradient(135deg, rgba(255,107,53,0.4), rgba(255,215,0,0.4))",
  relation: "linear-gradient(135deg, rgba(0,229,160,0.4), rgba(0,206,209,0.4))",
  work: "linear-gradient(135deg, rgba(74,144,217,0.4), rgba(155,89,182,0.4))",
  environment: "linear-gradient(135deg, rgba(231,76,158,0.4), rgba(255,107,53,0.4))",
};

export default function CategoryPageScreen({
  categoryId,
  categoryQuestions,
  categoryIndex,
  totalCategories,
  onComplete,
}: CategoryPageScreenProps) {
  const [localAnswers, setLocalAnswers] = useState<Answers>({});
  const [sleepValue, setSleepValue] = useState<number>(7.0);
  const [fading, setFading] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId)!;
  const globalProgress = ((categoryIndex) / totalCategories) * 100;

  const allAnswered = categoryQuestions.every(
    (q) => q.type === "sleep" || localAnswers[q.id] !== undefined
  );

  const handleSelect = (questionId: number, value: number) => {
    setLocalAnswers((prev) => ({ ...prev, [questionId]: value }));
    const key = `${questionId}-${value}`;
    setAnimatingButton(key);
    setTimeout(() => setAnimatingButton(null), 200);
  };

  const handleSubmit = () => {
    if (fading) return;
    const finalAnswers = { ...localAnswers };
    const sleepQ = categoryQuestions.find((q) => q.type === "sleep");
    if (sleepQ) {
      finalAnswers[sleepQ.id] = sleepValue;
    }
    setFlashVisible(true);
    setFading(true);
    setTimeout(() => onComplete(finalAnswers), 400);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-400 ease-out ${fading ? "opacity-0" : "opacity-100"}`}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[2px] bg-bg-surface w-full">
          <div
            className={`h-full ${barGradientClass[categoryId]} transition-all duration-700 ease-out`}
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Psychedelic flash overlay */}
      {flashVisible && (
        <div
          className="fixed inset-0 z-40 pointer-events-none animate-flash"
          style={{ background: categoryGradientCSS[categoryId] }}
        />
      )}

      {/* Centered content — horizontal & vertical */}
      <div className="flex-1 flex items-center justify-center px-5 md:px-8 py-20">
        <div className="w-full" style={{ maxWidth: "600px" }}>
          {/* Category header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-2xl mono font-bold tracking-[0.2em] ${gradientClass[categoryId]}`}>
                {category.label}
              </h2>
              <span className="label">{categoryIndex + 1} / {totalCategories}</span>
            </div>
            <div className={`h-[1px] ${barGradientClass[categoryId]} opacity-30`} />
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {categoryQuestions.map((q, idx) => (
              <div key={q.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                {q.type === "sleep" ? (
                  <div className={`border border-white/8 p-5 ${glowClass[categoryId]}`}>
                    <div className="flex items-start gap-3 mb-5">
                      <span className="mono text-text-secondary text-xs mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] font-light leading-relaxed text-white/90">
                        {q.text}
                      </p>
                    </div>

                    <div className="text-center mb-4">
                      <span className="mono tabular-nums text-3xl font-bold text-white tracking-wider">
                        {sleepValue.toFixed(1)}
                      </span>
                      <span className="label ml-2">HOURS</span>
                    </div>

                    <input
                      type="range"
                      min={4}
                      max={12}
                      step={0.5}
                      value={sleepValue}
                      onChange={(e) => setSleepValue(parseFloat(e.target.value))}
                      className="w-full mb-2"
                    />

                    <div className="flex justify-between label">
                      <span>4.0</span>
                      <span>12.0</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="mono text-text-secondary text-xs mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] font-light leading-relaxed text-white/90 flex-1">
                        {q.text}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((value) => {
                        const selected = localAnswers[q.id] === value;
                        const btnKey = `${q.id}-${value}`;
                        const isAnimating = animatingButton === btnKey;
                        return (
                          <button
                            key={value}
                            onClick={() => handleSelect(q.id, value)}
                            className={`w-9 h-9 rounded-full border transition-all duration-200
                                       flex items-center justify-center shrink-0
                                       ${isAnimating ? "animate-pulse-glow" : ""}`}
                            style={{
                              borderColor: selected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.12)",
                              backgroundColor: selected ? "rgba(255,255,255,0.9)" : "transparent",
                              boxShadow: selected ? `0 0 20px ${categoryGlowColor[categoryId]}` : "none",
                            }}
                          />
                        );
                      })}
                    </div>

                    {idx === 0 && (
                      <div className="flex justify-end mt-1">
                        <div className="flex gap-2 w-[calc(7*2.25rem+6*0.5rem)]">
                          <span className="text-[9px] text-text-secondary tracking-wide">いいえ</span>
                          <span className="flex-1" />
                          <span className="text-[9px] text-text-secondary tracking-wide">はい</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-10 py-3.5 text-sm mono tracking-[0.15em] transition-all duration-300 ease-out border
                ${allAnswered
                  ? `border-white/20 text-white hover:border-white/40 ${glowClass[categoryId]} active:scale-[0.95]`
                  : "border-white/5 text-white/15 cursor-not-allowed"
                }`}
            >
              次へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
