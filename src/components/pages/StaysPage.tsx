import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { localizedData } from '../../data_localized';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tent, Building, TreeDeciduous, Filter, ArrowUpRight, 
  X, MapPin, Star, Compass, Wifi, 
  Coffee, Sun, Car, Check, ShieldCheck, Clock, Quote,
  Phone, Mail, Globe, Wind
} from '../ui/icons';
import { ResponsiveImage } from '../ui/ResponsiveImage';

type Currency = 'USD' | 'KZT' | 'RUB';

export const StaysPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const { notify } = useNotification();
  const [filter, setFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    if (selectedStay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
    ...uniqueTypes.map((type: any) => ({
      id: type,
      label: type,
      icon: getIconForType(type)
    }))
  ];

  const filteredAccommodations = staysData.filter((acc: any) => {
    const matchesType = filter === 'All' || acc.type === filter;
    const matchesPrice = acc.price >= priceRange[0] && acc.price <= priceRange[1];
    return matchesType && matchesPrice;
  });

  const handleCheckAvailability = (acc: any) => {
      localStorage.setItem('kendala_pending_activity', JSON.stringify({ ...acc, type: 'stay' }));
      notify(language === 'kz' ? 'Брондау жүйесіне өту...' : 'Переход к бронированию...', "action");
      onNavigate('planner');
  };

  const handleCurrencyChange = (c: Currency) => {
      setCurrency(c);
  };

  return (
    <>
        <div className="min-h-screen font-sans selection:bg-amber-500 selection:text-white pb-32" style={{ background: theme.background, color: theme.text }}>
          
          {/* Cinematic Hero */}
          <section className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-end">
            <div className="absolute inset-0">
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1730292422292-a9d56373a0a4" 
                className="w-full h-full object-cover scale-[1.01]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
            </div>
            <div className="relative z-10 w-full container mx-auto px-6 md:px-12 max-w-[1800px] pb-16 md:pb-24">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/30 mb-8 backdrop-blur-md">
                        <Wind className="w-4 h-4 text-white/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{content.title}</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-6 text-white"
                      style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                        {content.subtitle?.split(' ').slice(0, 2).join(' ')} <br/>
                        <span className="opacity-50">{content.subtitle?.split(' ').slice(2).join(' ')}</span>
                    </h1>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-6 pb-2">
                    <div className="flex border border-white/20 p-1 backdrop-blur-md">
                        {(['USD', 'KZT', 'RUB'] as Currency[]).map((c) => (
                            <button key={c} onClick={() => handleCurrencyChange(c)} className={`px-4 py-2 text-[10px] font-black transition-all rounded-none ${currency === c ? 'bg-white text-black shadow-lg' : 'text-white/70 hover:text-white'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-6xl font-black text-white">{filteredAccommodations.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{labels.unitsMapped}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Filters & Grid */}
          <div className="container mx-auto px-6 md:px-12 max-w-[1800px] -mt-8 relative z-20">
            <div className="sticky top-4 z-40 mb-16">
              <div className="backdrop-blur-xl border p-2 shadow-2xl flex flex-col lg:flex-row justify-between gap-4" style={{ background: `${theme.background}EE`, borderColor: `${theme.primary}20` }}>
                  <div className="flex overflow-x-auto no-scrollbar gap-2 p-1">
                    {types.map(type => {
                      const Icon = type.icon;
                      const isActive = filter === type.id;
                      return (
                        <button key={type.id} onClick={() => setFilter(type.id)} className={`px-6 py-3 flex items-center gap-3 transition-all whitespace-nowrap group rounded-none ${isActive ? 'shadow-lg' : 'hover:bg-current/5'}`} 
                          style={{ 
                            backgroundColor: isActive ? theme.primary : 'transparent', 
                            color: isActive ? theme.primaryForeground : theme.text 
                          }}>
                            <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-6 px-8 border-l ml-auto bg-current/5 min-w-[300px]" style={{ borderColor: `${theme.text}10` }}>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{labels.threshold}</span>
                    <input type="range" min="50" max="1000" step="50" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-1 bg-current/20 appearance-none cursor-pointer accent-current" style={{ accentColor: theme.primary }} />
                    <span className="text-sm font-black w-24 text-right font-mono" style={{ color: theme.primary }}>{formatPrice(priceRange[1])}</span>
                  </div>
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
              <AnimatePresence mode="popLayout">
                {filteredAccommodations.map((acc: any, idx: number) => (
                  <motion.div key={acc.id} layout initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedStay(acc)}
                    className="group relative flex flex-col h-full bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-current/5 rounded-none"
                    style={{ backgroundColor: theme.cardBg }}
                  >
                      <div className="relative aspect-[4/3] overflow-hidden">
                          <ResponsiveImage src={acc.image} alt={acc.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                          <div className="absolute top-4 left-4 flex gap-2">
                               <span className="px-3 py-1 backdrop-blur-md text-[9px] font-black uppercase tracking-widest border rounded-none" style={{ backgroundColor: `${theme.primary}80`, color: theme.primaryForeground, borderColor: `${theme.primaryForeground}40` }}>{acc.type}</span>
                          </div>
                          <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-xs font-black flex items-center gap-1 shadow-xl rounded-none">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{acc.rating}
                          </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-2xl font-black uppercase leading-tight tracking-tight group-hover:text-amber-600 transition-colors mb-4">{acc.name}</h3>
                          <div className="grid grid-cols-2 gap-4 mb-6 opacity-60">
                              {acc.specs.checkIn && <div className="flex items-center gap-2"><Clock className="w-3 h-3" /><span className="text-[9px] font-bold uppercase tracking-wide">{language === 'ru' ? 'Заезд' : language === 'kz' ? 'Кіру' : 'In'}: {acc.specs.checkIn}</span></div>}
                              {acc.specs.view && <div className="flex items-center gap-2"><Compass className="w-3 h-3" /><span className="text-[9px] font-bold uppercase tracking-wide">{acc.specs.view}</span></div>}
                          </div>
                          <div className="mt-auto pt-6 border-t flex items-center justify-between" style={{ borderColor: `${theme.text}10` }}>
                              <div>
                                  <span className="block text-2xl font-black font-mono" style={{ color: theme.primary }}>{formatPrice(acc.price)}</span>
                                  <span className="text-[8px] font-black uppercase opacity-40">{labels.perCycle}</span>
                              </div>
                              <button className="w-10 h-10 border flex items-center justify-center transition-all duration-300 rounded-none group-hover:shadow-xl" 
                                style={{ borderColor: `${theme.primary}40`, backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primary; e.currentTarget.style.color = theme.primaryForeground; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'inherit'; }}
                              >
                                  <ArrowUpRight className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

      {/* MODAL PORTAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedStay && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-12 overflow-hidden">
                {/* Backdrop */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStay(null)} className="absolute inset-0 bg-black/80 backdrop-blur-2xl cursor-pointer" />
                
                {/* Modal Container */}
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto rounded-none scrollbar-hide border mx-auto z-10"
                    style={{ backgroundColor: theme.background, color: theme.text, borderColor: `${theme.primary}20` }}
                >
                    {/* Close Btn */}
                    <button onClick={() => setSelectedStay(null)} className="fixed top-20 right-6 md:top-6 z-[10001] p-4 transition-all shadow-2xl rounded-none cursor-pointer border border-white/10"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image Header */}
                    <div className="relative h-[40vh] md:h-[65vh] w-full grid grid-cols-4 grid-rows-2 gap-1 bg-current/5">
                        <div className="col-span-4 md:col-span-3 row-span-2 relative overflow-hidden"><ResponsiveImage src={selectedStay.image} className="w-full h-full object-cover" /></div>
                        <div className="hidden md:block col-span-1 row-span-1 overflow-hidden relative"><ResponsiveImage src={`${selectedStay.image}&sig=1`} className="w-full h-full object-cover" /></div>
                        <div className="hidden md:block col-span-1 row-span-1 overflow-hidden relative"><ResponsiveImage src={`${selectedStay.image}&sig=2`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">+12 Photos</div></div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full bg-gradient-to-t from-black/90 via-black/30 to-transparent text-white">
                            <h2 className="text-3xl md:text-8xl font-black uppercase leading-[0.85] mb-4 tracking-tighter">{selectedStay.name}</h2>
                            <div className="flex items-center gap-4 text-white/70">
                                <MapPin className="w-4 h-4 text-amber-500" /><span className="text-sm font-bold uppercase tracking-widest">{selectedStay.region}, {language === 'kz' ? 'Қазақстан' : language === 'ru' ? 'Казахстан' : 'Kazakhstan'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-20 space-y-20 md:space-y-32">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-24">
                            <div className="lg:col-span-2 space-y-12">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50" style={{ color: theme.primary }}>{labels.briefing}</h3>
                                <p className="text-xl md:text-3xl leading-snug opacity-90 font-medium">{selectedStay.description}</p>
                                {selectedStay.inclusions && selectedStay.inclusions.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedStay.inclusions.map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 p-6 border bg-current/[0.02]" style={{ borderColor: `${theme.primary}10` }}><Check className="w-4 h-4 shrink-0" style={{ color: theme.primary }} /><span className="text-[11px] font-black uppercase tracking-widest">{item}</span></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-12">
                                <div className="bg-current/[0.03] p-8 border space-y-8 rounded-none" style={{ borderColor: `${theme.text}10` }}>
                                    <h4 className="text-[10px] font-black uppercase border-b pb-6" style={{ color: theme.primary, borderColor: `${theme.text}10` }}>{labels.specs}</h4>
                                    {Object.entries(selectedStay.specs || {}).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between border-b pb-4 last:border-0" style={{ borderColor: `${theme.text}05` }}><span className="text-[9px] font-black uppercase opacity-40">{key}</span><span className="text-[11px] font-black uppercase">{value}</span></div>
                                    ))}
                                </div>
                                <div className="bg-current/[0.03] p-8 border space-y-8 rounded-none" style={{ borderColor: `${theme.text}10` }}>
                                    <h4 className="text-[10px] font-black uppercase border-b pb-6" style={{ color: theme.primary, borderColor: `${theme.text}10` }}>{labels.contact}</h4>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-center"><Phone className="w-4 h-4 opacity-40" /><span className="text-[11px] font-mono font-black">{selectedStay.contacts?.phone}</span></div>
                                        <div className="flex gap-4 items-center"><Mail className="w-4 h-4 opacity-40" /><span className="text-[11px] font-mono font-black lowercase">{selectedStay.contacts?.email}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-y-2 py-16 flex flex-col md:flex-row justify-between items-center gap-12" style={{ borderColor: theme.primary }}>
                            <div className="text-center md:text-left">
                                <span className="text-[10px] font-black uppercase opacity-40 mb-4 block">{labels.obligation}</span>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-7xl md:text-9xl font-black font-mono tracking-tighter" style={{ color: theme.primary }}>{formatPrice(selectedStay.price)}</span>
                                    <span className="text-lg font-black uppercase opacity-60">/ {labels.perCycle}</span>
                                </div>
                            </div>
                            <button onClick={() => handleCheckAvailability(selectedStay)} className="w-full md:w-auto px-16 py-10 text-base font-black uppercase tracking-[0.4em] transition-all rounded-none flex items-center justify-center gap-6 group shadow-2xl"
                                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                            >
                                <span>{labels.initiate}</span><ArrowUpRight className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
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
  );
};