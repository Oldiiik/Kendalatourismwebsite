import React from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { Compass, ArrowLeft } from '../ui/icons';
import { motion } from 'motion/react';
import { PageTransition } from '../ui/PageTransition';

export const NotFoundPage = () => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const navigate = useAppNavigate();

  const labels: Record<string, Record<string, string>> = {
    en: { title: 'Lost in the Steppe', subtitle: 'This path leads nowhere. The caravan has moved on.', back: 'Return Home' },
    ru: { title: 'Затерялись в степи', subtitle: 'Этот путь ведёт в никуда. Караван ушёл дальше.', back: 'На главную' },
    kz: { title: 'Далада адастыңыз', subtitle: 'Бұл жол ешқайда апармайды. Керуен алға кетті.', back: 'Басты бетке' },
  };

  const l = labels[language] || labels.en;

  return (
    <PageTransition>
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: theme?.background || '#FFF' }}>
      <div className="text-center max-w-md">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
        >
          <Compass className="w-16 h-16 mx-auto mb-6 opacity-20" style={{ color: theme?.text }} />
        </motion.div>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4" style={{ color: theme?.text }}>
          404
        </h1>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: theme?.text }}>
          {l.title}
        </h2>
        <p className="text-sm opacity-50 mb-8" style={{ color: theme?.text }}>
          {l.subtitle}
        </p>
        <motion.button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: theme?.primary, color: theme?.primaryForeground }}
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-4 h-4" />
          {l.back}
        </motion.button>
      </div>
    </div>
    </PageTransition>
  );
};
