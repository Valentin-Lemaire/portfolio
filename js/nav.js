document.addEventListener('DOMContentLoaded', () => {
    // Theme switching functionality
    const themeSwitch = document.querySelector('.theme-switch');
    const sunIcon = themeSwitch.querySelector('.sun-icon');
    const moonIcon = themeSwitch.querySelector('.moon-icon');

    // Language switching functionality
    const langSwitch = document.querySelector('.lang-switch');

    // Theme management class
    class ThemeManager {
        constructor() {
            // Set initial theme to dark if no saved preference
            if (!localStorage.getItem('theme')) {
                localStorage.setItem('theme', 'dark');
            }
            this.theme = localStorage.getItem('theme');
            this.applyTheme();
        }

        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            localStorage.setItem('theme', this.theme);
        }

        applyTheme() {
            // Update HTML attribute
            document.documentElement.setAttribute('data-theme', this.theme);
            
            // Update icons - show sun in dark mode, moon in light mode
            const isDark = this.theme === 'dark';
            sunIcon.style.display = isDark ? 'block' : 'none';
            moonIcon.style.display = isDark ? 'none' : 'block';
            
            // Update colors
            const root = document.documentElement;
            if (this.theme === 'dark') {
                // Dark mode: dark background, light text
                root.style.setProperty('--primary-color', '#0D0D0D');
                root.style.setProperty('--secondary-color', '#E0E0E0');
            } else {
                // Light mode: light background, dark text
                root.style.setProperty('--primary-color', '#E0E0E0');
                root.style.setProperty('--secondary-color', '#0D0D0D');
            }
            
            // Save color preferences
            localStorage.setItem('primaryColor', getComputedStyle(root).getPropertyValue('--primary-color').trim());
            localStorage.setItem('secondaryColor', getComputedStyle(root).getPropertyValue('--secondary-color').trim());
        }
    }

    // Initialize theme manager
    const themeManager = new ThemeManager();

    // Add click event listener
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => themeManager.toggleTheme());
    }

    // Language toggle handler
    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            const getLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
            const newLang = getLang === 'en' ? 'fr' : 'en';
            if (typeof window.setLanguage === 'function') {
                window.setLanguage(newLang);
            }
        });
    }
}); 