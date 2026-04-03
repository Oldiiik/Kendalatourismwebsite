/**
 * PageShell — unified design system for Places, Tours, and Stays pages.
 * Provides Hero, FilterBar, and CardGrid with consistent styling.
 */
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, MapPin } from './icons';
import { ResponsiveImage } from './ResponsiveImage';
import { Reveal } from './Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   HERO — full-bleed parallax header
   ═══════════════════════════════════════════════════════════════ */
interface HeroProps {
  image: string;
  tag: string;
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  theme: any;
  children?: React.ReactNode;
}

export const PageHero = ({ image, tag, title, subtitle, count, countLabel, theme, children }: HeroProps) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 120]);
  const titleY = useTransform(scrollY, [0, 400], [0, 30]);
  const titleOp = useTransform(scrollY, [200, 500], [1, 0]);

  return (
    <section ref={ref} className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] overflow-hidden flex items-end">
      <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0 will-change-transform">
        <ResponsiveImage src={image} className="w-full h-[130%] object-cover" priority />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1]" style={{
        background: `linear-gradient(to top, ${theme.background} 0%, ${theme.background}90 15%, transparent 50%, ${theme.background}20 100%)`,
      }} />
      <div className="absolute inset-0 z-[1]" style={{
        background: `linear-gradient(to right, ${theme.background}60 0%, transparent 60%)`,
      }} />

      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-[2]" style={{
        background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}40, transparent)`,
      }} />

      <motion.div style={{ y: titleY, opacity: titleOp }} className="relative z-10 w-full pb-10 sm:pb-14 md:pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 max-w-[1800px] mx-auto">
            <div className="max-w-4xl">
              {/* Tag line */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-12 h-[2px]" style={{ backgroundColor: theme.primary }} />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.primary }}>
                  {tag}
                </span>
              </div>
              {/* Title */}
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-4 sm:mb-6"
                style={{ color: theme.text }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg max-w-xl leading-relaxed opacity-60" style={{ color: theme.text }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Count badge */}
            {count !== undefined && (
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-5xl sm:text-7xl font-black font-mono tracking-tighter" style={{ color: theme.primary }}>
                  {count}
                </span>
                {countLabel && (
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40" style={{ color: theme.text }}>
                    {countLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Optional extra content (e.g. currency switcher) */}
          {children && <div className="max-w-[1800px] mx-auto mt-6">{children}</div>}
        </Reveal>
      </motion.div>
    </section>
  );
};


/* ═══════════════════════════════════════════════════════════════
   FILTER BAR — sticky horizontal filter strip
   ═══════════════════════════════════════════════════════════════ */
interface FilterItem {
  id: string;
  label: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface FilterBarProps {
  filters: FilterItem[];
  active: string;
  onFilter: (id: string) => void;
  theme: any;
  rightContent?: React.ReactNode;
}

export const PageFilterBar = ({ filters, active, onFilter, theme, rightContent }: FilterBarProps) => (
  <div className="sticky top-0 z-30 backdrop-blur-xl border-b transition-all duration-300"
    style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.background}E8` }}>
    <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row md:items-center justify-between pr-[72px] md:pr-[88px]">
      <div className="flex overflow-x-auto no-scrollbar">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilter(f.id)}
              className="px-5 sm:px-7 py-4 sm:py-5 flex items-center gap-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border-r transition-all duration-300 active:scale-95"
              style={{
                borderColor: `${theme.text}08`,
                backgroundColor: isActive ? theme.primary : 'transparent',
                color: isActive ? (theme.primaryForeground || '#fff') : theme.text,
              }}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'opacity-100' : 'opacity-40'}`} />}
              {f.label}
            </button>
          );
        })}
      </div>
      {rightContent && (
        <div className="hidden md:flex items-center px-6 sm:px-8 gap-4 border-l py-4 sm:py-5" style={{ borderColor: `${theme.text}08` }}>
          {rightContent}
        </div>
      )}
    </div>
  </div>
);


/* ═══════════════════════════════════════════════════════════════
   CARD — full-bleed image card with overlay content
   ═══════════════════════════════════════════════════════════════ */
interface CardProps {
  image: string;
  index: number;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  category?: string;
  categoryColor?: string;
  title: string;
  subtitle?: string;
  description?: string;
  bottomRight?: React.ReactNode;
  isLiked?: boolean;
  onLike?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  theme: any;
  ctaLabel?: string;
  priority?: boolean;
}

export const PageCard = React.forwardRef<HTMLDivElement, CardProps>(({
  image, index, topLeft, topRight, category, categoryColor,
  title, subtitle, description, bottomRight, isLiked, onLike,
  onClick, theme, ctaLabel, priority,
}, ref) => (
  <motion.div
    ref={ref}
    layout
    initial={{ opacity: 0, y: 30 }}
    animate={index < 6 ? { opacity: 1, y: 0 } : undefined}
    whileInView={index >= 6 ? { opacity: 1, y: 0 } : undefined}
    viewport={{ once: true, margin: '100px' }}
    transition={{ duration: 0.5, delay: index < 6 ? index * 0.06 : 0, ease: EASE }}
    onClick={onClick}
    className="group relative min-h-[360px] sm:min-h-[420px] md:min-h-[500px] overflow-hidden cursor-pointer flex flex-col justify-between"
  >
    {/* Background image */}
    <div className="absolute inset-0 z-0">
      <ResponsiveImage
        src={image}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-all duration-700" />
    </div>

    {/* Wishlist button */}
    {onLike && (
      <button
        onClick={(e) => { e.stopPropagation(); onLike(e); }}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2.5 backdrop-blur-md border border-white/15 hover:border-white/40 transition-all active:scale-90"
        style={{ backgroundColor: isLiked ? theme.primary : 'rgba(0,0,0,0.3)' }}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-white/80'}`} />
      </button>
    )}

    {/* Top content */}
    <div className="relative z-10 p-5 sm:p-7 flex justify-between items-start">
      <div className="flex gap-2 flex-wrap">
        {topLeft}
      </div>
      <div className="flex gap-2 items-center">
        {topRight}
      </div>
    </div>

    {/* Bottom content */}
    <div className="relative z-10 p-5 sm:p-7 mt-auto">
      {/* Category tag */}
      {category && (
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-4 h-[2px]" style={{ backgroundColor: categoryColor || theme.primary }} />
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
            {category}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white leading-[0.9] tracking-tight mb-1 sm:mb-2 transition-transform duration-500 origin-left group-hover:translate-x-2">
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/50 mb-3">
          {subtitle}
        </p>
      )}

      {/* Description - reveals on hover */}
      {description && (
        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 max-w-sm">
            {description}
          </p>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2">
        {ctaLabel && (
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
            {ctaLabel} <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
        {bottomRight && <div className="ml-auto">{bottomRight}</div>}
      </div>
    </div>

    {/* Index number watermark */}
    <span className="absolute top-3 left-5 sm:top-5 sm:left-7 text-[60px] sm:text-[80px] font-black leading-none select-none pointer-events-none text-white/[0.04]">
      {String(index + 1).padStart(2, '0')}
    </span>
  </motion.div>
));

PageCard.displayName = 'PageCard';