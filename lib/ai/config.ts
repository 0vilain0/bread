export type AIProvider = "gemini" | "openai";

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  return provider === "openai" ? "openai" : "gemini";
}

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

export function assertAIConfigured(provider: AIProvider = getAIProvider()): void {
  if (provider === "gemini" && !getGeminiApiKey()) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  if (provider === "openai" && !getOpenAIApiKey()) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
}
