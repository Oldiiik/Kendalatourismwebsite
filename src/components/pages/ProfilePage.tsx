import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { useSeason, type Season, type ThemeVariant } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PageTransition } from '../ui/PageTransition';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { 
    User as UserIcon, LogOut, Mountain, Edit2, Globe, Plane,
    Shield, ChevronRight, ChevronLeft, PlusCircle,
    Crown, Palette, Star, Compass, Heart,
    Sparkles, Check, Sun
} from '../ui/icons';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { AuthPage } from './AuthPage';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';
import { PremiumBadge } from '../ui/PremiumGate';

interface Trip {
    id: string; title: string; destination: string;
    startDate: string; endDate: string;
    status: 'planning' | 'confirmed' | 'completed'; image?: string;
}
interface WishlistItem { id: string; name: string; region: string; category: string; }

const GUEST_TRIPS: Trip[] = [
    { id: 'g1', title: 'Almaty Mountain Trek', destination: 'Almaty', startDate: '2025-06-15', endDate: '2025-06-22', status: 'completed' },
    { id: 'g2', title: 'Astana City Tour', destination: 'Astana', startDate: '2025-08-01', endDate: '2025-08-05', status: 'completed' },
    { id: 'g3', title: 'Charyn Canyon Expedition', destination: 'Charyn Canyon', startDate: '2025-09-10', endDate: '2025-09-14', status: 'completed' },
    { id: 'g4', title: 'Turkestan Pilgrimage', destination: 'Turkestan', startDate: '2025-10-01', endDate: '2025-10-04', status: 'completed' },
];
const GUEST_WISHLIST: WishlistItem[] = [
    { id: 'w1', name: 'Kolsai Lakes', region: 'Almaty Region', category: 'Nature' },
    { id: 'w2', name: 'Baikonur Cosmodrome', region: 'Kyzylorda', category: 'History' },
];

// ═══ PASSPORT THEMES ═══
interface PassportTheme {
    id: string; name: string; cover: string; coverDark: string;
    accent: string; accentLight: string; spine: string; foil: string;
    gradient: string; premium?: boolean;
}

const PASSPORT_THEMES: PassportTheme[] = [
    { id: 'classic', name: 'Classic Teal', cover: '#005b6e', coverDark: '#003f4d', accent: '#B8860B', accentLight: '#DAA520', spine: '#003f4d', foil: '#B8860B', gradient: 'from-cyan-900/40 via-transparent to-black/60' },
    { id: 'midnight', name: 'Midnight Blue', cover: '#0f1729', coverDark: '#070d1a', accent: '#c0c0c0', accentLight: '#e0e0e0', spine: '#070d1a', foil: '#c0c0c0', gradient: 'from-blue-900/40 via-transparent to-black/60', premium: true },
    { id: 'royal', name: 'Royal Gold', cover: '#1a1008', coverDark: '#0d0804', accent: '#DAA520', accentLight: '#FFD700', spine: '#0d0804', foil: '#FFD700', gradient: 'from-amber-900/40 via-transparent to-black/60', premium: true },
    { id: 'snow', name: 'Arctic White', cover: '#e8e4df', coverDark: '#ccc7c0', accent: '#1a1a1a', accentLight: '#333', spine: '#ccc7c0', foil: '#1a1a1a', gradient: 'from-white/40 via-transparent to-black/20', premium: true },
    { id: 'steppe', name: 'Steppe Bronze', cover: '#3d2b1f', coverDark: '#2a1d14', accent: '#cd7f32', accentLight: '#daa06d', spine: '#2a1d14', foil: '#cd7f32', gradient: 'from-amber-800/40 via-transparent to-black/60', premium: true },
];

// ═══ ACHIEVEMENTS ═══
interface Achievement {
    id: string; icon: any; name: string; desc: string;
    condition: (trips: Trip[], wishlist: WishlistItem[]) => boolean;
    color: string;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_step', icon: Plane, name: 'First Step', desc: 'Complete your first trip', condition: (t) => t.filter(x => x.status === 'completed').length >= 1, color: '#10b981' },
    { id: 'explorer', icon: Compass, name: 'Explorer', desc: 'Complete 3 trips', condition: (t) => t.filter(x => x.status === 'completed').length >= 3, color: '#3b82f6' },
    { id: 'nomad', icon: Mountain, name: 'True Nomad', desc: 'Complete 5 trips', condition: (t) => t.filter(x => x.status === 'completed').length >= 5, color: '#8b5cf6' },
    { id: 'dreamer', icon: Heart, name: 'Dreamer', desc: 'Add to wishlist', condition: (_, w) => w.length >= 1, color: '#ef4444' },
    { id: 'collector', icon: Star, name: 'Collector', desc: 'Visit 3 regions', condition: (t) => new Set(t.map(x => x.destination)).size >= 3, color: '#f59e0b' },
    { id: 'cartographer', icon: Globe, name: 'Cartographer', desc: 'Visit 5 regions', condition: (t) => new Set(t.map(x => x.destination)).size >= 5, color: '#06b6d4' },
];

// ═══ SUB-COMPONENTS ═══

const PassportPageBg = React.memo(({ accent = '#B8860B' }: { accent?: string }) => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Aged paper background */}
        <div className="absolute inset-0" style={{ backgroundColor: '#f5f0e6' }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            <div className="absolute inset-0 opacity-[0.3]" style={{ background: `radial-gradient(circle at 30% 30%, transparent 20%, #e6dfcf 70%, #d4c5ab 100%)` }} />
        </div>
        {/* Subtle dot grid like a real passport page */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle, ${accent} 0.5px, transparent 0.5px)`, backgroundSize: '16px 16px' }} />
        {/* Page gutter shadow */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
        {/* Stitch line on left edge */}
        <div className="absolute inset-y-0 left-3 w-px" style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${accent}30 0px, ${accent}30 4px, transparent 4px, transparent 10px)` }} />
    </div>
));

const StampVis = React.memo(({ date, location, color = 'text-blue-900', rotation = 0, type = 'entry' }: { date: string; location: string; color?: string; rotation?: number; type?: 'entry' | 'exit' | 'visa' }) => (
    <motion.div
        initial={{ scale: 0, rotate: rotation - 30 }}
        animate={{ scale: 1, rotate: rotation }}
        transition={{ type: 'spring', damping: 12 }}
        className={`w-20 h-20 md:w-24 md:h-24 ${type === 'visa' ? 'border-2' : 'border-[3px] border-double'} ${color} flex flex-col items-center justify-center p-2 cursor-pointer relative group hover:scale-110 transition-transform opacity-80`}
        style={{ transform: `rotate(${rotation}deg)`, borderRadius: type === 'visa' ? '4px' : '50%' }}
    >
        <div className={`text-[6px] md:text-[7px] uppercase tracking-widest font-black ${color} text-center`}>
            {type === 'visa' ? 'VISA' : 'ENTRY'}
        </div>
        <div className={`text-[6px] md:text-[7px] font-mono ${color} opacity-80`}>{date}</div>
        {type === 'entry' ? <Plane className={`w-4 h-4 md:w-5 md:h-5 ${color} my-0.5 opacity-50`} /> : type === 'visa' ? <Globe className={`w-4 h-4 md:w-5 md:h-5 ${color} my-0.5 opacity-50`} /> : <Mountain className={`w-4 h-4 md:w-5 md:h-5 ${color} my-0.5 opacity-50`} />}
        <div className={`text-[7px] md:text-[8px] font-black uppercase ${color} text-center leading-tight max-w-full overflow-hidden text-ellipsis`}>{location}</div>
    </motion.div>
));

const KZEmblem = ({ className = '', color = '#B8860B' }: { className?: string; color?: string }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 blur-xl rounded-full" style={{ backgroundColor: `${color}20` }} />
        <Globe className="w-full h-full drop-shadow-md relative z-10" style={{ color }} strokeWidth={1} />
        {[0, 45, 90, 135].map(r => (
            <div key={r} className="absolute w-[120%] h-[1px]" style={{ backgroundColor: color, transform: `rotate(${r}deg)` }} />
        ))}
    </div>
);

// Signature component — renders name in a cursive handwriting style
const Signature = ({ name, color }: { name: string; color: string }) => (
    <div className="relative">
        <svg width="0" height="0"><defs><filter id="sig-rough"><feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
        <span
            className="block text-3xl md:text-4xl -rotate-2 ml-2"
            style={{
                color,
                fontFamily: "'Caveat', 'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive",
                filter: 'url(#sig-rough)',
                opacity: 0.85,
                letterSpacing: '0.02em',
                lineHeight: 1,
            }}
        >
            {name || 'Nomad'}
        </span>
        {/* Ink pressure variation line under signature */}
        <div className="mt-0.5 ml-2 h-[0.5px] opacity-20" style={{ backgroundColor: color, width: `${Math.min((name?.length || 5) * 14, 200)}px` }} />
    </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export const ProfilePage = () => {
    const onNavigate = useAppNavigate();
    const { t, language, setLanguage } = useLanguage();
    const { isGuest, signOut: authSignOut, saveUserPreferences } = useAuth();
    const { isPremium } = usePremium();
    const { season, setSeason, themeVariant, setThemeVariant, vfxEnabled, setVfxEnabled } = useSeason();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [activeTheme, setActiveTheme] = useState<string>('classic');
    const [profileData, setProfileData] = useState({ name: '', phone: '', nationality: 'Kazakhstan', passport: '', emergencyContact: '', bio: 'Nomadic Explorer' });

    // Persist passport open/page state so context changes don't reset it
    const [isOpen, setIsOpen] = useState(() => {
        try { return sessionStorage.getItem('kp_open') === '1'; } catch { return false; }
    });
    const [pageIndex, setPageIndex] = useState(() => {
        try { return parseInt(sessionStorage.getItem('kp_page') || '0') || 0; } catch { return 0; }
    });
    useEffect(() => { try { sessionStorage.setItem('kp_open', isOpen ? '1' : '0'); } catch {} }, [isOpen]);
    useEffect(() => { try { sessionStorage.setItem('kp_page', String(pageIndex)); } catch {} }, [pageIndex]);

    const currentTheme = useMemo(() => PASSPORT_THEMES.find(t => t.id === activeTheme) || PASSPORT_THEMES[0], [activeTheme]);
    const unlockedAchievements = useMemo(() => ACHIEVEMENTS.filter(a => a.condition(trips, wishlist)), [trips, wishlist]);
    const completedTrips = trips.filter(t => t.status === 'completed');
    const regionsVisited = new Set(trips.map(t => t.destination)).size;

    useEffect(() => {
        if (isGuest) { setLoading(false); setTrips(GUEST_TRIPS); setWishlist(GUEST_WISHLIST); setProfileData(p => ({ ...p, name: 'Guest Nomad' })); return; }
        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setUser(session?.user ?? null); setLoading(false); if (session?.user) loadUserData(session.user); });
        return () => subscription.unsubscribe();
    }, [isGuest]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('kendala_passport_theme');
        if (savedTheme) setActiveTheme(savedTheme);
    }, []);

    const checkUser = async () => { const { data: { session } } = await supabase.auth.getSession(); setUser(session?.user ?? null); setLoading(false); if (session?.user) loadUserData(session.user); };

    const loadUserData = async (cu: User) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;
            const headers = { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': token };
            const pr = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/profile`, { headers });
            if (pr.ok) { const p = await pr.json().catch(() => null); if (p) setProfileData({ name: p.name || cu.user_metadata?.name || '', phone: p.phone || '', nationality: p.nationality || 'Kazakhstan', passport: p.passport || '', emergencyContact: p.emergencyContact || '', bio: p.bio || 'Nomadic Explorer' }); }
            const tr = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings`, { headers });
            if (tr.ok) { const d = await tr.json().catch(() => []); setTrips(Array.isArray(d) ? d : []); }
            const wr = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/wishlist`, { headers });
            if (wr.ok) { const d = await wr.json().catch(() => []); setWishlist(Array.isArray(d) ? d : []); }
        } catch (e) { console.error(e); }
    };

    const handleLogout = async () => { if (isGuest) authSignOut(); else await supabase.auth.signOut(); onNavigate('home'); };
    const handleSaveProfile = async () => {
        if (isGuest) { toast.success('Guest mode - changes not saved'); setViewMode('view'); return; }
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/profile`, { method: 'POST', headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': session?.access_token || publicAnonKey, 'Content-Type': 'application/json' }, body: JSON.stringify(profileData) });
            toast.success('Passport Updated'); setViewMode('view');
        } catch { toast.error('Failed to update'); }
    };

    const selectTheme = (id: string) => {
        const th = PASSPORT_THEMES.find(t => t.id === id);
        if (th?.premium && !isPremium) { toast.error('Upgrade to NOMAD to unlock premium themes'); return; }
        setActiveTheme(id); localStorage.setItem('kendala_passport_theme', id); toast.success(`Theme: ${th?.name}`);
    };

    if (loading || (!user && !isGuest)) return <AuthPage onSuccess={checkUser} onNavigate={onNavigate} />;

    const joinDate = user ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const passportNumber = user ? user.id.substring(0, 9).toUpperCase() : 'GUEST0000';

    const pastTrips = trips.map(trip => ({
        id: trip.id, location: trip.destination,
        date: new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        rotation: ((trip.id.charCodeAt(0) % 40) - 20),
        color: ['text-red-900', 'text-blue-900', 'text-emerald-900', 'text-purple-900'][trip.id.charCodeAt(0) % 4],
        type: 'entry' as const
    }));
    const plannedVisas = wishlist.map((item, i) => ({
        id: item.id, location: item.name, date: 'ISSUED',
        rotation: (i % 2 === 0 ? 1 : -1) * (5 + (item.id.charCodeAt(0) % 5)),
        color: 'text-amber-900', type: 'visa' as const
    }));
    const allStamps = [...pastTrips, ...plannedVisas];

    // ═══ RENDER PAGES ═══
    const renderLeftPage = () => {
        if (pageIndex === 0) return (
            <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b pb-2" style={{ borderColor: `${currentTheme.accent}30` }}>
                    <div className="w-6 h-6 flex items-center justify-center" style={{ backgroundColor: currentTheme.cover }}>
                        <Shield className="w-3 h-3" style={{ color: currentTheme.foil }} />
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>Identity / Identification</div>
                </div>

                <div className="flex gap-4 md:gap-5 flex-1 min-h-0">
                    {/* Photo with realistic passport border */}
                    <div className="w-24 md:w-32 shrink-0 self-start">
                        <div className="border-2 p-[3px] bg-white shadow-sm" style={{ borderColor: `${currentTheme.accent}40` }}>
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full aspect-[3/4] object-cover grayscale contrast-110 sepia-[0.15]" />
                            ) : (
                                <div className="w-full aspect-[3/4] flex items-center justify-center bg-[#e8e0d4] text-[#b8a88a]">
                                    <UserIcon className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data fields - passport style with underlines */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                        <div className="group cursor-pointer" onClick={() => !isGuest && setViewMode('edit')}>
                            <label className="block text-[6px] md:text-[7px] uppercase tracking-[0.3em] mb-0.5" style={{ color: `${currentTheme.accent}80` }}>Surname / Given Names</label>
                            <div className="font-mono text-base md:text-lg font-black text-neutral-800 uppercase flex items-center gap-2 flex-wrap leading-tight border-b border-dotted pb-0.5" style={{ borderColor: `${currentTheme.accent}30` }}>
                                {profileData.name || user?.email?.split('@')[0] || 'Guest Nomad'}
                                {isPremium && <PremiumBadge size="sm" />}
                                {!isGuest && <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: currentTheme.cover }} />}
                            </div>
                            {viewMode === 'edit' && !isGuest && (
                                <input autoFocus className="w-full bg-transparent border-b-2 outline-none font-mono text-base uppercase mt-1 rounded-none" style={{ borderColor: currentTheme.cover, color: currentTheme.cover }} value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} onBlur={handleSaveProfile} onKeyDown={e => e.key === 'Enter' && handleSaveProfile()} />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                            {[
                                ['Nationality', profileData.nationality],
                                ['Date of Birth', '01 JAN 1995'],
                                ['Date of Issue', joinDate],
                                ['Date of Expiry', '01 JAN 2034'],
                            ].map(([lbl, val]) => (
                                <div key={lbl}>
                                    <label className="block text-[6px] md:text-[7px] uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>{lbl}</label>
                                    <div className="font-mono text-[10px] md:text-xs font-black text-neutral-800 uppercase border-b border-dotted pb-0.5" style={{ borderColor: `${currentTheme.accent}20` }}>{val}</div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-[6px] md:text-[7px] uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>Passport No</label>
                            <div className="font-mono text-xs md:text-sm font-black uppercase tracking-wider" style={{ color: currentTheme.cover }}>{passportNumber}</div>
                        </div>
                        
                        {unlockedAchievements.length > 0 && (
                            <div className="pt-1">
                                <label className="block text-[6px] md:text-[7px] uppercase tracking-[0.3em] mb-1" style={{ color: `${currentTheme.accent}80` }}>Endorsements</label>
                                <div className="flex flex-wrap gap-1">
                                    {unlockedAchievements.map(a => {
                                        const Icon = a.icon;
                                        return (
                                            <div key={a.id} className="w-6 h-6 flex items-center justify-center border" style={{ borderColor: `${a.color}30`, backgroundColor: `${a.color}08` }} title={a.name}>
                                                <Icon className="w-3 h-3" style={{ color: a.color }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MRZ zone */}
                <div className="mt-auto pt-3 border-t" style={{ borderColor: `${currentTheme.accent}20` }}>
                    <div className="bg-[#f0ebe0] px-3 py-2 -mx-1">
                        <p className="font-mono text-[8px] md:text-[10px] tracking-[0.08em] leading-relaxed text-neutral-700 uppercase break-all select-all" style={{ fontFeatureSettings: '"tnum"' }}>
                            P&lt;KAZ{profileData.name?.split(' ')[0]?.toUpperCase() || 'NOMAD'}&lt;&lt;KENDALA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                            <br />{passportNumber}&lt;0KAZ{new Date().getFullYear()}0101M{new Date().getFullYear() + 10}0101&lt;&lt;&lt;&lt;08
                        </p>
                    </div>
                </div>
            </div>
        );
        if (pageIndex === 1) return (
            <div className="h-full">
                <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderColor: `${currentTheme.accent}30` }}>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>{t('passport_stamps')}</div>
                    <div className="text-[8px] font-mono" style={{ color: `${currentTheme.accent}50` }}>Page 2</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {allStamps.slice(0, 6).map((stamp, i) => (
                        <StampVis key={`l-${stamp.id}`} {...stamp} />
                    ))}
                </div>
            </div>
        );
        // pageIndex === 2: Theme page
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderColor: `${currentTheme.accent}30` }}>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>{t('passport_cover_design')}</div>
                    <div className="text-[8px] font-mono" style={{ color: `${currentTheme.accent}50` }}>Page 4</div>
                </div>
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-2 no-scrollbar">
                    {PASSPORT_THEMES.map(th => (
                        <button key={th.id} onClick={() => selectTheme(th.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-none border transition-all ${activeTheme === th.id ? 'border-neutral-400 bg-neutral-100/80' : 'border-neutral-200/60 hover:border-neutral-300'}`}>
                            <div className="w-7 h-10 shrink-0 shadow-sm" style={{ backgroundColor: th.cover, borderLeft: `2px solid ${th.spine}` }} />
                            <div className="flex-1 text-left">
                                <div className="text-[10px] font-black uppercase text-neutral-800">{th.name}</div>
                                {th.premium && !isPremium && <span className="text-[7px] font-black uppercase tracking-wider text-amber-600 block mt-0.5">NOMAD</span>}
                            </div>
                            {activeTheme === th.id && <Check className="w-3.5 h-3.5 text-neutral-800" />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderRightPage = () => {
        if (pageIndex === 0) return (
            <div className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                    <h3 className="text-[8px] font-black uppercase tracking-[0.3em] border-b pb-2" style={{ color: `${currentTheme.accent}80`, borderColor: `${currentTheme.accent}30` }}>
                        {t('passport_observations')}
                    </h3>
                    <p className="italic text-xs leading-relaxed text-neutral-500 text-center px-3 md:px-6">
                        "The bearer of this document is a citizen of the open world, authorized to traverse the digital steppes of Kendala without restriction."
                    </p>
                    
                    {/* Travel Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        {[
                            { label: t('stats_journeys'), value: completedTrips.length },
                            { label: t('stats_regions'), value: regionsVisited },
                            { label: t('stats_wishlist'), value: wishlist.length },
                            { label: t('stats_endorsements'), value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}` },
                        ].map((s, i) => (
                            <div key={i} className="p-2.5 rounded-none border text-center" style={{ borderColor: `${currentTheme.accent}20` }}>
                                <div className="text-lg font-black font-mono" style={{ color: currentTheme.cover }}>{s.value}</div>
                                <div className="text-[6px] font-black uppercase tracking-[0.2em]" style={{ color: `${currentTheme.accent}60` }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Watermark emblem */}
                <div className="flex-1 flex items-center justify-center opacity-[0.06] my-3">
                    <KZEmblem className="w-28 h-28 md:w-36 md:h-36" color={currentTheme.accent} />
                </div>

                {/* Signature area */}
                <div>
                    <div className="min-h-[48px] border-b flex items-end pb-1 relative" style={{ borderColor: `${currentTheme.accent}40` }}>
                        <Signature name={profileData.name} color={currentTheme.cover} />
                        {/* Official seal */}
                        <div className="absolute right-1 bottom-1 w-12 h-12 border-[3px] border-double rounded-full flex items-center justify-center pointer-events-none opacity-25" style={{ borderColor: currentTheme.accent, transform: 'rotate(-15deg)' }}>
                            <div className="text-center">
                                <span className="text-[4px] font-black uppercase block tracking-wider" style={{ color: currentTheme.accent }}>KENDALA</span>
                                <Star className="w-2.5 h-2.5 mx-auto" style={{ color: currentTheme.accent }} />
                                <span className="text-[4px] font-black uppercase block tracking-wider" style={{ color: currentTheme.accent }}>VALID</span>
                            </div>
                        </div>
                    </div>
                    <label className="text-[6px] uppercase tracking-[0.3em] mt-1 block" style={{ color: `${currentTheme.accent}60` }}>Holder's Signature / Қолтаңба</label>
                </div>
            </div>
        );
        if (pageIndex === 1) return (
            <div className="h-full">
                <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderColor: `${currentTheme.accent}30` }}>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>{t('passport_stamps')}</div>
                    <div className="text-[8px] font-mono" style={{ color: `${currentTheme.accent}50` }}>Page 3</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {allStamps.slice(6, 12).map((stamp, i) => (
                        <StampVis key={`r-${stamp.id}`} {...stamp} />
                    ))}
                    <motion.button whileHover={{ scale: 1.05, rotate: 5 }} onClick={() => onNavigate('planner')} className="w-20 h-20 mx-auto rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 opacity-40 hover:opacity-80 transition-all" style={{ borderColor: `${currentTheme.accent}40`, color: currentTheme.accent }}>
                        <PlusCircle className="w-5 h-5 mb-0.5" />
                        <span className="text-[5px] font-black uppercase tracking-widest">New Stamp</span>
                    </motion.button>
                </div>
            </div>
        );
        // pageIndex === 2: Settings
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b pb-2" style={{ borderColor: `${currentTheme.accent}30` }}>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.accent}80` }}>{t('settings_title')}</div>
                    <div className="text-[8px] font-mono" style={{ color: `${currentTheme.accent}50` }}>Page 5</div>
                </div>
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 no-scrollbar">
                    {/* Language */}
                    <SettingCard icon={Globe} label={t('settings_language')} accent={currentTheme.accent}>
                        <div className="flex gap-1.5">
                            {([['en', 'EN'], ['ru', 'RU'], ['kz', 'QZ']] as const).map(([code, label]) => (
                                <button key={code} onClick={() => { setLanguage(code); saveUserPreferences({ language: code }); toast.success(`Language: ${label}`); }}
                                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider border transition-all ${language === code ? 'text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
                                    style={language === code ? { backgroundColor: currentTheme.cover, borderColor: currentTheme.cover } : { borderColor: `${currentTheme.accent}20` }}
                                >{label}</button>
                            ))}
                        </div>
                    </SettingCard>

                    {/* Season */}
                    <SettingCard icon={Sun} label={t('settings_season')} accent={currentTheme.accent}>
                        <div className="grid grid-cols-4 gap-1">
                            {([['winter', 'Win', '#00B4D8'], ['spring', 'Spr', '#84a59d'], ['summer', 'Sum', '#d4a373'], ['autumn', 'Aut', '#a67c52']] as const).map(([s, label, color]) => (
                                <button key={s} onClick={() => { setSeason(s as Season); saveUserPreferences({ season: s }); toast.success(`Season set`); }}
                                    className={`py-1.5 text-[8px] font-black uppercase border transition-all ${season === s ? 'text-white' : 'text-neutral-400 hover:bg-neutral-50'}`}
                                    style={season === s ? { backgroundColor: color, borderColor: color } : { borderColor: `${currentTheme.accent}15` }}
                                >{label}</button>
                            ))}
                        </div>
                    </SettingCard>

                    {/* Theme Variant */}
                    <SettingCard icon={Palette} label={t('settings_theme')} accent={currentTheme.accent}>
                        <div className="grid grid-cols-2 gap-1">
                            {(['default', 'dark', 'vibrant', 'monochrome'] as const).map((v) => (
                                <button key={v} onClick={() => { setThemeVariant(v); saveUserPreferences({ themeVariant: v }); toast.success(`Theme: ${v}`); }}
                                    className={`py-1.5 text-[8px] font-black uppercase border transition-all ${themeVariant === v ? 'bg-neutral-800 text-white border-neutral-800' : 'text-neutral-400 hover:bg-neutral-50'}`}
                                    style={themeVariant !== v ? { borderColor: `${currentTheme.accent}15` } : {}}
                                >{v}</button>
                            ))}
                        </div>
                    </SettingCard>

                    {/* VFX */}
                    <div className="p-2.5 rounded-none border flex items-center justify-between" style={{ borderColor: `${currentTheme.accent}15`, backgroundColor: '#fdfbf7' }}>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3" style={{ color: `${currentTheme.accent}60` }} />
                            <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: `${currentTheme.accent}80` }}>{t('settings_vfx')}</div>
                        </div>
                        <button onClick={() => { setVfxEnabled(!vfxEnabled); toast.success(vfxEnabled ? 'VFX Off' : 'VFX On'); }}
                            className={`w-9 h-[18px] rounded-full relative transition-all ${vfxEnabled ? 'bg-emerald-500' : 'bg-neutral-300'}`}
                        >
                            <div className="absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-all" style={vfxEnabled ? { left: '20px' } : { left: '2px' }} />
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="p-2.5 rounded-none border" style={{ borderColor: `${currentTheme.accent}15`, backgroundColor: '#fdfbf7' }}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Compass className="w-3 h-3" style={{ color: `${currentTheme.accent}60` }} />
                                <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: `${currentTheme.accent}80` }}>{t('settings_nomad_path')}</div>
                            </div>
                            <div className="text-[9px] font-black font-mono" style={{ color: `${currentTheme.accent}60` }}>{unlockedAchievements.length}/{ACHIEVEMENTS.length}</div>
                        </div>
                        <div className="h-1 rounded-none overflow-hidden" style={{ backgroundColor: `${currentTheme.accent}15` }}>
                            <div className="h-full transition-all" style={{ width: `${(unlockedAchievements.length/ACHIEVEMENTS.length)*100}%`, backgroundColor: currentTheme.cover }} />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="p-2.5 rounded-none border" style={{ borderColor: `${currentTheme.accent}15`, backgroundColor: '#fdfbf7' }}>
                        <div className="flex items-center gap-2">
                            <Crown className="w-3 h-3" style={{ color: isPremium ? '#B8860B' : `${currentTheme.accent}40` }} />
                            <span className="text-[9px] font-black uppercase" style={{ color: isPremium ? '#92710a' : `${currentTheme.accent}60` }}>
                                {isPremium ? 'Nomad Elite' : 'Standard'}
                            </span>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="p-2.5 rounded-none border" style={{ borderColor: `${currentTheme.accent}15`, backgroundColor: '#fdfbf7' }}>
                        <div className="text-[7px] font-black uppercase tracking-widest mb-0.5" style={{ color: `${currentTheme.accent}60` }}>{t('settings_account')}</div>
                        <div className="text-[9px] font-mono text-neutral-600 truncate">{user?.email || 'guest@kendala.kz'}</div>
                    </div>

                    {/* Sign Out */}
                    <button onClick={handleLogout} className="w-full py-2 rounded-none border border-red-200/60 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors">
                        {isGuest ? t('exit_guest') : t('sign_out')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <PageTransition>
            <div className="fixed inset-0 bg-[#0a0a0a] text-neutral-800 overflow-hidden flex items-center justify-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {/* Google Fonts for signature */}
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
                {/* Desk texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, ${currentTheme.cover}25 0%, transparent 55%)` }} />

                {/* TOP NAV */}
                <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none">
                    <button onClick={() => onNavigate('home')} className="pointer-events-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors bg-black/40 backdrop-blur-xl px-4 py-2.5 border border-white/10 group">
                        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        {t('back_to_main') || 'Return'}
                    </button>
                </div>

                {/* ═══ PASSPORT STAGE ═══ */}
                <div className="relative w-full max-w-6xl h-[85vh] flex items-center justify-center" style={{ perspective: '2000px' }}>
                    
                    <AnimatePresence mode="wait">
                        {!isOpen ? (
                            <motion.div
                                key="closed"
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                onClick={() => setIsOpen(true)}
                                className="w-[320px] h-[480px] md:w-[380px] md:h-[560px] cursor-pointer relative shadow-2xl flex flex-col items-center justify-center overflow-hidden group"
                                style={{
                                    backgroundColor: currentTheme.cover,
                                    borderLeft: `10px solid ${currentTheme.spine}`,
                                    borderRadius: '2px 6px 6px 2px',
                                    boxShadow: `0 0 80px ${currentTheme.cover}30, 0 30px 60px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.15)`,
                                }}
                            >
                                {/* Leather texture overlay */}
                                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                                <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} pointer-events-none`} />
                                
                                {/* Subtle foil lines */}
                                <div className="absolute top-[28%] left-[15%] right-[15%] h-px opacity-15" style={{ backgroundColor: currentTheme.foil }} />
                                <div className="absolute top-[72%] left-[15%] right-[15%] h-px opacity-15" style={{ backgroundColor: currentTheme.foil }} />
                                {/* Corner accents */}
                                {[['top-4 left-5', ''], ['top-4 right-5', 'scale-x-[-1]'], ['bottom-4 left-5', 'scale-y-[-1]'], ['bottom-4 right-5', 'scale-[-1]']].map(([pos, scl], i) => (
                                    <div key={i} className={`absolute ${pos} w-4 h-4 border-t border-l opacity-20 ${scl}`} style={{ borderColor: currentTheme.foil }} />
                                ))}

                                <div className="relative z-10 flex flex-col items-center text-center p-8 w-full h-full justify-between py-12">
                                    <div className="space-y-4 flex flex-col items-center">
                                        <div className="text-[8px] font-black uppercase tracking-[0.5em]" style={{ color: `${currentTheme.foil}90` }}>
                                            REPUBLIC OF
                                        </div>
                                        <h1 className="text-xl md:text-2xl font-black tracking-[0.2em]" style={{ color: currentTheme.foil }}>
                                            KAZAKHSTAN
                                        </h1>
                                        <div className="text-[6px] font-black uppercase tracking-[0.4em]" style={{ color: `${currentTheme.foil}50` }}>
                                            QAZAQSTAN RESPUBLIKASY
                                        </div>
                                        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-3 border border-double" style={{ borderColor: `${currentTheme.foil}30`, backgroundColor: `${currentTheme.coverDark}60` }}>
                                            <KZEmblem className="w-full h-full" color={`${currentTheme.foil}90`} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-3xl md:text-4xl font-black tracking-[0.3em]" style={{ color: currentTheme.foil }}>
                                            PASSPORT
                                        </h2>
                                        <div className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: currentTheme.foil }}>
                                            NOMAD DIGITAL PASS
                                        </div>
                                        {/* Chip */}
                                        <div className="w-10 h-8 mx-auto border flex items-center justify-center" style={{ borderColor: `${currentTheme.foil}25`, backgroundColor: `${currentTheme.foil}08` }}>
                                            <div className="w-7 h-5 grid grid-cols-3 grid-rows-2 gap-px p-0.5">
                                                {[...Array(6)].map((_, i) => <div key={i} style={{ backgroundColor: `${currentTheme.foil}20` }} />)}
                                            </div>
                                        </div>
                                    </div>

                                    {isPremium && (
                                        <div className="flex items-center gap-1.5 px-3 py-1" style={{ backgroundColor: `${currentTheme.foil}12`, border: `1px solid ${currentTheme.foil}25` }}>
                                            <Crown className="w-2.5 h-2.5" style={{ color: currentTheme.foil }} />
                                            <span className="text-[7px] font-black uppercase tracking-[0.3em]" style={{ color: `${currentTheme.foil}80` }}>NOMAD ELITE</span>
                                        </div>
                                    )}
                                </div>

                                {/* Hover shimmer */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)' }}
                                    animate={{ x: ['-150%', '150%'] }}
                                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                                />
                                
                                <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-5 text-[7px] font-black uppercase tracking-[0.5em] z-20" style={{ color: `${currentTheme.foil}80` }}>
                                    {t('passport_tap_to_open')}
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* ═══ OPEN PASSPORT ═══ */
                            <motion.div
                                key="open"
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-full max-w-[95vw] md:max-w-5xl bg-[#f5f0e6] shadow-2xl flex flex-col md:flex-row overflow-hidden"
                                style={{
                                    borderRadius: '2px',
                                    border: `2px solid #c8bfa8`,
                                    boxShadow: `0 0 60px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)`,
                                    minHeight: 'min(75vh, 600px)',
                                    maxHeight: '80vh',
                                }}
                            >
                                {/* Spine shadow */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-[40px] -ml-[20px] bg-gradient-to-r from-transparent via-black/15 to-transparent z-20 pointer-events-none hidden md:block" />
                                {/* Top edge stitch */}
                                <div className="absolute top-0 left-0 right-0 h-px z-20 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${currentTheme.accent}20 0px, ${currentTheme.accent}20 6px, transparent 6px, transparent 14px)` }} />
                                <div className="absolute bottom-0 left-0 right-0 h-px z-20 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${currentTheme.accent}20 0px, ${currentTheme.accent}20 6px, transparent 6px, transparent 14px)` }} />

                                {/* LEFT PAGE */}
                                <div className="flex-1 relative p-5 md:p-8 border-r overflow-y-auto no-scrollbar" style={{ borderColor: '#d4cbb8' }}>
                                    <PassportPageBg accent={currentTheme.accent} />
                                    <div className="relative z-10 h-full">
                                        {renderLeftPage()}
                                    </div>
                                    {pageIndex > 0 && (
                                        <button onClick={() => setPageIndex(p => p - 1)} className="absolute bottom-2 left-2 p-1.5 bg-black/5 hover:bg-black/10 text-neutral-500 transition-colors z-30">
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {/* Page number */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-mono z-30" style={{ color: `${currentTheme.accent}40` }}>{pageIndex * 2}</div>
                                </div>

                                {/* RIGHT PAGE */}
                                <div className="flex-1 relative p-5 md:p-8 overflow-y-auto no-scrollbar">
                                    <PassportPageBg accent={currentTheme.accent} />
                                    <div className="relative z-10 h-full">
                                        {renderRightPage()}
                                    </div>
                                    <button onClick={() => pageIndex < 2 ? setPageIndex(p => p + 1) : setIsOpen(false)} className="absolute bottom-2 right-2 p-1.5 bg-black/5 hover:bg-black/10 text-neutral-500 transition-colors z-30">
                                        {pageIndex < 2 ? <ChevronRight className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
                                    </button>
                                    {/* Page number */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-mono z-30" style={{ color: `${currentTheme.accent}40` }}>{pageIndex * 2 + 1}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
            </div>
        </PageTransition>
    );
};

// Reusable settings card for the settings page
const SettingCard = ({ icon: Icon, label, accent, children }: { icon: any; label: string; accent: string; children: React.ReactNode }) => (
    <div className="p-2.5 rounded-none border" style={{ borderColor: `${accent}15`, backgroundColor: '#fdfbf7' }}>
        <div className="flex items-center gap-2 mb-1.5">
            <Icon className="w-3 h-3" style={{ color: `${accent}60` }} />
            <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: `${accent}80` }}>{label}</div>
        </div>
        {children}
    </div>
);