import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { AlertTriangle, X, MapPin, Clock, Phone, Shield, CheckCircle, Radio } from '../ui/icons';
import { toast } from 'sonner@2.0.3';

interface SOSRecord {
  id: string;
  timestamp: string;
  lat: number | null;
  lng: number | null;
  locationName: string;
  status: 'active' | 'resolved';
  emergencyContact: string;
  checkinInterval: number | null;
  lastCheckin: string | null;
}

export const SOSButton = () => {
  const { theme } = useSeason();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [checkinHours, setCheckinHours] = useState(4);
  const [activeAlert, setActiveAlert] = useState<SOSRecord | null>(null);
  const [sending, setSending] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);
  const checkinTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const labels: Record<string, Record<string, string>> = {
    en: {
      sos: 'SOS',
      title: 'Emergency Beacon',
      subtitle: 'Transmit your GPS position and alert your emergency contact',
      location: 'Current Position',
      detecting: 'Detecting GPS...',
      contact: 'Emergency Contact',
      contactPlaceholder: 'Phone or email',
      checkin: 'Auto check-in interval',
      hours: 'hours',
      activate: 'ACTIVATE BEACON',
      activating: 'TRANSMITTING...',
      active: 'BEACON ACTIVE',
      deactivate: 'DEACTIVATE',
      checkinNow: 'CHECK IN NOW',
      lastCheckin: 'Last check-in',
      warning: 'Your GPS coordinates will be stored securely. If you miss a check-in, your emergency contact will be alerted.',
      activated: 'Emergency beacon activated',
      deactivated: 'Beacon deactivated',
      checkedIn: 'Check-in recorded',
      noGps: 'Cannot detect GPS position',
    },
    ru: {
      sos: 'SOS',
      title: 'Аварийный маяк',
      subtitle: 'Передайте свои GPS-координаты и оповестите экстренный контакт',
      location: 'Текущая позиция',
      detecting: 'Определение GPS...',
      contact: 'Экстренный контакт',
      contactPlaceholder: 'Телефон или email',
      checkin: 'Интервал проверки',
      hours: 'ч.',
      activate: 'АКТИВИРОВАТЬ МАЯК',
      activating: 'ПЕРЕДАЧА...',
      active: 'МАЯК АКТИВЕН',
      deactivate: 'ДЕАКТИВИРОВАТЬ',
      checkinNow: 'ОТМЕТИТЬСЯ',
      lastCheckin: 'Последняя проверка',
      warning: 'Ваши GPS-координаты будут храниться безопасно. Если вы пропустите проверку, ваш экстренный контакт будет оповещен.',
      activated: 'Аварийный маяк активирован',
      deactivated: 'Маяк деактивирован',
      checkedIn: 'Проверка записана',
      noGps: 'Невозможно определить GPS',
    },
    kz: {
      sos: 'SOS',
      title: 'Апаттық маяк',
      subtitle: 'GPS координаттарыңызды жіберіп, шұғыл байланыс контактіңізді хабарландырыңыз',
      location: 'Ағымдағы орын',
      detecting: 'GPS анықтауда...',
      contact: 'Шұғыл байланыс',
      contactPlaceholder: 'Телефон немесе email',
      checkin: 'Тексеру аралығы',
      hours: 'сағ.',
      activate: 'МАЯКТЫ ҚОСУ',
      activating: 'ЖІБЕРІЛУДЕ...',
      active: 'МАЯК БЕЛСЕНДІ',
      deactivate: 'СӨНДІРУ',
      checkinNow: 'ТЕКСЕРУ',
      lastCheckin: 'Соңғы тексеру',
      warning: 'GPS координаттарыңыз қауіпсіз сақталады. Тексеруді жіберіп алсаңыз, шұғыл байланыс хабарландырылады.',
      activated: 'Апаттық маяк қосылды',
      deactivated: 'Маяк сөндірілді',
      checkedIn: 'Тексеру жазылды',
      noGps: 'GPS анықтау мүмкін емес',
    },
  };

  const l = labels[language] || labels.en;

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadActiveAlert();
    loadEmergencyContact();
  }, [user]);

  const loadActiveAlert = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/sos`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
        },
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.status === 'active') {
          setActiveAlert(data);
          setLastCheckin(data.lastCheckin);
        }
      }
    } catch (e) {}
  };

  const loadEmergencyContact = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/profile`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
        },
      });
      if (res.ok) {
        const profile = await res.json().catch(() => null);
        if (profile && profile.emergencyContact) {
          setEmergencyContact(profile.emergencyContact);
        }
      }
    } catch (e) {}
  };

  const activateBeacon = async () => {
    if (!coords) {
      toast.error(l.noGps);
      return;
    }
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/sos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: coords.lat,
          lng: coords.lng,
          emergencyContact,
          checkinInterval: checkinHours,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.alert) {
          setActiveAlert(data.alert);
          setLastCheckin(new Date().toISOString());
          toast.success(l.activated);
        }
      }
    } catch (e) {
      console.error('SOS activate error:', e);
    } finally {
      setSending(false);
    }
  };

  const deactivateBeacon = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/sos`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
        },
      });

      setActiveAlert(null);
      setLastCheckin(null);
      toast.info(l.deactivated);
    } catch (e) {
      console.error('SOS deactivate error:', e);
    }
  };

  const checkIn = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/sos/checkin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: coords?.lat,
          lng: coords?.lng,
        }),
      });

      setLastCheckin(new Date().toISOString());
      toast.success(l.checkedIn);
    } catch (e) {
      console.error('Check-in error:', e);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!theme) return null;

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          activeAlert ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: activeAlert ? '#EF4444' : theme.primary,
          color: activeAlert ? '#FFF' : theme.primaryForeground,
        }}
      >
        {activeAlert ? (
          <Radio className="w-6 h-6" />
        ) : (
          <Shield className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-lg shadow-2xl border overflow-hidden"
            style={{
              backgroundColor: theme.cardBg || theme.background,
              borderColor: `${theme.primary}20`,
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: `${theme.primary}20` }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: activeAlert ? '#EF4444' : theme.primary }} />
                <span className="text-xs uppercase tracking-widest font-black" style={{ color: theme.text }}>
                  {l.title}
                </span>
              </div>
              <button onClick={() => setIsExpanded(false)}>
                <X className="w-4 h-4" style={{ color: theme.text }} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-[10px] uppercase tracking-wider opacity-60" style={{ color: theme.text }}>
                {l.subtitle}
              </p>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-black opacity-40" style={{ color: theme.text }}>
                  {l.location}
                </label>
                <div className="flex items-center gap-2 p-2 rounded border" style={{ borderColor: `${theme.primary}15`, backgroundColor: `${theme.primary}05` }}>
                  <MapPin className="w-3 h-3" style={{ color: theme.primary }} />
                  <span className="text-xs font-mono" style={{ color: theme.text }}>
                    {coords
                      ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                      : l.detecting
                    }
                  </span>
                </div>
              </div>

              {!activeAlert ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-black opacity-40" style={{ color: theme.text }}>
                      {l.contact}
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder={l.contactPlaceholder}
                      className="w-full p-2 rounded border text-xs bg-transparent outline-none"
                      style={{ borderColor: `${theme.primary}20`, color: theme.text }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-black opacity-40" style={{ color: theme.text }}>
                      {l.checkin}
                    </label>
                    <div className="flex items-center gap-2">
                      {[2, 4, 8, 12].map((h) => (
                        <button
                          key={h}
                          onClick={() => setCheckinHours(h)}
                          className="px-2 py-1 rounded text-[10px] font-black uppercase border transition-colors"
                          style={{
                            borderColor: checkinHours === h ? theme.primary : `${theme.primary}20`,
                            backgroundColor: checkinHours === h ? theme.primary : 'transparent',
                            color: checkinHours === h ? theme.primaryForeground : theme.text,
                          }}
                        >
                          {h}{l.hours}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] opacity-40 leading-relaxed" style={{ color: theme.text }}>
                    {l.warning}
                  </p>

                  <button
                    onClick={activateBeacon}
                    disabled={sending || !coords}
                    className="w-full py-3 rounded text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40"
                    style={{
                      backgroundColor: '#EF4444',
                      color: '#FFF',
                    }}
                  >
                    {sending ? l.activating : l.activate}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 rounded border border-red-500/20 bg-red-500/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-red-500">
                        {l.active}
                      </span>
                    </div>
                    {lastCheckin && (
                      <div className="flex items-center gap-1 text-[10px] opacity-60" style={{ color: theme.text }}>
                        <Clock className="w-3 h-3" />
                        {l.lastCheckin}: {formatTime(lastCheckin)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={checkIn}
                    className="w-full py-3 rounded text-xs font-black uppercase tracking-widest transition-all"
                    style={{
                      backgroundColor: theme.primary,
                      color: theme.primaryForeground,
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {l.checkinNow}
                    </div>
                  </button>

                  <button
                    onClick={deactivateBeacon}
                    className="w-full py-2 rounded text-[10px] font-black uppercase tracking-widest border transition-all opacity-60 hover:opacity-100"
                    style={{
                      borderColor: `${theme.text}20`,
                      color: theme.text,
                    }}
                  >
                    {l.deactivate}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};