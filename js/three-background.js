class ThreeBackground {
    constructor() {
        // Check if device is mobile or has low performance
        if (this.shouldUseSimpleBackground()) {
            return;
        }

        this.container = document.querySelector('.header');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.8, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    shouldUseSimpleBackground() {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check if device has low memory
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4; // Less than 4GB RAM
        
        // Check if device has low performance
        const hasLowPerformance = window.innerWidth < 768 || window.innerHeight < 768;
        
        return isMobile || hasLowMemory || hasLowPerformance;
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        // Adjust particle count based on device
        const particleCount = this.getOptimalParticleCount();
        const baseSize = this.getOptimalParticleSize();

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Get accent color from CSS variable
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-color')
            .trim();
        
        const material = new THREE.PointsMaterial({
            color: accentColor,
            size: baseSize,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    getOptimalParticleCount() {
        // Adjust particle count based on device capabilities
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasHighDPI = window.devicePixelRatio > 1;
        
        if (isMobile) {
            return hasHighDPI ? 500 : 300;
        }
        return hasHighDPI ? 1500 : 1000;
    }

    getOptimalParticleSize() {
        // Adjust particle size based on device pixel ratio
        const baseSize = 0.02;
        return baseSize * (window.devicePixelRatio || 1);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles based on mouse position
        this.particles.rotation.x += (this.mouseY * 0.0001 - this.particles.rotation.x) * 0.05;
        this.particles.rotation.y += (this.mouseX * 0.0001 - this.particles.rotation.y) * 0.05;

        // Gentle floating motion
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    handleMouseMove() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - window.innerWidth / 2;
            this.mouseY = event.clientY - window.innerHeight / 2;
        });
    }
}

// Initialize the background when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThreeBackground();
}); 