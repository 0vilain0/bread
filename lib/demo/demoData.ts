import type { QuizStatEntry, SavedResource, SavedRoadmap } from "@/lib/pantry/types";
import type { RoadmapResponse } from "@/utils/api";

const now = Date.now();
const hour = 60 * 60 * 1000;

export const DEMO_ROADMAP_ACCOUNTANT: SavedRoadmap = {
  id: "demo-roadmap-accountant",
  timestamp: now - hour * 2,
  current_job: "Accountant",
  target_job: "Data Analyst",
  similarity_score: 68,
  analysis_summary:
    "Your accounting foundation in financial analysis, Excel modeling, and attention to detail maps strongly to data analytics. The primary gap is SQL, Python, and visualization tooling — bridgeable in 3–4 months of focused study.",
  roadmap: [
    {
      step: 1,
      title: "SQL Fundamentals & Database Essentials",
      duration: "4 weeks",
      skills: ["SQL Queries", "Joins", "Aggregations"],
      resources: [
        { source: "YouTube", keyword: "SQL for accountants career change" },
        { source: "Coursera", keyword: "Google Data Analytics SQL module" },
        { source: "Documentation", keyword: "PostgreSQL tutorial" },
      ],
    },
    {
      step: 2,
      title: "Python for Data Analysis",
      duration: "5 weeks",
      skills: ["Pandas", "NumPy", "Data Cleaning"],
      resources: [
        { source: "YouTube", keyword: "Python pandas for beginners" },
        { source: "Udemy", keyword: "Python data analysis bootcamp" },
        { source: "Interactive", keyword: "Kaggle Python course" },
      ],
    },
    {
      step: 3,
      title: "Business Intelligence & Visualization",
      duration: "4 weeks",
      skills: ["Tableau", "Dashboard Design", "Storytelling"],
      resources: [
        { source: "YouTube", keyword: "Tableau for data analysts" },
        { source: "Coursera", keyword: "Data visualization specialization" },
        { source: "Documentation", keyword: "Tableau Public gallery" },
      ],
    },
    {
      step: 4,
      title: "Portfolio & Interview Prep",
      duration: "3 weeks",
      skills: ["Case Studies", "A/B Testing", "Portfolio Building"],
      resources: [
        { source: "GitHub", keyword: "data analyst portfolio projects" },
        { source: "YouTube", keyword: "data analyst interview prep" },
        { source: "Kaggle", keyword: "real world datasets" },
      ],
    },
  ],
};

export const DEMO_ROADMAP_DESIGNER: SavedRoadmap = {
  id: "demo-roadmap-designer",
  timestamp: now - hour * 24,
  current_job: "Graphic Designer",
  target_job: "Frontend Developer",
  similarity_score: 54,
  analysis_summary:
    "Your design eye gives you a massive UX advantage over typical bootcamp grads. Focus on HTML/CSS fluency, JavaScript fundamentals, and React — your visual craft will differentiate you in frontend hiring.",
  roadmap: [
    {
      step: 1,
      title: "HTML, CSS & Responsive Layout",
      duration: "3 weeks",
      skills: ["Flexbox", "Grid", "Responsive Design"],
      resources: [
        { source: "YouTube", keyword: "HTML CSS crash course" },
        { source: "Coursera", keyword: "Web design for everybody" },
        { source: "Documentation", keyword: "MDN web docs CSS" },
      ],
    },
    {
      step: 2,
      title: "JavaScript Fundamentals",
      duration: "5 weeks",
      skills: ["ES6+", "DOM Manipulation", "Async/Await"],
      resources: [
        { source: "YouTube", keyword: "JavaScript full course" },
        { source: "Udemy", keyword: "JavaScript modern bootcamp" },
        { source: "Interactive", keyword: "freeCodeCamp JavaScript" },
      ],
    },
    {
      step: 3,
      title: "React & Component Architecture",
      duration: "5 weeks",
      skills: ["React", "Hooks", "State Management"],
      resources: [
        { source: "YouTube", keyword: "React tutorial for beginners" },
        { source: "Documentation", keyword: "React official docs" },
        { source: "Coursera", keyword: "Frontend development React" },
      ],
    },
    {
      step: 4,
      title: "Portfolio & Job Applications",
      duration: "3 weeks",
      skills: ["Git", "Deployment", "Technical Interviews"],
      resources: [
        { source: "GitHub", keyword: "frontend portfolio examples" },
        { source: "YouTube", keyword: "frontend developer interview" },
        { source: "Documentation", keyword: "Vercel deployment guide" },
      ],
    },
  ],
};

export const DEMO_RESOURCES: SavedResource[] = [
  {
    id: "demo-res-1",
    timestamp: now - hour * 3,
    title: "SQL for accountants career change",
    source: "YouTube",
    keyword: "SQL for accountants career change",
    step_title: "SQL Fundamentals",
  },
  {
    id: "demo-res-2",
    timestamp: now - hour * 4,
    title: "Google Data Analytics SQL module",
    source: "Coursera",
    keyword: "Google Data Analytics SQL module",
    step_title: "SQL Fundamentals",
  },
  {
    id: "demo-res-3",
    timestamp: now - hour * 5,
    title: "Python pandas for beginners",
    source: "YouTube",
    keyword: "Python pandas for beginners",
    step_title: "Python for Data Analysis",
  },
  {
    id: "demo-res-4",
    timestamp: now - hour * 6,
    title: "Tableau for data analysts",
    source: "YouTube",
    keyword: "Tableau for data analysts",
    step_title: "Business Intelligence",
  },
  {
    id: "demo-res-5",
    timestamp: now - hour * 7,
    title: "React tutorial for beginners",
    source: "YouTube",
    keyword: "React tutorial for beginners",
    step_title: "React & Components",
  },
];

export const DEMO_QUIZ_STATS: QuizStatEntry[] = [
  {
    id: "demo-quiz-1",
    timestamp: now - hour * 1,
    topic_name: "SQL Fundamentals & Database Essentials",
    score: "3/3",
    score_correct: 3,
    score_total: 3,
    duration_seconds: 142,
  },
  {
    id: "demo-quiz-2",
    timestamp: now - hour * 3,
    topic_name: "Python for Data Analysis",
    score: "3/3",
    score_correct: 3,
    score_total: 3,
    duration_seconds: 118,
  },
  {
    id: "demo-quiz-3",
    timestamp: now - hour * 8,
    topic_name: "Business Intelligence & Visualization",
    score: "2/3",
    score_correct: 2,
    score_total: 3,
    duration_seconds: 165,
  },
  {
    id: "demo-quiz-4",
    timestamp: now - hour * 20,
    topic_name: "HTML, CSS & Responsive Layout",
    score: "3/3",
    score_correct: 3,
    score_total: 3,
    duration_seconds: 95,
  },
  {
    id: "demo-quiz-5",
    timestamp: now - hour * 30,
    topic_name: "JavaScript Fundamentals",
    score: "3/3",
    score_correct: 3,
    score_total: 3,
    duration_seconds: 130,
  },
];

export function getPrimaryDemoRoadmap(): RoadmapResponse {
  const r = DEMO_ROADMAP_ACCOUNTANT;
  return {
    similarity_score: r.similarity_score,
    analysis_summary: r.analysis_summary,
    roadmap: r.roadmap,
  };
}

export const DEMO_ASSESSMENT_ACCOUNTANT = {
  currentJob: "Accountant",
  currentSkills: ["Excel", "Financial Analysis", "Reporting"],
  targetJob: "Data Analyst",
  timeCommitment: "2-3 hours/day",
  learningStyle: "Mixed approach",
};
