"use client";

import { motion } from "framer-motion";

export function BreadLoafIllustration() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Steam wisps */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-12 rounded-full bg-bread-brown/10 blur-sm"
          style={{ left: `${35 + i * 18}%`, top: "8%" }}
          animate={{
            y: [-4, -20, -4],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main loaf — rises gently */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="175" rx="70" ry="12" fill="#4a3728" opacity="0.12" />

          {/* Loaf body */}
          <path
            d="M40 120 Q40 60 100 55 Q160 60 160 120 Q160 155 100 160 Q40 155 40 120 Z"
            fill="#c4a574"
          />
          <path
            d="M45 115 Q45 68 100 62 Q155 68 155 115 Q155 145 100 150 Q45 145 45 115 Z"
            fill="#d4b896"
          />

          {/* Score marks */}
          <path
            d="M55 95 Q75 75 100 72 Q125 75 145 95"
            fill="none"
            stroke="#4a3728"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M50 110 Q70 88 100 85 Q130 88 150 110"
            fill="none"
            stroke="#4a3728"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path
            d="M48 125 Q68 105 100 102 Q132 105 152 125"
            fill="none"
            stroke="#4a3728"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* Highlight */}
          <ellipse cx="75" cy="90" rx="18" ry="10" fill="white" opacity="0.25" />
        </motion.g>
      </motion.svg>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-8 rounded-full border-2 border-bread-brown/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}
