export function buildRoadmapPrompt(
  currentJob: string,
  targetJob: string,
  hoursPerDay: number
): string {
  return `You are an expert career coach. Generate a detailed career transition roadmap.

Current Job: ${currentJob}
Target Job: ${targetJob}
Daily Commitment: ${hoursPerDay} hours

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "similarity_score": <0-100 integer - percentage of overlapping skills>,
  "analysis_summary": "<2-3 sentence analysis of the transition, highlighting advantages and key obstacles>",
  "roadmap": [
    {
      "step": 1,
      "title": "<specific phase title>",
      "duration": "<estimated duration e.g. '4 weeks'>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "resources": [
        {"source": "YouTube", "keyword": "<best search keyword>"},
        {"source": "Coursera", "keyword": "<best free course search>"},
        {"source": "Documentation", "keyword": "<documentation keyword>"}
      ]
    }
  ]
}

Generate exactly 4 steps. Each step should build upon the previous.`;
}

export function buildQuizPrompt(topicName: string): string {
  return `You are an expert educator creating a knowledge assessment quiz for career transition learners.

Topic: ${topicName}

Generate exactly 3 multiple-choice questions. Return ONLY a valid JSON object (no markdown, no explanation):
{
  "questions": [
    {
      "id": 1,
      "question": "<the question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correct_answer": "<exact string matching the correct option>",
      "explanation": "<supportive, warm explanation of why this is correct, in BREAD mentoring tone>"
    }
  ]
}

Requirements:
- Each option must be unique and plausible
- The correct_answer must EXACTLY match one of the options
- Explanations should be encouraging and supportive (50-100 words)
- Questions should test practical understanding, not memorization`;
}
