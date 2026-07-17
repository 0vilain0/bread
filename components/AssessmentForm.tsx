"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, AlertCircle } from "lucide-react";
import { useBread, AssessmentData } from "@/context/BreadContext";
import { usePantryStore } from "@/context/PantryContext";
import { generateRoadmap, APIError } from "@/utils/api";

export function AssessmentForm() {
  const {
    setCurrentTab,
    setAssessmentData,
    setRoadmap,
    isLoading,
    setIsLoading,
    setErrorMessage,
    errorMessage,
  } = useBread();
  const { saveRoadmap } = usePantryStore();

  const [formData, setFormData] = useState<Partial<AssessmentData>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Current Position",
      description: "What's your current job title?",
      field: "currentJob",
      placeholder: "e.g., Accountant, Software Engineer, Marketing Manager",
    },
    {
      title: "Current Skills",
      description: "List your key skills (comma-separated)",
      field: "currentSkills",
      placeholder: "e.g., Excel, Financial Analysis, SQL, Python",
    },
    {
      title: "Target Career",
      description: "What career goal are you aiming for?",
      field: "targetJob",
      placeholder: "e.g., Data Analyst, Product Manager, UX Designer",
    },
    {
      title: "Time Commitment",
      description: "How much time can you dedicate daily?",
      field: "timeCommitment",
      type: "select",
      options: ["1-2 hours/day", "2-3 hours/day", "3-4 hours/day", "4+ hours/day"],
    },
    {
      title: "Learning Style",
      description: "How do you prefer to learn?",
      field: "learningStyle",
      type: "select",
      options: [
        "Video-heavy (YouTube, Courses)",
        "Text/Documentation",
        "Hands-on Coding",
        "Mixed approach",
      ],
    },
  ];

  const handleInputChange = (value: string | string[]) => {
    const field = steps[currentStep].field;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage(null);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    try {
      setErrorMessage(null);
      setIsLoading(true);

      // Parse and prepare data
      let skillsArray: string[] = [];
      const skillsValue = formData.currentSkills as string | string[] | undefined;
      if (skillsValue) {
        if (typeof skillsValue === "string") {
          skillsArray = skillsValue.split(",").map((s: string) => s.trim());
        } else if (Array.isArray(skillsValue)) {
          skillsArray = skillsValue;
        }
      }

      const fullData: AssessmentData = {
        currentJob: formData.currentJob || "",
        currentSkills: skillsArray,
        targetJob: formData.targetJob || "",
        timeCommitment: formData.timeCommitment || "",
        learningStyle: formData.learningStyle || "",
      };

      // Validate required fields
      if (
        !fullData.currentJob ||
        !fullData.targetJob ||
        fullData.currentSkills.length === 0
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Parse hours per day from timeCommitment
      const hoursMatch = fullData.timeCommitment.match(/(\d+)/);
      const hoursPerDay = hoursMatch
        ? parseFloat(hoursMatch[1]) + 0.5
        : 2.5;

      setAssessmentData(fullData);

      // Call backend API
      const roadmapData = await generateRoadmap({
        current_job: fullData.currentJob,
        target_job: fullData.targetJob,
        hours_per_day: hoursPerDay,
      });

      setRoadmap(roadmapData);
      saveRoadmap({
        current_job: fullData.currentJob,
        target_job: fullData.targetJob,
        data: roadmapData,
      });
      setCurrentTab("roadmap");
    } catch (error) {
      if (error instanceof APIError) {
        setErrorMessage(`Error: ${error.message}. Please try again.`);
        console.error("API Error:", error.statusCode, error.message);
      } else {
        const errorMsg = error instanceof Error ? error.message : "An error occurred";
        setErrorMessage(errorMsg);
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isFieldFilled =
    formData[currentStepData.field as keyof AssessmentData];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-bread-cream to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-xl"
      >
        <button
          onClick={() => setCurrentTab("home")}
          className="text-bread-brown/70 text-sm font-medium mb-4 hover:text-bread-brown hover:underline"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-bread-brown mb-2"
          >
            🍞 BREAD
          </motion.h1>
          <p className="text-bread-charcoal/70">
            Let&apos;s bake your career transition roadmap
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  idx <= currentStep ? "bg-bread-brown" : "bg-gray-200"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
              />
            ))}
          </div>
          <p className="text-sm text-bread-charcoal/60 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-8 card-shadow mb-6"
        >
          <h2 className="text-2xl font-bold text-bread-brown mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-bread-charcoal/70 mb-6">
            {currentStepData.description}
          </p>

          {currentStepData.type === "select" ? (
            <div className="space-y-3">
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange(option)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                    formData[currentStepData.field as keyof AssessmentData] ===
                    option
                      ? "border-bread-brown bg-bread-brown/10"
                      : "border-gray-200 hover:border-bread-brown/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder={currentStepData.placeholder}
              value={
                (formData[
                  currentStepData.field as keyof AssessmentData
                ] as string) || ""
              }
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-bread-brown outline-none transition-colors"
            />
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-bread-charcoal font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-bread-brown transition-colors"
          >
            ← Back
          </button>

          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={!isFieldFilled}
              className="flex-1 px-4 py-3 rounded-lg bg-bread-brown text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bread-brown/90 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isFieldFilled || isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-bread-brown text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bread-brown/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Baking...
                </>
              ) : (
                "🍞 Bake My Roadmap"
              )}
            </button>
          )}
        </div>

        {/* Info Footer */}
        <p className="text-center text-sm text-bread-charcoal/50 mt-6">
          We respect your privacy. No data is stored.
        </p>
      </motion.div>
    </div>
  );
}
