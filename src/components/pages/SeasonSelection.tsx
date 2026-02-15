import React, { useState, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Snowflake, Flower, Sun, Leaf, ChevronRight, Compass } from '../ui/icons';
import { KendalaWordmark } from '../ui/KendalaLogo';
import { motion, AnimatePresence } from 'motion/react';
import { NatureMagicOverlay } from '../effects/NatureMagicOverlay';
import { getSeasonSelectionUrl } from '../../utils/imageUrls';

interface SeasonSlide {
  id: 'winter' | 'spring' | 'summer' | 'autumn';
  nameKey: string;
  taglineKey: string;
  descriptionKey: string;
  fullDescriptionKey: string;
  mainColor: string;
  secondaryColor: string;
  heroImage: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const seasons: SeasonSlide[] = [
  {
    id: 'winter',
    nameKey: 'winter',
    taglineKey: 'winter_tagline',
    descriptionKey: 'winter_desc',
    fullDescriptionKey: 'winter_full',
    mainColor: '#1E40AF', 
    secondaryColor: '#E0F2FE',
    heroImage: getSeasonSelectionUrl('winter'),
    Icon: Snowflake
  },
  {
    id: 'spring',
    nameKey: 'spring',
    taglineKey: 'spring_tagline',
    descriptionKey: 'spring_desc',
    fullDescriptionKey: 'spring_full',
    mainColor: '#166534', 
    secondaryColor: '#DCFCE7',
    heroImage: getSeasonSelectionUrl('spring'),
    Icon: Flower
  },
  {
    id: 'summer',
    nameKey: 'summer',
    taglineKey: 'summer_tagline',
    descriptionKey: 'summer_desc',
    fullDescriptionKey: 'summer_full',
    mainColor: '#92400E', 
    secondaryColor: '#FEF3C7',
    heroImage: getSeasonSelectionUrl('summer'),
    Icon: Sun
  },
  {
    id: 'autumn',
    nameKey: 'autumn',
    taglineKey: 'autumn_tagline',
    descriptionKey: 'autumn_desc',
    fullDescriptionKey: 'autumn_full',
    mainColor: '#7C2D12', 
    secondaryColor: '#FFEDD5',
    heroImage: getSeasonSelectionUrl('autumn'),
    Icon: Leaf
  }
];

export const SeasonSelection = ({ onSeasonSelect }: { onSeasonSelect: (season: 'winter' | 'spring' | 'summer' | 'autumn') => void }) => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSelection, setShowSelection] = useState(false);
  const [hoveredSeason, setHoveredSeason] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEnteringCabinet, setIsEnteringCabinet] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<'winter' | 'spring' | 'summer' | 'autumn' | null>(null);
  const [isEntering, setIsEntering] = useState(true);

  const transitionDuration = 0.6;
  const staggerDelay = 0.08;

  const currentSeason = seasons[currentSlide];
  const Icon = currentSeason.Icon;
  const seasonName = t(currentSeason.nameKey);

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentSlide < seasons.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setShowSelection(true);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleSkip = () => {
    setShowSelection(true);
  };

  const titleFont = 'font-sans';
  const bodyFont = 'font-sans';
  const localFontClass = 'font-sans';

  if (!showSelection) {
    return (
      <div className={`min-h-screen relative overflow-hidden bg-black text-white selection:bg-white selection:text-black ${bodyFont}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.1, filter: 'brightness(1.5) blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'brightness(0) blur(5px)' }}
            transition={{ duration: transitionDuration, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background Image - Cinematic Depth */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    className="w-full h-full"
                    animate={{ 
                        scale: isTransitioning ? 1.05 : 1,
                        x: [0, 2, -2, 0],
                        y: [0, -1, 1, 0]
                    }}
                    transition={{ 
                        scale: { duration: 0.4 },
                        x: { repeat: Infinity, duration: 12, ease: "linear" },
                        y: { repeat: Infinity, duration: 8, ease: "linear" }
                    }}
                >
                    <img
                        src={currentSeason.heroImage}
                        alt=""
                        className="w-full h-full object-cover opacity-50"
                    />
                </motion.div>
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
                
                {/* Chromatic Aberration - Season Specific Color */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-10 blur-3xl"
                    style={{ background: `radial-gradient(circle at center, transparent 0%, ${currentSeason.mainColor} 100%)` }}
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                />
            </div>

            {/* Environmental Particles */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-10"
                        initial={{ 
                            x: Math.random() * 100 + "%", 
                            y: "110%", 
                            scale: Math.random() * 0.5 + 0.5 
                        }}
                        animate={{ 
                            y: "-10%", 
                        }}
                        transition={{ 
                            duration: Math.random() * 5 + 5, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: Math.random() * 5 
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end pb-12 md:pb-24 px-6 md:px-24">
              
              <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-8 left-6 md:top-12 md:left-12 flex items-center gap-3 md:gap-4"
              >
                 <div className="md:hidden">
                    <KendalaWordmark color="white" size="md" />
                 </div>
                 <div className="hidden md:block">
                    <KendalaWordmark color="white" size="lg" />
                 </div>
              </motion.div>

              <div className="max-w-5xl">
                 <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.2 } }
                    }}
                 >
                     {/* Chapter Tag */}
                     <motion.div 
                        variants={{
                            hidden: { x: -10, opacity: 0 },
                            visible: { x: 0, opacity: 1 }
                        }}
                        className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"
                     >
                         <div className="p-1.5 md:p-2 border border-white/20 backdrop-blur-xl bg-white/5 relative group">
                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                         </div>
                         <div className="flex flex-col">
                            <span className={`text-[9px] md:text-[10px] ${bodyFont} font-bold uppercase tracking-[0.3em] text-white/80`}>
                                {t('chapter')} 0{currentSlide + 1}
                            </span>
                         </div>
                     </motion.div>

                     {/* Main Title - Extreme Impact - Only Montserrat */}
                     <div className="mb-6 md:mb-8 overflow-hidden">
                         <h1 className={`text-4xl sm:text-6xl md:text-9xl leading-[0.9] uppercase flex flex-wrap gap-x-4 md:gap-x-10 ${titleFont} font-black`}>
                            {seasonName.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: { y: "80%", opacity: 0 },
                                        visible: { y: 0, opacity: 1 }
                                    }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                         </h1>
                     </div>

                     {/* Description */}
                     <motion.p 
                        variants={{
                            hidden: { opacity: 0, x: 10 },
                            visible: { opacity: 0.7, x: 0 }
                        }}
                        className={`text-sm md:text-2xl font-light text-white/90 max-w-2xl mb-8 md:mb-12 leading-tight md:leading-normal ${bodyFont}`}
                     >
                        {t(currentSeason.fullDescriptionKey)}
                     </motion.p>
                     
                     {/* Interactive */}
                     <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.98 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10"
                     >
                         <button
                            onClick={handleNext}
                            className={`group relative flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 md:py-4 bg-white text-black ${bodyFont} font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95`}
                         >
                            <span className="relative z-10 text-[10px] md:text-xs">
                                {currentSlide < seasons.length - 1 ? t('next_chapter') : t('start_journey')}
                            </span>
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1 relative z-10" />
                         </button>
                         
                         <button
                            onClick={handleSkip}
                            className={`text-[8px] md:text-[9px] ${bodyFont} font-bold uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors`}
                         >
                            {t('skip_intro')}
                         </button>
                     </motion.div>
                 </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <NatureMagicOverlay 
            isVisible={isTransitioning} 
            type={currentSeason.id} 
            color={currentSeason.mainColor} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-y-auto md:overflow-hidden relative no-scrollbar">
      
      {/* Header removed for cinematic immersion */}

      <motion.div 
        className="flex flex-col md:flex-row h-screen"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        {seasons.map((season, idx) => {
           const isHovered = hoveredSeason === season.id;
           const sName = t(season.nameKey);
           
           return (
             <motion.div
               key={season.id}
               className="flex-1 min-h-[25vh] md:min-h-0 relative cursor-pointer group overflow-hidden border-b md:border-b-0 md:border-r border-white/5 last:border-0"
               onMouseEnter={() => setHoveredSeason(season.id)}
               onMouseLeave={() => setHoveredSeason(null)}
               onClick={() => {
                 setSelectedSeasonId(season.id);
                 setIsEnteringCabinet(true);
                 setTimeout(() => onSeasonSelect(season.id), 800);
               }}
               animate={{ 
                 flex: isHovered && window.innerWidth >= 768 ? 2 : 1,
               }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             >
                {/* Background Image with Shocking Zoom */}
                <div 
                   className="absolute inset-0 transition-all duration-[1s] ease-out"
                >
                   <motion.img 
                     src={season.heroImage} 
                     loading={idx < 2 ? "eager" : "lazy"}
                     decoding="async"
                     className="w-full h-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110" 
                     alt=""
                   />
                   
                   {/* Color Wash Overlay */}
                   <div 
                        className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-20 mix-blend-overlay" 
                        style={{ backgroundColor: season.mainColor }}
                   />
                </div>

                {/* Content - Immersive HUD Feel */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 z-20">
                    
                    <motion.div 
                        animate={{ 
                            scale: isHovered ? 1.2 : 1,
                            borderColor: isHovered ? season.mainColor : 'rgba(255,255,255,0.1)'
                        }}
                        className="p-3 md:p-6 border backdrop-blur-md mb-2 md:mb-8 transition-colors duration-500"
                    >
                        <season.Icon 
                            className="w-6 h-6 md:w-10 md:h-10 text-white transition-all duration-500"
                            style={{ filter: isHovered ? `drop-shadow(0 0 10px ${season.mainColor})` : 'none' }}
                        />
                    </motion.div>
                    
                    <h2 className={`text-3xl md:text-8xl font-light text-white mb-1 md:mb-4 transition-all duration-500 group-hover:tracking-[0.1em] text-center drop-shadow-2xl ${localFontClass}`}>
                        {sName}
                    </h2>
                    
                    <div className="h-16 md:h-20 flex flex-col items-center justify-start">
                        <AnimatePresence>
                            {(isHovered || window.innerWidth < 768) && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="flex flex-col items-center"
                                >
                                    <p className={`text-[9px] md:text-sm text-white/60 font-sans font-normal uppercase tracking-[0.2em] md:tracking-[0.5em] mb-2 md:mb-4 text-center`}>
                                        {t(season.taglineKey)}
                                    </p>
                                    <div className="flex gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div 
                                                key={i}
                                                className="w-6 md:w-12 h-px bg-white/20"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Glitch Overlay on Hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 bg-white mix-blend-overlay" />
             </motion.div>
           );
        })}
      </motion.div>

      {/* Grid Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] overflow-hidden">
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <NatureMagicOverlay 
          isVisible={isEnteringCabinet} 
          type={selectedSeasonId || 'summer'} 
          color={seasons.find(s => s.id === selectedSeasonId)?.mainColor || '#fff'} 
      />
    </div>
  );
};