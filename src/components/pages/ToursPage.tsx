import React, { useState, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTrip } from '../../contexts/TripContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, ArrowRight, Star, Compass,
  Filter, Phone, Mail, MapPin, Search, ChevronDown,
  X, Check, Info, ShieldCheck, Briefcase,
  Instagram, Globe, Heart, Plus,
} from '../ui/icons';
import { Reveal } from '../ui/Reveal';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageHero, PageFilterBar, PageCard } from '../ui/PageShell';
import { ALL_TOURS, Tour } from '../data/tours_data';
import { useWishlist } from './useWishlist';
import { toast } from 'sonner@2.0.3';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { ReviewSection } from '../reviews/ReviewSection';
import { PartnerCTA } from '../ui/PartnerCTA';

export const ToursPage = () => {
  const { theme } = useSeason();
  const { t, language } = useLanguage();
  const { addTourToTrip, dayCount, savedTrips, currentTrip } = useTrip();
  const { isLiked, toggleWishlist } = useWishlist();
  const onNavigate = useAppNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showAddToTrip, setShowAddToTrip] = useState(false);
  const [tripStartDay, setTripStartDay] = useState(1);
  const [targetTripId, setTargetTripId] = useState<string>('current');

  const regions = ['All', 'North', 'South', 'West', 'East', 'Central', 'Almaty', 'Astana'];

  const regionLabels: Record<string, Record<string, string>> = {
    All: { en: 'All', ru: 'Все', kz: 'Барлығы' },
    North: { en: 'North', ru: 'Север', kz: 'Солтүстік' },
    South: { en: 'South', ru: 'Юг', kz: 'Оңтүстік' },
    West: { en: 'West', ru: 'Запад', kz: 'Батыс' },
    East: { en: 'East', ru: 'Восток', kz: 'Шығыс' },
    Central: { en: 'Central', ru: 'Центр', kz: 'Орталық' },
    Almaty: { en: 'Almaty', ru: 'Алматы', kz: 'Алматы' },
    Astana: { en: 'Astana', ru: 'Астана', kz: 'Астана' },
  };

  const filteredTours = useMemo(() => {
    return ALL_TOURS.filter(tour => {
      const matchesSearch = tour.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.longDescription[language].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || tour.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion, language]);

  const handleAddToTrip = () => {
    if (selectedTour) {
      const tripId = targetTripId === 'current' ? currentTrip.id : targetTripId;
      addTourToTrip(selectedTour, tripStartDay, tripId);
      setShowAddToTrip(false);
      setSelectedTour(null);
      if (onNavigate) onNavigate('planner');
    }
  };

  if (!theme) return null;

  const filterItems = regions.map(r => ({
    id: r,
    label: regionLabels[r]?.[language] || r,
  }));

  return (
    <>
      <PageTransition>
        <div className="min-h-screen font-sans" style={{ color: theme.text, backgroundColor: theme.background }}>
          {/* ── Hero ── */}
          <PageHero
            image="https://images.unsplash.com/photo-1646914034640-457adf19ef41?w=1200&q=80&fm=webp&auto=format&fit=crop"
            tag={language === 'kz' ? 'ТУРЛАР МЕН ЭКСПЕДИЦИЯЛАР' : language === 'ru' ? 'ТУРЫ И ЭКСПЕДИЦИИ' : 'TOURS & EXPEDITIONS'}
            title={language === 'kz' ? 'ҰЛЫ ДАЛА САПАРЛАРЫ' : language === 'ru' ? 'ВЕЛИКАЯ СТЕПЬ' : 'GREAT STEPPE JOURNEYS'}
            subtitle={t('tours_tagline')}
            count={filteredTours.length}
            countLabel={t('tours_found')}
            theme={theme}
          />

          {/* ── Filter Bar ── */}
          <PageFilterBar
            filters={filterItems}
            active={selectedRegion}
            onFilter={setSelectedRegion}
            theme={theme}
            rightContent={
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder={t('tours_search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b py-2 pl-0 pr-8 text-xs font-black uppercase tracking-widest outline-none focus:border-current transition-colors"
                  style={{ borderColor: `${theme.text}20` }}
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              </div>
            }
          />

          {/* ── Card Grid ── */}
          <div className="max-w-[1800px] mx-auto">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredTours.map((tour, idx) => (
                  <PageCard
                    key={tour.id}
                    image={tour.image}
                    index={idx}
                    priority={idx < 6}
                    category={`${tour.region} ${language === 'en' ? 'REGION' : language === 'ru' ? 'РЕГИОН' : 'АЙМАҒЫ'}`}
                    categoryColor={theme.primary}
                    title={tour.title[language]}
                    description={tour.description[language]}
                    isLiked={isLiked(tour.id.toString())}
                    onLike={() => toggleWishlist({ id: tour.id.toString(), name: tour.title, type: 'nature', image: tour.image, desc: tour.description, lat: 0, lng: 0 } as any, tour.region)}
                    onClick={() => setSelectedTour(tour)}
                    theme={theme}
                    ctaLabel={language === 'kz' ? 'ТОЛЫҒЫРАҚ' : language === 'ru' ? 'ПОДРОБНЕЕ' : 'VIEW DETAILS'}
                    topLeft={
                      <>
                        <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white border border-white/15">{tour.type[language]}</span>
                        <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white border border-white/15">{tour.duration} {language === 'kz' ? 'КҮН' : language === 'ru' ? 'ДНЕЙ' : 'DAYS'}</span>
                      </>
                    }
                    topRight={<span className="text-white text-xl sm:text-2xl font-black drop-shadow-lg">${tour.price}</span>}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Partner CTA */}
            <div className="px-6 md:px-12">
              <PartnerCTA variant="tours" theme={theme} language={language} />
            </div>
          </div>
        </div>
      </PageTransition>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedTour && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-12 overflow-hidden bg-black/90 backdrop-blur-xl cursor-zoom-out"
            onClick={() => setSelectedTour(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-7xl overflow-hidden flex flex-col md:flex-row cursor-default shadow-2xl"
              style={{ backgroundColor: theme.background, color: theme.text }}
            >
              <button onClick={() => setSelectedTour(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-[110] p-3 md:p-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all active:scale-90 shadow-xl border border-white/20 mt-16 md:mt-0"><X className="w-5 h-5 md:w-6 md:h-6" /></button>

              <div className="w-full md:w-2/5 h-64 sm:h-80 md:h-auto relative overflow-hidden flex-shrink-0">
                <ResponsiveImage src={selectedTour.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-6 left-6 md:hidden text-white pr-16">
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{selectedTour.title[language]}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-amber-500 text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">{selectedTour.type[language]}</span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">${selectedTour.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 h-full overflow-y-auto p-6 sm:p-10 md:p-16 custom-scrollbar">
                <Reveal>
                  <div className="hidden md:flex items-center gap-3 mb-4 opacity-50">
                    <MapPin className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">{selectedTour.region} {t('region')}</span>
                    <div className="h-px w-8 bg-current/20" /><span className="text-[10px] font-black uppercase tracking-widest">{selectedTour.type[language]}</span>
                  </div>
                  <h2 className="hidden md:block text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{selectedTour.title[language]}</h2>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                    {[
                      { label: t('price'), value: `$${selectedTour.price}` },
                      { label: t('duration'), value: `${selectedTour.duration} ${t('days_label')}` },
                      { label: t('level'), value: selectedTour.difficulty === 'Easy' ? t('easy') : selectedTour.difficulty === 'Medium' ? t('medium') : selectedTour.difficulty === 'Hard' ? t('hard') : t('extreme') },
                      { label: t('rating'), value: selectedTour.rating, icon: true },
                    ].map((s, i) => (
                      <div key={i} className="p-4 sm:p-6 border flex flex-col gap-1 sm:gap-2 bg-current/[0.02]" style={{ borderColor: `${theme.text}10` }}>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40">{s.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-black">{s.value}</span>
                          {s.icon && <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="prose prose-sm sm:prose-lg max-w-none mb-10 sm:mb-16">
                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed opacity-80">{selectedTour.longDescription[language]}</p>
                  </div>

                  <div className="mb-12 sm:mb-20">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4"><Calendar className="w-5 h-5 sm:w-6 sm:h-6" /> {t('tours_itinerary_title')}</h3>
                    <div className="space-y-8 sm:space-y-12">
                      {selectedTour.itinerary.map((item, i) => (
                        <div key={i} className="relative pl-8 sm:pl-12 border-l-2 pb-6 last:pb-0" style={{ borderColor: `${theme.text}10` }}>
                          <div className="absolute -left-[9px] sm:-left-[11px] top-0 w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] sm:border-4" style={{ borderColor: theme.primary, backgroundColor: theme.background }} />
                          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 sm:mb-2 block">{t('day')} {item.day}</span>
                          <h4 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-2 sm:mb-3">{item.title[language]}</h4>
                          <p className="text-sm sm:text-base opacity-60 leading-relaxed">{item.desc[language]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10 sm:gap-16 mb-12 sm:mb-20">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-3"><ShieldCheck className="w-5 h-5" /> {t('tours_included_title')}</h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {selectedTour.included.map((item, i) => (<li key={i} className="flex items-start gap-3 text-xs sm:text-sm opacity-80"><div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>{item[language]}</li>))}
                        {selectedTour.notIncluded && selectedTour.notIncluded.map((item, i) => (<li key={i} className="flex items-start gap-3 text-xs sm:text-sm opacity-40"><div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5"><X className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>{item[language]}</li>))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-3"><Briefcase className="w-5 h-5" /> {t('tours_gear_title')}</h3>
                      <div className="flex flex-wrap gap-2">{selectedTour.whatToBring.map((item, i) => (<span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-current/5 text-[9px] sm:text-xs font-black uppercase tracking-widest">{item[language]}</span>))}</div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10 border-2 border-dashed mb-12 sm:mb-16 bg-current/[0.02]" style={{ borderColor: `${theme.text}10` }}>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-6 sm:mb-8">{t('tours_booking_info')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-5 sm:space-y-6">
                        <div className="flex items-center gap-4 group cursor-pointer"><div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors"><Phone className="w-4 h-4 sm:w-5 sm:h-5" /></div><div><p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">{t('phone_label')}</p><p className="text-sm sm:text-base font-black">{selectedTour.contacts.phone}</p></div></div>
                        <div className="flex items-center gap-4 group cursor-pointer"><div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors"><Mail className="w-4 h-4 sm:w-5 sm:h-5" /></div><div><p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Email</p><p className="text-sm sm:text-base font-black">{selectedTour.contacts.email}</p></div></div>
                      </div>
                      <div className="space-y-5 sm:space-y-6">
                        {selectedTour.contacts.website && (<div className="flex items-center gap-4 group cursor-pointer"><div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors"><Globe className="w-4 h-4 sm:w-5 sm:h-5" /></div><div><p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Website</p><p className="text-sm sm:text-base font-black">{selectedTour.contacts.website}</p></div></div>)}
                        {selectedTour.contacts.instagram && (<div className="flex items-center gap-4 group cursor-pointer"><div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors"><Instagram className="w-4 h-4 sm:w-5 sm:h-5" /></div><div><p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Social</p><p className="text-sm sm:text-base font-black">{selectedTour.contacts.instagram}</p></div></div>)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10 border bg-current/[0.01] mb-8 sm:mb-12" style={{ borderColor: `${theme.text}10` }}>
                    <ReviewSection targetId={selectedTour.id.toString()} targetType="tour" targetName={selectedTour.title[language]} />
                  </div>

                  <div className="flex flex-col gap-4 mb-8 sm:mb-10">
                    <button onClick={() => setShowAddToTrip(true)} className="w-full py-4 sm:py-6 px-8 sm:px-12 text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg active:scale-[0.98] flex items-center justify-center gap-3" style={{ backgroundColor: theme.primary }}><Plus className="w-5 h-5" /> {language === 'kz' ? 'Сапарға қосу' : language === 'ru' ? 'Добавить в план' : 'Add to Trip Planner'}</button>

                    <AnimatePresence>
                      {showAddToTrip && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/5 border" style={{ borderColor: `${theme.text}10` }}>
                          <div className="p-6 space-y-4">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t('select_trip')}</label>
                              <div className="relative">
                                <select value={targetTripId} onChange={(e) => setTargetTripId(e.target.value)} className="w-full bg-white p-3 pr-10 font-black text-sm border outline-none focus:border-current appearance-none" style={{ borderColor: `${theme.text}10` }}>
                                  <option value="current">{currentTrip.title ? `${currentTrip.title} (Current)` : t('current_draft')}</option>
                                  {savedTrips.length > 0 && <optgroup label={t('saved_trips')} />}
                                  {savedTrips.map(trip => (<option key={trip.id} value={trip.id}>{trip.title}</option>))}
                                  <option value="NEW">+ {t('create_new_trip')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                              </div>
                            </div>
                            <div className="flex items-end gap-4">
                              <div className="flex-1">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{t('day')}</label>
                                <input type="number" min={1} max={dayCount + 10} value={tripStartDay} onChange={(e) => setTripStartDay(parseInt(e.target.value) || 1)} className="w-full bg-white p-3 font-black text-xl border outline-none focus:border-current" style={{ borderColor: `${theme.text}10` }} />
                              </div>
                              <button onClick={handleAddToTrip} className="flex-1 py-3 px-6 bg-black text-white font-black uppercase tracking-widest hover:opacity-80 transition-opacity">{t('confirm') || 'Confirm'}</button>
                            </div>
                            <p className="text-[10px] font-black opacity-50 leading-relaxed">{t('add_to_planner_desc').replace('{day}', tripStartDay.toString())}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button onClick={() => setSelectedTour(null)} className="w-full py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity mb-10 sm:mb-20">[ {t('tours_close')} ]</button>
                </Reveal>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
