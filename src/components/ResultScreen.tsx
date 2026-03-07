"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CalculationResult, BasicInfo } from "@/types";
import { easeInOutCubic, formatSeconds, secondsToYMD } from "@/lib/animations";
import ShareButton from "./ShareButton";
import ParticleCanvas from "./ParticleCanvas";
import FloatingShapes from "./FloatingShapes";

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
  const [showActions, setShowActions] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);
  const [entering, setEntering] = useState(true);

  // Step info text
  const [topLabel, setTopLabel] = useState("");
  const [bottomLabel, setBottomLabel] = useState("");
  // Track which step we're on for the summary highlight
  const [currentStep, setCurrentStep] = useState(0);
  // Show summary rows after STEP 3 complete
  const [showSummary, setShowSummary] = useState(false);

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

  // Derived values for summary
  const remainingSec = Math.round(result.remainingSeconds);
  const healthyRemainingSec = Math.round(result.healthyRemainingSeconds);
  const healthySec = Math.round(result.healthySeconds);

  const healthyLifespan =
    info.gender === "male" ? 72 :
    info.gender === "female" ? 75 :
    73.5;
  const awakeRatio = (24 - result.sleepHours) / 24;
  const sleepExcludedAge = info.age + (Math.max(0, healthyLifespan - info.age)) * awakeRatio;

  const summaryRows = [
    { label: "推定寿命", age: result.estimatedLifespan, seconds: remainingSec, step: 1 },
    { label: "健康寿命ベース", age: healthyLifespan, seconds: healthyRemainingSec, step: 2 },
    { label: "睡眠除外後", age: sleepExcludedAge, seconds: healthySec, step: 3 },
  ];

  // Single imperative orchestration
  useEffect(() => {
    // 1s dark → show counter with step1
    addTimer(() => {
      setEntering(false);
      setEnterVisible(true);
      setDisplaySeconds(remainingSec);
      displayRef.current = remainingSec;
      setCurrentStep(1);
      setTopLabel(`推定寿命: ${result.estimatedLifespan.toFixed(1)}歳`);
      startCountdown();

      // After 5s → STEP 2: healthy lifespan reduction
      addTimer(() => {
        stopCountdown();
        setIsReducing(true);
        setCurrentStep(2);
        setTopLabel("健康に動ける時間は、もっと短い");
        setBottomLabel("");

        animateToValue(healthyRemainingSec, 3000, () => {
          setIsReducing(false);
          setBottomLabel(`健康寿命ベース ${healthyLifespan.toFixed(0)}歳`);
          startCountdown();

          // After 5s → STEP 3: sleep exclusion
          addTimer(() => {
            stopCountdown();
            setIsReducing(true);
            setCurrentStep(3);
            setTopLabel(`あなたは毎日${result.sleepHours.toFixed(1)}時間眠っている`);
            setBottomLabel("");

            animateToValue(healthySec, 3000, () => {
              setIsReducing(false);
              setBottomLabel("起きている時間のみ");
              startCountdown();

              // After 3s → show summary
              addTimer(() => {
                setTopLabel("");
                setBottomLabel("");
                setShowSummary(true);

                // 8s silence then show actions
                addTimer(() => {
                  setShowActions(true);
                }, 8000);
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
    <div className="min-h-screen bg-bg-base relative overflow-hidden">
      {entering && <div className="fixed inset-0 bg-bg-base z-50" />}

      {/* Animated perspective grid */}
      <div className="perspective-grid">
        <div className="perspective-grid-inner" />
      </div>

      {/* Floating wireframe shapes */}
      <FloatingShapes />

      {/* Particle starfield */}
      <ParticleCanvas />

      <div
        className="transition-opacity duration-1000 ease-out relative"
        style={{ opacity: enterVisible ? 1 : 0, zIndex: 2 }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center">
            {/* Top label — reason text */}
            <div className="h-8 flex items-center justify-center mb-4">
              {topLabel && (
                <p key={topLabel} className="text-sm font-light text-text-secondary animate-fade-in tracking-wide">
                  {topLabel}
                </p>
              )}
            </div>

            {/* Main seconds counter — largest element */}
            <div className="mb-2">
              <span
                className="mono tabular-nums tracking-wider transition-colors duration-500 block"
                style={{
                  fontSize: "clamp(64px, 15vw, 120px)",
                  fontWeight: 200,
                  lineHeight: 1.1,
                  color: isReducing ? "#FF3333" : "#FFFFFF",
                }}
              >
                {formatSeconds(displaySeconds)}
              </span>
            </div>

            {/* SECONDS label */}
            <p className="label mb-3">SECONDS</p>

            {/* Supplementary YMD */}
            <p className="text-white/60 text-2xl font-light tracking-wide mb-4" style={{ fontSize: "clamp(16px, 3vw, 24px)" }}>
              残り{" "}
              <span className="mono tabular-nums">{ymd.years}</span>年{" "}
              <span className="mono tabular-nums">{ymd.months}</span>ヶ月{" "}
              <span className="mono tabular-nums">{ymd.days}</span>日
            </p>

            {/* Bottom label */}
            <div className="h-8 flex items-center justify-center">
              {bottomLabel && (
                <p key={bottomLabel} className="label animate-fade-in">{bottomLabel}</p>
              )}
            </div>

            {/* Summary rows — after STEP 3 */}
            {showSummary && (
              <div className="mt-10 animate-fade-in">
                <div className="inline-block text-left">
                  {summaryRows.map((row) => {
                    const isActive = row.step === currentStep;
                    return (
                      <div
                        key={row.step}
                        className="flex items-baseline gap-4 mb-1.5"
                        style={{
                          color: isActive ? "#FFFFFF" : "#666666",
                          fontSize: "12px",
                        }}
                      >
                        <span className="mono w-28 shrink-0">{row.label}</span>
                        <span className="mono tabular-nums">{row.age.toFixed(1)}歳</span>
                        <span className="mx-1">残り</span>
                        <span className="mono tabular-nums">{secondsToYMD(row.seconds).years}年{secondsToYMD(row.seconds).months}ヶ月{secondsToYMD(row.seconds).days}日</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions — centered below counter */}
          {showActions && (
            <div className="mt-16 w-full animate-fade-in">
              <div className="flex flex-col items-center gap-8">
                <ShareButton seconds={displaySeconds} result={result} />

                <button
                  onClick={onRestart}
                  className="text-xs text-text-secondary tracking-wider mono
                             hover:text-white transition-colors duration-200"
                >
                  もう一度測定する
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

      {/* Logo — bottom right */}
      <div
        className="fixed flex flex-col items-center gap-1 transition-opacity duration-500 cursor-default"
        style={{ bottom: 30, right: 30, opacity: 0.6, zIndex: 3 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
      >
        <img
          src="/logo.svg"
          alt=""
          className="w-[120px]"
          style={{ filter: "invert(1)" }}
        />
        <span style={{ fontSize: 10, color: "#666", letterSpacing: "0.1em" }}>
          こす.くま
        </span>
      </div>
    </div>
  );
}
