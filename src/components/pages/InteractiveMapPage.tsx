import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
    X, Star, Compass, ArrowRight, Mountain, Globe, 
    Eye, Plus, Minus, Maximize2, Box, ArrowLeft, AlertCircle, Heart
} from '../ui/icons';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageTransition } from '../ui/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '../../utils/supabase/client';
import { PLACES, Place } from '../data/map_places';
import { useWishlist } from './useWishlist';

const LIBRARIES = ['places', 'geometry', 'marker'] as any;

const DEFAULT_THEME = {
  primary: '#D4AF37', 
  secondary: '#E5E0D8',
  accent: '#1A3636',
  background: '#FDFBF7',
  text: '#1A3636',
};

const MARKER_ICONS = {
    sacred: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolygon%20points%3D%2212%202%2015.09%208.26%2022%209.27%2017%2014.14%2018.18%2021.02%2012%2017.77%205.82%2021.02%207%2014.14%202%209.27%208.91%208.26%2012%202%22%2F%3E%3C%2Fsvg%3E',
    nature: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m8%203%204%208%205%20-5%205%2015H2L8%203z%22%2F%3E%3C%2Fsvg%3E',
    history: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%2F%3E%3Cpolygon%20points%3D%2216.24%207.76%2014.12%2014.12%207.76%2016.24%209.88%209.88%2016.24%207.76%22%2F%3E%3C%2Fsvg%3E'
};

const MapInner = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
    const { theme, season } = useSeason();
    const [activeLayers, setActiveLayers] = useState<string[]>(['sacred', 'nature', 'history']);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isTerrainMode, setIsTerrainMode] = useState(false);
    const [activeRoute, setActiveRoute] = useState<{path: any[], name: string} | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [showStreetView, setShowStreetView] = useState(false);
    const [streetViewAvailable, setStreetViewAvailable] = useState(false);
    const [streetViewChecking, setStreetViewChecking] = useState(false);
    const [streetViewError, setStreetViewError] = useState(false);
    const [streetViewLoading, setStreetViewLoading] = useState(false);
    const [foundPanoData, setFoundPanoData] = useState<{ panoId: string; location: { lat: number; lng: number } } | null>(null);
    
    const { t, language } = useLanguage();
    const { isLiked, toggleWishlist } = useWishlist();

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<any[]>([]); 
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const streetViewContainerRef = useRef<HTMLDivElement>(null);
    const streetViewPanoRef = useRef<google.maps.StreetViewPanorama | null>(null);

    const getSVCoords = (p: Place) => ({
        lat: p.streetViewLat ?? p.lat,
        lng: p.streetViewLng ?? p.lng,
    });

    useEffect(() => {
        if (!selectedPlace) {
            setStreetViewAvailable(false);
            setShowStreetView(false);
            setStreetViewChecking(false);
            setStreetViewError(false);
            setFoundPanoData(null);
            return;
        }
        setStreetViewChecking(true);
        setStreetViewAvailable(false);
        setFoundPanoData(null);
        const sv = new google.maps.StreetViewService();
        const coords = getSVCoords(selectedPlace);
        sv.getPanorama(
            { location: coords, radius: 50000, preference: google.maps.StreetViewPreference.NEAREST },
            (data: any, status: any) => {
                if (status === 'OK' && data?.location?.pano) {
                    setStreetViewAvailable(true);
                    setFoundPanoData({
                        panoId: data.location.pano,
                        location: {
                            lat: data.location.latLng.lat(),
                            lng: data.location.latLng.lng(),
                        },
                    });
                } else {
                    setStreetViewAvailable(false);
                    setFoundPanoData(null);
                }
                setStreetViewChecking(false);
            }
        );
    }, [selectedPlace]);

    useEffect(() => {
        if (showStreetView && streetViewContainerRef.current && selectedPlace && foundPanoData) {
            setStreetViewLoading(true);
            setStreetViewError(false);
            const pano = new google.maps.StreetViewPanorama(streetViewContainerRef.current, {
                pano: foundPanoData.panoId,
                pov: { heading: 0, pitch: 10 },
                zoom: 1,
                disableDefaultUI: true,
                showRoadLabels: false,
                motionTracking: false,
            });
            streetViewPanoRef.current = pano;

            const statusListener = pano.addListener('status_changed', () => {
                const status = pano.getStatus();
                if (status === 'OK') {
                    setStreetViewLoading(false);
                    setStreetViewError(false);
                } else {
                    setStreetViewLoading(false);
                    setStreetViewError(true);
                }
            });

            const tilesListener = pano.addListener('tilesloaded', () => {
                setStreetViewLoading(false);
                setStreetViewError(false);
            });

            const timeout = setTimeout(() => {
                setStreetViewLoading(prev => {
                    if (prev) {
                        setStreetViewError(true);
                        return false;
                    }
                    return prev;
                });
            }, 15000);

            return () => {
                streetViewPanoRef.current = null;
                google.maps.event.removeListener(statusListener);
                google.maps.event.removeListener(tilesListener);
                clearTimeout(timeout);
            };
        }
    }, [showStreetView, selectedPlace, foundPanoData]);

    const getName = (p: Place | null) => {
        if (!p) return '';
        if (typeof p.name === 'string') return p.name;
        if (p.name && typeof p.name === 'object') {
             return (p.name as any)[language] || (p.name as any)['en'] || '';
        }
        return '';
    };

    const getDesc = (p: Place | null) => {
        if (!p) return '';
        if (typeof p.desc === 'string') return p.desc;
        if (p.desc && typeof p.desc === 'object') {
             return (p.desc as any)[language] || (p.desc as any)['en'] || '';
        }
        return '';
    };

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = new google.maps.Map(mapContainerRef.current, {
                center: { lat: 48.0196, lng: 66.9237 },
                zoom: 5,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                mapTypeId: 'roadmap',
                tilt: 0,
                gestureHandling: 'greedy',
                backgroundColor: theme.background,
                mapId: 'DEMO_MAP_ID'
            });

            mapRef.current = map;
            setMapReady(true);

            const bounds = new google.maps.LatLngBounds();
            PLACES.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
            const isMobile = window.innerWidth < 1024;
            map.fitBounds(bounds, isMobile ? { top: 70, bottom: 200, left: 20, right: 60 } : { top: 30, bottom: 30, left: 30, right: 30 });

            const observer = new MutationObserver(() => {
                const dismissBtns = document.querySelectorAll('.dismissButton, .gm-style button[aria-label="Close"], .gm-style button[aria-label="Dismiss"]');
                dismissBtns.forEach(btn => (btn as HTMLElement).click());
                const modals = document.querySelectorAll('.gm-style > div[style*="z-index"]');
                modals.forEach(modal => {
                    const el = modal as HTMLElement;
                    if (el.querySelector('button') && el.style.zIndex && parseInt(el.style.zIndex) > 100) {
                        el.style.display = 'none';
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });

            return () => observer.disconnect();
        }
    }, [theme]);

    useEffect(() => {
        if (mapReady && mapRef.current) {
            const focusId = localStorage.getItem('kendala_map_focus');
            if (focusId) {
                const place = PLACES.find(p => p.id === focusId);
                if (place) {
                    setSelectedPlace(place);
                    mapRef.current.panTo({ lat: place.lat, lng: place.lng });
                    mapRef.current.setZoom(14);
                    
                    setActiveLayers(prev => 
                        prev.includes(place.type) ? prev : [...prev, place.type]
                    );
                }
                localStorage.removeItem('kendala_map_focus');
            }
        }
    }, [mapReady]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setOptions({
                mapTypeId: isTerrainMode ? 'satellite' : 'roadmap',
                tilt: isTerrainMode ? 45 : 0,
            });
        }
    }, [isTerrainMode]);

    useEffect(() => {
        if (!mapRef.current || !mapReady) return;

        markersRef.current.forEach(marker => {
            marker.map = null;
        });
        markersRef.current = [];

        const placesToShow = PLACES.filter(p => activeLayers.includes(p.type));
        
        const createMarkers = async () => {
            try {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                placesToShow.forEach((place) => {
                    const getPinColor = (type: string) => {
                        switch(type) {
                            case 'sacred': return '#D4AF37'; 
                            case 'nature': return '#2E8B57'; 
                            case 'history': return '#4682B4'; 
                            default: return theme.text;
                        }
                    };

                    const getIconSrc = (type: string) => {
                            switch(type) {
                            case 'sacred': return MARKER_ICONS.sacred;
                            case 'nature': return MARKER_ICONS.nature;
                            case 'history': return MARKER_ICONS.history;
                            default: return MARKER_ICONS.sacred;
                        }
                    }

                    const markerContainer = document.createElement('div');
                    markerContainer.className = 'group relative cursor-pointer flex flex-col items-center justify-center';
                    
                    markerContainer.innerHTML = `
                        <div class="relative flex flex-col items-center transition-all duration-500 transform group-hover:-translate-y-2">
                            <!-- Glow Effect -->
                            <div class="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" style="background-color: ${getPinColor(place.type)}"></div>
                            
                            <!-- Main Pin -->
                            <div class="relative w-10 h-10 rounded-full border-[2px] border-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 bg-white z-10">
                                <div class="absolute inset-0 opacity-10" style="background-color: ${getPinColor(place.type)}"></div>
                                <div class="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300" style="background-color: ${getPinColor(place.type)}">
                                    <img src="${getIconSrc(place.type)}" class="w-3.5 h-3.5 drop-shadow-sm" />
                                </div>
                            </div>
                            
                            <!-- Triangle Pointer -->
                            <div class="w-3 h-3 bg-white rotate-45 -mt-1.5 shadow-sm z-0"></div>

                            <!-- Tooltip -->
                            <div class="absolute top-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-20">
                                <div class="px-5 py-2.5 bg-white/90 backdrop-blur-md shadow-xl border border-white/20 whitespace-nowrap rounded-none">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-zinc-800 block leading-none">${getName(place)}</span>
                                </div>
                            </div>
                        </div>
                    `;

                    const marker = new AdvancedMarkerElement({
                        position: { lat: place.lat, lng: place.lng },
                        map: mapRef.current,
                        title: getName(place),
                        content: markerContainer,
                        gmpClickable: true,
                    });

                    marker.addListener('click', () => {
                        setSelectedPlace(place);
                    });

                    markersRef.current.push(marker);
                });
            } catch (e) {
                console.error("Failed to load Advanced Markers:", e);
            }
        };

        createMarkers();
        
    }, [activeLayers, mapReady, theme, language]);

    useEffect(() => {
        if (!mapRef.current) return;

        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        if (activeRoute) {
            const polyline = new google.maps.Polyline({
                path: activeRoute.path,
                map: mapRef.current,
                strokeColor: theme.primary,
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
            });
            polylineRef.current = polyline;
        }
    }, [activeRoute, mapRef.current, theme]);

    const getPlaceTypeName = (type: string) => {
        switch(type) {
            case 'sacred': return t('sacred_places');
            case 'nature': return t('nature_places');
            case 'history': return t('history_places');
            default: return type;
        }
    };

    return (
        <div 
            style={{ backgroundColor: theme.background, color: theme.text }}
            className="h-screen w-full flex flex-col lg:flex-row overflow-hidden font-sans selection:text-white"
        >
            <style>{`::selection { background-color: ${theme.primary}; }`}</style>
            
            {/* --- SIDEBAR --- */}
            <div 
                style={{ 
                    backgroundColor: theme.background + 'EE',
                    borderColor: theme.secondary
                }}
                className="hidden lg:flex w-[400px] flex-shrink-0 border-r flex-col z-20 shadow-2xl relative backdrop-blur-md transition-colors duration-500"
            >
                {/* Header */}
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-6">
                         <h1 style={{ color: theme.text }} className="text-4xl font-sans font-black uppercase tracking-tighter">Kendala</h1>
                         <div className="p-2 border border-current/10 rounded-none">
                            <Compass style={{ color: theme.primary }} className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                         </div>
                    </div>
                    <p style={{ color: theme.text }} className="font-sans text-sm opacity-60 font-bold uppercase tracking-widest leading-relaxed">
                        {t('map_tagline')}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto relative custom-scrollbar px-8 pb-8">
                    {!selectedPlace ? (
                        <div className="space-y-8">
                            {/* Layers Selection */}
                            <div>
                                <h3 style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">{t('map_filters')}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'sacred', label: t('sacred_places'), icon: Star, color: '#D4AF37' },
                                        { id: 'nature', label: t('nature_places'), icon: Mountain, color: '#2E8B57' },
                                        { id: 'history', label: t('history_places'), icon: Compass, color: '#4682B4' },
                                    ].map((layer) => (
                                        <button
                                            key={layer.id}
                                            onClick={() => setActiveLayers(prev => prev.includes(layer.id) ? prev.filter(l => l !== layer.id) : [...prev, layer.id])}
                                            className={`
                                                relative p-5 border transition-all duration-300 flex flex-col gap-3 items-start group rounded-none
                                                ${activeLayers.includes(layer.id) ? 'shadow-lg ring-1 ring-offset-2 ring-current scale-[1.02]' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeLayers.includes(layer.id) ? theme.background : 'transparent',
                                                borderColor: activeLayers.includes(layer.id) ? layer.color : theme.secondary
                                            }}
                                        >
                                            <div className="p-2 transition-colors rounded-none" style={{ backgroundColor: activeLayers.includes(layer.id) ? `${layer.color}20` : 'transparent' }}>
                                                <layer.icon style={{ color: layer.color }} className="w-5 h-5" />
                                            </div>
                                            <span style={{ color: theme.text }} className="text-xs font-black uppercase tracking-wider text-left leading-none">
                                                {layer.label}
                                            </span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setIsTerrainMode(!isTerrainMode)}
                                        className={`p-5 border transition-all duration-300 flex flex-col gap-3 items-start rounded-none ${isTerrainMode ? 'bg-black text-white shadow-lg ring-1 ring-offset-2 ring-black scale-[1.02]' : 'hover:bg-black/5 opacity-60 hover:opacity-100'}`}
                                        style={{ borderColor: theme.secondary }}
                                    >
                                        <div className="p-2 rounded-none">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider text-left leading-none">{t('terrain_view')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Places Grid */}
                            <div>
                                <h3 style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">
                                    {t('all_places_count')} ({PLACES.filter(p => activeLayers.includes(p.type)).length})
                                </h3>
                                <div className="space-y-4">
                                    {PLACES.filter(p => activeLayers.includes(p.type)).map((place, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={place.id} 
                                            onClick={() => setSelectedPlace(place)} 
                                            className="group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-black/5 rounded-none"
                                        >
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                            <div className="aspect-[21/9] w-full relative">
                                                <ResponsiveImage src={place.image || ''} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex justify-between items-end">
                                                <div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-2 block">{getPlaceTypeName(place.type)}</span>
                                                    <h4 className="text-white text-lg font-black uppercase tracking-tight leading-none">{getName(place)}</h4>
                                                </div>
                                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-white/20 rounded-none">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: theme.background }} className="h-full flex flex-col absolute inset-0 z-30 animate-in slide-in-from-left duration-500">
                            {/* Image Header */}
                            <div className="relative h-72 shrink-0">
                                <ResponsiveImage src={selectedPlace.image || ''} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                                
                                <button onClick={() => setSelectedPlace(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10 z-50 rounded-none mt-16 md:mt-0">
                                    <X className="w-5 h-5" />
                                </button>

                                <button onClick={() => setSelectedPlace(null)} className="absolute top-6 left-6 px-4 py-2 bg-black/20 hover:bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all hover:scale-105 z-50 rounded-none">
                                    <ArrowLeft className="w-3 h-3" /> {t('return_to_map')}
                                </button>

                                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent pt-20">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-sm rounded-none">
                                                {getPlaceTypeName(selectedPlace.type)}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-md">{getName(selectedPlace)}</h2>
                                    </div>
                                    <button 
                                        onClick={() => toggleWishlist(selectedPlace, 'Kazakhstan')}
                                        className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group shrink-0 rounded-none"
                                    >
                                        <Heart className={`w-6 h-6 transition-all ${isLiked(selectedPlace.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover:scale-110'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                                {/* Description */}
                                <div className="space-y-4">
                                    <div className="w-12 h-1.5 opacity-10 rounded-none" style={{ backgroundColor: theme.text }} />
                                    <p style={{ color: theme.text }} className="text-lg md:text-xl font-bold leading-relaxed opacity-80">
                                        {getDesc(selectedPlace)}
                                    </p>
                                </div>
                                
                                {/* Coordinates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 flex flex-col gap-1 border group transition-colors rounded-none" style={{ backgroundColor: `${theme.text}08`, borderColor: `${theme.text}08` }}>
                                        <div className="flex items-center gap-2 mb-1 opacity-40">
                                            <Compass className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Lat</span>
                                        </div>
                                        <span className="text-xl font-black font-mono tracking-tight">{selectedPlace.lat.toFixed(4)}°N</span>
                                    </div>
                                    <div className="p-5 flex flex-col gap-1 border group transition-colors rounded-none" style={{ backgroundColor: `${theme.text}08`, borderColor: `${theme.text}08` }}>
                                        <div className="flex items-center gap-2 mb-1 opacity-40">
                                            <Compass className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Lng</span>
                                        </div>
                                        <span className="text-xl font-black font-mono tracking-tight">{selectedPlace.lng.toFixed(4)}°E</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3 pt-4">
                                    {streetViewChecking ? (
                                        <div className="w-full py-5 border border-dashed flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] opacity-40 rounded-none" style={{ borderColor: `${theme.text}30` }}>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                            {t('street_view_loading') || 'Checking...'}
                                        </div>
                                    ) : streetViewAvailable ? (
                                        <button 
                                            onClick={() => setShowStreetView(true)}
                                            className="w-full py-5 bg-black text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-black/80 transition-colors shadow-lg group rounded-none"
                                        >
                                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {t('street_view') || 'Street View'}
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 border border-dashed flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] opacity-30 rounded-none" style={{ borderColor: `${theme.text}20`, color: theme.text }}>
                                            <AlertCircle className="w-4 h-4" />
                                            {t('street_view_not_found') || 'Panorama not available'}
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => {
                                            localStorage.setItem('kendala_pending_activity', JSON.stringify({
                                                ...selectedPlace,
                                                type: 'activity',
                                                price: 0
                                            }));
                                            onNavigate?.('planner');
                                        }}
                                        className="w-full py-5 bg-emerald-500 text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 group rounded-none"
                                    >
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    {t('places_add_to_trip')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MAP CONTAINER --- */}
            <div className="flex-1 relative bg-neutral-100">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

                {/* --- FLOATING MAP CONTROLS (all screen sizes) --- */}
                <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
                    <button
                        onClick={() => setIsTerrainMode(!isTerrainMode)}
                        className={`w-12 h-12 flex items-center justify-center shadow-xl border transition-all duration-300 rounded-none ${isTerrainMode ? 'bg-black text-white border-black' : 'backdrop-blur-md border-black/10 dark:border-white/10'}`}
                        style={{ backgroundColor: isTerrainMode ? undefined : `${theme.background}E6` }}
                    >
                        <Globe className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => mapRef.current && mapRef.current.setZoom((mapRef.current.getZoom() || 5) + 1)}
                        className="w-12 h-12 flex items-center justify-center backdrop-blur-md shadow-xl border border-black/10 dark:border-white/10 rounded-none lg:hidden"
                        style={{ color: theme.text, backgroundColor: `${theme.background}E6` }}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => mapRef.current && mapRef.current.setZoom((mapRef.current.getZoom() || 5) - 1)}
                        className="w-12 h-12 flex items-center justify-center backdrop-blur-md shadow-xl border border-black/10 dark:border-white/10 rounded-none lg:hidden"
                        style={{ color: theme.text, backgroundColor: `${theme.background}E6` }}
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                </div>

                {/* --- MOBILE: Open sidebar button --- */}
                <button
                    onClick={() => setShowMobileSidebar(true)}
                    className="lg:hidden absolute top-4 left-4 z-[1000] px-4 py-3 backdrop-blur-md shadow-xl border border-black/10 dark:border-white/10 flex items-center gap-2 rounded-none"
                    style={{ color: theme.text, backgroundColor: `${theme.background}E6` }}
                >
                    <Compass style={{ color: theme.primary }} className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {t('map_filters')} ({PLACES.filter(p => activeLayers.includes(p.type)).length})
                    </span>
                </button>

                {/* --- MOBILE: Selected place bottom card --- */}
                <AnimatePresence>
                    {selectedPlace && (
                        <motion.div
                            key="mobile-place-card"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden absolute bottom-0 left-0 right-0 z-[1000] shadow-2xl border-t border-black/10 max-h-[55vh] overflow-y-auto"
                            style={{ backgroundColor: theme.background }}
                        >
                            <div className="relative h-36">
                                <ResponsiveImage src={selectedPlace.image || ''} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <button onClick={() => setSelectedPlace(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 rounded-none z-10">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-3 left-4 right-4">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60 block mb-1">{getPlaceTypeName(selectedPlace.type)}</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{getName(selectedPlace)}</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <p style={{ color: theme.text }} className="text-sm leading-relaxed opacity-70 line-clamp-3">{getDesc(selectedPlace)}</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleWishlist(selectedPlace, 'Kazakhstan')}
                                        className="w-11 h-11 border flex items-center justify-center shrink-0 rounded-none"
                                        style={{ borderColor: `${theme.text}20` }}
                                    >
                                        <Heart className={`w-5 h-5 transition-all ${isLiked(selectedPlace.id) ? 'fill-red-500 text-red-500' : ''}`} style={{ color: isLiked(selectedPlace.id) ? undefined : theme.text }} />
                                    </button>
                                    {streetViewChecking ? (
                                        <div className="w-11 h-11 border border-dashed flex items-center justify-center shrink-0 rounded-none opacity-40" style={{ borderColor: `${theme.text}30` }}>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                                        </div>
                                    ) : streetViewAvailable ? (
                                        <button 
                                            onClick={() => setShowStreetView(true)}
                                            className="w-11 h-11 border bg-black text-white flex items-center justify-center shrink-0 rounded-none"
                                            style={{ borderColor: 'black' }}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <div className="w-11 h-11 border border-dashed flex items-center justify-center shrink-0 rounded-none opacity-20" style={{ borderColor: `${theme.text}20` }}>
                                            <Eye className="w-4 h-4" />
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => {
                                            localStorage.setItem('kendala_pending_activity', JSON.stringify({
                                                ...selectedPlace,
                                                type: 'activity',
                                                price: 0
                                            }));
                                            onNavigate?.('planner');
                                        }}
                                        className="flex-1 py-3 bg-emerald-500 text-white flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] rounded-none"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {t('places_add_to_trip')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- STREET VIEW OVERLAY --- */}
            <AnimatePresence>
                {showStreetView && selectedPlace && (
                    <motion.div
                        key="street-view-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[2000] bg-black"
                    >
                        <div ref={streetViewContainerRef} className="absolute inset-0 w-full h-full" />
                        
                        {/* Loading overlay */}
                        <AnimatePresence>
                            {streetViewLoading && (
                                <motion.div
                                    key="sv-loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                                        {t('street_view_loading') || 'Loading panorama...'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error overlay */}
                        <AnimatePresence>
                            {streetViewError && (
                                <motion.div
                                    key="sv-error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-6 p-8 text-center"
                                >
                                    <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-none">
                                        <AlertCircle className="w-8 h-8 text-white/40" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-widest text-white/80 mb-2">
                                            {t('street_view_not_found') || 'Panorama not available'}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 max-w-sm">
                                            {getName(selectedPlace)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowStreetView(false)}
                                        className="px-8 py-4 bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all rounded-none"
                                    >
                                        {t('return_to_map') || 'Return to Map'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Street View Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-white/60" />
                                <div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 block">{t('street_view') || 'Street View'}</span>
                                    <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">{getName(selectedPlace)}</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowStreetView(false)}
                                className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all rounded-none mt-16 md:mt-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Coordinates footer */}
                        {!streetViewError && (
                            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="flex items-center gap-4 text-white/50">
                                    <span className="text-[9px] font-mono font-black">{selectedPlace.lat.toFixed(4)}°N</span>
                                    <span className="text-[9px] font-mono font-black">{selectedPlace.lng.toFixed(4)}°E</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest ml-auto">{t('drag_to_look') || 'Drag to look around'}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MOBILE SIDEBAR OVERLAY --- */}
            <AnimatePresence>
                {showMobileSidebar && (
                    <>
                        <motion.div
                            key="mobile-sidebar-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-black/50"
                            onClick={() => setShowMobileSidebar(false)}
                        />
                        <motion.div
                            key="mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[380px] flex flex-col shadow-2xl overflow-hidden"
                            style={{ backgroundColor: theme.background }}
                        >
                            <div className="p-5 pb-3 flex justify-between items-center border-b" style={{ borderColor: `${theme.text}10` }}>
                                <h2 style={{ color: theme.text }} className="text-2xl font-black uppercase tracking-tighter">Kendala</h2>
                                <button onClick={() => setShowMobileSidebar(false)} className="w-10 h-10 flex items-center justify-center border rounded-none" style={{ borderColor: `${theme.text}15` }}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                <div>
                                    <h3 style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">{t('map_filters')}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'sacred', label: t('sacred_places'), icon: Star, color: '#D4AF37' },
                                            { id: 'nature', label: t('nature_places'), icon: Mountain, color: '#2E8B57' },
                                            { id: 'history', label: t('history_places'), icon: Compass, color: '#4682B4' },
                                        ].map((layer) => (
                                            <button
                                                key={layer.id}
                                                onClick={() => setActiveLayers(prev => prev.includes(layer.id) ? prev.filter(l => l !== layer.id) : [...prev, layer.id])}
                                                className={`relative p-4 border transition-all duration-300 flex flex-col gap-2 items-start rounded-none ${activeLayers.includes(layer.id) ? 'shadow-md ring-1 ring-offset-1 ring-current' : 'opacity-50'}`}
                                                style={{ 
                                                    backgroundColor: activeLayers.includes(layer.id) ? theme.background : 'transparent',
                                                    borderColor: activeLayers.includes(layer.id) ? layer.color : theme.secondary
                                                }}
                                            >
                                                <layer.icon style={{ color: layer.color }} className="w-5 h-5" />
                                                <span style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-wider text-left leading-none">{layer.label}</span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsTerrainMode(!isTerrainMode)}
                                            className={`p-4 border transition-all duration-300 flex flex-col gap-2 items-start rounded-none ${isTerrainMode ? 'bg-black text-white shadow-md ring-1 ring-offset-1 ring-black' : 'opacity-50'}`}
                                            style={{ borderColor: theme.secondary }}
                                        >
                                            <Globe className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-left leading-none">{t('terrain_view')}</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ color: theme.text }} className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">
                                        {t('all_places_count')} ({PLACES.filter(p => activeLayers.includes(p.type)).length})
                                    </h3>
                                    <div className="space-y-2">
                                        {PLACES.filter(p => activeLayers.includes(p.type)).map((place) => (
                                            <button
                                                key={place.id}
                                                onClick={() => {
                                                    setSelectedPlace(place);
                                                    setShowMobileSidebar(false);
                                                    if (mapRef.current) {
                                                        mapRef.current.panTo({ lat: place.lat, lng: place.lng });
                                                        mapRef.current.setZoom(12);
                                                    }
                                                }}
                                                className="w-full flex items-center gap-3 p-3 border transition-colors rounded-none text-left"
                                                style={{ borderColor: `${theme.text}10` }}
                                            >
                                                <div className="w-12 h-12 shrink-0 relative overflow-hidden">
                                                    <ResponsiveImage src={place.image || ''} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 block">{getPlaceTypeName(place.type)}</span>
                                                    <span style={{ color: theme.text }} className="text-xs font-black uppercase tracking-tight block truncate">{getName(place)}</span>
                                                </div>
                                                <ArrowRight className="w-3 h-3 opacity-30 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const MapLoader = ({ apiKey, children }: { apiKey: string, children: React.ReactNode }) => {
    const { theme } = useSeason();
    const { t } = useLanguage();
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
        preventGoogleFontsLoading: true,
        version: 'weekly',
    });
    
    if (loadError) {
        return (
             <div 
                style={{ backgroundColor: theme.background, color: theme.accent }}
                className="h-screen flex flex-col items-center justify-center p-8 text-center"
             >
                <h2 className="text-3xl font-sans font-black mb-4 uppercase">{t('connection_lost')}</h2>
                <p style={{ color: theme.text }} className="max-w-md font-sans text-lg mb-4 leading-relaxed font-bold">
                    {t('map_load_error')}
                </p>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    {t('reload')}
                </button>
             </div>
        );
    }
    
    if (!isLoaded) return (
        <div style={{ backgroundColor: theme.background, color: theme.text }} className="h-screen flex items-center justify-center font-sans font-black text-2xl uppercase">
            {t('loading_map')}
        </div>
    );
    
    return <>{children}</>;
}

export const InteractiveMapPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
    const { t } = useLanguage();
    const [apiKey, setApiKey] = useState<string>("");
    const [configLoading, setConfigLoading] = useState(true);
    const { theme } = useSeason();
    
    const [isExternalLoad] = useState(() => !!((window as any).google && (window as any).google.maps));

    useEffect(() => {
        if (isExternalLoad) {
            setConfigLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
                
                const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/maps-config`, {
                    headers: {
                        'Authorization': `Bearer ${publicAnonKey}`
                    }
                });
                const data = await res.json();
                if (data.apiKey) {
                    setApiKey(data.apiKey);
                } else {
                    console.error("Map config missing API key", data);
                }
            } catch (e) {
                console.error("Failed to fetch map config", e);
            } finally {
                setConfigLoading(false);
            }
        };

        fetchConfig();
    }, [isExternalLoad]);

    if (configLoading) {
        return (
            <div style={{ backgroundColor: theme.background, color: theme.text }} className="h-screen flex items-center justify-center font-sans font-black text-2xl uppercase">
                {t('map_loading_config')}
            </div>
        );
    }

    if (isExternalLoad) {
        return <MapInner onNavigate={onNavigate} />;
    }

    if (!apiKey) {
        return (
             <div 
                style={{ backgroundColor: theme.background, color: theme.accent }}
                className="h-screen flex flex-col items-center justify-center p-8 text-center"
             >
                <h2 className="text-3xl font-sans font-black mb-4 uppercase">Configuration Error</h2>
                <p style={{ color: theme.text }} className="max-w-md font-sans text-lg mb-4 leading-relaxed font-bold">
                    Unable to load Maps API configuration.
                </p>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    Reload
                </button>
             </div>
        );
    }

    return (
        <MapLoader apiKey={apiKey}>
            <MapInner onNavigate={onNavigate} />
        </MapLoader>
    );
};