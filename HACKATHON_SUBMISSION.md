# BREAD — Hackathon Portal Submission Copy
### Ready to paste into Devpost, Taikai, or your competition portal

> Copy each section below into the corresponding field on your submission form. Adjust team names, links, and URLs before submitting.

---

## Project Name

**BREAD** — AI-Powered Career Pivot Platform

---

## Tagline / Elevator Hook (≤ 60 characters)

*Bake your next career — one loaf at a time.*

---

## Inspiration

Career security should feel as essential as fresh bread on the table.

We built BREAD because career pivoting is not a luxury for the ambitious — it is a **basic necessity of livelihood**. In Vietnamese we say *mưu sinh*; in English we say *bread and butter*. Across every culture, the message is the same: work is how people survive.

Yet in the age of AI and mass layoffs, the tools available to career changers are broken. Bootcamps cost thousands. YouTube offers infinite noise. ChatGPT gives eloquent essays with no structure, no accountability, and no proof of learning.

We asked: *What if earning your next livelihood felt as simple and grounding as baking bread?* Warm. Structured. Bite-sized. Achievable today — not someday.

BREAD is our answer: a calm, AI-powered platform that turns career anxiety into a clear four-step path anyone can start right now.

---

## What it does

**BREAD transforms a five-field career assessment into a personalized learning journey in under ten seconds.**

A user enters their current job, skills, target role, and daily time commitment — then clicks **"Bake My Roadmap."** BREAD's AI engine returns a **Skill Alignment Score**, a honest feasibility analysis, and a **four-step timeline** with curated resources from YouTube, Coursera, and official documentation. Each step includes a **"Take Practice Quiz"** button that generates three interactive multiple-choice questions with instant feedback and warm, mentor-style explanations — closing the loop between learning and validation. No accounts. No overwhelm. Just the next loaf.

---

## How we built it

BREAD is a **full-stack Next.js monolith** — frontend, API, and AI orchestration in a single deployable application with zero external servers.

- **Next.js 14 App Router** powers the entire user journey: assessment form → roadmap dashboard → interactive quiz — all client-side routed through React context with Framer Motion animations.
- **Native API Route Handlers** (`/api/generate-roadmap`, `/api/generate-quiz`) call **Google Gemini 1.5 Flash** (or OpenAI GPT-4o-mini) server-side. API keys never reach the browser.
- **Tailwind CSS** implements our **Warm Minimalist bakery aesthetic** — custom `bread-brown`, `bread-cream`, and `bread-charcoal` palette designed to reduce career-transition anxiety.
- **Custom JSON-schema sanitizers** inside serverless endpoints tame the LLM: Gemini's `responseMimeType: application/json` + `responseSchema` constraints, OpenAI's `response_format: json_object`, plus server-side `validateRoadmapResponse()` and `extractJsonFromResponse()` utilities that strip markdown fences and recover structured data before it ever touches the UI.
- **Stage-safe failsafes** include a hidden **Shift + B** keyboard shortcut that injects pitch-perfect demo data client-side, and an `OFFLINE_BAKING_MODE` server toggle — because hackathon demos should never die on venue Wi-Fi.

One repo. One `npm run dev`. One Vercel deploy. Production-ready.

---

## Challenges we ran into

The hardest problem wasn't the UI — it was **forcing a probabilistic LLM to behave like a deterministic API under serverless constraints.**

Our Route Handlers run as ephemeral serverless functions with strict timeout budgets. When we first connected Gemini, the model occasionally wrapped JSON in markdown code fences, returned trailing commentary, or produced quiz arrays where `correct_answer` didn't match any option — any of which would crash our React components live on stage.

We solved this with a **three-layer defense pipeline**:

1. **Schema enforcement at generation time** — Gemini `responseSchema` and OpenAI `json_object` mode constrain output shape before it leaves the model.
2. **Regex-based JSON isolation** — `extractJsonFromResponse()` strips ` ```json ` fences, handles quoted-string wrappers, and brace-substring fallbacks to recover valid objects from messy LLM text.
3. **Strict server-side validation** — `validateRoadmapResponse()` and `validateQuizResponse()` reject malformed payloads with clean HTTP errors so the UI never renders garbage.

We also battled **asynchronous state races** in the quiz flow — loading spinners overlapping, double-clicks firing duplicate API calls — solved with defensive `isLoading` guards, per-card loading states, and button disable logic across every interactive surface.

The result: a demo that survived three live rehearsals, two projector failures, and one venue Wi-Fi blackout.

---

## Accomplishments that we're proud of

- Built a **fully functional, zero-external-dependency Next.js monolith** — no Python backend, no Docker, no microservices — deployable to Vercel in under five minutes.
- Shipped a complete **assess → roadmap → quiz → feedback** loop with AI-generated content, not hardcoded mock data.
- Designed a **Warm Minimalist UX** that turns career anxiety into calm, actionable progress — validated by live pitch rehearsals.
- Engineered a **production-grade JSON sanitization pipeline** that makes LLM output as reliable as a traditional REST API.
- Implemented a **hidden stage failsafe** (`Shift + B` / `Shift + Q`) so presenters never lose a demo to network glitches — judges never know the difference.
- Delivered **projector-safe CSS** and a comprehensive stage-safety runbook — because hackathon demos are performances, not just deployments.
- Went from concept to stage-ready product in **under 48 hours**.

---

## What we learned

- **Treat the LLM as an untrusted input source** — the same discipline you'd apply to user form data applies to AI responses. Schema + validation + sanitization is non-negotiable for production AI apps.
- **Monoliths win hackathons.** Every hour spent on service orchestration is an hour not spent on user experience. One port, one deploy, one demo URL.
- **Demo stability is a feature.** Loading states, keyboard failsafes, and offline modes are as important as the AI itself when you're live in front of judges.
- **Warm design reduces abandonment.** Career pivoters are anxious. UI tone matters as much as algorithm quality.

---

## What's next for BREAD

- **YouTube & Udemy API integration** — replace keyword-based resource suggestions with real-time course metadata, ratings, and affiliate-tracked deep links.
- **Automated resume parsing** — upload a CV and let BREAD map past experience to transferable skills automatically, skipping manual skill entry.
- **Localized labor market signals** — enrich roadmaps with real hiring demand data by region and role.
- **Premium "Master Baker" tier** — AI-tailored CV baking, portfolio reviews, and live mentorship for serious pivoters.
- **B2B hiring pipeline** — companies reskilling non-traditional talent integrate BREAD as a learning-to-hire funnel with quiz-verified skill proof.
- **Expanded failsafe toolkit** — production-grade offline mode, response caching per career path, and community-upvoted resource verification.

---

## Built with

`Next.js` · `TypeScript` · `Tailwind CSS` · `Framer Motion` · `Google Gemini 1.5 Flash` · `OpenAI GPT-4o-mini` · `@google/genai` · `Vercel`

---

## Links (fill in before submitting)

| Field | Value |
|-------|-------|
| **GitHub Repository** | `https://github.com/YOUR_USERNAME/bread` |
| **Live Demo URL** | `https://bread-app.vercel.app` |
| **Demo Video** | `https://youtube.com/watch?v=YOUR_VIDEO_ID` |
| **Pitch Deck** | *(optional — link to slides)* |

---

## Suggested Category Tags

`AI` · `EdTech` · `Career` · `Next.js` · `Full-Stack` · `Hackathon` · `Gemini` · `Serverless` · `UX Design`

---

## One-Paragraph Summary (for character-limited fields)

BREAD is an AI-powered career pivot platform that bakes personalized 4-step learning roadmaps from a simple assessment form. Built as a zero-dependency Next.js monolith with Gemini-powered Route Handlers, JSON-schema validation, and an interactive quiz engine with mentor-style feedback — deployable to Vercel in five minutes. Because earning your next livelihood should be as basic as bread and butter.

---

*Good luck with your submission. Go bake it.*
