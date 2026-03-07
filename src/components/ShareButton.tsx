"use client";

import { useRef, useState, useCallback } from "react";

interface ShareButtonProps {
  seconds: number;
}

function generateOGPImage(seconds: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#2D2A26";
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle radial gradient
    const gradient = ctx.createRadialGradient(600, 250, 50, 600, 315, 500);
    gradient.addColorStop(0, "rgba(196, 149, 106, 0.15)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Label
    ctx.fillStyle = "#8A8078";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("あなたの残り時間", 600, 220);

    // Seconds
    const formatted = Math.round(seconds).toLocaleString("en-US");
    ctx.fillStyle = "#F5F0EA";
    ctx.font = "bold 80px sans-serif";
    ctx.fillText(`${formatted} 秒`, 600, 340);

    // Footer
    ctx.fillStyle = "#8A8078";
    ctx.font = "20px sans-serif";
    ctx.fillText("#LifeTimer", 600, 540);

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

    // Fallback: copy to clipboard and open Twitter
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
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleShare}
        className="px-10 py-4 bg-btn-primary text-btn-text rounded-full text-base font-medium
                   transition-all duration-300 ease-out
                   hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
      >
        {copied ? "コピーしました" : "結果をシェアする"}
      </button>
    </div>
  );
}
