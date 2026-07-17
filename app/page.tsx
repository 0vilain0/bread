"use client";

import { BreadProvider, useBread } from "@/context/BreadContext";
import { PantryProvider } from "@/context/PantryContext";
import { AssessmentForm } from "@/components/AssessmentForm";
import { RoadmapDashboard } from "@/components/RoadmapDashboard";
import { DailyQuiz } from "@/components/DailyQuiz";
import { FutureVisionDashboard } from "@/components/FutureVisionDashboard";
import { PremiumMarketplace } from "@/components/PremiumMarketplace";
import { BakeryPantry } from "@/components/BakeryPantry";
import { LandingPage } from "@/components/LandingPage";
import { OfflineBakingFailsafe } from "@/components/OfflineBakingFailsafe";
import { AppShell } from "@/components/AppShell";
import { PageTransition } from "@/components/AppNav";

function BreadAppContent() {
  const { currentTab } = useBread();

  const renderView = () => {
    switch (currentTab) {
      case "home":
        return <LandingPage />;
      case "assessment":
        return (
          <div data-tour="oven">
            <AssessmentForm />
          </div>
        );
      case "roadmap":
        return (
          <div data-tour="bread">
            <RoadmapDashboard />
          </div>
        );
      case "quiz":
        return (
          <div data-tour="taste-test">
            <DailyQuiz />
          </div>
        );
      case "future":
        return <FutureVisionDashboard />;
      case "premium":
        return <PremiumMarketplace />;
      case "pantry":
        return <BakeryPantry />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <AppShell>
      <PageTransition tabKey={currentTab}>{renderView()}</PageTransition>
    </AppShell>
  );
}

export default function BreadApp() {
  return (
    <BreadProvider>
      <PantryProvider>
        <OfflineBakingFailsafe />
        <BreadAppContent />
      </PantryProvider>
    </BreadProvider>
  );
}
