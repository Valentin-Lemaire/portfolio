document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    const cursor2 = document.createElement('div');
    cursor.classList.add('cursor');
    cursor2.classList.add('cursor2');
    document.body.appendChild(cursor);
    document.body.appendChild(cursor2);

    let mouseX = 0;
    let mouseY = 0;
    let cursor2X = 0;
    let cursor2Y = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor2.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor2.style.transform = 'translate(-50%, -50%)';
    });

    function animate() {
        const delay = 0.3;
        cursor2X += (mouseX - cursor2X) * delay;
        cursor2Y += (mouseY - cursor2Y) * delay;

        cursor2.style.left = cursor2X + 'px';
        cursor2.style.top = cursor2Y + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    function addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursor2.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', (e) => {
            const projectCard = element.closest('.project-card');
            if (projectCard) {
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && projectCard.contains(relatedTarget)) {
                    return; // Don't remove hover if moving to the project card
                }
            }
            cursor.classList.remove('hover');
            cursor2.classList.remove('hover');
        });
    }

    const initialInteractiveElements = document.querySelectorAll('a, button, .project-card');
    initialInteractiveElements.forEach(addHoverEffect);

    const modal = document.getElementById('projectModal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const interactiveElements = node.querySelectorAll('a, button');
                        interactiveElements.forEach(addHoverEffect);
                    }
                });
            }
            
            if (mutation.type === 'attributes' && mutation.target.classList.contains('active')) {
                const modalLinks = modal.querySelectorAll('a, button');
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
}); 