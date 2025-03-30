class TypingAnimation {
    constructor() {
        this.texts = document.querySelectorAll('.typing-text');
        this.currentIndex = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.typingSpeed = 50; // milliseconds per character
        this.delayBetweenTexts = 500; // milliseconds between different text elements
    }

    async start() {
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
            const originalText = text.textContent;
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize and start the animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingAnimation = new TypingAnimation();
    typingAnimation.start();
}); 