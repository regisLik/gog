import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import KeyFigures from "@/components/KeyFigures";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  return (
    <>
      <main className="grow flex flex-col w-full z-10">
        <Hero />
        <AboutSection />
        <KeyFigures />
      </main>
      <MobileNav />

      {/* Decorative floating elements */}
      <div
        className="fixed top-1/4 right-1/4 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="fixed bottom-1/4 left-1/4 w-48 h-48 bg-tertiary-container/20 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "2s" }}
      />
    </>
  );
}
