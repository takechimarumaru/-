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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-radial-decoration">
      <div className="w-full max-w-sm">
        <p
          className="text-xs tracking-[0.2em] text-text-secondary text-center mb-4"
        >
          BASIC INFO
        </p>

        <h2 className="text-2xl font-semibold text-center text-text-primary mb-16">
          まず、あなたのことを。
        </h2>

        <div className="mb-12">
          <label className="block text-sm text-text-secondary mb-3">年齢</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={119}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-white/60 border border-bar-bg rounded-xl px-5 py-4 text-xl
                         text-text-primary outline-none focus:border-text-secondary
                         transition-colors duration-200"
              placeholder="30"
            />
            <span className="text-text-secondary text-base shrink-0">歳</span>
          </div>
        </div>

        <div className="mb-16">
          <label className="block text-sm text-text-secondary mb-3">性別</label>
          <div className="flex gap-3">
            {(["男性", "女性", "その他"] as const).map((label) => {
              const value: Gender =
                label === "男性" ? "male" : label === "女性" ? "female" : "other";
              const isSelected = gender === value;
              return (
                <button
                  key={value}
                  onClick={() => setGender(value)}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? "bg-btn-primary text-btn-text"
                        : "bg-white/60 text-text-primary border border-bar-bg hover:border-text-secondary"
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
          className={`w-full py-4 rounded-full text-base font-medium transition-all duration-300 ease-out
            ${
              canSubmit
                ? "bg-btn-primary text-btn-text hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-bar-bg text-text-secondary cursor-not-allowed"
            }`}
        >
          36の問いへ
        </button>
      </div>
    </div>
  );
}
