"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Database,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Youtube,
  GraduationCap,
  Briefcase,
} from "lucide-react";

import { useBread } from "@/context/BreadContext";

const PREMIUM_MENTORSHIP_PRICE = 49;
const PREMIUM_CONVERSION_RATE = 0.05;
const PLATFORM_REACH_RATE = 0.04;

const MONOLITH_BASE_MONTHLY = 20;
const MONOLITH_COST_PER_1K_MAU = 1.8;
const SPLIT_BASE_MONTHLY = 320;
const SPLIT_COST_PER_1K_MAU = 14;

const PHASES = [
  {
    phase: 1,
    title: "Automated Ingredient Gathering",
    subtitle: "Data Pipelines",
    icon: Database,
    accent: "from-amber-100 to-orange-50",
    border: "border-amber-200/60",
    integrations: [
      { name: "YouTube Data API", detail: "Live view counts, ratings & freshness scores" },
      { name: "Udemy Affiliate API", detail: "Real-time pricing & enrollment metrics" },
      { name: "Coursera Partner API", detail: "Verified certificates & completion rates" },
    ],
    description:
      "Replace static LLM keyword suggestions with live course intelligence. Automated scrapers and official APIs ingest ratings, prices, and recency — surfacing only resources that are current, credible, and conversion-ready.",
    timeline: "Q2 2026",
  },
  {
    phase: 2,
    title: "Automated Dough Kneading",
    subtitle: "Resume Parsing & Skill Mapping",
    icon: FileText,
    accent: "from-stone-100 to-bread-cream",
    border: "border-bread-brown/20",
    integrations: [
      { name: "PDF + OCR Pipeline", detail: "Extract roles, tools & tenure automatically" },
      { name: "LLM Skill Vectorizer", detail: "Map experience → transferable skill graph" },
      { name: "Gap Analysis Engine", detail: "Instant alignment vs. target career vector" },
    ],
    description:
      "Users drop a PDF resume — BREAD reads it, extracts skills with OCR + LLM, and plots them against the target role. No manual typing. Skill Alignment Scores become evidence-based from day one.",
    timeline: "Q3 2026",
  },
  {
    phase: 3,
    title: "The Franchise Model",
    subtitle: "B2B Talent Marketplace",
    icon: Building2,
    accent: "from-emerald-50 to-teal-50",
    border: "border-emerald-200/60",
    integrations: [
      { name: "Recruiter Dashboard", detail: "Filter by quiz score, skills & pivot path" },
      { name: "Anonymous Talent Profiles", detail: "Privacy-first, opt-in visibility" },
      { name: "Learning-to-Hire Pipeline", detail: "90%+ quiz scorers → interview-ready" },
    ],
    description:
      "Tech recruiters access motivated, non-traditional talent who proved mastery through Daily Quizzes. Companies fill roles with pivoters who already demonstrated grit — BREAD becomes the oven where learning meets hiring.",
    timeline: "Q4 2026",
  },
] as const;

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toLocaleString();
}

function AnimatedMetric({
  label,
  value,
  sublabel,
  highlight,
  delay = 0,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className={`rounded-2xl p-5 card-shadow ${
        highlight
          ? "bg-bread-brown text-white"
          : "bg-white border border-bread-brown/10"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
          highlight ? "text-bread-cream/80" : "text-bread-charcoal/60"
        }`}
      >
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-2xl md:text-3xl font-bold ${
          highlight ? "text-white" : "text-bread-brown"
        }`}
      >
        {value}
      </motion.p>
      {sublabel && (
        <p
          className={`text-xs mt-2 ${
            highlight ? "text-bread-cream/70" : "text-bread-charcoal/50"
          }`}
        >
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}

export function FutureVisionDashboard() {
  const { setCurrentTab } = useBread();
  const [marketSize, setMarketSize] = useState(500_000);

  const projections = useMemo(() => {
    const monthlyActiveUsers = Math.round(marketSize * PLATFORM_REACH_RATE);
    const premiumSubscribers = Math.round(
      monthlyActiveUsers * PREMIUM_CONVERSION_RATE
    );
    const monthlyRevenue = premiumSubscribers * PREMIUM_MENTORSHIP_PRICE;
    const mauThousands = monthlyActiveUsers / 1000;

    const monolithCost =
      MONOLITH_BASE_MONTHLY + mauThousands * MONOLITH_COST_PER_1K_MAU;
    const splitCost =
      SPLIT_BASE_MONTHLY + mauThousands * SPLIT_COST_PER_1K_MAU;
    const costSavings = splitCost - monolithCost;
    const savingsPercent = Math.round((costSavings / splitCost) * 100);

    const annualRevenue = monthlyRevenue * 12;
    const infrastructureMargin =
      monthlyRevenue > 0
        ? Math.round(((monthlyRevenue - monolithCost) / monthlyRevenue) * 100)
        : 0;

    return {
      monthlyActiveUsers,
      premiumSubscribers,
      monthlyRevenue,
      annualRevenue,
      monolithCost,
      splitCost,
      costSavings,
      savingsPercent,
      infrastructureMargin,
    };
  }, [marketSize]);

  const sliderPercent = ((marketSize - 50_000) / (5_000_000 - 50_000)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bread-cream via-white to-bread-cream/50 p-4 md:p-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-10"
      >
        <button
          onClick={() => setCurrentTab("assessment")}
          className="text-bread-brown font-medium mb-4 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment
        </button>

        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-bread-brown/10 text-bread-brown px-3 py-1 rounded-full text-sm font-medium mb-3"
            >
              <Sparkles className="w-4 h-4" />
              View 4 — Product Vision
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-bread-brown mb-2">
              🏭 The Future Bakery
            </h1>
            <p className="text-bread-charcoal/70 max-w-2xl leading-relaxed">
              From hackathon prototype to venture-scale platform — our roadmap
              for sustainable growth, live data pipelines, and a
              learning-to-hiring marketplace.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl px-5 py-3 card-shadow border border-bread-brown/10"
          >
            <p className="text-xs text-bread-charcoal/50 uppercase tracking-wide">
              Status
            </p>
            <p className="text-lg font-bold text-bread-brown">Seed-Ready</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Phase Cards */}
      <div className="max-w-5xl mx-auto space-y-6 mb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xl font-bold text-bread-brown mb-2"
        >
          Scaling Phases
        </motion.h2>

        {PHASES.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <motion.article
              key={phase.phase}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.12,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -2 }}
              className={`bg-gradient-to-br ${phase.accent} rounded-2xl border ${phase.border} overflow-hidden card-shadow`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                    <Icon className="w-7 h-7 text-bread-brown" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-bread-brown/70">
                        Phase {phase.phase}
                      </span>
                      <span className="text-xs bg-white/70 text-bread-charcoal/70 px-2 py-0.5 rounded-full">
                        {phase.timeline}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-bread-brown mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-sm font-medium text-bread-charcoal/60 mb-4">
                      {phase.subtitle}
                    </p>
                    <p className="text-bread-charcoal/80 leading-relaxed mb-5">
                      {phase.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-3">
                      {phase.integrations.map((item) => (
                        <div
                          key={item.name}
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80"
                        >
                          <p className="text-sm font-semibold text-bread-brown mb-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-bread-charcoal/60 leading-snug">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ROI Simulation Panel */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-3xl p-6 md:p-10 card-shadow border border-bread-brown/10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-bread-brown" />
            <h2 className="text-2xl font-bold text-bread-brown">
              Metrics & ROI Simulation
            </h2>
          </div>
          <p className="text-bread-charcoal/60 mb-8 max-w-2xl">
            Drag the slider to model market penetration. Projections assume{" "}
            {PLATFORM_REACH_RATE * 100}% monthly platform reach and a{" "}
            {PREMIUM_CONVERSION_RATE * 100}% conversion to Premium Mentorship
            at {formatCurrency(PREMIUM_MENTORSHIP_PRICE)}/mo.
          </p>

          {/* Slider */}
          <div className="mb-10">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <label
                htmlFor="market-slider"
                className="text-sm font-semibold text-bread-charcoal flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-bread-brown" />
                Target Market Size (Career Shifters)
              </label>
              <motion.span
                key={marketSize}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-bread-brown tabular-nums"
              >
                {formatNumber(marketSize)}
              </motion.span>
            </div>

            <div className="relative">
              <input
                id="market-slider"
                type="range"
                min={50_000}
                max={5_000_000}
                step={50_000}
                value={marketSize}
                onChange={(e) => setMarketSize(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-200 accent-bread-brown"
                style={{
                  background: `linear-gradient(to right, #4a3728 0%, #4a3728 ${sliderPercent}%, #e5e7eb ${sliderPercent}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-bread-charcoal/50 mt-2">
                <span>50K</span>
                <span>5M</span>
              </div>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnimatedMetric
              label="Monthly Active Users"
              value={formatNumber(projections.monthlyActiveUsers)}
              sublabel={`${PLATFORM_REACH_RATE * 100}% of addressable market`}
              delay={0.6}
            />
            <AnimatedMetric
              label="Premium Subscribers"
              value={formatNumber(projections.premiumSubscribers)}
              sublabel={`${PREMIUM_CONVERSION_RATE * 100}% conversion rate`}
              delay={0.65}
            />
            <AnimatedMetric
              label="Potential Monthly Revenue"
              value={formatCurrency(projections.monthlyRevenue)}
              sublabel={`${formatCurrency(projections.annualRevenue)} ARR projected`}
              highlight
              delay={0.7}
            />
            <AnimatedMetric
              label="Infra Margin"
              value={`${projections.infrastructureMargin}%`}
              sublabel="After monolith server costs"
              delay={0.75}
            />
          </div>

          {/* Server Cost Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-bread-cream/80 rounded-2xl p-6 border border-bread-brown/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-bread-brown" />
              <h3 className="font-bold text-bread-brown">
                Server Cost Efficiency — Next.js Monolith vs. Split Architecture
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-bread-charcoal">
                    BREAD Monolith (Vercel)
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    {formatCurrency(projections.monolithCost)}/mo
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (projections.monolithCost / projections.splitCost) * 100)}%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-bread-charcoal/50 mt-2">
                  Serverless Route Handlers · pay-per-request · auto-scale to zero
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-bread-charcoal">
                    Traditional Split (FastAPI + Next.js)
                  </span>
                  <span className="text-lg font-bold text-red-600/80">
                    {formatCurrency(projections.splitCost)}/mo
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-400/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-bread-charcoal/50 mt-2">
                  Always-on VMs · dual deploy pipelines · CORS + ops overhead
                </p>
              </div>
            </div>

            <motion.p
              key={projections.costSavings}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-center text-sm font-semibold text-bread-brown bg-white/60 rounded-xl py-3 px-4"
            >
              Monolith saves{" "}
              <span className="text-emerald-700">
                {formatCurrency(projections.costSavings)}/month
              </span>{" "}
              ({projections.savingsPercent}% lower infra cost) — capital
              efficient from day one.
            </motion.p>
          </motion.div>

          {/* Integration icons footer */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-bread-brown/10">
            <div className="flex items-center gap-2 text-bread-charcoal/50 text-sm">
              <Youtube className="w-4 h-4" />
              YouTube API
            </div>
            <div className="flex items-center gap-2 text-bread-charcoal/50 text-sm">
              <GraduationCap className="w-4 h-4" />
              Coursera Partners
            </div>
            <div className="flex items-center gap-2 text-bread-charcoal/50 text-sm">
              <Briefcase className="w-4 h-4" />
              B2B Recruiters
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="max-w-5xl mx-auto mt-10 text-center"
      >
        <button
          onClick={() => setCurrentTab("assessment")}
          className="bg-bread-brown hover:bg-bread-brown/90 text-white font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          Start Baking Today
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </motion.div>
    </div>
  );
}
