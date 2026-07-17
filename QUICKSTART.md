# 🚀 Quick Start Guide - BREAD

## Start Development Server (30 seconds)

```bash
cd /workspaces/bread
npm run dev
```

Then visit: **http://localhost:3000**

## Test the Full User Journey

1. **Assessment Form** (Step 1-5)
   - Enter: "Accountant" → "Data Analyst"
   - Select learning style: "Video-heavy"
   - Select commitment: "2-3 hours/day"
   - Click "🍞 Bake My Roadmap"

2. **Roadmap Dashboard** (Auto-loads)
   - See 62% skill alignment score
   - Review 4-step learning path
   - Click "📝 Take Practice Quiz" on any step

3. **Daily Quiz** (Interactive assessment)
   - Answer 5 questions (A/B/C/D)
   - Get instant feedback
   - See final score

4. **Navigation**
   - "← Edit Assessment" to go back
   - "Back to Roadmap" to return
   - "Retake Quiz" for review

---

## File Structure Quick Reference

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Main entry point |
| `components/AssessmentForm.tsx` | Onboarding form |
| `components/RoadmapDashboard.tsx` | Career roadmap view |
| `components/DailyQuiz.tsx` | Quiz system |
| `context/BreadContext.tsx` | Global state |
| `utils/mockData.ts` | Sample data |
| `tailwind.config.js` | Design system |

---

## Key Colors

- **Brown** (#4a3728) - Primary buttons & text
- **Cream** (#fbf9f6) - Background
- **Charcoal** (#2b2b2b) - Body text

---

## Common Commands

```bash
npm run dev        # Start development server
npm run build      # Create production build
npm start          # Run production build
npm run lint       # Check code quality
```

---

## 5-Minute Demo Script

> "BREAD helps people navigate career transitions through AI-powered analysis. 
> Watch how someone transforms from Accountant to Data Analyst in 16-20 weeks.
> 
> [Show Assessment Form] We collect their background and goals.
> 
> [Show Roadmap] Our AI analyzes their 62% skill overlap and creates a realistic path.
> 
> [Show Quiz] Daily assessments reinforce learning.
> 
> This is career transition without the overwhelm. Simple. Real. Achievable."

---

**Ready to launch? Press Ctrl+C to start!**

```bash
npm run dev
```

🍞 Happy coding!
