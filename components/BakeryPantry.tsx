"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Clock,
  ExternalLink,
  RotateCcw,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { useBread } from "@/context/BreadContext";
import { usePantryStore } from "@/context/PantryContext";
import { buildResourceUrl, savedToRoadmapResponse } from "@/lib/pantry/types";
import type { AssessmentData } from "@/context/BreadContext";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const listItemVariants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16, height: 0, marginBottom: 0 },
};

export function BakeryPantry() {
  const { setCurrentTab, setRoadmap, setAssessmentData } = useBread();
  const {
    roadmaps,
    quizStats,
    savedResources,
    metrics,
    deleteRoadmap,
    deleteResource,
  } = usePantryStore();

  const handleReopen = (entry: (typeof roadmaps)[0]) => {
    setRoadmap(savedToRoadmapResponse(entry));
    const assessment: AssessmentData = {
      currentJob: entry.current_job,
      currentSkills: [],
      targetJob: entry.target_job,
      timeCommitment: "2-3 hours/day",
      learningStyle: "Mixed approach",
    };
    setAssessmentData(assessment);
    setCurrentTab("roadmap");
  };

  return (
    <div className="min-h-screen bg-bread-cream pb-28">
      <div className="bg-gradient-to-b from-white to-bread-cream border-b border-bread-brown/10 px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentTab("home")}
            className="text-bread-brown font-medium mb-4 hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-bread-brown/10 text-bread-brown px-3 py-1 rounded-full mb-3">
              View 6 — Bakery Pantry
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-bread-brown mb-2">
              🧺 Your Bakery Pantry
            </h1>
            <p className="text-bread-charcoal/70 max-w-2xl">
              Your personal hub — saved roadmaps, quiz progress, and bookmarked
              ingredients. All stored locally on your device.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-14">
        {/* Section 2 first for visual hierarchy - metrics at top */}
        <section>
          <h2 className="text-2xl font-bold text-bread-brown mb-6">
            Baking Progress Metrics
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-6 border border-bread-brown/8 card-shadow"
            >
              <Clock className="w-8 h-8 text-bread-brown mb-3" />
              <p className="text-3xl font-bold text-bread-brown">
                {metrics.totalStudyMinutes}
                <span className="text-lg font-normal text-bread-charcoal/50">
                  {" "}
                  mins
                </span>
              </p>
              <p className="text-sm font-semibold text-bread-charcoal/70 mt-1">
                Total Study Time
              </p>
              <p className="text-xs text-bread-charcoal/50 mt-1">
                Spent tasting quizzes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl p-6 border border-bread-brown/8 card-shadow"
            >
              <Target className="w-8 h-8 text-bread-brown mb-3" />
              <p className="text-3xl font-bold text-bread-brown">
                {metrics.totalQuizzes > 0
                  ? `${metrics.averageQuizAccuracy}%`
                  : "—"}
              </p>
              <p className="text-sm font-semibold text-bread-charcoal/70 mt-1">
                Average Quiz Accuracy
              </p>
              <p className="text-xs text-bread-charcoal/50 mt-1">
                Across {metrics.totalQuizzes} quiz
                {metrics.totalQuizzes !== 1 ? "zes" : ""}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -3 }}
              className="bg-gradient-to-br from-amber-50 to-bread-cream rounded-2xl p-6 border border-amber-200/60 card-shadow"
            >
              <Award className="w-8 h-8 text-amber-600 mb-3" />
              <div className="flex items-center gap-2 mb-1">
                <p className="text-3xl font-bold text-bread-brown">
                  {metrics.perfectQuizCount}
                </p>
                <span className="text-2xl" title="Golden Croissant">
                  🥐
                </span>
                {metrics.perfectQuizCount > 0 && (
                  <span className="text-2xl" title="Sourdough Badge">
                    🍞
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-bread-charcoal/70">
                Breads Earned
              </p>
              <p className="text-xs text-bread-charcoal/50 mt-1">
                Perfect 3/3 quiz scores
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 1: Roadmaps */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-bread-brown">
              My Baked Roadmaps
            </h2>
            <span className="text-sm text-bread-charcoal/50">
              {roadmaps.length} saved
            </span>
          </div>

          {roadmaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-10 text-center border border-dashed border-bread-brown/20"
            >
              <p className="text-bread-charcoal/60 mb-4">
                No roadmaps in the pantry yet. Bake your first career path!
              </p>
              <button
                onClick={() => setCurrentTab("assessment")}
                className="bg-bread-brown text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-bread-brown/90"
              >
                Start Assessment →
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {roadmaps.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    layout
                    variants={listItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="bg-white rounded-2xl p-5 border border-bread-brown/8 card-shadow flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-bread-brown truncate">
                        {entry.current_job}{" "}
                        <span className="text-bread-charcoal/40 font-normal">
                          →
                        </span>{" "}
                        {entry.target_job}
                      </p>
                      <p className="text-xs text-bread-charcoal/50 mt-1">
                        Baked {formatDate(entry.timestamp)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center px-3">
                        <p className="text-lg font-bold text-bread-brown">
                          {entry.similarity_score}%
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-bread-charcoal/50">
                          Alignment
                        </p>
                      </div>

                      <button
                        onClick={() => handleReopen(entry)}
                        className="flex items-center gap-1.5 bg-bread-brown text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-bread-brown/90"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Re-open
                      </button>

                      <button
                        onClick={() => deleteRoadmap(entry.id)}
                        className="p-2.5 rounded-xl text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Section 3: Bookmarks */}
        <section>
          <h2 className="text-2xl font-bold text-bread-brown mb-6">
            Saved Ingredients
          </h2>

          {savedResources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-10 text-center border border-dashed border-bread-brown/20"
            >
              <p className="text-bread-charcoal/60">
                Bookmark resources from your roadmap using the{" "}
                <TrendingUp className="w-4 h-4 inline text-bread-brown" /> icon
                next to each ingredient.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {savedResources.map((resource, i) => (
                  <motion.div
                    key={resource.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl p-5 border border-bread-brown/8 card-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold bg-bread-cream text-bread-brown px-2 py-0.5 rounded-full">
                          {resource.source}
                        </span>
                        <h3 className="font-semibold text-bread-brown mt-2 text-sm leading-snug line-clamp-2">
                          {resource.title}
                        </h3>
                        {resource.step_title && (
                          <p className="text-xs text-bread-charcoal/50 mt-1">
                            From: {resource.step_title}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteResource(resource.id)}
                        className="p-1.5 text-bread-charcoal/40 hover:text-red-500 flex-shrink-0"
                        aria-label="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <a
                      href={buildResourceUrl(resource.source, resource.keyword)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-bread-brown/10 text-bread-brown text-sm font-semibold hover:bg-bread-brown hover:text-white transition-colors"
                    >
                      Go to Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Recent quiz history snippet */}
        {quizStats.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-bread-brown mb-4">
              Recent Taste Tests
            </h2>
            <div className="space-y-2">
              {quizStats.slice(0, 5).map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-3 text-sm border border-bread-brown/5"
                >
                  <span className="text-bread-charcoal/80 truncate flex-1">
                    {stat.topic_name}
                  </span>
                  <span className="font-bold text-bread-brown mx-3">
                    {stat.score}
                  </span>
                  <span className="text-xs text-bread-charcoal/40">
                    {formatDate(stat.timestamp)}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
