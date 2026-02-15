import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { PageTransition } from '../ui/PageTransition';
import { hq } from '../../utils/imageUrls';
import { 
    User as UserIcon, 
    Map as MapIcon, 
    Compass, 
    Heart, 
    Settings, 
    LogOut, 
    Mountain,
    Activity,
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    Wind,
    Edit2,
    Save,
    Loader2,
    PlusCircle,
    Camera,
    Globe,
    Snowflake,
    Sun,
    Leaf,
    Flower2,
    Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { toast } from 'sonner@2.0.3';
import { AuthPage } from './AuthPage';

interface Trip {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'confirmed' | 'completed';
    image?: string;
    notes?: string;
    date_created?: string;
}

interface WishlistItem {
    id: string;
    name: string;
    region: string;
    category: string;
    image?: string;
}

interface ProfilePageProps {
    onNavigate: (page: string) => void;
}

const SEASON_IMAGES = {
    winter: hq("https://images.unsplash.com/photo-1737973832585-d8b3ba781211"),
    spring: hq("https://images.unsplash.com/photo-1699320020146-a8fdfb1702f0"),
    summer: hq("https://images.unsplash.com/photo-1567870648828-7bfe8073c061"),
    autumn: hq("https://images.unsplash.com/photo-1666453413944-8fa3fd2ee1ac")
};

export const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
    const { theme, season, setSeason, themeVariant, setThemeVariant } = useSeason();
    const { t, language, setLanguage } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'wishlist' | 'settings'>('overview');
    
    const [trips, setTrips] = useState<Trip[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        nationality: '',
        passport: '',
        emergencyContact: ''
    });
    const [savingProfile, setSavingProfile] = useState(false);

    const [ambientColor, setAmbientColor] = useState('rgba(0,0,0,0)');
    
    useEffect(() => {
        if (theme) {
            setAmbientColor(theme.primary || '#34D399');
        }
    }, [theme]);

    useEffect(() => {
        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                loadUserData(session.user);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
            loadUserData(session.user);
        }
    };

    const loadUserData = async (currentUser: User) => {
        setLoadingData(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;
            const headers = { 
                'Authorization': `Bearer ${publicAnonKey}`,
                'x-user-token': token 
            };

            const profileRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/profile`, { headers });
            if (profileRes.ok) {
                const profile = await profileRes.json();
                setProfileData({
                    name: profile.name || currentUser.user_metadata?.name || '',
                    phone: profile.phone || '',
                    nationality: profile.nationality || '',
                    passport: profile.passport || '',
                    emergencyContact: profile.emergencyContact || ''
                });
            }

            const tripsRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/bookings`, { headers });
            if (tripsRes.ok) {
                const tripsData = await tripsRes.json();
                setTrips(Array.isArray(tripsData) ? tripsData : []);
            }

            const wishlistRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/wishlist`, { headers });
            if (wishlistRes.ok) {
                const wishlistData = await wishlistRes.json();
                setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            toast.error('Failed to sync with the steppe network.');
        } finally {
            setLoadingData(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onNavigate('home');
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;
            
            await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/profile`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${publicAnonKey}`,
                    'x-user-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            toast.success(t('trip_saved') || 'Profile Updated');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setSavingProfile(false);
        }
    };

    if (!theme) return null;

    if (!loading && !user) {
        return <AuthPage onSuccess={checkUser} onNavigate={onNavigate} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center font-sans font-bold text-sm uppercase tracking-widest animate-pulse" style={{ backgroundColor: theme.background, color: theme.text }}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{t('scanning_satellites') || 'Connecting...'}</span>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: t('profile') || 'Profile', icon: Activity },
        { id: 'trips', label: t('tours') || 'Journeys', icon: MapIcon },
        { id: 'wishlist', label: t('index_02_title') || 'Collection', icon: Heart },
        { id: 'settings', label: t('settings') || 'Gear/Settings', icon: Settings },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col md:flex-row font-sans bg-fixed relative overflow-hidden" style={{ backgroundColor: theme.background, color: theme.text }}>
                {/* Subtle Grain Overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                {/* Ambient Background Blob */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="fixed -top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"
                    style={{ backgroundColor: ambientColor }}
                />

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-72 lg:w-80 border-r flex flex-col justify-between h-auto md:h-screen md:sticky md:top-0 z-20 backdrop-blur-sm" style={{ borderColor: `${theme.text}15` }}>
                    <div className="flex-1">
                        <div className="p-6 md:p-10 border-b" style={{ borderColor: `${theme.text}15` }}>
                            <div className="relative group cursor-pointer">
                                <div className="w-16 h-16 md:w-20 md:h-20 border flex items-center justify-center overflow-hidden mb-4 md:mb-6 rounded-full transition-all group-hover:scale-105 relative" style={{ borderColor: theme.text }}>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20" />
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover relative z-10" />
                                    ) : (
                                        <span className="text-3xl font-sans font-black relative z-10">{profileData.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'K'}</span>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-4 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-sans font-black uppercase tracking-tight mb-1 truncate">
                                {profileData.name || t('ai_traveler') || 'Nomad'}
                            </h2>
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 truncate mb-4">{user?.email}</p>
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-current/5 text-[9px] font-bold uppercase tracking-wider">
                                <Mountain className="w-3 h-3" />
                                <span>{t('level_explorer')}</span>
                            </div>
                        </div>

                        <nav className="flex md:flex-col py-2 md:py-6 overflow-x-auto md:overflow-x-visible no-scrollbar">
                            {tabs.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as any)}
                                        className={`flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] border-b-2 md:border-b-0 md:border-l-2 transition-all text-left group hover:bg-current/5 whitespace-nowrap ${isActive ? 'border-current bg-current/5' : 'border-transparent'}`}
                                        style={{ borderColor: isActive ? theme.primary : 'transparent' }}
                                    >
                                        <Icon className={`w-4 h-4 transition-all ${isActive ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-80'}`} />
                                        <span className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="hidden md:block p-6 md:p-8 border-t" style={{ borderColor: `${theme.text}15` }}>
                         <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity w-full hover:translate-x-1 duration-300"
                         >
                            <LogOut className="w-4 h-4" />
                            {t('back_to_main') || 'Sign Out'}
                         </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative z-10">
                    {/* Header */}
                    <header className="relative p-6 pr-16 md:p-12 border-b flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 overflow-hidden group" style={{ borderColor: `${theme.text}15` }}>
                        {/* Seasonal Background */}
                        <div className="absolute inset-0 z-0">
                            <ResponsiveImage 
                                src={SEASON_IMAGES[season as keyof typeof SEASON_IMAGES] || SEASON_IMAGES.summer} 
                                alt={`${season} landscape`}
                                className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                        </div>

                        <div className="relative z-10">
                            <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-80 block mb-3 text-white"
                            >
                                {activeTab === 'overview' ? `// ${t('home')}` : `// ${tabs.find(t => t.id === activeTab)?.label}`}
                            </motion.span>
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-serif italic tracking-tighter text-white"
                            >
                                {activeTab === 'overview' && (t('journal') || 'My Journal')}
                                {activeTab === 'trips' && (t('expeditions') || 'Expeditions')}
                                {activeTab === 'wishlist' && (t('index_02_title') || 'Collection')}
                                {activeTab === 'settings' && (t('nomadic_toolkit') || 'Identity')}
                            </motion.h1>
                        </div>
                        <div className="relative z-10 text-right hidden md:block text-white">
                            <div className="text-3xl font-black uppercase tracking-tighter opacity-40 hover:opacity-100 transition-opacity cursor-default">
                                {new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60 mt-1">
                                {t('local_time')}
                            </div>
                        </div>
                    </header>

                    <div className="p-5 md:p-12 min-h-[60vh]">
                        <AnimatePresence mode="wait">
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <motion.div 
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-16"
                                >
                                    {/* Cover Image */}
                                    <div className="relative w-full h-64 md:h-80 overflow-hidden group">
                                        <ResponsiveImage 
                                            src="https://images.unsplash.com/photo-1637842729600-d256c8960194" 
                                            alt="Cover" 
                                            className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                                            <div className="max-w-2xl">
                                                <h3 className="text-white text-2xl font-serif italic mb-2">"{t('journey_quote')}"</h3>
                                                <p className="text-white/60 text-xs font-mono uppercase tracking-widest">{t('hero_main_tagline')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* HUD Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: t('distance') || 'Distance', value: `${trips.length * 150} km`, icon: Compass, sub: 'Traveled' },
                                            { label: t('featured_location') || 'Favorites', value: wishlist.length.toString(), icon: Heart, sub: 'Saved Locations' },
                                            { label: t('expeditions') || 'Journeys', value: trips.length.toString(), icon: MapIcon, sub: 'Completed' },
                                        ].map((stat, i) => (
                                            <div key={i} className="relative p-8 border group hover:bg-current/5 transition-all duration-500 overflow-hidden" style={{ borderColor: `${theme.text}20` }}>
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 group-hover:scale-110">
                                                    <stat.icon className="w-16 h-16" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-6 opacity-60">
                                                        <stat.icon className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                                                    </div>
                                                    <div className="text-5xl font-sans font-black tracking-tighter mb-2">{stat.value}</div>
                                                    <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{stat.sub}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recent Activity / CTA */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div>
                                            <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
                                                <Wind className="w-5 h-5 opacity-50" />
                                                {t('next_chapter_section')}
                                            </h3>
                                            
                                            {trips.length > 0 ? (
                                                <div className="border p-6 hover:border-current transition-colors cursor-pointer group" style={{ borderColor: `${theme.text}20` }} onClick={() => setActiveTab('trips')}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded">{t('upcoming_label')}</span>
                                                        <ArrowIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                                                    </div>
                                                    <h4 className="text-2xl font-bold uppercase mb-2">{trips[0].title || trips[0].destination}</h4>
                                                    <p className="text-sm opacity-60 font-mono">{new Date(trips[0].startDate).toLocaleDateString()} — {trips[0].days} {t('day')}</p>
                                                </div>
                                            ) : (
                                                <div className="border border-dashed p-10 text-center group cursor-pointer hover:bg-current/5 transition-all" style={{ borderColor: `${theme.text}20` }} onClick={() => onNavigate('planner')}>
                                                    <PlusCircle className="w-8 h-8 mx-auto mb-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                                                    <p className="text-sm font-bold uppercase tracking-widest mb-2">{t('create_first_route')}</p>
                                                    <p className="text-xs opacity-50 max-w-xs mx-auto">{t('empty_state_planner')}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-serif italic mb-8 flex items-center gap-3">
                                                <Camera className="w-5 h-5 opacity-50" />
                                                {t('journal') || 'Memories'}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="aspect-square relative group overflow-hidden cursor-pointer border border-transparent hover:border-current transition-all">
                                                    <ResponsiveImage 
                                                        src="https://images.unsplash.com/photo-1540206395-688085723adb"
                                                        alt="Memory 1"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white px-3 py-1 bg-black/50 backdrop-blur-md rounded-full">View</span>
                                                    </div>
                                                </div>
                                                <div className="aspect-square bg-current/5 flex flex-col items-center justify-center gap-3 text-xs uppercase tracking-widest opacity-40 border border-dashed border-current/30 hover:opacity-100 hover:border-current transition-all cursor-pointer group">
                                                    <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                    <span className="text-[9px]">Add Memory</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TRIPS TAB */}
                            {activeTab === 'trips' && (
                                <motion.div 
                                    key="trips"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                >
                                    <div 
                                        onClick={() => onNavigate('planner')}
                                        className="aspect-[4/5] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-current/5 transition-all group opacity-60 hover:opacity-100"
                                        style={{ borderColor: `${theme.text}30` }}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PlusCircle className="w-8 h-8" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-widest">{t('create_new_trip')}</span>
                                    </div>

                                    {trips.map((trip) => (
                                        <div key={trip.id} className="group relative aspect-[4/5] overflow-hidden border bg-current/5" style={{ borderColor: `${theme.text}20` }}>
                                            <ResponsiveImage 
                                                src={trip.image || 'https://images.unsplash.com/photo-1752503256243-2edf964c00d0'} 
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                alt={trip.destination}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/20 backdrop-blur-sm rounded mb-3 inline-block">
                                                        {trip.status === 'planning' ? t('planning_status') : t('confirmed_status')}
                                                    </span>
                                                    <h3 className="text-2xl font-black uppercase leading-none mb-2">{trip.title || trip.destination}</h3>
                                                    <p className="text-xs opacity-70 font-mono mb-4 flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(trip.startDate).toLocaleDateString()}
                                                    </p>
                                                    <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <button className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                                                            {t('read_more') || 'View Details'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* WISHLIST TAB */}
                            {activeTab === 'wishlist' && (
                                <motion.div 
                                    key="wishlist"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {wishlist.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                            <Heart className="w-16 h-16 mb-6 stroke-1" />
                                            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">{t('no_trips') || 'Collection Empty'}</h3>
                                            <p className="text-sm max-w-md text-center mb-8">Explore the interactive map or regions page to add locations to your nomadic collection.</p>
                                            <button onClick={() => onNavigate('map')} className="px-8 py-3 border border-current text-[10px] font-bold uppercase tracking-widest hover:bg-current hover:text-white transition-all">
                                                {t('map') || 'Open Map'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {wishlist.map((item) => (
                                                <div key={item.id} className="relative flex gap-4 p-4 border group hover:border-current transition-colors bg-white/5 backdrop-blur-sm" style={{ borderColor: `${theme.text}15` }}>
                                                    <div className="w-24 h-24 shrink-0 overflow-hidden bg-neutral-800/50">
                                                        <ResponsiveImage 
                                                            src={item.image || 'https://images.unsplash.com/photo-1768363413701-7e84a071d6ec'} 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center flex-1">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">{item.region}</span>
                                                        <h4 className="text-lg font-bold uppercase leading-tight mb-2">{item.name}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] opacity-60 mb-2">
                                                            <MapPin className="w-3 h-3" />
                                                            {item.category}
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const shareData = {
                                                                    title: `Kendala: ${item.name}`,
                                                                    text: `Check out ${item.name} in Kazakhstan!`,
                                                                    url: window.location.href
                                                                };
                                                                
                                                                if (navigator.share) {
                                                                    navigator.share(shareData).catch(console.error);
                                                                } else {
                                                                    navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                                                                    toast.success(t('link_copied') || 'Link copied to clipboard');
                                                                }
                                                            }}
                                                            className="self-start px-3 py-1 bg-white/10 hover:bg-white/20 text-[9px] uppercase font-bold tracking-widest rounded transition-colors"
                                                        >
                                                            {t('share') || 'Share'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* SETTINGS TAB */}
                            {activeTab === 'settings' && (
                                <motion.div 
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl"
                                >
                                    <div className="space-y-12">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-full border flex items-center justify-center opacity-50" style={{ borderColor: theme.text }}>
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold uppercase tracking-wide">{t('settings')}</h3>
                                                <p className="text-xs opacity-50 font-mono uppercase tracking-widest">{t('nomad_identity')}</p>
                                            </div>
                                        </div>

                                        {/* ═══ LANGUAGE PICKER ═══ */}
                                        <div>
                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5" />
                                                {language === 'ru' ? 'ЯЗЫК ИНТЕРФЕЙСА' : language === 'kz' ? 'ИНТЕРФЕЙС ТІІ' : 'INTERFACE LANGUAGE'}
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {([
                                                    { code: 'kz' as Language, label: 'Қазақша', flag: '🇰🇿' },
                                                    { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
                                                    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
                                                ]).map((lang) => {
                                                    const isActive = language === lang.code;
                                                    return (
                                                        <button
                                                            key={lang.code}
                                                            onClick={async () => {
                                                                setLanguage(lang.code);
                                                                try {
                                                                    const { data: { session } } = await supabase.auth.getSession();
                                                                    if (session?.access_token) {
                                                                        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
                                                                            method: 'POST',
                                                                            headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': session.access_token, 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ language: lang.code }),
                                                                        });
                                                                    }
                                                                } catch (e) { console.error('Failed to save language preference:', e); }
                                                                toast.success(lang.label);
                                                            }}
                                                            className="relative p-4 border text-center transition-all duration-300 group"
                                                            style={{
                                                                borderColor: isActive ? theme.primary : `${theme.text}15`,
                                                                backgroundColor: isActive ? `${theme.primary}08` : 'transparent',
                                                            }}
                                                        >
                                                            {isActive && <div className="absolute top-2 right-2 w-1.5 h-1.5" style={{ backgroundColor: theme.primary }} />}
                                                            <span className="text-lg block mb-1">{lang.flag}</span>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: isActive ? theme.primary : `${theme.text}70` }}>
                                                                {lang.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* ═══ SEASON PICKER ═══ */}
                                        <div>
                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 flex items-center gap-2">
                                                <Sun className="w-3.5 h-3.5" />
                                                {language === 'ru' ? 'СЕЗОН / ТЕМА' : language === 'kz' ? 'МЕЗГІЛ / ТАҚЫРЫП' : 'SEASON / THEME'}
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {([
                                                    { id: 'winter' as const, label: t('winter'), icon: Snowflake, color: '#00B4D8' },
                                                    { id: 'spring' as const, label: t('spring'), icon: Flower2, color: '#10B981' },
                                                    { id: 'summer' as const, label: t('summer'), icon: Sun, color: '#F59E0B' },
                                                    { id: 'autumn' as const, label: t('autumn'), icon: Leaf, color: '#D97706' },
                                                ]).map((s) => {
                                                    const isActive = season === s.id;
                                                    const Icon = s.icon;
                                                    return (
                                                        <button
                                                            key={s.id}
                                                            onClick={async () => {
                                                                setSeason(s.id);
                                                                try {
                                                                    const { data: { session } } = await supabase.auth.getSession();
                                                                    if (session?.access_token) {
                                                                        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
                                                                            method: 'POST',
                                                                            headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': session.access_token, 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ season: s.id }),
                                                                        });
                                                                    }
                                                                } catch (e) { console.error('Failed to save season preference:', e); }
                                                                toast.success(s.label);
                                                            }}
                                                            className="relative p-5 border text-center transition-all duration-500 group overflow-hidden"
                                                            style={{
                                                                borderColor: isActive ? s.color : `${theme.text}15`,
                                                                backgroundColor: isActive ? `${s.color}10` : 'transparent',
                                                            }}
                                                        >
                                                            <Icon className="w-6 h-6 mx-auto mb-2 transition-colors duration-300" style={{ color: isActive ? s.color : `${theme.text}40` }} />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: isActive ? s.color : `${theme.text}60` }}>
                                                                {s.label}
                                                            </span>
                                                            {isActive && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1" style={{ backgroundColor: s.color }} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[9px] mt-3 opacity-30 font-mono uppercase tracking-widest">
                                                {language === 'ru' ? 'Цвета и изображения сайта зависят от сезона' : language === 'kz' ? 'Сайт түстері мен суреттері мезгілге байланысты' : 'Site colors and imagery adapt to your chosen season'}
                                            </p>
                                        </div>

                                        {/* ═══ DARK MODE TOGGLE ═══ */}
                                        <div>
                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 flex items-center gap-2">
                                                <Moon className="w-3.5 h-3.5" />
                                                {language === 'ru' ? 'РЕЖИМ ОТОБРАЖЕНИЯ' : language === 'kz' ? 'КӨРСЕТУ РЕЖИМІ' : 'DISPLAY MODE'}
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={async () => {
                                                        setThemeVariant('default');
                                                        try {
                                                            const { data: { session } } = await supabase.auth.getSession();
                                                            if (session?.access_token) {
                                                                await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
                                                                    method: 'POST',
                                                                    headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': session.access_token, 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ themeVariant: 'default' }),
                                                                });
                                                            }
                                                        } catch (e) { console.error('Failed to save theme preference:', e); }
                                                        toast.success(language === 'ru' ? 'Светлый режим' : language === 'kz' ? 'Жарық режим' : 'Light Mode');
                                                    }}
                                                    className="relative p-6 border text-center transition-all duration-500 group overflow-hidden"
                                                    style={{
                                                        borderColor: themeVariant === 'default' ? theme.primary : `${theme.text}15`,
                                                        backgroundColor: themeVariant === 'default' ? `${theme.primary}08` : 'transparent',
                                                    }}
                                                >
                                                    {themeVariant === 'default' && <div className="absolute top-2 right-2 w-1.5 h-1.5" style={{ backgroundColor: theme.primary }} />}
                                                    <div className="w-10 h-10 mx-auto mb-3 border-2 flex items-center justify-center" style={{ borderColor: themeVariant === 'default' ? theme.primary : `${theme.text}30`, backgroundColor: '#FFFFFF' }}>
                                                        <Sun className="w-5 h-5" style={{ color: '#1A1A1A' }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeVariant === 'default' ? theme.primary : `${theme.text}60` }}>
                                                        {language === 'ru' ? 'Светлый' : language === 'kz' ? 'Жарық' : 'Light'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        setThemeVariant('dark');
                                                        try {
                                                            const { data: { session } } = await supabase.auth.getSession();
                                                            if (session?.access_token) {
                                                                await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
                                                                    method: 'POST',
                                                                    headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': session.access_token, 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ themeVariant: 'dark' }),
                                                                });
                                                            }
                                                        } catch (e) { console.error('Failed to save theme preference:', e); }
                                                        toast.success(language === 'ru' ? 'Тёмный режим' : language === 'kz' ? 'Қараңғы режим' : 'Dark Mode');
                                                    }}
                                                    className="relative p-6 border text-center transition-all duration-500 group overflow-hidden"
                                                    style={{
                                                        borderColor: themeVariant === 'dark' ? theme.primary : `${theme.text}15`,
                                                        backgroundColor: themeVariant === 'dark' ? `${theme.primary}08` : 'transparent',
                                                    }}
                                                >
                                                    {themeVariant === 'dark' && <div className="absolute top-2 right-2 w-1.5 h-1.5" style={{ backgroundColor: theme.primary }} />}
                                                    <div className="w-10 h-10 mx-auto mb-3 border-2 flex items-center justify-center" style={{ borderColor: themeVariant === 'dark' ? theme.primary : `${theme.text}30`, backgroundColor: '#1C1E26' }}>
                                                        <Moon className="w-5 h-5" style={{ color: '#E0E2E8' }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeVariant === 'dark' ? theme.primary : `${theme.text}60` }}>
                                                        {language === 'ru' ? 'Тёмный' : language === 'kz' ? 'Қараңғы' : 'Dark'}
                                                    </span>
                                                </button>
                                            </div>
                                            <p className="text-[9px] mt-3 opacity-30 font-mono uppercase tracking-widest">
                                                {language === 'ru' ? 'Тёмный режим работает с любым сезоном' : language === 'kz' ? 'Қараңғы режим кез келген мезгілмен жұмыс істейді' : 'Dark mode works with any season theme'}
                                            </p>
                                        </div>

                                        {/* ═══ DIVIDER ═══ */}
                                        <div className="h-px w-full" style={{ backgroundColor: `${theme.text}10` }} />

                                        {/* ═══ PROFILE FIELDS ═══ */}
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="group">
                                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3 group-focus-within:opacity-100 group-focus-within:text-emerald-500 transition-colors">
                                                    {t('profile') || 'Full Name'}
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        value={profileData.name} 
                                                        onChange={e => setProfileData({...profileData, name: e.target.value})} 
                                                        className="w-full bg-transparent border-b py-4 pl-0 pr-10 outline-none font-serif text-xl italic transition-colors" 
                                                        style={{ borderColor: `${theme.text}20` }}
                                                        placeholder="Enter your name..."
                                                    />
                                                    <Edit2 className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 opacity-20" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3">{t('phone_label')}</label>
                                                    <input  
                                                        type="text" 
                                                        value={profileData.phone} 
                                                        onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                                                        className="w-full bg-transparent border-b py-3 outline-none font-mono text-sm opacity-80" 
                                                        style={{ borderColor: `${theme.text}20` }}
                                                        placeholder="+7 ..."
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3">{t('passport_id')}</label>
                                                    <input 
                                                        type="text" 
                                                        value={profileData.passport} 
                                                        onChange={e => setProfileData({...profileData, passport: e.target.value})} 
                                                        className="w-full bg-transparent border-b py-3 outline-none font-mono text-sm opacity-80" 
                                                        style={{ borderColor: `${theme.text}20` }}
                                                        placeholder="N/A"
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3 text-red-400">{t('emergency_contact_label')}</label>
                                                <input 
                                                    type="text" 
                                                    value={profileData.emergencyContact} 
                                                    onChange={e => setProfileData({...profileData, emergencyContact: e.target.value})} 
                                                    className="w-full bg-transparent border-b py-3 outline-none font-mono text-sm opacity-80 focus:border-red-400 transition-colors" 
                                                    style={{ borderColor: `${theme.text}20` }}
                                                    placeholder="Name & Phone"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleSaveProfile} 
                                            disabled={savingProfile} 
                                            className="group relative px-8 py-4 bg-current overflow-hidden disabled:opacity-50"
                                            style={{ color: theme.background }}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                            <div className="relative flex items-center gap-3">
                                                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                                    {savingProfile ? t('syncing') : t('update_identity')}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

const ArrowIcon = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);