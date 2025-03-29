document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('headerBackground');
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Performance optimizations
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size with device pixel ratio
    function resizeCanvas() {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });

    // Mouse position with throttling
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMouseMove = 0;
    const mouseMoveThrottle = 16; // ~60fps

    // Track mouse movement with throttling
    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastMouseMove < mouseMoveThrottle) return;
        
        const rect = canvas.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        lastMouseMove = now;
    });

    // Grid settings
    const gridSize = 50;
    const points = [];
    const cols = Math.ceil(rect.width / gridSize);
    const rows = Math.ceil(rect.height / gridSize);

    // Initialize grid points
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            points.push({
                x: i * gridSize,
                y: j * gridSize,
                baseX: i * gridSize,
                baseY: j * gridSize,
                size: 1.5,
                targetSize: 1.5,
                currentSize: 1.5
            });
        }
    }

    // Animation settings
    const mouseRadius = 200;
    const maxSize = 3;
    const smoothFactor = 0.1;

    // Animation loop with requestAnimationFrame
    let animationFrame;
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Smooth mouse movement
        mouseX += (targetX - mouseX) * smoothFactor;
        mouseY += (targetY - mouseY) * smoothFactor;

        // Update and draw points
        points.forEach(point => {
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - distance / mouseRadius);
            
            point.targetSize = 1.5 + (maxSize - 1.5) * influence;
            point.currentSize += (point.targetSize - point.currentSize) * smoothFactor;

            ctx.beginPath();
            ctx.arc(point.x, point.y, point.currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 224, 224, ${0 + influence * 0.5})`;
            ctx.fill();
        });

        animationFrame = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', resizeCanvas);
        document.removeEventListener('mousemove', () => {});
    });
}); 