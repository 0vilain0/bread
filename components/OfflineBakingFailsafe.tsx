"use client";

import { useEffect } from "react";

import { useBread } from "@/context/BreadContext";
import {
  STAGE_DEMO_ASSESSMENT,
  STAGE_DEMO_QUIZ,
  STAGE_DEMO_ROADMAP,
} from "@/utils/stageDemoData";

/**
 * Hidden stage failsafe — no visible UI.
 * Shift+B: inject roadmap and jump to dashboard
 * Shift+Q: inject quiz for Step 1 and jump to quiz view
 */
export function OfflineBakingFailsafe() {
  const {
    setAssessmentData,
    setRoadmap,
    setCurrentTab,
    setIsLoading,
    setErrorMessage,
    setQuizQuestions,
    setCurrentQuizStep,
    setActiveTopicName,
  } = useBread();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "b") {
        event.preventDefault();
        setIsLoading(false);
        setErrorMessage(null);
        setAssessmentData(STAGE_DEMO_ASSESSMENT);
        setRoadmap(STAGE_DEMO_ROADMAP);
        setCurrentTab("roadmap");
        return;
      }

      if (key === "q") {
        event.preventDefault();
        setIsLoading(false);
        setErrorMessage(null);
        setAssessmentData(STAGE_DEMO_ASSESSMENT);
        setRoadmap(STAGE_DEMO_ROADMAP);
        setQuizQuestions(STAGE_DEMO_QUIZ);
        setCurrentQuizStep(1);
        setActiveTopicName(STAGE_DEMO_ROADMAP.roadmap[0]?.title ?? "Step 1");
        setCurrentTab("quiz");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    setActiveTopicName,
    setAssessmentData,
    setCurrentQuizStep,
    setCurrentTab,
    setErrorMessage,
    setIsLoading,
    setQuizQuestions,
    setRoadmap,
  ]);

  return null;
}
