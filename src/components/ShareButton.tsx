"use client";

import { useState, useCallback } from "react";
import { CalculationResult } from "@/types";
import { secondsToYMD } from "@/lib/animations";

interface ShareButtonProps {
  seconds: number;
  result: CalculationResult;
}

export default function ShareButton({ seconds, result }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const ymd = secondsToYMD(result.healthySeconds);
  const shareText = `残り${ymd.years}年${ymd.months}ヶ月。思ったより少なかった。 #寿命測定`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "寿命測定", text: shareText });
        return;
      } catch {
        // Fallback below
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, "_blank", "noopener");
  }, [shareText]);

  return (
    <button
      onClick={handleShare}
      className="px-10 py-4 border border-white/20 text-white text-sm mono tracking-[0.15em]
                 transition-all duration-300 ease-out
                 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,206,209,0.1)]
                 active:scale-[0.98]"
    >
      {copied ? "コピーしました" : "結果をシェアする"}
    </button>
  );
}
