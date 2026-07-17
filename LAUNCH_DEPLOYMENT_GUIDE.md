# BREAD — Launch, Deployment & Stage-Safety Guide
### Zero-Downtime Execution for Hackathon Judges

> **Goal:** Ship a live HTTPS URL, rehearse with confidence, and never let a network glitch kill your demo.

---

## Table of Contents

1. [Environment Configuration (`.env.local`)](#1-environment-configuration-envlocal)
2. [The "Stroller" Dry-Run Checklist (15 Min Pre-Stage)](#2-the-stroller-dry-run-checklist-15-min-pre-stage)
3. [One-Click Deployment (Vercel)](#3-one-click-deployment-vercel)
4. [Fault-Tolerant Failsafe System](#4-fault-tolerant-failsafe-system-the-baked-in-backup)

---

## 1. Environment Configuration (`.env.local`)

### Copy-Paste Template

Create a file named **`.env.local`** in the project root (same folder as `package.json`):

```bash
# --- AI Provider ---
AI_PROVIDER=gemini

# --- Google Gemini (free tier — recommended for hackathon) ---
GEMINI_API_KEY=your_actual_key_here

# --- OpenAI (alternative) ---
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-your_actual_key_here

# --- Optional: server-side offline mode (no AI calls) ---
# OFFLINE_BAKING_MODE=true
```

A full annotated template lives at **`.env.local.example`** — copy it:

```bash
cp .env.local.example .env.local
```

### How Next.js Reads These Variables

| Variable | Read by | Exposed to browser? |
|----------|---------|---------------------|
| `GEMINI_API_KEY` | `lib/ai/config.ts` → Route Handlers | **No** (server-only) |
| `OPENAI_API_KEY` | `lib/ai/config.ts` → Route Handlers | **No** (server-only) |
| `AI_PROVIDER` | `lib/ai/config.ts` | **No** |
| `OFFLINE_BAKING_MODE` | `lib/ai/offlineMode.ts` | **No** |

Route Handlers in `app/api/generate-roadmap/route.ts` and `app/api/generate-quiz/route.ts` call `process.env.GEMINI_API_KEY` on the **server**. Keys never ship to the client bundle.

> **Security rule:** Never prefix API keys with `NEXT_PUBLIC_`. That would leak them to every judge's browser.

---

### Acquiring a Free Gemini API Key (Recommended)

1. Go to **[Google AI Studio](https://aistudio.google.com/apikey)** (sign in with any Google account).
2. Click **"Create API Key"** → choose a Google Cloud project (or create one).
3. Copy the key (format: `AIza...`).
4. Paste into `.env.local`:
   ```
   GEMINI_API_KEY=AIzaSy...your_key_here
   ```
5. Restart the dev server: `Ctrl+C` then `npm run dev`.

**Free tier limits (as of 2026):** Gemini 1.5 Flash offers generous free RPM/RPD for hackathon demos. If you hit rate limits, switch to `OFFLINE_BAKING_MODE=true` or use the **Shift+B** failsafe (Section 4).

---

### Acquiring an OpenAI API Key (Alternative)

1. Go to **[OpenAI Platform → API Keys](https://platform.openai.com/api-keys)**.
2. Create a new secret key.
3. Set in `.env.local`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...your_key_here
   ```
4. Restart dev server.

> OpenAI is pay-per-token. Add a $5 billing credit before demo day.

---

## 2. The "Stroller" Dry-Run Checklist (15 Min Pre-Stage)

Run this checklist **exactly 15 minutes** before walking on stage.

### ☐ Step 1: Environment & API Key Verification (3 min)

```bash
# From project root
npm run dev
```

In a **second terminal**, run:

```bash
# 1. Health check — keys configured?
curl http://localhost:3000/api/health
```

**Expected response:**
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

If `gemini_configured` is `false` → fix `.env.local` and restart.

```bash
# 2. Live AI smoke test (should return JSON in 3–10 seconds)
curl -X POST http://localhost:3000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d "{\"current_job\":\"English Teacher\",\"target_job\":\"Junior UX Writer\",\"hours_per_day\":2.5}"
```

**Pass criteria:**
- HTTP `200` status
- JSON contains `similarity_score`, `analysis_summary`, and `roadmap` array with 4 steps
- Response time **under 15 seconds**

**If rate-limited (HTTP 429 or 500):**
- Option A: Set `OFFLINE_BAKING_MODE=true` in `.env.local`, restart server
- Option B: Use **Shift+B** client failsafe during demo (Section 4)

---

### ☐ Step 2: Production Build & Cache Clearing (4 min)

Stale builds and browser cache have killed more demos than bad code.

```bash
# Stop dev server, then:
rm -rf .next          # Windows PowerShell: Remove-Item -Recurse -Force .next
npm run build
npm run start         # Runs production build on http://localhost:3000
```

**Browser cache clear (presenter's machine):**
1. Open Chrome **Incognito** window (`Ctrl+Shift+N`)
2. Navigate to `http://localhost:3000` (or your Vercel URL)
3. Open DevTools → **Application** tab → **Storage** → **Clear site data**
4. Hard refresh: `Ctrl+Shift+R`

> BREAD does not persist roadmap data in `localStorage` by default — but clearing cache eliminates service-worker or CDN surprises on Vercel.

---

### ☐ Step 3: Projector Compatibility Check (3 min)

BREAD includes **stage-safe CSS** in `app/globals.css`:

| Class | Purpose |
|-------|---------|
| `stage-safe` on `<html>` | Prevents text scaling bugs on projectors |
| `stage-safe-scroll` on `<main>` | Enables vertical scroll instead of clipping |
| `@media (max-height: 800px)` | Shrinks headings on short displays |
| `@media (max-height: 700px)` | Further scale-down for low-res projectors |

**Pre-stage projector test:**
1. Connect HDMI / USB-C to projector
2. Set display to **1920×1080** (or native resolution)
3. Set browser zoom to **100%** (not 125%)
4. Walk through: Assessment → Roadmap → Quiz
5. Verify **no horizontal scrollbar** and **vertical scroll works** on roadmap page

**If content still clips:**
- Browser zoom: **90%** (`Ctrl + -`)
- Or present from laptop screen angled toward judges

**Tailwind layout notes:**
- Assessment form: `max-w-md sm:max-w-xl` — safe on 1280px
- Roadmap cards: `p-4 md:p-8` — padding reduces on small screens
- Skill tags: `flex-wrap` — prevents overflow

---

### ☐ Step 4: Failsafe Rehearsal (2 min)

Practice these **hidden shortcuts** until they're muscle memory:

| Shortcut | Action |
|----------|--------|
| **Shift + B** | Instantly inject pitch demo roadmap → jump to dashboard |
| **Shift + Q** | Instantly inject quiz → jump to quiz view (wrong-answer demo ready) |

**Rehearsal drill:**
1. Click "Bake My Roadmap" and let spinner appear
2. Press **Shift+B** mid-load → roadmap appears instantly
3. Press **Shift+Q** → quiz loads with mentor-style explanations

---

### ☐ Step 5: Final Stage Prep (3 min)

- [ ] Laptop on **power adapter** (not battery)
- [ ] **Notifications off** (Focus Assist / Do Not Disturb)
- [ ] Close Slack, email, OS update prompts
- [ ] Incognito tab open at demo URL
- [ ] DevTools **closed** (F12 — judges don't need to see console)
- [ ] Terminal minimized (not on projector)
- [ ] Water bottle within reach
- [ ] Phone on silent — teammate on standby

---

## 3. One-Click Deployment (Vercel)

Deploy BREAD to a **live public HTTPS URL** in under 5 minutes. Judges score **Completeness** and **Scalability** higher when you demo a real deployed product — not just `localhost`.

### Why a Live URL Wins Points

| Criterion | Localhost | `https://bread-app.vercel.app` |
|-----------|-----------|-------------------------------|
| Completeness | "It works on my machine" | Production-ready artifact |
| Scalability | Single dev server | Serverless edge + auto-scale |
| Shareability | Judges can't try it | QR code → instant access |
| Credibility | Hackathon prototype | Shipped product |

---

### Option A: Vercel Dashboard (Recommended for First Deploy)

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "BREAD: production-ready Next.js monolith"
git remote add origin https://github.com/YOUR_USERNAME/bread.git
git push -u origin main
```

#### 2. Import to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import"** next to your `bread` repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `./` (default)
5. **Do not deploy yet** — add environment variables first

#### 3. Add Environment Variables

In the Vercel import screen (or later: **Project → Settings → Environment Variables**):

| Name | Value | Environments |
|------|-------|--------------|
| `AI_PROVIDER` | `gemini` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIza...` (your key) | Production, Preview, Development |

Optional backup:
| `OFFLINE_BAKING_MODE` | `true` | Production only (if Wi-Fi unreliable at venue) |

#### 4. Deploy

Click **Deploy**. Wait ~60–90 seconds.

Your live URL: `https://bread-xxxxx.vercel.app` (or set a custom alias in **Settings → Domains**).

#### 5. Post-Deploy Verification

```bash
curl https://YOUR-APP.vercel.app/api/health
```

Open the URL on your phone (cellular, not venue Wi-Fi) to confirm it works off-network.

---

### Option B: Vercel CLI (Terminal Deploy)

```bash
npm i -g vercel
cd bread
vercel login
vercel

# Follow prompts:
#   Set up and deploy? → Y
#   Which scope? → your account
#   Link to existing project? → N
#   Project name? → bread
#   Directory? → ./

# Add env vars
vercel env add GEMINI_API_KEY
vercel env add AI_PROVIDER

# Production deploy
vercel --prod
```

---

### Deploy to Vercel Badge

Add to your `README.md` (replace `YOUR_USERNAME`):

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/bread&env=GEMINI_API_KEY,AI_PROVIDER&envDescription=AI%20configuration%20for%20BREAD&envLink=https://github.com/YOUR_USERNAME/bread/blob/main/.env.local.example&project-name=bread&repository-name=bread)
```

One click: clones repo, prompts for `GEMINI_API_KEY`, deploys.

---

### Vercel Environment Checklist

- [ ] `GEMINI_API_KEY` set for **Production**
- [ ] `AI_PROVIDER=gemini` set for **Production**
- [ ] Redeploy after adding env vars (**Deployments → ... → Redeploy**)
- [ ] Custom domain or memorable alias (e.g., `bread-career.vercel.app`)
- [ ] QR code printed on pitch slide pointing to live URL

---

## 4. Fault-Tolerant Failsafe System (The "Baked-In" Backup)

Three layers of protection — use them in order.

### Layer 1: Server-Side Offline Mode (Env Toggle)

Set in `.env.local` or Vercel dashboard:

```
OFFLINE_BAKING_MODE=true
```

When enabled:
- `POST /api/generate-roadmap` returns curated **English Teacher → UX Writer** demo data
- `POST /api/generate-quiz` returns 3 pitch-aligned quiz questions
- **No AI API calls** — instant responses, zero network dependency

Restart server after changing. Health endpoint reports `"offline_baking_mode": true`.

**When to use:** Venue Wi-Fi is unreliable; enable before walking on stage as insurance.

---

### Layer 2: Hidden Keyboard Failsafe (Client-Side)

Implemented in `components/OfflineBakingFailsafe.tsx`. **No visible UI** — judges never see it.

| Shortcut | What happens |
|----------|--------------|
| **Shift + B** | Injects `STAGE_DEMO_ROADMAP` + assessment data → navigates to roadmap dashboard. Clears loading spinner and errors. |
| **Shift + Q** | Injects roadmap + quiz → navigates directly to quiz view. Step 1 question ready for wrong-answer demo. |

**Demo script if AI times out:**

1. Click "🍞 Bake My Roadmap" — spinner appears
2. Narrate: *"BREAD is synthesizing your path..."* (buy 3 seconds)
3. If still loading at 8+ seconds → press **Shift+B** under the desk
4. Continue pitch seamlessly: *"Fresh out of the oven — see the Skill Alignment Score..."*

**Quiz timeout scenario:**

1. Click "Take Practice Quiz" — spinner appears
2. Press **Shift+Q** → quiz loads instantly
3. Deliberately answer wrong → show mentor explanation

Demo data source: `utils/stageDemoData.ts` (aligned with `BAKERY_PITCH_PLAYBOOK.md`).

---

### Layer 3: Pre-Recorded GIF (Last Resort)

If the entire app fails to load:

1. Keep a **20-second screen recording** on desktop
2. Narrate the flow while showing the GIF
3. Offer live demo on your laptop after judging

---

### Failsafe Decision Tree

```
AI call starts
    │
    ├─ Response in < 8s → Continue normal demo ✅
    │
    ├─ Spinner > 8s → Press Shift+B (roadmap) or Shift+Q (quiz) 🎹
    │
    ├─ API returns 500 → Press Shift+B, mention "let me show a pre-baked example" 🎹
    │
    ├─ App won't load → Show fallback GIF 📹
    │
    └─ Nuclear option → Verbal walkthrough + phone demo after 📱
```

---

## Quick Reference Card (Print & Tape to Laptop)

```
┌─────────────────────────────────────────────────┐
│  BREAD STAGE SAFETY — QUICK REFERENCE           │
├─────────────────────────────────────────────────┤
│  URL:     https://_____________.vercel.app       │
│  Health:  /api/health                           │
│  Env:     GEMINI_API_KEY in .env.local            │
│                                                 │
│  PRE-SHOW:                                      │
│  □ npm run build && npm run start               │
│  □ Incognito + cache clear                      │
│  □ curl health + roadmap smoke test             │
│  □ Projector at 100% zoom                       │
│                                                 │
│  EMERGENCY:                                     │
│  Shift+B  →  Instant roadmap                    │
│  Shift+Q  →  Instant quiz                       │
│  OFFLINE_BAKING_MODE=true  →  Server mock       │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `gemini_configured: false` | Add key to `.env.local`, restart server |
| `500` on roadmap | Check API key validity at AI Studio |
| Vercel build fails | Run `npm run build` locally first; fix TypeScript errors |
| Env vars not working on Vercel | Redeploy after adding vars; check Production scope |
| Old mock data appearing | `rm -rf .next`, rebuild, clear browser cache |
| Projector clips content | Browser zoom 90%; verify `stage-safe` CSS loaded |
| Shift+B not working | Click anywhere on page first (focus); try lowercase `b` |

---

**You're production-ready. Bake with confidence.**
