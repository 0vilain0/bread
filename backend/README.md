# 🍞 BREAD Backend - FastAPI Server

Production-ready FastAPI backend for the BREAD AI Career Pivot Platform. Handles AI-powered roadmap generation and interactive quiz creation using Google Gemini or OpenAI.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip or conda
- Google Gemini API key OR OpenAI API key

### Installation

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
```

Then edit `.env` with your API keys:

**Option A: Using Google Gemini (Recommended - Free)**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_from_https://makersuite.google.com/app/apikey
FRONTEND_URL=http://localhost:3000
```

**Option B: Using OpenAI**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_from_https://platform.openai.com/api-keys
FRONTEND_URL=http://localhost:3000
```

3. **Start the Server**
```bash
python main.py
```

Server runs at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs** (Swagger UI)

## 📋 Project Structure

```
backend/
├── main.py                 # Complete FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔌 API Endpoints

### 1. Health Check
```
GET /health
```
Quick server health verification.

**Response:**
```json
{
  "status": "healthy",
  "ai_provider": "gemini",
  "message": "BREAD Backend is running"
}
```

### 2. Generate Roadmap
```
POST /api/generate-roadmap
```

**Request:**
```json
{
  "current_job": "Accountant",
  "target_job": "Data Analyst",
  "hours_per_day": 2.5
}
```

**Response:**
```json
{
  "similarity_score": 62,
  "analysis_summary": "Your accounting background provides strong financial analysis foundations...",
  "roadmap": [
    {
      "step": 1,
      "title": "SQL Fundamentals & Database Essentials",
      "duration": "4 weeks",
      "skills": ["SQL Queries", "Database Design", "Joins & Aggregations"],
      "resources": [
        {
          "source": "YouTube",
          "keyword": "SQL basics for beginners"
        },
        {
          "source": "Coursera",
          "keyword": "Google Data Analytics Certificate"
        },
        {
          "source": "Documentation",
          "keyword": "PostgreSQL official documentation"
        }
      ]
    }
    // ... 3 more steps
  ]
}
```

**Request Fields:**
- `current_job` (string, required): Current job title
- `target_job` (string, required): Target career goal
- `hours_per_day` (float, optional): Daily learning commitment (default: 2.0, range: 0.5-24)

**Response Fields:**
- `similarity_score` (int): 0-100 percentage of skill overlap
- `analysis_summary` (string): AI analysis of transition challenges/advantages
- `roadmap` (array): Exactly 4 structured learning steps

### 3. Generate Quiz
```
POST /api/generate-quiz
```

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
    "question": "In SQL, what does the JOIN clause do?",
    "options": [
      "Separates data from two tables",
      "Combines rows from two tables based on a related column",
      "Deletes data from both tables",
      "Creates a backup of both tables"
    ],
    "correct_answer": "Combines rows from two tables based on a related column",
    "explanation": "JOIN is fundamental for combining data from multiple tables in relational databases. You're learning this key skill!"
  },
  // ... 2 more questions
]
```

**Request Fields:**
- `topic_name` (string, required): Topic for quiz generation (e.g., "Python Basics", "Tableau Design")

**Response Fields:**
- `id` (int): Question identifier
- `question` (string): Question text
- `options` (array): Exactly 4 multiple-choice options
- `correct_answer` (string): Must exactly match one of the options
- `explanation` (string): Warm, encouraging explanation in BREAD mentoring tone

## 🧪 Testing the API

### Using cURL

**Test Health Check:**
```bash
curl http://localhost:8000/health
```

**Test Roadmap Generation:**
```bash
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "current_job": "Marketing Manager",
    "target_job": "Product Manager",
    "hours_per_day": 3
  }'
```

**Test Quiz Generation:**
```bash
curl -X POST http://localhost:8000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "topic_name": "Product Strategy Fundamentals"
  }'
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Test roadmap
response = requests.post(
    f"{BASE_URL}/api/generate-roadmap",
    json={
        "current_job": "Accountant",
        "target_job": "Data Analyst",
        "hours_per_day": 2
    }
)
print(response.json())

# Test quiz
response = requests.post(
    f"{BASE_URL}/api/generate-quiz",
    json={"topic_name": "SQL Fundamentals"}
)
print(response.json())
```

### Using Swagger UI (Interactive)
1. Open http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. Fill in parameters and click "Execute"

## 🛠️ Configuration

### AI Provider Selection

#### Gemini 1.5 Flash (Recommended)
- **Cost**: Free tier available, very cheap
- **Speed**: Fast responses
- **Setup**: Minimal (no credit card required for free tier)

Set in `.env`:
```
AI_PROVIDER=gemini
```

#### OpenAI GPT-4o-Mini
- **Cost**: Paid only (~$0.15 per request)
- **Speed**: Competitive
- **Setup**: Requires billing setup

Set in `.env`:
```
AI_PROVIDER=openai
```

### CORS Configuration

By default, CORS is enabled for:
- `http://localhost:3000` (Frontend dev)
- `http://localhost:3001` (Alternative port)
- Any URL in `FRONTEND_URL` env var

To add more origins, edit `main.py` line ~90:
```python
allow_origins=[
    FRONTEND_URL, 
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourdomain.com"  # Add your domain
]
```

## 📝 Logging

All requests and errors are logged to console with timestamps. Log level can be adjusted:

```python
# In main.py at the bottom
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,
    reload=True,
    log_level="debug"  # Change to: debug, info, warning, error
)
```

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (invalid input) |
| 500 | Server error (API call failed) |

**Error Response Example:**
```json
{
  "detail": "Failed to generate roadmap. Please try again."
}
```

Common error causes:
- **Invalid API key**: Check GEMINI_API_KEY or OPENAI_API_KEY in .env
- **Network timeout**: AI service may be slow, try again
- **Malformed input**: Verify request JSON structure
- **Rate limit**: Too many requests, wait and retry

## 🔒 Production Deployment

For production deployment:

1. **Environment Variables**: Use secure secrets manager (AWS Secrets Manager, Vault, etc.)
2. **CORS**: Update to your actual domain
3. **Server**: Use `gunicorn` instead of `uvicorn` directly
4. **SSL/TLS**: Use HTTPS with valid certificates
5. **Rate Limiting**: Implement to prevent abuse
6. **Monitoring**: Setup error tracking (Sentry, DataDog)

### Deploy with Gunicorn

```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
ENV AI_PROVIDER=gemini
EXPOSE 8000
CMD ["python", "main.py"]
```

## 🐛 Troubleshooting

### "GEMINI_API_KEY not set"
```bash
# Verify .env file exists
ls -la .env

# Check if key is set
echo $GEMINI_API_KEY

# Make sure you ran
cp .env.example .env
# And edited .env with your actual key
```

### "Empty response from Gemini API"
- API key might be invalid
- Daily quota might be exceeded
- Try with OpenAI instead

### CORS Errors in Frontend
```
Access to XMLHttpRequest at 'http://localhost:8000/api/generate-roadmap' 
has been blocked by CORS policy
```
Solution: Verify `FRONTEND_URL` matches frontend's actual URL in `.env`

### Slow Response Times
- Gemini responses typically take 3-10 seconds
- First request of the day may be slower
- Consider implementing caching for repeated topics

## 📚 API Documentation

Full interactive API documentation available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔄 Connecting to Frontend

Update frontend's `utils/mockData.ts` to use real API:

```typescript
export async function generateMockRoadmap(
  currentJob: string,
  targetJob: string
): Promise<Roadmap> {
  const response = await fetch('http://localhost:8000/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_job: currentJob,
      target_job: targetJob,
      hours_per_day: 2
    })
  });
  
  if (!response.ok) throw new Error('Failed to generate roadmap');
  return response.json();
}
```

## 🚀 Next Steps

- [ ] Setup database to persist user progress
- [ ] Implement user authentication
- [ ] Add caching layer for frequent requests
- [ ] Setup monitoring and error tracking
- [ ] Implement rate limiting
- [ ] Add request logging to database
- [ ] Create admin dashboard
- [ ] Setup CI/CD pipeline

## 📄 License

Part of the BREAD Project - Open Source

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in console output
3. Test with Swagger UI at http://localhost:8000/docs
4. Verify API keys are correct

---

**Happy coding! 🍞**
