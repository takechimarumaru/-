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
    const t2 = setTimeout(() => setPhase(2), 1500);  // title
    const t3 = setTimeout(() => setPhase(3), 2500);  // sub copy
    const t4 = setTimeout(() => setPhase(4), 3500);  // button
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    setMouseOffset({ x: dx * 5, y: dy * 5 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #0D0D0D, #050505)" }}
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
        {/* Main copy — per DESIGN.md: 42px, weight 300, letter-spacing 0.08em */}
        <h1
          style={{
            fontSize: 42,
            fontWeight: 300,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            color: "#E8E8E8",
            marginBottom: 24,
            opacity: phase >= 2 ? 1 : 0,
            animation: phase >= 2 ? "introGlitchIn 800ms ease-out forwards" : "none",
          }}
        >
          あと何秒、生きられる？
        </h1>

        {/* Sub copy */}
        <p
          style={{
            color: "#5A5A5A",
            fontSize: 16,
            fontWeight: 300,
            letterSpacing: "0.05em",
            lineHeight: 2.0,
            opacity: phase >= 3 ? 1 : 0,
            animation: phase >= 3 ? "fadeIn 800ms ease-out forwards" : "none",
          }}
        >
          36の問いから、あなたの残り時間を算出する
        </p>

        {/* Button — no border-radius, border only, transparent bg */}
        <div
          style={{
            marginTop: 80,
            opacity: phase >= 4 ? 1 : 0,
            animation: phase >= 4 ? "fadeInUp 600ms ease-out forwards" : "none",
          }}
        >
          <button
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.style.transform = "scale(0.97)";
              btn.style.borderColor = "rgba(232,232,232,1.0)";
              setTimeout(() => {
                btn.style.transform = "scale(1)";
                btn.style.borderColor = "rgba(232,232,232,0.15)";
                onStart();
              }, 200);
            }}
            className="mono"
            style={{
              padding: "16px 40px",
              border: "1px solid rgba(232,232,232,0.15)",
              borderRadius: 0,
              background: "transparent",
              color: "#E8E8E8",
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: "0.15em",
              transition: "all 0.2s ease-out",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(232,232,232,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(232,232,232,0.15)"; }}
          >
            測定を開始する
          </button>
        </div>
      </div>
    </div>
  );
}
