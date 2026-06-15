export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center h-16 px-4 bg-surface/80 backdrop-blur-xl">
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform p-2 rounded-lg"
        href="#"
      >
        <span className="material-symbols-outlined mb-1">home</span>
        <span className="font-label-sm text-label-sm">Accueil</span>
      </a>
      <a
        className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-95 transition-transform"
        href="#"
      >
        <span className="material-symbols-outlined fill-icon mb-1">
          chat_bubble
        </span>
        <span className="font-label-sm text-label-sm font-semibold">
          Questions
        </span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform p-2 rounded-lg"
        href="#"
      >
        <span className="material-symbols-outlined mb-1">work</span>
        <span className="font-label-sm text-label-sm">Métiers</span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform p-2 rounded-lg"
        href="#"
      >
        <span className="material-symbols-outlined mb-1">person</span>
        <span className="font-label-sm text-label-sm">Profil</span>
      </a>
    </nav>
  );
}
