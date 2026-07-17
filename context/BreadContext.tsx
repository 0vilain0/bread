"use client";

import React, { createContext, useContext, useState } from "react";
import type {
  RoadmapResponse,
  QuizQuestionResponse,
} from "@/utils/api";

export interface AssessmentData {
  currentJob: string;
  currentSkills: string[];
  targetJob: string;
  timeCommitment: string;
  learningStyle: string;
}

/**
 * Roadmap data from backend
 * Matches the FastAPI response structure
 */
export type Roadmap = RoadmapResponse;

/**
 * Quiz questions from backend
 * Matches the FastAPI response structure
 */
export type QuizQuestion = QuizQuestionResponse;

type AppTab =
  | "home"
  | "assessment"
  | "roadmap"
  | "quiz"
  | "future"
  | "premium"
  | "pantry";

interface BreadContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;

  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;

  roadmap: Roadmap | null;
  setRoadmap: (roadmap: Roadmap) => void;

  currentQuizStep: number | null;
  setCurrentQuizStep: (step: number) => void;

  quizQuestions: QuizQuestion[];
  setQuizQuestions: (questions: QuizQuestion[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  activeTopicName: string | null;
  setActiveTopicName: (topic: string | null) => void;

  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;

  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
}

const BreadContext = createContext<BreadContextType | undefined>(undefined);

export function BreadProvider({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState<AppTab>("home");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentQuizStep, setCurrentQuizStep] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTopicName, setActiveTopicName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  return (
    <BreadContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        assessmentData,
        setAssessmentData,
        roadmap,
        setRoadmap,
        currentQuizStep,
        setCurrentQuizStep,
        quizQuestions,
        setQuizQuestions,
        isLoading,
        setIsLoading,
        activeTopicName,
        setActiveTopicName,
        errorMessage,
        setErrorMessage,
        isPremium,
        setIsPremium,
      }}
    >
      {children}
    </BreadContext.Provider>
  );
}

export function useBread() {
  const context = useContext(BreadContext);
  if (!context) {
    throw new Error("useBread must be used within BreadProvider");
  }
  return context;
}
