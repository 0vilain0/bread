import type { RoadmapResponse, RoadmapStepResponse } from "@/utils/api";

export const STORAGE_KEYS = {
  roadmaps: "bread_roadmaps",
  quizStats: "bread_quiz_stats",
  savedResources: "bread_saved_resources",
} as const;

export interface SavedRoadmap {
  id: string;
  timestamp: number;
  current_job: string;
  target_job: string;
  similarity_score: number;
  analysis_summary: string;
  roadmap: RoadmapStepResponse[];
}

export interface QuizStatEntry {
  id: string;
  timestamp: number;
  topic_name: string;
  score: string;
  score_correct: number;
  score_total: number;
  duration_seconds: number;
}

export interface SavedResource {
  id: string;
  timestamp: number;
  title: string;
  source: string;
  keyword: string;
  step_title?: string;
}

export type PantryRoadmapInput = {
  current_job: string;
  target_job: string;
  data: RoadmapResponse;
};

export function roadmapToSaved(
  input: PantryRoadmapInput
): SavedRoadmap {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    current_job: input.current_job,
    target_job: input.target_job,
    similarity_score: input.data.similarity_score,
    analysis_summary: input.data.analysis_summary,
    roadmap: input.data.roadmap,
  };
}

export function savedToRoadmapResponse(entry: SavedRoadmap): RoadmapResponse {
  return {
    similarity_score: entry.similarity_score,
    analysis_summary: entry.analysis_summary,
    roadmap: entry.roadmap,
  };
}

export function buildResourceUrl(source: string, keyword: string): string {
  const query = encodeURIComponent(keyword);
  const s = source.toLowerCase();
  if (s.includes("youtube")) {
    return `https://www.youtube.com/results?search_query=${query}`;
  }
  if (s.includes("coursera")) {
    return `https://www.coursera.org/search?query=${query}`;
  }
  if (s.includes("udemy")) {
    return `https://www.udemy.com/courses/search/?q=${query}`;
  }
  if (s.includes("edx")) {
    return `https://www.edx.org/search?q=${query}`;
  }
  return `https://www.google.com/search?q=${query}`;
}
