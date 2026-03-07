export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  const start = performance.now();

  let rafId: number;

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const current = from + (to - from) * eased;

    onUpdate(Math.round(current));

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}

export function formatSeconds(seconds: number): string {
  return Math.max(0, Math.round(seconds)).toLocaleString("en-US");
}

export function secondsToYMD(totalSeconds: number): {
  years: number;
  months: number;
  days: number;
} {
  const totalDays = totalSeconds / (24 * 60 * 60);
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = totalDays - years * 365.25;
  const months = Math.floor(remainingDays / 30.44);
  const days = Math.floor(remainingDays - months * 30.44);
  return { years, months, days };
}
