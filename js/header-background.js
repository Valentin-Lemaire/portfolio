document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('headerBackground');
    const ctx = canvas.getContext('2d', { alpha: false });

    // Set canvas size with device pixel ratio support
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        
        // Check if the canvas is not the same size
        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            // Make the canvas the same size
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
            
            // Scale all drawing operations by the dpr
            ctx.scale(dpr, dpr);
            
            // Reinitialize points when canvas size changes
            initializePoints();
        }
    }

    // Initial resize
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);

    // Mouse position with throttling
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMouseMove = 0;
    const mouseMoveThrottle = 1000 / 60; // 60fps

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
    const gridSize = 50; // Size of each grid cell
    const points = [];
    let cols = 0;
    let rows = 0;

    // Initialize grid points
    function initializePoints() {
        points.length = 0;
        cols = Math.ceil(canvas.clientWidth / gridSize);
        rows = Math.ceil(canvas.clientHeight / gridSize);
        
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
    }

    // Animation settings
    const mouseRadius = 200; // Radius of mouse influence
    const maxSize = 3; // Maximum size of points
    const smoothFactor = 0.1; // Smoothing factor for animations

    // Animation loop with requestAnimationFrame
    let animationFrameId;
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        // Smooth mouse movement
        mouseX += (targetX - mouseX) * smoothFactor;
        mouseY += (targetY - mouseY) * smoothFactor;

        // Update and draw points
        points.forEach(point => {
            // Calculate distance from mouse
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate influence
            const influence = Math.max(0, 1 - distance / mouseRadius);
            
            // Update point size
            point.targetSize = 1.5 + (maxSize - 1.5) * influence;
            point.currentSize += (point.targetSize - point.currentSize) * smoothFactor;

            // Draw point
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 224, 224, ${0 + influence * 0.5})`;
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
}); 