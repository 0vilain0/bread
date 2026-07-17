# BREAD — Submission Copy

> **Note:** This file is a quick-reference alias. For the complete, portal-ready submission package, see **[HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md)**.

## Inspiration
We built BREAD because career security should feel as essential as fresh bread. In a world where AI and layoffs are shaking confidence, people deserve a calm, practical path to a new role — not another overwhelming feed of generic advice.

## What it does
BREAD turns a user's current job, skills, and target role into a warm, personalized 4-step roadmap. The platform blends AI-driven skill alignment with curated resources and a quick practice quiz so users can validate learning while they pivot.

## How we built it
We built a full-stack Next.js monolith with Tailwind CSS on the frontend and native API Route Handlers on the backend. The core idea is structured AI output: we force the model to return strict JSON via schema constraints and custom sanitizers so our app gets predictable roadmap objects and quiz arrays instead of free-form text.

## Challenges we ran into
The biggest challenge was keeping the demo stable under real-time serverless conditions. We had to manage asynchronous state transitions, protect against empty or malformed AI responses, and ensure the LLM adhered to a strict JSON schema within timeout budgets. We overcame this with regex-based JSON isolation, defensive UI states, and resilient server-side validation.

## Accomplishments we're proud of
- Built a fully functional, zero-external-dependency Next.js monolith in under 48 hours.
- Delivered a complete career roadmap generator with skill overlap scoring and curated learning steps.
- Added an interactive quiz engine with immediate mentor-style feedback.
- Implemented hidden stage failsafes (Shift+B / Shift+Q) for flawless live demos.

## What's next for BREAD
- Embed verified learning videos directly using the YouTube API.
- Add resume parsing to automatically map past experience to new career paths.
- Integrate Udemy/Coursera affiliate APIs for real-time course metadata.
- Layer in localized labor market demand signals so roadmaps reflect real hiring trends.
