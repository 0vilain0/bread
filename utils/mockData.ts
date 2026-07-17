import type { QuizQuestionResponse, RoadmapResponse } from "@/utils/api";

export const MOCK_ROADMAP: RoadmapResponse = {
  similarity_score: 62,
  analysis_summary:
    "Your accounting background provides a strong foundation in financial analysis and data interpretation. The transition to Data Analyst leverages these core strengths while requiring proficiency in SQL, Python, and business intelligence tools. With your analytical mindset and existing experience with financial data, you're well-positioned for this pivot. The main gap is technical tool mastery, which can be bridged in 3-4 months of focused learning.",
  roadmap: [
    {
      step: 1,
      title: "SQL Fundamentals & Database Essentials",
      duration: "4 weeks",
      skills: ["SQL Queries", "Database Design", "Joins & Aggregations"],
      resources: [
        { source: "YouTube", keyword: "SQL basics for beginners" },
        {
          source: "Coursera",
          keyword: "Google Data Analytics Certificate - SQL module",
        },
        {
          source: "Documentation",
          keyword: "PostgreSQL/MySQL official documentation",
        },
      ],
    },
    {
      step: 2,
      title: "Python for Data Analysis",
      duration: "5 weeks",
      skills: ["Python Basics", "Pandas", "NumPy", "Data Manipulation"],
      resources: [
        { source: "YouTube", keyword: "Python for data analysis" },
        {
          source: "Coursera",
          keyword: "Python Data Analysis with Pandas and NumPy",
        },
        {
          source: "Interactive",
          keyword: "DataCamp Python for Data Analysis track",
        },
      ],
    },
    {
      step: 3,
      title: "Business Intelligence & Visualization",
      duration: "4 weeks",
      skills: [
        "Tableau/Power BI",
        "Data Visualization",
        "Dashboard Design",
        "Storytelling",
      ],
      resources: [
        {
          source: "YouTube",
          keyword: "Tableau tutorial for beginners",
        },
        {
          source: "Udemy",
          keyword: "Complete Hands-On Tableau Training for Data Visualization",
        },
        {
          source: "Interactive",
          keyword: "Tableau Public learning resources",
        },
      ],
    },
    {
      step: 4,
      title: "Advanced Analytics & Real-World Projects",
      duration: "4 weeks",
      skills: [
        "Statistical Analysis",
        "A/B Testing",
        "Data Storytelling",
        "Portfolio Building",
      ],
      resources: [
        {
          source: "YouTube",
          keyword: "A/B testing and statistical significance",
        },
        {
          source: "GitHub",
          keyword: "Data analyst portfolio projects",
        },
        {
          source: "Kaggle",
          keyword: "Real-world datasets for practice",
        },
      ],
    },
  ],
};

export const MOCK_QUIZ_QUESTIONS: QuizQuestionResponse[] = [
  {
    id: 1,
    question:
      'In SQL, what does the "JOIN" clause do when combining two tables?',
    options: [
      "It separates data from two tables",
      "It combines rows from two tables based on a related column",
      "It deletes data from both tables",
      "It creates a backup of both tables",
    ],
    correct_answer:
      "It combines rows from two tables based on a related column",
    explanation:
      "JOIN is used to combine rows from two or more tables based on a related column between them. This is fundamental for querying relational databases where data is stored across multiple tables.",
  },
  {
    id: 2,
    question: "What is the primary use of the Pandas library in Python?",
    options: [
      "Creating games and animations",
      "Data manipulation and analysis using DataFrames",
      "Building web applications",
      "Machine learning model deployment",
    ],
    correctAnswer: "Data manipulation and analysis using DataFrames",
    explanation:
      "Pandas is Python's primary data analysis library. It provides DataFrames (tabular data structures) that allow you to clean, transform, aggregate, and analyze data efficiently—essential skills for any data analyst.",
  },
  {
    id: 3,
    question:
      "Which visualization type is best for showing trends over time?",
    options: [
      "Pie chart",
      "Bar chart",
      "Line chart",
      "Heat map",
    ],
    correctAnswer: "Line chart",
    explanation:
      "Line charts excel at displaying continuous data and trends over time. They make it easy to see patterns, increases, decreases, and overall direction—perfect for time-series data like monthly sales or user growth.",
  },
  {
    id: 4,
    question: "In data analysis, what does 'aggregation' mean?",
    options: [
      "Removing duplicate rows",
      "Combining data points into summary statistics",
      "Sorting data alphabetically",
      "Splitting data into smaller files",
    ],
    correctAnswer: "Combining data points into summary statistics",
    explanation:
      "Aggregation involves summarizing multiple data points into a single metric (like SUM, COUNT, AVERAGE). This is how you extract meaningful insights from large datasets—for example, calculating total sales by region.",
  },
  {
    id: 5,
    question: "What is a 'pivot table' used for?",
    options: [
      "Creating moving charts",
      "Reorganizing and summarizing data by dimensions",
      "Protecting data from unauthorized access",
      "Scheduling automated reports",
    ],
correct_answer: "Reorganizing and summarizing data by dimensions",
    explanation:
      "Pivot tables allow you to reshape and summarize data from raw records into meaningful summaries by grouping by dimensions (like date, region, category). They're powerful for exploratory analysis and are available in Excel, Python, and BI tools.",
  },
];

export function generateMockRoadmap(
  _currentJob: string,
  _targetJob: string
): RoadmapResponse {
  // For demo purposes, return the mock roadmap
  // In a real app, this would call an AI API
  return MOCK_ROADMAP;
}

export function generateMockQuiz(
  _stepTitle: string
): QuizQuestionResponse[] {
  // For demo purposes, return a subset of questions
  // In a real app, this would call an AI API to generate step-specific questions
  return MOCK_QUIZ_QUESTIONS;
}
