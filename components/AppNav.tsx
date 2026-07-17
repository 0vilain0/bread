"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBread } from "@/context/BreadContext";

const TABS = [
  { id: "home" as const, label: "Home", emoji: "🍞" },
  { id: "assessment" as const, label: "Assess", emoji: "📋" },
  { id: "roadmap" as const, label: "Roadmap", emoji: "🗺️" },
  { id: "quiz" as const, label: "Quiz", emoji: "📝" },
  { id: "pantry" as const, label: "Pantry", emoji: "🧺" },
  { id: "premium" as const, label: "Premium", emoji: "💎" },
  { id: "future" as const, label: "Vision", emoji: "🏭" },
];

const pageTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export function AppNav() {
  const { currentTab, setCurrentTab, roadmap } = useBread();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-bread-brown/15 rounded-2xl px-2 py-2 card-shadow max-w-[calc(100vw-2rem)] overflow-x-auto"
      aria-label="Main navigation"
    >
      {TABS.map((tab) => {
        const isDisabled =
          (tab.id === "roadmap" || tab.id === "quiz") && !roadmap;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && setCurrentTab(tab.id)}
            disabled={isDisabled}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${
              isActive
                ? "bg-bread-brown text-white shadow-sm"
                : isDisabled
                  ? "text-bread-charcoal/30 cursor-not-allowed"
                  : "text-bread-charcoal/70 hover:bg-bread-brown/10 hover:text-bread-brown"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span aria-hidden>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}

export function PageTransition({ children, tabKey }: { children: React.ReactNode; tabKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={tabKey} {...pageTransition} className="w-full">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
