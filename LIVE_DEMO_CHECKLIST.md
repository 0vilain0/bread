# BREAD — Live Demo Checklist & Runbook
### Single-Port Next.js Architecture (No External Backend)

This checklist is aligned with the **one-port monolith**: frontend + API Route Handlers on `localhost:3000` only.

For the full stage script, see **`BAKERY_PITCH_PLAYBOOK.md`**.

---

## Before the Demo (1 hour prior)

- [ ] Fully charge laptop and bring charger
- [ ] Set display to 1920×1080 (or highest supported)
- [ ] Configure `.env` with `GEMINI_API_KEY` (or `OPENAI_API_KEY` + `AI_PROVIDER=openai`)
- [ ] Start app: `npm run dev`
- [ ] Confirm health: `curl http://localhost:3000/api/health`
- [ ] Dry-run full demo: Assessment → Roadmap → Quiz (wrong answer on purpose)
- [ ] Record a 20s fallback GIF of roadmap reveal + quiz explanation
- [ ] Disable system updates/notifications; close other apps
- [ ] Test projector/HDMI cable

## Pre-Show (5 minutes prior)

- [ ] `npm run dev` running (single terminal — no Python backend needed)
- [ ] Browser in incognito at `http://localhost:3000`
- [ ] DevTools closed
- [ ] Demo inputs memorized: **English Teacher → Junior UX Writer**
- [ ] Water bottle nearby; phone on silent

## Demo Flow (75 seconds — embedded in 3-min pitch)

| Step | Action | Narration cue |
|------|--------|---------------|
| 1 | Fill assessment form (5 steps) | "English Teacher pivoting to Junior UX Writer" |
| 2 | Click `🍞 Bake My Roadmap` | "Watch the oven — Baking..." |
| 3 | Roadmap loads | Point at **Skill Alignment Score** |
| 4 | Scroll Step 1 | Highlight skills + resources |
| 5 | Click **Take Practice Quiz** on Step 1 | "BREAD closes the learning loop" |
| 6 | Answer **incorrectly** on purpose | "Not a cold Incorrect — a mentor explanation" |
| 7 | Read explanation aloud | Tie back to warm BREAD tone |

## Technical Sanity Checks (1 minute)

```bash
# Health
curl http://localhost:3000/api/health

# Roadmap (optional pre-show test)
curl -X POST http://localhost:3000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d "{\"current_job\":\"English Teacher\",\"target_job\":\"Junior UX Writer\",\"hours_per_day\":2.5}"

# Quiz (optional pre-show test)
curl -X POST http://localhost:3000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d "{\"topic_name\":\"UX Writing Fundamentals\"}"
```

## Fallback Strategies

- **AI latency > 8s:** Keep narrating; show fallback GIF if needed
- **API key missing:** Use backup `.env` — never debug on stage
- **Quiz fails:** Switch to pre-recorded GIF
- **Projector fails:** Verbal walkthrough + laptop demos after

## Post-Demo

- [ ] Capture judge questions
- [ ] Stop dev server
- [ ] Log any demo tweaks for follow-up

---

**Full pitch script + Q&A defense → `BAKERY_PITCH_PLAYBOOK.md`**
