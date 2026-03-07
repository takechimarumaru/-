"use client";

import { useEffect, useState, useRef } from "react";
import { CategoryId } from "@/types";
import ParticleCanvas from "./ParticleCanvas";

interface CategoryTransitionProps {
  completedCategoryId: CategoryId;
  isLast: boolean;
  onComplete: () => void;
}

const completionMessages: Record<CategoryId, string> = {
  body: "身体の声を聞きました",
  mind: "心の輪郭が見えてきました",
  habit: "習慣があなたを形づくっている",
  relation: "つながりの重さを量りました",
  work: "あなたの時間の使い方が見えました",
  environment: "すべての要素が揃いました。算出を開始します。",
};

const categoryGlowColors: Record<CategoryId, string> = {
  body: "rgba(0,206,209,0.1)",
  mind: "rgba(155,89,182,0.1)",
  habit: "rgba(255,107,53,0.1)",
  relation: "rgba(0,229,160,0.1)",
  work: "rgba(74,144,217,0.1)",
  environment: "rgba(231,76,158,0.1)",
};

function LoadingScramble() {
  const [display, setDisplay] = useState("000,000,000");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      if (elapsed < 3000) {
        const r = () => Math.floor(Math.random() * 10);
        setDisplay(`${r()}${r()}${r()},${r()}${r()}${r()},${r()}${r()}${r()}`);
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="mono tabular-nums text-4xl md:text-5xl font-bold tracking-wider text-white/40 mt-8 animate-fade-in">
      {display}
    </div>
  );
}

export default function CategoryTransition({
  completedCategoryId,
  isLast,
  onComplete,
}: CategoryTransitionProps) {
  const [visible, setVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSubliminal, setShowSubliminal] = useState(false);

  const message = completionMessages[completedCategoryId];
  const glowColor = categoryGlowColors[completedCategoryId];

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);
    // Subliminal logo flash at the moment of appearance
    const tSub = setTimeout(() => setShowSubliminal(true), 200);
    const tSubOff = setTimeout(() => setShowSubliminal(false), 350); // 150ms duration

    if (isLast) {
      const t2 = setTimeout(() => setShowLoading(true), 1500);
      const t3 = setTimeout(onComplete, 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tSub); clearTimeout(tSubOff); };
    } else {
      const t2 = setTimeout(() => setVisible(false), 2000);
      const t3 = setTimeout(onComplete, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tSub); clearTimeout(tSubOff); };
    }
  }, [isLast, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 grid-bg relative overflow-hidden">
      {/* Particle background */}
      <ParticleCanvas />

      {/* Category color glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      />

      {/* Subliminal logo flash */}
      {showSubliminal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <img
            src="/logo.png"
            alt=""
            style={{ width: 200, opacity: 0.4, filter: "invert(1)" }}
          />
        </div>
      )}

      <div
        className="text-center transition-opacity duration-500 ease-out relative"
        style={{ opacity: visible ? 1 : 0, zIndex: 2 }}
      >
        <p className={`text-lg md:text-xl font-light text-white/80 tracking-wide leading-relaxed ${visible ? "animate-glitch-in" : ""}`}>
          {message}
        </p>

        {isLast && showLoading && <LoadingScramble />}
      </div>
    </div>
  );
}
