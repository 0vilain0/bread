export function extractJsonFromResponse<T>(text: string): T {
  let cleaned = text.trim();

  if (cleaned.includes("```json")) {
    const start = cleaned.indexOf("```json") + "```json".length;
    const end = cleaned.indexOf("```", start);
    if (end !== -1) {
      cleaned = cleaned.slice(start, end).trim();
    }
  } else if (cleaned.includes("```")) {
    const start = cleaned.indexOf("```") + "```".length;
    const end = cleaned.indexOf("```", start);
    if (end !== -1) {
      cleaned = cleaned.slice(start, end).trim();
    }
  }

  if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
    const braceIndex = cleaned.search(/[{\[]/);
    if (braceIndex !== -1) {
      cleaned = cleaned.slice(braceIndex);
    }
  }

  const attempts: string[] = [];

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    attempts.push(`direct: ${(error as Error).message}`);
  }

  const unquoted =
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ? cleaned.slice(1, -1)
      : cleaned;

  try {
    return JSON.parse(unquoted) as T;
  } catch (error) {
    attempts.push(`stripped-quotes: ${(error as Error).message}`);
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
    } catch (error) {
      attempts.push(`brace-substring: ${(error as Error).message}`);
    }
  }

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1)) as T;
    } catch (error) {
      attempts.push(`bracket-substring: ${(error as Error).message}`);
    }
  }

  throw new Error(`Failed to parse AI response as JSON: ${attempts.join("; ")}`);
}
