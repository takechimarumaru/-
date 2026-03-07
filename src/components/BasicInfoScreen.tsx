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
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="label text-center mb-4">
          BASIC INFO
        </p>

        <h2 className="text-[22px] font-light text-center text-white mb-20">
          まず、あなたのことを。
        </h2>

        <div className="mb-14">
          <label className="label block mb-3">年齢</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={119}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 px-1 py-3 text-xl
                         text-white outline-none focus:border-white/60
                         transition-colors duration-200 mono tabular-nums"
              placeholder="30"
            />
            <span className="text-text-secondary text-sm shrink-0">歳</span>
          </div>
        </div>

        <div className="mb-20">
          <label className="label block mb-4">性別</label>
          <div className="flex gap-3">
            {(["男性", "女性", "その他"] as const).map((label) => {
              const value: Gender =
                label === "男性" ? "male" : label === "女性" ? "female" : "other";
              const isSelected = gender === value;
              return (
                <button
                  key={value}
                  onClick={() => setGender(value)}
                  className={`flex-1 py-3 text-sm font-light tracking-wider transition-all duration-200
                    border ${
                      isSelected
                        ? "border-white text-white"
                        : "border-white/15 text-text-secondary hover:border-white/30"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => canSubmit && onSubmit(parseInt(age), gender!)}
          disabled={!canSubmit}
          className={`w-full py-4 text-sm font-light tracking-[0.15em] transition-all duration-300 ease-out border
            ${
              canSubmit
                ? "border-white/30 text-white hover:border-white/60 hover:bg-white/5 active:scale-[0.98]"
                : "border-white/10 text-white/20 cursor-not-allowed"
            }`}
        >
          36の問いへ
        </button>
      </div>
    </div>
  );
}
