"use client";

import { useCallback } from "react";
import { CalculationResult } from "@/types";

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
  const shareText = `残り${formatOkuManSeconds(seconds)}秒。思ったより少なかった。 #寿命測定`;

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
      className="px-10 py-4 border border-white/20 text-white text-sm mono tracking-[0.15em]
                 transition-all duration-300 ease-out
                 hover:bg-white hover:text-black
                 active:scale-[0.98]"
    >
      結果をシェアする
    </button>
  );
}
