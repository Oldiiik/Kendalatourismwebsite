import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn' | null;
export type ThemeVariant = 'default' | 'dark' | 'vibrant' | 'monochrome';

interface SeasonTheme {
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
  cardBg: string;
  overlayBg: string;
  particles: 'snow' | 'petals' | 'leaves' | 'rain';
}

const seasonThemes: Record<Exclude<Season, null>, Record<ThemeVariant, SeasonTheme>> = {
  winter: {
    default: {
      primary: '#00B4D8',
      primaryForeground: '#FFFFFF',
      secondary: '#E5E7EB',
      accent: '#00B4D8',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#1A1A1A',
      cardBg: '#F9FAFB',
      overlayBg: 'rgba(255, 255, 255, 0.95)',
      particles: 'snow'
    },
    dark: { primary: '#00B4D8', primaryForeground: '#FFFFFF', secondary: '#2A3040', accent: '#00B4D8', background: '#1C1E26', text: '#E0E2E8', textLight: '#FFFFFF', cardBg: '#24262E', overlayBg: 'rgba(28, 30, 38, 0.96)', particles: 'snow' },
    vibrant: { primary: '#00B4D8', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#00B4D8', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'snow' },
    monochrome: { primary: '#00B4D8', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#00B4D8', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'snow' }
  },
  spring: {
    default: {
      primary: '#10B981',
      primaryForeground: '#FFFFFF',
      secondary: '#E5E7EB',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#1A1A1A',
      cardBg: '#F9FAFB',
      overlayBg: 'rgba(255, 255, 255, 0.95)',
      particles: 'petals'
    },
    dark: { primary: '#10B981', primaryForeground: '#FFFFFF', secondary: '#2A3040', accent: '#10B981', background: '#1C1E26', text: '#E0E2E8', textLight: '#FFFFFF', cardBg: '#24262E', overlayBg: 'rgba(28, 30, 38, 0.96)', particles: 'petals' },
    vibrant: { primary: '#10B981', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#10B981', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'petals' },
    monochrome: { primary: '#10B981', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#10B981', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'petals' }
  },
  summer: {
    default: {
      primary: '#F59E0B',
      primaryForeground: '#FFFFFF',
      secondary: '#E5E7EB',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#1A1A1A',
      cardBg: '#F9FAFB',
      overlayBg: 'rgba(255, 255, 255, 0.95)',
      particles: 'rain'
    },
    dark: { primary: '#F59E0B', primaryForeground: '#FFFFFF', secondary: '#2A3040', accent: '#F59E0B', background: '#1C1E26', text: '#E0E2E8', textLight: '#FFFFFF', cardBg: '#24262E', overlayBg: 'rgba(28, 30, 38, 0.96)', particles: 'rain' },
    vibrant: { primary: '#F59E0B', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#F59E0B', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'rain' },
    monochrome: { primary: '#F59E0B', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#F59E0B', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'rain' }
  },
  autumn: {
    default: {
      primary: '#D97706',
      primaryForeground: '#FFFFFF',
      secondary: '#E5E7EB',
      accent: '#D97706',
      background: '#FFFFFF',
      text: '#1A1A1A',
      textLight: '#1A1A1A',
      cardBg: '#F9FAFB',
      overlayBg: 'rgba(255, 255, 255, 0.95)',
      particles: 'leaves'
    },
    dark: { primary: '#D97706', primaryForeground: '#FFFFFF', secondary: '#2A3040', accent: '#D97706', background: '#1C1E26', text: '#E0E2E8', textLight: '#FFFFFF', cardBg: '#24262E', overlayBg: 'rgba(28, 30, 38, 0.96)', particles: 'leaves' },
    vibrant: { primary: '#D97706', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#D97706', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'leaves' },
    monochrome: { primary: '#D97706', primaryForeground: '#FFFFFF', secondary: '#E5E7EB', accent: '#D97706', background: '#FFFFFF', text: '#1A1A1A', textLight: '#1A1A1A', cardBg: '#F9FAFB', overlayBg: 'rgba(255, 255, 255, 0.95)', particles: 'leaves' }
  }
};

interface SeasonContextType {
  season: Season;
  setSeason: (season: Season) => void;
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  theme: SeasonTheme | null;
  vfxEnabled: boolean;
  setVfxEnabled: (enabled: boolean) => void;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [season, setSeasonState] = useState<Season>(() => {
    try {
      const saved = localStorage.getItem('kendala_season');
      if (saved && ['winter', 'spring', 'summer', 'autumn'].includes(saved)) {
        return saved as Exclude<Season, null>;
      }
    } catch {}
    return null;
  });
  const [themeVariant, setThemeVariantState] = useState<ThemeVariant>(() => {
    try {
      const saved = localStorage.getItem('kendala_theme_variant');
      if (saved && ['default', 'dark', 'vibrant', 'monochrome'].includes(saved)) {
        return saved as ThemeVariant;
      }
    } catch {}
    return 'default';
  });
  const [vfxEnabled, setVfxEnabled] = useState(true);

  const setSeason = (s: Season) => {
    setSeasonState(s);
    try {
      if (s) {
        localStorage.setItem('kendala_season', s);
      } else {
        localStorage.removeItem('kendala_season');
      }
    } catch {}
  };

  const setThemeVariant = (v: ThemeVariant) => {
    setThemeVariantState(v);
    try {
      localStorage.setItem('kendala_theme_variant', v);
    } catch {}
  };

  const theme = season ? seasonThemes[season][themeVariant] : null;

  React.useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--foreground', theme.text);
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--primary-foreground', theme.primaryForeground);
      root.style.setProperty('--secondary', theme.secondary);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--card', theme.cardBg);
      root.style.setProperty('--card-foreground', theme.text);
      
      if (themeVariant === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
      } else {
        root.classList.remove('dark');
        root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
      }
    }
  }, [theme, themeVariant]);

  return (
    <SeasonContext.Provider value={{ season, setSeason, themeVariant, setThemeVariant, theme, vfxEnabled, setVfxEnabled }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    return {
      season: null as Season,
      setSeason: (() => {}) as (season: Season) => void,
      themeVariant: 'default' as ThemeVariant,
      setThemeVariant: (() => {}) as (variant: ThemeVariant) => void,
      theme: null as SeasonTheme | null,
      vfxEnabled: true,
      setVfxEnabled: (() => {}) as (enabled: boolean) => void,
    };
  }
  return context;
};