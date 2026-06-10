document.addEventListener('DOMContentLoaded', () => {
    const stepCards = document.querySelectorAll('.step-card');
    const mockups = {
        "1": document.getElementById('mockup-1'),
        "2": document.getElementById('mockup-2'),
        "3": document.getElementById('mockup-3')
    };

    if (stepCards.length === 0) return;

    const activeCardClasses = ['border-black', 'shadow-sm'];
    const inactiveCardClasses = ['border-transparent', 'group'];

    const activeTitleClasses = ['text-black'];
    const inactiveTitleClasses = ['text-[#9ca3af]', 'group-hover:text-[#6b7280]'];

    const activeDescClasses = ['text-[#4b5563]'];
    const inactiveDescClasses = ['text-[#9ca3af]', 'group-hover:text-[#6b7280]'];

    stepCards.forEach(card => {
        card.addEventListener('click', () => {
            const stepIndex = card.getAttribute('data-step');
            
            // Show corresponding mockup, hide others
            Object.keys(mockups).forEach(key => {
                const mockup = mockups[key];
                if (!mockup) return;
                
                if (key === stepIndex) {
                    // Show mockup
                    mockup.classList.remove('hidden');
                    // Small delay to allow display:block to apply before animating opacity
                    setTimeout(() => {
                        mockup.classList.remove('scale-95', 'opacity-0');
                        mockup.classList.add('scale-100', 'opacity-100');
                    }, 10);
                } else {
                    // Hide mockup
                    mockup.classList.remove('scale-100', 'opacity-100');
                    mockup.classList.add('scale-95', 'opacity-0');
                    // Wait for transition before hiding
                    setTimeout(() => {
                        // Only add hidden if it's still not the active step (prevents flicker if clicked quickly)
                        if (!mockup.classList.contains('scale-100')) {
                            mockup.classList.add('hidden');
                        }
                    }, 300);
                }
            });

            // Reset all cards to inactive
            stepCards.forEach(c => {
                c.classList.remove(...activeCardClasses);
                c.classList.add(...inactiveCardClasses);
                
                const title = c.querySelector('.step-title');
                if (title) {
                    title.classList.remove(...activeTitleClasses);
                    title.classList.add(...inactiveTitleClasses);
                }
                
                const desc = c.querySelector('.step-desc');
                if (desc) {
                    desc.classList.remove(...activeDescClasses);
                    desc.classList.add(...inactiveDescClasses);
                }
            });

            // Set clicked card to active
            card.classList.remove(...inactiveCardClasses);
            card.classList.add(...activeCardClasses);

            const title = card.querySelector('.step-title');
            if (title) {
                title.classList.remove(...inactiveTitleClasses);
                title.classList.add(...activeTitleClasses);
            }

            const desc = card.querySelector('.step-desc');
            if (desc) {
                desc.classList.remove(...inactiveDescClasses);
                desc.classList.add(...activeDescClasses);
            }
        });
    });

    // --- Arc de Metier (Orbiting Cards) Logic ---
    const wheelCardsData = [
        { id: 1, title: 'Développeur Web', colorClass: 'card-blue', icon: 'code' },
        { id: 2, title: 'Data Analyst', colorClass: 'card-purple', icon: 'analytics' },
        { id: 3, title: 'Designer UX/UI', colorClass: 'card-pink', icon: 'design_services' },
        { id: 4, title: 'Chef de Projet', colorClass: 'card-orange', icon: 'assignment' },
        { id: 5, title: 'Cybersécurité', colorClass: 'card-green', icon: 'security' },
        { id: 6, title: 'Product Manager', colorClass: 'card-blue', icon: 'view_kanban' }
    ];

    const orbitContainer = document.getElementById('orbit-container');
    if (orbitContainer) {
        function renderOrbit() {
            orbitContainer.innerHTML = ''; // clear on resize
            const totalCards = wheelCardsData.length;
            
            // Adjust radius dynamically so the arc sits nicely in the viewport
            // The center is at bottom: -50vh, so we need a radius of ~75vh to reach the middle of the screen
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const radius = Math.max(vh * 0.75, vw * 0.4); 
            
            const startAngle = Math.PI * 1.15; // Left side
            const endAngle = Math.PI * 1.85;   // Right side
            const angleStep = (endAngle - startAngle) / (totalCards - 1);

            wheelCardsData.forEach((card, index) => {
                const angle = startAngle + (index * angleStep);
                
                // Calculate position relative to the center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                // Create card element
                const cardEl = document.createElement('div');
                cardEl.className = `absolute transform -translate-x-1/2 -translate-y-1/2 orbit-float wheel-card-dynamic cursor-pointer hover:scale-105 transition-transform duration-300 z-10`;
                cardEl.style.left = `${x}px`;
                cardEl.style.top = `${y}px`;
                // stagger the floating animation
                cardEl.style.animationDelay = `${index * 0.4}s`;

                cardEl.innerHTML = `
                    <div class="glass-card ${card.colorClass} px-4 py-3 rounded-2xl flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface shadow-sm">
                            <span class="material-symbols-outlined text-[20px]">${card.icon}</span>
                        </div>
                        <span class="font-semibold text-sm text-on-surface whitespace-nowrap">${card.title}</span>
                    </div>
                `;

                // Add simple interaction to fill the prompt when clicking a profession
                cardEl.addEventListener('click', () => {
                    const searchInput = document.querySelector('input[type="text"]');
                    if (searchInput) {
                        searchInput.value = `Quelles sont les compétences pour devenir ${card.title.toLowerCase()} ?`;
                        searchInput.focus();
                    }
                });

                orbitContainer.appendChild(cardEl);
            });
        }
        
        renderOrbit();
        window.addEventListener('resize', () => {
            // Re-render on resize to maintain responsive radius
            clearTimeout(window.orbitResizeTimer);
            window.orbitResizeTimer = setTimeout(renderOrbit, 200);
        });
    }
});
