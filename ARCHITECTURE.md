# 🍞 BREAD Architecture Overview

Complete technical architecture of the BREAD AI Career Pivot Platform.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼─────────┐
                    │   Next.js SPA   │ ← Frontend (React Context)
                    │  Port 3000      │
                    └──────┬──────────┘
                           │ HTTP/JSON
                    ┌──────▼─────────────────┐
                    │   FastAPI Backend      │
                    │   Port 8000            │
                    │   - CORS Enabled       │
                    │   - Error Handling     │
                    └──────┬──────────────────┘
                           │ (Choose ONE)
        ┌──────────────────┴────────────────┐
        │                                   │
   ┌────▼─────────┐             ┌──────────▼─────┐
   │ Google Gemini│             │  OpenAI GPT-4o │
   │  (Free/Fast) │             │   (Paid/Fast)  │
   └──────────────┘             └────────────────┘
```

## 📦 Frontend Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Component Structure
```
page.tsx (Main Entry)
  ├── BreadApp (Provider Wrapper)
  │   └── BreadProvider (Context)
  │       └── BreadAppContent (Router)
  │           ├── AssessmentForm (Tab 1)
  │           ├── RoadmapDashboard (Tab 2)
  │           └── DailyQuiz (Tab 3)
```

### Data Flow
```
User Input (Assessment Form)
       ↓
BreadContext (Global State)
       ↓
API Call to Backend (/api/generate-roadmap)
       ↓
Response Parsing & State Update
       ↓
UI Render (RoadmapDashboard)
       ↓
Quiz Generation Request (/api/generate-quiz)
       ↓
Quiz Display (DailyQuiz Component)
```

### Context State
```typescript
{
  currentTab: "assessment" | "roadmap" | "quiz"
  assessmentData: AssessmentData
  roadmap: Roadmap
  currentQuizStep: number
  quizQuestions: QuizQuestion[]
  isLoading: boolean
}
```

---

## 🔧 Backend Architecture

### Tech Stack
- **Framework**: FastAPI (Python 3.11)
- **AI Client**: google-generativeai (Gemini) OR openai (GPT-4o)
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **CORS**: fastapi.middleware.cors

### Request/Response Flow

#### Endpoint 1: `/api/generate-roadmap`
```
Request JSON
{
  "current_job": "Accountant",
  "target_job": "Data Analyst",
  "hours_per_day": 2.5
}
        ↓
Pydantic Validation (GenerateRoadmapRequest)
        ↓
AI Prompt Engineering
        ↓
API Call to Gemini/OpenAI
        ↓
JSON Extraction from Response
        ↓
Pydantic Conversion (GenerateRoadmapResponse)
        ↓
Response JSON
{
  "similarity_score": 62,
  "analysis_summary": "...",
  "roadmap": [
    {
      "step": 1,
      "title": "SQL Fundamentals",
      "duration": "4 weeks",
      "skills": ["SQL Queries", ...],
      "resources": [{"source": "YouTube", "keyword": "..."}]
    },
    // ... 3 more steps
  ]
}
```

#### Endpoint 2: `/api/generate-quiz`
```
Request JSON
{
  "topic_name": "SQL Fundamentals"
}
        ↓
Pydantic Validation (GenerateQuizRequest)
        ↓
AI Prompt Engineering
        ↓
API Call to Gemini/OpenAI
        ↓
JSON Extraction from Response
        ↓
Pydantic Array Validation (List[QuizQuestion])
        ↓
Response JSON
[
  {
    "id": 1,
    "question": "What is a JOIN?",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "B",
    "explanation": "..."
  },
  // ... 2 more questions
]
```

### Error Handling
```
User Request
    ↓
Try:
  - Validate input (Pydantic)
  - Call AI API
  - Parse response
  - Validate output
Except:
  - ValueError → 400 Bad Request
  - Exception → 500 Internal Server Error
  - Timeout → 500 with retry message
```

### Pydantic Models
```
Input Models:
├── GenerateRoadmapRequest
│   ├── current_job: str
│   ├── target_job: str
│   └── hours_per_day: float

├── GenerateQuizRequest
│   └── topic_name: str

Output Models:
├── GenerateRoadmapResponse
│   ├── similarity_score: int
│   ├── analysis_summary: str
│   └── roadmap: List[RoadmapStep]

├── RoadmapStep
│   ├── step: int
│   ├── title: str
│   ├── duration: str
│   ├── skills: List[str]
│   └── resources: List[RoadmapResource]

├── RoadmapResource
│   ├── source: str
│   └── keyword: str

└── QuizQuestion
    ├── id: int
    ├── question: str
    ├── options: List[str]
    ├── correct_answer: str
    └── explanation: str
```

---

## 🔄 Communication Protocol

### CORS Configuration
```python
# Allowed Origins
- http://localhost:3000 (Frontend Dev)
- http://localhost:3001 (Alternative)
- {FRONTEND_URL} (Environment Variable)

# Allowed Methods
- GET, POST, PUT, DELETE, OPTIONS

# Allowed Headers
- Content-Type, Authorization
```

### Request/Response Headers
```
Request:
Content-Type: application/json
Origin: http://localhost:3000

Response:
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
```

### Error Response Format
```json
{
  "detail": "Failed to generate roadmap. Please try again."
}
```

---

## 🤖 AI Integration

### Gemini 1.5 Flash Configuration
```python
Model: gemini-1.5-flash
Temperature: 0.7
Max Tokens: 2000 (roadmap), 1500 (quiz)
Response Format: JSON (forced via prompt engineering)
```

### OpenAI GPT-4o-Mini Configuration
```python
Model: gpt-4o-mini
Temperature: 0.7
Max Tokens: 2000 (roadmap), 1500 (quiz)
Response Format: JSON (forced via prompt engineering)
```

### Prompt Engineering Strategy

**Structured Output Approach:**
1. Prompt explicitly requests JSON format
2. Provide exact JSON schema in prompt
3. Instructions to avoid markdown code blocks
4. Error handling for malformed responses

**Example Prompt Structure:**
```
[Task Description]

[Input Details]

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "required_fields": "with examples"
}

[Specific Requirements]
```

---

## 🚀 Deployment Architecture

### Local Development
```
Frontend: npm run dev (http://localhost:3000)
Backend: python main.py (http://localhost:8000)
```

### Docker Deployment
```
docker-compose up
├── Service: bread-backend (Port 8000)
│   └── Dockerfile (Python 3.11-slim)
├── Service: bread-frontend (Port 3000)
│   └── Dockerfile.frontend (Node 18-alpine)
└── Network: bread-network
```

### Production Deployment
```
Frontend: Vercel / Netlify
Backend: Heroku / Render / AWS
Database: (Future) PostgreSQL / MongoDB
Monitoring: Sentry / DataDog
```

---

## 📊 Data Models

### Career Transition Roadmap
```
Accountant (3 years exp) 
  + Excel, Financial Analysis, SQL basics
                ↓
        Similarity: 62%
                ↓
    4-Week Learning Path
  ├─ Week 1-4: SQL + DB Design
  ├─ Week 5-9: Python + Pandas
  ├─ Week 10-13: Tableau/Power BI
  └─ Week 14-18: Analytics + Projects
                ↓
        Data Analyst (Ready)
```

### Quiz System
```
Topic: "SQL Fundamentals"
           ↓
    3 Questions Generated
  ├─ Question 1: Concepts
  ├─ Question 2: Practical
  └─ Question 3: Application
           ↓
    Score: X/3 (0-100%)
```

---

## ⚡ Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| API Health Check | 100ms | No AI |
| Roadmap Generation | 5-10s | 4 steps generated |
| Quiz Generation | 2-5s | 3 questions generated |
| Frontend Render | <500ms | React optimization |
| Browser Load | 1-2s | Total time to interactive |

---

## 🔐 Security Considerations

### API Keys
- Never commit `.env` with keys
- Use environment variables only
- Rotate keys regularly
- Different keys for dev/prod

### CORS
- Restrict to specific origins
- Frontend URL from env var
- Prevents unauthorized API access

### Input Validation
- Pydantic enforces field types
- String length limits
- Number ranges validated
- Prevents injection attacks

### Error Handling
- Don't expose sensitive info in errors
- Log full details server-side
- Generic messages to client
- Rate limiting (future)

---

## 📈 Scalability Path

### Current (MVP)
```
Single Backend Process
├── No Database
├── In-Memory State
└── Mock Data Support
```

### Phase 1 (Scale)
```
Backend Load Balancer
├── Multiple Backend Processes
├── Redis Cache Layer
└── PostgreSQL Database
```

### Phase 2 (Enterprise)
```
Microservices Architecture
├── API Gateway
├── Roadmap Generation Service
├── Quiz Generation Service
├── User Service
├── Analytics Service
└── Database Cluster
```

---

## 🔍 Monitoring & Observability

### Logging
- Structured logging with timestamps
- Request/response logging
- Error stack traces
- Performance metrics

### Metrics to Track
- Response times
- Error rates
- API usage patterns
- AI model performance
- CORS issues

### Health Checks
```
GET /health
→ Returns: status, ai_provider, message
→ Used for: uptime monitoring, load balancer checks
```

---

## 🎯 API Rate Limits (Future)

```
Free Tier:
- 100 requests/day
- 1 request/minute

Pro Tier:
- Unlimited requests
- 10 requests/second

Premium Tier:
- Unlimited
- Priority queue
```

---

## 📚 Integration Points

### Frontend → Backend
```
fetch('http://localhost:8000/api/generate-roadmap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
})
```

### Backend → AI Service
```python
response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
# or
response = openai_client.chat.completions.create(model="gpt-4o-mini", ...)
```

### Backend → Frontend
```json
{
  "similarity_score": 62,
  "analysis_summary": "...",
  "roadmap": [...]
}
```

---

## 🏁 Deployment Checklist

- [ ] Frontend build optimized
- [ ] Backend dependencies locked
- [ ] API keys in secrets manager
- [ ] CORS properly configured
- [ ] Error tracking setup
- [ ] Monitoring enabled
- [ ] Database connection tested
- [ ] SSL/TLS certificates
- [ ] Rate limiting configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained

---

## 📖 Key Documentation Files

- [Backend README](backend/README.md) - Complete backend guide
- [Frontend README](README.md) - Complete frontend guide
- [Setup Guide](SETUP_GUIDE.md) - Installation instructions
- [Build Summary](BUILD_SUMMARY.md) - Project overview
- [API Integration Guide](API_INTEGRATION_GUIDE.md) - Integration details

---

**Architecture version: 1.0.0**
**Last updated: July 2026**
