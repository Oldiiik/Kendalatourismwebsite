import React, { useRef, useEffect, useState } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ArrowRight, Brain, Plane, Compass,
  Hotel, Wrench, ChevronDown, Send,
  Mountain, Feather, MapPin, Star, Shield, Sparkles, Info
} from '../ui/icons';
import {
  motion, useScroll, useTransform, useMotionValue,
  useSpring, useInView
} from 'motion/react';
import { getHomeHeroUrl, buildSrcSet, HOME_HERO_URLS } from '../../utils/imageUrls';
import { NatureMagicOverlay } from '../../components/effects/NatureMagicOverlay';
import { PageTransition } from '../ui/PageTransition';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { SearchBar, type SearchParams } from '../search/SearchBar';
import { CityGrid } from '../search/CityGrid';
import { UserGuide } from '../ui/UserGuide';
import { KAZAKHSTAN_CITIES, TOP_DESTINATIONS, type KZCity } from '../../data/kazakhstan-cities';
import { useNavigate } from 'react-router';

const rgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const IconRoute = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 17l4-4 4 4 4-8 6 6" />
    <circle cx="3" cy="17" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="21" cy="15" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const FILM_EASE = [0.16, 1, 0.3, 1] as const;
const SMOOTH_SPRING = { stiffness: 60, damping: 25, mass: 1 };

const WARM = {
  dark: '#1D1B18',
  darker: '#15130F',
  mid: '#2A2724',
  cream: '#F5F1EC',
  sand: '#E8E2DA',
  stone: '#B5AFA6',
};

const SEASON_ASSETS: Record<string, { image: string; color: string }> = {
  winter: { image: getHomeHeroUrl('winter'), color: '#A5F3FC' },
  spring: { image: getHomeHeroUrl('spring'), color: '#86EFAC' },
  summer: { image: getHomeHeroUrl('summer'), color: '#FDE047' },
  autumn: { image: getHomeHeroUrl('autumn'), color: '#FDBA74' },
};

const NATURE_GALLERY = [
  {
    src: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
    title: { en: 'The Endless Steppe', ru: 'Бескрайняя Степь', kz: 'Шексіз Дала' },
    sub: { en: 'Where earth meets sky', ru: 'Где земля встречает небо', kz: 'Жер мен аспан қосылған жер' },
  },
  {
    src: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
    title: { en: 'Alpine Jewels', ru: 'Горные Сокровища', kz: 'Тау Асылдары' },
    sub: { en: 'Turquoise waters of Tian Shan', ru: 'Бирюзовые воды Тянь-Шаня', kz: 'Тянь-Шанның көгілдір сулары' },
  },
  {
    src: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
    title: { en: 'Wild Spirit', ru: 'Дикий Дух', kz: 'Жабайы Рух' },
    sub: { en: 'Horses of the great plains', ru: 'Лошади великих равнин', kz: 'Ұлы жазықтардың жылқылары' },
  },
  {
    src: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
    title: { en: 'Ancient Bond', ru: 'Древняя Связь', kz: 'Ежелгі Байланыс' },
    sub: { en: 'Eagle hunting tradition', ru: 'Традиция охоты с беркутом', kz: 'Бүркітшілік дәстүрі' },
  },
  {
    src: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
    title: { en: 'Infinite Night', ru: 'Бесконечная Ночь', kz: 'Шексіз Түн' },
    sub: { en: 'Stars above the steppe', ru: 'Звёзды над степью', kz: 'Дала үстіндегі жұлдыздар' },
  },
];

const FEAT_IMAGES = {
  ai: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg',
  flyover: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
  planner: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
  map: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
  culture: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/aisha_bibi.jpg',
  stays: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
  tools: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
};


const MagneticButton = ({ children, onClick, className = '', style }: {
  children: React.ReactNode; onClick: () => void; className?: string; style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  return (
    <motion.button
      ref={ref} onClick={onClick}
      onMouseMove={e => {
        if (window.innerWidth < 768) return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, ...style }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className}
    >{children}</motion.button>
  );
};

const AnimatedCounter = ({ target, color }: { target: string; color: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const isNum = !isNaN(Number(target));
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || !isNum) return;
    const num = parseInt(target);
    let frame = 0;
    const total = 50;
    const timer = setInterval(() => {
      frame++;
      const t = frame / total;
      const ease = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(ease * num));
      if (frame >= total) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, [inView, target]);
  return (
    <motion.span
      ref={ref}
      className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none tabular-nums"
      style={{ color }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: FILM_EASE }}
    >
      {isNum ? count : target}
    </motion.span>
  );
};

const CinematicReveal = ({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
    whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 1.2, delay, ease: FILM_EASE }}
  >
    {children}
  </motion.div>
);


export const HomePage = () => {
  const { theme, season } = useSeason();
  const { t, language } = useLanguage();
  const onNavigate = useAppNavigate();
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 25, damping: 35 });
  const smy = useSpring(my, { stiffness: 25, damping: 35 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 24);
      my.set((e.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const hWrapRef = useRef<HTMLDivElement>(null);
  const [hScroll, setHScroll] = useState({ active: false, progress: 0, past: false });

  useEffect(() => {
    const wrap = hWrapRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = wrap.offsetHeight - wh;
      if (rect.top <= 0 && rect.bottom >= wh) {
        setHScroll({ active: true, progress: Math.min(1, Math.max(0, -rect.top / total)), past: false });
      } else if (rect.bottom < wh) {
        setHScroll({ active: false, progress: 1, past: true });
      } else {
        setHScroll({ active: false, progress: 0, past: false });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeSeason = season ? SEASON_ASSETS[season] : SEASON_ASSETS.summer;
  const heroScale = useTransform(scrollY, [0, 900], [1.15, 1]);
  const heroY = useTransform(scrollY, [0, 900], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const titleY = useTransform(scrollY, [0, 700], [0, 120]);

  if (!theme) return null;

  const lang = language as 'en' | 'ru' | 'kz';
  const galleryCount = NATURE_GALLERY.length;
  const hTranslateX = -(hScroll.progress * (galleryCount - 0.4) * 100) / galleryCount;

  const features = [
    { key: 'ai', image: FEAT_IMAGES.ai, icon: <Brain className="w-5 h-5" />, tag: t('hero_feat_ai_tag'), title: t('hero_feat_ai_title'), desc: t('hero_feat_ai_desc'), page: 'ai' },
    { key: 'flyover', image: FEAT_IMAGES.flyover, icon: <Plane className="w-5 h-5" />, tag: t('hero_feat_flyover_tag'), title: t('hero_feat_flyover_title'), desc: t('hero_feat_flyover_desc'), page: 'planner' },
    { key: 'planner', image: FEAT_IMAGES.planner, icon: <IconRoute className="w-5 h-5" />, tag: t('hero_feat_planner_tag'), title: t('hero_feat_planner_title'), desc: t('hero_feat_planner_desc'), page: 'planner' },
    { key: 'map', image: FEAT_IMAGES.map, icon: <Compass className="w-5 h-5" />, tag: t('hero_feat_map_tag'), title: t('hero_feat_map_title'), desc: t('hero_feat_map_desc'), page: 'map' },
    { key: 'culture', image: FEAT_IMAGES.culture, icon: <Feather className="w-5 h-5" />, tag: t('hero_feat_culture_tag'), title: t('hero_feat_culture_title'), desc: t('hero_feat_culture_desc'), page: 'culture' },
    { key: 'stays', image: FEAT_IMAGES.stays, icon: <Hotel className="w-5 h-5" />, tag: t('hero_feat_stays_tag'), title: t('hero_feat_stays_title'), desc: t('hero_feat_stays_desc'), page: 'stays' },
    { key: 'tools', image: FEAT_IMAGES.tools, icon: <Wrench className="w-5 h-5" />, tag: t('hero_feat_tools_tag'), title: t('hero_feat_tools_title'), desc: t('hero_feat_tools_desc'), page: 'tools' },
  ];

  return (
    <PageTransition>
    <div className="min-h-screen font-sans" style={{ backgroundColor: WARM.dark, color: WARM.cream, overflowX: 'clip' }}>
      <NatureMagicOverlay season={season || 'summer'} />

      <header className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: WARM.dark }}>
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0 z-0 will-change-transform origin-center">
          <motion.img
            src={activeSeason.image}
            srcSet={buildSrcSet(HOME_HERO_URLS[season || 'summer'])}
            sizes="100vw" fetchpriority="high"
            className="w-full h-full object-cover"
            alt="Kazakhstan landscape"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            transition={{ duration: 2.5, ease: FILM_EASE }}
          />
        </motion.div>

        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0" style={{
            background: `linear-gradient(180deg, ${WARM.darker}60 0%, transparent 30%, transparent 55%, ${WARM.darker}F0 100%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent, ${WARM.darker}70)`,
          }} />
        </div>

        <div className="absolute inset-0 z-[2] mix-blend-soft-light pointer-events-none" style={{
          opacity: 0.3,
          background: `radial-gradient(ellipse 80% 50% at 50% 45%, ${activeSeason.color}, transparent 65%)`,
        }} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
          <motion.div style={{ x: smx, y: smy, opacity: heroOpacity }} className="w-full flex flex-col items-center pointer-events-none">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.5, ease: FILM_EASE }}
              className="mb-10 flex items-center gap-5"
            >
              <motion.div
                className="w-12 h-px"
                style={{ backgroundColor: activeSeason.color }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: FILM_EASE }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: rgba(WARM.cream, 0.6) }}>
                {t(season || 'summer')} — Kazakhstan
              </span>
              <motion.div
                className="w-12 h-px"
                style={{ backgroundColor: activeSeason.color }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: FILM_EASE }}
              />
            </motion.div>

            <motion.div style={{ y: titleY }} className="relative mb-8 md:mb-12">
              <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-black uppercase tracking-[-0.03em] text-center select-none" style={{ color: WARM.cream }}>
                {'KENDALA'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.05,
                      ease: FILM_EASE,
                    }}
                  >{ch}</motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{ delay: 1.2, duration: 1, ease: FILM_EASE }}
                className="mx-auto mt-5 h-px w-[40%] max-w-[260px] origin-center"
                style={{ background: `linear-gradient(90deg, transparent, ${activeSeason.color}, transparent)` }}
              />
            </motion.div>

            <motion.p
              className="text-center mb-12 max-w-lg text-sm md:text-base"
              style={{ color: rgba(WARM.sand, 0.7) }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1, ease: FILM_EASE }}
            >
              {t('hero_platform_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: FILM_EASE }}
              className="flex flex-col sm:flex-row items-center gap-3 pointer-events-auto"
            >
              <MagneticButton
                onClick={() => onNavigate('ai')}
                className="group px-10 py-4"
                style={{ backgroundColor: activeSeason.color }}
              >
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4" style={{ color: WARM.darker }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: WARM.darker }}>{t('hero_cta_start')}</span>
                </div>
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-4 border backdrop-blur-sm transition-all duration-700 hover:bg-white/5"
                style={{ borderColor: rgba(WARM.cream, 0.2) }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: rgba(WARM.cream, 0.8) }}>{t('hero_cta_explore')}</span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: rgba(WARM.cream, 0.5) }} />
                </div>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.div
            className="w-px h-10"
            style={{ background: `linear-gradient(to bottom, ${activeSeason.color}60, transparent)` }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </header>

      {/* ══════ BOOKING.COM-STYLE SEARCH SECTION ══════ */}
      <section className="relative z-20 -mt-16 md:-mt-20 px-4 md:px-8 pb-0" style={{ backgroundColor: 'transparent' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: FILM_EASE }}
        >
          <SearchBar
            theme={{ ...theme, background: WARM.dark, text: WARM.cream, primary: activeSeason.color, primaryForeground: WARM.darker }}
            language={lang}
            onSearch={(params: SearchParams) => {
              const q = new URLSearchParams();
              if (params.cityId) q.set('city', params.cityId);
              if (params.checkIn) q.set('checkIn', params.checkIn);
              if (params.checkOut) q.set('checkOut', params.checkOut);
              if (params.guests) q.set('guests', String(params.guests));
              navigate(`/stays?${q.toString()}`);
            }}
            variant="hero"
          />
        </motion.div>

        {/* Quick navigation tabs — like booking.com top categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.6 }}
          className="max-w-5xl mx-auto mt-6 flex items-center justify-center gap-1 flex-wrap"
        >
          {[
            { icon: <Hotel className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Жильё' : lang === 'kz' ? 'Тұрғын үй' : 'Stays', page: 'stays' },
            { icon: <Plane className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Туры' : lang === 'kz' ? 'Турлар' : 'Tours', page: 'tours' },
            { icon: <Compass className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Места' : lang === 'kz' ? 'Мекендер' : 'Places', page: 'places' },
            { icon: <Brain className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'AI Гид' : lang === 'kz' ? 'AI Гид' : 'AI Guide', page: 'ai' },
            { icon: <MapPin className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Карта' : lang === 'kz' ? 'Карта' : 'Map', page: 'map' },
            { icon: <Info className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Гайд' : lang === 'kz' ? 'Гайд' : 'Guide', page: '__guide' },
          ].map((tab) => (
            <button
              key={tab.page}
              onClick={() => tab.page === '__guide' ? setShowGuide(true) : onNavigate(tab.page)}
              className="flex items-center gap-2 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] border transition-all duration-300 hover:border-current/30"
              style={{ borderColor: `${WARM.cream}10`, color: `${WARM.cream}70` }}
            >
              <span style={{ color: activeSeason.color }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ══════ CITY SELECTION GRID ══════ */}
      <section className="relative py-20 md:py-28" style={{ backgroundColor: WARM.dark }}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <CityGrid
            theme={{ ...theme, background: WARM.dark, text: WARM.cream, primary: activeSeason.color }}
            language={lang}
            onCitySelect={(city: KZCity) => {
              navigate(`/stays?city=${city.id}`);
            }}
            variant="compact"
          />
        </div>
      </section>

      {/* ══════ TRUST STRIP — like booking.com ══════ */}
      <section className="border-y" style={{ backgroundColor: WARM.mid, borderColor: `${WARM.cream}08` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: `${WARM.cream}06` }}>
            {[
              { icon: <Shield className="w-5 h-5" />, value: lang === 'ru' ? 'Проверено' : lang === 'kz' ? 'Тексерілді' : 'Verified', sub: lang === 'ru' ? 'Все объекты проверены' : lang === 'kz' ? 'Барлық нысандар тексерілді' : 'All properties verified' },
              { icon: <Star className="w-5 h-5" />, value: '4.8+', sub: lang === 'ru' ? 'Средний рейтинг' : lang === 'kz' ? 'Орташа рейтинг' : 'Average rating' },
              { icon: <MapPin className="w-5 h-5" />, value: `${KAZAKHSTAN_CITIES.length}+`, sub: lang === 'ru' ? 'Направлений' : lang === 'kz' ? 'Бағыт' : 'Destinations' },
              { icon: <Sparkles className="w-5 h-5" />, value: lang === 'ru' ? 'AI-помощник' : lang === 'kz' ? 'AI көмекші' : 'AI Powered', sub: lang === 'ru' ? 'Умный подбор' : lang === 'kz' ? 'Ақылды таңдау' : 'Smart matching' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 p-6 md:p-8"
                style={{ backgroundColor: WARM.mid }}
              >
                <div style={{ color: activeSeason.color }}>{item.icon}</div>
                <div>
                  <span className="text-sm font-black block" style={{ color: WARM.cream }}>{item.value}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">{item.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PhilosophySection id="philosophy" lang={lang} activeSeason={activeSeason} onNavigate={onNavigate} />

      <div ref={hWrapRef} className="relative"
        style={{ height: `${galleryCount * 100}vh`, backgroundColor: WARM.dark }}
      >
        <div
          className="h-screen w-full overflow-hidden"
          style={{
            position: hScroll.active ? 'fixed' : hScroll.past ? 'absolute' : 'relative',
            top: hScroll.active ? 0 : 'auto',
            bottom: hScroll.past ? 0 : 'auto',
            left: 0, right: 0,
            backgroundColor: WARM.dark,
          }}
        >
          <div className="absolute top-7 md:top-11 left-7 md:left-14 z-30 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: activeSeason.color }} />
            <span className="text-[10px] font-black uppercase tracking-[0.45em]" style={{ color: rgba(WARM.sand, 0.5) }}>
              {lang === 'ru' ? 'Природа Казахстана' : lang === 'kz' ? 'Қазақстан табиғаты' : 'Nature of Kazakhstan'}
            </span>
          </div>

          <div
            className="flex h-full items-center gap-5 md:gap-8"
            style={{
              transform: `translateX(calc(5vw + ${hTranslateX}vw))`,
              width: `${galleryCount * 75}vw`,
              transition: 'transform 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {NATURE_GALLERY.map((item, i) => {
              const cardProg = Math.max(0, Math.min(1, hScroll.progress * galleryCount - i + 1));
              const scaleVal = 0.93 + cardProg * 0.07;
              return (
                <div
                  key={`gallery-${i}`}
                  className="relative shrink-0 h-[70vh] md:h-[80vh] cursor-pointer group overflow-hidden"
                  style={{
                    width: i === 0 ? '60vw' : i % 2 === 0 ? '48vw' : '36vw',
                    opacity: 0.35 + cardProg * 0.65,
                    transform: `scale(${scaleVal})`,
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  }}
                  onClick={() => onNavigate('places')}
                >
                  <img
                    src={item.src} alt={item.title[lang]}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[2s] ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(to top, ${WARM.dark}D0 0%, ${WARM.dark}10 40%, ${WARM.dark}30 100%)`,
                  }} />

                  <span className="absolute top-4 left-5 md:top-6 md:left-8 text-[80px] md:text-[120px] font-black leading-none select-none" style={{ color: `${WARM.cream}08` }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] block mb-2" style={{ color: rgba(WARM.stone, 0.8) }}>{item.sub[lang]}</span>
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-[0.88]" style={{ color: WARM.cream }}>
                      {item.title[lang]}
                    </h3>
                  </div>

                  <div className="absolute top-5 right-5 md:top-7 md:right-7 w-10 h-10 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700" style={{ borderColor: rgba(WARM.cream, 0.15) }}>
                    <ArrowRight className="w-4 h-4" style={{ color: rgba(WARM.cream, 0.6) }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-7 md:bottom-11 left-7 md:left-14 right-7 md:right-14 z-30">
            <div className="flex items-center gap-5">
              <span className="text-[10px] font-mono tabular-nums" style={{ color: rgba(WARM.stone, 0.5) }}>
                {String(Math.min(galleryCount, Math.floor(hScroll.progress * galleryCount) + 1)).padStart(2, '0')}/{String(galleryCount).padStart(2, '0')}
              </span>
              <div className="flex-1 h-px relative overflow-hidden" style={{ backgroundColor: rgba(WARM.cream, 0.1) }}>
                <motion.div
                  className="absolute top-0 left-0 h-full origin-left"
                  style={{ backgroundColor: activeSeason.color, width: '100%' }}
                  animate={{ scaleX: hScroll.progress }}
                  transition={{ type: 'spring', stiffness: 80, damping: 30 }}
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: rgba(WARM.stone, 0.35) }}>
                {lang === 'ru' ? 'Прокрутите' : lang === 'kz' ? 'Жылжытыңыз' : 'Scroll'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-0 overflow-hidden" style={{ backgroundColor: WARM.mid }}>
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[75vh]">

            <div className="relative flex flex-col">
              <motion.div
                className="relative h-[35vh] lg:h-[55%] overflow-hidden"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.4, ease: FILM_EASE }}
              >
                <img
                  src="https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg"
                  alt="Kazakhstan steppe at golden hour"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${WARM.mid})` }} />
              </motion.div>

              <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12 lg:py-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: FILM_EASE }}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] block mb-6" style={{ color: `${activeSeason.color}90` }}>
                    {lang === 'ru' ? 'Kendala в цифрах' : lang === 'kz' ? 'Kendala сандарда' : 'Kendala in numbers'}
                  </span>
                  <div className="flex items-baseline gap-4 mb-4">
                    <AnimatedCounter target="69" color={activeSeason.color} />
                  </div>
                  <p className="text-sm md:text-base leading-relaxed max-w-xs" style={{ color: `${WARM.sand}70` }}>
                    {lang === 'ru'
                      ? 'Уникальных направлений — от каньонов Чарына до песков Алтын-Эмеля'
                      : lang === 'kz'
                      ? 'Бірегей баыттар — Шарын шатқалынан Алтынемел құмына дейін'
                      : 'Unique destinations mapped — from Charyn Canyon to the sands of Altyn-Emel'}
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col" style={{ borderLeft: `1px solid ${WARM.cream}08` }}>
              {[
                {
                  value: '14',
                  title: lang === 'ru' ? 'Регионов' : lang === 'kz' ? 'Аймақ' : 'Regions',
                  desc: lang === 'ru' ? 'От западного Мангыстау до восточного Алтая — каждый регион раскрыт'
                    : lang === 'kz' ? 'Батыс Маңғыстаудан шығыс Алтайға дейін — әр аймақ ашылды'
                    : 'From western Mangystau to eastern Altai — every region uncovered',
                },
                {
                  value: '3',
                  title: lang === 'ru' ? 'Категории' : lang === 'kz' ? 'Санат' : 'Categories',
                  desc: lang === 'ru' ? 'Природа, культура и приключения — три грани одного путешествия'
                    : lang === 'kz' ? 'Табиғат, мәдениет және оқиға — бір саяхаттың үш қыры'
                    : 'Nature, culture & adventure — three facets of a single journey',
                },
                {
                  value: 'AI',
                  title: lang === 'ru' ? 'Интеллект' : lang === 'kz' ? 'Интеллект' : 'Intelligence',
                  desc: lang === 'ru' ? 'Персональный гид, который знает каждую тропу и каждую историю'
                    : lang === 'kz' ? 'Әр соқпақты және әр тарихты білетін жеке гид'
                    : 'A personal guide that knows every trail and every story',
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.value}
                  className="flex-1 flex items-start px-8 md:px-14 lg:px-16 py-10 lg:py-0 lg:items-center"
                  style={{ borderBottom: i < 2 ? `1px solid ${WARM.cream}08` : 'none' }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: FILM_EASE }}
                >
                  <div className="flex items-start gap-6 md:gap-10 w-full">
                    <div className="shrink-0">
                      <AnimatedCounter target={stat.value} color={activeSeason.color} />
                    </div>
                    <div className="pt-2 md:pt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] block mb-2" style={{ color: WARM.cream }}>{stat.title}</span>
                      <p className="text-[13px] leading-relaxed max-w-[280px]" style={{ color: `${WARM.sand}50` }}>
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="relative" style={{ backgroundColor: WARM.dark }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-6">
          <CinematicReveal>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-10 h-[2px]"
                style={{ backgroundColor: activeSeason.color }}
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: FILM_EASE }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.45em]" style={{ color: rgba(WARM.cream, 0.4) }}>
                {lang === 'ru' ? 'Возможности' : lang === 'kz' ? 'Мүмкіндіктер' : 'Capabilities'}
              </span>
            </div>
          </CinematicReveal>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[0.85]"
            style={{ color: WARM.cream }}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, ease: FILM_EASE }}
          >
            {lang === 'ru' ? 'Создано' : lang === 'kz' ? 'Табиғат' : 'Crafted'}{' '}
            <span style={{ color: activeSeason.color }}>{lang === 'ru' ? 'природой' : lang === 'kz' ? 'жасаған' : 'by nature'}</span>
          </motion.h2>
        </div>

        {features.slice(0, 4).map((feat, i) => (
          <FeatureBleedCard key={feat.key} feat={feat} index={i + 1} lang={lang} onNavigate={onNavigate} />
        ))}

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: rgba(WARM.cream, 0.08) }}>
            {features.slice(4).map((feat, i) => (
              <FeatureGridCard key={feat.key} feat={feat} index={i} lang={lang} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Guide Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-y" style={{ backgroundColor: WARM.mid, borderColor: `${WARM.cream}08` }}>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              className="relative z-10 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: FILM_EASE }}
            >
               <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6" style={{ color: activeSeason.color }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: activeSeason.color }}>
                    {lang === 'ru' ? 'AI-гид Kendala' : lang === 'kz' ? 'Kendala AI-гиді' : 'Kendala AI Guide'}
                  </span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.85] mb-6" style={{ color: WARM.cream }}>
                  {lang === 'ru' ? 'Ваш личный ' : lang === 'kz' ? 'Сіздің жеке ' : 'Your personal '} 
                  <span style={{ color: activeSeason.color }}>{lang === 'ru' ? 'кочевник' : lang === 'kz' ? 'көшпендіңіз' : 'nomad'}</span>
               </h2>
               <p className="text-sm md:text-base leading-relaxed mb-8 max-w-xl" style={{ color: rgba(WARM.sand, 0.7) }}>
                  {lang === 'ru' 
                    ? 'Спросите AI-гида о маршрутах, традициях или погоде. Он общается как дружелюбный местный житель и знает каждый уголок Великой Степи. Никаких шаблонных ответов — только живой опыт.'
                    : lang === 'kz'
                    ? 'AI-гидтен маршруттар, дәстүрлер немесе ауа райы туралы сұраңыз. Ол достық пейілді жергілікті тұрғын сияқты сөйлеседі және Ұлы Даланың әр түкпірін біледі. Тек шынайы тәжірибе.'
                    : 'Ask the AI guide about routes, traditions, or weather. It chats like a friendly local and knows every corner of the Great Steppe. No canned responses — only authentic experience.'}
               </p>
               <MagneticButton
                  onClick={() => onNavigate('ai')}
                  className="group flex items-center gap-4 py-4 px-8 border transition-all duration-500 hover:bg-white/5"
                  style={{ borderColor: `${activeSeason.color}40`, color: WARM.cream }}
               >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    {lang === 'ru' ? 'Начать диалог' : lang === 'kz' ? 'Диалогті бастау' : 'Start dialog'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" style={{ color: activeSeason.color }} />
               </MagneticButton>
            </motion.div>
            
            <motion.div 
              className="relative order-1 lg:order-2 h-[50vh] lg:h-[70vh] w-full overflow-hidden"
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: FILM_EASE }}
            >
               <img src="https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg" alt="AI Guide Background" className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
               
               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col gap-4 z-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    className="self-start max-w-[85%] md:max-w-[70%] p-5 backdrop-blur-md border shadow-2xl"
                    style={{ backgroundColor: `${WARM.darker}C0`, borderColor: `${WARM.cream}10` }}
                  >
                    <p className="text-xs md:text-sm font-medium leading-relaxed" style={{ color: WARM.cream }}>
                       {lang === 'ru' ? 'Привет! Хочу поехать на Чарын в выходные. Что взять с собой?' : lang === 'kz' ? 'Сәлем! Демалыста Шарынға барғым келеді. Өзіммен не алуым керек?' : 'Hi! I want to go to Charyn this weekend. What should I bring?'}
                    </p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}
                    className="self-end max-w-[90%] md:max-w-[75%] p-5 backdrop-blur-md border shadow-2xl"
                    style={{ backgroundColor: `${activeSeason.color}15`, borderColor: `${activeSeason.color}30` }}
                  >
                    <p className="text-xs md:text-sm font-medium leading-relaxed" style={{ color: WARM.cream }}>
                       {lang === 'ru' ? 'Салем! Отличный выбор. Днём там жарко, а к вечеру ветер, так что захвати куртку. И главное — побольше воды! Хочешь, составлю подробный план?' : lang === 'kz' ? 'Сәлем! Тамаша таңдау. Күндіз ыстық болады, ал кешке жел, сондықтан күрте алып ал. Ең бастысы — су көп ал! Толық жоспар құрып берейін бе?' : 'Salem! Great choice. It gets hot during the day, but windy by evening, so bring a jacket. And most importantly — lots of water! Shall I make a detailed plan?'}
                    </p>
                  </motion.div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ClosingSection lang={lang} activeSeason={activeSeason} t={t} onNavigate={onNavigate} />

      {/* UserGuide Modal */}
      <UserGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
    </PageTransition>
  );
};


const PhilosophySection = ({ id, lang, activeSeason, onNavigate }: {
  id: string; lang: 'en' | 'ru' | 'kz'; activeSeason: any; onNavigate: (p: string) => void;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const textY = useTransform(scrollYProgress, [0.1, 0.5], [40, 0]);
  
  return (
    <section id={id} ref={ref} className="relative py-28 md:py-40 overflow-hidden" style={{ backgroundColor: WARM.mid }}>
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <motion.div 
            style={{ y: textY }} 
            className="relative z-10 lg:col-span-5 order-2 lg:order-1 lg:-mr-20 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-[#2A2724]/90 to-[#2A2724]/60 backdrop-blur-md p-8 md:p-12 lg:p-16 border border-[#F5F1EC]/10 pointer-events-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-10" style={{ backgroundColor: activeSeason.color }} />
                <span className="text-[10px] font-black uppercase tracking-[0.45em]" style={{ color: rgba(WARM.cream, 0.5) }}>
                  {lang === 'ru' ? 'Философия' : lang === 'kz' ? 'Философия' : 'Philosophy'}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.9]" style={{ color: WARM.cream }}>
                {lang === 'ru' ? 'Рождённая' : lang === 'kz' ? 'Жерден' : 'Born from'} <br/>
                <span style={{ color: activeSeason.color }}>
                  {lang === 'ru' ? 'из земли' : lang === 'kz' ? 'туған' : 'the land'}
                </span>
              </h2>

              <p className="mt-8 text-sm md:text-base leading-[1.8]" style={{ color: rgba(WARM.sand, 0.8) }}>
                {lang === 'ru'
                  ? 'Каждый маршрут — дыхание степи. Каждое место — эхо кочевников. Kendala не показывает Казахстан — она даёт его прочувствовать.'
                  : lang === 'kz'
                  ? 'Әр маршрут — даланың тынысы. Әр мекен — көшпенділердің жаңғырығы. Kendala Қазақстанды көрсетпейді — оны сезінуге мүмкіндік береді.'
                  : 'Every route breathes with the steppe. Every place echoes the nomads. Kendala doesn\'t show Kazakhstan — it lets you feel it.'
                }
              </p>

              <MagneticButton
                onClick={() => onNavigate('places')}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] mt-10"
                style={{ color: activeSeason.color }}
              >
                <span>{lang === 'ru' ? 'Открыть места' : lang === 'kz' ? 'Мекендерді ашу' : 'Discover places'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-500" />
              </MagneticButton>
            </div>
          </motion.div>

          <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden aspect-[4/5] md:aspect-[16/10]">
            <motion.img
              src="https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/chapan.jpg"
              alt="Nomadic yurt in the mountains"
              style={{ scale: imgScale }}
              className="w-full h-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#2A2724]/40" />
          </div>
        </div>
      </div>
    </section>
  );
};


const FeatureBleedCard = ({ feat, index, lang, onNavigate }: {
  feat: any; index: number; lang: string; onNavigate: (p: string) => void;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const contentClip = useTransform(scrollYProgress, [0.15, 0.45], ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']);
  const numberY = useTransform(scrollYProgress, [0, 1], [-20, 60]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} id={`feat-${feat.key}`} className="relative w-full my-3 md:my-5">
      <div
        className="max-w-[95vw] md:max-w-[90vw] mx-auto relative h-[50vh] md:h-[75vh] overflow-hidden cursor-pointer group"
        onClick={() => onNavigate(feat.page)}
      >
        <motion.img
          src={feat.image} alt={feat.title}
          style={{ scale: imgScale, y: imgY }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="absolute inset-0" style={{
          background: isEven
            ? 'linear-gradient(to right, rgba(21,19,15,0.6), transparent)'
            : 'linear-gradient(to left, rgba(21,19,15,0.6), transparent)',
        }} />

        <motion.span
          className={`absolute top-0 ${isEven ? 'right-4 md:right-10' : 'left-4 md:left-10'} text-[#F5F1EC]/[0.05] text-[100px] md:text-[200px] font-black leading-none select-none`}
          style={{ y: numberY }}
        >
          {String(index).padStart(2, '0')}
        </motion.span>

        <motion.div
          style={{ clipPath: contentClip }}
          className={`absolute bottom-0 ${isEven ? 'left-0' : 'right-0'} p-7 md:p-14 max-w-xl`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 border border-[#F5F1EC]/20 flex items-center justify-center text-[#F5F1EC]/70 backdrop-blur-sm">{feat.icon}</div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#F5F1EC]/45">{feat.tag}</span>
          </div>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F5F1EC] leading-[0.88] mb-4">
            {feat.title}
          </h3>
          <p className="text-sm text-[#F5F1EC]/60 leading-relaxed max-w-sm mb-6 hidden md:block">{feat.desc}</p>
          <div className="flex items-center gap-3 text-[#F5F1EC]/40 group-hover:text-[#F5F1EC] transition-colors duration-700">
            <div className="h-px w-8 bg-current group-hover:w-14 transition-all duration-700" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em]">
              {lang === 'ru' ? 'Изуить' : lang === 'kz' ? 'Зерттеу' : 'Explore'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
          </div>
        </motion.div>

        <div className="absolute inset-0 border border-white/0 group-hover:border-white/[0.06] transition-colors duration-1000 pointer-events-none" />
      </div>
    </div>
  );
};


const FeatureGridCard = ({ feat, index, lang, onNavigate }: {
  feat: any; index: number; lang: string; onNavigate: (p: string) => void;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const theme = useSeason().theme;

  return (
    <motion.div
      ref={ref}
      id={`feat-${feat.key}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', ...SMOOTH_SPRING, delay: index * 0.12 }}
      className="group cursor-pointer relative"
      style={{ backgroundColor: WARM.dark }}
      onClick={() => onNavigate(feat.page)}
    >
      <div className="relative h-[240px] overflow-hidden">
        <motion.img
          src={feat.image} loading="lazy" alt={feat.title}
          style={{ y: imgY }}
          className="w-[115%] h-[140%] object-cover group-hover:scale-[1.06] transition-transform duration-[2.5s] ease-out -ml-[7%] -mt-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <div style={{ color: theme?.primary }}>{feat.icon}</div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: rgba(WARM.cream, 0.4) }}>{feat.tag}</span>
        </div>
        <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-2 leading-tight" style={{ color: WARM.cream }}>{feat.title}</h4>
        <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: rgba(WARM.cream, 0.5) }}>{feat.desc}</p>
        <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700" style={{ color: theme?.primary }}>
          <div className="h-px w-6 bg-current" />
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};


const ClosingSection = ({ lang, activeSeason, t, onNavigate }: {
  lang: string; activeSeason: any; t: (k: string) => string; onNavigate: (p: string) => void;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const titleScale = useTransform(scrollYProgress, [0.05, 0.45], [0.8, 1]);
  const titleOp = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);

  return (
    <section ref={ref} className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-16 overflow-hidden" style={{ backgroundColor: WARM.darker }}>
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <motion.img
          src="https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg"
          alt="" className="w-full h-full object-cover opacity-60" style={{ y: bgY }} loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to top, ${WARM.darker} 10%, ${WARM.darker}E8 30%, ${WARM.darker}BB 60%, ${WARM.dark}00 100%)`,
      }} />

      <div className="relative z-10 max-w-5xl space-y-10 md:space-y-14">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: FILM_EASE }}
        >
          <Mountain className="w-14 h-14 md:w-20 md:h-20 mx-auto" style={{ color: WARM.cream }} />
        </motion.div>

        <motion.h2
          style={{ scale: titleScale, opacity: titleOp }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.80]"
        >
          <span style={{ color: WARM.cream }}>{t('hero_world_awaits')}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: FILM_EASE }}
          className="text-xs md:text-sm uppercase tracking-[0.3em]"
          style={{ color: rgba(WARM.cream, 0.3) }}
        >
          {t('hero_built_for')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: FILM_EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6"
        >
          <MagneticButton
            onClick={() => onNavigate('ai')}
            className="w-full sm:w-auto px-14 py-5"
            style={{ backgroundColor: activeSeason.color, color: WARM.darker }}
          >
            <div className="flex items-center justify-center gap-3">
              <Brain className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('hero_feat_ai_title')}</span>
            </div>
          </MagneticButton>
          <MagneticButton
            onClick={() => onNavigate('planner')}
            className="w-full sm:w-auto px-14 py-5 border"
            style={{ borderColor: rgba(WARM.cream, 0.12), color: WARM.cream }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('planner')}</span>
          </MagneticButton>
          <MagneticButton
            onClick={() => onNavigate('map')}
            className="w-full sm:w-auto px-14 py-5 border"
            style={{ borderColor: rgba(WARM.cream, 0.12), color: WARM.cream }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('map')}</span>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="pt-20 md:pt-28 flex flex-col sm:flex-row justify-between items-center w-full border-t gap-4"
          style={{ borderColor: rgba(WARM.cream, 0.07) }}
        >
          <span className="text-[10px] font-mono" style={{ color: rgba(WARM.cream, 0.25) }}>Kazakhstan</span>
          <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: rgba(WARM.cream, 0.18) }}>Kendala &copy; 2026</p>
        </motion.div>
      </div>
    </section>
  );
};