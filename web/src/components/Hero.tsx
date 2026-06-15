import OrbitingJobs from "./OrbitingJobs";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center w-full px-4 md:px-6 pt-24 pb-32 md:pb-24 min-h-screen">
      {/* Ambient background glow */}
      <div className="absolute inset-0 glow-bg z-[-1] pointer-events-none" />

      {/* Central area wrapper */}
      <div className="w-full flex flex-col items-center justify-center mt-auto relative mb-12">
        {/* Central search hero */}
        <div className="w-full max-w-2xl flex flex-col items-center text-center z-20 relative">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-8 font-semibold tracking-tight">
            Posez vos questions, Régis !
          </h1>
          <div className="w-full relative group">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-xl group-focus-within:bg-primary-container/30 transition-all duration-500" />
            <div className="relative flex items-center bg-surface-container-lowest border border-surface-variant rounded-full px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none rounded-full flex-shrink-0">
                <span className="material-symbols-outlined">add</span>
              </button>
              <input
                aria-label="Posez votre question sur votre carrière"
                className="flex-grow bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-background placeholder-on-surface-variant/60 px-2 min-w-0"
                placeholder="Demander à Gemini"
                type="text"
              />
              <div className="flex items-center gap-2 flex-shrink-0 border-l border-surface-variant pl-3 ml-2">
                <button className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded-md focus:outline-none focus:bg-surface-variant/50">
                  Flash-Lite
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none rounded-full">
                  <span className="material-symbols-outlined">mic</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting quick actions */}
        <OrbitingJobs />
      </div>
    </section>
  );
}
