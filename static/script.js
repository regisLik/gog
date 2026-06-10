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


});
