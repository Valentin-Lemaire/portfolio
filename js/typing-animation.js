class TypingAnimation {
    constructor() {
        // Check if device is mobile or has low performance
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasLowPerformance = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // If mobile or prefers reduced motion, show all text immediately and return
        if (isMobile || hasLowPerformance) {
            document.querySelectorAll('.typing-text').forEach(text => {
                text.style.opacity = '1';
                text.style.display = 'inline-block';
            });
            return;
        }

        this.texts = document.querySelectorAll('.typing-text');
        this.currentIndex = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.typingSpeed = 50; // milliseconds per character
        this.delayBetweenTexts = 500; // milliseconds between different text elements
    }

    async start() {
        // Wait for translations to be loaded
        await this.waitForTranslations();

        // Initially hide all elements
        this.texts.forEach(text => {
            text.style.opacity = '0';
            text.style.display = 'inline-block';
        });

        // Get text elements and buttons separately
        const textElements = Array.from(this.texts).filter(text => !text.classList.contains('cta-button'));
        const buttons = Array.from(this.texts).filter(text => text.classList.contains('cta-button'));

        // Start typing each text element
        for (let i = 0; i < textElements.length; i++) {
            const text = textElements[i];
            const translateKey = text.getAttribute('data-translate');
            const originalText = this.getTextFromTranslations(translateKey) || text.textContent || text.innerText;
            
            text.textContent = '';
            text.style.opacity = '1';

            // Type each character
            for (let char of originalText) {
                text.textContent += char;
                await this.sleep(this.typingSpeed);
            }

            // Wait before starting the next text
            if (i < textElements.length - 1) {
                await this.sleep(this.delayBetweenTexts);
            }
        }

        // After all text is typed, show buttons instantly
        buttons.forEach(button => {
            button.style.opacity = '1';
        });
    }

    // Get text from translations object
    getTextFromTranslations(key) {
        if (!window.translations || !key) {
            return null;
        }
        
        return key.split('.').reduce((current, k) => {
            return current && current[k] !== undefined ? current[k] : null;
        }, window.translations);
    }

    // Wait for translations to be loaded
    async waitForTranslations() {
        // Check if translations are already loaded
        if (window.translationsLoaded) {
            return;
        }

        // Wait for translations to be loaded (max 5 seconds)
        let attempts = 0;
        const maxAttempts = 100; // 5 seconds with 50ms intervals
        
        while (!window.translationsLoaded && attempts < maxAttempts) {
            await this.sleep(50);
            attempts++;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize and start the animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingAnimation = new TypingAnimation();
    if (typingAnimation.texts) { // Only start if not mobile
        typingAnimation.start();
    }
}); 