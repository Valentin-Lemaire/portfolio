// Project details data
const projectDetails = {
    portfolio: {
        title: "Portfolio Website",
        description: "I made my own portfolio to showcase my projects and skills. (By the way, if you have any feedback, please let me know!)",
        howToUse: [
            "Click on any project card to see more details",
            "Use the navigation buttons to explore different sections",
            "Click on project links to visit GitHub repositories or live demos",
            "Contact me through the provided email or social links"
        ]
    },
    snake: {
        title: "Snake AI",
        description: "A classic Snake game implementation with an AI player trained using reinforcement learning. The AI learns to navigate the game board and collect food while avoiding collisions. (I have for project to soon remake an AI to play this using Pytorch with a neural network.)",
        howToUse: [
            "Click on the GitHub link to see the code",
            "Run the game using Python and Pygame",
            "Watch the AI play automatically or play yourself",
            "View the training process and AI performance metrics"
        ]
    },
    "double-pendulum": {
        title: "Double Pendulum Simulation",
        description: "A physics simulation of a double pendulum system, demonstrating chaotic motion and complex dynamics. The simulation accurately models the behavior of coupled oscillators. (Having multiple pendulums running at the same time with a slight offset at the beginning is a good way to see the chaotic motion and is really cool.)",
        howToUse: [
            "Click on the GitHub link to see the code",
            "Run the simulation using Python",
            "Adjust pendulum parameters using the interactive controls",
            "Observe the chaotic motion patterns"
        ]
    },
    boids: {
        title: "Boids Simulation",
        description: "An implementation of <a href='http://www.red3d.com/cwr/boids/' target='_blank' rel='noopener noreferrer'>Craig Reynolds' Boids algorithm</a>, simulating flocking behavior in birds. The simulation demonstrates emergent behavior from simple rules.",
        howToUse: [
            "Open the live demo in your web browser",
            "Watch the boids flock naturally",
            "Adjust flocking parameters using the controls"
        ]
    },
    "game-of-life": {
        title: "Conway's Game of Life",
        description: "An implementation of <a href='https://conwaylife.com/' target='_blank' rel='noopener noreferrer'>Conway's Game of Life</a>, a cellular automaton that demonstrates complex patterns emerging from simple rules.",
        howToUse: [
            "Open the live demo in your web browser",
            "Click on cells to create your initial pattern or use the random button",
            "Use the controls to start/stop the simulation",
            "Adjust the grid size and simulation speed"
        ]
    },
    asteroids: {
        title: "Asteroids Game",
        description: "A recreation of the classic arcade game Asteroids. This project was a project I made in High School to learn Object Oriented Programming in Python. (The code is a bit messy, but it works and I don't see any reason to clean it up.)",
        howToUse: [
            "Click on the GitHub link to see the code",
            "Run the game using Python and Pygame",
            "Use arrow keys to control the ship",
            "Spacebar to shoot asteroids",
            "Try to achieve the highest score",
            "Difficulty increases as you progress"
        ]
    }
};

// Cache DOM elements
const modal = document.getElementById('projectModal');
const projectCards = document.querySelectorAll('.project-card');
const modalCloseBtn = modal.querySelector('.modal-close');
const modalTitle = modal.querySelector('.modal-details h2');
const modalDescription = modal.querySelector('.modal-description');
const modalTech = modal.querySelector('.modal-tech');
const modalHowToList = modal.querySelector('.modal-how-to ul');
const modalLinks = modal.querySelector('.modal-links');

// Function to update modal content
function updateModalContent(projectId) {
    const project = projectDetails[projectId];
    const card = document.querySelector(`[data-project="${projectId}"]`);
    
    // Update modal content
    modalTitle.textContent = project.title;
    modalDescription.innerHTML = project.description;
    
    // Update tech stack
    const techStack = card.querySelector('.project-tech').cloneNode(true);
    modalTech.innerHTML = '';
    modalTech.append(techStack);
    
    // Update how to use
    modalHowToList.innerHTML = project.howToUse.map(instruction => `<li>${instruction}</li>`).join('');
    
    // Update links
    const links = card.querySelector('.project-links').cloneNode(true);
    modalLinks.innerHTML = '';
    modalLinks.append(links);

    // Update ARIA attributes
    modal.setAttribute('aria-labelledby', `modal-title-${projectId}`);
    modalTitle.id = `modal-title-${projectId}`;
}

// Function to open modal
function openModal(projectId) {
    updateModalContent(projectId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus(); // Focus the close button for accessibility
}

// Function to close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking on a link
        if (e.target.closest('.project-links')) {
            return;
        }
        const projectId = card.dataset.project;
        openModal(projectId);
    });
});

// Close modal when clicking the close button
modalCloseBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Handle portfolio live demo link click
modalLinks.addEventListener('click', (e) => {
    const link = e.target.closest('.project-link');
    if (link && link.getAttribute('href') === '#') {
        e.preventDefault();
        closeModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Trap focus within modal when open
modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}); 