import React, { useState, useEffect } from 'react';
import { SeasonProvider, useSeason, Season } from './contexts/SeasonContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TripProvider } from './contexts/TripContext';
import { SeasonalParticles } from './components/effects/SeasonalParticles';
import { VerticalSidebar } from './components/navigation/VerticalSidebar';
import { SeasonSelection } from './components/pages/SeasonSelection';
import { LanguageSelection } from './components/LanguageSelection';
import { GlobalPreloader } from './components/ui/GlobalPreloader';
import { HomePage } from './components/pages/HomePage';
import { PlacesPage } from './components/pages/PlacesPage';
import { ToursPage } from './components/pages/ToursPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { RegionsPage } from './components/pages/RegionsPage';
import { InteractiveMapPage } from './components/pages/InteractiveMapPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { CulturePage } from './components/pages/CulturePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { NewsPage } from './components/pages/NewsPage';
import { ToolsPage } from './components/pages/ToolsPage';
import { StaysPage } from './components/pages/StaysPage';
import { TripPlannerPage } from './components/pages/TripPlannerPage';
import { AuthPage } from './components/pages/AuthPage';
import { UserGuide } from './components/ui/UserGuide';
import { AnimatePresence, motion } from 'motion/react';
import { useImagePreconnect } from './utils/useImagePreconnect';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { User } from '@supabase/supabase-js';
import { Toaster } from 'sonner@2.0.3';
import { Leaf, Mountain, Wind, Sun, Loader } from './components/ui/icons';

type Page = 'home' | 'places' | 'tours' | 'map' | 'ai' | 'culture' | 'history' | 'news' | 'profile' | 'regions' | 'tools' | 'stays' | 'planner' | 'auth';

function AppContent() {
  const { season, setSeason, theme, themeVariant, setThemeVariant } = useSeason();
  const { language, setLanguage } = useLanguage();
  const [languageSelected, setLanguageSelected] = useState(() => {
    try {
      return !!localStorage.getItem('language');
    } catch { return false; }
  });
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
      if (session?.user) {
        setCurrentPage('planner');
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
  }, []);

  const loadUserPreferences = async (accessToken: string | undefined) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/preferences`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': accessToken,
        },
      });
      if (res.ok) {
        const prefs = await res.json();
        if (prefs.language && ['kz', 'ru', 'en'].includes(prefs.language)) {
          setLanguage(prefs.language);
        }
        if (prefs.season && ['winter', 'spring', 'summer', 'autumn'].includes(prefs.season)) {
          setSeason(prefs.season);
        }
        if (prefs.themeVariant && ['default', 'dark', 'vibrant', 'monochrome'].includes(prefs.themeVariant)) {
          setThemeVariant(prefs.themeVariant);
        }
        console.log('User preferences loaded from DB:', prefs);
      }
    } catch (e) {
      console.error('Failed to load user preferences:', e);
    }
  };

  const saveUserPreferences = async (prefs: { language?: string; season?: string; themeVariant?: string }) => {
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
  };

  useImagePreconnect(season || undefined);

  const handleLanguageSelect = () => {
    setLanguageSelected(true);
    saveUserPreferences({ language });
    setCurrentPage('home');
  };

  const handleSeasonSelectWithAuth = (selectedSeason: Exclude<Season, null>) => {
    setSeason(selectedSeason);
    saveUserPreferences({ season: selectedSeason });
    setCurrentPage('home');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('planner');
  };

  const handleNavigate = (page: string) => {
    if (!user && page !== 'home' && page !== 'auth') {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={handleNavigate} />;
      case 'places': return <PlacesPage onNavigate={handleNavigate} />;
      case 'regions': return <RegionsPage onNavigate={handleNavigate} />;
      case 'tours': return <ToursPage onNavigate={handleNavigate} />;
      case 'map': return <InteractiveMapPage onNavigate={handleNavigate} />;
      case 'ai': return <AIAssistantPage onNavigate={handleNavigate} />;
      case 'culture': return <CulturePage />;
      case 'history': return <HistoryPage />;
      case 'news': return <NewsPage />;
      case 'profile': return <ProfilePage onNavigate={handleNavigate} />;
      case 'tools': return <ToolsPage />;
      case 'stays': return <StaysPage onNavigate={handleNavigate} />;
      case 'planner': return <TripPlannerPage />;
      case 'auth': return <AuthPage onNavigate={handleNavigate} onSuccess={() => setCurrentPage('planner')} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const getMainContent = () => {
    if (!languageSelected) {
      return <LanguageSelection onSelect={handleLanguageSelect} />;
    }

    if (!season || !theme) {
      return <SeasonSelection onSeasonSelect={handleSeasonSelectWithAuth} />;
    }

    if (!authChecked && currentPage !== 'home') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-8 h-[2px] bg-black/20 mx-auto mb-4 overflow-hidden">
              <div className="w-full h-full bg-black animate-pulse" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-medium">Authenticating...</p>
          </div>
        </div>
      );
    }
    
    if (!user && currentPage !== 'home' && currentPage !== 'auth') {
      return <AuthPage onSuccess={handleAuthSuccess} onNavigate={handleNavigate} />;
    }

    return (
      <div className="relative min-h-screen overflow-x-hidden transition-colors duration-1000 font-sans" style={{ backgroundColor: theme.background, color: theme.text }}>
        <UserGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
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
        {currentPage !== 'home' && <VerticalSidebar currentPage={currentPage} onNavigate={handleNavigate} onOpenGuide={() => setShowGuide(true)} />}
        <main className="relative">
          <AnimatePresence mode="wait">
              <motion.div
                  key={currentPage}
                  className="min-h-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                  {renderPage()}
              </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!appReady && (
          <GlobalPreloader key="preloader" onComplete={() => setAppReady(true)} />
        )}
      </AnimatePresence>
      {appReady && getMainContent()}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
        <SeasonProvider>
          <NotificationProvider>
            <TripProvider>
              <AppContent />
            </TripProvider>
          </NotificationProvider>
        </SeasonProvider>
    </LanguageProvider>
  );
}