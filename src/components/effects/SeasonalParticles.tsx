import React, { useRef, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  angle: number;
  spin: number;
  type?: 'leaf' | 'petal' | 'snow' | 'firefly';
  color?: string;
}

export const SeasonalParticles = () => {
  const { theme, season, vfxEnabled } = useSeason();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!vfxEnabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const getSeasonConfig = () => {
      switch (season) {
        case 'winter':
          return {
            count: 200,
            type: 'snow',
            speed: 1.5,
            wind: 0.5,
            gravity: 0.8,
            colors: ['rgba(255, 255, 255, 0.8)', 'rgba(230, 240, 255, 0.6)']
          };
        case 'spring':
          return {
            count: 60,
            type: 'petal',
            speed: 1,
            wind: 0.2,
            gravity: 0.4,
            colors: ['rgba(255, 182, 193, 0.6)', 'rgba(255, 240, 245, 0.5)']
          };
        case 'summer':
          return {
            count: 80,
            type: 'firefly',
            speed: 0.5,
            wind: 0,
            gravity: -0.2,
            colors: ['rgba(255, 215, 0, 0.6)', 'rgba(255, 165, 0, 0.4)']
          };
        case 'autumn':
          return {
            count: 50,
            type: 'leaf',
            speed: 1.2,
            wind: 0.3,
            gravity: 0.6,
            colors: ['rgba(210, 105, 30, 0.7)', 'rgba(255, 140, 0, 0.6)', 'rgba(139, 69, 19, 0.6)']
          };
        default:
          return { count: 0, type: 'none', speed: 0, wind: 0, gravity: 0, colors: [] };
      }
    };

    const config = getSeasonConfig();
    particlesRef.current = [];

    for (let i = 0; i < config.count; i++) {
      particlesRef.current.push(createParticle(width, height, config));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach((p, i) => {
        updateParticle(p, width, height, config, mouseRef.current);
        drawParticle(ctx, p, config.type);
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [season, vfxEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: season === 'summer' ? 'screen' : 'normal' }}
    />
  );
};

function createParticle(w: number, h: number, config: any): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * config.speed + config.wind,
    vy: (Math.random() - 0.5) * config.speed + config.gravity,
    size: Math.random() * (config.type === 'snow' ? 2 : 5) + 1,
    alpha: Math.random(),
    life: Math.random() * 100,
    maxLife: 100 + Math.random() * 100,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    color: config.colors[Math.floor(Math.random() * config.colors.length)]
  };
}

function updateParticle(p: Particle, w: number, h: number, config: any, mouse: {x: number, y: number}) {
  const dx = mouse.x - p.x;
  const dy = mouse.y - p.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const force = Math.max(0, 100 - dist) / 1000;

  if (dist < 150) {
      if (config.type === 'firefly') {
          p.vx += dx * 0.0001;
          p.vy += dy * 0.0001;
      } else {
          p.vx -= dx * force;
          p.vy -= dy * force;
      }
  }

  p.x += p.vx;
  p.y += p.vy;
  p.angle += p.spin;

  if (p.x > w + 20) p.x = -20;
  if (p.x < -20) p.x = w + 20;
  if (p.y > h + 20) p.y = -20;
  if (p.y < -20) p.y = h + 20;

  p.vx += (Math.random() - 0.5) * 0.05;
  p.vy += (Math.random() - 0.5) * 0.05;

  const maxSpeed = config.type === 'snow' ? 3 : 1;
  p.vx = Math.max(Math.min(p.vx, maxSpeed), -maxSpeed);
  p.vy = Math.max(Math.min(p.vy, maxSpeed), -maxSpeed);

  if (config.type === 'firefly') {
      p.alpha += (Math.random() - 0.5) * 0.05;
      if (p.alpha < 0) p.alpha = 0;
      if (p.alpha > 1) p.alpha = 1;
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, type: string) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color || '#fff';

  if (type === 'snow') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (p.size > 2) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'white';
    }
  } else if (type === 'firefly') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';
  } else if (type === 'petal') {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'leaf') {
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size, -p.size/2, p.size, p.size/2, 0, p.size);
    ctx.bezierCurveTo(-p.size, p.size/2, -p.size, -p.size/2, 0, -p.size);
    ctx.fill();
  }

  ctx.restore();
}
