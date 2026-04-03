import React from 'react';
import { motion } from 'motion/react';
import {
  Eye, Compass, Package, CreditCard, Globe,
  MapPin, Mountain, Navigation, Shield, Zap, Star,
} from './icons';

interface CinematicHeroProps {
  accent: string;
  children: React.ReactNode;
}

const CinematicHeroBg = ({ accent, children }: CinematicHeroProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden -mx-2 mb-4">
    <div className="relative p-10 md:p-20 bg-zinc-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}40, transparent 70%)` }} />
      <div className="absolute -top-40 -right-40 w-80 h-80 blur-[100px] opacity-20" style={{ backgroundColor: accent }} />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 blur-[80px] opacity-10" style={{ backgroundColor: accent }} />
      <div className="relative z-10">{children}</div>
    </div>
    <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}60, ${accent}10, transparent)` }} />
  </motion.div>
);

const TagLine = ({ icon: Icon, label, accent }: { icon: React.ElementType; label: string; accent: string }) => (
  <div className="flex items-center gap-3 mb-8">
    <Icon className="w-5 h-5" style={{ color: accent }} />
    <span className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: accent }}>{label}</span>
    <div className="flex-1 h-[1px] ml-4" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
  </div>
);

/* ═══ HIDDEN GEMS HERO ═══ */
export const HiddenGemsHero = ({ accent, region, count, t }: { accent: string; region: string; count: number; t: (k: string) => string }) => (
  <CinematicHeroBg accent={accent}>
    <TagLine icon={Eye} label={t('ui_secret_vision')} accent={accent} />
    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">{region}</h3>
    <div className="flex flex-wrap items-center gap-6 mt-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 opacity-40" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{count} secret locations</span>
      </div>
      <div className="w-1 h-1 opacity-20 bg-white" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">GPS coordinates included</span>
    </div>
  </CinematicHeroBg>
);

/* ═══ TRANSLATOR HERO ═══ */
export const TranslatorHero = ({ accent, original, translation, pronunciation, t }: { accent: string; original: string; translation: string; pronunciation: string; t: (k: string) => string }) => (
  <CinematicHeroBg accent={accent}>
    <TagLine icon={Globe} label={t('ui_original_breath')} accent={accent} />
    <p className="text-3xl md:text-5xl font-black tracking-tighter opacity-40 mb-8 leading-tight">{original}</p>
    <div className="relative">
      <div className="absolute -left-6 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
      <p className="text-5xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-3">{translation}</p>
      <p className="text-xl md:text-3xl font-mono opacity-40 tracking-widest italic">{pronunciation}</p>
    </div>
  </CinematicHeroBg>
);

/* ═══ HORIZON HERO ═══ */
export const HorizonHero = ({ accent, pathName, segmentCount, t }: { accent: string; pathName: string; segmentCount: number; t: (k: string) => string }) => (
  <CinematicHeroBg accent={accent}>
    <TagLine icon={Compass} label={t('ui_terrain_analysis')} accent={accent} />
    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">{pathName}</h3>
    <div className="flex flex-wrap items-center gap-6 mt-6">
      <div className="flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 opacity-40" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{segmentCount} waypoints</span>
      </div>
      <div className="w-1 h-1 opacity-20 bg-white" />
      <div className="flex items-center gap-2">
        <Mountain className="w-3.5 h-3.5 opacity-40" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Terrain analysis active</span>
      </div>
    </div>
  </CinematicHeroBg>
);

/* ═══ NOMAD PACKING HERO ═══ */
export const NomadPackHero = ({ accent, kitName, seasonalTip, categoryCount, t }: { accent: string; kitName: string; seasonalTip: string; categoryCount: number; t: (k: string) => string }) => (
  <CinematicHeroBg accent={accent}>
    <TagLine icon={Package} label="Nomad Kit" accent={accent} />
    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">{kitName}</h3>
    <div className="flex flex-wrap items-center gap-4 mt-4">
      <div className="px-5 py-2.5 border border-white/10 flex items-center gap-3">
        <Zap className="w-3.5 h-3.5" style={{ color: accent }} />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">{seasonalTip}</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-3.5 h-3.5 opacity-30" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{categoryCount} categories</span>
      </div>
    </div>
  </CinematicHeroBg>
);

/* ═══ BUDGET CALC HERO ═══ */
export const BudgetCalcHero = ({ accent, totalEstimate, breakdownCount, t }: { accent: string; totalEstimate: string; breakdownCount: number; t: (k: string) => string }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden -mx-2 mb-4">
    <div className="relative p-10 md:p-24 bg-zinc-900 text-white text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30" />
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="absolute -top-40 -right-40 w-96 h-96 blur-[120px] opacity-15" style={{ backgroundColor: accent }} />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 blur-[100px] opacity-10" style={{ backgroundColor: accent }} />
      <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}40, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}40)` }} />
          <CreditCard className="w-5 h-5" style={{ color: accent }} />
          <span className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: accent }}>{t('ui_total_path_weight')}</span>
          <div className="w-12 h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
        </div>
        <p className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none">{totalEstimate}</p>
        <div className="flex items-center justify-center gap-6 mt-8">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{breakdownCount} categories analyzed</span>
          <div className="w-1 h-1 opacity-20 bg-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Optimized budget</span>
        </div>
      </div>
    </div>
    <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}60, ${accent}10, transparent)` }} />
  </motion.div>
);
