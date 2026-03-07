"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ParticleCanvas from "./ParticleCanvas";
import FloatingShapes from "./FloatingShapes";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [phase, setPhase] = useState(0); // 0=dark, 1=rings, 2=title, 3=sub, 4=button
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);   // rings start
    const t2 = setTimeout(() => setPhase(2), 1500);  // title glitch in
    const t3 = setTimeout(() => setPhase(3), 2500);  // sub copy
    const t4 = setTimeout(() => setPhase(4), 3500);  // button
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 to 1
    const dy = (e.clientY - cy) / cy;
    setMouseOffset({ x: dx * 5, y: dy * 5 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-bg-base"
      onMouseMove={handleMouseMove}
    >
      {/* Perspective grid with parallax */}
      <div
        className="perspective-grid"
        style={{
          transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div
          className="perspective-grid-inner"
          style={{ animation: phase >= 1 ? "introGridZoom 8s ease-out forwards, gridScroll 60s linear infinite" : "none", opacity: phase >= 1 ? 1 : 0 }}
        />
      </div>

      {/* Particles */}
      {phase >= 1 && <ParticleCanvas />}

      {/* Floating shapes with parallax */}
      <div style={{
        transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        transition: "transform 0.3s ease-out",
        position: "absolute", inset: 0, pointerEvents: "none",
      }}>
        <FloatingShapes />
      </div>

      {/* Expanding concentric rings */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div className="intro-ring" style={{ animationDelay: "0s" }} />
          <div className="intro-ring" style={{ animationDelay: "0.8s" }} />
          <div className="intro-ring" style={{ animationDelay: "1.6s" }} />
        </div>
      )}

      {/* Content */}
      <div
        className="relative text-center max-w-lg"
        style={{
          zIndex: 10,
          transform: `translate(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Main copy */}
        <h1
          className="font-medium tracking-wider mb-6"
          style={{
            fontSize: "clamp(32px, 7vw, 48px)",
            whiteSpace: "nowrap",
            opacity: phase >= 2 ? 1 : 0,
            animation: phase >= 2 ? "introGlitchIn 800ms ease-out forwards" : "none",
          }}
        >
          あと何秒、生きられる？
        </h1>

        {/* Sub copy */}
        <p
          className="text-base font-light tracking-wide leading-relaxed"
          style={{
            color: "#666",
            fontSize: 16,
            opacity: phase >= 3 ? 1 : 0,
            animation: phase >= 3 ? "fadeIn 800ms ease-out forwards" : "none",
          }}
        >
          36の問いから、あなたの残り時間を算出する
        </p>

        {/* Button */}
        <div
          className="mt-20"
          style={{
            opacity: phase >= 4 ? 1 : 0,
            animation: phase >= 4 ? "fadeInUp 600ms ease-out forwards" : "none",
          }}
        >
          <button
            onClick={onStart}
            className="px-10 py-4 border border-white/20 text-white text-sm mono tracking-[0.15em]
                       transition-all duration-300 ease-out relative overflow-hidden
                       hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,206,209,0.1)]
                       active:scale-[0.98]"
          >
            測定を開始する
          </button>
        </div>
      </div>
    </div>
  );
}
