document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const langSwitch = document.querySelector('.lang-switch');
    const langText = document.querySelector('.lang-text');
    const sunIcon = themeSwitch.querySelector('.sun-icon');
    const moonIcon = themeSwitch.querySelector('.moon-icon');

    // Theme switching
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            // First toggle theme
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Then update icons based on new theme
            // Show sun icon when in dark mode, moon icon when in light mode
            const isNewThemeDark = newTheme === 'dark';
            sunIcon.style.display = isNewThemeDark ? 'block' : 'none';
            moonIcon.style.display = isNewThemeDark ? 'none' : 'block';
            
            // Reverse primary and secondary colors
            const root = document.documentElement;
            const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
            const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
            
            root.style.setProperty('--primary-color', secondaryColor);
            root.style.setProperty('--secondary-color', primaryColor);
            
            // Save preferences
            localStorage.setItem('theme', newTheme);
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
        const isDark = savedTheme === 'dark';
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
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