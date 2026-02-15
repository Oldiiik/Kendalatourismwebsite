import React, { useState, useEffect, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { AuthTerminal } from '../auth/AuthTerminal';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { Mountain, Compass, Wind, Leaf, Sun, Snowflake, ArrowLeft } from 'lucide-react';
import { getSeasonSelectionUrl } from '../../utils/imageUrls';

interface AuthPageProps {
  onSuccess: () => void;
  onNavigate: (page: string) => void;
}

export const AuthPage = ({ onSuccess, onNavigate }: AuthPageProps) => {
  const { theme, season } = useSeason();
  const { language, t } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const seasonalAssets = useMemo(() => {
    switch (season) {
      case 'winter': return {
        image: getSeasonSelectionUrl('winter'),
        icon: Snowflake,
        tagline: { kz: "Қысқы қиял", ru: "Зимняя фантазия", en: "Winter's Dream" },
        desc: { kz: "Шыңдардың мүлгіген тыныштығына сүңгіңіз.", ru: "Погрузитесь в безмолвное величие вершин.", en: "Immerse yourself in the silent grandeur of the peaks." }
      };
      case 'spring': return {
        image: getSeasonSelectionUrl('spring'),
        icon: Leaf,
        tagline: { kz: "Көктемгі жаңару", ru: "Весеннее возрождение", en: "Spring Revival" },
        desc: { kz: "Даланың жаңа өмірімен бірге тыныс алыңыз.", ru: "Дышите вместе с новой жизнью великой степи.", en: "Breathe with the new life of the great steppe." }
      };
      case 'summer': return {
        image: getSeasonSelectionUrl('summer'),
        icon: Sun,
        tagline: { kz: "Алтын сапар", ru: "Золотое путешествие", en: "Golden Journey" },
        desc: { kz: "Шексіз көкжиектер мен еркіндік уақыты.", ru: "Время бесконечных горизонтов и свободы.", en: "A time of endless horizons and freedom." }
      };
      case 'autumn': return {
        image: getSeasonSelectionUrl('autumn'),
        icon: Wind,
        tagline: { kz: "Янтарьлы жол", ru: "Янтарный путь", en: "Amber Path" },
        desc: { kz: "Алтын орманның сыбдырын тыңдаңыз.", ru: "Слушайте шепот золотого леса.", en: "Listen to the whisper of the golden forest." }
      };
      default: return {
        image: getSeasonSelectionUrl('summer'),
        icon: Mountain,
        tagline: { kz: "Ұлы Дала", ru: "Великая Степь", en: "Great Steppe" },
        desc: { kz: "Саяхатыңыз осы жерден басталады.", ru: "Ваше путешествие начинается здесь.", en: "Your journey starts here." }
      };
    }
  }, [season]);

  if (!theme) return null;

  const labels = {
    kz: { access: 'Кіру', kinship: 'Мәңгілік бауырластық', records: 'Киелі жазбалар', kinshipDesc: 'Мыңдаған жылдар бойы осы жерде жүрген зерттеушілер қатарына қосылыңыз.', recordsDesc: 'Сіздің тәжірибеңіз таулардың цифрлық жүрегінде сақталады.', back: 'Далаға оралу' },
    ru: { access: 'Вход', kinship: 'Вечное родство', records: 'Священные записи', kinshipDesc: 'Присоединяйтесь к кругу исследователей, ступавших по этим землям тысячелетиями.', recordsDesc: 'В��ш опыт сохраняется в цифровом сердце гор.', back: 'Вернуться в степь' },
    en: { access: 'Access', kinship: 'Eternal Kinship', records: 'Sacred Records', kinshipDesc: 'Join the circle of explorers who have walked these lands for millennia.', recordsDesc: 'Your experiences are preserved in the digital heart of the mountains.', back: 'Return to Steppe' }
  }[language];

  const SeasonIcon = seasonalAssets.icon;

  return (
    <div className="min-h-screen relative flex flex-col lg:flex-row overflow-x-hidden" style={{ backgroundColor: theme.background }}>
      {/* Background Layer - Vibrant & Natural */}
      <div className="absolute inset-0">
        <ResponsiveImage 
          src={seasonalAssets.image}
          className="w-full h-full object-cover transition-all duration-1000 scale-105"
          alt="Seasonal Landscape"
          priority
        />
        {/* Soft light overlay instead of heavy dark */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-white/60 sm:from-white/40 via-white/10 to-transparent" />
      </div>

      {/* Cinematic Content Layer — above auth on mobile, left on desktop */}
      <div className="w-full lg:w-3/5 relative flex flex-col justify-center p-6 sm:p-12 lg:p-24 z-10 pb-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-2xl space-y-6 lg:space-y-16"
        >
          <div className="space-y-3 lg:space-y-6">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-current rounded-full flex items-center justify-center backdrop-blur-sm opacity-60"
                style={{ color: theme.text }}
              >
                <SeasonIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.div>
              <div className="h-px w-8 sm:w-12 bg-current opacity-20" style={{ color: theme.text }} />
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.4em] opacity-40" style={{ color: theme.text }}>
                {seasonalAssets.tagline[language]}
              </span>
            </div>
            
            {/* Title — smaller on mobile since auth is the star */}
            <h1 className="text-3xl sm:text-5xl lg:text-8xl xl:text-9xl font-sans font-black uppercase tracking-tighter leading-none" style={{ color: theme.text }}>
              {labels.access}
            </h1>
            
            {/* Description — hidden on mobile, visible on larger screens */}
            <p className="hidden sm:block text-base sm:text-lg md:text-xl font-sans leading-relaxed max-w-lg opacity-80 lg:opacity-70" style={{ color: theme.text }}>
              "{seasonalAssets.desc[language]}"
            </p>
          </div>

          {/* Info grid — hidden on mobile, visible on desktop */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-current pt-8 sm:pt-12" style={{ borderColor: `${theme.text}20` }}>
            <div className="space-y-3 sm:space-y-4 group">
              <div className="flex items-center gap-3">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 md:group-hover:opacity-100 transition-opacity" style={{ color: theme.text }} />
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.text }}>{labels.records}</h3>
              </div>
              <p className="text-xs sm:text-sm opacity-60 sm:opacity-50 font-sans font-bold leading-relaxed" style={{ color: theme.text }}>
                {labels.recordsDesc}
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4 group">
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 md:group-hover:opacity-100 transition-opacity" style={{ color: theme.text }} />
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.text }}>{labels.kinship}</h3>
              </div>
              <p className="text-xs sm:text-sm opacity-60 sm:opacity-50 font-sans font-bold leading-relaxed" style={{ color: theme.text }}>
                {labels.kinshipDesc}
              </p>
            </div>
          </div>

          <div className="pt-2 lg:pt-8">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60 sm:opacity-40 hover:opacity-100 transition-all group"
              style={{ color: theme.text }}
            >
              <ArrowLeft className="w-4 h-4 md:group-hover:-translate-x-1 transition-transform" /> 
              {labels.back}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Auth Terminal Section — TOP on mobile, right on desktop */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-5 pt-8 sm:p-8 lg:p-16 xl:p-24 relative z-20 backdrop-blur-md border-b lg:border-b-0 lg:border-l min-h-[60vh] lg:min-h-screen" style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.background}90` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Mobile-only branding above auth form */}
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="w-6 h-6 border border-current flex items-center justify-center opacity-50" style={{ color: theme.text }}>
              <SeasonIcon className="w-3 h-3" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40" style={{ color: theme.text }}>
              KENDALA — {seasonalAssets.tagline[language]}
            </span>
          </div>

          <AuthTerminal onAuthSuccess={onSuccess} />
          
          <div className="mt-6 lg:mt-12 flex flex-col items-center text-center space-y-3 lg:space-y-6">
            <div className="w-8 h-px opacity-10" style={{ backgroundColor: theme.text }} />
            <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] opacity-30 sm:opacity-20 max-w-[200px] leading-relaxed" style={{ color: theme.text }}>
              Connected to the nomadic spirit of the great steppe.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};