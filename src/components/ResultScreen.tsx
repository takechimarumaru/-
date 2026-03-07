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

  const [topLabel, setTopLabel] = useState("");
  const [bottomLabel, setBottomLabel] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
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

  useEffect(() => {
    addTimer(() => {
      setEntering(false);
      setEnterVisible(true);
      setDisplaySeconds(remainingSec);
      displayRef.current = remainingSec;
      setCurrentStep(1);
      setTopLabel(`推定寿命: ${result.estimatedLifespan.toFixed(1)}歳`);
      startCountdown();

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

              addTimer(() => {
                setTopLabel("");
                setBottomLabel("");
                setShowSummary(true);

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
    <div className="min-h-screen relative overflow-hidden">
      {entering && <div className="fixed inset-0 z-50" style={{ background: "#080808" }} />}

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
            {enterVisible && (
              <p
                className="mb-6 animate-fade-in"
                style={{ fontSize: 20, fontWeight: 300, color: "#5A5A5A", letterSpacing: "0.05em" }}
              >
                あなたの残り時間は…
              </p>
            )}

            {/* Top label */}
            <div className="h-8 flex items-center justify-center mb-4">
              {topLabel && (
                <p key={topLabel} className="animate-fade-in" style={{ fontSize: 14, fontWeight: 300, color: "#5A5A5A", letterSpacing: "0.05em" }}>
                  {topLabel}
                </p>
              )}
            </div>

            {/* Main seconds counter — per DESIGN.md: 120px, weight 300, letter-spacing 0.02em */}
            <div className="mb-2">
              <span
                className="mono tabular-nums transition-colors duration-500 block"
                style={{
                  fontSize: "clamp(64px, 15vw, 120px)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                  color: isReducing ? "#D4443B" : "#F0EDE8",
                }}
              >
                {formatSeconds(displaySeconds)}
              </span>
            </div>

            <p className="label mb-3">SECONDS</p>

            {/* Supplementary YMD */}
            <p
              style={{
                color: "rgba(232,232,232,0.5)",
                fontSize: "clamp(16px, 3vw, 24px)",
                fontWeight: 300,
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
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

            {/* Summary rows */}
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
                          color: isActive ? "#E8E8E8" : "#5A5A5A",
                          fontSize: 12,
                          fontWeight: 300,
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

          {/* Actions */}
          {showActions && (
            <div className="w-full animate-fade-in" style={{ marginTop: 100 }}>
              <div className="flex flex-col items-center gap-8">
                <ShareButton seconds={displaySeconds} result={result} />

                <button
                  onClick={onRestart}
                  className="mono transition-colors duration-200"
                  style={{ fontSize: 12, color: "#5A5A5A", letterSpacing: "0.05em", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#E8E8E8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#5A5A5A"; }}
                >
                  もう一度測定する
                </button>

                <p style={{ fontSize: 10, color: "#3A3A3A", textAlign: "center", lineHeight: 1.8, marginTop: 24 }}>
                  この結果は統計データに基づく推定であり、
                  <br />
                  医学的な正確性を保証するものではありません。
                </p>

                {/* Logo */}
                <div
                  className="flex flex-col items-center gap-1 transition-opacity duration-500 cursor-default"
                  style={{ marginTop: 40, opacity: 0.7 }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "1.0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                >
                  <img
                    src="/logo.png"
                    alt="こす.くま"
                    style={{ width: 150, filter: "invert(1) brightness(1.8)", mixBlendMode: "screen" }}
                  />
                  <span style={{ fontSize: 8, color: "#3A3A3A", letterSpacing: "0.1em" }}>
                    こす.くま
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
