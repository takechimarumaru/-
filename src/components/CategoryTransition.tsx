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
  body: "rgba(196,149,106,0.06)",
  mind: "rgba(123,143,161,0.06)",
  habit: "rgba(164,90,82,0.06)",
  relation: "rgba(107,143,113,0.06)",
  work: "rgba(139,129,120,0.06)",
  environment: "rgba(122,158,159,0.06)",
};

const categoryOverlayColors: Record<CategoryId, string> = {
  body: "#C4956A",
  mind: "#7B8FA1",
  habit: "#A45A52",
  relation: "#6B8F71",
  work: "#8B8178",
  environment: "#7A9E9F",
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
    <div
      className="mono tabular-nums mt-8 animate-fade-in"
      style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, letterSpacing: "0.02em", color: "rgba(232,232,232,0.3)" }}
    >
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

  const message = completionMessages[completedCategoryId];
  const glowColor = categoryGlowColors[completedCategoryId];
  const overlayColor = categoryOverlayColors[completedCategoryId];

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);

    if (isLast) {
      const t2 = setTimeout(() => setShowLoading(true), 1500);
      const t3 = setTimeout(onComplete, 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      const t2 = setTimeout(() => setVisible(false), 2000);
      const t3 = setTimeout(onComplete, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isLast, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 grid-bg relative overflow-hidden">
      {/* Full-screen category color flash overlay */}
      <div
        className="fixed inset-0 pointer-events-none animate-category-flash"
        style={{ background: overlayColor, zIndex: 3 }}
      />

      <ParticleCanvas />

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

      <div
        className="text-center relative"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 500ms ease-out", zIndex: 2 }}
      >
        <p
          className={visible ? "animate-fade-in" : ""}
          style={{
            fontSize: "clamp(18px, 4vw, 24px)",
            fontWeight: 200,
            letterSpacing: "0.1em",
            lineHeight: 2.0,
            color: "rgba(232,232,232,0.7)",
            padding: "0 20px",
          }}
        >
          {message}
        </p>

        {isLast && showLoading && <LoadingScramble />}
      </div>
    </div>
  );
}
