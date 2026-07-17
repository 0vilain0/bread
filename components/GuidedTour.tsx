"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";

import { useBread } from "@/context/BreadContext";
import { injectDemoData } from "@/lib/demo/injectDemoData";
import { DEMO_ASSESSMENT_ACCOUNTANT } from "@/lib/demo/demoData";

const TOUR_STORAGE_KEY = "bread_tour_completed";

const TOUR_STEPS = [
  {
    id: "oven",
    tab: "assessment" as const,
    selector: '[data-tour="oven"]',
    title: "Step 1: The Oven",
    body: "Input your career shift — current role, skills, target job, and daily time budget. BREAD bakes a personalized roadmap from here.",
  },
  {
    id: "bread",
    tab: "roadmap" as const,
    selector: '[data-tour="bread"]',
    title: "Step 2: The Bread",
    body: "See your custom, AI-baked roadmap — Skill Alignment Score, four learning phases, and curated resources ready to explore.",
  },
  {
    id: "taste-test",
    tab: "roadmap" as const,
    selector: '[data-tour="taste-test"]',
    title: "Step 3: The Taste Test",
    body: "Validate skills with interactive quizzes. Get warm mentor-style feedback on every answer — proof you're ready to advance.",
  },
];

export function GuidedTour() {
  const { setCurrentTab, setRoadmap, setAssessmentData } = useBread();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[stepIndex];

  const updateSpotlight = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      setSpotlight(el.getBoundingClientRect());
    } else {
      setSpotlight(null);
    }
  }, [step]);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!active || !step) return;

    setCurrentTab(step.tab);

    if (step.id === "bread" || step.id === "taste-test") {
      const demo = injectDemoData();
      setRoadmap(demo.primaryRoadmap);
      setAssessmentData(DEMO_ASSESSMENT_ACCOUNTANT);
    }

    const timer = setTimeout(updateSpotlight, 400);
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
    };
  }, [
    active,
    step,
    setCurrentTab,
    setRoadmap,
    setAssessmentData,
    updateSpotlight,
  ]);

  const finish = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setActive(false);
    setSpotlight(null);
  };

  const next = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      finish();
    }
  };

  if (!active || !step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80]"
        aria-modal
        role="dialog"
      >
        {/* Dim overlay with spotlight cutout via box-shadow */}
        {spotlight ? (
          <motion.div
            className="absolute rounded-2xl pointer-events-none border-2 border-bread-brown/60"
            initial={false}
            animate={{
              top: spotlight.top - 8,
              left: spotlight.left - 8,
              width: spotlight.width + 16,
              height: spotlight.height + 16,
              boxShadow: "0 0 0 9999px rgba(43, 43, 43, 0.65)",
            }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          />
        ) : (
          <div className="absolute inset-0 bg-bread-charcoal/65" />
        )}

        {/* Tour card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-32 md:bottom-36 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl p-6 card-shadow border border-bread-brown/10"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-bread-brown/70">
              Judge&apos;s Guided Tour · {stepIndex + 1}/{TOUR_STEPS.length}
            </span>
            <button
              onClick={finish}
              className="p-1 rounded-lg text-bread-charcoal/40 hover:text-bread-charcoal hover:bg-gray-100"
              aria-label="Skip tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-bread-brown mb-2">{step.title}</h3>
          <p className="text-sm text-bread-charcoal/75 leading-relaxed mb-6">
            {step.body}
          </p>
          <div className="flex gap-2">
            <button
              onClick={finish}
              className="flex-1 py-2.5 rounded-xl border border-bread-brown/20 text-bread-charcoal/70 text-sm font-medium hover:bg-bread-cream"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="flex-1 py-2.5 rounded-xl bg-bread-brown text-white text-sm font-semibold hover:bg-bread-brown/90 flex items-center justify-center gap-1"
            >
              {stepIndex < TOUR_STEPS.length - 1 ? "Next" : "Start Baking"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function resetGuidedTour(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  }
}
