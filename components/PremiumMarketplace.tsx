"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Crown,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { useBread } from "@/context/BreadContext";
import {
  getCoursesForStep,
  getMentorsForTrack,
  PLATFORM_COLORS,
  resolveCareerTrack,
  type Mentor,
  type MarketplaceCourse,
} from "@/utils/marketplaceData";

const TIME_SLOTS = [
  "Mon 10:00 AM",
  "Mon 2:00 PM",
  "Tue 11:00 AM",
  "Wed 4:00 PM",
  "Thu 9:00 AM",
  "Fri 1:00 PM",
];

const CONFETTI_COLORS = ["#4a3728", "#c4a574", "#d4b896", "#fbf9f6", "#8b6914"];

function ConfettiBurst() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${Math.random() * 100}%`,
            top: "-5%",
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: typeof window !== "undefined" ? window.innerHeight + 50 : 800,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function BookingModal({
  mentor,
  isPremium,
  onClose,
}: {
  mentor: Mentor;
  isPremium: boolean;
  onClose: () => void;
}) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const price = isPremium
    ? Math.round(mentor.sessionPrice * 0.9)
    : mentor.sessionPrice;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bread-charcoal/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 md:p-8 card-shadow max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-bread-brown">Book a Session</h3>
            <p className="text-sm text-bread-charcoal/60 mt-1">with {mentor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-bread-charcoal/60"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {booked ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-bread-brown mb-2">You&apos;re booked!</h4>
            <p className="text-bread-charcoal/70 text-sm">
              {selectedSlot} · 30 minutes · ${price}
            </p>
            <p className="text-xs text-bread-charcoal/50 mt-4">
              Confirmation sent to your email (demo)
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-bread-charcoal/70 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-bread-brown" />
              Pick a time slot
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSlot === slot
                      ? "border-bread-brown bg-bread-brown/10 text-bread-brown"
                      : "border-gray-200 hover:border-bread-brown/40"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between bg-bread-cream rounded-xl p-4 mb-6">
              <span className="text-sm text-bread-charcoal/70">30-Min Session</span>
              <div className="text-right">
                {isPremium && (
                  <span className="text-xs text-emerald-600 line-through mr-2">
                    ${mentor.sessionPrice}
                  </span>
                )}
                <span className="text-xl font-bold text-bread-brown">${price}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedSlot}
              onClick={() => setBooked(true)}
              className="w-full bg-bread-brown disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl"
            >
              Confirm Booking
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function PremiumMarketplace() {
  const {
    roadmap,
    assessmentData,
    setCurrentTab,
    isPremium,
    setIsPremium,
  } = useBread();

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [addedCourseIds, setAddedCourseIds] = useState<Set<string>>(new Set());

  const targetJob = assessmentData?.targetJob ?? "Data Analyst";
  const currentJob = assessmentData?.currentJob ?? "Professional";
  const track = resolveCareerTrack(targetJob);

  const activeStep = roadmap?.roadmap[activeStepIndex];
  const stepTitle = activeStep?.title ?? "Career Foundations";

  const mentors = useMemo(() => getMentorsForTrack(track), [track]);
  const courses = useMemo(
    () => getCoursesForStep(track, stepTitle),
    [track, stepTitle]
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  const handleAddCourse = (course: MarketplaceCourse) => {
    setAddedCourseIds((prev) => new Set(prev).add(course.id));
    showToast(`"${course.title}" added to your ingredients!`);
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    setShowConfetti(true);
    setShowUpgradeSuccess(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-bread-cream flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <ShoppingBag className="w-12 h-12 text-bread-brown/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-bread-brown mb-2">
            The Premium Bakery Awaits
          </h2>
          <p className="text-bread-charcoal/70 mb-6">
            Bake your roadmap first — we&apos;ll personalize mentors and courses
            for your exact career transition.
          </p>
          <button
            onClick={() => setCurrentTab("assessment")}
            className="bg-bread-brown text-white font-semibold py-3 px-8 rounded-xl hover:bg-bread-brown/90"
          >
            Start Baking →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bread-cream pb-28">
      {showConfetti && <ConfettiBurst />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-28 left-1/2 z-50 bg-bread-brown text-white px-5 py-3 rounded-xl card-shadow flex items-center gap-2 text-sm font-medium max-w-[90vw]"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {bookingMentor && (
          <BookingModal
            mentor={bookingMentor}
            isPremium={isPremium}
            onClose={() => setBookingMentor(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-b from-white to-bread-cream border-b border-bread-brown/10 px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentTab("roadmap")}
            className="text-bread-brown font-medium mb-4 hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </button>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-bread-brown/10 text-bread-brown text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Crown className="w-3.5 h-3.5" />
                View 5 — Premium Bakery
              </span>
              {isPremium && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Artisanal Member
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-bread-brown mb-2">
              🧺 Premium Mentorship Hub
            </h1>
            <p className="text-bread-charcoal/70 max-w-2xl">
              Personalized for your pivot from{" "}
              <strong className="text-bread-brown">{currentJob}</strong> to{" "}
              <strong className="text-bread-brown">{targetJob}</strong>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-14">
        {/* SECTION 1: Head Bakers */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-bread-brown mb-2"
          >
            Meet the Head Bakers
          </motion.h2>
          <p className="text-bread-charcoal/60 text-sm mb-6">
            1-on-1 mentors who&apos;ve walked your path — book a 30-minute session.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mentors.map((mentor, i) => (
              <motion.article
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-bread-brown/8 card-shadow flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-bread-brown/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-bread-brown">
                      {mentor.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-bread-brown truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-bread-charcoal/60 truncate">
                      {mentor.title} at {mentor.company}
                    </p>
                  </div>
                </div>

                <span className="inline-block self-start text-xs font-semibold bg-bread-cream text-bread-brown px-2.5 py-1 rounded-full mb-3">
                  {mentor.expertise}
                </span>

                <p className="text-sm text-bread-charcoal/75 leading-relaxed flex-1 mb-5">
                  {mentor.bio}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBookingMentor(mentor)}
                  className="w-full bg-bread-brown text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Book a 30-Min Session — ${isPremium ? Math.round(mentor.sessionPrice * 0.9) : mentor.sessionPrice}
                </motion.button>
              </motion.article>
            ))}
          </div>
        </section>

        {/* SECTION 2: Premium Ingredients */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-bread-brown mb-2"
          >
            Premium Ingredients
          </motion.h2>
          <p className="text-bread-charcoal/60 text-sm mb-4">
            Curated courses matched to your active roadmap step.
          </p>

          {/* Step filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {roadmap.roadmap.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-xs font-medium px-3 py-2 rounded-full border-2 transition-all ${
                  activeStepIndex === idx
                    ? "border-bread-brown bg-bread-brown text-white"
                    : "border-bread-brown/20 text-bread-charcoal/70 hover:border-bread-brown/50"
                }`}
              >
                Step {step.step}: {step.title.split(" ")[0]}…
              </button>
            ))}
          </div>

          <p className="text-sm text-bread-brown font-medium mb-4">
            Showing courses for: <em>{stepTitle}</em>
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {courses.map((course, i) => {
              const isAdded = addedCourseIds.has(course.id);
              return (
                <motion.article
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl p-5 border border-bread-brown/8 card-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-bread-brown text-sm leading-snug flex-1">
                      {course.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        PLATFORM_COLORS[course.platform]
                      }`}
                    >
                      {course.platform}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-bread-charcoal/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {course.rating}★ ({course.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-bread-brown">
                      ${course.discountedPrice}
                    </span>
                    <span className="text-xs text-bread-charcoal/40 line-through">
                      ${course.price}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {course.discountCode}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddCourse(course)}
                    disabled={isAdded}
                    className={`w-full font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 ${
                      isAdded
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-bread-brown/10 text-bread-brown hover:bg-bread-brown hover:text-white transition-colors"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Ingredients
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Ingredients
                      </>
                    )}
                  </motion.button>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Bread Box */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-bread-brown mb-6 text-center"
          >
            The Bread Box
          </motion.h2>

          {showUpgradeSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-bread-brown to-bread-brown/80 rounded-3xl p-10 text-center text-white card-shadow"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Welcome to the Artisanal Basket!</h3>
              <p className="text-bread-cream/80 max-w-md mx-auto">
                You&apos;re now a premium baker. Unlimited roadmaps, adaptive quizzes,
                and 10% off every mentor session — fresh benefits, every month.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Daily Loaf */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 card-shadow"
              >
                <p className="text-sm font-semibold text-bread-charcoal/50 uppercase tracking-wide mb-1">
                  Daily Loaf
                </p>
                <p className="text-4xl font-bold text-bread-brown mb-6">
                  $0
                  <span className="text-base font-normal text-bread-charcoal/50">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Basic AI Roadmap generation",
                    "3 Daily Quiz questions per step",
                    "Standard community support",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-bread-charcoal/75"
                    >
                      <Check className="w-4 h-4 text-bread-brown flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="w-full py-3 rounded-xl border-2 border-gray-200 text-bread-charcoal/50 font-medium text-sm cursor-default"
                >
                  Current Plan
                </button>
              </motion.div>

              {/* Artisanal Basket */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-bread-brown to-[#3d2e22] rounded-2xl p-8 text-white card-shadow relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                  POPULAR
                </div>
                <p className="text-sm font-semibold text-bread-cream/70 uppercase tracking-wide mb-1">
                  Artisanal Basket
                </p>
                <p className="text-4xl font-bold mb-6">
                  $9.99
                  <span className="text-base font-normal text-bread-cream/60">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited AI Roadmap regeneration",
                    "Unlimited adaptive practice quizzes",
                    "Direct AI resume feedback",
                    "10% discount on all mentor sessions",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-bread-cream/90"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className="w-full bg-white text-bread-brown font-bold py-3.5 rounded-xl hover:bg-bread-cream transition-colors"
                >
                  Upgrade to Premium
                </motion.button>
              </motion.div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
