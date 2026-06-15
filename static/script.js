document.addEventListener('DOMContentLoaded', () => {
    loadOrbitingJobs();
    setupScrollReveal();
    setupStatCards();

    // Slide each "chiffres clés" card in from its own side as it enters the
    // viewport (left cards from the left, right cards from the right), and replay
    // it whenever the card scrolls back into view.
    function setupStatCards() {
        const cards = document.querySelectorAll('.stat-card');
        if (cards.length === 0) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            cards.forEach(card => card.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.2 });

        cards.forEach(card => observer.observe(card));
    }

    // Reveal the "À propos de JOG" phrases one after another as the section is
    // scrolled into view (fade in + slight upward motion, staggered).
    function setupScrollReveal() {
        const section = document.getElementById('about-jog');
        if (!section) return;

        const lines = section.querySelectorAll('.reveal-line');
        if (lines.length === 0) return;

        // Respect users who prefer reduced motion: show everything at once.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            lines.forEach(line => line.classList.add('is-visible'));
            return;
        }

        // Each line starts a little later than the previous one (the cascade).
        lines.forEach((line, i) => {
            line.style.transitionDelay = `${i * 0.15}s`;
        });

        // Replay the cascade every time the section enters the viewport: reveal
        // on enter, reset on leave so scrolling back in plays it again.
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                lines.forEach(line => line.classList.toggle('is-visible', entry.isIntersecting));
            });
        }, { threshold: 0.25 });

        observer.observe(section);
    }

    async function loadOrbitingJobs() {
        const orbitContainer = document.getElementById('orbit-container');
        if (!orbitContainer) return;

        let jobs;
        try {
            const response = await fetch('/static/jobs.json');
            jobs = await response.json();
        } catch (error) {
            console.error('Error loading jobs:', error);
            return;
        }
        if (!Array.isArray(jobs) || jobs.length === 0) return;

        const ORBIT_DURATION = 40; // seconds for one card to cross the whole arc
        const VISIBLE_CARDS = 8;   // number of cards on screen at the same time

        // Shuffled play order. We always walk forward through this list, so the
        // jobs cycle in a stable order rather than jumping around at random.
        const playlist = [...jobs].sort(() => 0.5 - Math.random());
        let nextIndex = 0;

        // Titles currently displayed, so the same job is never on screen twice.
        const onScreen = new Set();

        function pickNextJob() {
            // Advance through the playlist until we hit a job that isn't already
            // visible. With far more jobs than visible cards this always succeeds.
            for (let i = 0; i < playlist.length; i++) {
                const job = playlist[nextIndex % playlist.length];
                nextIndex++;
                if (!onScreen.has(job.title)) return job;
            }
            return playlist[nextIndex++ % playlist.length];
        }

        function buildCard(job) {
            const floatDelay = Math.random() * 2;
            const button = document.createElement('button');
            button.className = `${job.colorClass} rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-[1.05] transition-transform duration-300 group border border-white/40 shadow-sm focus:outline-none focus:ring-2 ${job.ringColor} pointer-events-auto orbit-float w-36 h-32`;
            button.style.animationDelay = `${floatDelay}s`;
            button.innerHTML = `
                <div class="w-10 h-10 rounded-full ${job.iconBg} flex items-center justify-center ${job.iconColor}">
                    <span class="material-symbols-outlined fill-icon">${job.icon}</span>
                </div>
                <h3 class="font-body-md text-sm font-semibold text-on-background ${job.hoverColor} transition-colors text-center">${job.title}</h3>
            `;
            return button;
        }

        // Each card is its OWN element. It crosses the arc exactly once, then it is
        // removed and a brand new card (with the next job) is launched in its place
        // — a real new block, never a rewrite of a card that's already visible.
        // `startProgress` (0..1) lets the first cards start mid-arc so the carousel
        // looks full immediately instead of filling up over the first 40 seconds.
        function launchCard(startProgress) {
            const job = pickNextJob();
            onScreen.add(job.title);

            const card = document.createElement('div');
            card.className = 'absolute arc-card-wrapper';
            card.style.animationIterationCount = '1';
            card.style.animationFillMode = 'forwards'; // hold the final (invisible) frame, no flash before removal
            card.style.animationDelay = `${-startProgress * ORBIT_DURATION}s`;
            card.appendChild(buildCard(job));

            card.addEventListener('animationend', (e) => {
                // The inner float loops forever and never "ends"; only react to the
                // orbit animation completing. (animationend bubbles up from children.)
                if (e.animationName !== 'arcOrbitAnim') return;
                onScreen.delete(job.title);
                card.remove();
                launchCard(0); // its replacement starts a fresh full turn from the left
            });

            orbitContainer.appendChild(card);
        }

        orbitContainer.innerHTML = '';
        // Seed the arc full: spread the first cards evenly along it.
        for (let i = 0; i < VISIBLE_CARDS; i++) {
            launchCard(i / VISIBLE_CARDS);
        }

        // Freeze the orbit while the tab is hidden, then resume on return. This
        // keeps the animations from advancing (and firing a burst of end events) in
        // the background, which is what used to leave the cards stacked on return.
        document.addEventListener('visibilitychange', () => {
            orbitContainer.classList.toggle('orbit-paused', document.hidden);
        });
    }
});
