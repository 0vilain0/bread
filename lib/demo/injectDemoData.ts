import {
  STORAGE_KEYS,
  notifyPantryUpdated,
} from "@/lib/pantry/storage";
import type { QuizStatEntry, SavedResource, SavedRoadmap } from "@/lib/pantry/types";

import {
  DEMO_QUIZ_STATS,
  DEMO_RESOURCES,
  DEMO_ROADMAP_ACCOUNTANT,
  DEMO_ROADMAP_DESIGNER,
  getPrimaryDemoRoadmap,
} from "./demoData";

export interface InjectDemoResult {
  roadmaps: SavedRoadmap[];
  resources: SavedResource[];
  quizStats: QuizStatEntry[];
  primaryRoadmap: ReturnType<typeof getPrimaryDemoRoadmap>;
}

export function injectDemoData(): InjectDemoResult {
  if (typeof window === "undefined") {
    return {
      roadmaps: [],
      resources: [],
      quizStats: [],
      primaryRoadmap: getPrimaryDemoRoadmap(),
    };
  }

  const roadmaps = [DEMO_ROADMAP_ACCOUNTANT, DEMO_ROADMAP_DESIGNER];
  const resources = DEMO_RESOURCES;
  const quizStats = DEMO_QUIZ_STATS;

  localStorage.setItem(STORAGE_KEYS.roadmaps, JSON.stringify(roadmaps));
  localStorage.setItem(STORAGE_KEYS.savedResources, JSON.stringify(resources));
  localStorage.setItem(STORAGE_KEYS.quizStats, JSON.stringify(quizStats));
  localStorage.setItem("bread_demo_mode", "true");

  notifyPantryUpdated();

  return {
    roadmaps,
    resources,
    quizStats,
    primaryRoadmap: getPrimaryDemoRoadmap(),
  };
}

export function isDemoModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("bread_demo_mode") === "true";
}

export function setDemoModeFlag(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem("bread_demo_mode", "true");
  } else {
    localStorage.removeItem("bread_demo_mode");
  }
}
