"use client";

const shapes = [
  { type: "icosahedron", size: 100, top: "8%", left: "5%", floatDuration: 45, spinDuration: 150, delay: 0 },
  { type: "orbitalRings", size: 120, top: "12%", right: "8%", floatDuration: 55, spinDuration: 180, delay: 2 },
  { type: "metatronFragment", size: 110, bottom: "18%", left: "6%", floatDuration: 65, spinDuration: 120, delay: 4 },
];

function ShapeSVG({ type, size }: { type: string; size: number }) {
  const stroke = "rgba(255,255,255,0.14)";
  const thin = "rgba(255,255,255,0.08)";

  if (type === "icosahedron") {
    const r = size / 2;
    const cx = r, cy = r;
    const outerR = r * 0.9;
    const innerR = r * 0.5;

    const outerPts = Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      return { x: cx + outerR * Math.cos(angle), y: cy + outerR * Math.sin(angle) };
    });

    const innerPts = Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2 + Math.PI / 5;
      return { x: cx + innerR * Math.cos(angle), y: cy + innerR * Math.sin(angle) };
    });

    const lines: [number, number, number, number][] = [];

    // 外周の五角形
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      lines.push([outerPts[i].x, outerPts[i].y, outerPts[next].x, outerPts[next].y]);
    }
    // 内周の五角形
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      lines.push([innerPts[i].x, innerPts[i].y, innerPts[next].x, innerPts[next].y]);
    }
    // 外周→内周の接続
    for (let i = 0; i < 5; i++) {
      lines.push([outerPts[i].x, outerPts[i].y, innerPts[i].x, innerPts[i].y]);
      lines.push([outerPts[i].x, outerPts[i].y, innerPts[(i + 4) % 5].x, innerPts[(i + 4) % 5].y]);
    }
    // 中心上下の点から外周への線
    lines.push(...outerPts.map(p => [cx, cy * 0.1, p.x, p.y] as [number, number, number, number]));
    lines.push(...outerPts.map(p => [cx, cy * 1.9, p.x, p.y] as [number, number, number, number]));

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {lines.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
            stroke={i < 10 ? stroke : thin} strokeWidth="0.5" />
        ))}
      </svg>
    );
  }

  if (type === "orbitalRings") {
    const cx = size / 2, cy = size / 2;
    const rx = size * 0.45, ry = size * 0.18;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="none" stroke={stroke} strokeWidth="0.5" transform={`rotate(0 ${cx} ${cy})`} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="none" stroke={stroke} strokeWidth="0.5" transform={`rotate(60 ${cx} ${cy})`} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="none" stroke={stroke} strokeWidth="0.5" transform={`rotate(120 ${cx} ${cy})`} />
        {/* 中心の小さな円（原子核） */}
        <circle cx={cx} cy={cy} r={3} fill="none" stroke={thin} strokeWidth="0.5" />
      </svg>
    );
  }

  if (type === "metatronFragment") {
    const cx = size / 2, cy = size / 2;
    const r = size * 0.15;
    const dist = r * 2;

    const centers = [{ x: cx, y: cy }];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      centers.push({ x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) });
    }

    const lines: [number, number, number, number][] = [];
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const dx = centers[i].x - centers[j].x;
        const dy = centers[i].y - centers[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist * 1.5) {
          lines.push([centers[i].x, centers[i].y, centers[j].x, centers[j].y]);
        }
      }
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {centers.map((c, i) => (
          <circle key={`c${i}`} cx={c.x} cy={c.y} r={r}
            fill="none" stroke={i === 0 ? stroke : thin} strokeWidth="0.5" />
        ))}
        {lines.map((l, i) => (
          <line key={`l${i}`} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
            stroke={thin} strokeWidth="0.3" />
        ))}
      </svg>
    );
  }

  return null;
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
            animation: `floatShape ${s.floatDuration}s ease-in-out infinite, spinShape ${s.spinDuration}s linear infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <ShapeSVG type={s.type} size={s.size} />
        </div>
      ))}
    </>
  );
}
