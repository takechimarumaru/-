"use client";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-bg relative overflow-hidden">
      {/* Wireframe decorations */}
      <div className="wireframe-box w-40 h-40 -top-10 -right-10 opacity-40" />
      <div className="wireframe-box w-24 h-24 bottom-20 left-10 opacity-30" style={{ transform: "rotate(-20deg)" }} />
      <div className="absolute top-1/4 right-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-1/3 left-1/3 w-32 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative z-10 text-center max-w-md">
        <h1 className="text-5xl md:text-6xl font-medium tracking-wider mb-6">
          寿命測定
        </h1>

        <p className="text-sm text-text-secondary font-light tracking-wide leading-relaxed">
          36の問いから、あなたの残り時間を算出する
        </p>

        <div className="mt-20">
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
