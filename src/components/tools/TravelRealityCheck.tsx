import React, { useState, useEffect } from 'react';
import { Plane, Train, MapPin, Navigation, Clock, ArrowRight, Plus, Maximize2, Info, Compass, Car, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

export const TravelRealityCheck = () => {
    const { theme } = useSeason();
    const { t, language } = useLanguage();
    const [from, setFrom] = useState('Almaty');
    const [to, setTo] = useState('Astana');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const calculateTrajectory = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;

            const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/logistics/estimate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}`,
                    'x-user-token': token
                },
                body: JSON.stringify({ from, to, language })
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateTrajectory();
    }, []);

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full p-10" style={{ color: theme.text }}>
            <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8" style={{ backgroundColor: theme.primary }} />
                    <div className="space-y-0.5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{t('steppe_realist_ai')}</h3>
                        <p className="text-xl font-serif italic">{t('time_distortion')}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 border-2 border-dashed space-y-6 mb-10" style={{ borderColor: `${theme.text}20` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase opacity-40">{t('point_a')}</label>
                        <input 
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="w-full bg-transparent border-b-2 py-2 outline-none text-2xl font-black tracking-tight"
                            style={{ borderColor: `${theme.text}10` }}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono uppercase opacity-40">{t('point_b')}</label>
                        <input 
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="w-full bg-transparent border-b-2 py-2 outline-none text-2xl font-black tracking-tight"
                            style={{ borderColor: `${theme.text}10` }}
                        />
                    </div>
                </div>
                <button 
                    onClick={calculateTrajectory}
                    disabled={loading}
                    className="w-full py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:opacity-90 flex items-center justify-center gap-3"
                    style={{ backgroundColor: theme.text, color: theme.background }}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {loading ? t('consulting_spirits') : t('calc_trajectory')}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                    {result && !loading ? (
                        result.error ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60 space-y-4"
                            >
                                <Info className="w-12 h-12" />
                                <p className="text-sm font-mono uppercase tracking-widest">{result.error}</p>
                            </motion.div>
                        ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 pb-10"
                        >
                            {/* AI Wisdom Banner */}
                            <div className="p-8 border bg-current/5 space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Compass className="w-20 h-20" />
                                </div>
                                <span className="text-[9px] font-mono uppercase tracking-widest opacity-40">{t('nomad_reality_check')}</span>
                                <p className="text-xl font-serif italic leading-relaxed">"{result.wisdom}"</p>
                                <div className="flex gap-4 border-t pt-4 border-current/10">
                                    <div className="flex-1">
                                        <span className="block text-[8px] font-mono uppercase opacity-40">{t('distortion')}</span>
                                        <span className="text-xs font-black uppercase">{result.distortion}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[8px] font-mono uppercase opacity-40">{t('geo_scale')}</span>
                                        <span className="text-xs font-black uppercase">{result.scale}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-8 border border-current/10 space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Navigation className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{t('calc_distance')}</span>
                                    </div>
                                    <span className="text-5xl font-black tabular-nums">{result.distance_km} <span className="text-sm opacity-30">KM</span></span>
                                </div>

                                <div className="p-8 border border-current/10 space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Plane className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{t('air_bridge')}</span>
                                    </div>
                                    <span className="text-5xl font-black tabular-nums">~{result.plane_hrs} <span className="text-sm opacity-30">HRS</span></span>
                                </div>

                                <div className="p-8 border border-current/10 space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Train className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{t('nomad_rail')}</span>
                                    </div>
                                    <span className="text-5xl font-black tabular-nums">~{result.train_hrs} <span className="text-sm opacity-30">HRS</span></span>
                                </div>

                                <div className="p-8 border border-current/10 space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Car className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{t('overland_drive')}</span>
                                    </div>
                                    <span className="text-5xl font-black tabular-nums">~{result.car_hrs} <span className="text-sm opacity-30">HRS</span></span>
                                </div>
                            </div>
                        </motion.div>
                        )
                    ) : loading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-4 opacity-20">
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.5em]">{t('sync_steppe')}</span>
                        </div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
