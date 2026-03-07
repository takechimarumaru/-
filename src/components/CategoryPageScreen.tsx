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

const barGradientClass: Record<CategoryId, string> = {
  body: "gradient-body",
  mind: "gradient-mind",
  habit: "gradient-habit",
  relation: "gradient-relation",
  work: "gradient-work",
  environment: "gradient-environment",
};

const categoryFlashCSS: Record<CategoryId, string> = {
  body: "linear-gradient(135deg, rgba(196,149,106,0.06), rgba(212,165,116,0.06))",
  mind: "linear-gradient(135deg, rgba(123,143,161,0.06), rgba(143,165,183,0.06))",
  habit: "linear-gradient(135deg, rgba(164,90,82,0.06), rgba(184,107,98,0.06))",
  relation: "linear-gradient(135deg, rgba(107,143,113,0.06), rgba(125,163,131,0.06))",
  work: "linear-gradient(135deg, rgba(139,129,120,0.06), rgba(157,147,138,0.06))",
  environment: "linear-gradient(135deg, rgba(122,158,159,0.06), rgba(140,178,179,0.06))",
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

  const category = categories.find((c) => c.id === categoryId)!;
  const globalProgress = ((categoryIndex) / totalCategories) * 100;

  const allAnswered = categoryQuestions.every(
    (q) => q.type === "sleep" || localAnswers[q.id] !== undefined
  );

  const handleSelect = (questionId: number, value: number) => {
    setLocalAnswers((prev) => ({ ...prev, [questionId]: value }));
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
        <div className="h-[2px] w-full" style={{ background: "#0D0D0D" }}>
          <div
            className={`h-full ${barGradientClass[categoryId]} transition-all duration-700 ease-out`}
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Flash overlay + subliminal logo */}
      {flashVisible && (
        <>
          <div
            className="fixed inset-0 z-40 pointer-events-none animate-flash"
            style={{ background: categoryFlashCSS[categoryId] }}
          />
          <div
            className="fixed inset-0 z-[41] pointer-events-none flex items-center justify-center"
            style={{ animation: "subliminalFlash 150ms ease-out forwards" }}
          >
            <img
              src="/logo.png"
              alt=""
              style={{ width: 200, opacity: 0.3, filter: "invert(1)" }}
            />
          </div>
        </>
      )}

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-5 md:px-8 py-20">
        <div className="w-full" style={{ maxWidth: "600px" }}>
          {/* Category header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <h2
                className={`mono ${gradientClass[categoryId]}`}
                style={{ fontSize: 24, fontWeight: 300, letterSpacing: "0.2em" }}
              >
                {category.label}
              </h2>
              <span className="label">{categoryIndex + 1} / {totalCategories}</span>
            </div>
            <div className={`h-[1px] ${barGradientClass[categoryId]} opacity-20`} />
          </div>

          {/* Questions — per DESIGN.md: 18px, weight 300, letter-spacing 0.05em, line-height 2.0 */}
          <div className="space-y-8">
            {categoryQuestions.map((q, idx) => (
              <div key={q.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                {q.type === "sleep" ? (
                  <div style={{ border: "1px solid rgba(232,232,232,0.06)", borderRadius: 0, padding: 20 }}>
                    <div className="flex items-start gap-3 mb-5">
                      <span className="mono mt-0.5" style={{ fontSize: 12, color: "#5A5A5A" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 2.0, letterSpacing: "0.05em", color: "rgba(232,232,232,0.85)" }}>
                        {q.text}
                      </p>
                    </div>

                    <div className="text-center mb-4">
                      <span
                        className="mono tabular-nums"
                        style={{ fontSize: 30, fontWeight: 300, color: "#F5F5F5", letterSpacing: "0.02em" }}
                      >
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
                      <span className="mono mt-0.5" style={{ fontSize: 12, color: "#5A5A5A" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="flex-1" style={{ fontSize: 15, fontWeight: 300, lineHeight: 2.0, letterSpacing: "0.05em", color: "rgba(232,232,232,0.85)" }}>
                        {q.text}
                      </p>
                    </div>

                    {/* Radio buttons — circle border, selected = small white dot in center, NO glow */}
                    <div className="flex justify-end gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((value) => {
                        const selected = localAnswers[q.id] === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleSelect(q.id, value)}
                            className="flex items-center justify-center shrink-0 transition-all duration-200"
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              border: `1px solid ${selected ? "rgba(232,232,232,0.5)" : "rgba(232,232,232,0.1)"}`,
                              background: "transparent",
                            }}
                          >
                            {selected && (
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: "#E8E8E8",
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {idx === 0 && (
                      <div className="flex justify-end mt-1">
                        <div className="flex gap-2 w-[calc(7*2.25rem+6*0.5rem)]">
                          <span style={{ fontSize: 9, color: "#5A5A5A", letterSpacing: "0.05em" }}>いいえ</span>
                          <span className="flex-1" />
                          <span style={{ fontSize: 9, color: "#5A5A5A", letterSpacing: "0.05em" }}>はい</span>
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
              className="mono transition-all duration-300 ease-out active:scale-[0.95]"
              style={{
                padding: "14px 40px",
                fontSize: 14,
                fontWeight: 300,
                letterSpacing: "0.15em",
                border: `1px solid ${allAnswered ? "rgba(232,232,232,0.15)" : "rgba(232,232,232,0.04)"}`,
                borderRadius: 0,
                background: "transparent",
                color: allAnswered ? "#E8E8E8" : "rgba(232,232,232,0.12)",
                cursor: allAnswered ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => { if (allAnswered) e.currentTarget.style.borderColor = "rgba(232,232,232,0.35)"; }}
              onMouseLeave={(e) => { if (allAnswered) e.currentTarget.style.borderColor = "rgba(232,232,232,0.15)"; }}
            >
              次へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
