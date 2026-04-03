import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { User } from '@supabase/supabase-js';
import { useLanguage } from './LanguageContext';
import { useSeason } from './SeasonContext';

interface AuthContextType {
  user: User | null;
  authChecked: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  saveUserPreferences: (prefs: { language?: string; season?: string; themeVariant?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_DEFAULT: AuthContextType = {
  user: null,
  authChecked: false,
  isGuest: false,
  signOut: async () => {},
  signInAsGuest: () => {},
  saveUserPreferences: async () => {},
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const { setLanguage } = useLanguage();
  const { setSeason, setThemeVariant } = useSeason();

  const loadUserPreferences = useCallback(async (accessToken: string | undefined) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': accessToken,
        },
      });
      if (res.ok) {
        const prefs = await res.json().catch(() => null);
        if (!prefs) return;
        if (prefs.language && ['kz', 'ru', 'en'].includes(prefs.language)) {
          setLanguage(prefs.language);
        }
        if (prefs.season && ['winter', 'spring', 'summer', 'autumn'].includes(prefs.season)) {
          setSeason(prefs.season);
        }
        if (prefs.themeVariant && ['default', 'dark', 'vibrant', 'monochrome'].includes(prefs.themeVariant)) {
          setThemeVariant(prefs.themeVariant);
        }
      }
    } catch (e) {
      console.error('Failed to load user preferences:', e);
    }
  }, [setLanguage, setSeason, setThemeVariant]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
      if (session?.user) {
        loadUserPreferences(session.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
      if (session?.user && _event === 'SIGNED_IN') {
        loadUserPreferences(session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserPreferences]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsGuest(false);
  }, []);

  const signInAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  const saveUserPreferences = useCallback(async (prefs: { language?: string; season?: string; themeVariant?: string }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': session.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prefs),
      });
    } catch (e) {
      console.error('Failed to save user preferences:', e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, authChecked, isGuest, signOut, signInAsGuest, saveUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context ?? AUTH_DEFAULT;
};