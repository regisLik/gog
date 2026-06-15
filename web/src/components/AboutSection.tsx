"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const line = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf4db] z-20 px-4 md:px-6 py-24 md:py-32 min-h-[70vh] flex items-center">
      {/* Soft white halo behind the text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0) 70%)",
        }}
      />

      <motion.div
        className="relative max-w-4xl mx-auto flex flex-col items-center text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.p
          variants={line}
          className="font-label-sm text-label-sm tracking-[0.12em] text-on-secondary-fixed-variant mb-6"
        >
          À propos de JOG
        </motion.p>
        <h2 className="font-display-lg font-bold text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] leading-[1.1] tracking-tight text-on-secondary-fixed">
          <motion.span variants={line} className="block">
            Une plateforme d&apos;orientation
          </motion.span>
          <motion.span variants={line} className="block">
            propulsée par l&apos;IA,
          </motion.span>
          <motion.span variants={line} className="block">
            pensée pour faire grandir votre carrière
          </motion.span>
        </h2>
      </motion.div>
    </section>
  );
}
