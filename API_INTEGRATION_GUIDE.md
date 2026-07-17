# 🔌 API Integration Guide

## Overview

The BREAD application is currently using **mock data** for demonstration. Follow this guide to connect it to real AI backends.

---

## Step 1: Update Mock Data Functions

**File**: `utils/mockData.ts`

### Current Mock Implementation
```typescript
export function generateMockRoadmap(_currentJob: string, _targetJob: string): Roadmap {
  return MOCK_ROADMAP;  // Returns hardcoded data
}

export function generateMockQuiz(_stepTitle: string): QuizQuestion[] {
  return MOCK_QUIZ_QUESTIONS;  // Returns hardcoded questions
}
```

---

## Step 2: Connect to Real APIs

### Option A: Using Node.js Backend (Recommended)

#### Modify `generateMockRoadmap()` to call backend

```typescript
export async function generateMockRoadmap(
  currentJob: string,
  targetJob: string
): Promise<Roadmap> {
  const response = await fetch('/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_job: currentJob,
      target_job: targetJob,
      hours_per_day: "2-3 hours/day"  // Can be dynamic
    })
  });

  if (!response.ok) throw new Error('Failed to generate roadmap');
  return response.json();
}
```

#### Modify `generateMockQuiz()` to call backend

```typescript
export async function generateMockQuiz(
  stepTitle: string
): Promise<QuizQuestion[]> {
  const response = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic_name: stepTitle })
  });

  if (!response.ok) throw new Error('Failed to generate quiz');
  return response.json();
}
```

---

## Step 3: Create Backend Endpoints

### Node.js/Express Example

```typescript
// pages/api/generate-roadmap.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end();

  const { current_job, target_job, hours_per_day } = req.body;

  try {
    // Call Gemini/OpenAI API here
    const roadmap = await generateWithAI(current_job, target_job);
    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}

async function generateWithAI(currentJob: string, targetJob: string) {
  // Example with Google Gemini
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GOOGLE_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Create a career roadmap from ${currentJob} to ${targetJob}`
        }]
      }]
    })
  });

  return response.json();
}
```

---

## Step 4: Update Component Calls

### In `components/AssessmentForm.tsx`

**Before:**
```typescript
const roadmap = generateMockRoadmap(fullData.currentJob, fullData.targetJob);
```

**After:**
```typescript
const roadmap = await generateMockRoadmap(fullData.currentJob, fullData.targetJob);
```

### Required Changes in `handleSubmit()`

```typescript
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const roadmap = await generateMockRoadmap(
      fullData.currentJob,
      fullData.targetJob
    );
    setRoadmap(roadmap);
    setCurrentTab("roadmap");
  } catch (error) {
    console.error('Failed to generate roadmap:', error);
    setIsLoading(false);
    // Show error message to user
  }
};
```

---

## Step 5: Required API Response Formats

### POST `/api/generate-roadmap`

**Request:**
```json
{
  "current_job": "Accountant",
  "target_job": "Data Analyst",
  "hours_per_day": "2-3 hours/day"
}
```

**Response:**
```json
{
  "similarity_score": 62,
  "analysis_summary": "Your accounting background...",
  "estimated_time": "16-20 weeks",
  "steps": [
    {
      "step": 1,
      "title": "SQL Fundamentals",
      "duration": "4 weeks",
      "skills": ["SQL Queries", "Database Design"],
      "resources": [
        {
          "source": "YouTube",
          "keyword": "SQL for beginners"
        }
      ]
    }
    // ... more steps
  ]
}
```

### POST `/api/generate-quiz`

**Request:**
```json
{
  "topic_name": "SQL Fundamentals"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "question": "What is a SQL JOIN?",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "B",
    "explanation": "JOIN combines rows from two tables..."
  }
  // ... more questions
]
```

---

## Step 6: AI Services Integration Examples

### Google Gemini API

```typescript
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `Generate a career roadmap for transitioning from ${currentJob} to ${targetJob}. 
Return as JSON with: similarity_score, analysis_summary, estimated_time, steps array.`;

const result = await model.generateContent(prompt);
const roadmap = JSON.parse(result.response.text());
```

### OpenAI API

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "user",
    content: `Generate career roadmap JSON from ${currentJob} to ${targetJob}`
  }],
  response_format: { type: "json_object" }
});

const roadmap = JSON.parse(response.choices[0].message.content);
```

### Claude API

```typescript
const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: `Generate career roadmap JSON...`
  }]
});

const roadmap = JSON.parse(message.content[0].text);
```

---

## Step 7: Environment Variables

Create `.env.local`:

```
# Google Gemini
GOOGLE_API_KEY=your_gemini_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic
ANTHROPIC_API_KEY=your_claude_api_key

# Backend URL (if separate)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Step 8: Error Handling

Update context in `context/BreadContext.tsx`:

```typescript
interface BreadContextType {
  // ... existing
  error: string | null;
  setError: (error: string | null) => void;
}
```

Update component to show errors:

```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p className="text-red-800">{error}</p>
  </div>
)}
```

---

## Step 9: Testing the Integration

1. **Start backend server** (on port 3001 or 3000)
2. **Verify API endpoints** respond with correct format
3. **Test full flow**: Form → API call → Roadmap display → Quiz
4. **Check error handling**: Test with invalid inputs

---

## Step 10: Deployment Considerations

- Use environment variables for API keys
- Implement rate limiting
- Add request timeout (30 seconds)
- Cache responses when possible
- Monitor API usage and costs
- Handle network errors gracefully

---

## Example Full Stack Setup (Recommended)

```
Frontend: Next.js 14 (this app)
├── Calls: POST /api/generate-roadmap
└── Calls: POST /api/generate-quiz

Backend: Node.js/Express
├── Route: POST /api/generate-roadmap
│   └── Calls: Google Gemini / OpenAI
└── Route: POST /api/generate-quiz
    └── Calls: Google Gemini / OpenAI
```

---

## Troubleshooting

**Issue: "Failed to generate roadmap"**
- Check backend server is running
- Verify API key is set correctly
- Check network tab in browser DevTools
- Ensure response format matches expected schema

**Issue: Slow response**
- Implement caching with Redis
- Use streaming for long-running tasks
- Optimize prompts for faster responses
- Consider rate limiting

**Issue: JSON parsing error**
- Validate API response structure
- Add console.log to debug responses
- Implement schema validation (Zod/Yup)

---

## Production Checklist

- [ ] API keys secured in environment variables
- [ ] Error handling for all API calls
- [ ] Timeout protection (30s max)
- [ ] Rate limiting implemented
- [ ] Monitoring/logging setup
- [ ] CORS configured properly
- [ ] Response caching if needed
- [ ] User feedback for long operations
- [ ] Fallback data if API fails
- [ ] Load testing completed

---

**Ready to go live! 🚀**
