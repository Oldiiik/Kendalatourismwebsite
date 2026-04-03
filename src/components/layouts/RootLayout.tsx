import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useSeason, Season } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { VerticalSidebar } from '../navigation/VerticalSidebar';
import { SeasonSelection } from '../pages/SeasonSelection';
import { LanguageSelection } from '../LanguageSelection';
import { GlobalPreloader } from '../ui/GlobalPreloader';
import { AnimatePresence, motion } from 'motion/react';
import { useImagePreconnect } from '../../utils/useImagePreconnect';
import { Toaster } from 'sonner@2.0.3';
import { Leaf, Mountain, Wind, Sun, Loader } from '../ui/icons';
import { pathToPage } from '../../hooks/useAppNavigate';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const RootLayout = () => {
  const { season, setSeason, theme, themeVariant } = useSeason();
  const { language } = useLanguage();
  const { user, saveUserPreferences } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [languageSelected, setLanguageSelected] = useState(() => {
    try {
      return !!localStorage.getItem('language');
    } catch { return false; }
  });
  const [appReady, setAppReady] = useState(false);

  useImagePreconnect(season || undefined);

  const currentPage = pathToPage(location.pathname);

  // Scroll to top on route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (user && location.pathname === '/auth') {
      navigate('/planner', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const handleLanguageSelect = () => {
    setLanguageSelected(true);
    saveUserPreferences({ language });
  };

  const handleSeasonSelect = (selectedSeason: Exclude<Season, null>) => {
    setSeason(selectedSeason);
    saveUserPreferences({ season: selectedSeason });
  };

  if (!appReady) {
    return (
      <AnimatePresence mode="wait">
        <GlobalPreloader key="preloader" onComplete={() => setAppReady(true)} />
      </AnimatePresence>
    );
  }

  if (!languageSelected) {
    return <LanguageSelection onSelect={handleLanguageSelect} />;
  }

  if (!season || !theme) {
    return <SeasonSelection onSeasonSelect={handleSeasonSelect} />;
  }

  return (
    <ErrorBoundary>
      <div
        className="relative min-h-screen overflow-x-hidden transition-colors duration-1000 font-sans"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <Toaster
          position="bottom-center"
          expand={false}
          theme={themeVariant === 'dark' ? 'dark' : 'light'}
          toastOptions={{
            style: {
              background: themeVariant === 'dark' ? 'rgba(29, 27, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              color: theme.text,
              border: `1px solid ${theme.primary}20`,
              borderRadius: '2px',
              padding: '16px 20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              fontFamily: 'inherit',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(10px)',
            },
            className: 'font-sans'
          }}
          icons={{
            success: <Leaf className="w-4 h-4 text-emerald-500 mr-2" />,
            info: <Wind className="w-4 h-4 text-sky-500 mr-2" />,
            warning: <Sun className="w-4 h-4 text-amber-500 mr-2" />,
            error: <Mountain className="w-4 h-4 text-rose-500 mr-2" />,
            loading: <Loader className="w-4 h-4 text-current opacity-50 animate-spin mr-2" />,
          }}
        />

        {currentPage !== 'home' && (
          <VerticalSidebar
            currentPage={currentPage}
          />
        )}

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
};