import React from 'react';
import {
  MapPin, ArrowRight, Plus, Mountain, Sun, Navigation, Eye, Star, Save, Play,
  Compass, Package, CheckCircle, Zap, Layers, Moon, Shield, CreditCard, Globe,
  Route,
} from '../ui/icons';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { HiddenGemsHero, TranslatorHero, HorizonHero, NomadPackHero, BudgetCalcHero } from '../ui/CinematicToolHeaders';

interface ToolRendererProps {
  toolId: string;
  data: any;
  accent: string;
  t: (k: string) => string;
  NaturalCard: React.ComponentType<{ children: React.ReactNode; color: string; delay?: number; className?: string }>;
  GEM_FALLBACK_IMAGES: string[];
  addGemToTrip: (gem: any) => void;
  saveHorizonToTrip: (data: any) => void;
  saveBudgetToTrip: (data: any) => void;
  isSaving: boolean;
  onNavigate?: (page: string) => void;
  toast: any;
}

export const renderEnhancedTool = ({
  toolId, data, accent, t, NaturalCard, GEM_FALLBACK_IMAGES,
  addGemToTrip, saveHorizonToTrip, saveBudgetToTrip, isSaving, onNavigate, toast,
}: ToolRendererProps): React.ReactNode | null => {

  if (toolId === 'hidden_gems') return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <HiddenGemsHero accent={accent} region={data.region} count={data.gems?.length || 0} t={t} />
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {data.gems?.map((gem: any, i: number) => (
          <div key={i} className="h-full">
            <NaturalCard color={accent} delay={i * 0.15}>
              <div className="relative h-40 md:h-48 -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-6 md:mb-8 overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                <ImageWithFallback src={GEM_FALLBACK_IMAGES[i % GEM_FALLBACK_IMAGES.length]} className="w-full h-full object-cover hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/90 backdrop-blur-md border" style={{ color: accent }}>
                  <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                </div>
              </div>
              <h4 className="text-xl md:text-2xl font-black uppercase text-zinc-800 mb-3 md:mb-4">{gem.name}</h4>
              <p className="text-base md:text-lg font-bold text-zinc-500 leading-relaxed mb-6 md:mb-8 line-clamp-4 md:line-clamp-none">{gem.why_special}</p>
              <div className="mt-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-50">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Navigation className="w-3 h-3 md:w-4 md:h-4" /> {gem.coordinates}
                  </span>
                  <button
                    onClick={() => addGemToTrip(gem)}
                    className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2 border hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <Plus className="w-3 h-3" /> {t('ai_add_to_trip')}
                  </button>
                </div>
              </div>
            </NaturalCard>
          </div>
        ))}
      </div>
      {data.local_legend && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-12 bg-zinc-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-6 block">{t('ui_echoes_past')}</span>
          <p className="text-2xl md:text-3xl font-bold leading-tight italic">"{data.local_legend}"</p>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
        <button
          onClick={() => { data.gems?.forEach((gem: any) => addGemToTrip(gem)); toast.success(`${data.gems?.length || 0} ${t('ai_gem_added')}`); }}
          className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl"
          style={{ backgroundColor: accent }}
        >
          <Save className="w-4 h-4" /> {t('ai_save_to_planner')} ({data.gems?.length || 0})
        </button>
        {onNavigate && (
          <button onClick={() => onNavigate('planner')} className="px-8 py-4 border-2 border-zinc-200 text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-100 transition-all flex items-center gap-3">
            <ArrowRight className="w-4 h-4" /> {t('ai_open_planner')}
          </button>
        )}
      </motion.div>
    </div>
  );

  if (toolId === 'translator') return (
    <div className="max-w-3xl mx-auto py-6 md:py-10 text-center space-y-12 md:space-y-16">
      <TranslatorHero accent={accent} original={data.original} translation={data.translation} pronunciation={data.pronunciation} t={t} />
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <NaturalCard color={accent} delay={0.2}>
          <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 text-zinc-400">{t('ui_kinship_lore')}</h5>
          <p className="text-lg md:text-xl font-bold text-zinc-700 leading-relaxed text-left">{data.cultural_context}</p>
        </NaturalCard>
        <div className="space-y-4">
          {data.usage_tips?.map((tip: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-4 md:p-6 bg-white border border-zinc-100 flex items-center gap-4 text-left shadow-sm shrink-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border text-zinc-300 font-black shrink-0">{idx + 1}</div>
              <p className="text-[10px] md:text-sm font-black text-zinc-600 uppercase tracking-tight">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  if (toolId === 'horizon') return (
    <div className="max-w-4xl mx-auto space-y-10 md:space-y-16">
      <HorizonHero accent={accent} pathName={data.path_name} segmentCount={data.segments?.length || 0} t={t} />
      <div className="space-y-6 md:space-y-8">
        {data.segments?.map((seg: any, i: number) => (
          <NaturalCard key={i} color={accent} delay={i * 0.1}>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex items-start gap-4 md:gap-8">
                <div className="w-12 h-12 md:w-20 md:h-20 border-[4px] md:border-[8px] flex items-center justify-center font-black text-xl md:text-3xl shrink-0" style={{ borderColor: `${accent}15`, color: accent }}>
                  {i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl md:text-3xl font-black uppercase tracking-tight text-zinc-800 mb-2 md:mb-3">{seg.milestone}</h4>
                  <p className="text-base md:text-lg font-bold text-zinc-500 leading-relaxed">{seg.notes}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 ml-16 md:ml-28">
                <div className="px-4 md:px-6 py-2 md:py-3 bg-zinc-50 border flex items-center gap-2 md:gap-3">
                  <Mountain className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
                  <span className="text-[9px] md:text-[11px] font-black uppercase text-zinc-600 whitespace-nowrap">{seg.terrain}</span>
                </div>
                <div className="px-4 md:px-6 py-2 md:py-3 bg-zinc-50 border flex items-center gap-2 md:gap-3">
                  <Navigation className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
                  <span className="text-[9px] md:text-[11px] font-black uppercase text-zinc-600 whitespace-nowrap">{seg.distance}</span>
                </div>
              </div>
            </div>
          </NaturalCard>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="p-8 md:p-12 border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
          <Moon className="w-8 h-8 md:w-10 md:h-10 text-zinc-200" />
          <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-400">{t('ui_resting_sanctuaries')}</h5>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {data.resting_spots?.map((spot: string) => (
              <span key={spot} className="px-3 md:px-4 py-1.5 md:py-2 bg-white border text-[9px] md:text-[10px] font-black uppercase text-zinc-500">{spot}</span>
            ))}
          </div>
        </div>
        <div className="p-8 md:p-12 bg-red-50 border border-red-100 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
          <Shield className="w-8 h-8 md:w-10 md:h-10 text-red-200" />
          <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-red-400">{t('ui_path_guardian')}</h5>
          <p className="text-xs md:text-sm font-bold text-red-900 uppercase tracking-tight leading-relaxed px-2">{data.safety_warning}</p>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <button onClick={() => saveHorizonToTrip(data)} disabled={isSaving} className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl" style={{ backgroundColor: accent }}>
          <Save className="w-4 h-4" /> {isSaving ? t('saving') : t('ai_save_to_planner')}
        </button>
        <button
          onClick={async () => { await saveHorizonToTrip(data); if (onNavigate) { sessionStorage.setItem('kendala_launch_flyover', 'true'); onNavigate('planner'); } }}
          disabled={isSaving}
          className="px-8 py-4 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-lg"
        >
          <Play className="w-4 h-4" /> {t('ai_save_and_fly')}
        </button>
      </motion.div>
    </div>
  );

  if (toolId === 'nomad') return (
    <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
      <NomadPackHero accent={accent} kitName={data.kit_name} seasonalTip={data.seasonal_tip} categoryCount={data.gear_categories?.length || 0} t={t} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {data.gear_categories?.map((cat: any, i: number) => (
          <NaturalCard key={i} color={accent} delay={i * 0.1}>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 pb-4 md:pb-6 border-b border-zinc-50 min-w-0">
              <Layers className="w-5 h-5 md:w-6 md:h-6 text-zinc-200 shrink-0" />
              <h4 className="text-base md:text-lg font-black uppercase tracking-widest text-zinc-800">{cat.category}</h4>
            </div>
            <div className="space-y-6 md:space-y-8 overflow-hidden">
              {cat.items?.map((item: any, j: number) => (
                <div key={j} className="group/item flex gap-3 md:gap-4 min-w-0">
                  <div className="w-1 h-1 mt-2 transition-transform group-hover/item:scale-150 shrink-0" style={{ backgroundColor: accent }} />
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm md:text-base font-black uppercase text-zinc-800 leading-tight">{item.name}</p>
                    <p className="text-[10px] md:text-[11px] font-bold text-zinc-400 leading-snug">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </NaturalCard>
        ))}
      </div>
    </div>
  );

  if (toolId === 'budget_calc') return (
    <div className="max-w-3xl mx-auto space-y-10 md:space-y-12 py-6 md:py-10">
      <BudgetCalcHero accent={accent} totalEstimate={data.total_estimate} breakdownCount={data.breakdown?.length || 0} t={t} />
      <div className="grid gap-4 md:gap-6 px-2">
        {data.breakdown?.map((item: any, i: number) => (
          <NaturalCard key={i} color={accent} delay={i * 0.1}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-4 md:gap-8 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 flex items-center justify-center text-zinc-300 font-black text-lg md:text-xl border shrink-0">
                  {i + 1}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-800">{item.category}</h4>
                  <p className="text-xs md:text-sm font-bold text-zinc-400 italic">{item.description}</p>
                </div>
              </div>
              <div className="text-left sm:text-right space-y-1 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                <span className="text-3xl md:text-4xl font-black tracking-tighter block" style={{ color: accent }}>{item.cost}</span>
                <div className="hidden sm:block h-1 bg-zinc-50 w-full" />
              </div>
            </div>
          </NaturalCard>
        ))}
      </div>
      <div className="mx-2 p-8 md:p-10 border border-zinc-100 bg-white/50 backdrop-blur-md space-y-6 overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4 text-zinc-400 min-w-0">
          <Zap className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('ui_nomadic_wisdom_saving')}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {data.money_saving_tips?.map((tip: string, idx: number) => (
            <div key={idx} className="p-4 bg-white/50 border border-white flex items-start gap-4 min-w-0">
              <CheckCircle className="w-4 h-4 text-zinc-300 mt-1 shrink-0" />
              <p className="text-[10px] md:text-xs font-bold text-zinc-600 leading-relaxed uppercase tracking-tight">{tip}</p>
            </div>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 mx-2">
        <button onClick={() => saveBudgetToTrip(data)} disabled={isSaving} className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl" style={{ backgroundColor: accent }}>
          <Save className="w-4 h-4" /> {isSaving ? t('saving') : t('ai_save_to_planner')}
        </button>
        {onNavigate && (
          <button onClick={() => onNavigate('planner')} className="px-8 py-4 border-2 border-zinc-200 text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-100 transition-all flex items-center gap-3">
            <ArrowRight className="w-4 h-4" /> {t('ai_open_planner')}
          </button>
        )}
      </motion.div>
    </div>
  );

  return null;
};