import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { localizedData } from '../../data_localized';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../ui/PageTransition';
import {
  Tent, Building, TreeDeciduous, Filter, ArrowUpRight,
  X, MapPin, Star, Check, ArrowLeft, ArrowRight, Phone, Mail
} from '../ui/icons';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageHero, PageFilterBar } from '../ui/PageShell';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { ReviewSection } from '../reviews/ReviewSection';
import { PartnerCTA } from '../ui/PartnerCTA';
import { useSearchParams } from 'react-router';
import { KAZAKHSTAN_CITIES, getCityById, type KZCity } from '../../data/kazakhstan-cities';
import { SearchBar, type SearchParams } from '../search/SearchBar';
import { CityGrid } from '../search/CityGrid';

type Currency = 'USD' | 'KZT' | 'RUB';

const DigitalFootprint = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
    <path d="M2 22L12 2L22 22H17L12 12L7 22H2Z" strokeLinejoin="miter" strokeLinecap="square" />
    <path d="M12 12V22" strokeLinejoin="miter" strokeLinecap="square" />
    <path d="M2 12H22" strokeLinejoin="miter" strokeLinecap="square" strokeDasharray="2 4" opacity="0.3" />
  </svg>
);

const ViewToggleIcon = ({ mode, active }: { mode: string, active: boolean }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" strokeLinecap="square" className={`transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>
      {mode === 'list' && (
        <>
          <rect x="2" y="3" width="12" height="4" />
          <rect x="2" y="9" width="12" height="4" />
        </>
      )}
      {mode === 'grid-2' && (
        <>
          <rect x="2" y="2" width="5" height="12" />
          <rect x="9" y="2" width="5" height="12" />
        </>
      )}
      {mode === 'grid-3' && (
        <>
          <rect x="1" y="3" width="3.5" height="10" />
          <rect x="6.25" y="3" width="3.5" height="10" />
          <rect x="11.5" y="3" width="3.5" height="10" />
        </>
      )}
    </svg>
  );
};

const AccommodationBlock = React.forwardRef(({ acc, index, theme, labels, currency, formatPrice, onSelect, onBook, language, viewMode }: any, ref: any) => {
  const isList = viewMode === 'list';
  const isGrid2 = viewMode === 'grid-2';
  
  const [currentImg, setCurrentImg] = useState(0);
  const images = [acc.image, `${acc.image}&sig=1`, `${acc.image}&sig=2`, `${acc.image}&sig=3`];

  const nextImg = (e: any) => { e.stopPropagation(); setCurrentImg((i) => (i + 1) % images.length); };
  const prevImg = (e: any) => { e.stopPropagation(); setCurrentImg((i) => (i - 1 + images.length) % images.length); };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col group border-b ${!isList ? 'border-r' : ''}`}
      style={{ borderColor: `${theme.text}15`, backgroundColor: `${theme.background}80` }}
    >
      <div className={`flex ${isList ? 'flex-col lg:flex-row' : 'flex-col'} w-full h-full`}>
        {/* IMAGE SECTION with Carousel */}
        <div 
          className={`relative overflow-hidden bg-black cursor-pointer group/img shrink-0 ${isList ? 'w-full lg:w-[45%] h-[350px] lg:h-[450px]' : 'w-full h-[300px]'}`} 
          onClick={() => onSelect(acc)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <ResponsiveImage src={images[currentImg]} className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 transition-opacity" />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Info Tags */}
          <div className="absolute top-4 left-4 flex gap-2">
             <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] bg-black/80 text-white backdrop-blur-xl border shadow-xl" style={{ borderColor: `${theme.primary}50` }}>
               {acc.type}
             </span>
             <span className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] bg-white text-black flex items-center shadow-xl">
               {acc.rating}
             </span>
          </div>

          {/* Carousel Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
            <button onClick={prevImg} className="p-2 bg-black/50 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={nextImg} className="p-2 bg-black/50 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`h-[2px] transition-all ${i === currentImg ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
            ))}
          </div>

          {/* Digital Footprint Watermark */}
          <DigitalFootprint className="absolute -bottom-10 -right-10 w-40 h-40 text-white opacity-[0.03] pointer-events-none" />
        </div>

        {/* CONTENT SECTION */}
        <div className={`flex flex-col justify-between relative z-10 w-full ${isList ? 'lg:w-[55%] p-8 lg:p-12 lg:border-l' : 'p-6 md:p-8'}`} style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.background}E6` }}>
           
           <div className="flex flex-col h-full space-y-8">
             {/* Header */}
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3" style={{ color: theme.primary }}>
                   <DigitalFootprint className="w-4 h-4" />
                   <span className="text-[9px] font-black uppercase tracking-[0.4em]">{acc.region}</span>
                 </div>
                 <span className="text-[10px] font-black font-mono tracking-widest opacity-30">
                   NO.{String(index + 1).padStart(3, '0')}
                 </span>
               </div>
               <h3 className={`font-black uppercase leading-[0.9] tracking-tighter hover:underline cursor-pointer transition-colors ${isList ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'}`} onClick={() => onSelect(acc)}>
                 {acc.name}
               </h3>
             </div>

             {/* Differentiated Content Grid */}
             <div className={`grid ${isList ? 'grid-cols-2 gap-8' : 'grid-cols-1 gap-6'} border-t pt-6 h-full`} style={{ borderColor: `${theme.text}10` }}>
               
               {/* Description Side */}
               <div className="flex flex-col">
                 <p className="text-xs leading-relaxed opacity-70 border-l pl-4" style={{ borderColor: theme.primary }}>
                   {acc.description}
                 </p>
                 {acc.contacts && (
                   <div className="mt-auto pt-6 space-y-2">
                     <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 block mb-2">{labels.contact || 'COMM'}</span>
                     {acc.contacts.phone && <div className="text-[10px] font-mono font-black tracking-[0.2em]">{acc.contacts.phone}</div>}
                     {acc.contacts.email && <div className="text-[10px] font-mono font-black tracking-[0.1em] lowercase">{acc.contacts.email}</div>}
                   </div>
                 )}
               </div>

               {/* Specs Side */}
               {acc.specs && (
                 <div className="flex flex-col">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 block mb-4">{labels.specs || 'DATA'}</span>
                   <div className={`grid ${isGrid2 && !isList ? 'grid-cols-2' : 'grid-cols-2'} gap-y-4 gap-x-2`}>
                     {Object.entries(acc.specs).slice(0, 4).map(([k, v]: [string, any]) => (
                       <div key={k} className="flex flex-col p-3 bg-current/[0.03] border" style={{ borderColor: `${theme.text}08` }}>
                         <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">{k}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           </div>

           {/* Footer Action Area */}
           <div className={`mt-8 flex items-end justify-between border-t pt-6`} style={{ borderColor: `${theme.text}10` }}>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">{labels.obligation || 'PRICE'}</span>
                <div className="flex items-baseline gap-2">
                  <span className={`font-black font-mono tracking-tighter ${isList ? 'text-3xl' : 'text-2xl'}`} style={{ color: theme.primary }}>{formatPrice(acc.price)}</span>
                  <span className="text-[9px] font-black uppercase opacity-50 tracking-widest">/ {labels.perCycle || 'NT'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onSelect(acc)} className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] border transition-colors hover:bg-current/5" style={{ borderColor: `${theme.text}20` }}>
                   +
                </button>
                <button onClick={() => onBook(acc)} className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 hover:scale-95 border" style={{ backgroundColor: theme.primary, color: theme.primaryForeground, borderColor: theme.primary }}>
                   <span>{labels.initiate || 'RSV'}</span>
                   <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
});

AccommodationBlock.displayName = 'AccommodationBlock';

export const StaysPage = () => {
  const onNavigate = useAppNavigate();
  const { theme } = useSeason();
  const { language } = useLanguage();
  const { notify } = useNotification();
  const [filter, setFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [viewMode, setViewMode] = useState<'list' | 'grid-2' | 'grid-3'>('list');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (selectedStay) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedStay]);

  if (!theme) return null;

  const currentLangData = localizedData[language] || localizedData['en'];
  const content = currentLangData?.stays || localizedData['en'].stays;
  if (!content) return <div>Loading...</div>;

  const staysData = content.items || [];
  const labels = content.labels || {};

  const rates = { USD: 1, KZT: 480, RUB: 92 };
  const symbols = { USD: '$', KZT: '₸', RUB: '₽' };
  const formatPrice = (usd: number) => {
    const converted = Math.round(usd * rates[currency]);
    return `${symbols[currency]}${converted.toLocaleString()}`;
  };

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('yurt') || t.includes('юрта') || t.includes('киіз')) return Tent;
    if (t.includes('hotel') || t.includes('отель') || t.includes('үй')) return Building;
    return TreeDeciduous;
  };

  const uniqueTypes = Array.from(new Set(staysData.map((s: any) => s.type)));
  const types = [
    { id: 'All', label: content.filters?.all || 'All', icon: Filter },
    ...uniqueTypes.map((type: any) => ({ id: type, label: type, icon: getIconForType(type) })),
  ];

  // City filter from URL params
  const cityParam = searchParams.get('city');
  const selectedCityObj = cityParam ? getCityById(cityParam) : null;
  const lang = language as 'en' | 'ru' | 'kz';

  // Get unique regions from stays data for city chip filters
  const uniqueRegions = Array.from(new Set(staysData.map((s: any) => s.region)));

  const filteredAccommodations = staysData.filter((acc: any) => {
    const matchesType = filter === 'All' || acc.type === filter;
    const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    // City-based filtering: match region name against city name
    let matchesCity = true;
    if (selectedCityObj) {
      const cityNames = [selectedCityObj.name.en, selectedCityObj.name.ru, selectedCityObj.name.kz, selectedCityObj.region.en, selectedCityObj.region.ru, selectedCityObj.region.kz].map(n => n.toLowerCase());
      matchesCity = cityNames.some(cn => acc.region.toLowerCase().includes(cn) || cn.includes(acc.region.toLowerCase()));
    }
    return matchesType && matchesPrice && matchesCity;
  });

  const handleCheckAvailability = (acc: any) => {
    localStorage.setItem('kendala_pending_activity', JSON.stringify({ ...acc, type: 'stay' }));
    notify(language === 'kz' ? 'Брондау жүйесіне өту...' : language === 'ru' ? 'Переход к бронированию...' : 'Redirecting to booking...', "action");
    onNavigate('planner');
  };

  const clearCityFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('city');
    setSearchParams(params);
  };

  return (
    <PageTransition>
      <>
        <div className="min-h-screen font-sans pb-32" style={{ background: theme.background, color: theme.text }}>
          {/* ── Hero ── */}
          <PageHero
            image="https://images.unsplash.com/photo-1751440407280-ccb983813c6c?w=1200&q=80&fm=webp&auto=format&fit=crop"
            tag={content.title}
            title={content.subtitle?.split(' ').slice(0, 3).join(' ') || 'Stays'}
            subtitle={content.subtitle?.split(' ').slice(3).join(' ') || ''}
            count={filteredAccommodations.length}
            countLabel={labels.unitsMapped}
            theme={theme}
          >
            {/* Currency switcher inside hero */}
            <div className="flex items-center gap-4">
              <div className="flex border p-1 backdrop-blur-md" style={{ borderColor: `${theme.text}15` }}>
                {(['USD', 'KZT', 'RUB'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className="px-4 py-2 text-[10px] font-black transition-all"
                    style={{
                      backgroundColor: currency === c ? theme.primary : 'transparent',
                      color: currency === c ? (theme.primaryForeground || '#fff') : theme.text,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{labels.threshold}</span>
              <input
                type="range" min="50" max="1000" step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-40 h-1 bg-current/20 appearance-none cursor-pointer"
                style={{ accentColor: theme.primary }}
              />
              <span className="text-sm font-black font-mono" style={{ color: theme.primary }}>{formatPrice(priceRange[1])}</span>
            </div>
          </PageHero>

          {/* ── Inline Search + City Filter ── */}
          <div className="border-b" style={{ backgroundColor: `${theme.background}F0`, borderColor: `${theme.text}08` }}>
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4">
              <SearchBar
                theme={theme}
                language={lang}
                onSearch={(params: SearchParams) => {
                  const p = new URLSearchParams(searchParams);
                  if (params.cityId) p.set('city', params.cityId); else p.delete('city');
                  setSearchParams(p);
                }}
                variant="inline"
              />
            </div>

            {/* Active city filter chip */}
            {selectedCityObj && (
              <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
                    {lang === 'ru' ? 'Фильтр:' : lang === 'kz' ? 'Сүзгі:' : 'Filtered:'}
                  </span>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.2em]"
                    style={{ borderColor: theme.primary, color: theme.primary }}
                  >
                    <MapPin className="w-3 h-3" />
                    {selectedCityObj.name[lang]}
                    <button onClick={clearCityFilter} className="ml-1 hover:opacity-60">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[9px] font-mono opacity-30">
                    {filteredAccommodations.length} {lang === 'ru' ? 'результатов' : lang === 'kz' ? 'нәтиже' : 'results'}
                  </span>
                </div>
              </div>
            )}

            {/* City quick-select chips (scrollable) */}
            {!selectedCityObj && (
              <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 shrink-0 mr-2">
                    {lang === 'ru' ? 'Города:' : lang === 'kz' ? 'Қалалар:' : 'Cities:'}
                  </span>
                  {KAZAKHSTAN_CITIES.filter(c => c.tier <= 2).slice(0, 15).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        const p = new URLSearchParams(searchParams);
                        p.set('city', city.id);
                        setSearchParams(p);
                      }}
                      className="shrink-0 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border transition-colors hover:border-current/30 hover:bg-current/5"
                      style={{ borderColor: `${theme.text}10`, color: `${theme.text}70` }}
                    >
                      {city.name[lang]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Filter Bar ── */}
          <PageFilterBar
            filters={types}
            active={filter}
            onFilter={setFilter}
            theme={theme}
            rightContent={
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 hidden lg:inline" style={{ color: theme.text }}>
                  {filteredAccommodations.length} {labels.unitsMapped}
                </span>
                
                <div className="flex border" style={{ borderColor: `${theme.text}10` }}>
                  {(['list', 'grid-2', 'grid-3'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className="p-3 transition-colors hover:bg-current/5 border-l first:border-l-0"
                      style={{ borderColor: `${theme.text}10` }}
                    >
                      <ViewToggleIcon mode={mode} active={viewMode === mode} />
                    </button>
                  ))}
                </div>
              </div>
            }
          />

          {/* ── Card Grid ── */}
          <div className="max-w-[1800px] mx-auto border-x" style={{ borderColor: `${theme.text}10` }}>
            <div className={`
              ${viewMode === 'list' ? 'flex flex-col' : ''}
              ${viewMode === 'grid-2' ? 'grid grid-cols-1 lg:grid-cols-2' : ''}
              ${viewMode === 'grid-3' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}
            `}>
              <AnimatePresence mode="popLayout">
                {filteredAccommodations.map((acc: any, idx: number) => (
                  <AccommodationBlock
                    key={acc.id}
                    acc={acc}
                    index={idx}
                    theme={theme}
                    labels={labels}
                    currency={currency}
                    formatPrice={formatPrice}
                    onSelect={setSelectedStay}
                    onBook={handleCheckAvailability}
                    language={language}
                    viewMode={viewMode}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Partner CTA */}
            <div className="px-6 md:px-12 py-24 border-t" style={{ borderColor: `${theme.text}10` }}>
              <PartnerCTA variant="stays" theme={theme} language={language} />
            </div>
          </div>
        </div>

        {/* ── Detail Modal (Portal) ── */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedStay && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-12 overflow-hidden">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStay(null)} className="absolute inset-0 bg-black/80 backdrop-blur-2xl cursor-pointer" />

                <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-hide border mx-auto z-10"
                  style={{ backgroundColor: theme.background, color: theme.text, borderColor: `${theme.primary}20` }}
                >
                  <button onClick={() => setSelectedStay(null)} className="fixed top-20 right-6 md:top-6 z-[10001] p-5 transition-all shadow-2xl cursor-pointer border hover:scale-105" style={{ backgroundColor: theme.primary, color: theme.primaryForeground, borderColor: `${theme.primaryForeground}40` }}><X className="w-5 h-5" /></button>

                  {/* Image Header */}
                  <div className="relative h-[50vh] md:h-[75vh] w-full flex bg-black">
                    <div className="w-full md:w-3/4 relative overflow-hidden border-r" style={{ borderColor: `${theme.primary}20` }}>
                      <ResponsiveImage src={selectedStay.image} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 p-8 md:p-20 w-full text-white space-y-6">
                        <div className="flex gap-4">
                          <span className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] bg-white text-black shadow-xl">
                            {selectedStay.type}
                          </span>
                          <span className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 shadow-xl">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {selectedStay.rating}
                          </span>
                        </div>
                        <h2 className="text-5xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter drop-shadow-2xl">{selectedStay.name}</h2>
                        <div className="flex items-center gap-4 text-white/80"><MapPin className="w-5 h-5 text-amber-500" /><span className="text-base font-black uppercase tracking-[0.4em]">{selectedStay.region}, {language === 'kz' ? 'Қазақстан' : language === 'ru' ? 'Казахстан' : 'Kazakhstan'}</span></div>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex flex-col w-1/4">
                      <div className="h-1/2 relative overflow-hidden border-b" style={{ borderColor: `${theme.primary}20` }}>
                        <ResponsiveImage src={`${selectedStay.image}&sig=1`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="h-1/2 relative overflow-hidden group">
                        <ResponsiveImage src={`${selectedStay.image}&sig=2`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-[12px] font-black uppercase tracking-[0.4em]">+12 Media</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 md:p-24 space-y-24 md:space-y-40">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 md:gap-32">
                      <div className="xl:col-span-7 space-y-16">
                        <div className="flex items-center gap-6 mb-12">
                           <div className="w-16 h-[2px]" style={{ backgroundColor: theme.primary }} />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: theme.primary }}>{labels.briefing}</h3>
                        </div>
                        
                        <div className="relative group p-8 md:p-12 border bg-current/[0.02] overflow-hidden" style={{ borderColor: `${theme.text}10` }}>
                          <DigitalFootprint className="absolute -bottom-24 -right-24 w-96 h-96 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-[2s] group-hover:scale-110 group-hover:rotate-0" style={{ color: theme.primary }} />
                          
                          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            <div className="shrink-0 flex flex-col items-center gap-6">
                              <div className="w-16 h-16 flex items-center justify-center border" style={{ borderColor: `${theme.primary}40`, backgroundColor: `${theme.primary}05` }}>
                                <DigitalFootprint className="w-8 h-8" style={{ color: theme.primary }} />
                              </div>
                              <div className="w-[1px] h-24 bg-gradient-to-b from-current to-transparent opacity-20 hidden md:block" />
                            </div>
                            
                            <div className="flex flex-col gap-6 pt-2">
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] px-3 py-1 border" style={{ borderColor: `${theme.text}20` }}>Kendala</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Verified Property</span>
                              </div>
                              
                              <p className="text-xl md:text-[28px] leading-[1.6] opacity-90 font-medium tracking-tight">
                                <span className="float-left text-6xl md:text-[80px] leading-[0.8] font-black mr-4 mb-[-0.2em] mt-[-0.1em]" style={{ color: theme.primary }}>
                                  {typeof selectedStay.description === 'string' ? selectedStay.description.charAt(0) : ''}
                                </span>
                                {typeof selectedStay.description === 'string' ? selectedStay.description.slice(1) : selectedStay.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedStay.inclusions && selectedStay.inclusions.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
                            {selectedStay.inclusions.map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-6 p-8 border bg-current/[0.02] hover:bg-current/[0.05] transition-colors" style={{ borderColor: `${theme.primary}15` }}>
                                <Check className="w-5 h-5 shrink-0" style={{ color: theme.primary }} />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="xl:col-span-5 space-y-16">
                        <div className="bg-current/[0.03] p-10 md:p-16 border space-y-12 backdrop-blur-3xl" style={{ borderColor: `${theme.text}10` }}>
                          <h4 className="text-[10px] font-black uppercase border-b pb-8 tracking-[0.4em]" style={{ color: theme.primary, borderColor: `${theme.text}15` }}>{labels.specs}</h4>
                          <div className="space-y-6">
                            {Object.entries(selectedStay.specs || {}).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex justify-between items-center border-b pb-6 last:border-0 hover:bg-current/5 p-4 -mx-4 transition-colors" style={{ borderColor: `${theme.text}08` }}>
                                <span className="text-[9px] font-black uppercase opacity-50 tracking-[0.3em]">{key}</span>
                                <span className="text-xs font-black uppercase tracking-widest">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-current/[0.03] p-10 md:p-16 border space-y-12 backdrop-blur-3xl" style={{ borderColor: `${theme.text}10` }}>
                          <h4 className="text-[10px] font-black uppercase border-b pb-8 tracking-[0.4em]" style={{ color: theme.primary, borderColor: `${theme.text}15` }}>{labels.contact}</h4>
                          <div className="space-y-8">
                            <div className="flex gap-6 items-center hover:bg-current/5 p-4 -mx-4 transition-colors group">
                               <Phone className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: theme.primary }} />
                               <span className="text-sm font-mono font-black tracking-[0.2em]">{selectedStay.contacts?.phone}</span>
                            </div>
                            <div className="flex gap-6 items-center hover:bg-current/5 p-4 -mx-4 transition-colors group">
                               <Mail className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: theme.primary }} />
                               <span className="text-sm font-mono font-black tracking-[0.1em] lowercase">{selectedStay.contacts?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-10 md:p-20 border bg-current/[0.01] shadow-2xl" style={{ borderColor: `${theme.text}10` }}>
                      <ReviewSection targetId={selectedStay.id} targetType="stay" targetName={selectedStay.name} />
                    </div>

                    <div className="border-t-4 pt-24 pb-12 flex flex-col md:flex-row justify-between items-end gap-16" style={{ borderColor: theme.primary }}>
                      <div className="text-center md:text-left">
                        <span className="text-[10px] font-black uppercase opacity-40 mb-6 block tracking-[0.5em]">{labels.obligation}</span>
                        <div className="flex items-baseline gap-6">
                          <span className="text-7xl md:text-[150px] leading-none font-black font-mono tracking-tighter drop-shadow-2xl" style={{ color: theme.primary }}>{formatPrice(selectedStay.price)}</span>
                          <span className="text-xl md:text-3xl font-black uppercase opacity-60 tracking-widest">/ {labels.perCycle}</span>
                        </div>
                      </div>
                      <button onClick={() => handleCheckAvailability(selectedStay)} className="w-full md:w-auto px-20 py-12 text-lg font-black uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-8 group shadow-2xl hover:scale-105" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                        <span>{labels.initiate}</span><ArrowUpRight className="w-10 h-10 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px; height: 24px;
            background: currentColor; cursor: pointer;
            border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
        `}</style>
      </>
    </PageTransition>
  );
};