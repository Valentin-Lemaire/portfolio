document.addEventListener('DOMContentLoaded', () => {
	// Respect reduced motion and mobile devices
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Helper to get text from translations object
	function getTextFromTranslations(key) {
		if (!window.translations || !key) return null;
		return key.split('.').reduce((current, k) => (current && current[k] !== undefined ? current[k] : null), window.translations);
	}

	// Wait for translations to be loaded (max ~5s)
	async function waitForTranslations() {
		if (window.translationsLoaded) return;
		let attempts = 0;
		const maxAttempts = 100; // 100 * 50ms = 5s
		while (!window.translationsLoaded && attempts < maxAttempts) {
			await new Promise(r => setTimeout(r, 50));
			attempts++;
		}
	}

	// Initialize GSAP TextPlugin (if available)
	if (window.gsap && window.TextPlugin) {
		gsap.registerPlugin(TextPlugin);
	}

	(async () => {
		// Ensure translations are ready first
		await waitForTranslations();

		const typingEls = document.querySelectorAll('.typing-text');

		// Fallback path for mobile or reduced motion: show instantly
		if (isMobile || prefersReducedMotion || !window.gsap || !window.TextPlugin) {
			typingEls.forEach(el => {
				const key = el.getAttribute('data-translate');
				const txt = getTextFromTranslations(key) || el.textContent || '';
				el.style.opacity = '1';
				el.style.display = 'inline-block';
				el.textContent = txt;
			});
			return;
		}

		// Target elements
		const titleEl = document.querySelector('h1 .typing-text[data-translate="header.title"]');
		const subtitleEl = document.querySelector('.subtitle .typing-text[data-translate="header.subtitle"]');
		const ctaButtons = Array.from(document.querySelectorAll('.header-cta .cta-button.typing-text'));

		// Prepare content
		const titleText = titleEl ? (getTextFromTranslations(titleEl.getAttribute('data-translate')) || titleEl.textContent || '') : '';
		const subtitleText = subtitleEl ? (getTextFromTranslations(subtitleEl.getAttribute('data-translate')) || subtitleEl.textContent || '') : '';

		// Set initial states
		if (titleEl) {
			titleEl.textContent = '';
			titleEl.style.opacity = '1';
			titleEl.style.display = 'inline-block';
		}
		if (subtitleEl) {
			subtitleEl.textContent = '';
			subtitleEl.style.opacity = '1';
			subtitleEl.style.display = 'inline-block';
		}
		ctaButtons.forEach(btn => {
			const key = btn.getAttribute('data-translate');
			const txt = getTextFromTranslations(key) || btn.textContent || '';
			btn.textContent = txt;
			btn.style.opacity = '0';
		});

		// Build GSAP timeline
		const tl = gsap.timeline({ defaults: { ease: 'linear' } });

		if (titleEl) {
			tl.to(titleEl, { duration: 1.2, text: titleText });
		}
		if (subtitleEl) {
			tl.to(subtitleEl, { duration: 1.4, text: subtitleText }, '>+0.1');
		}

		if (ctaButtons.length) {
			tl.to(ctaButtons, { opacity: 1, duration: 0, stagger: 0.15 }, '>-0.1');
		}
	})();
}); 