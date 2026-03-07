"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/questions";
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

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setVisible(true), 100);
    const fadeOutTimer = setTimeout(() => setVisible(false), 1200);
    const completeTimer = setTimeout(onComplete, 1500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <p
        className="text-3xl md:text-4xl font-bold tracking-[0.3em] transition-opacity duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          color: category.accent,
        }}
      >
        {category.label}
      </p>
    </div>
  );
}
