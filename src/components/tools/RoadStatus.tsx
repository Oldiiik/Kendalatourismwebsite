import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, AlertTriangle, CheckCircle, Search, MapPin, Loader2, RefreshCw, Droplets, Gauge, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const INITIAL_CITIES = ['Almaty', 'Astana', 'Aktau', 'Shymkent', 'Karaganda', 'Oskemen', 'Atyrau', 'Turkestan'];

export const RoadStatus = () => {
    const { theme } = useSeason();
    const { t } = useLanguage();
    const [city, setCity] = useState('Almaty');
    const [cities, setCities] = useState(INITIAL_CITIES);
    const [isAdding, setIsAdding] = useState(false);
    const [newCity, setNewCity] = useState('');
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddCity = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCity.trim()) {
            setCities([...cities, newCity.trim()]);
            setCity(newCity.trim());
            setNewCity('');
            setIsAdding(false);
        }
    };

    const fetchWeather = async (cityName: string) => {
        setLoading(true);
        setError('');
        try {
            // Pass language to the backend if supported, otherwise we handle static translations
            const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/weather?city=${cityName}&lang=${t('lang_code') || 'en'}`, {
                headers: { 'Authorization': `Bearer ${publicAnonKey}` }
            });
            const data = await res.json();
            if (res.ok) {
                setWeather(data);
            } else {
                setError(data.error || t('failed_fetch') || 'Failed to fetch');
            }
        } catch (e) {
            setError(t('connection_error') || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'RED': return 'text-red-500 bg-red-500/5 border-red-500/20';
            case 'YELLOW': return 'text-amber-500 bg-amber-500/5 border-amber-500/20';
            default: return 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20';
        }
    };

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full p-5 md:p-8" style={{ color: theme.text }}>
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-6" style={{ backgroundColor: theme.primary }} />
                    <div className="space-y-0.5">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{t('aspan_intelligence')}</h3>
                        <p className="text-base md:text-lg font-serif italic">{t('weather_logistics')}</p>
                    </div>
                </div>
                <button 
                    onClick={() => fetchWeather(city)}
                    className="p-2.5 border rounded-full hover:rotate-180 transition-all duration-700"
                    style={{ borderColor: `${theme.text}10` }}
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 md:mb-8">
                {cities.map(c => (
                    <button 
                        key={c}
                        onClick={() => setCity(c)}
                        className="px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all duration-300 relative overflow-hidden group"
                        style={{ 
                            backgroundColor: city === c ? theme.text : 'transparent',
                            color: city === c ? theme.background : theme.text,
                            borderColor: city === c ? theme.text : `${theme.text}20`
                        }}
                    >
                        <span className="relative z-10">{t(c) || c}</span>
                        {city === c && (
                            <motion.div 
                                layoutId="city-indicator"
                                className="absolute inset-0 bg-current opacity-10"
                            />
                        )}
                    </button>
                ))}
                
                {isAdding ? (
                    <form onSubmit={handleAddCity} className="flex items-center gap-2">
                        <input 
                            type="text" 
                            autoFocus
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder={t('enter_city_name') || "Enter city..."}
                            className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border bg-transparent focus:outline-none w-32"
                            style={{ borderColor: theme.primary, color: theme.text }}
                        />
                        <button 
                            type="submit"
                            className="p-2.5 border bg-white/10 hover:bg-white/20 transition-colors"
                            style={{ borderColor: theme.primary, color: theme.text }}
                        >
                            <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="p-2.5 border hover:bg-white/10 transition-colors"
                            style={{ borderColor: `${theme.text}20`, color: theme.text }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2.5 border border-dashed hover:border-solid transition-all duration-300 flex items-center gap-2 group"
                        style={{ borderColor: `${theme.text}20`, color: theme.text }}
                    >
                        <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">{t('add_city') || 'Add'}</span>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-64 flex flex-col items-center justify-center space-y-4">
                            <RefreshCw className="w-10 h-10 animate-spin opacity-20" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">{t('interrogating_spirits')}</span>
                        </motion.div>
                    ) : weather ? (
                        <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6 pb-6">
                            
                            {/* Difficulty Block — compact */}
                            <div className={`p-5 md:p-6 border-2 text-center space-y-2 relative overflow-hidden group ${getDifficultyColor(weather.difficulty)}`}>
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <AlertTriangle className="w-16 h-16 -mr-4 -mt-4" />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <span className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-60">{t('strategic_difficulty')}</span>
                                    <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">{weather.difficulty}</h4>
                                </div>
                                <p className="text-xs font-serif italic relative z-10 opacity-80">{weather.warning}</p>
                            </div>

                            {/* Weather Stats — 3 compact blocks */}
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                                <div className="p-4 md:p-5 border space-y-3 group hover:border-current/30 transition-all" style={{ borderColor: `${theme.text}10` }}>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Thermometer className="w-3.5 h-3.5" />
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{t('temperature')}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-xl md:text-3xl font-black tabular-nums block">{weather.main?.temp}°</span>
                                        <p className="text-[8px] md:text-[9px] font-mono uppercase opacity-30">{t('feels_like')} {weather.main?.feels_like}°</p>
                                    </div>
                                </div>

                                <div className="p-4 md:p-5 border space-y-3 group hover:border-current/30 transition-all" style={{ borderColor: `${theme.text}10` }}>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Wind className="w-3.5 h-3.5" />
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{t('wind_velocity')}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-xl md:text-3xl font-black tabular-nums block">{weather.wind?.speed}<span className="text-xs ml-0.5 opacity-50">m/s</span></span>
                                        <p className="text-[8px] md:text-[9px] font-mono uppercase opacity-30">{weather.wind?.deg}°</p>
                                    </div>
                                </div>

                                <div className="p-4 md:p-5 border space-y-3 group hover:border-current/30 transition-all" style={{ borderColor: `${theme.text}10` }}>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Droplets className="w-3.5 h-3.5" />
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{t('humidity')}</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-xl md:text-3xl font-black tabular-nums block">{weather.main?.humidity}<span className="text-xs ml-0.5 opacity-50">%</span></span>
                                        <p className="text-[8px] md:text-[9px] font-mono uppercase opacity-30">{t('precip_potential')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pressure row — compact */}
                            <div className="p-4 md:p-5 border flex items-center gap-4 group hover:bg-white/5 transition-all" style={{ borderColor: `${theme.text}10` }}>
                                <div className="p-2.5 rounded-full" style={{ backgroundColor: `${theme.text}08` }}><Gauge className="w-5 h-5" /></div>
                                <div className="flex-1">
                                    <span className="block text-[8px] font-mono uppercase opacity-40 mb-0.5">{t('pressure')}</span>
                                    <span className="text-base font-bold">{weather.main?.pressure} hPa</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[8px] font-mono uppercase opacity-40 mb-0.5">{t('provider')}</span>
                                    <span className="text-[9px] font-black uppercase tracking-tight">Google / Open-Meteo</span>
                                </div>
                            </div>

                            {/* Emergency footer — compact */}
                            <div className="p-4 md:p-5 space-y-3" style={{ backgroundColor: theme.text, color: theme.background }}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-500/20 rounded-full"><CheckCircle className="w-4 h-4 text-emerald-500" /></div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest">{t('emergency_comms')}</h5>
                                </div>
                                <p className="text-xs font-serif italic opacity-60 leading-relaxed">
                                    {t('steppe_warning')}
                                </p>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="text-center py-32 opacity-20 border-2 border-dashed flex flex-col items-center justify-center gap-4" style={{ borderColor: `${theme.text}20` }}>
                            <AlertTriangle className="w-12 h-12" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-widest">{t('signal_interference')}</h4>
                                <p className="text-[10px] font-mono uppercase">{error || t('satellite_lost')}</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};