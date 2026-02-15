import React, { useState, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWishlist } from './useWishlist';
import { PLACES, Place } from '../data/map_places';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Wind, Mountain, Droplets, Sun, Thermometer, Heart, X } from '../ui/icons';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { REGION_HERO_URLS } from '../../utils/imageUrls';

const getPlacesByIds = (ids: string[]) => PLACES.filter(p => ids.includes(p.id));

const PlaceCard = React.memo(({ 
  place, 
  regionName, 
  language, 
  isLiked, 
  onToggleLike,
  isActive = false 
}: { 
  place: Place; 
  regionName: string; 
  language: string; 
  isLiked: (id: string) => boolean; 
  onToggleLike: (e: React.MouseEvent, place: Place, regionName: string) => void;
  isActive?: boolean;
}) => (
  <div
    className="group/place cursor-pointer relative overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
    style={{ aspectRatio: '4/3' }}
  >
    <ResponsiveImage
      src={place.image}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/place:scale-105"
    />
    <div className="absolute inset-0 bg-black/30 group-hover/place:bg-black/10 transition-colors" />
    
    {/* Like */}
    <button
      onClick={(e) => onToggleLike(e, place, regionName)}
      className="absolute top-1.5 right-1.5 z-30 p-1 bg-black/40 backdrop-blur-sm hover:bg-white/20 transition-all opacity-0 group-hover/place:opacity-100"
    >
      <Heart className={`w-3 h-3 ${isLiked(place.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
    </button>

    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent z-20">
      <span className="text-[7px] font-bold uppercase tracking-widest text-white/50 block">{place.type}</span>
      <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight text-white truncate">{place.name[language] || place.name.en}</h4>
    </div>
  </div>
));

PlaceCard.displayName = 'PlaceCard';

const RegionsPageComponent = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
    const { theme } = useSeason();
    const { t, language } = useLanguage();
    const { isLiked, toggleWishlist } = useWishlist();
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    if (!theme) return null;

    const regions = [
        {
            id: 'north',
            name: t('regions_north'),
            title: t('regions_north_title'),
            desc: t('regions_north_desc'),
            image: REGION_HERO_URLS.north,
            icon: Droplets,
            stats: { temp: '-15\u00B0C', wind: '20 km/h', humidity: t('regions_high') },
            places: getPlacesByIds(['13', '57', '3', '10', '40', '50'])
        },
        {
            id: 'south',
            name: t('regions_south'),
            title: t('regions_south_title'),
            desc: t('regions_south_desc'),
            image: REGION_HERO_URLS.south,
            icon: Mountain,
            stats: { temp: '5\u00B0C', wind: '10 km/h', humidity: t('regions_medium') },
            places: getPlacesByIds(['1', '11', '15', '14', '18', '25'])
        },
        {
            id: 'west',
            name: t('regions_west'),
            title: t('regions_west_title'),
            desc: t('regions_west_desc'),
            image: REGION_HERO_URLS.west,
            icon: Sun,
            stats: { temp: '2\u00B0C', wind: '35 km/h', humidity: t('regions_low') },
            places: getPlacesByIds(['2', '16', '35', '65', '36', '66'])
        },
        {
            id: 'east',
            name: t('regions_east'),
            title: t('regions_east_title'),
            desc: t('regions_east_desc'),
            image: REGION_HERO_URLS.east,
            icon: Wind,
            stats: { temp: '-25\u00B0C', wind: '15 km/h', humidity: t('regions_medium') },
            places: getPlacesByIds(['69', '63', '20', '37', '38', '29'])
        }
    ];

    const handleToggleLike = (e: React.MouseEvent, place: Place, regionId: string) => {
        e.stopPropagation();
        toggleWishlist(place, regionId);
    };

    const activeData = regions.find(r => r.id === activeRegion);

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden bg-black text-white font-sans">

            {/* === DESKTOP: Horizontal Accordion === */}
            <div className="hidden md:flex flex-1 min-h-0">
                {regions.map((region) => {
                    const isActive = activeRegion === region.id;
                    const isOther = activeRegion && activeRegion !== region.id;
                    return (
                        <div
                            key={region.id}
                            className="relative h-full cursor-pointer overflow-hidden group border-r border-white/10 last:border-r-0"
                            style={{
                                flex: isActive ? '3 1 0%' : isOther ? '0.5 1 0%' : '1 1 0%',
                                transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                willChange: 'flex'
                            }}
                            onMouseEnter={() => !activeRegion && setActiveRegion(region.id)}
                            onMouseLeave={() => !activeRegion && setActiveRegion(null)}
                            onClick={() => setActiveRegion(isActive ? null : region.id)}
                        >
                            {/* BG Image */}
                            <div className="absolute inset-0">
                                <ResponsiveImage
                                    src={region.image}
                                    alt={region.name}
                                    className={`w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-60 group-hover:opacity-80'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-between z-10">
                                {/* Top: Tag + Icon */}
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] border px-3 py-1.5 backdrop-blur-md transition-colors duration-300 ${isActive ? 'bg-white text-black border-white' : 'bg-black/20 border-white/30'}`}>
                                        {region.name}
                                    </span>
                                    <region.icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                                </div>

                                {/* Middle: Region Name (vertical when collapsed) */}
                                {!isActive && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <h2
                                            className="text-4xl lg:text-6xl font-black uppercase tracking-tight whitespace-nowrap opacity-80 transition-all duration-500"
                                            style={{
                                                writingMode: isOther ? 'vertical-lr' : undefined,
                                                textOrientation: isOther ? 'mixed' : undefined,
                                                transform: isOther ? 'rotate(180deg)' : undefined
                                            }}
                                        >
                                            {region.name}
                                        </h2>
                                    </div>
                                )}

                                {/* Expanded content */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ delay: 0.1, duration: 0.35 }}
                                            className="flex-1 flex flex-col justify-end gap-6 min-h-0 overflow-hidden"
                                        >
                                            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                                                {region.title}
                                            </h2>

                                            <div className="flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
                                                {/* Left: Description + Stats */}
                                                <div className="lg:w-2/5 flex-shrink-0 space-y-4">
                                                    <p className="text-sm lg:text-base font-medium leading-relaxed border-l-2 border-white/40 pl-4 line-clamp-4">
                                                        {region.desc}
                                                    </p>
                                                    <div className="flex gap-6">
                                                        <div>
                                                            <div className="flex items-center gap-1.5 opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                                                <Thermometer className="w-3 h-3" /> {t('regions_temperature')}
                                                            </div>
                                                            <span className="text-xl font-black">{region.stats.temp}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5 opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                                                <Wind className="w-3 h-3" /> {t('regions_wind')}
                                                            </div>
                                                            <span className="text-xl font-black">{region.stats.wind}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Place Cards */}
                                                <div className="flex-1 min-h-0 min-w-0 space-y-2">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 block">{t('regions_expedition_sites')}</span>
                                                    <div className="grid grid-cols-3 xl:grid-cols-3 gap-2 auto-rows-fr">
                                                        {region.places.slice(0, 6).map((place) => (
                                                            <PlaceCard
                                                                key={place.id}
                                                                place={place}
                                                                regionName={region.name}
                                                                language={language}
                                                                isLiked={isLiked}
                                                                onToggleLike={handleToggleLike}
                                                                isActive={isActive}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); onNavigate?.('map'); }}
                                                className="self-start flex items-center gap-3 bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:gap-6 transition-all"
                                            >
                                                {t('regions_open_on_map')} <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* === MOBILE: Full-screen stacked cards === */}
            <div className="md:hidden flex-1 min-h-0 overflow-y-auto">
                {regions.map((region) => {
                    const isActive = activeRegion === region.id;
                    return (
                        <div key={region.id} className="relative border-b border-white/10 last:border-b-0">
                            {/* Collapsed: Tap target */}
                            <button
                                onClick={() => setActiveRegion(isActive ? null : region.id)}
                                className="w-full relative overflow-hidden"
                                style={{ height: isActive ? '200px' : '25vh' }}
                            >
                                <ResponsiveImage
                                    src={region.image}
                                    alt={region.name}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-40' : 'opacity-70'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

                                <div className="absolute inset-0 p-5 flex items-end justify-between z-10">
                                    <div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 block mb-1">{region.name}</span>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">{isActive ? region.title : region.name}</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <region.icon className="w-5 h-5 opacity-50" />
                                        {isActive && <X className="w-5 h-5 opacity-60" />}
                                    </div>
                                </div>
                            </button>

                            {/* Expanded: Scrollable detail */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden bg-black"
                                    >
                                        <div className="p-5 space-y-5">
                                            {/* Description */}
                                            <p className="text-sm font-medium leading-relaxed border-l-2 border-white/40 pl-4 opacity-80">
                                                {region.desc}
                                            </p>

                                            {/* Stats row */}
                                            <div className="flex gap-6">
                                                <div>
                                                    <div className="flex items-center gap-1.5 opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                                        <Thermometer className="w-3 h-3" /> {t('regions_temperature')}
                                                    </div>
                                                    <span className="text-lg font-black">{region.stats.temp}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5 opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                                        <Wind className="w-3 h-3" /> {t('regions_wind')}
                                                    </div>
                                                    <span className="text-lg font-black">{region.stats.wind}</span>
                                                </div>
                                            </div>

                                            {/* Place cards: 2-col horizontal scroll */}
                                            <div>
                                                <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-2">{t('regions_expedition_sites')}</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {region.places.slice(0, 6).map((place) => (
                                                        <div
                                                            key={place.id}
                                                            className="relative overflow-hidden border border-white/10"
                                                            style={{ aspectRatio: '3/2' }}
                                                        >
                                                            <ResponsiveImage
                                                                src={place.image}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/30" />
                                                            <button
                                                                onClick={(e) => handleToggleLike(e, place, region.name)}
                                                                className="absolute top-1.5 right-1.5 z-30 p-1 bg-black/40"
                                                            >
                                                                <Heart className={`w-3 h-3 ${isLiked(place.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                                <span className="text-[7px] font-bold uppercase tracking-widest text-white/50 block">{place.type}</span>
                                                                <h4 className="text-[10px] font-black uppercase tracking-tight text-white truncate">{place.name[language] || place.name.en}</h4>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); onNavigate?.('map'); }}
                                                className="flex items-center gap-3 bg-white text-black px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                {t('regions_open_on_map')} <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const RegionsPage = RegionsPageComponent;