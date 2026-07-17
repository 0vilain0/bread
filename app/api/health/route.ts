import { NextResponse } from "next/server";

import { getAIProvider, getGeminiApiKey, getOpenAIApiKey } from "@/lib/ai/config";
import { isOfflineBakingEnabled } from "@/lib/ai/offlineMode";

export async function GET() {
  const provider = getAIProvider();
  const offlineMode = isOfflineBakingEnabled();

  return NextResponse.json({
    status: "healthy",
    ai_provider: provider,
    offline_baking_mode: offlineMode,
    gemini_configured: Boolean(getGeminiApiKey()),
    openai_configured: Boolean(getOpenAIApiKey()),
    message: "BREAD API is running",
  });
}
