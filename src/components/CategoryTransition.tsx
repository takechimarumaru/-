"use client";

import { useEffect, useState, useRef } from "react";
import { CategoryId } from "@/types";

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

  const message = completionMessages[completedCategoryId];

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
    <div className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <div
        className="text-center transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="text-lg md:text-xl font-light text-white/80 tracking-wide leading-relaxed">
          {message}
        </p>

        {isLast && showLoading && <LoadingScramble />}
      </div>
    </div>
  );
}
