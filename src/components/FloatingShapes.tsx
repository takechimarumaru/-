"use client";

const shapes = [
  { type: "square", size: 80, top: "8%", left: "5%", duration: 45, delay: 0 },
  { type: "triangle", size: 60, top: "15%", right: "10%", duration: 55, delay: 2 },
  { type: "hexagon", size: 100, bottom: "20%", left: "8%", duration: 38, delay: 4 },
];

function ShapeSVG({ type, size }: { type: string; size: number }) {
  const stroke = "rgba(255,255,255,0.04)";
  if (type === "triangle") {
    const h = size * 0.866;
    return (
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
        <polygon
          points={`${size / 2},0 ${size},${h} 0,${h}`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.5"
        />
      </svg>
    );
  }
  if (type === "hexagon") {
    const r = size / 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${r + r * Math.cos(angle)},${r + r * Math.sin(angle)}`;
    }).join(" ");
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={pts} fill="none" stroke={stroke} strokeWidth="0.5" />
      </svg>
    );
  }
  // square
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x="0.5" y="0.5" width={size - 1} height={size - 1} fill="none" stroke={stroke} strokeWidth="0.5" />
    </svg>
  );
}

export default function FloatingShapes() {
  return (
    <>
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            right: (s as Record<string, unknown>).right as string | undefined,
            bottom: s.bottom,
            zIndex: 0,
            animation: `floatShape ${s.duration}s ease-in-out infinite, spinShape ${s.duration}s linear infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <ShapeSVG type={s.type} size={s.size} />
        </div>
      ))}
    </>
  );
}
