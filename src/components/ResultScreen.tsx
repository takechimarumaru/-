"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CalculationResult, BasicInfo } from "@/types";
import { easeInOutCubic, formatSeconds, secondsToYMD } from "@/lib/animations";
import ShareButton from "./ShareButton";

interface ResultScreenProps {
  result: CalculationResult;
  info: BasicInfo;
  onRestart: () => void;
}

export default function ResultScreen({
  result,
  info,
  onRestart,
}: ResultScreenProps) {
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [isReducing, setIsReducing] = useState(false);
  const [showYMD, setShowYMD] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);
  const [stepLabel, setStepLabel] = useState("");
  const [stepMessage, setStepMessage] = useState("");
  const [entering, setEntering] = useState(true);

  const displayRef = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    displayRef.current = displaySeconds;
  }, [displaySeconds]);

  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setDisplaySeconds((prev) => {
        const next = Math.max(0, prev - 1);
        displayRef.current = next;
        return next;
      });
    }, 1000);
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const animateToValue = useCallback((target: number, duration: number, onDone: () => void) => {
    const startVal = displayRef.current;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const current = Math.round(startVal + (target - startVal) * eased);
      displayRef.current = current;
      setDisplaySeconds(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
        onDone();
      }
    }

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  // Single imperative orchestration — no dependency on stage state
  useEffect(() => {
    const remainingSec = Math.round(result.remainingSeconds);
    const awakeSec = Math.round(result.awakeSeconds);
    const healthySec = Math.round(result.healthySeconds);

    // 1s dark → show counter with step1
    addTimer(() => {
      setEntering(false);
      setEnterVisible(true);
      setDisplaySeconds(remainingSec);
      displayRef.current = remainingSec;
      startCountdown();

      // After 5s → STEP 2: sleep reduction
      addTimer(() => {
        stopCountdown();
        setIsReducing(true);

        animateToValue(awakeSec, 3000, () => {
          setIsReducing(false);
          setStepMessage(
            `あなたは毎日${result.sleepHours.toFixed(1)}時間眠っている。起きている時間だけが、あなたの時間。`
          );
          setStepLabel("起きている時間のみ");
          startCountdown();

          // After 5s → STEP 3: healthy lifespan reduction
          addTimer(() => {
            stopCountdown();
            setStepMessage("");
            setIsReducing(true);

            animateToValue(healthySec, 3000, () => {
              setIsReducing(false);
              setStepMessage("健康に動ける時間は、さらに短い。");
              setStepLabel("健康寿命ベース × 起きている時間");
              startCountdown();

              // After 3s → convert to YMD
              addTimer(() => {
                setStepMessage("");

                // 3s pause then switch
                addTimer(() => {
                  setShowYMD(true);

                  // 8s silence then show actions
                  addTimer(() => {
                    setShowActions(true);
                  }, 8000);
                }, 3000);
              }, 3000);
            });
          }, 5000);
        });
      }, 5000);
    }, 1000);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ymd = secondsToYMD(displaySeconds);

  return (
    <div className="min-h-screen bg-bg-base grid-bg relative overflow-hidden">
      {entering && <div className="fixed inset-0 bg-bg-base z-50" />}

      <div className="wireframe-box w-48 h-48 top-10 -right-16 opacity-20" />
      <div className="wireframe-box w-28 h-28 bottom-32 -left-8 opacity-15" style={{ transform: "rotate(-25deg)" }} />

      <div
        className="transition-opacity duration-1000 ease-out"
        style={{ opacity: enterVisible ? 1 : 0 }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center">
            {/* Year/Month/Day display */}
            {showYMD && (
              <div className="mb-8 animate-fade-in">
                <p className="font-light tracking-wide text-white" style={{ fontSize: "clamp(36px, 8vw, 80px)", lineHeight: 1.3 }}>
                  残り{" "}
                  <span className="mono tabular-nums font-bold">{ymd.years}</span>年{" "}
                  <span className="mono tabular-nums font-bold">{ymd.months}</span>ヶ月{" "}
                  <span className="mono tabular-nums font-bold">{ymd.days}</span>日
                </p>
              </div>
            )}

            {/* Seconds counter */}
            <div className="mb-3">
              <span
                className="mono tabular-nums tracking-wider transition-all duration-500"
                style={{
                  fontSize: showYMD ? "22px" : "clamp(48px, 12vw, 84px)",
                  fontWeight: showYMD ? 400 : 200,
                  lineHeight: 1.1,
                  color: isReducing ? "#FF3333" : "#FFFFFF",
                }}
              >
                {formatSeconds(displaySeconds)}
              </span>
              {!showYMD && (
                <span className="label ml-3">SECONDS</span>
              )}
            </div>

            {/* Step label */}
            {stepLabel && (
              <p className="label mb-4 animate-fade-in">{stepLabel}</p>
            )}

            {/* Step messages */}
            <div className="h-16 flex items-center justify-center">
              {stepMessage && (
                <p key={stepMessage} className="text-sm font-light text-text-secondary animate-fade-in max-w-sm leading-relaxed">
                  {stepMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="px-6 pb-20 animate-fade-in">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-8">
              <ShareButton seconds={displaySeconds} result={result} />

              <button
                onClick={onRestart}
                className="text-xs text-text-secondary tracking-wider mono
                           hover:text-white transition-colors duration-200"
              >
                もう一度やり直す
              </button>

              <p className="text-[10px] text-text-secondary/40 text-center leading-relaxed mt-6">
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
