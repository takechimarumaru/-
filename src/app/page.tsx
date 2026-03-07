"use client";

import { useState, useCallback, useMemo } from "react";
import { BasicInfo, Answers, CategoryId, CalculationResult } from "@/types";
import { questions, categories } from "@/lib/questions";
import { calculate } from "@/lib/calculator";
import IntroScreen from "@/components/IntroScreen";
import BasicInfoScreen from "@/components/BasicInfoScreen";
import CategoryPageScreen from "@/components/CategoryPageScreen";
import CategoryTransition from "@/components/CategoryTransition";
import ResultScreen from "@/components/ResultScreen";

type FlowState =
  | { screen: "intro" }
  | { screen: "basicInfo" }
  | { screen: "categoryPage"; categoryIndex: number }
  | { screen: "categoryTransition"; completedIndex: number }
  | { screen: "result" };

export default function Home() {
  const [flow, setFlow] = useState<FlowState>({ screen: "intro" });
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  const questionsByCategory = useMemo(() => {
    return categories.map((cat) => ({
      categoryId: cat.id,
      questions: questions.filter((q) => q.category === cat.id),
    }));
  }, []);

  const handleStart = useCallback(() => {
    setFlow({ screen: "basicInfo" });
  }, []);

  const handleBasicInfo = useCallback(
    (age: number, gender: BasicInfo["gender"]) => {
      setBasicInfo({ age, gender });
      setFlow({ screen: "categoryPage", categoryIndex: 0 });
    },
    []
  );

  const handleCategoryComplete = useCallback(
    (categoryIndex: number, categoryAnswers: Answers) => {
      setAnswers((prev) => ({ ...prev, ...categoryAnswers }));
      setFlow({ screen: "categoryTransition", completedIndex: categoryIndex });
    },
    []
  );

  const handleTransitionComplete = useCallback(
    (completedIndex: number) => {
      const nextIndex = completedIndex + 1;
      if (nextIndex >= categories.length) {
        setFlow({ screen: "result" });
      } else {
        setFlow({ screen: "categoryPage", categoryIndex: nextIndex });
      }
    },
    []
  );

  const handleRestart = useCallback(() => {
    setFlow({ screen: "intro" });
    setBasicInfo(null);
    setAnswers({});
  }, []);

  const result: CalculationResult | null = useMemo(() => {
    if (flow.screen !== "result" || !basicInfo) return null;
    return calculate(basicInfo, answers);
  }, [flow.screen, basicInfo, answers]);

  return (
    <main className="min-h-screen bg-bg-base">
      {flow.screen === "intro" && <IntroScreen onStart={handleStart} />}

      {flow.screen === "basicInfo" && (
        <BasicInfoScreen onSubmit={handleBasicInfo} />
      )}

      {flow.screen === "categoryPage" && (
        <CategoryPageScreen
          key={flow.categoryIndex}
          categoryId={questionsByCategory[flow.categoryIndex].categoryId}
          categoryQuestions={questionsByCategory[flow.categoryIndex].questions}
          categoryIndex={flow.categoryIndex}
          totalCategories={categories.length}
          onComplete={(catAnswers) =>
            handleCategoryComplete(flow.categoryIndex, catAnswers)
          }
        />
      )}

      {flow.screen === "categoryTransition" && (
        <CategoryTransition
          key={flow.completedIndex}
          completedCategoryId={questionsByCategory[flow.completedIndex].categoryId}
          isLast={flow.completedIndex === categories.length - 1}
          onComplete={() => handleTransitionComplete(flow.completedIndex)}
        />
      )}

      {flow.screen === "result" && result && basicInfo && (
        <ResultScreen
          result={result}
          info={basicInfo}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
