import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";

import type { QuizQuestionResponse, RoadmapResponse } from "@/utils/api";

import {
  assertAIConfigured,
  getAIProvider,
  getGeminiApiKey,
  getOpenAIApiKey,
} from "./config";
import { extractJsonFromResponse } from "./extractJson";
import { buildQuizPrompt, buildRoadmapPrompt } from "./prompts";
import { validateQuizResponse, validateRoadmapResponse } from "./schemas";

const ROADMAP_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    similarity_score: { type: Type.INTEGER },
    analysis_summary: { type: Type.STRING },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER },
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                keyword: { type: Type.STRING },
              },
              required: ["source", "keyword"],
            },
          },
        },
        required: ["step", "title", "duration", "skills", "resources"],
      },
    },
  },
  required: ["similarity_score", "analysis_summary", "roadmap"],
};

const QUIZ_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correct_answer: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["id", "question", "options", "correct_answer", "explanation"],
      },
    },
  },
  required: ["questions"],
};

async function generateWithGemini(prompt: string, schema: object): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 2000,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Empty response from Gemini API");
  }

  return text;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a structured JSON generator. Return only valid JSON with no markdown fences or commentary.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Empty response from OpenAI API");
  }

  return text;
}

async function generateRawJson(prompt: string, schema: object): Promise<string> {
  const provider = getAIProvider();
  assertAIConfigured(provider);

  if (provider === "gemini") {
    return generateWithGemini(prompt, schema);
  }

  return generateWithOpenAI(prompt);
}

export async function generateRoadmap(
  currentJob: string,
  targetJob: string,
  hoursPerDay: number
): Promise<RoadmapResponse> {
  const prompt = buildRoadmapPrompt(currentJob, targetJob, hoursPerDay);
  const raw = await generateRawJson(prompt, ROADMAP_RESPONSE_SCHEMA);
  const parsed = extractJsonFromResponse<unknown>(raw);
  return validateRoadmapResponse(parsed);
}

export async function generateQuiz(topicName: string): Promise<QuizQuestionResponse[]> {
  const prompt = buildQuizPrompt(topicName);
  const raw = await generateRawJson(prompt, QUIZ_RESPONSE_SCHEMA);
  const parsed = extractJsonFromResponse<unknown>(raw);

  const questions = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { questions?: unknown }).questions)
      ? (parsed as { questions: unknown[] }).questions
      : null;

  return validateQuizResponse(questions);
}
