import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Luggage, Plus, Trash2, Scale, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface Item {
    id: string;
    text: string;
    checked: boolean;
    category: string;
    weight: number; // in grams
}

export const PackingList = ({ season, region }: { season: string, region: string }) => {
    const { theme } = useSeason();
    const { t } = useLanguage();
    const [items, setItems] = useState<Item[]>([]);
    const [input, setInput] = useState('');
    const [weightLimit, setWeightLimit] = useState(20000); // 20kg default
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [confirmReset, setConfirmReset] = useState(false);

    const getDefaultItems = (): Record<string, {text: string, weight: number, key: string}[]> => ({
        'Global': [
            {text: t('item_sat_phone') || 'Satellite Phone', key: 'item_sat_phone', weight: 450},
            {text: t('item_solar') || 'Solar Charger', key: 'item_solar', weight: 300},
            {text: t('item_first_aid') || 'First Aid Kit', key: 'item_first_aid', weight: 800},
            {text: t('item_adapter') || 'Universal Adapter', key: 'item_adapter', weight: 150}
        ],
        'Almaty': [
            {text: t('item_boots') || 'Hiking Boots', key: 'item_boots', weight: 1200},
            {text: t('item_sunscreen') || 'Sunscreen', key: 'item_sunscreen', weight: 100},
            {text: t('item_jacket') || 'Alpine Shell Jacket', key: 'item_jacket', weight: 500}
        ],
        'Mangystau': [
            {text: t('item_water') || 'Extra Water Tank (10L)', key: 'item_water', weight: 10500},
            {text: t('item_goggles') || 'Sand-proof Goggles', key: 'item_goggles', weight: 200},
            {text: t('item_shemagh') || 'Desert Shemagh', key: 'item_shemagh', weight: 150}
        ],
        'Astana': [
            {text: t('item_windbreaker') || 'Windbreaker Pro', key: 'item_windbreaker', weight: 400},
            {text: t('item_thermal') || 'Thermal Layers', key: 'item_thermal', weight: 600},
            {text: t('item_lip_balm') || 'Lip Balm', key: 'item_lip_balm', weight: 20}
        ],
        'Etiquette': [
            {text: t('item_socks') || 'Clean Socks (for Yurts)', key: 'item_socks', weight: 50},
            {text: t('item_gifts') || 'Small Gifts (Shashu)', key: 'item_gifts', weight: 200},
            {text: t('item_headscarf') || 'Headscarf', key: 'item_headscarf', weight: 100}
        ]
    });

    useEffect(() => {
        const saved = localStorage.getItem('kendala_packing_list');
        if (saved) {
            const parsed = JSON.parse(saved);
            setItems(parsed);
            if (parsed.length > 0) setShowSuggestions(false);
        }
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('kendala_packing_list', JSON.stringify(items));
        }
    }, [items]);

    const totalWeight = items.reduce((acc, item) => acc + (item.checked ? 0 : item.weight), 0);
    const weightPercent = Math.min(100, (totalWeight / weightLimit) * 100);

    const toggle = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const addItem = () => {
        if (!input.trim()) return;
        setItems(prev => [...prev, { id: crypto.randomUUID(), text: input, checked: false, category: 'Custom', weight: 500 }]);
        setInput('');
    };

    const addSuggested = (item: {text: string, weight: number, key: string}, category: string) => {
        if (items.some(i => i.text === item.text)) return;
        setItems(prev => [...prev, { id: crypto.randomUUID(), text: item.text, checked: false, category, weight: item.weight }]);
    };

    const addAllSuggestions = () => {
        const DEFAULT_ITEMS = getDefaultItems();
        const newItems: Item[] = [];
        
        DEFAULT_ITEMS['Global'].forEach(i => {
            if (!items.some(existing => existing.text === i.text)) {
                newItems.push({ id: crypto.randomUUID(), text: i.text, checked: false, category: 'cat_global', weight: i.weight });
            }
        });
        
        if (region.includes('Almaty')) {
            DEFAULT_ITEMS['Almaty'].forEach(i => {
                if (!items.some(existing => existing.text === i.text)) {
                    newItems.push({ id: crypto.randomUUID(), text: i.text, checked: false, category: 'cat_almaty', weight: i.weight });
                }
            });
        } else if (region.includes('Mangystau') || region.includes('Aktau')) {
            DEFAULT_ITEMS['Mangystau'].forEach(i => {
                if (!items.some(existing => existing.text === i.text)) {
                    newItems.push({ id: crypto.randomUUID(), text: i.text, checked: false, category: 'cat_mangystau', weight: i.weight });
                }
            });
        } else if (region.includes('Astana')) {
            DEFAULT_ITEMS['Astana'].forEach(i => {
                if (!items.some(existing => existing.text === i.text)) {
                    newItems.push({ id: crypto.randomUUID(), text: i.text, checked: false, category: 'cat_astana', weight: i.weight });
                }
            });
        }
        
        DEFAULT_ITEMS['Etiquette'].forEach(i => {
            if (!items.some(existing => existing.text === i.text)) {
                newItems.push({ id: crypto.randomUUID(), text: i.text, checked: false, category: 'cat_etiquette', weight: i.weight });
            }
        });
        
        setItems(prev => [...prev, ...newItems]);
        setShowSuggestions(false);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const clear = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000);
            return;
        }
        localStorage.removeItem('kendala_packing_list');
        setItems([]);
        setShowSuggestions(true);
        setConfirmReset(false);
    };

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full p-6 md:p-10" style={{ color: theme.text }}>
            <div className="flex justify-between items-start mb-8 md:mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8" style={{ backgroundColor: theme.primary }} />
                    <div className="space-y-0.5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{t('loadout_balancer')}</h3>
                        <p className="text-xl font-serif italic">{t('survival_inventory')}</p>
                    </div>
                </div>
                <button 
                    onClick={clear} 
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b pb-1 ${confirmReset ? 'opacity-100 border-red-500 text-red-500' : 'opacity-30 hover:opacity-100 border-transparent hover:border-current'}`}
                >
                    {confirmReset ? (t('confirm_reset') || 'Tap again to confirm') : (t('reset') || 'Reset')}
                </button>
            </div>

            <div className="mb-8 md:mb-10 p-6 md:p-8 border space-y-6" style={{ borderColor: `${theme.text}10`, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase opacity-40">{t('current_payload')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">{(totalWeight / 1000).toFixed(1)}</span>
                            <span className="text-sm font-black opacity-30">KG</span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-[9px] font-mono uppercase opacity-40">{t('nomadic_limit')}</span>
                        <span className="block text-sm font-black">{(weightLimit / 1000).toFixed(0)} KG</span>
                    </div>
                </div>
                <div className="relative h-2 bg-current/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${weightPercent}%` }}
                        className="absolute inset-y-0 left-0 transition-all duration-500"
                        style={{ backgroundColor: weightPercent > 90 ? '#ef4444' : theme.primary }}
                    />
                </div>
                <div className="flex items-center gap-2 opacity-40">
                    <Info className="w-3 h-3" />
                    <span className="text-[8px] font-mono uppercase tracking-widest">{t('transport_calc')}</span>
                </div>
            </div>

            <div className="flex gap-4 mb-6 md:mb-8">
                <div className="relative flex-1 group">
                    <input 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                        placeholder={t('scan_item')}
                        className="w-full bg-white/5 border px-6 py-4 text-sm font-bold outline-none focus:border-current/40 transition-all placeholder:text-current/20"
                        style={{ borderColor: `${theme.text}10` }}
                    />
                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-10 group-focus-within:opacity-40 transition-opacity" />
                </div>
                <button onClick={addItem} className="px-8 transition-all hover:scale-105 active:scale-95 shadow-lg" style={{ backgroundColor: theme.text, color: theme.background }}>
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {showSuggestions && items.length === 0 && (
                <div className="mb-6 p-5 border border-dashed space-y-4" style={{ borderColor: `${theme.text}15` }}>
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{t('suggested_items') || 'Suggested Items'}</span>
                        <button 
                            onClick={addAllSuggestions}
                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border transition-all hover:scale-105"
                            style={{ borderColor: theme.primary, color: theme.primary }}
                        >
                            {t('add_all') || '+ Add All'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(() => {
                            const DEFAULT_ITEMS = getDefaultItems();
                            const suggestions = [
                                ...DEFAULT_ITEMS['Global'].map(i => ({ ...i, cat: 'cat_global' })),
                                ...(region.includes('Almaty') ? DEFAULT_ITEMS['Almaty'].map(i => ({ ...i, cat: 'cat_almaty' })) : []),
                                ...(region.includes('Mangystau') || region.includes('Aktau') ? DEFAULT_ITEMS['Mangystau'].map(i => ({ ...i, cat: 'cat_mangystau' })) : []),
                                ...(region.includes('Astana') ? DEFAULT_ITEMS['Astana'].map(i => ({ ...i, cat: 'cat_astana' })) : []),
                                ...DEFAULT_ITEMS['Etiquette'].map(i => ({ ...i, cat: 'cat_etiquette' })),
                            ];
                            return suggestions.map(s => (
                                <button
                                    key={s.key}
                                    onClick={() => addSuggested(s, s.cat)}
                                    className="px-3 py-2 border text-[10px] font-bold uppercase tracking-wider hover:bg-black/5 transition-all flex items-center gap-2"
                                    style={{ borderColor: `${theme.text}15` }}
                                >
                                    <Plus className="w-3 h-3 opacity-40" />
                                    {s.text}
                                    <span className="opacity-30 font-mono text-[8px]">{s.weight}g</span>
                                </button>
                            ));
                        })()}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`group flex items-center gap-6 p-5 border transition-all relative overflow-hidden ${item.checked ? 'opacity-30' : 'hover:border-current/30'}`}
                            style={{ 
                                backgroundColor: item.checked ? 'transparent' : 'rgba(255,255,255,0.03)',
                                borderColor: `${theme.text}10`
                            }}
                        >
                            {item.checked && (
                                <div className="absolute inset-0 bg-current opacity-[0.03] pointer-events-none" />
                            )}
                            <button onClick={() => toggle(item.id)} className="shrink-0 transition-transform group-hover:scale-110">
                                {item.checked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 opacity-20" />}
                            </button>
                            <div className="flex-1 space-y-1">
                                <span className={`text-base font-bold uppercase tracking-tight ${item.checked ? 'line-through' : ''}`}>{t(item.text) || item.text}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-40 px-2 py-0.5 border border-current/10">{t(item.category) || item.category}</span>
                                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">~{item.weight}G</span>
                                </div>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};