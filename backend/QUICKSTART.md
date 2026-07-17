# 🚀 Backend Quick Start Guide

## Get running in 2 minutes

### Step 1: Navigate to backend
```bash
cd backend
```

### Step 2: Setup environment (Choose ONE)

**Option A: Google Gemini (Recommended - Free)**
```bash
cp .env.example .env
# Edit .env and add your Gemini key from: https://makersuite.google.com/app/apikey
```

**Option B: OpenAI**
```bash
cp .env.example .env
# Edit .env and change:
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_key_from_https://platform.openai.com
```

### Step 3: Install & Run
```bash
pip install -r requirements.txt
python main.py
```

### Step 4: Test It
Open in browser: **http://localhost:8000/docs**

Click "Try it out" on any endpoint to test!

---

## Quick Test Commands

```bash
# Test health
curl http://localhost:8000/health

# Test roadmap
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{"current_job":"Accountant","target_job":"Data Analyst","hours_per_day":2}'

# Test quiz
curl -X POST http://localhost:8000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic_name":"SQL Fundamentals"}'
```

---

## Connect Frontend to Backend

Update `/workspaces/bread/utils/mockData.ts`:

```typescript
export async function generateMockRoadmap(currentJob: string, targetJob: string): Promise<Roadmap> {
  const response = await fetch('http://localhost:8000/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_job: currentJob,
      target_job: targetJob,
      hours_per_day: 2
    })
  });
  if (!response.ok) throw new Error('Failed');
  return response.json();
}

export async function generateMockQuiz(stepTitle: string): Promise<QuizQuestion[]> {
  const response = await fetch('http://localhost:8000/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic_name: stepTitle })
  });
  if (!response.ok) throw new Error('Failed');
  return response.json();
}
```

---

## Docker Alternative

```bash
docker-compose up
```

Then visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

**That's it! 🍞**
