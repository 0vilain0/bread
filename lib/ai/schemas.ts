import type { QuizQuestionResponse, RoadmapResponse } from "@/utils/api";

export function validateRoadmapResponse(data: unknown): RoadmapResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Roadmap response must be a JSON object");
  }

  const roadmap = data as Record<string, unknown>;

  if (
    typeof roadmap.similarity_score !== "number" ||
    roadmap.similarity_score < 0 ||
    roadmap.similarity_score > 100
  ) {
    throw new Error("similarity_score must be a number between 0 and 100");
  }

  if (typeof roadmap.analysis_summary !== "string" || !roadmap.analysis_summary.trim()) {
    throw new Error("analysis_summary must be a non-empty string");
  }

  if (!Array.isArray(roadmap.roadmap) || roadmap.roadmap.length === 0) {
    throw new Error("roadmap must be a non-empty array");
  }

  const steps = roadmap.roadmap.map((step, index) => {
    if (!step || typeof step !== "object") {
      throw new Error(`roadmap[${index}] must be an object`);
    }

    const item = step as Record<string, unknown>;

    if (typeof item.step !== "number" || item.step < 1) {
      throw new Error(`roadmap[${index}].step must be a positive number`);
    }

    if (typeof item.title !== "string" || !item.title.trim()) {
      throw new Error(`roadmap[${index}].title must be a non-empty string`);
    }

    if (typeof item.duration !== "string" || !item.duration.trim()) {
      throw new Error(`roadmap[${index}].duration must be a non-empty string`);
    }

    if (!Array.isArray(item.skills) || item.skills.some((skill) => typeof skill !== "string")) {
      throw new Error(`roadmap[${index}].skills must be an array of strings`);
    }

    if (!Array.isArray(item.resources) || item.resources.length === 0) {
      throw new Error(`roadmap[${index}].resources must be a non-empty array`);
    }

    const resources = item.resources.map((resource, resourceIndex) => {
      if (!resource || typeof resource !== "object") {
        throw new Error(`roadmap[${index}].resources[${resourceIndex}] must be an object`);
      }

      const resourceItem = resource as Record<string, unknown>;

      if (typeof resourceItem.source !== "string" || !resourceItem.source.trim()) {
        throw new Error(
          `roadmap[${index}].resources[${resourceIndex}].source must be a non-empty string`
        );
      }

      if (typeof resourceItem.keyword !== "string" || !resourceItem.keyword.trim()) {
        throw new Error(
          `roadmap[${index}].resources[${resourceIndex}].keyword must be a non-empty string`
        );
      }

      return {
        source: resourceItem.source,
        keyword: resourceItem.keyword,
      };
    });

    return {
      step: item.step,
      title: item.title,
      duration: item.duration,
      skills: item.skills as string[],
      resources,
    };
  });

  return {
    similarity_score: Math.round(roadmap.similarity_score),
    analysis_summary: roadmap.analysis_summary,
    roadmap: steps,
  };
}

export function validateQuizResponse(data: unknown): QuizQuestionResponse[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Quiz response must be a non-empty JSON array");
  }

  return data.map((question, index) => {
    if (!question || typeof question !== "object") {
      throw new Error(`quiz[${index}] must be an object`);
    }

    const item = question as Record<string, unknown>;

    if (typeof item.id !== "number" || item.id < 1) {
      throw new Error(`quiz[${index}].id must be a positive number`);
    }

    if (typeof item.question !== "string" || !item.question.trim()) {
      throw new Error(`quiz[${index}].question must be a non-empty string`);
    }

    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      item.options.some((option) => typeof option !== "string")
    ) {
      throw new Error(`quiz[${index}].options must contain exactly 4 strings`);
    }

    if (typeof item.correct_answer !== "string" || !item.correct_answer.trim()) {
      throw new Error(`quiz[${index}].correct_answer must be a non-empty string`);
    }

    const options = item.options as string[];
    if (!options.includes(item.correct_answer)) {
      throw new Error(`quiz[${index}].correct_answer must match one of the options`);
    }

    if (typeof item.explanation !== "string" || !item.explanation.trim()) {
      throw new Error(`quiz[${index}].explanation must be a non-empty string`);
    }

    return {
      id: item.id,
      question: item.question,
      options,
      correct_answer: item.correct_answer,
      explanation: item.explanation,
    };
  });
}
