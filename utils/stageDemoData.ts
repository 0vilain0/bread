import type { AssessmentData } from "@/context/BreadContext";
import type { QuizQuestionResponse, RoadmapResponse } from "@/utils/api";

/**
 * Curated demo data aligned with the live pitch:
 * English Teacher → Junior UX Writer
 * Used by offline baking mode and the Shift+B / Shift+Q stage failsafe.
 */
export const STAGE_DEMO_ASSESSMENT: AssessmentData = {
  currentJob: "English Teacher",
  currentSkills: [
    "Writing",
    "Communication",
    "Curriculum Design",
    "Public Speaking",
  ],
  targetJob: "Junior UX Writer",
  timeCommitment: "2-3 hours/day",
  learningStyle: "Mixed approach",
};

export const STAGE_DEMO_ROADMAP: RoadmapResponse = {
  similarity_score: 71,
  analysis_summary:
    "Your teaching background is a hidden superpower for UX writing. You already craft clear narratives, adapt tone for different audiences, and structure information for comprehension — the same muscles UX writers use daily. The main gap is product vocabulary and portfolio proof, which a focused 3–4 month path can close with deliberate practice and real microcopy projects.",
  roadmap: [
    {
      step: 1,
      title: "UX Writing Foundations & Product Vocabulary",
      duration: "3 weeks",
      skills: [
        "Microcopy",
        "Voice & Tone",
        "User-Centered Language",
        "Content Design Basics",
      ],
      resources: [
        { source: "YouTube", keyword: "UX writing for beginners microcopy" },
        {
          source: "Coursera",
          keyword: "Google UX Design Certificate content design module",
        },
        {
          source: "Documentation",
          keyword: "Nielsen Norman Group UX writing guidelines",
        },
      ],
    },
    {
      step: 2,
      title: "Research, Personas & Journey Mapping",
      duration: "4 weeks",
      skills: [
        "User Research",
        "Empathy Mapping",
        "Customer Journey Maps",
        "Jobs-to-be-Done",
      ],
      resources: [
        { source: "YouTube", keyword: "UX research basics for writers" },
        {
          source: "Coursera",
          keyword: "Introduction to User Experience Design",
        },
        {
          source: "Interactive",
          keyword: "Maze usability testing for copywriters",
        },
      ],
    },
    {
      step: 3,
      title: "Portfolio Projects & Case Studies",
      duration: "4 weeks",
      skills: [
        "Before/After Copy Audits",
        "Wireframe Annotation",
        "Case Study Writing",
        "Figma Basics",
      ],
      resources: [
        { source: "YouTube", keyword: "UX writing portfolio case study" },
        { source: "GitHub", keyword: "UX writing portfolio examples" },
        { source: "Interactive", keyword: "Figma UX writing practice files" },
      ],
    },
    {
      step: 4,
      title: "Interview Prep & Job-Ready Polish",
      duration: "3 weeks",
      skills: [
        "Portfolio Presentation",
        "Writing Tests",
        "Cross-Functional Collaboration",
        "ATS-Optimized Resume",
      ],
      resources: [
        { source: "YouTube", keyword: "UX writer interview tips" },
        { source: "LinkedIn", keyword: "Junior UX writer job descriptions" },
        {
          source: "Documentation",
          keyword: "Content design interview writing exercises",
        },
      ],
    },
  ],
};

export const STAGE_DEMO_QUIZ: QuizQuestionResponse[] = [
  {
    id: 1,
    question:
      "What is the primary goal of microcopy in a digital product interface?",
    options: [
      "To fill empty space on the screen",
      "To guide users and reduce friction at decision points",
      "To replace the need for customer support entirely",
      "To showcase the company's brand colors",
    ],
    correct_answer: "To guide users and reduce friction at decision points",
    explanation:
      "Great question to sit with — microcopy isn't decoration. It's the gentle hand on someone's shoulder at the exact moment they hesitate. Button labels, error messages, and empty states should help users move forward with confidence. Your teaching instinct to clarify confusion maps perfectly to this skill.",
  },
  {
    id: 2,
    question:
      "Which element best demonstrates a UX writer's impact in a portfolio case study?",
    options: [
      "A list of every app they have ever used",
      "Before-and-after copy with the user problem and measurable outcome",
      "A long essay about their personal design philosophy",
      "Screenshots of competitor websites without analysis",
    ],
    correct_answer:
      "Before-and-after copy with the user problem and measurable outcome",
    explanation:
      "Hiring managers want proof, not poetry alone. Show the problem, your rewritten copy, and why it helps the user — click-through, comprehension, or support-ticket reduction. You already structure lessons around outcomes; frame your portfolio the same way.",
  },
  {
    id: 3,
    question:
      'In UX writing, "voice and tone" refers to:',
    options: [
      "The font size used across an application",
      "The consistent personality of a brand and how it adapts to context",
      "The volume of text on each screen",
      "The legal disclaimer at the bottom of a page",
    ],
    correct_answer:
      "The consistent personality of a brand and how it adapts to context",
    explanation:
      "Voice is who you are; tone is how you show up in the moment. A fintech app might stay trustworthy yet shift from celebratory on success screens to calm and direct on error states. As a teacher, you already modulate tone for different audiences — that's UX writing in practice.",
  },
];
