document.addEventListener('DOMContentLoaded', () => {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMouseInViewport = true;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle mouse entering/leaving viewport
    document.addEventListener('mouseenter', () => {
        isMouseInViewport = true;
        cursor.style.display = 'block';
    });

    document.addEventListener('mouseleave', () => {
        isMouseInViewport = false;
        cursor.style.display = 'none';
    });

    // Smooth animation function
    function animate() {
        // Add delay to the cursor movement
        const delay = 0.2; // Adjust this value to change the delay (0.1 = 100ms)
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Function to add hover effect to an element
    function addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            if (isMouseInViewport) {
                cursor.classList.add('hover');
            }
        });
        
        element.addEventListener('mouseleave', (e) => {
            // Check if we're moving to a parent project card
            const projectCard = element.closest('.project-card');
            if (projectCard) {
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && projectCard.contains(relatedTarget)) {
                    return; // Don't remove hover if moving to the project card
                }
            }
            cursor.classList.remove('hover');
        });
    }

    // Add hover effect to initial interactive elements
    const initialInteractiveElements = document.querySelectorAll('a, button, .project-card');
    initialInteractiveElements.forEach(addHoverEffect);

    // Watch for changes in the modal content
    const modal = document.getElementById('projectModal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Handle new nodes
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Check if it's an element node
                        const interactiveElements = node.querySelectorAll('a, button');
                        interactiveElements.forEach(addHoverEffect);
                    }
                });
            }
            
            // Handle attribute changes
            if (mutation.type === 'attributes' && mutation.target.classList.contains('active')) {
                // When modal becomes active, add hover effects to all links and buttons
                const modalLinks = modal.querySelectorAll('a, button');
                modalLinks.forEach(addHoverEffect);
            }
        });
    });

    // Start observing the modal content
    observer.observe(modal, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
}); 