"use client";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1
          className="text-[22px] md:text-[26px] font-light leading-[2] text-white"
        >
          あなたの命を測るのに、
          <br />
          36の問いが必要です。
        </h1>

        <div className="mt-24">
          <button
            onClick={onStart}
            className="px-14 py-4 border border-white/30 text-white text-sm font-light tracking-[0.15em]
                       transition-all duration-300 ease-out
                       hover:border-white/60 hover:bg-white/5
                       active:scale-[0.98]"
          >
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
}
