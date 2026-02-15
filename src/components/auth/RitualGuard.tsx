import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SeasonSelection } from '../pages/SeasonSelection';
import { LanguageSelection } from '../LanguageSelection';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface RitualGuardProps {
  children: React.ReactNode;
}

export const RitualGuard = ({ children }: RitualGuardProps) => {
  const { hasCompletedRitual, language, season, setLanguage, setSeason, setRitualCompleted } = useAppStore();
  const { setSeason: setContextSeason } = useSeason();
  const { setLanguage: setContextLanguage } = useLanguage();

  useEffect(() => {
    if (language) setContextLanguage(language);
    if (season) setContextSeason(season);
  }, [language, season, setContextLanguage, setContextSeason]);

  if (!language) {
    return (
        <LanguageSelection onSelect={(lang) => setLanguage(lang)} />
    );
  }

  if (!season) {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/' && currentPath !== '/home' && !sessionStorage.getItem('pre_ritual_path')) {
        sessionStorage.setItem('pre_ritual_path', currentPath);
    }

    return (
      <SeasonSelection onSeasonSelect={(s) => {
        if (s) {
            setSeason(s);
            setRitualCompleted(true);
            
            const savedPath = sessionStorage.getItem('pre_ritual_path');
            if (savedPath) {
                sessionStorage.removeItem('pre_ritual_path');
                window.history.pushState(null, '', savedPath); 
            }
        }
      }} />
    );
  }

  return <>{children}</>;
};
