import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Map as MapIcon, Calendar, MessageCircle, MapPin, Home, Backpack, Info, Music, Book, Sparkles, User, Globe, Compass, Users, Shield, Crown, Handshake, Building } from '../ui/icons';
import { KendalaLogo } from '../ui/KendalaLogo';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { usePremium } from '../../contexts/PremiumContext';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  labelKey: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  page: string;
  path: string;
  category?: 'function' | 'content';
}

interface VerticalSidebarProps {
  currentPage: string;
  onOpenGuide?: () => void;
}

// Snappy expo-out
const SNAP = [0.16, 1, 0.3, 1] as [number, number, number, number];
// Aggressive ease for exits
const SNAP_OUT = [0.4, 0, 1, 1] as [number, number, number, number];

export const VerticalSidebar = ({ currentPage, onOpenGuide }: VerticalSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isGuest } = useAuth();
  const { theme, season, setSeason } = useSeason();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { isPremium } = usePremium();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  if (!theme) return null;

  const dynamicMenuItems: MenuItem[] = [
    { labelKey: 'home', icon: Home, page: 'home', path: '/', category: 'function' },
    { labelKey: 'premium', icon: Crown, page: 'premium', path: '/premium', category: 'function' },
    { labelKey: 'planner', icon: Calendar, page: 'planner', path: '/planner', category: 'function' },
    { labelKey: 'ai', icon: MessageCircle, page: 'ai', path: '/ai', category: 'function' },
    { labelKey: 'map', icon: MapIcon, page: 'map', path: '/map', category: 'function' },
    { labelKey: 'tools', icon: Backpack, page: 'tools', path: '/tools', category: 'function' },
    (user || isGuest)
      ? { labelKey: 'profile', icon: User, page: 'profile', path: '/profile', category: 'function' }
      : { labelKey: 'login', icon: Compass, page: 'auth', path: '/auth', category: 'function' },

    { labelKey: 'regions', icon: Globe, page: 'regions', path: '/regions', category: 'content' },
    { labelKey: 'places', icon: MapPin, page: 'places', path: '/places', category: 'content' },
    { labelKey: 'tours', icon: Backpack, page: 'tours', path: '/tours', category: 'content' },
    { labelKey: 'stays', icon: Home, page: 'stays', path: '/stays', category: 'content' },
    { labelKey: 'culture', icon: Music, page: 'culture', path: '/culture', category: 'content' },
    { labelKey: 'history', icon: Book, page: 'history', path: '/history', category: 'content' },
    { labelKey: 'news', icon: Sparkles, page: 'news', path: '/news', category: 'content' },
  ];

  const businessItems: MenuItem[] = [
    { labelKey: 'partner_apply', icon: Handshake, page: 'partner', path: '/partner', category: 'function' },
  ];

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
    close();
  };

  const funcItems = dynamicMenuItems.filter(i => i.category === 'function');
  const contentItems = dynamicMenuItems.filter(i => i.category === 'content');

  return (
    <>
      {/* ── Toggle Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-0 z-50 p-4 md:p-6 border-l border-b group shadow-lg"
        style={{
          backgroundColor: theme.background,
          borderColor: `${theme.primary}20`,
          color: theme.primary
        }}
        whileHover={{
          backgroundColor: theme.primary,
          color: theme.primaryForeground,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15, ease: SNAP }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: SNAP }}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: SNAP }}
              className="flex flex-col gap-1.5 items-end"
            >
              <span className="w-6 md:w-8 h-0.5 bg-current group-hover:w-8 transition-all duration-150"></span>
              <span className="w-4 md:w-6 h-0.5 bg-current group-hover:w-8 transition-all duration-150"></span>
              <span className="w-2 md:w-4 h-0.5 bg-current group-hover:w-8 transition-all duration-150"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Overlay + Sidebar ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 z-40 backdrop-blur-sm"
              style={{ backgroundColor: `${theme.primary}08` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: SNAP }}
              onClick={close}
            />

            {/* ── Diagonal-wipe Panel ── */}
            <motion.div
              key="sidebar-panel"
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] z-40 shadow-2xl overflow-hidden" 
              style={{ backgroundColor: theme.background }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: SNAP }}
            >
              {/* Diagonal accent edge — the unique visual signature */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[2px] origin-top-left"
                style={{
                  background: `linear-gradient(to bottom, ${theme.primary}60, ${theme.primary}10, rgba(0,0,0,0))`,
                  transform: 'skewX(-3deg)',
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.25, delay: 0.08, ease: SNAP }}
              />

              <div className="flex flex-col h-full border-l relative" style={{ borderColor: `${theme.primary}08` }}>

                {/* ── Header ── */}
                <motion.div
                  className="p-6 md:p-12 pb-6 md:pb-8 border-b flex justify-between items-center shrink-0"
                  style={{ borderColor: `${theme.text}10` }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.22, ease: SNAP }}
                >
                  <button onClick={() => { navigate('/'); close(); }} className="flex items-center gap-4 hover:opacity-70 transition-opacity">
                    <KendalaLogo size={24} color={theme.primary} />
                    <h2 className="text-xl font-sans font-black tracking-tighter uppercase" style={{ color: theme.text }}>Kendala</h2>
                  </button>
                  <span className="text-[10px] font-sans font-black uppercase tracking-widest opacity-40" style={{ color: theme.text }}>
                    {t('menu') || 'MENU'}
                  </span>
                </motion.div>

                {/* ── Navigation ── */}
                <nav className="flex-1 overflow-y-auto no-scrollbar relative">
                  {/* Function section label */}
                  <motion.div
                    className="px-6 md:px-12 pt-6 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.18 }}
                  >
                    <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: theme.primary }}>
                      {t('nav_navigation')}
                    </span>
                  </motion.div>

                  {/* Function items — fast cascade with slide + icon reveal */}
                  {funcItems.map((item, index) => {
                    const isActive = currentPage === item.page;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.page}
                        onClick={() => handleMenuClick(item)}
                        className="w-full flex items-center gap-4 px-6 md:px-12 py-4 md:py-5 border-b group relative overflow-hidden"
                        style={{
                          borderColor: item.page === 'premium' ? '#D4AF3715' : `${theme.text}05`,
                          backgroundColor: item.page === 'premium' ? (isActive ? '#D4AF37' : '#D4AF3708') : (isActive ? theme.primary : 'rgba(0,0,0,0)'),
                          color: item.page === 'premium' ? (isActive ? '#1a1a1a' : '#D4AF37') : (isActive ? theme.primaryForeground : theme.text)
                        }}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 + index * 0.025, duration: 0.28, ease: SNAP }}
                        whileHover={{
                          backgroundColor: item.page === 'premium' ? '#D4AF3720' : (isActive ? theme.primary : `${theme.primary}10`),
                          color: item.page === 'premium' ? '#D4AF37' : (isActive ? theme.primaryForeground : theme.primary),
                          x: 6,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Slide-in icon */}
                        <motion.div
                          className="shrink-0 opacity-40"
                          initial={{ opacity: 0, scale: 0, rotate: -90 }}
                          animate={{ opacity: 0.4, scale: 1, rotate: 0 }}
                          transition={{ delay: 0.12 + index * 0.025, duration: 0.25, ease: SNAP }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span className="font-sans text-xl md:text-2xl uppercase tracking-tighter font-black flex-1 text-left">
                          {t(item.labelKey) || item.labelKey}
                          {item.page === 'premium' && isPremium && (
                            <span className="ml-2 text-[7px] tracking-[0.2em] px-1.5 py-0.5 align-middle" style={{ backgroundColor: '#D4AF37', color: '#1a1a1a' }}>ACTIVE</span>
                          )}
                        </span>
                        {isActive && (
                          <motion.div
                            className="w-1.5 h-4 rounded-full"
                            style={{ backgroundColor: item.page === 'premium' ? '#D4AF37' : (isActive ? theme.primaryForeground : theme.primary) }}
                            layoutId="sidebar-active-indicator"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                        {/* Hover arrow */}
                        <motion.span
                          className="text-xs font-black absolute right-6 md:right-12 opacity-0 group-hover:opacity-60 transition-opacity duration-150"
                        >
                          →
                        </motion.span>
                      </motion.button>
                    );
                  })}

                  {/* Content section label */}
                  <motion.div
                    className="px-6 md:px-12 pt-6 md:pt-8 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.18 }}
                  >
                    <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: theme.text }}>{t('explore') || 'EXPLORE'}</span>
                  </motion.div>

                  {/* Content items — staggered with different reveal direction */}
                  {contentItems.map((item, index) => {
                    const isActive = currentPage === item.page;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.page}
                        onClick={() => handleMenuClick(item)}
                        className="w-full flex items-center gap-4 px-6 md:px-12 py-3.5 md:py-4 border-b group relative overflow-hidden"
                        style={{
                          borderColor: `${theme.text}05`,
                          backgroundColor: isActive ? `${theme.primary}10` : 'rgba(0,0,0,0)',
                          color: theme.text
                        }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16 + index * 0.02, duration: 0.25, ease: SNAP }}
                        whileHover={{
                          backgroundColor: `${theme.primary}08`,
                          x: 8,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="shrink-0 opacity-30"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 0.3, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.02, duration: 0.2, ease: SNAP }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </motion.div>
                        <span className="font-sans text-lg md:text-xl uppercase tracking-tighter font-black flex-1 text-left">
                          {t(item.labelKey) || item.labelKey}
                        </span>
                        {isActive && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: theme.primary }}
                            layoutId="sidebar-active-dot"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Business section label */}
                  <motion.div
                    className="px-6 md:px-12 pt-6 md:pt-8 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.18 }}
                  >
                    <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: theme.primary }}>
                      {t('nav_for_business')}
                    </span>
                  </motion.div>

                  {businessItems.map((item, index) => {
                    const isActive = currentPage === item.page;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.page}
                        onClick={() => handleMenuClick(item)}
                        className="w-full flex items-center gap-4 px-6 md:px-12 py-3.5 md:py-4 border-b group relative overflow-hidden"
                        style={{
                          borderColor: `${theme.text}05`,
                          backgroundColor: isActive ? `${theme.primary}10` : 'rgba(0,0,0,0)',
                          color: theme.text
                        }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.32 + index * 0.02, duration: 0.25, ease: SNAP }}
                        whileHover={{
                          backgroundColor: `${theme.primary}08`,
                          x: 8,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="shrink-0 opacity-30"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 0.3, y: 0 }}
                          transition={{ delay: 0.34 + index * 0.02, duration: 0.2, ease: SNAP }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </motion.div>
                        <span className="font-sans text-lg md:text-xl uppercase tracking-tighter font-black flex-1 text-left">
                          {t('partner_apply')}
                        </span>
                        {isActive && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: theme.primary }}
                            layoutId="sidebar-active-biz-dot"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Admin Link */}
                  {isAdmin && (
                    <>
                      <motion.div
                        className="px-6 md:px-12 pt-6 md:pt-8 pb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.18 }}
                      >
                        <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: '#EF4444' }}>
                          {t('nav_admin')}
                        </span>
                      </motion.div>
                      <motion.button
                        onClick={() => { navigate('/admin'); close(); }}
                        className="w-full flex items-center justify-between px-6 md:px-12 py-4 md:py-5 border-b group"
                        style={{
                          borderColor: `${theme.text}05`,
                          backgroundColor: currentPage === 'admin' ? '#EF444415' : 'rgba(0,0,0,0)',
                          color: theme.text
                        }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.38, duration: 0.25, ease: SNAP }}
                        whileHover={{
                          backgroundColor: '#EF444410',
                          x: 4,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-sans text-xl md:text-2xl uppercase tracking-tighter font-black flex items-center gap-3">
                          <Shield className="w-5 h-5" style={{ color: '#EF4444' }} />
                          {t('nav_admin_command')}
                        </span>
                        {currentPage === 'admin' && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                        )}
                      </motion.button>
                    </>
                  )}
                </nav>

                {/* ── Season Switcher Footer ── */}
                <motion.div
                  className="p-6 md:p-12 border-t shrink-0"
                  style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.primary}05` }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.28, ease: SNAP }}
                >
                  <button
                    onClick={() => {
                      setSeason(null);
                      close();
                    }}
                    className="w-full flex justify-between items-end group"
                  >
                    <div className="text-left">
                      <span className="block text-xs font-sans font-black uppercase tracking-widest opacity-50 mb-2 group-hover:opacity-100 transition-opacity duration-150" style={{ color: theme.text }}>
                        {t('change_season') || 'CHANGE SEASON'}
                      </span>
                      <span className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter transition-all duration-200" style={{ color: theme.primary }}>
                        {season ? t(season) : ''}
                      </span>
                    </div>
                    <div className="p-2 md:p-3 border group-hover:rotate-180 transition-transform duration-300 shadow-sm" style={{ borderColor: theme.primary, backgroundColor: theme.background }}>
                      <Compass className="w-4 h-4" style={{ color: theme.primary }} />
                    </div>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};