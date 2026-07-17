"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Loader, AlertCircle, Bookmark } from "lucide-react";
import { useBread } from "@/context/BreadContext";
import { usePantryStore } from "@/context/PantryContext";
import { generateQuiz, APIError } from "@/utils/api";

export function RoadmapDashboard() {
  const {
    roadmap,
    setCurrentTab,
    setCurrentQuizStep,
    setQuizQuestions,
    isLoading,
    setIsLoading,
    setErrorMessage,
    errorMessage,
    setActiveTopicName,
  } = useBread();
  const { bookmarkResource, isResourceBookmarked, showPantryToast } =
    usePantryStore();

  const [loadingCard, setLoadingCard] = React.useState<number | null>(null);

  const handleBookmark = (
    source: string,
    keyword: string,
    stepTitle: string
  ) => {
    const added = bookmarkResource({
      source,
      keyword,
      step_title: stepTitle,
    });
    if (added) {
      showPantryToast("Added to your Pantry!");
    } else {
      showPantryToast("Already saved in your Pantry.");
    }
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-bread-charcoal">
          <p className="text-xl font-semibold">The oven is cold</p>
          <p className="text-sm">No roadmap yet. Please bake your roadmap first.</p>
        </div>
      </div>
    );
  }

  const isRoadmapValid =
    roadmap &&
    Array.isArray(roadmap.roadmap) &&
    roadmap.roadmap.length > 0;

  if (!isRoadmapValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-bread-charcoal">
          <p className="text-xl font-semibold">The oven is cold</p>
          <p className="text-sm">We could not bake a roadmap. Try again or check the backend.</p>
        </div>
      </div>
    );
  }

  const handleTakeQuiz = async (stepNumber: number, stepTitle: string) => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      setLoadingCard(stepNumber);
      setActiveTopicName(stepTitle);

      // Call backend API to generate quiz
      const quizData = await generateQuiz({ topic_name: stepTitle });

      setQuizQuestions(quizData);
      setCurrentQuizStep(stepNumber);
      setCurrentTab("quiz");
    } catch (error) {
      if (error instanceof APIError) {
        setErrorMessage(`Failed to generate quiz: ${error.message}. Please try again.`);
        console.error("Quiz API Error:", error.statusCode, error.message);
      } else {
        const errorMsg = error instanceof Error ? error.message : "An error occurred";
        setErrorMessage(errorMsg);
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
      setLoadingCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bread-cream to-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => setCurrentTab("assessment")}
          className="text-bread-brown font-medium mb-4 hover:underline"
        >
          ← Edit Assessment
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-bread-brown mb-2">
          🍞 Your Career Roadmap
        </h1>
        <p className="text-bread-charcoal/70">
          A personalized journey from your current role to your dream position
        </p>
      </motion.div>

      {/* Summary Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-6 mb-12"
      >
        {/* Skill Alignment Score */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-bread-charcoal/70 uppercase tracking-wide">
              Skill Alignment
            </h3>
            <div className="w-16 h-16 rounded-full bg-bread-brown/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-bread-brown">
                {roadmap.similarity_score}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-bread-brown h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${roadmap.similarity_score}%` }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
          <p className="text-xs text-bread-charcoal/60 mt-2">
            Based on your background
          </p>
        </div>

        {/* Steps Count */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h3 className="text-sm font-semibold text-bread-charcoal/70 uppercase tracking-wide mb-2">
            Learning Path
          </h3>
          <p className="text-3xl font-bold text-bread-brown mb-2">
            {roadmap.roadmap.length} Steps
          </p>
          <p className="text-xs text-bread-charcoal/60">
            Structured progression
          </p>
        </div>
      </motion.div>

      {/* Analysis Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 md:p-8 card-shadow mb-12"
      >
        <h2 className="text-xl font-bold text-bread-brown mb-4">AI Analysis</h2>
        <p className="text-bread-charcoal/80 leading-relaxed">
          {roadmap.analysis_summary}
        </p>
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Roadmap Steps */}
      <div className="space-y-6 mb-8">
        {roadmap.roadmap.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6 md:p-8">
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-bread-brown/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-bread-brown">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-bread-brown mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-bread-charcoal/60">
                    Estimated: {step.duration}
                  </p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-bread-charcoal/70 mb-3">
                  Core Skills to Master
                </h4>
                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block bg-bread-brown/10 text-bread-brown px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-bread-charcoal/70 mb-3">
                  Curated Resources
                </h4>
                <div className="space-y-2">
                  {step.resources.map((resource, rIdx) => {
                    const bookmarked = isResourceBookmarked(
                      resource.source,
                      resource.keyword
                    );
                    return (
                      <div
                        key={rIdx}
                        className="flex items-center gap-2 text-sm text-bread-charcoal/80 bg-gray-50 p-3 rounded-lg"
                      >
                        <BookOpen className="w-4 h-4 text-bread-brown flex-shrink-0" />
                        <span className="font-medium text-bread-brown">
                          {resource.source}:
                        </span>
                        <span className="flex-1 min-w-0 truncate">
                          {resource.keyword}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleBookmark(
                              resource.source,
                              resource.keyword,
                              step.title
                            )
                          }
                          className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
                            bookmarked
                              ? "text-bread-brown bg-bread-brown/15"
                              : "text-bread-charcoal/40 hover:text-bread-brown hover:bg-bread-brown/10"
                          }`}
                          aria-label={
                            bookmarked
                              ? "Saved to pantry"
                              : "Bookmark resource"
                          }
                        >
                          <Bookmark
                            className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Button */}
              <button
                onClick={() => handleTakeQuiz(step.step, step.title)}
                disabled={isLoading || loadingCard === step.step}
                aria-disabled={isLoading || loadingCard === step.step}
                className="w-full bg-bread-brown hover:bg-bread-brown/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loadingCard === step.step ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Loading Quiz...
                  </>
                ) : (
                  <>
                    📝 Take Practice Quiz
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-bread-brown text-white rounded-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold mb-2">Ready to start learning?</h3>
        <p className="mb-4 opacity-90">
          Begin with Step 1 and take the practice quiz to assess your current knowledge
        </p>
        <button
          onClick={() =>
            handleTakeQuiz(1, roadmap.roadmap[0]?.title || "Step 1")
          }
          disabled={isLoading}
          className="bg-white text-bread-brown disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-lg hover:bg-bread-cream transition-colors inline-block"
        >
          {isLoading ? "Loading..." : "Start with Step 1 →"}
        </button>
      </motion.div>
    </div>
  );
}
