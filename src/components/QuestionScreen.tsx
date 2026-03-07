"use client";

import { useState } from "react";
import { Question } from "@/types";
import { categories } from "@/lib/questions";

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalInCategory: number;
  globalIndex: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
}

export default function QuestionScreen({
  question,
  questionIndex,
  totalInCategory,
  globalIndex,
  totalQuestions,
  onAnswer,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sleepValue, setSleepValue] = useState<number>(7.0);
  const [phase, setPhase] = useState<"visible" | "fading" | "gap" | "done">("visible");

  const category = categories.find((c) => c.id === question.category)!;
  const globalProgress = (globalIndex / totalQuestions) * 100;
  const questionNumber = String(globalIndex + 1).padStart(2, "0");

  const handleSelect = (value: number) => {
    if (phase !== "visible") return;
    setSelected(value);
    setPhase("fading");

    // 0.3s wait → 300ms fade out → 500ms gap → fire answer
    setTimeout(() => {
      setPhase("gap");
      setTimeout(() => {
        onAnswer(value);
      }, 500);
    }, 600); // 300ms wait + 300ms fade
  };

  const handleSleepSubmit = () => {
    if (phase !== "visible") return;
    setPhase("fading");
    setTimeout(() => {
      setPhase("gap");
      setTimeout(() => {
        onAnswer(sleepValue);
      }, 500);
    }, 600);
  };

  const opacity = phase === "visible" ? 1 : phase === "fading" ? 0 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar - top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[2px] bg-bg-surface w-full">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 transition-opacity duration-300 ease-out"
        style={{ opacity }}
      >
        <div className="w-full max-w-md">
          {/* Question number - top left area */}
          <div className="flex items-baseline justify-between mb-16">
            <p className="mono text-text-secondary text-xs tracking-wider">
              Q.{questionNumber}
            </p>
            <div className="flex items-center gap-3">
              <p className="label">
                {category.label}
              </p>
              <p className="text-text-secondary text-xs mono tabular-nums">
                {questionIndex + 1} / {totalInCategory}
              </p>
            </div>
          </div>

          {/* Question text */}
          <h2 className="text-[20px] font-light text-white leading-relaxed mb-20 min-h-[3em] flex items-center">
            {question.text}
          </h2>

          {/* Answer input */}
          {question.type === "sleep" ? (
            <div className="text-center">
              <div className="mb-10">
                <span className="mono tabular-nums text-5xl font-extralight text-white tracking-wider">
                  {sleepValue.toFixed(1)}
                </span>
                <span className="label ml-3">HOURS</span>
              </div>

              <input
                type="range"
                min={4}
                max={12}
                step={0.5}
                value={sleepValue}
                onChange={(e) => setSleepValue(parseFloat(e.target.value))}
                className="w-full mb-4"
              />

              <div className="flex justify-between label mb-16">
                <span>4.0</span>
                <span>12.0</span>
              </div>

              <button
                onClick={handleSleepSubmit}
                className="px-12 py-3 border border-white/30 text-white text-sm font-light tracking-[0.15em]
                           transition-all duration-300 ease-out
                           hover:border-white/60 hover:bg-white/5
                           active:scale-[0.98]"
              >
                次へ
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center gap-4 md:gap-5 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSelect(value)}
                    className="w-12 h-12 rounded-full border transition-all duration-200
                               flex items-center justify-center shrink-0"
                    style={{
                      borderColor: selected === value ? "#FFFFFF" : "rgba(255,255,255,0.2)",
                      backgroundColor: selected === value ? "#FFFFFF" : "transparent",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between label px-1">
                <span>全くそう思わない</span>
                <span>とてもそう思う</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
