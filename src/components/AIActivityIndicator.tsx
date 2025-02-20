import { useEffect, useRef } from 'react';

const AIActivityIndicator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 100;
    canvas.height = 100;

    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      angle: number;
      radius: number;
    }> = [];

    const PARTICLE_COUNT = 30;
    const BASE_SPEED = 0.5;
    const ROTATION_SPEED = 0.001;
    const COALESCENCE_INTERVAL = 3000;
    const COALESCENCE_DURATION = 1000;

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 30 + 10;
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * BASE_SPEED,
        speedY: (Math.random() - 0.5) * BASE_SPEED,
        opacity: Math.random() * 0.5 + 0.3,
        angle: angle,
        radius: radius
      });
    }

    let isCoalescing = false;
    let coalesceTarget = { x: canvas.width / 2, y: canvas.height / 2 };
    let lastCoalescenceTime = Date.now();
    let globalRotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw black circular background
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fill();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#7829B0'); // Purple
      gradient.addColorStop(1, '#FF800A'); // Orange

      // Update global rotation
      globalRotation += ROTATION_SPEED;

      // Check for coalescence
      const currentTime = Date.now();
      if (currentTime - lastCoalescenceTime > COALESCENCE_INTERVAL && !isCoalescing) {
        isCoalescing = true;
        coalesceTarget = {
          x: canvas.width * (0.3 + Math.random() * 0.4),
          y: canvas.height * (0.3 + Math.random() * 0.4)
        };
        setTimeout(() => {
          isCoalescing = false;
          lastCoalescenceTime = currentTime;
        }, COALESCENCE_DURATION);
      }

      // Update and draw particles
      particles.forEach(particle => {
        if (isCoalescing) {
          // Move towards coalescence point
          const dx = coalesceTarget.x - particle.x;
          const dy = coalesceTarget.y - particle.y;
          particle.x += dx * 0.02;
          particle.y += dy * 0.02;
        } else {
          // Rotate particles around center
          particle.angle += ROTATION_SPEED;
          particle.x = canvas.width / 2 + Math.cos(particle.angle + globalRotation) * particle.radius;
          particle.y = canvas.height / 2 + Math.sin(particle.angle + globalRotation) * particle.radius;
          
          // Add some random movement
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Keep particles within bounds
          const dx = particle.x - canvas.width / 2;
          const dy = particle.y - canvas.height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > canvas.width / 2 - 5) {
            particle.speedX *= -1;
            particle.speedY *= -1;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="opacity-80"
      style={{
        width: '50px',
        height: '50px'
      }}
    />
  );
};

export default AIActivityIndicator;
