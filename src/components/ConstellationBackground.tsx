import React, { useEffect, useRef, useState } from 'react';

interface ConstellationBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

const ConstellationBackground: React.FC<ConstellationBackgroundProps> = ({
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{x: number, y: number, vx: number, vy: number, size: number, alpha: number}> = [];
    
    const particleCount = intensity === 'high' ? 120 : intensity === 'medium' ? 60 : 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#020817]">
      {/* Base Gradient Mesh */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[150%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#020817]/0 to-transparent blur-3xl mix-blend-screen animate-slow-spin"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020817]/0 to-transparent blur-3xl mix-blend-screen animate-slow-spin-reverse"></div>
      </div>

      {/* Canvas Particles */}
      {!prefersReducedMotion && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
        />
      )}

      {/* Scanline Shimmer & Vignette */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+Cjwvc3ZnPg==')] opacity-30 mix-blend-overlay pointer-events-none"></div>
      
      {/* Darkening Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-[#020817]/40 to-[#020817]/90 pointer-events-none"></div>
      
      {/* Static Fallback for Reduced Motion */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-slate-900 to-[#020817] pointer-events-none"></div>
      )}
    </div>
  );
};

export default ConstellationBackground;
