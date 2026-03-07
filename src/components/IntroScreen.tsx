"use client";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-radial-decoration relative">
      <div className="absolute inset-0 bg-radial-decoration-2 pointer-events-none" />

      <div className="relative z-10 text-center max-w-md">
        <h1
          className="text-2xl md:text-3xl font-semibold leading-relaxed text-text-primary"
          style={{ lineHeight: "1.8" }}
        >
          あなたの命を測るのに、
          <br />
          36の問いが必要です。
        </h1>

        <div className="mt-20">
          <button
            onClick={onStart}
            className="px-12 py-4 bg-btn-primary text-btn-text rounded-full text-base font-medium
                       transition-all duration-300 ease-out
                       hover:opacity-90 hover:scale-[1.02]
                       active:scale-[0.98]"
          >
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
}
