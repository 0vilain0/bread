# 🍞 BREAD Project - Complete Setup Guide

Complete setup instructions for the BREAD AI Career Pivot Platform (Frontend + Backend).

## 📦 Project Structure

```
bread/
├── app/                          # Next.js frontend (already built)
├── components/                   # React components
├── context/                      # State management
├── utils/                        # Frontend utilities
├── backend/                      # FastAPI backend (new)
│   ├── main.py                  # Complete FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   ├── test_api.py              # Test suite
│   ├── Dockerfile               # Docker configuration
│   ├── README.md                # Backend documentation
│   └── QUICKSTART.md            # Backend quick start
├── docker-compose.yml           # Docker orchestration
├── package.json                 # Frontend dependencies
└── README.md                    # Project documentation
```

## 🚀 Setup in 5 Steps

### Step 1: Clone Repository
```bash
cd /workspaces/bread
git status
```

### Step 2: Setup Frontend

```bash
# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# Run development server (in one terminal)
npm run dev
```
Frontend will be at: **http://localhost:3000**

### Step 3: Setup Backend Environment

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your API key
nano .env  # or use your editor
```

**Choose ONE AI Provider:**

**Option A: Google Gemini (Recommended - Free)**
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_from_https://makersuite.google.com/app/apikey
FRONTEND_URL=http://localhost:3000
```

**Option B: OpenAI**
```
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_from_https://platform.openai.com/api-keys
FRONTEND_URL=http://localhost:3000
```

### Step 4: Install Backend Dependencies

```bash
# Make sure you're in backend directory
cd /workspaces/bread/backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 5: Start Backend Server

```bash
# Make sure .env is set up with API key
python main.py

# Or with automatic reload on file changes
uvicorn main:app --reload
```

Backend will be at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

---

## ✅ Verification

### In New Terminal 1: Start Frontend
```bash
cd /workspaces/bread
npm run dev
# Visit http://localhost:3000
```

### In Terminal 2: Start Backend
```bash
cd /workspaces/bread/backend
python main.py
# Visit http://localhost:8000/docs
```

### In Terminal 3: Test Backend
```bash
cd /workspaces/bread/backend
python test_api.py
```

Expected output:
```
✅ Health Check: ✓ PASSED
✅ Roadmap Generation: ✓ PASSED  
✅ Quiz Generation: ✓ PASSED
Total: 3/3 tests passed
```

---

## 🔌 Connecting Frontend to Backend

The frontend currently uses mock data. To use the real backend:

### Option A: Manual Update
Edit `/workspaces/bread/utils/mockData.ts`:

```typescript
// Replace the mock functions with API calls

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

  if (!response.ok) {
    throw new Error('Failed to generate roadmap');
  }

  return response.json();
}

export async function generateMockQuiz(
  stepTitle: string
): Promise<QuizQuestion[]> {
  const response = await fetch('http://localhost:8000/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic_name: stepTitle })
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  return response.json();
}
```

Then also update the component that calls these functions to handle async:

Edit `/workspaces/bread/components/AssessmentForm.tsx` line ~75:

```typescript
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // Generate mock roadmap - now calls real API
    const roadmap = await generateMockRoadmap(
      fullData.currentJob,
      fullData.targetJob
    );
    setRoadmap(roadmap);
    setCurrentTab("roadmap");
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    alert("Failed to generate roadmap. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

### Option B: Using Docker (Recommended for Production)

```bash
cd /workspaces/bread

# Start both frontend and backend
docker-compose up

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📊 Testing the Full Flow

1. **Open Frontend**: http://localhost:3000
2. **Fill Assessment Form**:
   - Current Job: "Accountant"
   - Skills: "Excel, Financial Analysis"
   - Target Job: "Data Analyst"
   - Commitment: "2-3 hours/day"
   - Learning Style: "Video-heavy"
3. **Click "Bake My Roadmap"**
   - Should call backend API
   - Returns personalized roadmap
4. **Review Roadmap Dashboard**
   - See 62% skill alignment score
   - View 4-step learning path
5. **Take Quiz**
   - Click "Take Practice Quiz"
   - Answer questions
   - See results

---

## 🔍 API Documentation

Access interactive API docs:
```
http://localhost:8000/docs (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```

### Manual API Testing

```bash
# Test health
curl http://localhost:8000/health

# Test roadmap
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "current_job": "Marketing Manager",
    "target_job": "Product Manager",
    "hours_per_day": 3
  }'

# Test quiz
curl -X POST http://localhost:8000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic_name": "Product Strategy"}'
```

---

## 🐛 Troubleshooting

### Frontend Issues

**"CORS error when calling backend"**
- Make sure backend is running on :8000
- Check `.env` in backend has correct `FRONTEND_URL`
- Frontend must call `http://localhost:8000` (not `localhost`)

**"Network request failed"**
- Verify backend is running: `python main.py`
- Check backend is on port 8000
- Frontend should be on port 3000

### Backend Issues

**"GEMINI_API_KEY not set"**
```bash
# Check .env file exists
ls -la backend/.env

# Verify key is in file
cat backend/.env

# If not, copy template and add key
cp backend/.env.example backend/.env
nano backend/.env
```

**"Empty response from Gemini API"**
- API key might be invalid
- Try regenerating key from https://makersuite.google.com/app/apikey
- Or switch to OpenAI provider

**"Address already in use :8000"**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### CORS/Connection Issues

If you get `CORS` errors after updating frontend to use real API:

1. **Verify CORS is enabled** in `backend/main.py` (lines ~90):
   ```python
   allow_origins=[FRONTEND_URL, "http://localhost:3000", ...]
   ```

2. **Restart backend** after any changes:
   ```bash
   # Stop (Ctrl+C)
   # Then restart
   python main.py
   ```

3. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

---

## 📈 Performance Expectations

- **First request**: 5-10 seconds (AI model initialization)
- **Subsequent requests**: 3-8 seconds
- **Quiz generation**: 2-5 seconds
- **Total page load**: ~1 second

---

## 🚀 Deployment

### Deploy Backend to Production

**Using Heroku:**
```bash
cd backend
pip freeze > requirements.txt  # Update dependencies
heroku login
heroku create bread-api
heroku config:set AI_PROVIDER=gemini
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

**Using Render:**
1. Push repo to GitHub
2. Connect to Render at render.com
3. Create new Web Service
4. Set environment variables in Render dashboard
5. Deploy

### Deploy Frontend to Production

**Using Vercel (Recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Using Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📚 Documentation

- [Backend README](backend/README.md) - Detailed backend documentation
- [Backend Quick Start](backend/QUICKSTART.md) - 2-minute backend setup
- [Frontend README](README.md) - Frontend documentation
- [Main API Docs](http://localhost:8000/docs) - Interactive API documentation

---

## ✨ Next Steps

- [ ] Update frontend to use real API backend
- [ ] Setup database for user progress persistence
- [ ] Implement user authentication
- [ ] Add error tracking (Sentry)
- [ ] Setup monitoring and analytics
- [ ] Deploy to production
- [ ] Add more career transition examples
- [ ] Implement caching layer
- [ ] Create admin dashboard

---

## 🤝 Quick Reference

| Component | Port | URL |
|-----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/docs |
| ReDoc | 8000 | http://localhost:8000/redoc |

---

## 🆘 Getting Help

1. **Check logs**: Both frontend and backend print detailed logs
2. **Use Swagger UI**: http://localhost:8000/docs to test endpoints
3. **Run test suite**: `python backend/test_api.py`
4. **Check README files**: 
   - [Backend README](backend/README.md)
   - [Frontend README](README.md)

---

**You're all set! 🍞**

Start with the frontend at http://localhost:3000 and watch the magic happen!
