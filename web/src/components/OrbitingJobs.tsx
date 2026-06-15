"use client";

import { useEffect, useRef, useState } from "react";

type Job = {
  title: string;
  icon: string;
  colorClass: string;
  iconBg: string;
  iconColor: string;
  hoverColor: string;
  ringColor: string;
};

const VISIBLE_CARDS = 8;
const ORBIT_DURATION = 40000; // ms for one full orbit

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Position + opacity for a card at progress p (0..1). One shared clock drives
// all cards, so their positions are a pure function of time and can never drift
// apart, stack, or burst on a tab switch.
function arcStyle(p: number) {
  let rotate: number, scale: number, opacity: number;
  if (p < 0.1) {
    const t = p / 0.1;
    rotate = lerp(-45, -36, t);
    scale = lerp(0.5, 1, t);
    opacity = t;
  } else if (p < 0.9) {
    rotate = lerp(-36, 36, (p - 0.1) / 0.8);
    scale = 1;
    opacity = 1;
  } else {
    const t = (p - 0.9) / 0.1;
    rotate = lerp(36, 45, t);
    scale = lerp(1, 0.5, t);
    opacity = 1 - t;
  }
  return {
    transform: `translate(-50%, -50%) rotate(${rotate}deg) translateY(-120vh) scale(${scale})`,
    opacity,
  };
}

export default function OrbitingJobs() {
  const [slotJobs, setSlotJobs] = useState<(Job | null)[]>(
    Array(VISIBLE_CARDS).fill(null),
  );
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mutable engine state (never triggers re-renders).
  const engine = useRef({
    playlist: [] as Job[],
    nextIndex: 0,
    onScreen: new Set<string>(),
    slotTitles: Array<string | null>(VISIBLE_CARDS).fill(null),
    prevP: Array.from({ length: VISIBLE_CARDS }, (_, i) => i / VISIBLE_CARDS),
    elapsed: 0,
    lastTime: null as number | null,
    paused: false,
  });

  useEffect(() => {
    const eng = engine.current;
    let raf = 0;
    let cancelled = false;

    function pickNextJob(): Job {
      const { playlist, onScreen } = eng;
      for (let i = 0; i < playlist.length; i++) {
        const job = playlist[eng.nextIndex % playlist.length];
        eng.nextIndex++;
        if (!onScreen.has(job.title)) return job;
      }
      return playlist[eng.nextIndex++ % playlist.length];
    }

    function swap(slot: number) {
      const old = eng.slotTitles[slot];
      if (old) eng.onScreen.delete(old);
      const job = pickNextJob();
      eng.slotTitles[slot] = job.title;
      eng.onScreen.add(job.title);
      setSlotJobs((prev) => {
        const next = [...prev];
        next[slot] = job;
        return next;
      });
    }

    function frame(now: number) {
      if (cancelled) return;
      if (eng.lastTime === null) eng.lastTime = now;
      const dt = Math.min(now - eng.lastTime, 50); // hidden tab just freezes
      eng.lastTime = now;
      if (!eng.paused) eng.elapsed += dt;

      const base = eng.elapsed / ORBIT_DURATION;
      for (let i = 0; i < VISIBLE_CARDS; i++) {
        const p = (base + i / VISIBLE_CARDS) % 1;
        if (p < eng.prevP[i]) swap(i); // wrapped past the invisible point
        eng.prevP[i] = p;
        const el = wrapperRefs.current[i];
        if (el) {
          const { transform, opacity } = arcStyle(p);
          el.style.transform = transform;
          el.style.opacity = String(opacity);
        }
      }
      raf = requestAnimationFrame(frame);
    }

    fetch("/jobs.json")
      .then((r) => r.json())
      .then((jobs: Job[]) => {
        if (cancelled || !Array.isArray(jobs) || jobs.length === 0) return;
        eng.playlist = [...jobs].sort(() => 0.5 - Math.random());
        eng.nextIndex = 0;
        eng.onScreen.clear();
        const initial: Job[] = [];
        for (let i = 0; i < VISIBLE_CARDS; i++) {
          const job = pickNextJob();
          eng.slotTitles[i] = job.title;
          eng.onScreen.add(job.title);
          initial.push(job);
        }
        setSlotJobs(initial);
        raf = requestAnimationFrame(frame);
      })
      .catch((err) => console.error("Error loading jobs:", err));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      id="orbit-container"
      className="absolute left-1/2 w-0 h-0 z-10 pointer-events-none"
      style={{ bottom: "-70vh" }}
      onMouseOver={() => {
        engine.current.paused = true;
      }}
      onMouseOut={() => {
        engine.current.paused = false;
      }}
    >
      {slotJobs.map((job, i) => (
        <div
          key={i}
          ref={(el) => {
            wrapperRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          {job && (
            <button
              className={`${job.colorClass} rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-[1.05] transition-transform duration-300 group border border-white/40 shadow-sm focus:outline-none focus:ring-2 ${job.ringColor} pointer-events-auto orbit-float w-36 h-32`}
              style={{ animationDelay: `${(i % 4) * 0.5}s` }}
            >
              <div
                className={`w-10 h-10 rounded-full ${job.iconBg} flex items-center justify-center ${job.iconColor}`}
              >
                <span className="material-symbols-outlined fill-icon">
                  {job.icon}
                </span>
              </div>
              <h3
                className={`font-body-md text-sm font-semibold text-on-background ${job.hoverColor} transition-colors text-center`}
              >
                {job.title}
              </h3>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
