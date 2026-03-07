"use client";

import { useState } from "react";
import { Gender } from "@/types";

interface BasicInfoScreenProps {
  onSubmit: (age: number, gender: Gender) => void;
}

export default function BasicInfoScreen({ onSubmit }: BasicInfoScreenProps) {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender | null>(null);

  const canSubmit = age !== "" && parseInt(age) > 0 && parseInt(age) < 120 && gender !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-bg relative overflow-hidden">
      <div className="wireframe-box w-32 h-32 top-16 right-8 opacity-30" />

      <div className="relative z-10 w-full max-w-sm">
        <p className="label text-center mb-3">BASIC INFO</p>
        <h2 className="text-xl font-light text-center text-white mb-16 tracking-wide">
          まず、あなたのことを教えてください
        </h2>

        <div className="mb-12">
          <label className="label block mb-3">AGE</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={119}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 px-1 py-3 text-xl
                         text-white outline-none focus:border-cyan-500/60
                         transition-colors duration-200 mono tabular-nums"
              placeholder="30"
            />
            <span className="text-text-secondary text-sm">歳</span>
          </div>
        </div>

        <div className="mb-16">
          <label className="label block mb-4">GENDER</label>
          <div className="flex gap-3">
            {(["男性", "女性", "その他"] as const).map((lbl) => {
              const value: Gender =
                lbl === "男性" ? "male" : lbl === "女性" ? "female" : "other";
              const isSelected = gender === value;
              return (
                <button
                  key={value}
                  onClick={() => setGender(value)}
                  className={`flex-1 py-3 text-sm tracking-wider transition-all duration-200 border
                    ${isSelected
                      ? "border-cyan-500/60 text-white shadow-[0_0_12px_rgba(0,206,209,0.1)]"
                      : "border-white/10 text-text-secondary hover:border-white/25"
                    }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => canSubmit && onSubmit(parseInt(age), gender!)}
          disabled={!canSubmit}
          className={`w-full py-4 text-sm mono tracking-[0.15em] transition-all duration-300 ease-out border
            ${canSubmit
              ? "border-white/20 text-white hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,206,209,0.1)] active:scale-[0.98]"
              : "border-white/5 text-white/15 cursor-not-allowed"
            }`}
        >
          36の問いへ
        </button>
      </div>
    </div>
  );
}
