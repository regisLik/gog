document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('interactive-btn');
    const greeting = document.getElementById('greeting');
    
    const greetings = [
        "Bonjour !",
        "Hello !",
        "Hola !",
        "Ciao !",
        "Guten Tag !",
        "Namaste !"
    ];
    
    let currentIndex = 0;

    btn.addEventListener('click', () => {
        // Change greeting
        currentIndex = (currentIndex + 1) % greetings.length;
        
        // Remove and add class to re-trigger animation
        greeting.classList.remove('pop');
        void greeting.offsetWidth; // Trigger reflow
        
        greeting.textContent = greetings[currentIndex];
        greeting.classList.add('pop');
    });
});
