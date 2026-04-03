import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface PremiumPlan {
  id: 'free' | 'premium';
  name: string;
  price: number;
  aiMessagesPerDay: number;       // free=10, premium=unlimited (-1)
  maxTrips: number;               // free=3, premium=unlimited (-1)
  offlinePdfExport: boolean;
  hiddenGemsAccess: boolean;
  advancedWeather: boolean;
  prioritySOS: boolean;
  smartPackingAI: boolean;
  tripAnalytics: boolean;
  adFree: boolean;
  aiAutoTrip: boolean;
  exclusiveThemes: boolean;
  earlyAccess: boolean;
}

export const FREE_PLAN: PremiumPlan = {
  id: 'free',
  name: 'Explorer',
  price: 0,
  aiMessagesPerDay: 10,
  maxTrips: 3,
  offlinePdfExport: false,
  hiddenGemsAccess: false,
  advancedWeather: false,
  prioritySOS: false,
  smartPackingAI: false,
  tripAnalytics: false,
  adFree: false,
  aiAutoTrip: false,
  exclusiveThemes: false,
  earlyAccess: false,
};

export const PREMIUM_PLAN: PremiumPlan = {
  id: 'premium',
  name: 'Nomad',
  price: 20,
  aiMessagesPerDay: -1, // unlimited
  maxTrips: -1,
  offlinePdfExport: true,
  hiddenGemsAccess: true,
  advancedWeather: true,
  prioritySOS: true,
  smartPackingAI: true,
  tripAnalytics: true,
  adFree: true,
  aiAutoTrip: true,
  exclusiveThemes: true,
  earlyAccess: true,
};

interface PremiumContextType {
  isPremium: boolean;
  plan: PremiumPlan;
  activate: () => void;
  deactivate: () => void;
  aiMessagesUsedToday: number;
  incrementAIMessages: () => boolean; // returns false if limit hit
  canUseFeature: (feature: keyof PremiumPlan) => boolean;
  tripsCreated: number;
  incrementTrips: () => boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

const STORAGE_KEY = 'kendala_premium';
const AI_MSG_KEY = 'kendala_ai_msgs';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getAIMessages(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem(AI_MSG_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === getTodayKey()) return data;
    }
  } catch {}
  return { date: getTodayKey(), count: 0 };
}

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  // Temporary: force premium to true for all users while subscription is not in full mode
  const [isPremium, setIsPremium] = useState(true);
  const [aiMsgs, setAiMsgs] = useState(() => getAIMessages());
  const [tripsCreated, setTripsCreated] = useState(() => {
    try { return parseInt(localStorage.getItem('kendala_trips_count') || '0', 10); } catch { return 0; }
  });

  const plan = isPremium ? PREMIUM_PLAN : FREE_PLAN;

  const activate = useCallback(() => {
    setIsPremium(true);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  }, []);

  const deactivate = useCallback(() => {
    setIsPremium(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const incrementAIMessages = useCallback((): boolean => {
    // All features free — no limits
    return true;
  }, []);

  const incrementTrips = useCallback((): boolean => {
    // All features free — no limits
    return true;
  }, []);

  const canUseFeature = useCallback((feature: keyof PremiumPlan): boolean => {
    // All features free — everything enabled
    return true;
  }, []);

  return (
    <PremiumContext.Provider value={{
      isPremium,
      plan,
      activate,
      deactivate,
      aiMessagesUsedToday: aiMsgs.count,
      incrementAIMessages,
      canUseFeature,
      tripsCreated,
      incrementTrips,
    }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) throw new Error('usePremium must be used within PremiumProvider');
  return context;
};