"use client";

import { useCallback } from "react";
import { CalculationResult } from "@/types";
import { secondsToYMD } from "@/lib/animations";

interface ShareButtonProps {
  seconds: number;
  result: CalculationResult;
}

function formatOkuManSeconds(seconds: number): string {
  const oku = Math.floor(seconds / 100_000_000);
  const remainder = seconds % 100_000_000;
  const senman = Math.floor(remainder / 10_000_000);

  if (oku > 0 && senman > 0) {
    return `${oku}億${senman}千万`;
  } else if (oku > 0) {
    return `${oku}億`;
  } else if (senman > 0) {
    return `${senman}千万`;
  }
  return `${Math.round(seconds / 10000)}万`;
}

export default function ShareButton({ seconds, result }: ShareButtonProps) {
  const ymd = secondsToYMD(seconds);
  const shareText = `残り${ymd.years}年${ymd.months}ヶ月。思ったより少なかった。\n\n#寿命測定\nhttps://five-gamma-45.vercel.app`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "寿命測定", text: shareText });
        return;
      } catch {
        // User cancelled or error — fall through to X
      }
    }

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, "_blank", "noopener");
  }, [shareText]);

  return (
    <button
      onClick={handleShare}
      className="mono transition-all duration-300 ease-out active:scale-[0.98]"
      style={{
        padding: "16px 40px",
        border: "1px solid rgba(232,232,232,0.15)",
        borderRadius: 0,
        background: "transparent",
        color: "#E8E8E8",
        fontSize: 14,
        fontWeight: 300,
        letterSpacing: "0.15em",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(232,232,232,0.35)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(232,232,232,0.15)"; }}
    >
      結果をシェアする
    </button>
  );
}
