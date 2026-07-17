/**
 * API Integration Service
 * Handles all communication with the self-hosted Next.js API routes.
 */

const API_BASE_URL = "/api";

/**
 * Roadmap Generation Request/Response Types
 */
export interface RoadmapRequest {
  current_job: string;
  target_job: string;
  hours_per_day: number;
}

export interface RoadmapResource {
  source: string;
  keyword: string;
}

export interface RoadmapStepResponse {
  step: number;
  title: string;
  duration: string;
  skills: string[];
  resources: RoadmapResource[];
}

export interface RoadmapResponse {
  similarity_score: number;
  analysis_summary: string;
  roadmap: RoadmapStepResponse[];
}

/**
 * Quiz Generation Request/Response Types
 */
export interface QuizRequest {
  topic_name: string;
}

export interface QuizQuestionResponse {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

/**
 * Error handling wrapper
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generate career roadmap from assessment data
 */
export async function generateRoadmap(
  data: RoadmapRequest
): Promise<RoadmapResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-roadmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        errorData.detail || `API Error: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    return responseData as RoadmapResponse;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network errors or parsing errors
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate roadmap. Please ensure the API is available at /api";

    console.error("Roadmap generation error:", error);
    throw new APIError(0, message);
  }
}

/**
 * Generate quiz questions for a specific topic
 */
export async function generateQuiz(
  data: QuizRequest
): Promise<QuizQuestionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        errorData.detail || `API Error: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    return responseData as QuizQuestionResponse[];
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network errors or parsing errors
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate quiz. Please ensure the API is available at /api";

    console.error("Quiz generation error:", error);
    throw new APIError(0, message);
  }
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
