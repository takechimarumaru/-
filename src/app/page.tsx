"use client";

import { useState, useCallback, useMemo } from "react";
import { ScreenId, BasicInfo, Answers, CategoryId, CalculationResult } from "@/types";
import { questions, categories } from "@/lib/questions";
import { calculate } from "@/lib/calculator";
import IntroScreen from "@/components/IntroScreen";
import BasicInfoScreen from "@/components/BasicInfoScreen";
import QuestionScreen from "@/components/QuestionScreen";
import CategoryTransition from "@/components/CategoryTransition";
import ResultScreen from "@/components/ResultScreen";

type FlowState =
  | { screen: "intro" }
  | { screen: "basicInfo" }
  | { screen: "categoryTransition"; categoryId: CategoryId }
  | { screen: "question"; questionIndex: number }
  | { screen: "resultTransition" }
  | { screen: "result" };

export default function Home() {
  const [flow, setFlow] = useState<FlowState>({ screen: "intro" });
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  // Group questions by category in order
  const questionsByCategory = useMemo(() => {
    const grouped: { categoryId: CategoryId; questions: typeof questions }[] = [];
    for (const cat of categories) {
      const catQuestions = questions.filter((q) => q.category === cat.id);
      if (catQuestions.length > 0) {
        grouped.push({ categoryId: cat.id, questions: catQuestions });
      }
    }
    return grouped;
  }, []);

  const allQuestionsFlat = useMemo(
    () => questionsByCategory.flatMap((g) => g.questions),
    [questionsByCategory]
  );

  const handleStart = useCallback(() => {
    setFlow({ screen: "basicInfo" });
  }, []);

  const handleBasicInfo = useCallback(
    (age: number, gender: BasicInfo["gender"]) => {
      setBasicInfo({ age, gender });
      // Start with first category transition
      setFlow({ screen: "categoryTransition", categoryId: questionsByCategory[0].categoryId });
    },
    [questionsByCategory]
  );

  const handleCategoryTransitionComplete = useCallback(
    (categoryId: CategoryId) => {
      // Find first question of this category
      const idx = allQuestionsFlat.findIndex((q) => q.category === categoryId);
      setFlow({ screen: "question", questionIndex: idx });
    },
    [allQuestionsFlat]
  );

  const handleAnswer = useCallback(
    (questionIndex: number, value: number) => {
      const question = allQuestionsFlat[questionIndex];
      setAnswers((prev) => ({ ...prev, [question.id]: value }));

      const nextIndex = questionIndex + 1;

      if (nextIndex >= allQuestionsFlat.length) {
        // All done — go to result
        setFlow({ screen: "resultTransition" });
        setTimeout(() => setFlow({ screen: "result" }), 500);
        return;
      }

      const nextQuestion = allQuestionsFlat[nextIndex];
      if (nextQuestion.category !== question.category) {
        // Category change — show transition
        setFlow({
          screen: "categoryTransition",
          categoryId: nextQuestion.category,
        });
      } else {
        setFlow({ screen: "question", questionIndex: nextIndex });
      }
    },
    [allQuestionsFlat]
  );

  const handleRestart = useCallback(() => {
    setFlow({ screen: "intro" });
    setBasicInfo(null);
    setAnswers({});
  }, []);

  // Calculate result
  const result: CalculationResult | null = useMemo(() => {
    if (flow.screen !== "result" || !basicInfo) return null;
    return calculate(basicInfo, answers);
  }, [flow.screen, basicInfo, answers]);

  // Get category-level question index
  const getCategoryQuestionInfo = (globalIndex: number) => {
    const question = allQuestionsFlat[globalIndex];
    const catQuestions = allQuestionsFlat.filter(
      (q) => q.category === question.category
    );
    const indexInCat = catQuestions.indexOf(question);
    return { indexInCategory: indexInCat, totalInCategory: catQuestions.length };
  };

  return (
    <main className="min-h-screen bg-bg-base">
      {flow.screen === "intro" && <IntroScreen onStart={handleStart} />}

      {flow.screen === "basicInfo" && (
        <BasicInfoScreen onSubmit={handleBasicInfo} />
      )}

      {flow.screen === "categoryTransition" && (
        <CategoryTransition
          key={flow.categoryId}
          categoryId={flow.categoryId}
          onComplete={() =>
            handleCategoryTransitionComplete(flow.categoryId)
          }
        />
      )}

      {flow.screen === "question" && (
        <QuestionScreen
          key={flow.questionIndex}
          question={allQuestionsFlat[flow.questionIndex]}
          questionIndex={
            getCategoryQuestionInfo(flow.questionIndex).indexInCategory
          }
          totalInCategory={
            getCategoryQuestionInfo(flow.questionIndex).totalInCategory
          }
          onAnswer={(value) => handleAnswer(flow.questionIndex, value)}
        />
      )}

      {flow.screen === "resultTransition" && (
        <div className="min-h-screen bg-[#2D2A26] animate-fade-in" />
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
