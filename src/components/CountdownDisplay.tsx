"use client";

import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "@/lib/animations";

interface CountdownDisplayProps {
  seconds: number;
  active?: boolean;
}

export default function CountdownDisplay({
  seconds,
  active = true,
}: CountdownDisplayProps) {
  const [display, setDisplay] = useState(Math.round(seconds));
  const startTimeRef = useRef<number>(Date.now());
  const startValueRef = useRef<number>(Math.round(seconds));

  useEffect(() => {
    startTimeRef.current = Date.now();
    startValueRef.current = Math.round(seconds);
    setDisplay(Math.round(seconds));
  }, [seconds]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const current = startValueRef.current - Math.floor(elapsed);
      setDisplay(Math.max(0, current));
    }, 1000);

    return () => clearInterval(interval);
  }, [active, seconds]);

  return (
    <span className="tabular-nums font-bold text-5xl md:text-6xl text-text-primary">
      {formatSeconds(display)}
    </span>
  );
}
