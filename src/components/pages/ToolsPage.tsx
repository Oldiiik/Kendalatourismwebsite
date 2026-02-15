import React, { useState, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
    Cloud, Shield, Globe, Map, Navigation, 
    Menu, X, FileDown, Luggage, Heart, AlertTriangle,
    Wind, ShieldCheck, Compass, Zap, Star, Loader2, Info
} from 'lucide-react';
import { Mountain } from '../ui/icons';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { hq } from '../../utils/imageUrls';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

import { PackingList } from '../tools/PackingList';
import { TravelRealityCheck } from '../tools/TravelRealityCheck';
import { CultureGuide } from '../tools/CultureGuide';
import { RoadStatus } from '../tools/RoadStatus';
import { PdfExporter } from '../tools/PdfExporter';

const NomadicNavigator = () => {
    const { theme, season } = useSeason();
    const { t, language } = useLanguage();
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    const [heading, setHeading] = useState(0);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [reading, setReading] = useState<{star_name: string, reading: string} | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setGeoError(null);
                },
                (err) => {
                    console.warn("Geo error", err);
                    setGeoError(err.message);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        } else {
             setGeoError("Geolocation Not Supported");
        }
    }, []);

    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.webkitCompassHeading) {
                setHeading(e.webkitCompassHeading);
            } else if (e.alpha !== null) {
                setHeading(360 - e.alpha);
            }
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const consultStars = async () => {
        if (!coords) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;

            const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/ai/starnav`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}`,
                    'x-user-token': token
                },
                body: JSON.stringify({ 
                    lat: coords.lat, 
                    lng: coords.lng, 
                    heading: heading || 0,
                    season: season || 'summer',
                    language: language 
                })
            });
            
            if (!res.ok) throw new Error("Star-Nav Uplink Failed");
            
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setReading(data);
        } catch (e) {
            console.error(e);
            setReading({ 
                star_name: t('clouds_obscure') || "Clouds Obscure the Sky", 
                reading: t('ancestors_silent') || "The ancestors are silent. Trust your inner compass for now." 
            });
        } finally {
            setLoading(false);
        }
    };

    const getDirection = (deg: number) => {
        const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return dirs[Math.round(deg / 22.5) % 16];
    };

    const forceLocation = () => {
        setCoords({ lat: 43.2551, lng: 76.9126 });
        setGeoError(null);
    };

    return (
        <div className="flex flex-col h-full p-10" style={{ color: theme.text }}>
            <div className="flex items-center gap-3 mb-10">
                <Compass className="w-5 h-5 opacity-40" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">{t('starnav_protocol') || 'Star-Nav Protocol'}</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                
                {reading ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 max-w-md"
                    >
                        <div className="inline-block p-4 border rounded-full mb-4 animate-pulse" style={{ borderColor: theme.primary }}>
                            <Star className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{t('celestial_guide') || 'Celestial Guide'}</span>
                            <h2 className="text-3xl font-serif italic">{reading.star_name}</h2>
                        </div>
                        <p className="text-sm font-medium leading-loose opacity-80 border-t border-b py-6" style={{ borderColor: `${theme.text}20` }}>
                            "{reading.reading}"
                        </p>
                        <button 
                            onClick={() => setReading(null)}
                            className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {t('return_nav') || 'Return to Navigation'}
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="relative w-72 h-72">
                            <motion.div 
                                animate={{ rotate: -heading }}
                                className="absolute inset-0 border-2 rounded-full opacity-20 transition-transform duration-500"
                                style={{ borderColor: theme.text }}
                            >
                                <span className="absolute top-2 left-1/2 -translate-x-1/2 font-black text-[10px]">N</span>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-black text-[10px]">S</span>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-[10px]">E</span>
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-black text-[10px]">W</span>
                            </motion.div>
                            
                            <motion.div 
                                animate={{ rotate: heading }}
                                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-6 border rounded-full border-dashed opacity-10"
                                style={{ borderColor: theme.text }}
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="block text-[10px] font-mono uppercase tracking-[0.5em] mb-2 opacity-40">{t('bearing') || 'Bearing'}</span>
                                    <span className="text-7xl font-black tracking-tighter uppercase">{getDirection(heading)}</span>
                                    <span className="block text-[12px] font-mono mt-2 font-black">{Math.round(heading)}°</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-6 max-w-sm">
                            <div className="p-6 border border-current/10 space-y-2 backdrop-blur-md">
                                <span className="block text-[8px] font-mono uppercase tracking-widest opacity-40">{t('latitude') || 'Latitude'}</span>
                                <span className="text-xl font-bold font-mono">
                                    {coords ? coords.lat.toFixed(4) : (geoError ? "ERR" : t('searching') || "Searching...")}
                                </span>
                            </div>
                            <div className="p-6 border border-current/10 space-y-2 backdrop-blur-md">
                                <span className="block text-[8px] font-mono uppercase tracking-widest opacity-40">{t('longitude') || 'Longitude'}</span>
                                <span className="text-xl font-bold font-mono">
                                     {coords ? coords.lng.toFixed(4) : (geoError ? "ERR" : t('searching') || "Searching...")}
                                </span>
                            </div>
                        </div>

                        <div className="w-full max-w-sm space-y-4">
                            {geoError ? (
                                <div className="text-center space-y-4">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-red-500 leading-relaxed">
                                        {t('signal_interrupted') || 'Signal Interrupted'}: {geoError === "Geolocation Not Supported" ? t('geolocation_not_supported') : geoError}
                                    </p>
                                    <button onClick={forceLocation} className="text-[9px] underline opacity-50 hover:opacity-100">
                                        {t('force_calibration') || '[DEV] Force Calibration'}
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={consultStars}
                                    disabled={loading || !coords}
                                    className="w-full py-4 border hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                                    style={{ borderColor: `${theme.text}20` }}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 group-hover:scale-125 transition-transform" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {loading ? (t('reading_sky') || "Reading the Sky...") : (t('consult_ancestors') || "Consult the Ancestors")}
                                    </span>
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const IMAGES = {
    WEATHER: hq("https://images.unsplash.com/photo-1693642988054-514523c083f7"),
    REALITY: hq("https://images.unsplash.com/photo-1752503256318-2fff2c79af3f"),
    CULTURE: hq("https://images.unsplash.com/photo-1751440355869-fe6673d79f7d"),
    PACKING: hq("https://images.unsplash.com/photo-1752503256199-b14825634c35"),
    PDF: hq("https://images.unsplash.com/photo-1705300307605-66fe7c0a268f"),
    NAV: hq("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a")
};

export const ToolsPage = () => {
    const { theme, season, themeVariant } = useSeason();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('weather');
    const [bgImage, setBgImage] = useState(IMAGES.WEATHER);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const TABS = [
        { id: 'weather', icon: Wind, label: t('aspan_intel') || 'Aspan Intel', bg: IMAGES.WEATHER },
        { id: 'survival', icon: Luggage, label: t('nomad_pack') || 'Nomad Pack', bg: IMAGES.PACKING },
        { id: 'reality', icon: Navigation, label: t('steppe_realist') || 'Steppe Realist', bg: IMAGES.REALITY },
        { id: 'culture', icon: Heart, label: t('ethos_guide') || 'Ethos Guide', bg: IMAGES.CULTURE },
        { id: 'navigator', icon: Compass, label: t('star_nav') || 'Star Nav', bg: IMAGES.NAV },
        { id: 'offline', icon: ShieldCheck, label: t('ghost_protocol') || 'Ghost Protocol', bg: IMAGES.PDF },
    ];

    useEffect(() => {
        const tab = TABS.find(t => t.id === activeTab);
        if (tab) setBgImage(tab.bg);
    }, [activeTab]);

    if (!theme) return null;

    return (
        <div className="min-h-screen font-sans relative overflow-hidden transition-colors duration-1000" style={{ backgroundColor: theme.background, color: theme.text }}>
            
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={bgImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <ImageWithFallback src={bgImage} className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-[3000ms]" alt="bg" />
                        <div className="absolute inset-0 bg-black/10 backdrop-contrast-125" /> 
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${theme.background})` }} /> 
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${theme.background}DD, transparent 40%)` }} /> 
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col md:flex-row max-w-[1700px] mx-auto">
                
                <div className="md:hidden flex flex-col z-50 backdrop-blur-md shrink-0" style={{ backgroundColor: `${theme.background}EE` }}>
                    <div className="flex justify-between items-center px-5 pr-16 py-4 border-b" style={{ borderColor: `${theme.text}10` }}>
                        <h1 className="text-lg font-black tracking-[0.2em]" style={{ color: theme.text }}>KENDALA</h1>
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest opacity-40">{t('prep_protocol')}</span>
                    </div>
                    <div className="overflow-x-auto no-scrollbar border-b" style={{ borderColor: `${theme.text}08` }}>
                        <div className="flex min-w-max px-2 py-2 gap-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-b-2 ${
                                        activeTab === tab.id
                                            ? 'opacity-100'
                                            : 'opacity-40 border-transparent'
                                    }`}
                                    style={{
                                        color: theme.text,
                                        borderColor: activeTab === tab.id ? theme.primary : 'transparent',
                                    }}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex md:flex-col md:relative md:bg-transparent md:w-[420px] md:pt-32 md:pl-20">

                    <div className="mb-12 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[3px]" style={{ backgroundColor: theme.primary }} />
                            <span className="text-[11px] font-mono uppercase tracking-[0.6em] font-black opacity-40" style={{ color: theme.text }}>{t('prep_protocol')}</span>
                        </div>
                        <h1 className="text-7xl font-serif italic tracking-tighter leading-[0.8] pr-10" style={{ color: theme.text }}>{t('nomadic_arsenal') || 'Nomadic Arsenal'}</h1>
                    </div>

                    <div className="flex flex-col gap-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group flex items-center gap-5 text-left px-8 py-6 font-black text-[11px] uppercase tracking-[0.4em] transition-all border-l-[6px]
                                    ${activeTab === tab.id 
                                        ? 'shadow-2xl translate-x-4' 
                                        : 'hover:bg-black/5 hover:translate-x-2'}
                                `}
                                style={{ 
                                    backgroundColor: activeTab === tab.id ? theme.text : 'rgba(255,255,255,0.03)',
                                    color: activeTab === tab.id ? (themeVariant === 'dark' ? '#000000' : '#FFFFFF') : theme.text,
                                    borderColor: activeTab === tab.id ? theme.primary : `${theme.text}10`
                                }}
                            >
                                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-125 duration-300`} />
                                {tab.label}
                                {activeTab === tab.id && <Zap className="w-3 h-3 ml-auto animate-pulse" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-16">
                        <div className="p-8 border-l-2 space-y-6" style={{ borderColor: theme.primary }}>
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono font-black uppercase tracking-widest opacity-30 block">{t('current_loadout')}</span>
                                <div className="flex gap-2">
                                    <div className="w-full h-1 bg-current opacity-10 rounded-full overflow-hidden">
                                        <div className="h-full bg-current opacity-50 w-3/4" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] font-serif italic leading-relaxed opacity-40">
                                {t('nomad_quote')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-start md:justify-center p-2 md:p-8 lg:p-16 relative pointer-events-none z-10">
                    <motion.div 
                        layout
                        className="pointer-events-auto w-full md:max-w-3xl ml-auto shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden min-h-[60vh] md:min-h-0 md:h-[85vh] flex flex-col border-y-2 md:border-2 backdrop-blur-3xl"
                        style={{ 
                            backgroundColor: theme.cardBg.includes('rgba') 
                                ? theme.cardBg.replace(/[\d.]+\)$/, '0.7)') 
                                : `${theme.cardBg}BB`, 
                            borderColor: `${theme.text}15`
                        }}
                    >
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.98, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 1.02, x: -10 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="h-full flex-1 overflow-hidden"
                                >
                                    {activeTab === 'weather' && <RoadStatus />}
                                    {activeTab === 'survival' && <PackingList season={season || 'summer'} region="Almaty" />}
                                    {activeTab === 'reality' && <TravelRealityCheck />}
                                    {activeTab === 'culture' && <CultureGuide />}
                                    {activeTab === 'navigator' && <NomadicNavigator />}
                                    {activeTab === 'offline' && <PdfExporter />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${theme.text}15;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${theme.text}30;
                }
            `}} />
        </div>
    );
};