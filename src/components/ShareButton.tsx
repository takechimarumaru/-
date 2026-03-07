"use client";

import { useState, useCallback } from "react";

interface ShareButtonProps {
  seconds: number;
}

function generateOGPImage(seconds: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;

    // Black background
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, 1200, 630);

    // Seconds - large white text
    const formatted = Math.round(seconds).toLocaleString("en-US");
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "200 96px monospace";
    ctx.textAlign = "center";
    ctx.fillText(formatted, 600, 320);

    // Label below
    ctx.fillStyle = "#666666";
    ctx.font = "200 20px monospace";
    ctx.letterSpacing = "8px";
    ctx.fillText("SECONDS", 600, 380);

    // Footer
    ctx.fillStyle = "#333333";
    ctx.font = "16px monospace";
    ctx.fillText("#LifeTimer", 600, 560);

    resolve(canvas.toDataURL("image/png"));
  });
}

export default function ShareButton({ seconds }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const okuUnit = Math.floor(seconds / 100000000);
  const senManUnit = Math.floor((seconds % 100000000) / 10000000);
  const shareLabel =
    okuUnit > 0
      ? `${okuUnit}億${senManUnit > 0 ? `${senManUnit}千万` : ""}`
      : `${Math.round(seconds).toLocaleString("en-US")}`;

  const shareText = `残り${shareLabel}秒。思ったより少なかった。 #LifeTimer`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Life Timer",
          text: shareText,
        });
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
      className="px-12 py-4 border border-white/30 text-white text-sm font-light tracking-[0.15em]
                 transition-all duration-300 ease-out
                 hover:border-white/60 hover:bg-white/5
                 active:scale-[0.98]"
    >
      {copied ? "コピーしました" : "結果をシェアする"}
    </button>
  );
}
