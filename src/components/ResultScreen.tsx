"use client";

import { useEffect, useState, useRef } from "react";
import { CalculationResult, BasicInfo } from "@/types";
import { animateValue, formatSeconds } from "@/lib/animations";
import ShareButton from "./ShareButton";

interface ResultScreenProps {
  result: CalculationResult;
  info: BasicInfo;
  onRestart: () => void;
}

type Stage =
  | "entering"
  | "step1"
  | "step2-counting"
  | "step2-text"
  | "step3-counting"
  | "step3-text"
  | "silence"
  | "final";

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
  const [isReducing, setIsReducing] = useState(false);

  const cancelAnimRef = useRef<(() => void) | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayRef = useRef(0);

  useEffect(() => {
    displayRef.current = displaySeconds;
  }, [displaySeconds]);

  // Countdown ticking
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

    if (stage === "entering") {
      timers.push(setTimeout(() => {
        setEnterVisible(true);
        setStage("step1");
        setDisplaySeconds(Math.round(result.remainingSeconds));
        setCountdownActive(true);
      }, 1000));
    }

    // STEP 1: 5 seconds of full remaining time
    if (stage === "step1") {
      timers.push(setTimeout(() => {
        setStage("step2-counting");
        setCountdownActive(false);
        setIsReducing(true);

        // 3s silent reduction
        cancelAnimRef.current = animateValue(
          displayRef.current,
          Math.round(result.awakeSeconds),
          3000,
          (v) => setDisplaySeconds(v),
          () => {
            setIsReducing(false);
            setStage("step2-text");
            setStep2Text(true);
            setCountdownActive(true);
          }
        );
      }, 5000));
    }

    // STEP 2 text: 5 seconds, then step 3
    if (stage === "step2-text") {
      timers.push(setTimeout(() => {
        setStage("step3-counting");
        setCountdownActive(false);
        setStep2Text(false);
        setIsReducing(true);

        // 3s silent reduction
        cancelAnimRef.current = animateValue(
          displayRef.current,
          Math.round(result.healthySeconds),
          3000,
          (v) => setDisplaySeconds(v),
          () => {
            setIsReducing(false);
            setStage("step3-text");
            setStep3Text(true);
            setCountdownActive(true);
          }
        );
      }, 5000));
    }

    // STEP 3 text: clear text, enter silence
    if (stage === "step3-text") {
      timers.push(setTimeout(() => {
        setStep3Text(false);
        setStage("silence");
      }, 3000));
    }

    // Silence: 8 seconds, then show actions
    if (stage === "silence") {
      timers.push(setTimeout(() => {
        setShowActions(true);
        setStage("final");
      }, 8000));
    }

    return () => {
      timers.forEach(clearTimeout);
      if (cancelAnimRef.current) {
        cancelAnimRef.current();
        cancelAnimRef.current = null;
      }
    };
  }, [stage, result]);

  const isFinal = stage === "final" || stage === "silence";

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Dark overlay for entering */}
      {stage === "entering" && (
        <div className="fixed inset-0 bg-bg-base z-50" />
      )}

      <div
        className="transition-opacity duration-1000 ease-out"
        style={{ opacity: enterVisible ? 1 : 0 }}
      >
        {/* Main countdown section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center">
            {/* Counter */}
            <div className="mb-4">
              <span
                className="mono tabular-nums font-extralight tracking-wider transition-colors duration-500"
                style={{
                  fontSize: isFinal ? "100px" : "80px",
                  lineHeight: 1.1,
                  color: isReducing ? "#FF3333" : "#FFFFFF",
                }}
              >
                {formatSeconds(displaySeconds)}
              </span>
            </div>

            <p className="label mb-8">
              SECONDS
            </p>

            {/* Step messages */}
            <div className="h-12 flex items-center justify-center">
              {step2Text && (
                <p className="text-sm font-light text-text-secondary animate-fade-in">
                  あなたは人生の1/3を眠っている
                </p>
              )}
              {step3Text && (
                <p className="text-sm font-light text-text-secondary animate-fade-in">
                  健康に動ける時間は、さらに短い
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions - fade in after silence */}
        {showActions && (
          <div className="px-6 pb-20 animate-fade-in">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-8">
              <ShareButton seconds={displaySeconds} />

              <button
                onClick={onRestart}
                className="text-xs text-text-secondary tracking-wider
                           hover:text-white transition-colors duration-200"
              >
                もう一度やり直す
              </button>

              <p className="text-[10px] text-text-secondary/50 text-center leading-relaxed mt-8">
                この結果は統計データに基づく推定であり、
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
