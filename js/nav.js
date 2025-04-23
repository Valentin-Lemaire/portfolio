document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const langSwitch = document.querySelector('.lang-switch');
    const langText = document.querySelector('.lang-text');
    const sunIcon = themeSwitch.querySelector('.sun-icon');
    const moonIcon = themeSwitch.querySelector('.moon-icon');

    // Theme switching
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            // Toggle icons
            if (sunIcon.style.display !== 'none') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
            
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            
            // Reverse primary and secondary colors
            const root = document.documentElement;
            const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
            const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
            
            root.style.setProperty('--primary-color', secondaryColor);
            root.style.setProperty('--secondary-color', primaryColor);
            
            // Save preferences
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            localStorage.setItem('primaryColor', secondaryColor);
            localStorage.setItem('secondaryColor', primaryColor);
        });
    }

    // Language switching
    if (langSwitch && langText) {
        langSwitch.addEventListener('click', () => {
            const isFrench = langText.textContent === 'FR';
            langText.textContent = isFrench ? 'EN' : 'FR';
            
            // Save preference
            localStorage.setItem('language', isFrench ? 'en' : 'fr');
        });
    }

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedSecondaryColor = localStorage.getItem('secondaryColor');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Set initial icon state based on saved theme
        if (savedTheme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    if (savedLang && langText) {
        langText.textContent = savedLang === 'fr' ? 'FR' : 'EN';
    }

    // Restore color preferences if they exist
    if (savedPrimaryColor && savedSecondaryColor) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', savedPrimaryColor);
        root.style.setProperty('--secondary-color', savedSecondaryColor);
    }
}); 