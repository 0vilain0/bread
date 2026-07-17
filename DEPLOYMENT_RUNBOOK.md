# BREAD — Deployment & Demo Runbook

This runbook contains copy-paste commands to prepare and launch the full stack locally for your hackathon demo.
Run these in a terminal; the sequence assumes a clean machine with Node and Python installed.

---

## 1) Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- `pip` and virtualenv recommended
- Git (optional)

---

## 2) One-time Setup (first time on machine)

```bash
# Clone repo (if needed)
# git clone <repo-url> bread
cd /workspaces/bread

# Frontend dependencies
npm install

# Backend dependencies (create venv recommended)
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3) Environment (create .env)

Create `backend/.env` with the following keys (copy `.env.example` as starting point):

```bash
cp backend/.env.example backend/.env
```

Then edit `backend/.env` with your API keys:

```
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
# or
# OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

Notes:
- Use `GEMINI_API_KEY` if `AI_PROVIDER=gemini`, else set `OPENAI_API_KEY`.
- Keep `backend/.env` out of source control. It is now ignored by `.gitignore`.
- `.env.example` is safe to commit and used as a template.

---

## 4) Start Servers (two terminals recommended)

Terminal 1 — Backend (Uvicorn):

```bash
# from /workspaces/bread/backend
source .venv/bin/activate
python main.py
# or use uvicorn directly if you prefer:
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 — Frontend (Next.js):

```bash
cd /workspaces/bread
npm run dev
# Default: http://localhost:3000
```

---

## 5) Quick Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Roadmap sample
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{"current_job":"Accountant","target_job":"Data Analyst","hours_per_day":2.5}'

# Quiz sample
curl -X POST http://localhost:8000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic_name":"SQL Fundamentals"}'
```

If any of these fail, inspect `backend` terminal logs for hints.

---

## 6) Fast Dry-Run (2 hours before show)
1. Start backend and frontend.
2. Run the `curl` commands above.
3. Fill assessment in UI and click `Bake My Roadmap` three times with different inputs.
4. Click `Take Practice Quiz` on each step and answer questions.
5. Save `backend_logs.txt` with recent output.

```bash
# Save backend logs
# (If running foreground) copy-paste logs or run in background with redirection
python main.py 2>&1 | tee backend_logs.txt
```

---

## 7) Fallbacks for Live Demo
- If AI latency is too high (> 8s), show a pre-recorded GIF of the flow.
- If backend is unreachable, switch frontend to local mock mode (edit utils to return `MOCK_*` data) or use preloaded mock JSON.

---

## 8) Quick Restart Commands

```bash
# Restart backend
cd backend
pkill -f "uvicorn" || true
source .venv/bin/activate
python main.py

# Restart frontend
cd /workspaces/bread
pkill -f "next" || true
npm run dev
```

---

## 9) Notes for Judges' Room Network
- Use local demo builds to avoid relying on conference Wi-Fi.
- Keep presenter laptop offline (airplane) with local servers running to guarantee reliability.

---

Good luck — run the dry-run at T-minus 2 hours and keep this runbook printed by the presenter.
