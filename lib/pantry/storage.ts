import {
  STORAGE_KEYS,
  type QuizStatEntry,
  type SavedResource,
  type SavedRoadmap,
} from "./types";

function readTable<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTable<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadRoadmaps(): SavedRoadmap[] {
  return readTable<SavedRoadmap>(STORAGE_KEYS.roadmaps).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export function saveRoadmapEntry(entry: SavedRoadmap): SavedRoadmap[] {
  const all = loadRoadmaps();
  const next = [entry, ...all];
  writeTable(STORAGE_KEYS.roadmaps, next);
  return next;
}

export function deleteRoadmapEntry(id: string): SavedRoadmap[] {
  const next = loadRoadmaps().filter((r) => r.id !== id);
  writeTable(STORAGE_KEYS.roadmaps, next);
  return next;
}

export function loadQuizStats(): QuizStatEntry[] {
  return readTable<QuizStatEntry>(STORAGE_KEYS.quizStats).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export function saveQuizStatEntry(entry: QuizStatEntry): QuizStatEntry[] {
  const all = loadQuizStats();
  const next = [entry, ...all];
  writeTable(STORAGE_KEYS.quizStats, next);
  return next;
}

export function loadSavedResources(): SavedResource[] {
  return readTable<SavedResource>(STORAGE_KEYS.savedResources).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export function saveResourceEntry(entry: SavedResource): SavedResource[] {
  const all = loadSavedResources();
  const exists = all.some(
    (r) => r.source === entry.source && r.keyword === entry.keyword
  );
  if (exists) return all;
  const next = [entry, ...all];
  writeTable(STORAGE_KEYS.savedResources, next);
  return next;
}

export function deleteResourceEntry(id: string): SavedResource[] {
  const next = loadSavedResources().filter((r) => r.id !== id);
  writeTable(STORAGE_KEYS.savedResources, next);
  return next;
}

export const PANTRY_UPDATED_EVENT = "bread-pantry-updated";

export function notifyPantryUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PANTRY_UPDATED_EVENT));
  }
}
