import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { KendalaWordmark } from './ui/KendalaLogo';
import { Globe, ArrowRight } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getLangBgUrl, LANG_BG_URLS } from '../utils/imageUrls';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'kz', label: 'Kazakh', nativeLabel: 'Қазақша', flag: '🇰🇿' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
];

const backgroundImages = LANG_BG_URLS.map((_, i) => getLangBgUrl(i));

interface LanguageSelectionProps {
  onSelect: () => void;
}

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
  const { setLanguage } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsExiting(true);
    setTimeout(() => {
      onSelect();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black font-sans">
      {/* Cinematic Background - Fixed */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <ImageWithFallback 
              src={backgroundImages[bgIndex]} 
              className="w-full h-full object-cover"
              alt="Kazakhstan landscape"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
      </div>

      {/* Scrollable Content Container */}
      <div className="absolute inset-0 z-20 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-6">
          <motion.div 
            animate={isExiting ? { opacity: 0, scale: 0.95, filter: 'blur(10px)' } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-6xl w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="mb-8 md:mb-16"
            >
              <KendalaWordmark color="white" size="xl" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="text-center mb-10 md:mb-16 space-y-2 md:space-y-4"
            >
                <h1 className="text-2xl md:text-5xl text-white font-extrabold tracking-[0.2em] uppercase">
                    Тілді таңдаңыз
                </h1>
                <h2 className="text-sm md:text-2xl text-white/60 font-bold uppercase tracking-widest">
                    Выберите язык / Select Language
                </h2>
                <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
              {languages.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + idx * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleSelect(lang.code)}
                  className="group relative h-[140px] md:h-[400px] flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-700 hover:border-white/40 active:scale-[0.98]"
                >
                  {/* Card Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-xl md:text-3xl text-white font-sans tracking-widest mb-1 md:mb-3 transition-transform duration-700 group-hover:-translate-y-1">
                      {lang.code.toUpperCase()}
                    </span>
                    <span className="text-2xl md:text-3xl text-white font-sans tracking-widest mb-1 md:mb-3 transition-transform duration-700 group-hover:-translate-y-1">
                      {lang.nativeLabel}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.5em] font-sans">
                      {lang.label}
                    </span>
                  </div>

                  {/* Decorative Ornament (Subtle) */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-all duration-1000" />
                  
                  {/* Bottom Indicator (Desktop Only or when active) */}
                  <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-[0.3em] uppercase">
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1.5 }}
              className="mt-12 md:mt-20 flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 md:w-12 h-px bg-white/20" />
                <Globe className="w-3 md:w-4 h-3 md:h-4 text-white/20 animate-spin-slow" />
                <div className="w-8 md:w-12 h-px bg-white/20" />
              </div>
              <p className="text-white/20 font-sans text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-center">
                Digital Heritage Platform &bull; Kazakhstan &bull; 2026
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Border Decoration - Pointer events none ensures clicks go through */}
      <div className="fixed inset-4 md:inset-8 border border-white/5 pointer-events-none z-[110]" />
      <div className="hidden md:block fixed top-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-[110]" />
      <div className="hidden md:block fixed bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-[110]" />
    </div>
  );
};