import React, { useState } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Wind, ArrowRight, X, Play, 
    ChevronRight, MapPin, Star, User, Heart, Compass, 
    CheckCircle, Share, Info, Shield, Layers
} from '../ui/icons';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { cultureData } from '../data/CultureData';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import { IMAGES, ASSETS } from '../data/culture/images';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.3, duration: 0.5 }
  }
};

export const CulturePage = () => {
  const { theme, season } = useSeason();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('music');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const allImages = categories.flatMap(cat => [
    ...Object.values(IMAGES[cat]),
    ...Object.values(ASSETS[cat])
  ]);
  
  const imagesPreloaded = useImagePreloader(allImages);

  if (!theme) return null;

  const data = cultureData[language] || cultureData['en'];
  const items = data?.items?.[activeTab] || [];

  if (!imagesPreloaded) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center font-sans" style={{ background: theme.background, color: theme.text }}>
              <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-8"
              >
                  <Wind className="w-12 h-12 opacity-50" style={{ color: theme.primary }} />
              </motion.div>
              <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="text-xs font-black uppercase tracking-[0.3em]"
              >
                  {t('syncing_cultural')}
              </motion.span>
          </div>
      );
  }

  return (
    <>
      <PageTransition>
        <div className="min-h-screen font-sans" style={{ background: theme.background, color: theme.text }}>
          
          {/* Cinematic Hero */}
          <section className="relative min-h-screen overflow-hidden flex items-end">
            <div className="absolute inset-0">
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1666707917238-49df8d20d22c" 
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 text-white">
              <div className="max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black rounded-none">
                      {data.archiveLabel}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                      <Wind className="w-3 h-3" /> {data.sections.length} {language === 'en' ? 'Categories' : language === 'ru' ? 'Категории' : 'Санаттар'}
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] uppercase tracking-tighter mb-8 pr-4 sm:pr-12 relative z-10 break-words" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 4px 30px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.5)' }}>
                    {data.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/80 max-w-3xl leading-relaxed mb-8">
                    {data.subtitle}
                  </p>
                  <div className="flex items-center gap-6 border-t border-white/20 pt-8">
                    <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-black rounded-none">
                      K
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wider">Kendala Cultural Archive</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                        {language === 'en' ? 'Heritage Preservation Platform' : language === 'ru' ? 'Платформа Сохранения Наследия' : 'Мұраны Сақтау Платформасы'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <div className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto">

            {/* Navigation */}
            <nav className="flex flex-wrap gap-4 mb-20">
              {data.sections.map((section: any, idx: number) => {
                const Icon = section.icon;
                const isActive = activeTab === section.id;
                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setActiveTab(section.id)}
                    className={`relative flex items-center gap-4 md:gap-6 px-6 py-4 md:px-10 md:py-6 border transition-all duration-300 overflow-hidden group rounded-none ${isActive ? 'shadow-2xl' : 'hover:bg-current/5'}`}
                    style={{ 
                      borderColor: isActive ? theme.primary : `${theme.text}10`,
                      backgroundColor: isActive ? theme.primary : 'transparent',
                      color: isActive ? theme.primaryForeground : theme.text
                    }}
                  >
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <div className="text-left z-10">
                       <span className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">{section.label}</span>
                       <span className="text-sm md:text-lg font-black uppercase tracking-wide">{section.title}</span>
                    </div>
                  </motion.button>
                );
              })}
            </nav>

            {/* Grid Layout */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                {items.map((item: any, idx: number) => (
                  <motion.div
                    layoutId={`card-container-${item.id}`}
                    variants={itemVariants}
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer relative aspect-[3/4] overflow-hidden border border-current/10 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-none"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                     <div className="absolute inset-0 z-0 overflow-hidden">
                        <motion.div 
                          layoutId={`card-image-${item.id}`}
                          className="w-full h-full"
                        >
                          <ResponsiveImage 
                            src={item.image} 
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                          />
                        </motion.div>
                        <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundColor: theme.primary }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                     </div>

                     <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 text-white">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-4 block" style={{ color: theme.primary }}>
                              {data.artifactLabel} 0{idx + 1}
                          </span>
                          <motion.h3 
                            layoutId={`card-title-${item.id}`}
                            className="text-3xl font-black uppercase leading-none mb-4"
                          >
                            {item.name}
                          </motion.h3>
                          <p className="text-sm font-bold opacity-0 group-hover:opacity-70 transition-opacity duration-500 delay-100 line-clamp-2 leading-relaxed translate-y-4 group-hover:translate-y-0">
                              {item.desc}
                          </p>
                          
                          <div className="mt-8 pt-8 border-t border-white/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                              <span className="text-[9px] font-black uppercase tracking-widest">{data.viewDetails}</span>
                              <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </div>
      </PageTransition>

      {/* Detail Modal */}
      <AnimatePresence>
          {selectedItem && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedItem(null)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-2xl cursor-pointer"
                  />
                  
                  <motion.div 
                      layoutId={`card-container-${selectedItem.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="relative w-full max-w-7xl h-[95vh] overflow-hidden shadow-2xl flex flex-col rounded-none border"
                      style={{ backgroundColor: theme.background, color: theme.text, borderColor: `${theme.primary}20` }}
                  >
                      {/* Image Section - Full screen on mobile, half on desktop */}
                      <div className="w-full md:w-1/2 h-full md:h-full relative overflow-hidden bg-current/5 md:absolute md:left-0 md:top-0">
                          <motion.div 
                            layoutId={`card-image-${selectedItem.id}`}
                            className="w-full h-full"
                          >
                            <ResponsiveImage src={selectedItem.image} className="w-full h-full object-cover" />
                          </motion.div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12 lg:p-16 text-white pb-40 md:pb-12">
                              <div className="max-w-3xl">
                                  <div className="flex flex-wrap items-center gap-4 mb-8">
                                      <span className="px-5 py-2.5 text-xs md:text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black rounded-none">
                                          {data.culturalArtifact}
                                      </span>
                                      {selectedItem.specs?.Origin && (
                                          <span className="flex items-center gap-2 text-sm md:text-xs font-bold uppercase tracking-widest opacity-80">
                                              <MapPin className="w-4 h-4 md:w-3 md:h-3" /> {selectedItem.specs.Origin}
                                          </span>
                                      )}
                                      {selectedItem.specs?.Period && (
                                          <span className="flex items-center gap-2 text-sm md:text-xs font-bold uppercase tracking-widest opacity-80">
                                              <Star className="w-4 h-4 md:w-3 md:h-3" /> {selectedItem.specs.Period}
                                          </span>
                                      )}
                                  </div>
                                  <motion.h2 
                                    layoutId={`card-title-${selectedItem.id}`}
                                    className="text-6xl sm:text-7xl md:text-5xl lg:text-6xl font-black leading-[1.05] uppercase tracking-tighter mb-10 md:mb-6 break-words"
                                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 4px 30px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.5)' }}
                                  >
                                    {selectedItem.name}
                                  </motion.h2>
                                  <div className="flex items-center gap-5 border-t border-white/20 pt-8">
                                      <div className="w-14 h-14 md:w-10 md:h-10 bg-white text-black flex items-center justify-center text-xl md:text-base font-black rounded-none">
                                          K
                                      </div>
                                      <div>
                                          <p className="font-bold text-sm md:text-xs uppercase tracking-wider">Kendala Cultural Archive</p>
                                          <p className="text-[10px] md:text-[9px] uppercase tracking-[0.2em] opacity-60">
                                              {language === 'en' ? 'Heritage Documentation' : language === 'ru' ? 'Документация Наследия' : 'Мұра Құжаттамаы'}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Content Section - Positioned on right on desktop */}
                      <div className="w-full md:w-1/2 md:ml-auto p-8 md:p-12 lg:p-16 overflow-y-auto no-scrollbar relative flex flex-col" style={{ backgroundColor: theme.background }}>
                          <button 
                              onClick={() => setSelectedItem(null)}
                              className="absolute top-8 right-8 p-4 transition-all z-50 group border rounded-none mt-16 md:mt-0"
                              style={{ backgroundColor: theme.primary, color: theme.primaryForeground, borderColor: 'transparent' }}
                          >
                              <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                          </button>

                          <motion.div 
                            variants={modalContentVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-12"
                          >
                              <div>
                                  <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-80 border-l-4 pl-6" style={{ borderColor: theme.primary }}>
                                      {selectedItem.desc}
                                  </p>
                              </div>

                              <div className="space-y-10">
                                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block border-b pb-4" style={{ borderColor: `${theme.text}10` }}>
                                      {data.historyTitle}
                                  </span>
                                  {selectedItem.details && selectedItem.details.length > 0 ? (
                                    selectedItem.details.map((block: any, idx: number) => (
                                        <motion.div 
                                          key={idx}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.4 + (idx * 0.1) }}
                                        >
                                            <h4 className="text-lg font-black uppercase tracking-tight mb-3 opacity-90" style={{ color: theme.primary }}>{block.title}</h4>
                                            <p className="text-base leading-relaxed opacity-70 font-medium">
                                                {block.content}
                                            </p>
                                        </motion.div>
                                    ))
                                  ) : (
                                    <div>
                                        <p className="text-base md:text-lg opacity-70 leading-relaxed font-medium whitespace-pre-wrap">
                                            {selectedItem.history}
                                        </p>
                                    </div>
                                  )}
                              </div>

                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="p-10 space-y-8 rounded-none mt-auto border"
                                style={{ backgroundColor: `${theme.primary}05`, borderColor: `${theme.primary}10` }}
                              >
                                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block">{data.specifications}</span>
                                  <div className="grid grid-cols-2 gap-8">
                                      {Object.entries(selectedItem.specs).map(([key, value]: [string, any]) => (
                                          <div key={key}>
                                              <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">{key}</span>
                                              <span className="text-sm font-bold uppercase" style={{ color: theme.primary }}>{value}</span>
                                          </div>
                                      ))}
                                  </div>
                              </motion.div>
                          </motion.div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </>
  );
};