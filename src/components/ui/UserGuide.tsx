import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, ChevronRight, ChevronLeft, Compass, Map as MapIcon, Calendar, Sparkles } from './icons';
import { ResponsiveImage } from './ResponsiveImage';
import { getHomeHeroUrl } from '../../utils/imageUrls';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuide = ({ isOpen, onClose }: UserGuideProps) => {
  const { theme, season } = useSeason();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Kendala",
      subtitle: "The Soul of the Steppe",
      description: "Kendala is your premium digital gateway to Kazakhstan. We blend cinematic storytelling with practical travel tools to help you discover the heart of Central Asia.",
      icon: Compass,
      image: getHomeHeroUrl(season || 'summer')
    },
    {
      title: "Plan Your Journey",
      subtitle: "Smart Trip Builder",
      description: "Use our 'Planner' to build custom itineraries. Add flights, hotels, and activities. The 'Magic' button (⚡) instantly generates a schedule for you.",
      icon: Calendar,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Explore the Unknown",
      subtitle: "Curated Places & Tours",
      description: "Browse our hand-picked selection of breathtaking locations and professionally guided tours. From the Altai Mountains to the Caspian Sea.",
      icon: MapIcon,
      image: "https://images.unsplash.com/photo-1534234828563-025c27633215?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "AI Guidance",
      subtitle: "Your Personal Concierge",
      description: "Ask our AI Assistant anything. From 'What is Beshbarmak?' to 'Find me a 3-day route near Almaty'. It knows the land better than anyone.",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1629814684945-314220556553?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  if (!isOpen || !theme) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-5xl bg-[#1D1B18] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px] border border-white/10"
            style={{ borderColor: `${theme.primary}20` }}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 bg-black/20 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden bg-black">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={currentSlide}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.7 }}
                   className="absolute inset-0"
                 >
                   <ResponsiveImage src={slides[currentSlide].image} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18] md:bg-gradient-to-r md:from-transparent md:to-[#1D1B18]" />
                 </motion.div>
               </AnimatePresence>
               
               {/* Progress Dots (Mobile) */}
               <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden z-20">
                  {slides.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-white' : 'w-1 bg-white/30'}`} 
                    />
                  ))}
               </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between h-full relative bg-[#1D1B18] text-[#F5F1EC]">
               
               {/* Top Navigation / Progress */}
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50">
                    <span>Guide</span>
                    <span className="w-4 h-px bg-current" />
                    <span>0{currentSlide + 1} / 0{slides.length}</span>
                  </div>
                  <div className="hidden md:flex gap-1">
                    {slides.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-white/10'}`} 
                        />
                      ))}
                  </div>
               </div>

               {/* Main Text */}
               <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-12 h-12 mb-6 text-amber-500">
                        {React.createElement(slides[currentSlide].icon, { className: "w-full h-full" })}
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
                        {slides[currentSlide].title}
                      </h2>
                      <h3 className="text-amber-500 text-sm font-black uppercase tracking-[0.2em] mb-6">
                        {slides[currentSlide].subtitle}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed">
                        {slides[currentSlide].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* Controls */}
               <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                  <button 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-amber-500 transition-colors disabled:opacity-20 disabled:hover:text-current"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <button 
                    onClick={nextSlide}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-lg group"
                  >
                    {currentSlide === slides.length - 1 ? 'Start Journey' : 'Next'} 
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
