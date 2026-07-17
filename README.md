<p align="center">
  <strong style="font-size: 2.5rem;">🍞 BREAD</strong>
  <br />
  <em>Bake your next career — one loaf at a time.</em>
</p>

<p align="center">
  <strong>AI-Powered Career Pivot Platform</strong>
  <br />
  Warm, practical roadmaps for people navigating career change in the age of AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini-1.5_Flash-8E75B2?style=flat-square&logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-system-architecture-the-monolithic-recipe">Architecture</a> ·
  <a href="#-api-reference">API</a> ·
  <a href="#-deployment">Deploy</a> ·
  <a href="LAUNCH_DEPLOYMENT_GUIDE.md">Stage Safety</a>
</p>

---

## The Problem — & Why *Bread*?

In Vietnamese we say **mưu sinh** — to earn one's livelihood. In English we say **bread and butter**. Across every culture, the message is the same: **work is how people survive.**

Today, millions of professionals face a new anxiety. AI is reshaping industries overnight. Layoffs are no longer edge cases — they are headlines. Career pivoting is no longer a luxury for the ambitious; it is a **basic necessity of livelihood.**

And yet, the tools available to pivoters are broken:

| What people get | What people need |
|-----------------|------------------|
| $3,000 bootcamps with vague outcomes | A clear, affordable starting point |
| Endless YouTube rabbit holes | Structured, bite-sized learning paths |
| ChatGPT essays with no accountability | Validated steps with proof-of-learning |
| Overwhelming career noise | Calm, actionable daily progress |

**BREAD** exists because career transitions should feel as fundamental as putting food on the table — not as overwhelming as gambling your savings on an uncertain future.

We don't sell unachievable dreams. We **bake** structured, bite-sized, actionable learning paths — so you can earn your **next loaf of bread** in a new industry.

---

## ✨ Key Features

### 🥖 Warm Onboarding Assessment
A five-step, anxiety-reducing intake flow that captures:
- Current job title and transferable skills
- Target career goal
- Daily time commitment and learning style preferences

No accounts required. No data stored. Privacy-first by design.

### 🗺️ Dynamic AI Roadmap Timeline
One click — **"Bake My Roadmap"** — and BREAD returns:
- **Skill Alignment Score** (0–100%) — how much of your background transfers to the target role
- **AI Analysis Summary** — honest assessment of advantages and gaps
- **4-Step Learning Path** — each phase includes duration, core skills, and curated resources (YouTube, Coursera, documentation)

### 📝 Interactive Practice Quiz
Each roadmap step includes a **"Take Practice Quiz"** button that generates 3 AI-powered multiple-choice questions with:
- Instant correct/incorrect feedback
- Warm, mentor-style explanations (not cold error messages)
- Practical understanding checks — not trivia memorization

### 🎭 Stage-Safe Demo Mode
Built for live hackathon presentations:
- **Shift + B** — hidden keyboard shortcut injects pitch-perfect demo data instantly
- **Shift + Q** — emergency quiz injection if AI calls time out
- `OFFLINE_BAKING_MODE` env toggle for server-side mock responses
- Projector-safe CSS with scroll fallbacks for low-resolution displays

---

## 🏗️ System Architecture — *The Monolithic Recipe*

BREAD is a **zero-external-dependency monolith**. Everything runs inside a single Next.js application — one port, one deploy, one bill.

```
┌─────────────────────────────────────────────────────────────┐
│                    BREAD — Next.js Monolith                  │
│                     (Single Port :3000)                      │
├─────────────────────────────────────────────────────────────┤
│  App Router (React 18)                                       │
│  ├── Assessment Form    →  Roadmap Dashboard  →  Quiz       │
│  ├── Tailwind CSS + Framer Motion (Warm Minimalist UI)      │
│  └── OfflineBakingFailsafe (Shift+B / Shift+Q)              │
├─────────────────────────────────────────────────────────────┤
│  Native API Route Handlers  (app/api/)                       │
│  ├── POST /api/generate-roadmap   →  lib/ai/generate.ts     │
│  ├── POST /api/generate-quiz      →  lib/ai/generate.ts     │
│  └── GET  /api/health             →  config + key status    │
├─────────────────────────────────────────────────────────────┤
│  AI Layer (lib/ai/)                                          │
│  ├── @google/genai  (Gemini 1.5 Flash — default)            │
│  ├── openai         (GPT-4o-mini — optional swap)           │
│  ├── JSON Schema enforcement (responseMimeType + schema)    │
│  ├── extractJsonFromResponse() — markdown fence stripping     │
│  └── validateRoadmapResponse() / validateQuizResponse()     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Gemini API  /  OpenAI API
                    (server-side only — keys never reach browser)
```

### Why a monolith?

| Benefit | Detail |
|---------|--------|
| **Zero latency overhead** | UI and API share the same deployment — no cross-origin round trips |
| **One-command dev** | `npm run dev` — no separate Python server, no Docker required |
| **Serverless-native** | Deploy to Vercel; scale to zero; pay per AI request |
| **Simpler ops** | One repo, one CI pipeline, one environment file |

> A reference FastAPI backend (`backend/`) is included for comparison, but **production BREAD runs entirely on Next.js Route Handlers.**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 — custom `bread-brown`, `bread-cream`, `bread-charcoal` palette |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **AI (default)** | Google Gemini 1.5 Flash via `@google/genai` |
| **AI (alt)** | OpenAI GPT-4o-mini via `openai` SDK |
| **Deployment** | Vercel (recommended) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- A free **[Gemini API key](https://aistudio.google.com/apikey)** or [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bread.git
cd bread
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free Gemini key at [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — fill the assessment, click **Bake My Roadmap**, and explore.

### 5. Production build (optional)

```bash
npm run build
npm run start
```

---

## 📡 API Reference

All endpoints are served from the same Next.js origin (`/api/*`).

### `GET /api/health`

```bash
curl http://localhost:3000/api/health
```

```json
{
  "status": "healthy",
  "ai_provider": "gemini",
  "offline_baking_mode": false,
  "gemini_configured": true,
  "openai_configured": false,
  "message": "BREAD API is running"
}
```

### `POST /api/generate-roadmap`

**Request:**

```json
{
  "current_job": "English Teacher",
  "target_job": "Junior UX Writer",
  "hours_per_day": 2.5
}
```

**Response:**

```json
{
  "similarity_score": 71,
  "analysis_summary": "Your teaching background is a hidden superpower for UX writing...",
  "roadmap": [
    {
      "step": 1,
      "title": "UX Writing Foundations & Product Vocabulary",
      "duration": "3 weeks",
      "skills": ["Microcopy", "Voice & Tone", "User-Centered Language"],
      "resources": [
        { "source": "YouTube", "keyword": "UX writing for beginners microcopy" },
        { "source": "Coursera", "keyword": "Google UX Design Certificate" },
        { "source": "Documentation", "keyword": "Nielsen Norman Group UX writing" }
      ]
    }
  ]
}
```

### `POST /api/generate-quiz`

**Request:**

```json
{
  "topic_name": "UX Writing Foundations"
}
```

**Response:**

```json
[
  {
    "id": 1,
    "question": "What is the primary goal of microcopy in a digital product?",
    "options": ["...", "...", "...", "..."],
    "correct_answer": "To guide users and reduce friction at decision points",
    "explanation": "Great question to sit with — microcopy isn't decoration..."
  }
]
```

---

## ☁️ Deployment

Deploy to Vercel in under 5 minutes:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/bread&env=GEMINI_API_KEY,AI_PROVIDER&envDescription=AI%20configuration%20for%20BREAD&envLink=https://github.com/YOUR_USERNAME/bread/blob/main/.env.local.example&project-name=bread&repository-name=bread)

Or via CLI:

```bash
npm i -g vercel
vercel env add GEMINI_API_KEY
vercel env add AI_PROVIDER
vercel --prod
```

See **[LAUNCH_DEPLOYMENT_GUIDE.md](LAUNCH_DEPLOYMENT_GUIDE.md)** for the full stage-safety runbook, pre-show checklist, and failsafe documentation.

---

## 📁 Project Structure

```
bread/
├── app/
│   ├── api/
│   │   ├── generate-roadmap/route.ts   # AI roadmap endpoint
│   │   ├── generate-quiz/route.ts      # AI quiz endpoint
│   │   └── health/route.ts             # Health + key status
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css                     # Stage-safe projector CSS
├── components/
│   ├── AssessmentForm.tsx
│   ├── RoadmapDashboard.tsx
│   ├── DailyQuiz.tsx
│   └── OfflineBakingFailsafe.tsx       # Shift+B / Shift+Q
├── lib/ai/
│   ├── generate.ts                     # Gemini + OpenAI orchestration
│   ├── schemas.ts                      # Response validation
│   ├── extractJson.ts                  # JSON sanitization
│   ├── prompts.ts
│   ├── config.ts
│   └── offlineMode.ts
├── utils/
│   ├── api.ts                          # Frontend API client
│   └── stageDemoData.ts                # Pitch demo data
├── context/BreadContext.tsx
├── .env.local.example
├── LAUNCH_DEPLOYMENT_GUIDE.md
├── BAKERY_PITCH_PLAYBOOK.md
└── package.json
```

---

## 📚 Additional Documentation

| Document | Description |
|----------|-------------|
| [LAUNCH_DEPLOYMENT_GUIDE.md](LAUNCH_DEPLOYMENT_GUIDE.md) | Pre-stage checklist, Vercel deploy, failsafe system |
| [BAKERY_PITCH_PLAYBOOK.md](BAKERY_PITCH_PLAYBOOK.md) | 3-minute pitch script + judges' Q&A defense |
| [LIVE_DEMO_CHECKLIST.md](LIVE_DEMO_CHECKLIST.md) | Single-port demo runbook |
| [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md) | Devpost / Taikai portal copy |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with 🍞 for everyone navigating their next chapter.</strong>
  <br />
  <em>Career transitions should be as basic as bread and butter.</em>
</p>
