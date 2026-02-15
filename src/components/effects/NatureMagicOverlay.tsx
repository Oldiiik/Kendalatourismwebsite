import React from 'react';
import { motion } from 'motion/react';

interface NatureMagicOverlayProps {
  season: string;
}

export const NatureMagicOverlay = ({ season }: NatureMagicOverlayProps) => {
  if (season === 'winter') {
    return (
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(165,243,252,0.15)_100%)] mix-blend-screen" />
        
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (season === 'spring') {
    return (
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div 
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.03)_20deg,transparent_40deg,rgba(255,255,255,0.03)_60deg,transparent_80deg)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ mixBlendMode: 'overlay' }}
        />
        
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent mix-blend-overlay" />
      </div>
    );
  }

  if (season === 'summer') {
    return (
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div 
           className="absolute -top-20 -right-20 w-[800px] h-[800px] rounded-full bg-orange-400/10 blur-[100px] mix-blend-screen"
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
           className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]"
           animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           style={{ backgroundSize: '200% 200%' }}
        />
      </div>
    );
  }

  if (season === 'autumn') {
    return (
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-color-dodge" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(66,32,6,0.2)_100%)]" />
      </div>
    );
  }

  return null;
};
