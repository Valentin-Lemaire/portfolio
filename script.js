// Translation system
let translations = {};
let currentLanguage = 'en';

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch(`json/${currentLanguage}.json`);
        translations = await response.json();
        window.translations = translations; // Make translations available globally
        applyTranslations();
        window.translationsLoaded = true;
    } catch (error) {
        console.error('Error loading translations:', error);
        window.translationsLoaded = true; // Set flag even on error to prevent infinite waiting
    }
}

// Apply translations to all elements with data-translate attribute
function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const value = getNestedValue(translations, key);
        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.innerHTML = value;
            }
        }
    });
}

// Helper function to get nested object values using dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// Cache DOM elements
const modal = document.getElementById('projectModal');
const projectCards = document.querySelectorAll('.project-card');
const modalCloseBtn = modal.querySelector('.modal-close');
const modalTitle = modal.querySelector('.modal-details h2');
const modalDescription = modal.querySelector('.modal-description');
const modalTech = modal.querySelector('.modal-tech');
const modalHowToList = modal.querySelector('.modal-how-to ul');
const modalLinks = modal.querySelector('.modal-links');

// Function to update modal content using JSON data
function updateModalContent(projectId) {
    const card = document.querySelector(`[data-project="${projectId}"]`);
    
    // Get project data from translations
    const projectKey = getProjectKey(projectId);
    const projectData = getNestedValue(translations, `modal.${projectKey}`);
    
    if (!projectData) {
        console.error(`Project data not found for: ${projectId}`);
        return;
    }
    
    // Update modal content
    modalTitle.innerHTML = projectData.title;
    modalDescription.innerHTML = projectData.description;
    
    // Update tech stack
    const techStack = card.querySelector('.project-tech').cloneNode(true);
    modalTech.innerHTML = '';
    modalTech.append(techStack);
    
    // Update how to use
    modalHowToList.innerHTML = projectData.howToUse.map(instruction => `<li>${instruction}</li>`).join('');
    
    // Update links
    const links = card.querySelector('.project-links').cloneNode(true);
    modalLinks.innerHTML = '';
    modalLinks.append(links);

    // Update ARIA attributes
    modal.setAttribute('aria-labelledby', `modal-title-${projectId}`);
    modalTitle.id = `modal-title-${projectId}`;
}

// Helper function to map project IDs to JSON keys
function getProjectKey(projectId) {
    const keyMap = {
        'portfolio': 'portfolio',
        'snake': 'snake',
        'double-pendulum': 'doublePendulum',
        'boids': 'boids',
        'game-of-life': 'gameOfLife',
        'asteroids': 'asteroids',
        'ai-image-gallery': 'aiImageGallery',
        'star-trail-simulation': 'starTrailSimulation'
    };
    return keyMap[projectId] || projectId;
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
}); 