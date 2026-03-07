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
        <h2
          className="text-center mb-16"
          style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.05em", color: "#E8E8E8" }}
        >
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
              className="w-full mono tabular-nums"
              style={{
                background: "transparent",
                borderBottom: "1px solid rgba(232,232,232,0.15)",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderRadius: 0,
                padding: "12px 4px",
                fontSize: 20,
                fontWeight: 300,
                color: "#E8E8E8",
                outline: "none",
              }}
              placeholder="30"
            />
            <span style={{ color: "#5A5A5A", fontSize: 14 }}>歳</span>
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
                  className="flex-1 transition-all duration-200"
                  style={{
                    padding: "12px 0",
                    fontSize: 14,
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    border: `1px solid ${isSelected ? "rgba(232,232,232,0.4)" : "rgba(232,232,232,0.08)"}`,
                    borderRadius: 0,
                    background: "transparent",
                    color: isSelected ? "#E8E8E8" : "#5A5A5A",
                  }}
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
          className="w-full mono transition-all duration-300 ease-out active:scale-[0.98]"
          style={{
            padding: "16px 0",
            fontSize: 14,
            fontWeight: 300,
            letterSpacing: "0.15em",
            border: `1px solid ${canSubmit ? "rgba(232,232,232,0.15)" : "rgba(232,232,232,0.04)"}`,
            borderRadius: 0,
            background: "transparent",
            color: canSubmit ? "#E8E8E8" : "rgba(232,232,232,0.12)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.borderColor = "rgba(232,232,232,0.35)"; }}
          onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.borderColor = "rgba(232,232,232,0.15)"; }}
        >
          36の問いへ
        </button>
      </div>
    </div>
  );
}
