import React, { useState, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTrip } from '../../contexts/TripContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
    Calendar, Clock, User, ArrowRight, Star, Map, Compass, 
    Mountain, Filter, Phone, Mail, MapPin, Search, ChevronRight, ChevronDown,
    Wind, Droplets, Sun, Zap, X, Check, Info, ShieldCheck, Briefcase,
    Instagram, Globe, MessageCircle, ExternalLink, Heart, Plus
} from '../ui/icons';
import { Reveal } from '../ui/Reveal';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { ALL_TOURS, Tour } from '../data/tours_data';
import { useWishlist } from './useWishlist';
import { toast } from 'sonner@2.0.3';

export const ToursPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
    const { theme } = useSeason();
    const { t, language } = useLanguage();
    const { addTourToTrip, dayCount, savedTrips, currentTrip } = useTrip();
    const { scrollY } = useScroll();
    const { isLiked, toggleWishlist } = useWishlist();
    const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    
    const [showAddToTrip, setShowAddToTrip] = useState(false);
    const [tripStartDay, setTripStartDay] = useState(1);
    const [targetTripId, setTargetTripId] = useState<string>('current');

    const regions = ['All', 'North', 'South', 'West', 'East', 'Central', 'Almaty', 'Astana'];

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
            // Pass 'current' or specific ID or 'NEW'
            // If user explicitly chose "Current Draft" (which we map to 'current' in UI), pass undefined to let context handle it?
            // Actually context expects specific ID or 'NEW' or undefined (current).
            // Let's normalize:
            const tripId = targetTripId === 'current' ? currentTrip.id : targetTripId;
            
            addTourToTrip(selectedTour, tripStartDay, tripId);
            
            setShowAddToTrip(false);
            // Optionally close the tour modal too
            setSelectedTour(null);
            if (onNavigate) onNavigate('planner');
        }
    };

    if (!theme) return null;

    return (
        <>
        <PageTransition>
            <div className="min-h-screen font-sans" style={{ color: theme.text, backgroundColor: theme.background }}>
                
                {/* Immersive Hero */}
                <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-end p-6 sm:p-8 md:p-12 lg:p-16">
                     <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
                         <ResponsiveImage 
                            src="https://images.unsplash.com/photo-1646914034640-457adf19ef41" 
                            className="w-full h-[120%] object-cover"
                            priority
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     </motion.div>
                     
                     <div className="relative z-10 w-full">
                         <Reveal>
                            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 opacity-80">
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white whitespace-nowrap">{t('tours_index')}</span>
                                <div className="h-px w-8 md:w-12 bg-white" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white whitespace-nowrap">{t('tours_expeditions')}</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6 md:mb-8 mix-blend-overlay break-words sm:break-normal">
                                {language === 'kz' ? 'ҰЛЫ ДАЛА' : language === 'ru' ? 'ВЕЛИКАЯ СТЕПЬ' : 'GREAT STEPPE'}<br/>{language === 'kz' ? 'САПАРЛАРЫ' : language === 'ru' ? 'ПУТЕШЕСТВИЯ' : 'JOURNEYS'}
                            </h1>
                            <div className="flex gap-4">
                                <div className="hidden sm:block h-2 w-20 bg-amber-500 mt-2" />
                                <p className="text-white max-w-xl text-base md:text-lg leading-relaxed font-bold opacity-90">
                                    {t('tours_tagline')}
                                </p>
                            </div>
                         </Reveal>
                     </div>
                </section>

                {/* Modern Sticky Filters */}
                <div className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300" style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.background}D9` }}>
                    <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-3 md:py-4 gap-4">
                        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
                            {regions.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setSelectedRegion(r)}
                                    className={`px-4 sm:px-6 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        selectedRegion === r 
                                            ? 'text-white' 
                                            : 'border border-current/20 hover:border-current'
                                    }`}
                                    style={selectedRegion === r ? { backgroundColor: theme.primary, borderColor: theme.primary } : {}}
                                >
                                    {r === 'All' ? t('tours_all') : language === 'kz' ? (r === 'North' ? 'Солтүстік' : r === 'South' ? 'Оңтүстік' : r === 'West' ? 'Батыс' : r === 'East' ? 'Шығыс' : r === 'Central' ? 'Орталық' : r) : language === 'ru' ? (r === 'North' ? 'Север' : r === 'South' ? 'Юг' : r === 'West' ? 'Запад' : r === 'East' ? 'Восток' : r === 'Central' ? 'Центр' : r) : r}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                             <input 
                                type="text"
                                placeholder={t('tours_search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-b border-current/20 py-2 pl-0 pr-8 text-xs font-black uppercase tracking-widest outline-none focus:border-current transition-colors"
                             />
                             <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Editorial Grid */}
                <section className="px-4 sm:px-6 md:px-12 py-8 md:py-12">
                    <div className="flex justify-between items-end mb-8 md:mb-12">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">{t('tours_available')}</h2>
                            <p className="opacity-60 text-[10px] md:text-xs font-bold uppercase tracking-widest">{filteredTours.length} {t('tours_found')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 lg:gap-1">
                        <AnimatePresence mode="popLayout">
                            {filteredTours.map((tour, idx) => (
                                <motion.div 
                                    key={tour.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    // Instant appearance for top items ("above the fold")
                                    animate={idx < 6 ? { opacity: 1, scale: 1 } : undefined}
                                    // Lazy animate for lower items
                                    whileInView={idx >= 6 ? { opacity: 1, scale: 1 } : undefined}
                                    viewport={{ once: true, margin: "200px" }}
                                    transition={{ duration: 0.4, delay: idx < 6 ? idx * 0.05 : 0 }}
                                    className={`group relative h-[380px] sm:h-[450px] md:h-[550px] overflow-hidden cursor-pointer ${tour.span || 'col-span-1'} transition-transform duration-500`}
                                    onClick={() => setSelectedTour(tour)}
                                >
                                    <ResponsiveImage 
                                        src={tour.image} 
                                        priority={idx < 6}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                                    
                                    {/* Like Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist({
                                                id: tour.id.toString(),
                                                name: tour.title,
                                                type: 'nature',
                                                image: tour.image,
                                                desc: tour.description,
                                                lat: 0, lng: 0
                                            } as any, tour.region);
                                        }}
                                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 sm:p-3 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform active:scale-95"
                                        style={{ backgroundColor: isLiked(tour.id.toString()) ? theme.primary : 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked(tour.id.toString()) ? 'fill-white text-white' : 'text-white'}`} />
                                    </button>

                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 transform sm:-translate-y-4 sm:group-hover:translate-y-0">
                                            <div className="flex gap-1.5 sm:gap-2">
                                                <span className="bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white border border-white/20">
                                                    {tour.type[language]}
                                                </span>
                                                <span className="bg-black/40 backdrop-blur-md px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white border border-white/20">
                                                    {tour.duration} {language === 'kz' ? 'КҮН' : language === 'ru' ? 'ДНЕЙ' : 'DAYS'}
                                                </span>
                                            </div>
                                            <span className="text-white text-xl sm:text-2xl font-black">${tour.price}</span>
                                        </div>

                                        <div className="max-w-[90%] sm:max-w-[85%]">
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/70 mb-1 sm:mb-2 block">
                                                {tour.region} {language === 'en' ? 'REGION' : language === 'ru' ? 'РЕГИОН' : 'АЙМАҒЫ'}
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-white leading-[0.9] tracking-tighter mb-2 sm:mb-4 transition-transform duration-500 origin-left sm:group-hover:scale-105">
                                                {tour.title[language]}
                                            </h3>
                                            <div className="h-auto sm:h-0 overflow-hidden sm:group-hover:h-auto transition-all duration-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                                <p className="text-white/80 text-xs sm:text-sm font-bold leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                                                    {tour.description[language]}
                                                </p>
                                                <div className="flex items-center gap-2 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                                    {language === 'kz' ? 'ТОЛЫҒЫРАҚ' : language === 'ru' ? 'ПОДРОБНЕЕ' : 'VIEW DETAILS'} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </PageTransition>

        {/* Cinematic Detailed Modal */}
        <AnimatePresence>
            {selectedTour && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-12 overflow-hidden bg-black/90 backdrop-blur-xl cursor-zoom-out"
                    onClick={() => setSelectedTour(null)}
                >
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full h-full max-w-7xl bg-white overflow-hidden flex flex-col md:flex-row cursor-default shadow-2xl"
                        style={{ backgroundColor: theme.background, color: theme.text }}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedTour(null)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-[110] p-3 md:p-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all active:scale-90 shadow-xl border border-white/20 mt-16 md:mt-0"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* Visuals - Top on mobile, Left on desktop */}
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

                        {/* Content - Scrollable */}
                        <div className="flex-1 h-full overflow-y-auto p-6 sm:p-10 md:p-16 custom-scrollbar">
                            <Reveal>
                                <div className="hidden md:flex items-center gap-3 mb-4 opacity-50">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedTour.region} {t('region')}</span>
                                    <div className="h-px w-8 bg-current/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedTour.type[language]}</span>
                                </div>

                                <h2 className="hidden md:block text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                                    {selectedTour.title[language]}
                                </h2>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                                    <div className="p-4 sm:p-6 border border-current/10 flex flex-col gap-1 sm:gap-2 bg-current/[0.02]">
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40">{t('price')}</span>
                                        <span className="text-xl sm:text-2xl font-black">${selectedTour.price}</span>
                                    </div>
                                    <div className="p-4 sm:p-6 border border-current/10 flex flex-col gap-1 sm:gap-2 bg-current/[0.02]">
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40">{t('duration')}</span>
                                        <span className="text-xl sm:text-2xl font-black">{selectedTour.duration} {t('days_label')}</span>
                                    </div>
                                    <div className="p-4 sm:p-6 border border-current/10 flex flex-col gap-1 sm:gap-2 bg-current/[0.02]">
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40">{t('level')}</span>
                                        <span className="text-xl sm:text-2xl font-black">{selectedTour.difficulty === 'Easy' ? t('easy') : selectedTour.difficulty === 'Medium' ? t('medium') : selectedTour.difficulty === 'Hard' ? t('hard') : t('extreme')}</span>
                                    </div>
                                    <div className="p-4 sm:p-6 border border-current/10 flex flex-col gap-1 sm:gap-2 bg-current/[0.02]">
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-40">{t('rating')}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl sm:text-2xl font-black">{selectedTour.rating}</span>
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-sm sm:prose-lg max-w-none mb-10 sm:mb-16">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed opacity-80">
                                        {selectedTour.longDescription[language]}
                                    </p>
                                </div>

                                {/* Itinerary */}
                                <div className="mb-12 sm:mb-20">
                                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4">
                                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" /> {t('tours_itinerary_title')}
                                    </h3>
                                    <div className="space-y-8 sm:space-y-12">
                                        {selectedTour.itinerary.map((item, i) => (
                                            <div key={i} className="relative pl-8 sm:pl-12 border-l-2 border-current/10 pb-6 last:pb-0">
                                                <div className="absolute -left-[9px] sm:-left-[11px] top-0 w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] sm:border-4" style={{ borderColor: theme.primary }} />
                                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 sm:mb-2 block">{t('day')} {item.day}</span>
                                                <h4 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-2 sm:mb-3">{item.title[language]}</h4>
                                                <p className="text-sm sm:text-base font-bold opacity-60 leading-relaxed">{item.desc[language]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Included / Gear */}
                                <div className="grid md:grid-cols-2 gap-10 sm:gap-16 mb-12 sm:mb-20">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5" /> {t('tours_included_title')}
                                        </h3>
                                        <ul className="space-y-3 sm:space-y-4">
                                            {selectedTour.included.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-bold opacity-80">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                                                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    </div>
                                                    {item[language]}
                                                </li>
                                            ))}
                                            {selectedTour.notIncluded && selectedTour.notIncluded.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-bold opacity-40">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                                                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    </div>
                                                    {item[language]}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-4 sm:mb-6 flex items-center gap-3">
                                            <Briefcase className="w-5 h-5" /> {t('tours_gear_title')}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTour.whatToBring.map((item, i) => (
                                                <span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-current/5 text-[9px] sm:text-xs font-black uppercase tracking-widest">
                                                    {item[language]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contacts */}
                                <div className="p-6 sm:p-10 border-2 border-dashed border-current/10 mb-12 sm:mb-16 bg-current/[0.02]">
                                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-6 sm:mb-8">{t('tours_booking_info')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                        <div className="space-y-5 sm:space-y-6">
                                            <div className="flex items-center gap-4 group cursor-pointer">
                                                <div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors">
                                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">{t('phone_label')}</p>
                                                    <p className="text-sm sm:text-base font-black">{selectedTour.contacts.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group cursor-pointer">
                                                <div className="p-2.5 sm:p-3 bg-current/5 group-hover:bg-current/10 transition-colors">
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Email</p>
                                                    <p className="text-sm sm:text-base font-black">{selectedTour.contacts.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-5 sm:space-y-6">
                                            {selectedTour.contacts.website && (
                                                <div className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="p-2.5 sm:p-3 rounded-xl bg-current/5 group-hover:bg-current/10 transition-colors">
                                                        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Website</p>
                                                        <p className="text-sm sm:text-base font-black">{selectedTour.contacts.website}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedTour.contacts.instagram && (
                                                <div className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="p-2.5 sm:p-3 rounded-xl bg-current/5 group-hover:bg-current/10 transition-colors">
                                                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-40 tracking-widest">Social</p>
                                                        <p className="text-sm sm:text-base font-black">{selectedTour.contacts.instagram}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Final CTA - Smart Trip Planner Integration */}
                                <div className="flex flex-col gap-4 mb-8 sm:mb-10">
                                    <button 
                                        onClick={() => setShowAddToTrip(true)}
                                        className="w-full py-4 sm:py-6 px-8 sm:px-12 rounded-2xl bg-black text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
                                        style={{ backgroundColor: theme.primary }}
                                    >
                                        <Plus className="w-5 h-5" /> {language === 'kz' ? 'Сапарға қосу' : language === 'ru' ? 'Добавить в план' : 'Add to Trip Planner'}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showAddToTrip && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-black/5 rounded-2xl border border-black/10"
                                            >
                                                <div className="p-6 space-y-4">
                                                    {/* TRIP SELECTOR */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">{t('select_trip')}</label>
                                                        <div className="relative">
                                                            <select 
                                                                value={targetTripId}
                                                                onChange={(e) => setTargetTripId(e.target.value)}
                                                                className="w-full bg-white p-3 pr-10 rounded-lg font-bold text-sm border border-black/10 outline-none focus:border-black/30 appearance-none"
                                                            >
                                                                <option value="current">
                                                                    {currentTrip.title ? `${currentTrip.title} (Current)` : t('current_draft')}
                                                                </option>
                                                                
                                                                {savedTrips.length > 0 && <optgroup label={t('saved_trips')} />}
                                                                {savedTrips.map(trip => (
                                                                    <option key={trip.id} value={trip.id}>
                                                                        {trip.title}
                                                                    </option>
                                                                ))}
                                                                
                                                                <option value="NEW">
                                                                    + {t('create_new_trip')}
                                                                </option>
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    {/* DAY SELECTOR */}
                                                    <div className="flex items-end gap-4">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">{t('day')}</label>
                                                            <input 
                                                                type="number" 
                                                                min={1} 
                                                                max={dayCount + 10}
                                                                value={tripStartDay}
                                                                onChange={(e) => setTripStartDay(parseInt(e.target.value) || 1)}
                                                                className="w-full bg-white p-3 rounded-lg font-black text-xl border border-black/10 outline-none focus:border-black/30"
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={handleAddToTrip}
                                                            className="flex-1 py-3 px-6 bg-black text-white rounded-lg font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                                                        >
                                                            {t('confirm') || 'Confirm'}
                                                        </button>
                                                    </div>
                                                    
                                                    <p className="text-[10px] font-bold opacity-50 leading-relaxed">
                                                        {t('add_to_planner_desc').replace('{day}', tripStartDay.toString())}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button 
                                    onClick={() => setSelectedTour(null)}
                                    className="w-full py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity mb-10 sm:mb-20"
                                >
                                    [ {t('tours_close')} ]
                                </button>
                            </Reveal>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};