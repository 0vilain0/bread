"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

import {
  deleteResourceEntry,
  deleteRoadmapEntry,
  loadQuizStats,
  loadRoadmaps,
  loadSavedResources,
  notifyPantryUpdated,
  PANTRY_UPDATED_EVENT,
  saveQuizStatEntry,
  saveResourceEntry,
  saveRoadmapEntry,
} from "@/lib/pantry/storage";
import {
  roadmapToSaved,
  type PantryRoadmapInput,
  type QuizStatEntry,
  type SavedResource,
  type SavedRoadmap,
} from "@/lib/pantry/types";

interface PantryMetrics {
  totalStudyMinutes: number;
  averageQuizAccuracy: number;
  perfectQuizCount: number;
  totalQuizzes: number;
}

interface PantryContextValue {
  roadmaps: SavedRoadmap[];
  quizStats: QuizStatEntry[];
  savedResources: SavedResource[];
  metrics: PantryMetrics;
  saveRoadmap: (input: PantryRoadmapInput) => void;
  deleteRoadmap: (id: string) => void;
  saveQuizResult: (params: {
    topic_name: string;
    score_correct: number;
    score_total: number;
    duration_seconds: number;
  }) => void;
  bookmarkResource: (params: {
    source: string;
    keyword: string;
    step_title?: string;
  }) => boolean;
  deleteResource: (id: string) => void;
  isResourceBookmarked: (source: string, keyword: string) => boolean;
  toastMessage: string | null;
  showPantryToast: (message: string) => void;
  refresh: () => void;
}

const PantryContext = createContext<PantryContextValue | undefined>(undefined);

function computeMetrics(quizStats: QuizStatEntry[]): PantryMetrics {
  if (quizStats.length === 0) {
    return {
      totalStudyMinutes: 0,
      averageQuizAccuracy: 0,
      perfectQuizCount: 0,
      totalQuizzes: 0,
    };
  }

  const totalSeconds = quizStats.reduce((sum, q) => sum + q.duration_seconds, 0);
  const totalCorrect = quizStats.reduce((sum, q) => sum + q.score_correct, 0);
  const totalQuestions = quizStats.reduce((sum, q) => sum + q.score_total, 0);
  const perfectQuizCount = quizStats.filter(
    (q) => q.score_correct === q.score_total && q.score_total > 0
  ).length;

  return {
    totalStudyMinutes: Math.max(1, Math.round(totalSeconds / 60)),
    averageQuizAccuracy:
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0,
    perfectQuizCount,
    totalQuizzes: quizStats.length,
  };
}

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStatEntry[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRoadmaps(loadRoadmaps());
    setQuizStats(loadQuizStats());
    setSavedResources(loadSavedResources());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(PANTRY_UPDATED_EVENT, handler);
    return () => window.removeEventListener(PANTRY_UPDATED_EVENT, handler);
  }, [refresh]);

  const showPantryToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const saveRoadmap = useCallback((input: PantryRoadmapInput) => {
    const entry = roadmapToSaved(input);
    setRoadmaps(saveRoadmapEntry(entry));
    notifyPantryUpdated();
  }, []);

  const deleteRoadmap = useCallback((id: string) => {
    setRoadmaps(deleteRoadmapEntry(id));
    notifyPantryUpdated();
  }, []);

  const saveQuizResult = useCallback(
    (params: {
      topic_name: string;
      score_correct: number;
      score_total: number;
      duration_seconds: number;
    }) => {
      const entry: QuizStatEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        topic_name: params.topic_name,
        score: `${params.score_correct}/${params.score_total}`,
        score_correct: params.score_correct,
        score_total: params.score_total,
        duration_seconds: params.duration_seconds,
      };
      setQuizStats(saveQuizStatEntry(entry));
      notifyPantryUpdated();
    },
    []
  );

  const bookmarkResource = useCallback(
    (params: { source: string; keyword: string; step_title?: string }) => {
      const entry: SavedResource = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: params.keyword,
        source: params.source,
        keyword: params.keyword,
        step_title: params.step_title,
      };
      const before = loadSavedResources();
      const exists = before.some(
        (r) => r.source === params.source && r.keyword === params.keyword
      );
      if (exists) return false;
      setSavedResources(saveResourceEntry(entry));
      notifyPantryUpdated();
      return true;
    },
    []
  );

  const deleteResource = useCallback((id: string) => {
    setSavedResources(deleteResourceEntry(id));
    notifyPantryUpdated();
  }, []);

  const isResourceBookmarked = useCallback(
    (source: string, keyword: string) =>
      savedResources.some((r) => r.source === source && r.keyword === keyword),
    [savedResources]
  );

  const metrics = useMemo(() => computeMetrics(quizStats), [quizStats]);

  return (
    <PantryContext.Provider
      value={{
        roadmaps,
        quizStats,
        savedResources,
        metrics,
        saveRoadmap,
        deleteRoadmap,
        saveQuizResult,
        bookmarkResource,
        deleteResource,
        isResourceBookmarked,
        toastMessage,
        showPantryToast,
        refresh,
      }}
    >
      {children}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-28 left-1/2 z-[55] bg-bread-brown text-white px-5 py-3 rounded-xl card-shadow text-sm font-medium flex items-center gap-2 max-w-[90vw]"
            role="status"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </PantryContext.Provider>
  );
}

export function usePantryStore() {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error("usePantryStore must be used within PantryProvider");
  }
  return context;
}
