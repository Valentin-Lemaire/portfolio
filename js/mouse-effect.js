document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cursor = document.createElement('div');
    const cursor2 = document.createElement('div');
    cursor.classList.add('cursor');
    cursor2.classList.add('cursor2');
    document.body.appendChild(cursor);
    document.body.appendChild(cursor2);

    // Initial state (hidden until first movement)
    const useGSAP = typeof window.gsap !== 'undefined';

    const addGlobalHideListeners = (hideFn) => {
        document.addEventListener('mouseleave', hideFn);
        window.addEventListener('blur', hideFn);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) hideFn();
        });
        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget && !e.toElement) hideFn();
        });
        document.addEventListener('pointerleave', hideFn);
    };

    if (useGSAP) {
        gsap.set([cursor, cursor2], {
            xPercent: -50,
            yPercent: -50,
            transformOrigin: '50% 50%',
            autoAlpha: 0,
            scale: 1,
            zIndex: 2147483647
        });

        const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
        const setCursorY = gsap.quickSetter(cursor, 'y', 'px');
        const followDuration = prefersReducedMotion ? 0 : 0.3;
        const followEase = prefersReducedMotion ? 'none' : 'power2.out';
        const followX = gsap.quickTo(cursor2, 'x', { duration: followDuration, ease: followEase });
        const followY = gsap.quickTo(cursor2, 'y', { duration: followDuration, ease: followEase });

        let shown = false;
        const show = () => {
            if (!shown) {
                shown = true;
                gsap.to([cursor, cursor2], { autoAlpha: 1, duration: 0.12, ease: 'power2.out' });
            }
        };
        const hide = () => {
            if (shown) {
                shown = false;
                gsap.to([cursor, cursor2], { autoAlpha: 0, duration: 0.12, ease: 'power2.out' });
            }
        };

        const moveHandler = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            setCursorX(x);
            setCursorY(y);
            followX(x);
            followY(y);
            show();
        };
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('pointermove', moveHandler);

        addGlobalHideListeners(hide);

        // Click effect on follower ring
        document.addEventListener('mousedown', () => {
            gsap.to(cursor2, { scale: prefersReducedMotion ? 1 : 0.5, duration: prefersReducedMotion ? 0 : 0.08, ease: 'power2.out' });
        });
        document.addEventListener('mouseup', () => {
            gsap.to(cursor2, { scale: 1, duration: prefersReducedMotion ? 0 : 0.16, ease: 'power2.out' });
        });

        // Hover effect with overlap-safe counter
        let hoverCount = 0;
        const hoverIn = () => {
            hoverCount += 1;
            if (hoverCount === 1) {
                gsap.to(cursor, { scale: prefersReducedMotion ? 1.25 : 2, duration: prefersReducedMotion ? 0 : 0.16, ease: 'power2.out' });
            }
        };
        const hoverOut = () => {
            hoverCount = Math.max(0, hoverCount - 1);
            if (hoverCount === 0) {
                gsap.to(cursor, { scale: 1, duration: prefersReducedMotion ? 0 : 0.16, ease: 'power2.out' });
            }
        };

        function addHoverEffect(element) {
            element.addEventListener('mouseenter', hoverIn);
            element.addEventListener('mouseleave', hoverOut);
        }

        // Attach to initial interactive elements
        const initialInteractiveElements = document.querySelectorAll('a, button, .project-card');
        initialInteractiveElements.forEach(addHoverEffect);

        // Observe modal for dynamically added interactive elements
        const modal = document.getElementById('projectModal');
        if (modal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const candidates = [];
                                if (node.matches && (node.matches('a') || node.matches('button') || node.matches('.project-card'))) {
                                    candidates.push(node);
                                }
                                if (node.querySelectorAll) {
                                    candidates.push(...node.querySelectorAll('a, button, .project-card'));
                                }
                                candidates.forEach(addHoverEffect);
                            }
                        });
                    }
                    if (mutation.type === 'attributes' && mutation.target.classList && mutation.target.classList.contains('active')) {
                        const modalLinks = modal.querySelectorAll('a, button, .project-card');
                        modalLinks.forEach(addHoverEffect);
                    }
                });
            });
            observer.observe(modal, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    } else {
        // Fallback: no GSAP loaded
        cursor.style.position = 'fixed';
        cursor2.style.position = 'fixed';
        cursor.style.transform = 'translate(-50%, -50%)';
        cursor2.style.transform = 'translate(-50%, -50%)';
        cursor.style.zIndex = '2147483647';
        cursor2.style.zIndex = '2147483647';
        cursor.style.opacity = '0';
        cursor2.style.opacity = '0';

        let shown = false;
        const show = () => {
            if (!shown) {
                shown = true;
                cursor.style.opacity = '1';
                cursor2.style.opacity = '1';
            }
        };
        const hide = () => {
            if (shown) {
                shown = false;
                cursor.style.opacity = '0';
                cursor2.style.opacity = '0';
            }
        };

        let mouseX = 0;
        let mouseY = 0;
        let fx = 0;
        let fy = 0;

        const move = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            show();
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('pointermove', move);

        addGlobalHideListeners(hide);

        const loop = () => {
            const delay = prefersReducedMotion ? 1 : 0.2;
            fx += (mouseX - fx) * delay;
            fy += (mouseY - fy) * delay;
            cursor2.style.left = fx + 'px';
            cursor2.style.top = fy + 'px';
            requestAnimationFrame(loop);
        };
        loop();
    }
}); 