export type CareerTrack =
  | "data-analyst"
  | "ux-writer"
  | "product-manager"
  | "general";

export interface Mentor {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  expertise: string;
  bio: string;
  sessionPrice: number;
  tracks: CareerTrack[];
}

export interface MarketplaceCourse {
  id: string;
  title: string;
  platform: "Coursera" | "Udemy" | "edX";
  hours: number;
  rating: number;
  reviews: string;
  price: number;
  discountCode: string;
  discountedPrice: number;
  stepKeywords: string[];
  tracks: CareerTrack[];
}

export function resolveCareerTrack(targetJob: string): CareerTrack {
  const job = targetJob.toLowerCase();
  if (job.includes("data") || job.includes("analyst")) return "data-analyst";
  if (job.includes("ux") || job.includes("writer") || job.includes("content"))
    return "ux-writer";
  if (job.includes("product")) return "product-manager";
  return "general";
}

export const MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Sarah Chen",
    initials: "SC",
    title: "Senior Data Analyst",
    company: "Google",
    expertise: "SQL & Data Modeling",
    bio: "I pivoted from accounting to analytics 3 years ago. I can help you knead your resume and prepare for technical interviews with real-world case studies.",
    sessionPrice: 25,
    tracks: ["data-analyst", "general"],
  },
  {
    id: "m2",
    name: "Marcus Okonkwo",
    initials: "MO",
    title: "Lead Analytics Engineer",
    company: "Stripe",
    expertise: "Python & BI Dashboards",
    bio: "Former teacher turned data pro. I'll help you build a portfolio that proves you can ship insights, not just pass tests.",
    sessionPrice: 25,
    tracks: ["data-analyst"],
  },
  {
    id: "m3",
    name: "Elena Vasquez",
    initials: "EV",
    title: "Staff UX Writer",
    company: "Airbnb",
    expertise: "Microcopy & Portfolio Review",
    bio: "I made the same leap from education to UX writing. Let's refine your voice, tone samples, and case studies for hiring managers.",
    sessionPrice: 25,
    tracks: ["ux-writer", "general"],
  },
  {
    id: "m4",
    name: "James Park",
    initials: "JP",
    title: "Senior Product Manager",
    company: "Notion",
    expertise: "Resume Review & PM Interviews",
    bio: "Transitioned from operations to PM. I'll coach you on framing transferable skills and acing product sense interviews.",
    sessionPrice: 25,
    tracks: ["product-manager", "general"],
  },
];

export const COURSES: MarketplaceCourse[] = [
  {
    id: "c1",
    title: "Google Data Analytics Professional Certificate",
    platform: "Coursera",
    hours: 180,
    rating: 4.8,
    reviews: "12k",
    price: 49,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["sql", "fundamentals", "database", "data"],
    tracks: ["data-analyst"],
  },
  {
    id: "c2",
    title: "SQL for Data Science: Beginner to Advanced",
    platform: "Udemy",
    hours: 22,
    rating: 4.7,
    reviews: "8.4k",
    price: 84.99,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["sql", "fundamentals", "database", "query"],
    tracks: ["data-analyst"],
  },
  {
    id: "c3",
    title: "Python for Data Analysis with Pandas",
    platform: "Udemy",
    hours: 18,
    rating: 4.6,
    reviews: "5.2k",
    price: 74.99,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["python", "pandas", "analysis", "data"],
    tracks: ["data-analyst"],
  },
  {
    id: "c4",
    title: "Business Intelligence & Tableau Mastery",
    platform: "edX",
    hours: 40,
    rating: 4.5,
    reviews: "3.1k",
    price: 99,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["tableau", "visualization", "business intelligence", "dashboard"],
    tracks: ["data-analyst"],
  },
  {
    id: "c5",
    title: "Google UX Design Professional Certificate",
    platform: "Coursera",
    hours: 200,
    rating: 4.8,
    reviews: "15k",
    price: 49,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["ux", "writing", "foundations", "design", "microcopy"],
    tracks: ["ux-writer"],
  },
  {
    id: "c6",
    title: "UX Writing: Microcopy for Digital Products",
    platform: "Udemy",
    hours: 12,
    rating: 4.9,
    reviews: "2.8k",
    price: 59.99,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["ux writing", "microcopy", "voice", "tone"],
    tracks: ["ux-writer"],
  },
  {
    id: "c7",
    title: "Portfolio Building for UX Writers",
    platform: "Udemy",
    hours: 8,
    rating: 4.7,
    reviews: "1.4k",
    price: 44.99,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["portfolio", "case study", "figma"],
    tracks: ["ux-writer"],
  },
  {
    id: "c8",
    title: "Product Management Fundamentals",
    platform: "Coursera",
    hours: 36,
    rating: 4.6,
    reviews: "6.7k",
    price: 49,
    discountCode: "BREAD30",
    discountedPrice: 19.99,
    stepKeywords: ["product", "management", "strategy"],
    tracks: ["product-manager"],
  },
];

export function getMentorsForTrack(track: CareerTrack): Mentor[] {
  return MENTORS.filter(
    (m) => m.tracks.includes(track) || m.tracks.includes("general")
  ).slice(0, 3);
}

export function getCoursesForStep(
  track: CareerTrack,
  stepTitle: string,
  limit = 4
): MarketplaceCourse[] {
  const keywords = stepTitle.toLowerCase().split(/[\s&,]+/);
  const effectiveTrack = track === "general" ? "data-analyst" : track;

  const scored = COURSES.filter((c) => c.tracks.includes(effectiveTrack)).map(
    (course) => {
      const matchScore = course.stepKeywords.reduce((score, kw) => {
        const hit =
          keywords.some((k) => k.includes(kw) || kw.includes(k)) ||
          stepTitle.toLowerCase().includes(kw);
        return score + (hit ? 1 : 0);
      }, 0);
      return { course, matchScore };
    }
  );

  const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);

  if (sorted.every((s) => s.matchScore === 0)) {
    return COURSES.filter((c) => c.tracks.includes(effectiveTrack)).slice(
      0,
      limit
    );
  }

  return sorted.slice(0, limit).map((s) => s.course);
}

export const PLATFORM_COLORS: Record<string, string> = {
  Coursera: "bg-blue-100 text-blue-800",
  Udemy: "bg-purple-100 text-purple-800",
  edX: "bg-emerald-100 text-emerald-800",
};
