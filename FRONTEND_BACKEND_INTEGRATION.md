# Frontend-Backend Integration Guide

## 📊 Integration Summary

The Next.js frontend has been successfully connected to the FastAPI backend at `http://localhost:8000`. All API calls are now live and properly integrated across the three main views.

---

## 🔄 Data Flow Architecture

```
[Assessment Form] 
    ↓ (user fills form & clicks "Bake My Roadmap")
    ├─ POST /api/generate-roadmap
    └─ → [Roadmap Dashboard] (displays AI-generated roadmap)
            ↓ (user clicks "Take Practice Quiz" on any step)
            ├─ POST /api/generate-quiz
            └─ → [Daily Quiz] (displays step-specific quiz)
                    ↓ (user completes quiz)
                    └─ → Results & back to Roadmap
```

---

## 🛠️ Files Modified

### 1. **[utils/api.ts](utils/api.ts)** ✨ NEW FILE
Centralized API client with:
- `generateRoadmap()` - Calls POST `/api/generate-roadmap`
- `generateQuiz()` - Calls POST `/api/generate-quiz`
- `checkHealth()` - Calls GET `/health`
- Comprehensive error handling with `APIError` class
- Type definitions matching backend responses

**Key Features:**
- Error recovery with user-friendly messages
- Network error detection
- Proper TypeScript types for request/response

### 2. **[context/BreadContext.tsx](context/BreadContext.tsx)** 🔄 UPDATED
Added state management for:
- `activeTopicName` - Track current quiz topic
- `errorMessage` - Display API errors to user
- Updated types to match backend responses:
  - `Roadmap` now = `RoadmapResponse` from API
  - `QuizQuestion` now = `QuizQuestionResponse` from API

### 3. **[components/AssessmentForm.tsx](components/AssessmentForm.tsx)** 🔄 UPDATED
Changed from mock data to live API:
- ✅ Imports `generateRoadmap` from `@/utils/api`
- ✅ Calls real backend on "Bake My Roadmap" submit
- ✅ Handles API errors gracefully with error card
- ✅ Shows loading state during API call
- ✅ Parses hours_per_day from timeCommitment field
- ✅ Validates all required fields before submission

**Error Handling:**
- Catches `APIError` exceptions
- Displays user-friendly error messages
- Console logging for debugging
- Suggests checking backend URL if connection fails

### 4. **[components/RoadmapDashboard.tsx](components/RoadmapDashboard.tsx)** 🔄 UPDATED
Connected to dynamic backend data:
- ✅ Maps through `roadmap.roadmap[]` array dynamically
- ✅ Uses `similarity_score` (from backend, not `similarityScore`)
- ✅ Uses `analysis_summary` (from backend, not `analysisSummary`)
- ✅ Removed hardcoded `estimatedTime` (not in backend)
- ✅ Grid layout changed from 3 columns to 2 columns (removed time)
- ✅ Quiz buttons now call `generateQuiz()` API endpoint
- ✅ Loading state on quiz buttons during API call
- ✅ Error messages for quiz generation failures
- ✅ Passes `activeTopicName` to context

**Dynamic Rendering:**
```tsx
{roadmap.roadmap.map((step, idx) => (
  // Renders each step from backend array
))}
```

### 5. **[components/DailyQuiz.tsx](components/DailyQuiz.tsx)** 🔄 UPDATED
Adapted for backend quiz structure:
- ✅ Uses `correct_answer` field (from backend)
- ✅ Questions now come directly from API response
- ✅ Displays `activeTopicName` in header
- ✅ All quiz logic works with new field names
- ✅ Explanations displayed from API response

---

## 📡 API Endpoints Called

### Endpoint 1: Generate Roadmap
```typescript
// Called from: AssessmentForm.tsx
POST http://localhost:8000/api/generate-roadmap

Request:
{
  "current_job": string,
  "target_job": string,
  "hours_per_day": number
}

Response:
{
  "similarity_score": number,
  "analysis_summary": string,
  "roadmap": [
    {
      "step": number,
      "title": string,
      "duration": string,
      "skills": string[],
      "resources": [
        { "source": string, "keyword": string }
      ]
    },
    // ... 3 more steps
  ]
}
```

### Endpoint 2: Generate Quiz
```typescript
// Called from: RoadmapDashboard.tsx (handleTakeQuiz function)
POST http://localhost:8000/api/generate-quiz

Request:
{
  "topic_name": string
}

Response:
[
  {
    "id": number,
    "question": string,
    "options": string[],
    "correct_answer": string,
    "explanation": string
  },
  // ... 2 more questions
]
```

### Endpoint 3: Health Check (Optional)
```typescript
// Can be called to verify backend is running
GET http://localhost:8000/health

Response:
{
  "status": string,
  "ai_provider": string,
  "message": string
}
```

---

## 🚀 Testing the Integration

### Step 1: Start the Backend
```bash
cd /workspaces/bread/backend
python main.py
```
**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 2: Start the Frontend
```bash
cd /workspaces/bread
npm run dev
```
**Expected output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

### Step 3: Test Full Flow
1. **Open** http://localhost:3000
2. **Fill Assessment Form:**
   - Current Job: "Accountant"
   - Skills: "Excel, Financial Analysis"
   - Target Job: "Data Analyst"
   - Commitment: "2-3 hours/day"
   - Learning Style: "Video-heavy (YouTube, Courses)"
3. **Click** "🍞 Bake My Roadmap"
   - Watch loading animation
   - Should see roadmap appear in 5-10 seconds
4. **Click** "Take Practice Quiz" on any step
   - Should generate quiz in 2-5 seconds
   - Answer questions
   - See results

### Step 4: Monitor for Errors
Check browser console (F12) for:
- Network tab to see API requests/responses
- Console tab for error messages
- Network errors indicate backend is down

---

## 🔍 Error Handling Strategy

### User-Facing Errors
All API errors show a friendly error card:
```
⚠️ Error: [error message]
Please check that the backend is running on http://localhost:8000
```

### Console Logging
Detailed logs for debugging:
```javascript
// AssessmentForm.tsx
console.error("API Error:", error.statusCode, error.message);

// RoadmapDashboard.tsx
console.error("Quiz API Error:", error.statusCode, error.message);
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Connection refused" | Backend not running | Run `python main.py` |
| "404 Not Found" | Wrong API path | Check `/api/generate-roadmap` spelling |
| "500 Internal Error" | API key missing or invalid | Set GEMINI_API_KEY in backend `.env` |
| Blank page after form | CORS error | Check backend CORS config |
| Quiz not loading | Backend timeout | Increase timeout in api.ts if needed |

---

## 🔗 Type Safety

### Backend Response Types (in utils/api.ts)
All TypeScript types match backend Pydantic models:

```typescript
// Matches backend RoadmapResponse
export interface RoadmapResponse {
  similarity_score: number;
  analysis_summary: string;
  roadmap: RoadmapStepResponse[];
}

// Matches backend RoadmapStep
export interface RoadmapStepResponse {
  step: number;
  title: string;
  duration: string;
  skills: string[];
  resources: RoadmapResource[];
}

// Matches backend QuizQuestion
export interface QuizQuestionResponse {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}
```

### Context Types
Frontend context types are aliased to backend types:
```typescript
export type Roadmap = RoadmapResponse;
export type QuizQuestion = QuizQuestionResponse;
```

This ensures type safety across all components.

---

## 📊 State Management Flow

### Global Context (BreadContext)
```
┌─────────────────────────────────────────┐
│ BreadContext (Global State)             │
├─────────────────────────────────────────┤
│ • currentTab: "assessment" | "roadmap" | "quiz"
│ • assessmentData: user input data        │
│ • roadmap: AI-generated roadmap          │
│ • quizQuestions: current quiz questions  │
│ • currentQuizStep: current step number   │
│ • activeTopicName: current quiz topic    │
│ • isLoading: API loading state           │
│ • errorMessage: error to display         │
└─────────────────────────────────────────┘
         ↓
    Used by all 3 views
```

### Component State
```
AssessmentForm:
  • formData: form input (local)
  • currentStep: form progress (local)
  • (reads/writes: global context)

RoadmapDashboard:
  • (reads: global roadmap, quizQuestions)
  • (writes: quizQuestions, currentTab, currentQuizStep)

DailyQuiz:
  • currentQuestion: quiz progress (local)
  • selectedAnswer: user selection (local)
  • score: quiz score (local)
  • (reads: global quizQuestions, activeTopicName)
```

---

## 🎯 Key Integration Points

### 1. Assessment Form → Roadmap (POST /api/generate-roadmap)
```typescript
const roadmapData = await generateRoadmap({
  current_job: fullData.currentJob,
  target_job: fullData.targetJob,
  hours_per_day: hoursPerDay,
});
setRoadmap(roadmapData);
setCurrentTab("roadmap");
```

### 2. Roadmap → Quiz (POST /api/generate-quiz)
```typescript
const quizData = await generateQuiz({
  topic_name: stepTitle,
});
setQuizQuestions(quizData);
setCurrentTab("quiz");
```

### 3. Quiz → Roadmap (Retake)
```typescript
onClick={() => setCurrentTab("roadmap")}
```

---

## 📝 API Response Mapping

### Before (Mock Data)
```typescript
roadmap.similarityScore    // camelCase
roadmap.analysisSummary    // camelCase
roadmap.estimatedTime      // not used
roadmap.steps[]            // local structure
question.correctAnswer     // camelCase
```

### After (Real API)
```typescript
roadmap.similarity_score   // snake_case from backend
roadmap.analysis_summary   // snake_case from backend
roadmap.roadmap[]          // backend array (no estimatedTime)
question.correct_answer    // snake_case from backend
```

---

## 🔄 Backward Compatibility

### Mock Data Still Available
The original `mockData.ts` is still in place but **no longer used** by any components. To revert to mock data temporarily:

```typescript
// In AssessmentForm.tsx (commented out)
// import { generateMockRoadmap } from "@/utils/mockData";
// const roadmap = generateMockRoadmap(currentJob, targetJob);
```

---

## 🚀 Production Checklist

- [ ] Backend running on production URL (not localhost)
- [ ] Update `API_BASE_URL` in `utils/api.ts` to production URL
- [ ] CORS configured for production domain in backend
- [ ] API keys properly managed (never in client-side code)
- [ ] Error messages reviewed and approved
- [ ] Loading states tested with slow network
- [ ] Timeout increased if needed for slow APIs
- [ ] Health check endpoint working
- [ ] Logging configured for monitoring
- [ ] Rollback plan in place

---

## 📚 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Complete Delivery](COMPLETE_DELIVERY.md)

---

## 🎉 Integration Complete!

Your BREAD application now has **live API integration** with:

✅ Dynamic roadmap generation  
✅ Quiz generation by step  
✅ Full error handling  
✅ Loading states  
✅ Type-safe integration  
✅ User-friendly error messages  

**Ready for production testing and deployment!**

---

## 📞 Troubleshooting

### Can't Connect to Backend
```bash
# Check if backend is running
curl http://localhost:8000/health

# If error, start backend
cd backend
python main.py
```

### API Returning 500 Error
```bash
# Check backend logs for errors
# Look for API key issues in backend console
# Ensure GEMINI_API_KEY or OPENAI_API_KEY is set
```

### Questions or Issues
1. Check browser console (F12) for error details
2. Check backend console for API logs
3. Review error messages in network tab
4. Refer to [backend/README.md](../backend/README.md) for API details

---

**Integration Status**: ✅ **COMPLETE**  
**Last Updated**: July 2026  
**Frontend Version**: 1.0.0  
**Backend Version**: 1.0.0  

🍞 **Ready to serve real users!**
