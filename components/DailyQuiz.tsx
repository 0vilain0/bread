"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Home } from "lucide-react";
import { useBread } from "@/context/BreadContext";
import { usePantryStore } from "@/context/PantryContext";

export function DailyQuiz() {
  const {
    quizQuestions,
    currentQuizStep,
    setCurrentTab,
    roadmap,
    activeTopicName,
  } = useBread();
  const { saveQuizResult } = usePantryStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const quizStartRef = useRef<number>(Date.now());
  const savedResultRef = useRef(false);

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizComplete(false);
    savedResultRef.current = false;
    quizStartRef.current = Date.now();
  }, [quizQuestions]);

  useEffect(() => {
    if (
      !quizComplete ||
      savedResultRef.current ||
      !quizQuestions?.length
    ) {
      return;
    }

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - quizStartRef.current) / 1000)
    );

    saveQuizResult({
      topic_name: activeTopicName ?? `Step ${currentQuizStep ?? 1}`,
      score_correct: score,
      score_total: quizQuestions.length,
      duration_seconds: durationSeconds,
    });
    savedResultRef.current = true;
  }, [
    quizComplete,
    score,
    quizQuestions,
    activeTopicName,
    currentQuizStep,
    saveQuizResult,
  ]);

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-bread-charcoal">
          <p className="text-xl font-semibold">The oven is cold</p>
          <p className="text-sm">No quiz available right now. Please try again or select another step.</p>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-bread-charcoal">
          <p className="text-xl font-semibold">The oven is cold</p>
          <p className="text-sm">
            This quiz content is unavailable. Please return to the roadmap and try again.
          </p>
        </div>
      </div>
    );
  }

  const correctAnswer = (question as any).correct_answer || (question as any).correctAnswer || "";
  const isCorrect = selectedAnswer === correctAnswer;

  const handleSelectAnswer = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option);
      setAnswered(true);
      if (option === correctAnswer) {
        setScore((s) => s + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizComplete(false);
    savedResultRef.current = false;
    quizStartRef.current = Date.now();
  };

  const progressPercent = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bread-cream to-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <button
          onClick={() => setCurrentTab("roadmap")}
          className="flex items-center gap-2 text-bread-brown font-medium mb-6 hover:underline"
        >
          <Home className="w-4 h-4" />
          Back to Roadmap
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-bread-brown mb-2">
          📝 Knowledge Check Quiz
        </h1>
        {activeTopicName && (
          <p className="text-bread-charcoal/70">
            Topic: {activeTopicName}
          </p>
        )}
        {currentQuizStep && roadmap && (
          <p className="text-bread-charcoal/70 text-sm mt-1">
            Step {currentQuizStep}
          </p>
        )}
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-bread-charcoal">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-bread-charcoal/60">
                    Score: {score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-bread-brown h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-8 card-shadow mb-8"
              >
                <h2 className="text-xl md:text-2xl font-bold text-bread-brown mb-8">
                  {question.question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-4 mb-8">
                  {question.options.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                    const isSelected = selectedAnswer === option;
                    const showCorrect = answered && isSelected && isCorrect;
                    const showIncorrect =
                      answered && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={answered}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          showCorrect
                            ? "border-green-500 bg-green-50"
                            : showIncorrect
                              ? "border-red-500 bg-red-50"
                              : isSelected && answered === false
                                ? "border-bread-brown bg-bread-brown/10"
                                : "border-gray-200 hover:border-bread-brown/50"
                        } ${answered ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-bread-brown">
                            {optionLetter}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                          )}
                          {showIncorrect && (
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-lg mb-6 ${
                        isCorrect
                          ? "bg-green-50 border-l-4 border-green-500"
                          : "bg-red-50 border-l-4 border-red-500"
                      }`}
                    >
                      <p className="font-semibold mb-2">
                        {isCorrect ? "✓ Great job!" : "✗ Not quite right."}
                      </p>
                      <p className="text-sm text-bread-charcoal">
                        {question.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Button */}
              {answered && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleNextQuestion}
                  className="w-full bg-bread-brown hover:bg-bread-brown/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentQuestion === quizQuestions.length - 1
                    ? "See Results"
                    : "Next Question"}{" "}
                  →
                </motion.button>
              )}
            </motion.div>
          ) : (
            // Results Screen
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-8 card-shadow text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-bread-brown/10 flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-5xl font-bold text-bread-brown">
                  {Math.round((score / quizQuestions.length) * 100)}%
                </span>
              </motion.div>

              <h2 className="text-3xl font-bold text-bread-brown mb-2">
                Quiz Complete! 🎉
              </h2>
              <p className="text-bread-charcoal/70 mb-6">
                You scored <span className="font-bold">{score}</span> out of{" "}
                <span className="font-bold">{quizQuestions.length}</span> questions
              </p>

              {/* Performance Message */}
              <div className="bg-bread-cream p-6 rounded-lg mb-8">
                <p className="text-bread-charcoal">
                  {score === quizQuestions.length
                    ? "Perfect score! You've mastered this topic! Keep up the excellent work! 🌟"
                    : score >= quizQuestions.length * 0.8
                      ? "Great job! You're well on your way to mastering this skill. 💪"
                      : score >= quizQuestions.length * 0.6
                        ? "Good progress! Review the concepts and try again to reinforce your learning. 📚"
                        : "Don't worry! Learning takes time. Review the resources and give it another shot. 🍞"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="flex-1 border-2 border-bread-brown text-bread-brown font-semibold py-3 px-4 rounded-lg hover:bg-bread-brown/5 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setCurrentTab("roadmap")}
                  className="flex-1 bg-bread-brown text-white font-semibold py-3 px-4 rounded-lg hover:bg-bread-brown/90 transition-colors"
                >
                  Back to Roadmap
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
