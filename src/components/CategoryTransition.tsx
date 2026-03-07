"use client";

import { useEffect, useState } from "react";
import { categories, categoryTaglines } from "@/lib/questions";
import { CategoryId } from "@/types";

interface CategoryTransitionProps {
  categoryId: CategoryId;
  onComplete: () => void;
}

export default function CategoryTransition({
  categoryId,
  onComplete,
}: CategoryTransitionProps) {
  const [visible, setVisible] = useState(false);

  const category = categories.find((c) => c.id === categoryId)!;
  const tagline = categoryTaglines[categoryId];

  useEffect(() => {
    // Fade in after brief delay
    const fadeInTimer = setTimeout(() => setVisible(true), 100);
    // Start fade out at 2s
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000);
    // Complete transition
    const completeTimer = setTimeout(onComplete, 2500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div
        className="text-center transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <p className="text-3xl md:text-4xl font-extralight tracking-[0.3em] text-white mb-6">
          {category.label}
        </p>
        <p className="text-sm font-light text-text-secondary tracking-wide">
          {tagline}
        </p>
      </div>
    </div>
  );
}
