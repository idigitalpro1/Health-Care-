import React, { useEffect, useRef, useState } from 'react';

interface HeaderInteractiveBackgroundProps {
  mode?: 'css' | 'canvas';
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const HeaderInteractiveBackground: React.FC<HeaderInteractiveBackgroundProps> = ({
  mode = 'css',
  intensity = 'medium',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!interactive || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current?.parentElement) return;
      const rect = containerRef.current.parentElement.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const parent = containerRef.current?.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, prefersReducedMotion]);

  // Canvas mode implementation
  useEffect(() => {
    if (mode !== 'canvas' || prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{x: number, y: number, vx: number, vy: number, size: number, alpha: number}> = [];
    
    const particleCount = intensity === 'high' ? 80 : intensity === 'medium' ? 40 : 20;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
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
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - dist / 120)})`;
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
  }, [mode, intensity, prefersReducedMotion]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020817]"
    >
      {/* Base Gradient Mesh */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[150%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#020817]/0 to-transparent blur-3xl mix-blend-screen animate-slow-spin"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[120%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#020817]/0 to-transparent blur-3xl mix-blend-screen animate-slow-spin-reverse"></div>
      </div>

      {/* Canvas Particles (if mode === 'canvas') */}
      {mode === 'canvas' && !prefersReducedMotion && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen"
        />
      )}

      {/* CSS Particles (if mode === 'css') */}
      {mode === 'css' && !prefersReducedMotion && (
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_2px_rgba(96,165,250,0.5)] animate-float-1"></div>
          <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_2px_rgba(34,211,238,0.5)] animate-float-2"></div>
          <div className="absolute top-[40%] left-[80%] w-0.5 h-0.5 bg-indigo-300 rounded-full shadow-[0_0_8px_1px_rgba(165,180,252,0.5)] animate-float-3"></div>
          <div className="absolute top-[80%] left-[20%] w-1 h-1 bg-blue-300 rounded-full shadow-[0_0_10px_2px_rgba(147,197,253,0.5)] animate-float-1" style={{ animationDelay: '1s' }}></div>
        </div>
      )}

      {/* Interactive Light Bloom */}
      {interactive && !prefersReducedMotion && (
        <div 
          className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.12)_0%,_transparent_60%)] mix-blend-screen pointer-events-none transition-opacity duration-300"
          style={{
            left: mousePos.x - 400,
            top: mousePos.y - 400,
            opacity: mousePos.x === 0 && mousePos.y === 0 ? 0 : 1
          }}
        />
      )}

      {/* Scanline Shimmer & Vignette */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+Cjwvc3ZnPg==')] opacity-40 mix-blend-overlay pointer-events-none"></div>
      
      {/* Darkening Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-[#020817]/40 to-[#020817]/90 pointer-events-none"></div>
      
      {/* Static Fallback for Reduced Motion */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-slate-900 to-[#020817] pointer-events-none"></div>
      )}
    </div>
  );
};

export default HeaderInteractiveBackground;
