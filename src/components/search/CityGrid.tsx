/**
 * CityGrid — interactive city selection grid for homepage and stays.
 * Shows all Kazakhstan destinations organized by tier with images.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from '../ui/icons';
import { KAZAKHSTAN_CITIES, TOP_DESTINATIONS, type KZCity } from '../../data/kazakhstan-cities';

interface CityGridProps {
  theme: any;
  language: 'en' | 'ru' | 'kz';
  onCitySelect: (city: KZCity) => void;
  variant?: 'compact' | 'full';
  selectedCityId?: string | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const CityGrid = ({ theme, language, onCitySelect, variant = 'full', selectedCityId }: CityGridProps) => {
  const lang = language as 'en' | 'ru' | 'kz';
  const [showAll, setShowAll] = useState(false);

  const tier1 = KAZAKHSTAN_CITIES.filter(c => c.tier === 1);
  const tier2 = KAZAKHSTAN_CITIES.filter(c => c.tier === 2);
  const tier3 = KAZAKHSTAN_CITIES.filter(c => c.tier === 3);

  const displayedTier3 = showAll ? tier3 : tier3.slice(0, 6);

  const labels = {
    en: { major: 'Major cities', regional: 'Regional capitals', destinations: 'Tourist destinations', showAll: 'Show all destinations', popular: 'Popular destinations in Kazakhstan' },
    ru: { major: 'Крупные города', regional: 'Областные центры', destinations: 'Туристические направления', showAll: 'Показать все', popular: 'Популярные направления Казахстана' },
    kz: { major: 'Ірі қалалар', regional: 'Облыс орталықтары', destinations: 'Туристік бағыттар', showAll: 'Барлығын көрсету', popular: 'Қазақстанның танымал бағыттары' },
  };
  const l = labels[lang];

  if (variant === 'compact') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px]" style={{ backgroundColor: theme.primary }} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: `${theme.text}50` }}>{l.popular}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px" style={{ backgroundColor: `${theme.text}10` }}>
          {TOP_DESTINATIONS.slice(0, 12).map((city, i) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: EASE }}
              onClick={() => onCitySelect(city)}
              className={`relative group overflow-hidden aspect-[4/3] ${selectedCityId === city.id ? 'ring-2' : ''}`}
              style={{
                backgroundColor: theme.background,
                ...(selectedCityId === city.id ? { ringColor: theme.primary } : {}),
              }}
            >
              <img src={city.image} alt={city.name[lang]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white block truncate">{city.name[lang]}</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 block truncate">{city.region[lang]}</span>
              </div>
              {city.tier === 1 && (
                <div className="absolute top-2 right-2">
                  <div className="w-1.5 h-1.5" style={{ backgroundColor: theme.primary }} />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Tier 1 — Major cities */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px]" style={{ backgroundColor: theme.primary }} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: `${theme.text}50` }}>{l.major}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${theme.text}08` }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: `${theme.text}10` }}>
          {tier1.map((city, i) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              onClick={() => onCitySelect(city)}
              className={`relative group overflow-hidden h-[240px] text-left ${selectedCityId === city.id ? 'ring-2 ring-inset' : ''}`}
              style={{
                backgroundColor: theme.background,
                ...(selectedCityId === city.id ? { ringColor: theme.primary } : {}),
              }}
            >
              <img src={city.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3 h-3" style={{ color: theme.primary }} />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">{city.region[lang]}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-none mb-2">{city.name[lang]}</h3>
                <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                  <div className="h-px w-4 bg-current group-hover:w-8 transition-all duration-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                    {lang === 'ru' ? 'Смотреть' : lang === 'kz' ? 'Қарау' : 'Explore'}
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tier 2 — Regional */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px]" style={{ backgroundColor: `${theme.primary}80` }} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: `${theme.text}50` }}>{l.regional}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${theme.text}08` }} />
          <span className="text-[9px] font-mono font-black opacity-20">{tier2.length}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px" style={{ backgroundColor: `${theme.text}08` }}>
          {tier2.map((city, i) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
              onClick={() => onCitySelect(city)}
              className={`relative group overflow-hidden h-[160px] text-left ${selectedCityId === city.id ? 'ring-2 ring-inset' : ''}`}
              style={{
                backgroundColor: theme.background,
                ...(selectedCityId === city.id ? { ringColor: theme.primary } : {}),
              }}
            >
              <img src={city.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white truncate">{city.name[lang]}</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 truncate">{city.region[lang]}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tier 3 — Tourist spots */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px]" style={{ backgroundColor: `${theme.primary}60` }} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: `${theme.text}50` }}>{l.destinations}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${theme.text}08` }} />
          <span className="text-[9px] font-mono font-black opacity-20">{tier3.length}</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-px" style={{ backgroundColor: `${theme.text}08` }}>
          {displayedTier3.map((city, i) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              onClick={() => onCitySelect(city)}
              className={`group p-4 text-left hover:bg-current/5 transition-colors ${selectedCityId === city.id ? 'border-l-2' : ''}`}
              style={{
                backgroundColor: theme.background,
                ...(selectedCityId === city.id ? { borderColor: theme.primary } : {}),
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.1em] block truncate group-hover:underline" style={{ color: theme.text }}>{city.name[lang]}</span>
              <span className="text-[8px] opacity-30 truncate block">{city.region[lang]}</span>
            </motion.button>
          ))}
        </div>
        {!showAll && tier3.length > 6 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] hover:underline"
            style={{ color: theme.primary }}
          >
            {l.showAll} ({tier3.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
