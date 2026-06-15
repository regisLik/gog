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

        const ORBIT_DURATION = 40000; // ms for one full orbit
        const VISIBLE_CARDS = 8;      // number of cards on screen at the same time

        // Shuffled play order. We always walk forward through this list, so the
        // jobs cycle in a stable order rather than jumping around at random.
        const playlist = [...jobs].sort(() => 0.5 - Math.random());
        let nextIndex = 0;

        // Titles currently displayed, so the same job is never on screen twice.
        const onScreen = new Set();

        function pickNextJob() {
            for (let i = 0; i < playlist.length; i++) {
                const job = playlist[nextIndex % playlist.length];
                nextIndex++;
                if (!onScreen.has(job.title)) return job;
            }
            return playlist[nextIndex++ % playlist.length];
        }

        function buildButton(job) {
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

        const lerp = (a, b, t) => a + (b - a) * t;

        // Position/opacity for a card at progress p (0..1). Same arc as the old CSS
        // keyframes, but computed in JS so a card's position is purely a function of
        // the shared clock — cards can never drift apart, stack, or burst-respawn.
        function applyArc(el, p) {
            let rotate, scale, opacity;
            if (p < 0.1) {
                const t = p / 0.1;
                rotate = lerp(-45, -36, t); scale = lerp(0.5, 1, t); opacity = t;
            } else if (p < 0.9) {
                rotate = lerp(-36, 36, (p - 0.1) / 0.8); scale = 1; opacity = 1;
            } else {
                const t = (p - 0.9) / 0.1;
                rotate = lerp(36, 45, t); scale = lerp(1, 0.5, t); opacity = 1 - t;
            }
            el.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) translateY(-120vh) scale(${scale})`;
            el.style.opacity = opacity;
        }

        // 8 permanent slots, each at a FIXED phase offset along the orbit.
        const slots = [];
        orbitContainer.innerHTML = '';
        for (let i = 0; i < VISIBLE_CARDS; i++) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.willChange = 'transform, opacity';

            const job = pickNextJob();
            onScreen.add(job.title);
            wrapper.appendChild(buildButton(job));
            orbitContainer.appendChild(wrapper);

            const offset = i / VISIBLE_CARDS;
            slots.push({ el: wrapper, offset, title: job.title, prevP: offset });
        }

        // When a slot wraps past the end of the arc (invisible point), swap in a
        // brand new card with the next job — never rewrites a visible card.
        function swapJob(slot) {
            onScreen.delete(slot.title);
            const job = pickNextJob();
            slot.title = job.title;
            onScreen.add(job.title);
            slot.el.replaceChildren(buildButton(job));
        }

        // Pause the orbit on hover (events bubble up from the buttons).
        let paused = false;
        orbitContainer.addEventListener('mouseover', () => { paused = true; });
        orbitContainer.addEventListener('mouseout', () => { paused = false; });

        // Single rAF clock drives every slot. A hidden tab simply doesn't tick, and
        // the clamped delta means it resumes exactly where it froze — no jump, no
        // desync, ever.
        let elapsed = 0;
        let lastTime = null;

        function frame(now) {
            if (lastTime === null) lastTime = now;
            const dt = Math.min(now - lastTime, 50);
            lastTime = now;
            if (!paused) elapsed += dt;

            const base = elapsed / ORBIT_DURATION;
            for (const slot of slots) {
                const p = (base + slot.offset) % 1;
                if (p < slot.prevP) swapJob(slot); // wrapped to a new turn
                slot.prevP = p;
                applyArc(slot.el, p);
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
});
