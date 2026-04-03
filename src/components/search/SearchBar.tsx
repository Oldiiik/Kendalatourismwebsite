/**
 * SearchBar — booking.com-style search bar for Kendala.
 * Supports city autocomplete, date selection, and guest count.
 * Sharp corners only. Montserrat. Editorial micro-grid.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Users, Search, X, ChevronDown } from '../ui/icons';
import { KAZAKHSTAN_CITIES, searchCities, TOP_DESTINATIONS, type KZCity } from '../../data/kazakhstan-cities';

interface SearchBarProps {
  theme: any;
  language: 'en' | 'ru' | 'kz';
  onSearch: (params: SearchParams) => void;
  variant?: 'hero' | 'inline';
}

export interface SearchParams {
  cityId: string | null;
  cityName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

const LABELS = {
  en: { where: 'Where are you going?', checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests', rooms: 'Rooms', search: 'Search', popular: 'Popular destinations', allCities: 'All destinations', adult: 'Adults', children: 'Children', room: 'Rooms', done: 'Done', addDate: 'Add date' },
  ru: { where: 'Куда вы едете?', checkIn: 'Заезд', checkOut: 'Выезд', guests: 'Гости', rooms: 'Номера', search: 'Найти', popular: 'Популярные направления', allCities: 'Все направления', adult: 'Взрослые', children: 'Дети', room: 'Номера', done: 'Готово', addDate: 'Добавить дату' },
  kz: { where: 'Қайда барасыз?', checkIn: 'Кіру', checkOut: 'Шығу', guests: 'Қонақтар', rooms: 'Бөлмелер', search: 'Іздеу', popular: 'Танымал бағыттар', allCities: 'Барлық бағыттар', adult: 'Ересектер', children: 'Балалар', room: 'Бөлмелер', done: 'Дайын', addDate: 'Күн қосу' },
};

export const SearchBar = ({ theme, language, onSearch, variant = 'hero' }: SearchBarProps) => {
  const l = LABELS[language];
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<KZCity | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  const lang = language as 'en' | 'ru' | 'kz';

  const filteredCities = cityQuery.length > 0
    ? searchCities(cityQuery, lang).slice(0, 8)
    : TOP_DESTINATIONS.slice(0, 8);

  // Click outside handlers
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCityDropdown(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCitySelect = useCallback((city: KZCity) => {
    setSelectedCity(city);
    setCityQuery(city.name[lang]);
    setShowCityDropdown(false);
  }, [lang]);

  const handleSearch = () => {
    onSearch({
      cityId: selectedCity?.id || null,
      cityName: selectedCity?.name[lang] || cityQuery,
      checkIn,
      checkOut,
      guests,
      rooms,
    });
  };

  const isHero = variant === 'hero';

  return (
    <div className={`w-full ${isHero ? 'max-w-5xl mx-auto' : ''}`}>
      <div
        className={`flex flex-col lg:flex-row items-stretch border ${isHero ? 'shadow-[0_8px_60px_rgba(0,0,0,0.4)]' : 'shadow-lg'}`}
        style={{
          backgroundColor: isHero ? `${theme.background}F5` : theme.background,
          borderColor: `${theme.text}15`,
          backdropFilter: isHero ? 'blur(20px)' : undefined,
        }}
      >
        {/* ── Destination ── */}
        <div ref={cityRef} className="relative flex-[2] border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${theme.text}10` }}>
          <div
            className="flex items-center gap-3 px-5 py-4 cursor-pointer"
            onClick={() => setShowCityDropdown(true)}
          >
            <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] block mb-0.5" style={{ color: `${theme.text}60` }}>
                {l.where}
              </span>
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => { setCityQuery(e.target.value); setShowCityDropdown(true); setSelectedCity(null); }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder={language === 'ru' ? 'Алматы, Астана, Актау...' : language === 'kz' ? 'Алматы, Астана, Ақтау...' : 'Almaty, Astana, Aktau...'}
                className="w-full bg-transparent text-sm font-black outline-none placeholder:opacity-30"
                style={{ color: theme.text }}
              />
            </div>
            {cityQuery && (
              <button onClick={(e) => { e.stopPropagation(); setCityQuery(''); setSelectedCity(null); }} className="p-1 opacity-40 hover:opacity-100">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* City Dropdown */}
          <AnimatePresence>
            {showCityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 z-50 border border-t-0 max-h-[360px] overflow-y-auto"
                style={{ backgroundColor: theme.background, borderColor: `${theme.text}15`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              >
                <div className="px-4 py-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: `${theme.text}40` }}>
                    {cityQuery ? l.allCities : l.popular}
                  </span>
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-current/5 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 overflow-hidden shrink-0 border" style={{ borderColor: `${theme.text}10` }}>
                      <img src={city.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black block truncate" style={{ color: theme.text }}>
                        {city.name[lang]}
                      </span>
                      <span className="text-[9px] opacity-40 truncate block">
                        {city.region[lang]}
                      </span>
                    </div>
                    {city.tier === 1 && (
                      <span className="text-[7px] font-black uppercase tracking-[0.3em] px-2 py-0.5 border" style={{ color: theme.primary, borderColor: `${theme.primary}30` }}>
                        TOP
                      </span>
                    )}
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                      {language === 'ru' ? 'Ничего не найдено' : language === 'kz' ? 'Ештеңе табылмады' : 'No results found'}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Check-in ── */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${theme.text}10` }}>
          <div className="flex items-center gap-3 px-5 py-4">
            <Calendar className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] block mb-0.5" style={{ color: `${theme.text}60` }}>
                {l.checkIn}
              </span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm font-black outline-none"
                style={{ color: theme.text, colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        {/* ── Check-out ── */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${theme.text}10` }}>
          <div className="flex items-center gap-3 px-5 py-4">
            <Calendar className="w-4 h-4 shrink-0" style={{ color: `${theme.primary}80` }} />
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] block mb-0.5" style={{ color: `${theme.text}60` }}>
                {l.checkOut}
              </span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm font-black outline-none"
                style={{ color: theme.text, colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        {/* ── Guests ── */}
        <div ref={guestRef} className="relative flex-1 border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${theme.text}10` }}>
          <div
            className="flex items-center gap-3 px-5 py-4 cursor-pointer"
            onClick={() => setShowGuestPicker(!showGuestPicker)}
          >
            <Users className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
            <div className="flex-1">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] block mb-0.5" style={{ color: `${theme.text}60` }}>
                {l.guests}
              </span>
              <span className="text-sm font-black" style={{ color: theme.text }}>
                {guests} {l.guests.toLowerCase()} · {rooms} {l.room.toLowerCase()}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-40" />
          </div>

          <AnimatePresence>
            {showGuestPicker && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full right-0 z-50 w-64 border p-4 space-y-4"
                style={{ backgroundColor: theme.background, borderColor: `${theme.text}15`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              >
                {[
                  { label: l.adult, value: guests, set: setGuests, min: 1, max: 16 },
                  { label: l.room, value: rooms, set: setRooms, min: 1, max: 8 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.text }}>{item.label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => item.set(Math.max(item.min, item.value - 1))}
                        className="w-8 h-8 border flex items-center justify-center text-sm font-black hover:bg-current/5 transition-colors"
                        style={{ borderColor: `${theme.text}20` }}
                      >−</button>
                      <span className="text-sm font-black font-mono w-6 text-center">{item.value}</span>
                      <button
                        onClick={() => item.set(Math.min(item.max, item.value + 1))}
                        className="w-8 h-8 border flex items-center justify-center text-sm font-black hover:bg-current/5 transition-colors"
                        style={{ borderColor: `${theme.text}20` }}
                      >+</button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full py-2 text-[9px] font-black uppercase tracking-[0.3em] border transition-colors hover:bg-current/5"
                  style={{ borderColor: `${theme.text}20`, color: theme.primary }}
                >
                  {l.done}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Search Button ── */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-3 px-8 py-4 lg:px-10 transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: theme.primary, color: theme.primaryForeground || '#000' }}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] lg:block hidden">{l.search}</span>
        </button>
      </div>
    </div>
  );
};
