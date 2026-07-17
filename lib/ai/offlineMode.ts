import { STAGE_DEMO_QUIZ, STAGE_DEMO_ROADMAP } from "@/utils/stageDemoData";

export function isOfflineBakingEnabled(): boolean {
  return process.env.OFFLINE_BAKING_MODE === "true";
}

export function getOfflineRoadmap() {
  return STAGE_DEMO_ROADMAP;
}

export function getOfflineQuiz() {
  return STAGE_DEMO_QUIZ;
}
