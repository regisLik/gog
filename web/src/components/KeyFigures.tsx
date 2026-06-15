"use client";

import { motion } from "framer-motion";

type Figure = {
  value: string;
  text: string;
  source: string;
  side: "left" | "right";
};

const figures: Figure[] = [
  {
    value: "+830 M",
    text: "Jeunes dans le monde d'ici 2050 qui auront besoin d'orientation professionnelle",
    source: "United Nations",
    side: "left",
  },
  {
    value: "1 sur 4",
    text: "Jeunes en Afrique subsaharienne ni en emploi, ni en études, ni en formation (NEET)",
    source: "ILOSTAT",
    side: "right",
  },
  {
    value: "La majorité",
    text: "Des jeunes s'orientent sans information suffisante — « on fait vite, et la plupart du temps on se trompe »",
    source: "Unaf",
    side: "left",
  },
  {
    value: "4,8 %",
    text: "Des étudiants africains partent étudier à l'étranger faute de lisibilité sur l'offre locale",
    source: "CIOMAG",
    side: "right",
  },
];

export default function KeyFigures() {
  return (
    <section
      id="key-figures"
      className="w-full bg-surface-container-lowest relative z-20 px-4 md:px-6 py-24 md:py-32"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <p className="font-label-sm text-label-sm tracking-[0.12em] text-on-surface-variant mb-4">
            Le constat
          </p>
          <h2 className="font-display-lg font-bold text-[2rem] sm:text-[2.75rem] tracking-tight text-on-background">
            Les 4 chiffres clés
          </h2>
        </div>

        <div className="flex flex-col gap-10 md:gap-12">
          {figures.map((f, i) => (
            <motion.article
              key={i}
              className={`w-full md:w-[55%] bg-surface-container-lowest border border-surface-variant rounded-2xl p-8 md:p-10 shadow-sm ${
                f.side === "left" ? "md:self-start" : "md:self-end"
              }`}
              initial={{ opacity: 0, x: f.side === "left" ? -48 : 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="font-display-lg font-bold text-primary text-5xl md:text-6xl leading-none tracking-tight mb-5">
                {f.value}
              </div>
              <p className="text-body-md font-body-md text-on-background mb-4">
                {f.text}
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {f.source}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
