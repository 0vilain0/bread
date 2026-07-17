import { NextResponse } from "next/server";

import { generateQuiz } from "@/lib/ai/generate";
import { getOfflineQuiz, isOfflineBakingEnabled } from "@/lib/ai/offlineMode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic_name } = body;

    if (typeof topic_name !== "string" || !topic_name.trim()) {
      return NextResponse.json(
        { detail: "topic_name is required" },
        { status: 400 }
      );
    }

    if (isOfflineBakingEnabled()) {
      return NextResponse.json(getOfflineQuiz(), { status: 200 });
    }

    const quizQuestions = await generateQuiz(topic_name.trim());

    return NextResponse.json(quizQuestions, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate quiz";

    const status = message.includes("must be") || message.includes("required")
      ? 400
      : 500;

    return NextResponse.json({ detail: message }, { status });
  }
}
