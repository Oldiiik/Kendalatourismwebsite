import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Mountain, RotateCcw, Eye, Maximize2, Minimize2 } from '../ui/icons';
import { ItineraryItem } from '../pages/plannerTypes';
import { PLACES } from '../data/map_places';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { useLanguage } from '../../contexts/LanguageContext';

const LIBRARIES = ['places', 'geometry', 'marker', 'maps3d'] as any;

interface TripRouteFlyoverProps {
  itinerary: ItineraryItem[];
  onClose: () => void;
  theme: any;
  autoPlay?: boolean;
}

interface RouteStop {
  lat: number; lng: number; title: string; location: string;
  day: number; time: string; type: string; notes: string;
  timeOfDay: string; cost: number;
}

type TFn = (key: string) => string;

function getTimeOfDay(time: string): string {
  const h = parseInt(time.split(':')[0], 10);
  if (h < 6) return 'night';
  if (h < 8) return 'dawn';
  if (h < 11) return 'morning';
  if (h < 14) return 'noon';
  if (h < 17) return 'afternoon';
  if (h < 20) return 'evening';
  return 'night';
}

const TOD_KEY: Record<string, string> = {
  night: 'flyover_night', dawn: 'flyover_dawn', morning: 'flyover_morning',
  noon: 'flyover_midday', afternoon: 'flyover_afternoon', evening: 'flyover_evening'
};

const parseEmbeddedCoords = (s: string) => {
  const m = s.match(/\[coords:\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\]/);
  if (!m) return null;
  const lat = +m[1], lng = +m[2];
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
};

const parseCoordString = (s: string) => {
  const m = s.match(/^\s*([-\d.]+)\s*,\s*([-\d.]+)\s*$/);
  if (!m) return null;
  const lat = +m[1], lng = +m[2];
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
};

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);

const zoomToRange = (zoom: number) => 35200000 / Math.pow(2, zoom);
const rangeToZoom = (range: number) => Math.log2(35200000 / Math.max(range, 1));
const easeIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const shortAngle = (from: number, to: number) => { let d = to - from; d = ((d % 360) + 540) % 360 - 180; return d; };

interface CameraTarget {
  center: { lat: number; lng: number; altitude?: number };
  tilt: number; heading: number; range: number;
}

const FALLBACK_STOPS: RouteStop[] = [
  { lat: 43.238949, lng: 76.889709, title: 'Almaty', location: 'Almaty', day: 1, time: '09:00', type: 'activity', notes: '', timeOfDay: 'morning', cost: 0 },
  { lat: 51.169392, lng: 71.449074, title: 'Astana', location: 'Astana', day: 2, time: '12:00', type: 'activity', notes: '', timeOfDay: 'noon', cost: 0 },
];

const SPEED_OPTIONS = [1, 1.5, 2] as const;

const LoadingScreen = ({ progress, stops, t }: { progress: number; stops: string[]; t: TFn }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.6 } }}
    className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
  >
    <div className="relative z-10 max-w-lg w-full px-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-14">
        <div className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-3 opacity-70">{t('flyover_title')}</div>
        <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
          {t('flyover_charting')}<br />{t('flyover_charting_sub')}
        </h1>
      </motion.div>
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">{t('flyover_plotting')}</span>
          <span className="text-[#D4AF37] text-sm font-mono font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-px bg-white/10 w-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="space-y-1.5 max-h-36 overflow-hidden">
        {stops.slice(-5).map((s, i) => (
          <div key={`${s}-${i}`} className="flex items-center gap-3 text-white/40">
            <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45 flex-shrink-0" />
            <span className="text-[11px] font-mono tracking-wider truncate">{s}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const DaySplash = ({ day, count, t }: { day: number; count: number; t: TFn }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    <div className="absolute inset-0 bg-black/60" />
    <motion.div
      className="relative z-10 text-center text-white"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-3">
        {count} {count === 1 ? t('flyover_stop') : t('flyover_stops')}
      </div>
      <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
        {t('flyover_day')} {day < 10 ? `0${day}` : day}
      </h2>
    </motion.div>
  </motion.div>
);

const StopCard = ({ stop, index, total, t }: { stop: RouteStop; index: number; total: number; t: TFn }) => (
  <motion.div
    key={`card-${index}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="absolute bottom-24 md:bottom-28 left-6 md:left-12 max-w-sm pointer-events-none"
  >
    <div className="bg-black/85 backdrop-blur-sm border border-white/8 p-5 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-2 py-1 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider">
          {t('flyover_day')} {stop.day < 10 ? `0${stop.day}` : stop.day}
        </span>
        <span className="text-white/40 text-[10px] font-mono">{stop.time}</span>
        <span className="text-[#D4AF37]/50 text-[9px] font-black uppercase tracking-widest">
          {TOD_KEY[stop.timeOfDay] ? t(TOD_KEY[stop.timeOfDay]) : ''}
        </span>
      </div>
      <h3 className="text-white text-lg md:text-xl font-black leading-tight mb-2">{stop.title}</h3>
      <div className="text-white/30 text-[11px] font-mono tracking-wide mb-3">{stop.location}</div>
      {stop.notes && (
        <p className="text-white/30 text-[11px] leading-relaxed border-l border-[#D4AF37]/20 pl-3 line-clamp-3">{stop.notes}</p>
      )}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-white/15 text-[9px] font-black uppercase tracking-widest">{index + 1} / {total}</span>
        <div className="h-px flex-1 mx-4 bg-white/5 relative overflow-hidden">
          <div className="h-full bg-[#D4AF37]/40 transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  </motion.div>
);

const LocationMarker = ({ name }: { name: string }) => (
  <div className="absolute top-1/2 left-1/2 z-30 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
    <motion.div className="absolute border-2 border-[#D4AF37]/40" style={{ width: 72, height: 72, top: -36, left: -36 }} animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }} />
    <motion.div className="absolute border border-[#D4AF37]/25" style={{ width: 72, height: 72, top: -36, left: -36 }} animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut', delay: 0.7 }} />
    <motion.div className="absolute border border-[#D4AF37]/40" style={{ width: 44, height: 44, top: -22, left: -22 }} animate={{ rotate: [0, 90] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} />
    <motion.div className="absolute border border-white/15" style={{ width: 30, height: 30, top: -15, left: -15 }} animate={{ rotate: [45, -45] }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} />
    <div className="absolute bg-[#D4AF37]/50" style={{ width: 1, height: 32, top: -40, left: 0 }} />
    <div className="absolute bg-[#D4AF37]/50" style={{ width: 1, height: 32, top: 10, left: 0 }} />
    <div className="absolute bg-[#D4AF37]/50" style={{ width: 32, height: 1, top: 0, left: -40 }} />
    <div className="absolute bg-[#D4AF37]/50" style={{ width: 32, height: 1, top: 0, left: 10 }} />
    <div className="absolute bg-[#D4AF37]/80" style={{ width: 3, height: 10, top: -14, left: -1 }} />
    <div className="absolute bg-[#D4AF37]/80" style={{ width: 3, height: 10, top: 6, left: -1 }} />
    <div className="absolute bg-[#D4AF37]/80" style={{ width: 10, height: 3, top: -1, left: -14 }} />
    <div className="absolute bg-[#D4AF37]/80" style={{ width: 10, height: 3, top: -1, left: 6 }} />
    <motion.div className="bg-[#D4AF37] rotate-45" style={{ width: 10, height: 10, marginTop: -5, marginLeft: -5, boxShadow: '0 0 16px rgba(212,175,55,0.7), 0 0 40px rgba(212,175,55,0.25)' }} animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />
    <div className="absolute whitespace-nowrap" style={{ top: 46, left: '50%', transform: 'translateX(-50%)' }}>
      <div className="bg-black/85 backdrop-blur-sm border border-[#D4AF37]/30 px-3 py-1.5 flex items-center gap-2">
        <div className="w-1 h-1 bg-[#D4AF37] rotate-45 flex-shrink-0" />
        <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] max-w-[200px] truncate">{name}</span>
      </div>
    </div>
  </div>
);

const SpeedSelector = ({ speed, onChange }: { speed: number; onChange: (s: number) => void }) => (
  <div className="flex items-center border border-white/10 overflow-hidden">
    {SPEED_OPTIONS.map(s => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all
          ${speed === s ? 'bg-[#D4AF37] text-black' : 'bg-black/50 text-white/40 hover:text-white/70'}`}
      >
        {s}x
      </button>
    ))}
  </div>
);

const FlyoverInner = ({ itinerary, onClose, autoPlay = true }: TripRouteFlyoverProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const modeRef = useRef<'3d' | '2d'>('3d');
  const abortRef = useRef(false);
  const speedRef = useRef(1);
  const pausedAtRef = useRef(-1);
  const svPanoRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const svLatLngRef = useRef<google.maps.LatLng | null>(null);
  const svHeadingRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [currentStop, setCurrentStop] = useState<RouteStop | null>(null);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [daySplash, setDaySplash] = useState<{ day: number; count: number } | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'flying' | 'paused' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [loadNames, setLoadNames] = useState<string[]>([]);
  const startedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [svHasData, setSvHasData] = useState(false);
  const [svOpen, setSvOpen] = useState(false);
  const [svExpanded, setSvExpanded] = useState(false);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const tid = setTimeout(() => {
      console.warn('[Flyover] Safety timeout (8s)');
      setMapReady(true);
      setStops(prev => prev.length > 0 ? prev : FALLBACK_STOPS);
    }, 8000);
    return () => clearTimeout(tid);
  }, [phase]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || modeRef.current !== '2d') return;
    if (phase === 'paused') {
      try { map.setOptions({ gestureHandling: 'auto', zoomControl: true, streetViewControl: false }); } catch {}
    } else {
      try { map.setOptions({ gestureHandling: 'none', zoomControl: false, streetViewControl: false }); } catch {}
    }
  }, [phase]);

  const showStreetView = useCallback(async (lat: number, lng: number, heading: number) => {
    svHeadingRef.current = heading;
    svLatLngRef.current = null;
    setSvHasData(false);
    if (!svContainerRef.current) return;
    try {
      const sv = new google.maps.StreetViewService();
      const result = await sv.getPanorama({ location: { lat, lng }, radius: 200, source: google.maps.StreetViewSource.OUTDOOR });
      if (result.data?.location?.latLng) {
        svLatLngRef.current = result.data.location.latLng;
        svHeadingRef.current = heading;
        setSvHasData(true);
        setSvOpen(true);
        setTimeout(() => {
          if (!svContainerRef.current || !svLatLngRef.current) return;
          if (svPanoRef.current) {
            svPanoRef.current.setPosition(svLatLngRef.current!);
            svPanoRef.current.setPov({ heading, pitch: 0 });
            svPanoRef.current.setVisible(true);
          } else {
            svPanoRef.current = new google.maps.StreetViewPanorama(svContainerRef.current!, {
              position: svLatLngRef.current!, pov: { heading, pitch: 0 },
              disableDefaultUI: true, addressControl: false, fullscreenControl: false,
              zoomControl: false, panControl: false, linksControl: false,
              clickToGo: false, scrollwheel: false, showRoadLabels: false,
            });
          }
        }, 60);
      } else { setSvOpen(false); }
    } catch { setSvOpen(false); }
  }, []);

  const hideStreetView = useCallback(() => {
    setSvOpen(false); setSvExpanded(false); setSvHasData(false);
    if (svPanoRef.current) { try { svPanoRef.current.setVisible(false); } catch {} }
  }, []);

  const setSvInteractive = useCallback((interactive: boolean) => {
    if (!svPanoRef.current) return;
    try {
      svPanoRef.current.setOptions({
        disableDefaultUI: !interactive, clickToGo: interactive, scrollwheel: interactive,
        linksControl: interactive, panControl: interactive, zoomControl: interactive,
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (phase === 'paused' && svOpen) setSvInteractive(true);
    else if (phase === 'flying' && svOpen) { setSvInteractive(false); setSvExpanded(false); }
  }, [phase, svOpen, setSvInteractive]);

  const closeStreetViewPanel = useCallback(() => {
    setSvOpen(false); setSvExpanded(false);
    if (svPanoRef.current) { try { svPanoRef.current.setVisible(false); } catch {} }
  }, []);

  useEffect(() => {
    if (svOpen && svPanoRef.current) { setTimeout(() => { google.maps.event.trigger(svPanoRef.current!, 'resize'); }, 100); }
  }, [svExpanded, svOpen]);

  const flyTo = useCallback((cam: CameraTarget, duration: number): Promise<void> => {
    return new Promise(resolve => {
      const map = mapRef.current;
      if (!map || abortRef.current) { resolve(); return; }
      const dur = duration / speedRef.current;
      if (modeRef.current === '3d' && typeof map.flyCameraTo === 'function') {
        let done = false;
        const finish = () => { if (done) return; done = true; resolve(); };
        const h = () => { map.removeEventListener('gmp-animationend', h); finish(); };
        map.addEventListener('gmp-animationend', h);
        try { map.flyCameraTo({ endCamera: cam, durationMillis: dur }); }
        catch (e) { console.warn('[Flyover] flyCameraTo fail:', e); finish(); return; }
        setTimeout(finish, dur + 600);
        return;
      }
      const c = map.getCenter?.();
      const sLat = c?.lat() ?? 48, sLng = c?.lng() ?? 67;
      const sZoom = map.getZoom?.() ?? 5;
      const sHead = map.getHeading?.() ?? 0;
      const sTilt = map.getTilt?.() ?? 0;
      const eZoom = rangeToZoom(cam.range);
      const headDelta = shortAngle(sHead, cam.heading);
      const t0 = performance.now();
      const step = (now: number) => {
        if (abortRef.current) { resolve(); return; }
        const p = Math.min((now - t0) / dur, 1);
        const e = easeIO(p);
        try {
          map.moveCamera({ center: { lat: sLat + (cam.center.lat - sLat) * e, lng: sLng + (cam.center.lng - sLng) * e }, zoom: sZoom + (eZoom - sZoom) * e, heading: sHead + headDelta * e, tilt: sTilt + (cam.tilt - sTilt) * e });
        } catch {
          try { map.moveCamera({ center: { lat: sLat + (cam.center.lat - sLat) * e, lng: sLng + (cam.center.lng - sLng) * e }, zoom: sZoom + (eZoom - sZoom) * e }); } catch {}
        }
        if (p < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }, []);

  const flyAround = useCallback((cam: CameraTarget, duration: number, rounds: number): Promise<void> => {
    return new Promise(resolve => {
      const map = mapRef.current;
      if (!map || abortRef.current) { resolve(); return; }
      const dur = duration / speedRef.current;
      if (modeRef.current === '3d' && typeof map.flyCameraAround === 'function') {
        let done = false;
        const finish = () => { if (done) return; done = true; resolve(); };
        const h = () => { map.removeEventListener('gmp-animationend', h); finish(); };
        map.addEventListener('gmp-animationend', h);
        try { map.flyCameraAround({ camera: cam, durationMillis: dur, repeatCount: rounds }); }
        catch (e) { console.warn('[Flyover] flyCameraAround fail:', e); finish(); return; }
        setTimeout(finish, dur + 600);
        return;
      }
      const totalDeg = rounds * 360;
      if (Math.abs(totalDeg) < 1) { setTimeout(resolve, dur); return; }
      const sHead = map.getHeading?.() ?? 0;
      const t0 = performance.now();
      const step = (now: number) => {
        if (abortRef.current) { resolve(); return; }
        const p = Math.min((now - t0) / dur, 1);
        try { map.moveCamera({ heading: sHead + totalDeg * p }); } catch {}
        if (p < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }, []);

  const waitForTiles = useCallback((maxMs = 1000): Promise<void> => {
    return new Promise(resolve => {
      const map = mapRef.current;
      if (!map || abortRef.current) { resolve(); return; }
      const max = maxMs / speedRef.current;
      if (modeRef.current === '3d') {
        let done = false;
        const finish = () => { if (done) return; done = true; resolve(); };
        const tid = setTimeout(finish, max);
        const onSteady = (e: any) => { if (e?.detail?.isSteady !== false) { map.removeEventListener('gmp-steadychange', onSteady); clearTimeout(tid); finish(); } };
        map.addEventListener('gmp-steadychange', onSteady);
        return;
      }
      const tid = setTimeout(resolve, max);
      google.maps.event.addListenerOnce(map, 'idle', () => { clearTimeout(tid); resolve(); });
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let dead = false;
    (async () => {
      const map2d = new google.maps.Map(containerRef.current!, {
        center: { lat: 48.0, lng: 67.0 }, zoom: 5, mapTypeId: 'hybrid',
        disableDefaultUI: true, gestureHandling: 'none', isFractionalZoomEnabled: true, tilt: 55, heading: 0,
      });
      mapRef.current = map2d; modeRef.current = '2d';
      await new Promise<void>(r => { const tid = setTimeout(r, 1500); google.maps.event.addListenerOnce(map2d, 'tilesloaded', () => { clearTimeout(tid); r(); }); });
      if (dead) return;
      setMapReady(true);
      try {
        if (typeof google?.maps?.importLibrary !== 'function') throw new Error('no importLibrary');
        const lib = await withTimeout(google.maps.importLibrary('maps3d') as Promise<any>, 3000, 'maps3d');
        if (dead) return;
        const { Map3DElement } = lib;
        if (!Map3DElement) throw new Error('no Map3DElement');
        const map3d = new Map3DElement();
        map3d.center = { lat: 48.0, lng: 67.0, altitude: 0 };
        map3d.range = 4000000; map3d.tilt = 45; map3d.heading = 0;
        map3d.style.cssText = 'width:100%;height:100%;display:block;position:absolute;top:0;left:0;';
        const healthy = await new Promise<boolean>(resolve => {
          let settled = false;
          const settle = (ok: boolean) => { if (settled) return; settled = true; resolve(ok); };
          const onSteady = (e: any) => { if (e?.detail?.isSteady || e?.isSteady) { map3d.removeEventListener('gmp-steadychange', onSteady); settle(true); } };
          map3d.addEventListener('gmp-steadychange', onSteady);
          containerRef.current!.appendChild(map3d);
          setTimeout(() => { if (!settled) { map3d.removeEventListener('gmp-steadychange', onSteady); try { containerRef.current?.removeChild(map3d); } catch {} settle(false); } }, 3000);
        });
        if (dead) return;
        if (healthy) { try { containerRef.current!.innerHTML = ''; } catch {} containerRef.current!.appendChild(map3d); mapRef.current = map3d; modeRef.current = '3d'; }
      } catch {}
    })();
    return () => { dead = true; };
  }, []);

  useEffect(() => {
    let dead = false;
    const abortCtrl = new AbortController();
    (async () => {
      const out: RouteStop[] = [];
      const keys = new Set<string>();
      const sorted = [...itinerary].sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time));
      const items = sorted.filter(i => i.location);
      const n = items.length;
      if (!n) { if (!dead) { setStops(FALLBACK_STOPS); setProgress(100); } return; }
      const pending: { idx: number; q: string }[] = [];
      const push = (lat: number, lng: number, it: ItineraryItem) => {
        const k = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (keys.has(k)) { lat += (Math.random() - 0.5) * 0.008; lng += (Math.random() - 0.5) * 0.008; }
        keys.add(`${lat.toFixed(4)},${lng.toFixed(4)}`);
        out.push({ lat, lng, title: it.activity, location: it.location, day: it.day, time: it.time, type: it.type, notes: (it.notes || '').replace(/\[coords:[^\]]*\]/, '').trim(), timeOfDay: getTimeOfDay(it.time), cost: it.cost });
      };
      for (let i = 0; i < n; i++) {
        if (dead) return;
        const it = items[i];
        const emb = parseEmbeddedCoords(it.notes || '');
        if (emb) { push(emb.lat, emb.lng, it); setProgress(((i + 1) / n) * 75); setLoadNames(p => [...p, it.activity]); continue; }
        const dir = parseCoordString(it.location);
        if (dir) { push(dir.lat, dir.lng, it); setProgress(((i + 1) / n) * 75); setLoadNames(p => [...p, it.activity]); continue; }
        const loc = it.location.toLowerCase();
        const pm = PLACES.find(p => { const e = p.name.en.toLowerCase(), r = p.name.ru.toLowerCase(), k = p.name.kz.toLowerCase(); return e === loc || r === loc || k === loc || loc.includes(e) || e.includes(loc) || loc.includes(r); });
        if (pm) { push(pm.lat, pm.lng, it); setProgress(((i + 1) / n) * 75); setLoadNames(p => [...p, it.activity]); continue; }
        pending.push({ idx: i, q: it.location || it.activity });
        out.push(null as any);
        setProgress(((i + 1) / n) * 65);
        setLoadNames(p => [...p, it.activity]);
      }
      if (pending.length && !dead) {
        const ft = setTimeout(() => abortCtrl.abort(), 6000);
        try {
          const r = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/geocode-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` }, body: JSON.stringify({ locations: pending.map(p => p.q) }), signal: abortCtrl.signal });
          clearTimeout(ft);
          const d = await r.json();
          if (d.results) {
            for (let j = 0; j < pending.length; j++) {
              if (dead) return;
              const { idx } = pending[j]; const it = items[idx]; const g = d.results[j];
              if (g?.lat != null && g?.lng != null) {
                const obj: RouteStop = { lat: g.lat, lng: g.lng, title: it.activity, location: it.location, day: it.day, time: it.time, type: it.type, notes: (it.notes || '').replace(/\[coords:[^\]]*\]/, '').trim(), timeOfDay: getTimeOfDay(it.time), cost: it.cost };
                const k = `${g.lat.toFixed(4)},${g.lng.toFixed(4)}`;
                if (keys.has(k)) { obj.lat += (Math.random() - 0.5) * 0.008; obj.lng += (Math.random() - 0.5) * 0.008; }
                keys.add(`${obj.lat.toFixed(4)},${obj.lng.toFixed(4)}`);
                out[idx] = obj;
              }
              setProgress(75 + ((j + 1) / pending.length) * 25);
            }
          }
        } catch (e: any) { clearTimeout(ft); console.warn('[Flyover] Geocode:', e.name === 'AbortError' ? 'timeout' : e.message); }
      }
      const resolved = out.filter(Boolean);
      if (!resolved.length) resolved.push(...FALLBACK_STOPS);
      if (!dead) { setProgress(100); setStops(resolved); }
    })();
    return () => { dead = true; abortCtrl.abort(); };
  }, [itinerary]);

  useEffect(() => { if (mapReady && stops.length > 0 && phase === 'loading') setPhase('ready'); }, [mapReady, stops, phase]);
  useEffect(() => {
    if (phase === 'ready' && autoPlay && !startedRef.current && stops.length) { startedRef.current = true; const id = setTimeout(() => startFlyover(0), 500); return () => clearTimeout(id); }
  }, [phase, stops, autoPlay]);

  const startFlyover = useCallback(async (fromIdx = 0) => {
    if (!mapRef.current || !stops.length) return;
    abortRef.current = false; setPlaying(true); setPhase('flying'); setDaySplash(null); setShowPin(false); setSvHasData(false); closeStreetViewPanel();
    if (fromIdx === 0) {
      setCurrentStop(null); setCurrentIdx(-1);
      const first = stops[0];
      await flyTo({ center: { lat: first.lat, lng: first.lng, altitude: 0 }, tilt: 55, heading: 0, range: zoomToRange(10) }, 1600);
      await waitForTiles(600);
    }
    let lastDay = fromIdx > 0 ? stops[fromIdx]?.day ?? -1 : -1;
    for (let i = fromIdx; i < stops.length; i++) {
      if (abortRef.current) { pausedAtRef.current = i; break; }
      const stop = stops[i]; const nextStop = i + 1 < stops.length ? stops[i + 1] : null;
      if (stop.day !== lastDay) {
        setShowPin(false); setSvHasData(false); closeStreetViewPanel();
        const dayStops = stops.filter(s => s.day === stop.day);
        setDaySplash({ day: stop.day, count: dayStops.length });
        await delay(1800 / speedRef.current);
        if (abortRef.current) { pausedAtRef.current = i; break; }
        setDaySplash(null); await delay(200 / speedRef.current); lastDay = stop.day;
      }
      if (abortRef.current) { pausedAtRef.current = i; break; }
      let heading = 0;
      if (nextStop) heading = google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(stop.lat, stop.lng), new google.maps.LatLng(nextStop.lat, nextStop.lng));
      else if (i > 0) heading = google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(stops[i - 1].lat, stops[i - 1].lng), new google.maps.LatLng(stop.lat, stop.lng));
      setShowPin(false); setSvHasData(false);
      let flightDur = 2200;
      if (i > 0) { const prev = stops[i - 1]; const dist = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(prev.lat, prev.lng), new google.maps.LatLng(stop.lat, stop.lng)); flightDur = Math.min(4500, Math.max(1800, dist / 60)); }
      await flyTo({ center: { lat: stop.lat, lng: stop.lng, altitude: 0 }, tilt: 60, heading, range: modeRef.current === '3d' ? 350 : zoomToRange(17) }, flightDur);
      if (abortRef.current) { pausedAtRef.current = i; break; }
      await waitForTiles(900);
      if (abortRef.current) { pausedAtRef.current = i; break; }
      setCurrentStop(stop); setCurrentIdx(i); setShowPin(true);
      showStreetView(stop.lat, stop.lng, heading);
      const holdDur = stop.notes ? 4200 : 3000;
      await flyAround({ center: { lat: stop.lat, lng: stop.lng, altitude: 0 }, tilt: 60, heading, range: modeRef.current === '3d' ? 350 : zoomToRange(17) }, holdDur, 0.06);
      if (abortRef.current) { pausedAtRef.current = i + 1; break; }
      if (nextStop && stop.day !== nextStop.day) { setShowPin(false); setSvHasData(false); await flyTo({ center: { lat: stop.lat, lng: stop.lng, altitude: 0 }, tilt: 45, heading: heading + 20, range: zoomToRange(13) }, 1000); }
    }
    if (!abortRef.current) {
      setShowPin(false); setSvHasData(false);
      const cLat = stops.reduce((s, p) => s + p.lat, 0) / stops.length;
      const cLng = stops.reduce((s, p) => s + p.lng, 0) / stops.length;
      const latSpan = Math.max(...stops.map(s => s.lat)) - Math.min(...stops.map(s => s.lat));
      const lngSpan = Math.max(...stops.map(s => s.lng)) - Math.min(...stops.map(s => s.lng));
      const finalRange = Math.max(Math.max(latSpan, lngSpan) * 111000 * 1.8, 50000);
      await flyTo({ center: { lat: cLat, lng: cLng, altitude: 0 }, tilt: 45, heading: 0, range: finalRange }, 2000);
      setPlaying(false); setPhase('done'); pausedAtRef.current = -1;
    }
  }, [stops, flyTo, flyAround, waitForTiles, showStreetView, closeStreetViewPanel]);

  const pauseFlyover = useCallback(() => { abortRef.current = true; setPlaying(false); setPhase('paused'); }, []);
  const resumeFlyover = useCallback(() => { closeStreetViewPanel(); const from = pausedAtRef.current; startFlyover(from >= 0 && from < stops.length ? from : 0); }, [stops, startFlyover, closeStreetViewPanel]);
  const resetFlyover = useCallback(() => { abortRef.current = true; setPlaying(false); setPhase('ready'); setCurrentStop(null); setCurrentIdx(-1); setDaySplash(null); setShowPin(false); setSvHasData(false); closeStreetViewPanel(); pausedAtRef.current = -1; startedRef.current = false; }, [closeStreetViewPanel]);

  const totalStops = stops.length;
  const uniqueDays = [...new Set(stops.map(s => s.day))].sort((a, b) => a - b);
  const svPanelActive = svOpen && (phase === 'paused' || phase === 'flying');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black">
      <div ref={containerRef} className="absolute inset-0" />

      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen progress={progress} stops={loadNames} t={t} />}
      </AnimatePresence>

      <AnimatePresence>
        {daySplash && <DaySplash day={daySplash.day} count={daySplash.count} t={t} />}
      </AnimatePresence>

      <AnimatePresence>
        {showPin && currentStop && (phase === 'flying' || phase === 'paused') && !daySplash && !svExpanded && (
          <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <LocationMarker name={currentStop.location} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={svContainerRef}
        className="absolute z-[42] bg-black transition-all duration-300 ease-out"
        style={{
          visibility: svPanelActive ? 'visible' : 'hidden',
          pointerEvents: svPanelActive ? 'auto' : 'none',
          ...(svExpanded ? { top: 0, right: 0, bottom: 0, width: '100%', height: '100%' } : { top: 64, right: 24, width: 300, height: 200 }),
        }}
      />
      <AnimatePresence>
        {svPanelActive && (
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute z-[43] pointer-events-none"
            style={svExpanded ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 64, right: 24, width: 300, height: 200 }}
          >
            <div className="absolute top-2 left-2 z-10 bg-black/80 border border-[#D4AF37]/30 px-2 py-0.5 flex items-center gap-1.5 pointer-events-none">
              <Eye className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/70">{t('flyover_street_view')}</span>
            </div>
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 pointer-events-auto">
              <button onClick={() => setSvExpanded(prev => !prev)} className="p-1.5 bg-black/70 hover:bg-black text-white/60 hover:text-white border border-white/10 transition-colors" title={svExpanded ? t('flyover_sv_minimize') : t('flyover_sv_expand')}>
                {svExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={closeStreetViewPanel} className="p-1.5 bg-black/70 hover:bg-black text-white/60 hover:text-white border border-white/10 transition-colors" title={t('flyover_sv_close')}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {!svExpanded && <div className="absolute inset-0 border border-white/15 pointer-events-none" />}
            {svExpanded && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/70 border border-white/10 px-3 py-1.5">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">{t('flyover_sv_hint')}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'paused' && !svExpanded && !svOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="bg-black/60 border border-white/10 px-4 py-2">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-wider">{t('flyover_explore_map')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute top-0 left-0 right-0 z-[60] flex items-start justify-between p-5 md:p-8 pointer-events-none">
        {(phase === 'flying' || phase === 'paused') ? (
          <div className="flex items-center gap-2.5">
            {playing && <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-red-500" />}
            {phase === 'paused' && <div className="w-1.5 h-1.5 bg-[#D4AF37]" />}
            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">
              {phase === 'paused' ? t('flyover_paused') : t('flyover_label')}
            </span>
            {currentStop && <span className="text-[#D4AF37]/50 text-[9px] font-mono uppercase tracking-wider">D{currentStop.day} · {currentStop.time}</span>}
            {speed > 1 && <span className="text-[#D4AF37]/40 text-[9px] font-black">{speed}x</span>}
          </div>
        ) : <div />}
        <button onClick={() => { abortRef.current = true; closeStreetViewPanel(); onClose(); }} className="pointer-events-auto p-2.5 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors border border-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {currentStop && (phase === 'flying' || phase === 'paused') && !daySplash && !svExpanded && (
          <StopCard stop={currentStop} index={currentIdx} total={totalStops} t={t} />
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-[55] pointer-events-none">
        <div className="flex items-end justify-between gap-4">
          <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
            {phase === 'ready' && (
              <button onClick={() => { startedRef.current = true; startFlyover(0); }} className="px-6 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors flex items-center gap-2">
                <Play className="w-3 h-3" /> {t('flyover_fly')}
              </button>
            )}
            {phase === 'flying' && playing && (
              <>
                <button onClick={pauseFlyover} className="px-5 py-3 bg-black/60 text-white/70 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors flex items-center gap-2 border border-white/10">
                  <Pause className="w-3 h-3" /> {t('flyover_pause')}
                </button>
                <SpeedSelector speed={speed} onChange={setSpeed} />
              </>
            )}
            {phase === 'paused' && (
              <>
                <button onClick={resumeFlyover} className="px-6 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors flex items-center gap-2">
                  <Play className="w-3 h-3" /> {t('flyover_resume')}
                </button>
                <button onClick={resetFlyover} className="px-4 py-3 bg-black/60 text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors flex items-center gap-2 border border-white/10">
                  <RotateCcw className="w-3 h-3" /> {t('flyover_reset')}
                </button>
                {svHasData && !svOpen && currentStop && (
                  <button onClick={() => showStreetView(currentStop.lat, currentStop.lng, svHeadingRef.current)} className="px-4 py-3 bg-black/60 text-[#D4AF37]/70 font-black uppercase tracking-widest text-[10px] hover:text-[#D4AF37] transition-colors flex items-center gap-2 border border-[#D4AF37]/20">
                    <Eye className="w-3 h-3" /> {t('flyover_street_view')}
                  </button>
                )}
                <SpeedSelector speed={speed} onChange={setSpeed} />
              </>
            )}
            {phase === 'done' && (
              <button onClick={() => startFlyover(0)} className="px-6 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors flex items-center gap-2">
                <Play className="w-3 h-3" /> {t('flyover_replay')}
              </button>
            )}
          </div>

          {stops.length > 0 && (phase === 'flying' || phase === 'paused') && !svExpanded && (
            <div className="flex items-center gap-2 pointer-events-none flex-shrink-0">
              {uniqueDays.map(day => {
                const ds = stops.filter(s => s.day === day);
                const fi = stops.indexOf(ds[0]);
                const li = stops.indexOf(ds[ds.length - 1]);
                const active = currentIdx >= fi && currentIdx <= li;
                const done = currentIdx > li;
                return (
                  <div key={day} className="flex items-center gap-1">
                    <span className={`text-[8px] font-black tracking-wider transition-colors duration-500 ${active ? 'text-[#D4AF37]' : done ? 'text-white/30' : 'text-white/10'}`}>{day}</span>
                    {ds.map((_, si) => (<div key={si} className={`w-1.5 h-1.5 transition-all duration-500 ${fi + si <= currentIdx ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="text-center text-white">
              <Mountain className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-50" />
              <div className="text-[9px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-1">{t('flyover_complete')}</div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{t('flyover_journey_mapped')}</h2>
              <p className="text-white/30 text-[11px] font-mono mt-2">{totalStops} {t('flyover_stops_label')} · {uniqueDays.length} {t('flyover_days_label')}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Loader = ({ apiKey, children }: { apiKey: string; children: React.ReactNode }) => {
  const { t } = useLanguage();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script', googleMapsApiKey: apiKey, libraries: LIBRARIES,
    preventGoogleFontsLoading: true, version: 'weekly',
  });

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-3 opacity-70">{t('flyover_title')}</div>
          <div className="w-32 h-px bg-white/10 mx-auto overflow-hidden">
            <div className="w-full h-full bg-[#D4AF37] animate-pulse" />
          </div>
          <div className="text-white/20 text-[9px] font-mono mt-3 uppercase tracking-widest">{t('flyover_loading_maps')}</div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export const TripRouteFlyover = (props: TripRouteFlyoverProps) => {
  const [apiKey, setApiKey] = useState('');
  const [ext] = useState(() => !!((window as any).google?.maps));

  useEffect(() => {
    if (ext) return;
    if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) { setApiKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY); return; }
    (async () => {
      try {
        const r = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/maps-config`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } });
        const d = await r.json();
        if (d.apiKey) setApiKey(d.apiKey);
      } catch (e) { console.error('[Flyover] Config fetch failed:', e); }
    })();
  }, [ext]);

  if (ext) return <FlyoverInner {...props} autoPlay={props.autoPlay !== false} />;
  if (!apiKey) return null;
  return <Loader apiKey={apiKey}><FlyoverInner {...props} autoPlay={props.autoPlay !== false} /></Loader>;
};