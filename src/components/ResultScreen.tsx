"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { CalculationResult, BasicInfo, CategoryId } from "@/types";
import { animateValue, secondsToYMD, formatSeconds } from "@/lib/animations";
import CategoryBar from "./CategoryBar";
import AdviceCard from "./AdviceCard";
import ShareButton from "./ShareButton";

interface ResultScreenProps {
  result: CalculationResult;
  info: BasicInfo;
  onRestart: () => void;
}

type Stage = "entering" | "step1" | "step2-counting" | "step2-text" | "step3-counting" | "step3-text" | "silence" | "final";

// Hourglass SVG
function HourglassIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-6"
    >
      <path
        d="M14 6h20v10l-7 8 7 8v10H14V32l7-8-7-8V6z"
        stroke="#2D2A26"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 38h12v-6l-6-6-6 6v6z"
        fill="#C4956A"
        opacity="0.5"
      />
      <line x1="10" y1="6" x2="38" y2="6" stroke="#2D2A26" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="42" x2="38" y2="42" stroke="#2D2A26" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ResultScreen({
  result,
  info,
  onRestart,
}: ResultScreenProps) {
  const [stage, setStage] = useState<Stage>("entering");
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [step2Text, setStep2Text] = useState(false);
  const [step3Text, setStep3Text] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);

  const cancelAnimRef = useRef<(() => void) | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayRef = useRef(0);

  // Keep displayRef in sync
  useEffect(() => {
    displayRef.current = displaySeconds;
  }, [displaySeconds]);

  // Start countdown ticking
  useEffect(() => {
    if (!countdownActive) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      return;
    }

    countdownRef.current = setInterval(() => {
      setDisplaySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [countdownActive]);

  // Stage machine
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Entering: dark screen for 1s, then fade in
    if (stage === "entering") {
      timers.push(setTimeout(() => {
        setEnterVisible(true);
        setStage("step1");
        setDisplaySeconds(Math.round(result.remainingSeconds));
        setCountdownActive(true);
      }, 1000));
    }

    // After 5s in step1, start step2
    if (stage === "step1") {
      timers.push(setTimeout(() => {
        setStage("step2-counting");
        setCountdownActive(false);

        // Animate down to awakeSeconds over 3s
        cancelAnimRef.current = animateValue(
          displayRef.current,
          Math.round(result.awakeSeconds),
          3000,
          (v) => setDisplaySeconds(v),
          () => {
            setStage("step2-text");
            setStep2Text(true);
            setCountdownActive(true);
          }
        );
      }, 5000));
    }

    // After 5s in step2-text, start step3
    if (stage === "step2-text") {
      timers.push(setTimeout(() => {
        setStage("step3-counting");
        setCountdownActive(false);

        cancelAnimRef.current = animateValue(
          displayRef.current,
          Math.round(result.healthySeconds),
          3000,
          (v) => setDisplaySeconds(v),
          () => {
            setStage("step3-text");
            setStep3Text(true);
            setCountdownActive(true);
          }
        );
      }, 5000));
    }

    // After step3-text, silence then show actions
    if (stage === "step3-text") {
      timers.push(setTimeout(() => {
        setStep2Text(false);
        setStep3Text(false);
        setStage("silence");
      }, 3000));
    }

    if (stage === "silence") {
      timers.push(setTimeout(() => {
        setShowActions(true);
        setStage("final");
      }, 7000));
    }

    return () => {
      timers.forEach(clearTimeout);
      if (cancelAnimRef.current) {
        cancelAnimRef.current();
        cancelAnimRef.current = null;
      }
    };
  }, [stage, result]);

  const ymd = secondsToYMD(result.remainingSeconds);

  // Find 2 lowest-scoring categories for advice
  const lowestCategories = useMemo(() => {
    return [...result.categoryScores]
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);
  }, [result.categoryScores]);

  // Block gauge: fraction of remaining life
  const lifeFraction = Math.min(1, result.remainingYears / result.estimatedLifespan);

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Dark overlay for entering */}
      {stage === "entering" && (
        <div className="fixed inset-0 bg-[#2D2A26] z-50 transition-opacity duration-800"
             style={{ opacity: 1 }} />
      )}

      <div
        className="transition-opacity duration-800 ease-out"
        style={{ opacity: enterVisible ? 1 : 0 }}
      >
        {/* Main result section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <HourglassIcon />

          <p className="text-xs tracking-[0.2em] text-text-secondary mb-6">
            YOUR REMAINING TIME
          </p>

          {/* Years/months/days */}
          <p className="text-lg md:text-xl text-text-primary font-semibold mb-2">
            残り {ymd.years}年 {ymd.months}ヶ月 {ymd.days}日
          </p>

          {/* Countdown */}
          <div className="mb-4">
            <span className="tabular-nums font-bold text-5xl md:text-6xl text-text-primary">
              {formatSeconds(displaySeconds)}
            </span>
            <span className="text-lg text-text-secondary ml-2">秒</span>
          </div>

          {/* Step messages */}
          <div className="h-12 flex items-center justify-center mb-8">
            {step2Text && (
              <p className="text-sm text-text-secondary animate-fade-in text-center">
                あなたは人生の1/3を眠っている
              </p>
            )}
            {step3Text && (
              <p className="text-sm text-text-secondary animate-fade-in text-center">
                健康に動ける時間は、さらに短い
              </p>
            )}
          </div>

          {/* Life info */}
          <div className="text-sm text-text-secondary text-center mb-6 space-y-1">
            <p>推定寿命: {result.estimatedLifespan.toFixed(1)}歳</p>
            <p>現在の年齢: {info.age}歳</p>
          </div>

          {/* Block gauge */}
          <div className="w-full max-w-xs mb-12">
            <div className="h-3 bg-bar-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-btn-primary rounded-full transition-all duration-700"
                style={{ width: `${lifeFraction * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0</span>
              <span>{result.estimatedLifespan.toFixed(0)}歳</span>
            </div>
          </div>

          {/* Category scores */}
          <div className="w-full max-w-sm">
            <CategoryBar scores={result.categoryScores} />
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="px-6 pb-20 animate-fade-in">
            <div className="max-w-sm mx-auto">
              {/* Advice cards */}
              <div className="space-y-4 mb-12">
                <p className="text-xs tracking-[0.2em] text-text-secondary">
                  IMPROVEMENT
                </p>
                {lowestCategories.map((cs) => (
                  <AdviceCard
                    key={cs.category}
                    category={cs.category}
                    score={cs.score}
                  />
                ))}
              </div>

              {/* Share + restart */}
              <div className="flex flex-col items-center gap-6 mb-12">
                <ShareButton seconds={displaySeconds} />

                <button
                  onClick={onRestart}
                  className="text-sm text-text-secondary underline underline-offset-4
                             hover:text-text-primary transition-colors duration-200"
                >
                  もう一度やり直す
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                この結果は統計データとAIの推定に基づくもので、
                <br />
                医学的な正確性を保証するものではありません。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
