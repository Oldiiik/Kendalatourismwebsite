import React, { useState, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabase/client';
import { Menu, X, Map as MapIcon, Calendar, MessageCircle, MapPin, Home, Backpack, Info, Music, Book, Sparkles, User, Globe, RefreshCw, LogIn, Compass, Wind } from '../ui/icons';
import { KendalaLogo } from '../ui/KendalaLogo';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MenuItem {
  labelKey: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  page: string;
  category?: 'function' | 'content';
  authOnly?: boolean;
}

interface VerticalSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenGuide?: () => void;
}

export const VerticalSidebar = ({ currentPage, onNavigate, onOpenGuide }: VerticalSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { theme, season, setSeason } = useSeason();
  const { t, language } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!theme) return null;

  const dynamicMenuItems: MenuItem[] = [
    { labelKey: 'planner', icon: Calendar, page: 'planner', category: 'function' },
    { labelKey: 'ai', icon: MessageCircle, page: 'ai', category: 'function' },
    { labelKey: 'map', icon: MapIcon, page: 'map', category: 'function' },
    { labelKey: 'tools', icon: Backpack, page: 'tools', category: 'function' },
    { labelKey: 'guide', icon: Info, page: 'guide', category: 'function' },
    user 
      ? { labelKey: 'profile', icon: User, page: 'profile', category: 'function' }
      : { labelKey: 'login', icon: Compass, page: 'auth', category: 'function' },
    
    { labelKey: 'regions', icon: Globe, page: 'regions', category: 'content' },
    { labelKey: 'places', icon: MapPin, page: 'places', category: 'content' },
    { labelKey: 'tours', icon: Backpack, page: 'tours', category: 'content' },
    { labelKey: 'stays', icon: Home, page: 'stays', category: 'content' },
    { labelKey: 'culture', icon: Music, page: 'culture', category: 'content' },
    { labelKey: 'history', icon: Book, page: 'history', category: 'content' },
    { labelKey: 'news', icon: Sparkles, page: 'news', category: 'content' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-0 z-50 p-4 md:p-6 transition-all duration-300 border-l border-b group shadow-lg"
        style={{ 
            backgroundColor: theme.background, 
            borderColor: `${theme.primary}20`,
            color: theme.primary
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.primary;
            e.currentTarget.style.color = theme.primaryForeground;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.background;
            e.currentTarget.style.color = theme.primary;
        }}
      >
        {isOpen ? (
             <X className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
             <div className="flex flex-col gap-1.5 items-end">
                <span className="w-6 md:w-8 h-0.5 bg-current group-hover:w-8 transition-all duration-300"></span>
                <span className="w-4 md:w-6 h-0.5 bg-current group-hover:w-8 transition-all duration-300"></span>
                <span className="w-2 md:w-4 h-0.5 bg-current group-hover:w-8 transition-all duration-300"></span>
             </div>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-500 backdrop-blur-md"
          style={{ backgroundColor: `${theme.primary}10` }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] z-40 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex flex-col h-full border-l" style={{ borderColor: `${theme.primary}10` }}>
          
          <div className="p-6 md:p-12 pb-6 md:pb-8 border-b flex justify-between items-center" style={{ borderColor: `${theme.text}10` }}>
             <div className="flex items-center gap-4">
                <KendalaLogo size={24} color={theme.primary} />
                <h2 className="text-xl font-sans font-black tracking-tighter uppercase" style={{ color: theme.text }}>Kendala</h2>
             </div>
             <span className="text-[10px] font-sans font-black uppercase tracking-widest opacity-40" style={{ color: theme.text }}>
                {t('menu') || 'MENU'}
             </span>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <div className="px-6 md:px-12 pt-6 pb-2">
                 <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: theme.primary }}>
                    {language === 'kz' ? 'НАВИГАЦИЯ' : language === 'ru' ? 'НАВИГАЦИЯ' : 'NAVIGATION'}
                 </span>
            </div>

            {dynamicMenuItems.filter(i => i.category === 'function').map((item) => {
               const isActive = currentPage === item.page;
               return (
                <button
                  key={item.page}
                  onClick={() => {
                    if (item.page === 'guide') {
                        if (onOpenGuide) onOpenGuide();
                    } else {
                        onNavigate(item.page);
                    }
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 md:px-12 py-5 border-b transition-all duration-300 group"
                  style={{ 
                      borderColor: `${theme.text}05`,
                      backgroundColor: isActive ? theme.primary : 'transparent',
                      color: isActive ? theme.primaryForeground : theme.text
                  }}
                  onMouseEnter={(e) => {
                      if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                          e.currentTarget.style.color = theme.primary;
                      }
                  }}
                  onMouseLeave={(e) => {
                      if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = theme.text;
                      }
                  }}
                >
                  <span className="font-sans text-2xl uppercase tracking-tighter font-black">
                    {t(item.labelKey)}
                  </span>
                  <span className={`text-xs font-sans font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                      →
                  </span>
                </button>
               );
            })}

            <div className="px-6 md:px-12 pt-6 md:pt-8 pb-2">
                 <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-30" style={{ color: theme.text }}>{t('explore') || 'EXPLORE'}</span>
            </div>

            {dynamicMenuItems.filter(i => i.category === 'content').map((item) => {
               const isActive = currentPage === item.page;
               return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 md:px-12 py-4 md:py-5 border-b transition-all duration-300 group"
                  style={{ 
                      borderColor: `${theme.text}05`,
                      backgroundColor: isActive ? `${theme.primary}10` : 'transparent', 
                      color: theme.text
                  }}
                  onMouseEnter={(e) => {
                      if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${theme.primary}05`;
                          if (window.innerWidth >= 768) {
                             e.currentTarget.style.paddingLeft = '56px';
                          }
                      }
                  }}
                  onMouseLeave={(e) => {
                      if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.paddingLeft = '';
                      }
                  }}
                >
                  <span className="font-sans text-xl md:text-2xl uppercase tracking-tighter font-black">
                    {t(item.labelKey)}
                  </span>
                  {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                  )}
                </button>
               );
            })}
          </nav>

          <div className="p-6 md:p-12 border-t" style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.primary}05` }}>
             <button 
                onClick={() => {
                    setSeason(null);
                    setIsOpen(false);
                }}
                className="w-full flex justify-between items-end group"
             >
                 <div className="text-left">
                    <span className="block text-xs font-sans font-black uppercase tracking-widest opacity-50 mb-2 group-hover:opacity-100 transition-opacity" style={{ color: theme.text }}>
                        {t('change_season') || 'CHANGE SEASON'}
                    </span>
                    <span className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter transition-all" style={{ color: theme.primary }}>
                        {season ? t(season) : ''}
                    </span>
                </div>
                <div className="p-2 md:p-3 border group-hover:rotate-180 transition-transform duration-700 shadow-sm" style={{ borderColor: theme.primary, backgroundColor: theme.background }}>
                    <Compass className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
             </button>
          </div>
        </div>
      </div>
    </>
  );
};