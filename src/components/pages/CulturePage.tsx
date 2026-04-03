import React, { useState, useRef } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { projectId } from '../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { 
    ArrowRight, X, ChevronLeft, ChevronRight,
    MapPin, Star
} from '../ui/icons';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { cultureData } from '../data/CultureData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 }
  },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.2, duration: 0.35 }
  }
};

export const CulturePage = () => {
  const { theme } = useSeason();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('music');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  if (!theme) return null;

  const data = cultureData[language] || cultureData['en'];
  const items = data?.items?.[activeTab] || [];
  const activeSection = data.sections.find((s: any) => s.id === activeTab);

  const scrollTabs = (dir: 'left' | 'right') => {
    if (tabScrollRef.current) {
      tabScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      <PageTransition>
        <div className="min-h-screen font-sans" style={{ background: theme.background, color: theme.text }}>
          
          {/* ─── HERO ─── */}
          <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
              <ResponsiveImage 
                src={`https://${projectId}.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abay_qunanbayuli.jpg`} 
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-20 max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-black" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                      K
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                      {data.archiveLabel}
                    </span>
                    <span className="w-12 h-px bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      {data.sections.length} {language === 'en' ? 'Collections' : language === 'ru' ? 'Коллекций' : 'Жинақ'}
                    </span>
                  </div>

                  <h1 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-white mb-5"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
                  >
                    {data.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                    {data.subtitle}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ─── TAB BAR ─── */}
          <div className="sticky top-0 z-30 border-b" style={{ backgroundColor: theme.background, borderColor: `${theme.text}10` }}>
            <div className="relative px-4 md:px-12 lg:px-20">
              {/* Scroll arrows for mobile */}
              <button 
                onClick={() => scrollTabs('left')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 md:hidden"
                style={{ color: theme.text }}
              >
                <ChevronLeft className="w-4 h-4 opacity-40" />
              </button>
              <button 
                onClick={() => scrollTabs('right')} 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 md:hidden"
                style={{ color: theme.text }}
              >
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>

              <div 
                ref={tabScrollRef}
                className="flex gap-1 overflow-x-auto no-scrollbar py-1 px-6 md:px-0"
              >
                {data.sections.map((section: any) => {
                  const Icon = section.icon;
                  const isActive = activeTab === section.id;
                  const count = data?.items?.[section.id]?.length || 0;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className="relative flex items-center gap-2.5 px-5 py-4 transition-all duration-300 whitespace-nowrap shrink-0 group"
                      style={{ color: isActive ? theme.primary : `${theme.text}60` }}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-xs font-black uppercase tracking-wider">{section.title}</span>
                      <span 
                        className="text-[9px] font-black px-1.5 py-0.5 transition-colors duration-300"
                        style={{ 
                          backgroundColor: isActive ? `${theme.primary}15` : `${theme.text}08`,
                          color: isActive ? theme.primary : `${theme.text}40`
                        }}
                      >
                        {count}
                      </span>
                      {/* Active indicator line */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ backgroundColor: theme.primary }}
                        initial={false}
                        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── CONTENT ─── */}
          <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">

              {/* Section header */}
              <motion.div
                key={`header-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-end justify-between mb-10"
              >
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] block mb-2" style={{ color: theme.primary }}>
                    {activeSection?.label}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    {activeSection?.title}
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30 hidden md:block">
                  {items.length} {language === 'en' ? 'Items' : language === 'ru' ? 'Элементов' : 'Элемент'}
                </span>
              </motion.div>

              {/* Cards grid - ALL SAME SIZE */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {items.map((item: any, idx: number) => (
                    <motion.div
                      variants={itemVariants}
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group cursor-pointer relative h-[380px] overflow-hidden border transition-all duration-500 hover:border-transparent"
                      style={{ 
                        backgroundColor: theme.cardBg,
                        borderColor: `${theme.text}08`
                      }}
                    >
                      {/* Image */}
                      <div className="absolute inset-0 overflow-hidden">
                        <ResponsiveImage 
                          src={item.image} 
                          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                      </div>

                      {/* Index badge */}
                      <div className="absolute top-5 left-5 z-10">
                        <div 
                          className="w-9 h-9 flex items-center justify-center text-[11px] font-black transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>

                      {/* Specs pills on hover */}
                      <div className="absolute top-5 right-5 z-10 flex flex-col gap-1.5 items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        {Object.entries(item.specs).slice(0, 2).map(([key, value]: [string, any]) => (
                          <span 
                            key={key}
                            className="text-[8px] font-black uppercase tracking-wider px-2 py-1 bg-white/10 text-white/80 backdrop-blur-sm"
                          >
                            {value}
                          </span>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/50 mb-4 line-clamp-2 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                            {item.desc}
                          </p>
                          
                          {/* View details bar */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">{data.viewDetails}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/60 -translate-x-2 group-hover:translate-x-0 transition-transform duration-300" />
                          </div>
                        </div>

                        {/* Accent line */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                          style={{ backgroundColor: theme.primary }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PageTransition>

      {/* ─── DETAIL MODAL ─── */}
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
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border"
              style={{ backgroundColor: theme.background, color: theme.text, borderColor: `${theme.primary}15` }}
            >
              {/* Left: Image panel */}
              <div className="w-full md:w-[45%] h-[35vh] md:h-auto relative overflow-hidden shrink-0">
                <ResponsiveImage src={selectedItem.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] bg-white text-black">
                      {data.culturalArtifact}
                    </span>
                    {selectedItem.specs?.Origin && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-70">
                        <MapPin className="w-3 h-3" /> {selectedItem.specs.Origin}
                      </span>
                    )}
                    {selectedItem.specs?.Period && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-70">
                        <Star className="w-3 h-3" /> {selectedItem.specs.Period}
                      </span>
                    )}
                  </div>
                  <h2 
                    className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.05] mb-4 break-words"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  >
                    {selectedItem.name}
                  </h2>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                    <div className="w-7 h-7 flex items-center justify-center text-xs font-black" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                      K
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider">Kendala Archive</p>
                      <p className="text-[8px] uppercase tracking-[0.15em] opacity-50">
                        {language === 'en' ? 'Heritage Documentation' : language === 'ru' ? 'Документация Наследия' : 'Мұра Құжаттамасы'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content panel */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar relative">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 p-3 transition-all z-50 group border mt-16 md:mt-0"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground, borderColor: 'transparent' }}
                >
                  <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                </button>

                <motion.div 
                  variants={modalContentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-10 pt-2 md:pt-0"
                >
                  {/* Description */}
                  <p className="text-lg md:text-xl leading-relaxed opacity-80 border-l-3 pl-5" style={{ borderColor: theme.primary }}>
                    {selectedItem.desc}
                  </p>

                  {/* Details */}
                  <div className="space-y-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 block border-b pb-3 mb-6" style={{ borderColor: `${theme.text}08` }}>
                      {data.historyTitle}
                    </span>
                    {selectedItem.details && selectedItem.details.length > 0 ? (
                      selectedItem.details.map((block: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="relative pb-8 mb-8 border-b last:border-b-0 last:mb-0 last:pb-0"
                          style={{ borderColor: `${theme.text}06` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: `${theme.primary}12`, color: theme.primary }}>
                              {String(idx + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black uppercase tracking-tight mb-3" style={{ color: theme.primary }}>{block.title}</h4>
                              <p className="text-sm leading-[1.85] opacity-60">
                                {block.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm opacity-60 leading-relaxed whitespace-pre-wrap">
                        {selectedItem.history}
                      </p>
                    )}
                  </div>

                  {/* Specs */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-6 space-y-5 border"
                    style={{ backgroundColor: `${theme.primary}05`, borderColor: `${theme.primary}10` }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 block">{data.specifications}</span>
                    <div className="grid grid-cols-2 gap-5">
                      {Object.entries(selectedItem.specs).map(([key, value]: [string, any]) => (
                        <div key={key}>
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-30 block mb-0.5">{key}</span>
                          <span className="text-xs font-bold uppercase" style={{ color: theme.primary }}>{value}</span>
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