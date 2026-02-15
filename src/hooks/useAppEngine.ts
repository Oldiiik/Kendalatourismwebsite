import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useGuestMigration } from './useGuestMigration';
import { useAppStore } from '../store/useAppStore';

export const useAppEngine = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const migrationStatus = useGuestMigration();
  const { hasCompletedRitual } = useAppStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       if (event === 'INITIAL_SESSION') {
         setIsAuthReady(true);
       }
    });

    supabase.auth.getSession().then(() => {
        setIsAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isReady = isAuthReady && !migrationStatus.isMigrating;

  return {
    isReady,
    isMigrating: migrationStatus.isMigrating,
    migrationError: migrationStatus.error,
    hasCompletedRitual
  };
};