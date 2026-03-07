"use client";

import { useState } from "react";
import { Question, CategoryId } from "@/types";
import { categories } from "@/lib/questions";

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalInCategory: number;
  onAnswer: (value: number) => void;
}

const accentMap: Record<CategoryId, string> = {
  body: "#C4956A",
  mind: "#B8956E",
  habit: "#C45B5B",
  relation: "#5B4A3A",
  work: "#8A8078",
  environment: "#A09080",
};

export default function QuestionScreen({
  question,
  questionIndex,
  totalInCategory,
  onAnswer,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sleepValue, setSleepValue] = useState<number>(7.0);
  const [fading, setFading] = useState(false);

  const category = categories.find((c) => c.id === question.category)!;
  const accent = accentMap[question.category];

  const handleSelect = (value: number) => {
    if (fading) return;
    setSelected(value);
    setFading(true);

    setTimeout(() => {
      onAnswer(value);
    }, 800);
  };

  const handleSleepSubmit = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      onAnswer(sleepValue);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 transition-opacity duration-300 ease-out"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="w-full max-w-md">
        {/* Category and progress */}
        <div className="text-center mb-4">
          <p
            className="text-xs tracking-[0.2em] mb-2"
            style={{ color: accent }}
          >
            {category.label}
          </p>
          <p className="text-sm text-text-secondary">
            {questionIndex + 1} / {totalInCategory}
          </p>
        </div>

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-semibold text-center text-text-primary leading-relaxed mb-16 min-h-[4em] flex items-center justify-center">
          {question.text}
        </h2>

        {/* Answer input */}
        {question.type === "sleep" ? (
          <div className="text-center">
            <div className="mb-8">
              <span className="text-4xl font-bold text-text-primary tabular-nums">
                {sleepValue.toFixed(1)}
              </span>
              <span className="text-lg text-text-secondary ml-2">時間</span>
            </div>

            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={sleepValue}
              onChange={(e) => setSleepValue(parseFloat(e.target.value))}
              className="w-full mb-4 accent-current"
              style={{ accentColor: accent }}
            />

            <div className="flex justify-between text-xs text-text-secondary mb-12">
              <span>4.0h</span>
              <span>12.0h</span>
            </div>

            <button
              onClick={handleSleepSubmit}
              className="px-10 py-3.5 bg-btn-primary text-btn-text rounded-full text-sm font-medium
                         transition-all duration-300 ease-out
                         hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              次へ
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-center gap-3 md:gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSelect(value)}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 transition-all duration-200
                             flex items-center justify-center shrink-0"
                  style={{
                    borderColor:
                      selected === value ? accent : "#E8E0D8",
                    backgroundColor:
                      selected === value ? accent : "transparent",
                  }}
                >
                  {selected === value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-text-secondary px-1">
              <span>全くそう思わない</span>
              <span>とてもそう思う</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
