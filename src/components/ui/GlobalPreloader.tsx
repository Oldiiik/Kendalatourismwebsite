import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { getPreloadManifest, PreloadEntry } from '../../utils/imageUrls';

const preloadImage = (src: string, timeout = 8000): Promise<boolean> =>
  new Promise((resolve) => {
    if (!src) { resolve(false); return; }
    const img = new Image();
    const timer = setTimeout(() => { resolve(false); }, timeout);
    img.onload = () => { clearTimeout(timer); resolve(true); };
    img.onerror = () => { clearTimeout(timer); resolve(false); };
    img.src = src;
  });

const addConnectionHints = () => {
  const domains = ['https://images.unsplash.com'];
  domains.forEach(domain => {
    if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);

      const dns = document.createElement('link');
      dns.rel = 'dns-prefetch';
      dns.href = domain;
      document.head.appendChild(dns);
    }
  });
};

const addPreloadHint = (src: string) => {
  if (!src || document.querySelector(`link[rel="preload"][href="${src}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

interface GlobalPreloaderProps {
  onComplete: () => void;
}

export const GlobalPreloader = ({ onComplete }: GlobalPreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const hasStarted = useRef(false);

  const runPreload = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    addConnectionHints();

    let hasLanguage = false;
    let savedSeason: string | null = null;
    try {
      hasLanguage = !!localStorage.getItem('language');
      savedSeason = localStorage.getItem('kendala_season');
    } catch {}

    const manifest = getPreloadManifest({ hasLanguage, savedSeason });
    const total = manifest.length || 1;
    let loaded = 0;

    const critical = manifest.filter(e => e.priority === 'critical');
    const high = manifest.filter(e => e.priority === 'high');
    const medium = manifest.filter(e => e.priority === 'medium');
    const low = manifest.filter(e => e.priority === 'low');

    const processEntry = async (entry: PreloadEntry) => {
      await preloadImage(entry.url, entry.priority === 'critical' ? 8000 : 5000);
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    critical.forEach(entry => addPreloadHint(entry.url));

    if (critical.length) await Promise.all(critical.map(processEntry));
    if (high.length) await Promise.all(high.map(processEntry));

    if (medium.length) {
      await Promise.race([
        Promise.all(medium.map(processEntry)),
        new Promise(r => setTimeout(r, 3500)),
      ]);
    }

    // Fill progress to 100% accounting for any timed-out medium images
    loaded = Math.max(loaded, total - low.length);
    setProgress(100);
    await new Promise(r => setTimeout(r, 800));
    
    setIsFinished(true);

    setTimeout(() => {
        onComplete();
    }, 1200);

    low.forEach(entry => preloadImage(entry.url, 12000));
  }, [onComplete]);

  useEffect(() => {
    runPreload();
  }, [runPreload]);

  // Nature-inspired colors
  const deepGreen = "#0f2e22"; // Deep forest
  const earthGold = "#d4af37"; // Golden steppe

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center">
        {/* Cinematic Curtain Reveal - Nature Themed */}
        <motion.div
            initial={{ y: 0 }}
            animate={isFinished ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 right-0 h-[50vh] z-10 border-b border-white/5"
            style={{ backgroundColor: deepGreen }}
        >
            {/* Subtle organic texture/noise */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>

        <motion.div
            initial={{ y: 0 }}
            animate={isFinished ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[50vh] z-10 border-t border-white/5"
            style={{ backgroundColor: deepGreen }}
        >
             <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>

        {/* Content Wrapper */}
        <motion.div
            className="relative z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            animate={isFinished ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
             {/* Brand Logo - Breathing Effect */}
            <div className="mb-16 relative">
                {/* Sun Glow Behind Logo */}
                <motion.div 
                    className="absolute inset-0 blur-3xl rounded-full"
                    style={{ backgroundColor: earthGold }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white/90 relative z-10 mix-blend-overlay">
                    Kendala
                </h1>
                
                {/* Nature Subtitle */}
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-center mt-4 text-[#d4af37] opacity-80">
                    Expedition
                </p>
            </div>

            {/* Minimal Progress Line (Organic) */}
            <div className="w-48 h-[1px] bg-white/10 overflow-hidden relative">
                <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: earthGold, boxShadow: `0 0 10px ${earthGold}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 40, damping: 20 }}
                />
            </div>
            
            {/* Minimal Percentage - No technical text */}
            <div className="mt-4 text-[10px] font-mono font-medium text-white/30 tracking-widest">
                {progress}%
            </div>

        </motion.div>
    </div>
  );
};