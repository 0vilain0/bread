# BREAD — Production-Readiness Polish & Bug-Hunting Checklist

This checklist helps ensure a stable, demo-ready product for the hackathon stage. Run through it at least twice before the final presentation.

---

## 1) Frontend Polish & Edge Cases (Next.js)

- [ ] Empty-State Protection
  - Verify the UI does not crash when `roadmap` or `quizQuestions` is `null`, empty, or missing fields.
  - Confirm friendly error screens show these exact messages:
    - Roadmap missing: "The oven is cold — No roadmap yet. Please bake your roadmap first."
    - Roadmap invalid: "The oven is cold — We couldn't bake a roadmap. Try again or check the backend."
    - Quiz missing: "The oven is cold — No quiz available right now. Please try again or select another step."

- [ ] Button Debouncing & Disable
  - Confirm `Bake My Roadmap` button disables immediately after click and during API calls.
  - Confirm `Take Practice Quiz` buttons disable per-card while the quiz is being generated (shows spinner on the card only).
  - Confirm global `isLoading` state is set during any backend operations to prevent parallel requests.

- [ ] Input Validation
  - Required fields (current job, target job, at least one skill) show an error message and prevent submission.
  - Time commitment parsing fallback exists when user types a freeform value.

- [ ] Responsive Layout Check
  - Test at projector resolutions: 1920x1080 and 1366x768 — ensure no overflow, no hidden CTAs.
  - Check both mobile (narrow) and large displays for typography scale and button tappable areas.

- [ ] UX & Accessibility
  - All interactive elements have clear disabled states and proper `aria-disabled` where applicable.
  - Color contrast checks for brown/cream color tokens. Use larger font sizes for projector viewing.

---

## 2) Backend Robustness (FastAPI)

- [ ] JSON Sanitization
  - Confirm `extract_json_from_response()` strips markdown fences, language hints (```json), quoted JSON strings, and falls back to extracting the first { ... } substring.
  - Test with sample noisy responses (e.g., wrapped in triple backticks, or with leading explanation text).

- [ ] Response Validation
  - Ensure `validate_roadmap_json()` and `validate_quiz_json()` raise clear errors and do not let malformed objects propagate to frontend.
  - Confirm endpoints return proper HTTP status codes (400 for validation, 500 for server errors).

- [ ] CORS & Environment
  - Confirm `FRONTEND_URL` is configured in `.env` for CORS (default: http://localhost:3000).
  - Confirm `AI_PROVIDER`, `GEMINI_API_KEY`, and/or `OPENAI_API_KEY` are set in `.env`.

- [ ] Logging & Observability
  - Enable INFO-level logs for startup and success flows; ensure errors include truncated AI responses or parse-errors.
  - Ensure logs are accessible after the demo (save to a file if possible).

---

## 3) Security & Env Setup

- [ ] .env Usage
  - Use `backend/.env` for secrets and create it from `backend/.env.example`.
  - Confirm `.env` is ignored by `.gitignore`.
  - Minimum required variables:
    - `AI_PROVIDER` (gemini | openai)
    - `GEMINI_API_KEY` or `OPENAI_API_KEY`
    - `FRONTEND_URL` (http://localhost:3000)

- [ ] Key Leakage Checks
  - Confirm no API keys are checked into git or present in JS bundles.

---

## 4) Pre-Demo Dry Run (2 hours before show)

- [ ] Start both services locally and run smoke tests (see `DEPLOYMENT_RUNBOOK.md`).
- [ ] Run `curl` health endpoint and sample API calls (roadmap + quiz) to validate responses.
- [ ] Run through the full demo flow from assessment → roadmap → quiz 3 times.
- [ ] Save logs to a file: `backend_logs.txt` and keep for troubleshooting.
- [ ] Generate and verify fallback GIF/video in case of network issues.
- [ ] Confirm that the presenter has the one-page cheat-sheet (printed) and the fallback script.

---

## 5) Quick Troubleshooting Commands

- Restart backend (Python):

```bash
cd /workspaces/bread/backend
pkill -f "uvicorn" || true
python main.py
```

- Restart frontend (Node):

```bash
cd /workspaces/bread
npm run dev
```

- Quick health checks:

```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/generate-roadmap -H 'Content-Type: application/json' -d '{"current_job":"Accountant","target_job":"Data Analyst","hours_per_day":2.5}'
```

---

## 6) Post-Demo

- Save logs and screenshots.
- Tag the final commit and push (if network allows).
- Note any edge-case that occurred and add to repo issues for follow-up.

---

Keep this checklist printed and give one copy to the presenter and one to the lead dev. Good luck — bake confidently! 
