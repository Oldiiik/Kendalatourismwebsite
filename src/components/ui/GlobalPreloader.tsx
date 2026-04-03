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
  const domains = ['https://wrxtnfwckeqhwfjsaifh.supabase.co'];
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
      await preloadImage(entry.url, entry.priority === 'critical' ? 3000 : 2000);
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    critical.forEach(entry => addPreloadHint(entry.url));

    try {
      if (critical.length) await Promise.all(critical.map(processEntry));

      // Don't block on high/medium — fire and forget
      if (high.length) {
        Promise.all(high.map(processEntry)).catch(() => {});
      }

      if (medium.length) {
        Promise.all(medium.map(processEntry)).catch(() => {});
      }
    } catch {
      // Swallow any errors — proceed to completion
    }

    loaded = Math.max(loaded, total - low.length);
    setProgress(100);
    await new Promise(r => setTimeout(r, 200));
    
    setIsFinished(true);

    setTimeout(() => {
        onComplete();
    }, 600);

    low.forEach(entry => preloadImage(entry.url, 12000));
  }, [onComplete]);

  useEffect(() => {
    runPreload();
    // Safety: force complete after 6s no matter what
    const safetyTimer = setTimeout(() => {
      if (!hasStarted.current) return;
      setProgress(100);
      setIsFinished(true);
      setTimeout(() => onComplete(), 200);
    }, 6000);
    return () => clearTimeout(safetyTimer);
  }, [runPreload]);

  const deepGreen = "#0f2e22";
  const earthGold = "#d4af37";

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center">
        <motion.div
            initial={{ y: 0 }}
            animate={isFinished ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 right-0 h-[50vh] z-10 border-b border-white/5"
            style={{ backgroundColor: deepGreen }}
        >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </motion.div>

        <motion.div
            initial={{ y: 0 }}
            animate={isFinished ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[50vh] z-10 border-t border-white/5"
            style={{ backgroundColor: deepGreen }}
        >
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E")` }} />
        </motion.div>

        <motion.div
            className="relative z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            animate={isFinished ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-16 relative">
                <motion.div 
                    className="absolute inset-0 blur-3xl rounded-full"
                    style={{ backgroundColor: earthGold }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white/90 relative z-10 mix-blend-overlay">
                    Kendala
                </h1>
                
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-center mt-4 text-[#d4af37] opacity-80">
                    Expedition
                </p>
            </div>

            <div className="w-48 h-[1px] bg-white/10 overflow-hidden relative">
                <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: earthGold, boxShadow: `0 0 10px ${earthGold}` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 40, damping: 20 }}
                />
            </div>
            
            <div className="mt-4 text-[10px] font-mono font-medium text-white/30 tracking-widest">
                {progress}%
            </div>

        </motion.div>
    </div>
  );
};