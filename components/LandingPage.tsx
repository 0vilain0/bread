"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  ClipboardList,
  Sparkles,
  Zap,
  Mail,
  CheckCircle2,
} from "lucide-react";

import { useBread } from "@/context/BreadContext";
import { BreadLoafIllustration } from "@/components/BreadLoafIllustration";

const CAREER_BADGES = [
  { from: "Accountant", to: "Data Analyst", delay: 0 },
  { from: "Teacher", to: "UX Writer", delay: 0.15 },
  { from: "Retail Manager", to: "Product Manager", delay: 0.3 },
  { from: "Nurse", to: "Health Tech", delay: 0.45 },
];

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "Gather Ingredients",
    subtitle: "Your Profile",
    description:
      "Tell us where you are, where you want to be, and how much time you can invest daily. Five warm, guided steps — no overwhelm.",
  },
  {
    icon: Sparkles,
    title: "Proof & Rise",
    subtitle: "AI Roadmap",
    description:
      "Our serverless AI maps your existing skills onto your target industry, surfacing hidden advantages and a structured 4-step path.",
  },
  {
    icon: ChefHat,
    title: "Taste Test",
    subtitle: "Daily Quizzes",
    description:
      "Validate each learning phase with interactive assessments and warm mentor-style feedback — proof you're ready to move forward.",
  },
];

const METRICS = [
  { value: "45%", label: "Skill Transferability", sub: "On Average" },
  { value: "4", label: "Core Learning Steps", sub: "Per Path" },
  { value: "100%", label: "Serverless & Fast", sub: "Zero Heavy Infra" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function LandingPage() {
  const { setCurrentTab } = useBread();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const goToAssessment = () => setCurrentTab("assessment");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="bg-bread-cream text-bread-charcoal overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 md:px-8 pt-12 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-bread-brown/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/80 border border-bread-brown/10 rounded-full px-4 py-1.5 text-sm font-medium text-bread-brown mb-6 card-shadow"
              >
                <span>🍞</span>
                Bake Your Next Livelihood
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-bread-brown leading-tight mb-6">
                Stop drowning in career anxiety.{" "}
                <span className="text-bread-charcoal/80">
                  Let AI bake your transition roadmap.
                </span>
              </h1>

              <p className="text-lg text-bread-charcoal/70 leading-relaxed mb-8 max-w-xl">
                BREAD turns intimidating career shifts into structured, bite-sized
                daily paths. No expensive bootcamps, no overwhelming noise—just
                your essential, practical next step to secure your livelihood.
              </p>

              <motion.button
                onClick={goToAssessment}
                whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(74,55,40,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-bread-brown hover:bg-bread-brown/90 text-white font-semibold text-lg py-4 px-8 rounded-2xl inline-flex items-center gap-3 transition-colors card-shadow"
              >
                Start Baking Your Career
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <BreadLoafIllustration />

              {CAREER_BADGES.map((badge, i) => (
                <motion.div
                  key={`${badge.from}-${badge.to}`}
                  className="absolute bg-white/90 backdrop-blur-sm border border-bread-brown/10 rounded-xl px-3 py-2 text-sm font-medium text-bread-charcoal card-shadow whitespace-nowrap"
                  style={{
                    top: `${15 + i * 18}%`,
                    left: i % 2 === 0 ? "-5%" : "auto",
                    right: i % 2 === 1 ? "-8%" : "auto",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + badge.delay, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                >
                  <span className="text-bread-brown">{badge.from}</span>
                  <span className="mx-1.5 text-bread-charcoal/40">→</span>
                  <span>{badge.to}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-bread-brown/70 mb-3">
              The Ingredients
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-bread-brown">
              How BREAD Works
            </h2>
            <p className="text-bread-charcoal/60 mt-4 max-w-2xl mx-auto">
              Three simple steps from anxiety to action — like baking bread,
              one phase at a time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {HOW_IT_WORKS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-8 border border-bread-brown/8 card-shadow group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-bread-brown/10 flex items-center justify-center mb-6 group-hover:bg-bread-brown/15 transition-colors">
                    <Icon className="w-7 h-7 text-bread-brown" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-bread-brown/60 mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-bread-brown mb-3">
                    {card.title}
                  </h3>
                  <p className="text-bread-charcoal/70 leading-relaxed text-sm">
                    {card.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LIVE METRICS ── */}
      <section className="py-16 px-4 md:px-8">
        <motion.div
          {...fadeUp}
          className="max-w-5xl mx-auto bg-bread-brown rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-10">
              <Zap className="w-5 h-5 text-amber-200" />
              <p className="text-sm font-semibold uppercase tracking-widest text-bread-cream/80">
                BREAD Impact Board
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <motion.p
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    {metric.value}
                  </motion.p>
                  <p className="font-semibold text-bread-cream/90">{metric.label}</p>
                  <p className="text-sm text-bread-cream/60 mt-1">{metric.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA / BAKERY DOOR ── */}
      <section className="py-24 px-4 md:px-8 pb-32">
        <motion.div
          {...fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-bread-brown mb-4">
            The Bakery Door Is Open
          </h2>
          <p className="text-bread-charcoal/70 mb-10 leading-relaxed">
            Subscribe for the Weekly Loaf — curated job openings, skill tips, and
            pivot stories delivered fresh every Monday.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-6 mb-8"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">You&apos;re on the list! Fresh loaf incoming.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bread-charcoal/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-bread-brown/15 bg-white focus:border-bread-brown outline-none transition-colors"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-bread-charcoal hover:bg-bread-charcoal/90 text-white font-semibold py-3.5 px-6 rounded-xl whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          )}

          <motion.button
            onClick={goToAssessment}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(74,55,40,0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-bread-brown hover:bg-bread-brown/90 text-white font-bold text-xl py-5 px-12 rounded-2xl inline-flex items-center gap-3 card-shadow"
          >
            Step Into the Kitchen
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          <p className="text-sm text-bread-charcoal/40 mt-8">
            Free to start · No account required · Privacy-first
          </p>
        </motion.div>
      </section>
    </div>
  );
}
