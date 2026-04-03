import React, { useState, useRef, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import {
  Handshake, ArrowRight, ArrowLeft, Building, MapPin,
  Check, Star, Globe, BarChart3, Phone, Mail,
  ShieldCheck, Compass, CheckCircle, Image as ImageIcon,
  ChevronDown, Eye, Sparkles, Upload, TrendingUp,
  Crown, Copy, Zap, Users, Layers, Mountain,
} from '../ui/icons';
import { toast } from 'sonner@2.0.3';

const EASE = [0.16, 1, 0.3, 1] as const;

// ═══════════════════════════════════════════════════
// IMAGES
// ═══════════════════════════════════════════════════
const IMG_HERO = 'https://images.unsplash.com/photo-1637460640107-47c09113f312?w=1920&q=80&fm=webp&auto=format&fit=crop';
const IMG_SPLIT_1 = 'https://images.unsplash.com/photo-1751440407280-ccb983813c6c?w=1080&q=80&fm=webp&auto=format&fit=crop';
const IMG_SPLIT_2 = 'https://images.unsplash.com/photo-1657823963906-0765abb2c850?w=1080&q=80&fm=webp&auto=format&fit=crop';
const IMG_CTA = 'https://images.unsplash.com/photo-1562595706-61433957484a?w=1920&q=80&fm=webp&auto=format&fit=crop';
const IMG_DIVIDER = 'https://images.unsplash.com/photo-1683334086574-5a7769553a98?w=1920&q=80&fm=webp&auto=format&fit=crop';

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════
type ListingType = 'stay' | 'place' | 'tour';
interface FormData {
  listingType: ListingType | ''; businessName: string; ownerName: string;
  email: string; phone: string; website: string; region: string; city: string;
  description: string; category: string; priceRange: string; amenities: string[];
  images: string; additionalInfo: string;
}
const initialForm: FormData = {
  listingType: '', businessName: '', ownerName: '', email: '', phone: '',
  website: '', region: '', city: '', description: '', category: '',
  priceRange: '', amenities: [], images: '', additionalInfo: '',
};

// ═══════════════════════════════════════════════════
// LOCALIZATION
// ═══════════════════════════════════════════════════
const tx = (lang: string, key: string): string => {
  const d: Record<string, Record<string, string>> = {
    hero_tag: { en: 'PARTNERSHIP PROGRAM', ru: 'ПРОГРАММА ПАРТНЁРСТВА', kz: 'СЕРІКТЕСТІК БАҒДАРЛАМАСЫ' },
    hero_t1: { en: 'BUILD THE', ru: 'СОЗДАЙТЕ', kz: 'БОЛАШАҚТЫ' },
    hero_t2: { en: 'FUTURE OF', ru: 'БУДУЩЕЕ', kz: 'ҚҰРЫҢЫЗ' },
    hero_t3: { en: 'TRAVEL', ru: 'ПУТЕШЕСТВИЙ', kz: 'САЯХАТТЫҢ' },
    hero_t4: { en: 'WITH US', ru: 'С НАМИ', kz: 'БІЗБЕН' },
    hero_sub: { en: 'Join 240+ businesses already growing with Kazakhstan\'s most innovative travel ecosystem. Your property, tour, or destination — seen by thousands of global explorers.', ru: 'Присоединяйтесь к 240+ бизнесам, которые растут вместе с самой инновационной экосистемой путешествий Казахстана.', kz: '240+ бизнеске қосылыңыз, олар Қазақстанның ең инновациялық саяхат экожүйесімен бірге өсуде.' },
    start: { en: 'Apply Now', ru: 'Подать заявку', kz: 'Өтінім беру' },
    learn: { en: 'Explore Benefits', ru: 'Узнать больше', kz: 'Артықшылықтар' },
    stats_p: { en: 'Active Partners', ru: 'Активных партнёров', kz: 'Белсенді серіктестер' },
    stats_t: { en: 'Monthly Travelers', ru: 'Путешественников/мес', kz: 'Айлық саяхатшылар' },
    stats_r: { en: 'Regions Covered', ru: 'Регионов', kz: 'Аймақтар' },
    stats_s: { en: 'Satisfaction Rate', ru: 'Удовлетворённость', kz: 'Қанағаттану' },
    why_tag: { en: 'THE KENDALA ADVANTAGE', ru: 'ПРЕИМУЩЕСТВО KENDALA', kz: 'KENDALA АРТЫҚШЫЛЫҒЫ' },
    why_t: { en: 'Why the best choose us', ru: 'Почему лучшие выбирают нас', kz: 'Неге ең жақсылар бізді таңдайды' },
    how_tag: { en: 'THE PROCESS', ru: 'ПРОЦЕСС', kz: 'ПРОЦЕСС' },
    how_t: { en: 'Three steps to global visibility', ru: 'Три шага к мировой видимости', kz: 'Жаһандық көрінуге үш қадам' },
    tier_tag: { en: 'INVESTMENT', ru: 'ИНВЕСТИЦИЯ', kz: 'ИНВЕСТИЦИЯ' },
    tier_t: { en: 'Choose your tier', ru: 'Выберите уровень', kz: 'Деңгейді таңдаңыз' },
    card_tag: { en: 'YOUR DIGITAL IDENTITY', ru: 'ВАША ЦИФРОВАЯ ВИЗИТКА', kz: 'СІЗДІҢ ЦИФРЛЫҚ ВИЗИТКАҢЫЗ' },
    card_t: { en: 'A visit card as premium as your business', ru: 'Визитка, столь же премиальная, как ваш бизнес', kz: 'Бизнесіңіздей премиум визитка' },
    cta_t: { en: 'Your journey starts here', ru: 'Ваш путь начинается здесь', kz: 'Сіздің жолыңыз осында басталады' },
    step: { en: 'STEP', ru: 'ШАГ', kz: 'ҚАДАМ' },
    step1: { en: 'What are you listing?', ru: 'Что вы размещаете?', kz: 'Нені орналастырасыз?' },
    stay: { en: 'Accommodation', ru: 'Жильё', kz: 'Тұрғын үй' },
    stay_d: { en: 'Hotels, yurt camps, guesthouses, glamping', ru: 'Отели, юрточные лагеря, гостевые дома, глэмпинг', kz: 'Қонақ үйлер, киіз үй лагерьлері, глэмпинг' },
    place: { en: 'Destination', ru: 'Достопримечательность', kz: 'Бағыт' },
    place_d: { en: 'Natural sites, landmarks, sacred places', ru: 'Природные объекты, памятники, сакральные места', kz: 'Табиғи нысандар, ескерткіштер, киелі жерлер' },
    tour: { en: 'Tour / Experience', ru: 'Тур / Экскурсия', kz: 'Тур / Тәжірибе' },
    tour_d: { en: 'Guided tours, expeditions, experiences', ru: 'Экскурсии, экспедиции, культурные программы', kz: 'Экскурсиялар, экспедициялар' },
    step2: { en: 'Business details', ru: 'Данные бизнеса', kz: 'Бизнес мәліметтері' },
    biz: { en: 'Business Name', ru: 'Название бизнеса', kz: 'Бизнес атауы' },
    owner: { en: 'Contact Person', ru: 'Контактное лицо', kz: 'Байланыс тұлғасы' },
    email: { en: 'Email', ru: 'Почта', kz: 'Пошта' },
    phone: { en: 'Phone', ru: 'Телефон', kz: 'Телефон' },
    web: { en: 'Website (optional)', ru: 'Сайт (необязательно)', kz: 'Вебсайт (міндетті емес)' },
    step3: { en: 'Location & description', ru: 'Расположение и описание', kz: 'Орналасуы мен сипаттамасы' },
    region: { en: 'Region', ru: 'Регион', kz: 'Аймақ' },
    city: { en: 'City', ru: 'Город', kz: 'Қала' },
    desc: { en: 'Description', ru: 'Описание', kz: 'Сипаттама' },
    desc_h: { en: 'What makes your listing special?', ru: 'Что делает объект особенным?', kz: 'Нысаныңызды не ерекшелейді?' },
    cat: { en: 'Category', ru: 'Категория', kz: 'Санат' },
    price: { en: 'Price Range', ru: 'Цена', kz: 'Баға' },
    step4: { en: 'Final touches', ru: 'Финальные штрихи', kz: 'Соңғы штрихтер' },
    imgs: { en: 'Image URLs (comma-separated)', ru: 'URL изображений (через запятую)', kz: 'Сурет URL' },
    imgs_h: { en: 'Share your best photos', ru: 'Поделитесь лучшими фото', kz: 'Ең жақсы фотолар' },
    extra: { en: 'Anything else?', ru: 'Что-нибудь ещё?', kz: 'Тағы бір нәрсе?' },
    back: { en: 'Back', ru: 'Назад', kz: 'Артқа' },
    next: { en: 'Continue', ru: 'Далее', kz: 'Жалғастыру' },
    submit: { en: 'Submit Application', ru: 'Отправить заявку', kz: 'Өтінімді жіберу' },
    ok_t: { en: 'Welcome to the Network', ru: 'Добро пожаловать в сеть', kz: 'Желіге қош келдіңіз' },
    ok_d: { en: 'Your application has been received. Our team reviews within 48 hours. Here is your digital partner card — customize and share it.', ru: 'Ваша заявка получена. Команда рассмотрит в течение 48 часов. Вот ваша цифровая партнёрская карта.', kz: 'Өтініміңіз қабылданды. 48 сағат ішінде қарастырылады. Міне сіздің серіктестік картаңыз.' },
    ok_back: { en: 'Back to Start', ru: 'Вернуться', kz: 'Басына оралу' },
  };
  return d[key]?.[lang] || d[key]?.['en'] || key;
};

const REGIONS = ['Almaty', 'Astana', 'Turkestan', 'Mangystau', 'East Kazakhstan', 'Karaganda', 'Aktobe', 'Atyrau', 'North Kazakhstan', 'Kostanay', 'Pavlodar', 'Zhambyl', 'South Kazakhstan', 'West Kazakhstan', 'Akmola'];
const STAY_CATS = ['Hotel', 'Yurt Camp', 'Guesthouse', 'Glamping', 'Hostel', 'Eco-Lodge', 'Resort', 'Apartment'];
const PLACE_CATS = ['Natural Wonder', 'Sacred Site', 'Historical Monument', 'National Park', 'Cultural Landmark', 'Museum', 'Canyon', 'Lake'];
const TOUR_CATS = ['Adventure', 'Cultural', 'Wildlife', 'Hiking', 'Photography', 'Culinary', 'Historical', 'Expedition'];
const AMENITIES = ['Wi-Fi', 'Parking', 'Restaurant', 'Hot Water', 'Heating', 'Air Conditioning', 'Airport Transfer', 'Guide Service', 'Horse Riding', 'Kitchen', 'Laundry', 'EV Charging'];

// ═══════════════════════════════════════════════════
// ANIMATED SECTION WRAPPER
// ═══════════════════════════════════════════════════
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════
// VISIT CARD
// ═══════════════════════════════════════════════════
const VisitCard = ({ form, accentColor, cardStyle }: { form: FormData; accentColor: string; cardStyle: string }) => {
  const TypeIcon = form.listingType === 'stay' ? Building : form.listingType === 'tour' ? Compass : MapPin;
  const typeLabel = form.listingType === 'stay' ? 'Accommodation' : form.listingType === 'tour' ? 'Tour / Experience' : 'Destination';

  const styles: Record<string, { bg: string; fg: string; muted: string; accent: string }> = {
    obsidian: { bg: '#08080a', fg: '#f0f0f0', muted: 'rgba(255,255,255,0.30)', accent: accentColor },
    ivory: { bg: '#faf9f6', fg: '#1a1a18', muted: 'rgba(0,0,0,0.30)', accent: accentColor },
    gold: { bg: '#110e08', fg: accentColor, muted: `${accentColor}55`, accent: accentColor },
    slate: { bg: '#16181d', fg: '#a0aec0', muted: 'rgba(160,174,192,0.30)', accent: '#64748b' },
  };
  const s = styles[cardStyle] || styles.obsidian;

  return (
    <motion.div
      className="w-full max-w-[520px] aspect-[1.78/1] overflow-hidden relative group cursor-pointer"
      whileHover={{ scale: 1.015, rotateY: 1.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ background: s.bg, boxShadow: `0 40px 80px -20px ${s.accent}15, 0 0 0 1px ${s.accent}10, 0 30px 60px -30px rgba(0,0,0,0.5)` }}
    >
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-[0.08]" style={{ backgroundColor: s.accent }} />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-[60px] opacity-[0.05]" style={{ backgroundColor: s.accent }} />

      {/* Top border line */}
      <div className="absolute top-0 inset-x-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}30, transparent)` }} />

      <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-9">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center backdrop-blur-xl" style={{ background: `${s.accent}12`, border: `1px solid ${s.accent}18` }}>
              <Globe className="w-4 h-4" style={{ color: s.accent }} />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: s.accent }}>Kendala</div>
              <div className="text-[7px] font-black uppercase tracking-[0.25em]" style={{ color: s.muted }}>Verified Partner</div>
            </div>
          </div>
          {form.listingType && (
            <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: `${s.accent}08`, border: `1px solid ${s.accent}12` }}>
              <TypeIcon className="w-3 h-3" style={{ color: s.accent }} />
              <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: s.accent }}>{typeLabel}</span>
            </div>
          )}
        </div>

        {/* Business */}
        <div className="space-y-1.5">
          <h3 className="text-2xl md:text-[28px] font-black uppercase tracking-tight leading-[0.95]" style={{ color: s.fg }}>
            {form.businessName || 'Your Business Name'}
          </h3>
          {(form.region || form.city) && (
            <div className="flex items-center gap-1.5" style={{ color: s.muted }}>
              <MapPin className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{form.city ? `${form.city}, ` : ''}{form.region}</span>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: s.fg }}>{form.ownerName || 'Your Name'}</div>
            <div className="flex items-center gap-4 flex-wrap">
              {form.email && <div className="flex items-center gap-1.5" style={{ color: s.muted }}><Mail className="w-2.5 h-2.5" /><span className="text-[8px]">{form.email}</span></div>}
              {form.phone && <div className="flex items-center gap-1.5" style={{ color: s.muted }}><Phone className="w-2.5 h-2.5" /><span className="text-[8px]">{form.phone}</span></div>}
            </div>
          </div>
          {/* QR */}
          <div className="w-14 h-14 p-1.5 shrink-0" style={{ border: `1px solid ${s.accent}12` }}>
            <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[1px]">
              {[...Array(25)].map((_, i) => <div key={i} className="" style={{ backgroundColor: (i % 3 === 0 || i % 7 === 0) ? `${s.accent}35` : 'transparent' }} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {/* Bottom border */}
      <div className="absolute bottom-0 inset-x-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.accent}15, transparent)` }} />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export const PartnerPage = () => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const lang = language || 'en';
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [cardStyle, setCardStyle] = useState('obsidian');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (!theme) return null;

  const up = (field: keyof FormData, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleAm = (a: string) => setForm(prev => ({ ...prev, amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a] }));
  const canGo = (s: number) => s === 1 ? form.listingType !== '' : s === 2 ? !!(form.businessName && form.ownerName && form.email) : s === 3 ? !!(form.region && form.description) : true;
  const cats = form.listingType === 'stay' ? STAY_CATS : form.listingType === 'place' ? PLACE_CATS : TOUR_CATS;
  const inputCls = 'w-full px-5 py-4 border bg-transparent text-sm transition-all focus:outline-none focus:ring-2';

  const cardStyles = [
    { id: 'obsidian', label: 'Obsidian', dot: '#0a0a0a' },
    { id: 'ivory', label: 'Ivory', dot: '#faf9f6' },
    { id: 'gold', label: 'Royal', dot: theme.primary },
    { id: 'slate', label: 'Slate', dot: '#334155' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: theme.background, color: theme.text, fontFamily: 'Montserrat, sans-serif' }}>

        {/* ═══════════════════════════════ LANDING ═══ */}
        {step === 0 && (
          <div>
            {/* ── HERO ── */}
            <section ref={heroRef} className="relative h-[105vh] overflow-hidden flex items-end">
              <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
                <ResponsiveImage src={IMG_HERO} className="w-full h-full object-cover" priority />
              </motion.div>
              {/* Multi-layer gradient */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.background}20 0%, ${theme.background}40 25%, ${theme.background}bb 55%, ${theme.background} 85%)` }} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.background}80 0%, transparent 60%)` }} />

              <motion.div style={{ opacity: heroOp }} className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24 max-w-[1800px] mx-auto">
                <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: EASE }}>
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 border backdrop-blur-2xl mb-10" style={{ borderColor: `${theme.primary}30`, background: `${theme.primary}08` }}>
                    <Handshake className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                    <span className="text-[8px] font-black uppercase tracking-[0.6em]" style={{ color: theme.primary }}>{tx(lang, 'hero_tag')}</span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-[-0.04em] leading-[0.8] mb-10">
                    <span className="block opacity-50">{tx(lang, 'hero_t1')}</span>
                    <span className="block" style={{ color: theme.primary }}>{tx(lang, 'hero_t2')}</span>
                    <span className="block">{tx(lang, 'hero_t3')}</span>
                    <span className="block opacity-20">{tx(lang, 'hero_t4')}</span>
                  </h1>

                  <p className="text-sm md:text-base opacity-50 max-w-2xl mb-14 leading-relaxed">{tx(lang, 'hero_sub')}</p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setStep(1)} className="group px-14 py-7 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-5 transition-all duration-700 hover:-translate-y-1" style={{ backgroundColor: theme.primary, color: theme.primaryForeground, boxShadow: `0 20px 50px -12px ${theme.primary}40` }}>
                      <span>{tx(lang, 'start')}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 opacity-40 hover:opacity-70 transition-all border" style={{ borderColor: `${theme.text}10` }}>
                      <ChevronDown className="w-4 h-4" />
                      <span>{tx(lang, 'learn')}</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* ── STATS RIBBON ── */}
            <section className="relative -mt-1 z-20">
              <div className="max-w-[1800px] mx-auto px-6 md:px-16">
                <div className="backdrop-blur-2xl border overflow-hidden" style={{ borderColor: `${theme.text}06`, background: `${theme.background}cc` }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: `${theme.text}06` }}>
                    {[
                      { v: '240+', l: tx(lang, 'stats_p'), icon: Handshake },
                      { v: '18K', l: tx(lang, 'stats_t'), icon: Users },
                      { v: '14', l: tx(lang, 'stats_r'), icon: MapPin },
                      { v: '98%', l: tx(lang, 'stats_s'), icon: Star },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <Reveal key={i} delay={i * 0.06} className="py-10 md:py-14 text-center relative">
                          <Icon className="w-4 h-4 mx-auto mb-3 opacity-20" />
                          <div className="text-3xl md:text-5xl font-black tracking-tighter" style={{ color: theme.primary }}>{s.v}</div>
                          <div className="text-[7px] font-black uppercase tracking-[0.5em] opacity-25 mt-2">{s.l}</div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-32 md:py-48">
              <div className="max-w-[1800px] mx-auto px-6 md:px-16">
                <Reveal className="mb-20 md:mb-32">
                  <span className="text-[8px] font-black uppercase tracking-[0.7em] opacity-25 block mb-5">{tx(lang, 'how_tag')}</span>
                  <h2 className="text-3xl md:text-6xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.82] max-w-5xl">{tx(lang, 'how_t')}</h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {[
                    { n: '01', icon: Upload, t: lang === 'ru' ? 'Подайте заявку' : lang === 'kz' ? 'Өтінім беріңіз' : 'Apply', d: lang === 'ru' ? 'Заполните 4-шаговую форму с данными бизнеса, локацией и фотографиями.' : lang === 'kz' ? '4 қадамдық нысанды толтырыңыз.' : 'Fill out a simple 4-step form with your business details, location, and visuals.' },
                    { n: '02', icon: ShieldCheck, t: lang === 'ru' ? 'Пройдите верификацию' : lang === 'kz' ? 'Верификациядан өтіңіз' : 'Get Verified', d: lang === 'ru' ? 'Наша команда проверит заявку в течение 48 часов.' : lang === 'kz' ? 'Біздің команда 48 сағатта қарайды.' : 'Our team verifies authenticity and quality within 48 hours. No shortcuts.' },
                    { n: '03', icon: TrendingUp, t: lang === 'ru' ? 'Растите' : lang === 'kz' ? 'Өсіңіз' : 'Grow', d: lang === 'ru' ? 'Листинг размещён. AI рекомендует вас путешественникам.' : lang === 'kz' ? 'AI саяхатшыларға ұсынады.' : 'Your listing goes live. AI recommends you to travelers. Watch your bookings grow.' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <Reveal key={i} delay={i * 0.12} className={`relative p-10 md:p-16 border transition-all duration-500 group hover:shadow-2xl ${i === 1 ? 'md:border-x' : ''}`} style={{ borderColor: `${theme.text}06` }}>
                        {/* Huge number bg */}
                        <div className="absolute top-6 right-8 text-[120px] md:text-[180px] font-black tracking-tighter leading-none opacity-[0.02] select-none pointer-events-none">{s.n}</div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 flex items-center justify-center mb-10 transition-transform group-hover:scale-110" style={{ background: `${theme.primary}08` }}>
                            <Icon className="w-7 h-7" style={{ color: theme.primary }} />
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 mb-4">{tx(lang, 'step')} {s.n}</div>
                          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">{s.t}</h3>
                          <p className="text-xs opacity-40 leading-relaxed max-w-xs">{s.d}</p>
                        </div>
                        {/* Hover accent line */}
                        <div className="absolute bottom-0 left-10 right-10 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" style={{ backgroundColor: theme.primary }} />
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── SPLIT BENEFIT PANELS ── */}
            <section id="benefits" className="py-0">
              {[
                {
                  img: IMG_SPLIT_1, flip: false,
                  tag: lang === 'ru' ? 'ГЛОБАЛЬНАЯ АУДИТОРИЯ' : lang === 'kz' ? 'ЖАҺАНДЫҚ АУДИТОРИЯ' : 'GLOBAL REACH',
                  title: lang === 'ru' ? 'Мы приводим к вам весь мир' : lang === 'kz' ? 'Бүкіл әлемді сізге жеткіземіз' : 'We bring the world to your door',
                  items: [
                    { icon: Globe, t: lang === 'ru' ? 'Трёхъязычная платформа' : 'Trilingual Platform', d: lang === 'ru' ? 'EN / RU / KZ — мгновенный перевод вашего листинга' : 'EN / RU / KZ — your listing instantly translated' },
                    { icon: Sparkles, t: lang === 'ru' ? 'AI-рекомендации' : 'AI Recommendations', d: lang === 'ru' ? 'Наш AI-планировщик рекомендует вас путешественникам' : 'Our AI trip planner actively recommends your business' },
                    { icon: Eye, t: lang === 'ru' ? 'Премиум-подача' : 'Premium Presentation', d: lang === 'ru' ? 'Кинематографичные фото, 3D-облёты, редакционный контент' : 'Cinematic imagery, 3D flyovers, editorial stories' },
                  ]
                },
                {
                  img: IMG_SPLIT_2, flip: true,
                  tag: lang === 'ru' ? 'БИЗНЕС-ИНСТРУМЕНТЫ' : lang === 'kz' ? 'БИЗНЕС ҚҰРАЛДАРЫ' : 'BUSINESS TOOLS',
                  title: lang === 'ru' ? 'Управляйте и масштабируйте' : lang === 'kz' ? 'Басқарыңыз және масштабтаңыз' : 'Manage, measure, scale',
                  items: [
                    { icon: BarChart3, t: lang === 'ru' ? 'Аналитика реального времени' : 'Real-Time Analytics', d: lang === 'ru' ? 'Просмотры, конверсии, бронирования — всё в одной панели' : 'Views, engagement, booking conversions — one dashboard' },
                    { icon: ShieldCheck, t: lang === 'ru' ? 'Верифицированный бейдж' : 'Verified Badge', d: lang === 'ru' ? 'Повышайте доверие с отметкой верификации' : 'Build traveler trust with our verification mark' },
                    { icon: Crown, t: lang === 'ru' ? 'Приоритетное размещение' : 'Priority Placement', d: lang === 'ru' ? 'Премиум-партнёры отображаются первыми в поиске' : 'Premium partners appear first in search and AI results' },
                  ]
                },
              ].map((panel, pi) => (
                <div key={pi} className={`flex flex-col ${panel.flip ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[80vh]`}>
                  {/* Image */}
                  <Reveal className="flex-1 relative overflow-hidden min-h-[40vh]">
                    <ResponsiveImage src={panel.img} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(${panel.flip ? '270deg' : '90deg'}, ${theme.background}dd 0%, ${theme.background}40 40%, transparent 80%)` }} />
                  </Reveal>
                  {/* Content */}
                  <div className="flex-1 flex items-center">
                    <div className="px-8 md:px-20 py-20 md:py-0 max-w-2xl">
                      <Reveal>
                        <span className="text-[8px] font-black uppercase tracking-[0.7em] opacity-25 block mb-5">{panel.tag}</span>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.85] mb-12">{panel.title}</h3>
                      </Reveal>
                      <div className="space-y-8">
                        {panel.items.map((item, ii) => {
                          const Icon = item.icon;
                          return (
                            <Reveal key={ii} delay={ii * 0.1} className="flex items-start gap-5 group">
                              <div className="w-12 h-12 flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: `${theme.primary}08` }}>
                                <Icon className="w-5 h-5" style={{ color: theme.primary }} />
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-wider mb-1.5">{item.t}</h4>
                                <p className="text-xs opacity-40 leading-relaxed">{item.d}</p>
                              </div>
                            </Reveal>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* ── VISIT CARD SHOWCASE ── */}
            <section className="py-32 md:py-48 overflow-hidden">
              <div className="max-w-[1800px] mx-auto px-6 md:px-16">
                <Reveal className="text-center mb-20">
                  <span className="text-[8px] font-black uppercase tracking-[0.7em] opacity-25 block mb-5">{tx(lang, 'card_tag')}</span>
                  <h2 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.82]">
                    {tx(lang, 'card_t')}
                  </h2>
                  <p className="text-sm opacity-35 max-w-lg mx-auto mt-8 leading-relaxed">
                    {lang === 'ru' ? 'Каждый партнёр получает роскошную цифровую визитку. Выберите стиль, поделитесь одним касанием.' : 'Every partner receives a luxurious digital business card. Choose your style, share with one tap.'}
                  </p>
                </Reveal>

                <div className="flex justify-center mb-10">
                  <VisitCard
                    form={{ ...initialForm, listingType: 'stay', businessName: "Eagle's Nest Yurt Camp", ownerName: 'Askar Nomadov', email: 'askar@eaglesnest.kz', phone: '+7 701 234 5678', region: 'Almaty', city: 'Turgen Valley', description: '', category: '', priceRange: '', amenities: [], images: '', additionalInfo: '' }}
                    accentColor={theme.primary}
                    cardStyle={cardStyle}
                  />
                </div>

                <div className="flex justify-center gap-3">
                  {cardStyles.map(cs => (
                    <button key={cs.id} onClick={() => setCardStyle(cs.id)} className={`flex items-center gap-2.5 px-5 py-3 border text-[8px] font-black uppercase tracking-[0.25em] transition-all ${cardStyle === cs.id ? 'scale-105' : 'opacity-40 hover:opacity-70'}`} style={{ borderColor: cardStyle === cs.id ? `${theme.primary}40` : `${theme.text}08`, background: cardStyle === cs.id ? `${theme.primary}06` : 'transparent' }}>
                      <div className="w-4 h-4 border" style={{ backgroundColor: cs.dot, borderColor: `${theme.text}15` }} />
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CINEMATIC DIVIDER ── */}
            <section className="relative h-[60vh] overflow-hidden">
              <ResponsiveImage src={IMG_DIVIDER} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `${theme.background}e0` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Reveal className="text-center">
                  <div className="text-6xl md:text-[10rem] font-black uppercase tracking-[-0.04em] leading-[0.75] opacity-[0.04] select-none">
                    KENDALA<br />PARTNERS
                  </div>
                </Reveal>
              </div>
            </section>

            {/* ── TIERS ── */}
            <section className="py-32 md:py-48">
              <div className="max-w-[1800px] mx-auto px-6 md:px-16">
                <Reveal className="text-center mb-24">
                  <span className="text-[8px] font-black uppercase tracking-[0.7em] opacity-25 block mb-5">{tx(lang, 'tier_tag')}</span>
                  <h2 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] leading-[0.82]">{tx(lang, 'tier_t')}</h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
                  {[
                    {
                      name: 'EXPLORER', price: lang === 'ru' ? 'Бесплатно' : lang === 'kz' ? 'Тегін' : 'Free', per: '', featured: false,
                      desc: lang === 'ru' ? 'Базовое размещение' : 'Basic listing',
                      feats: [
                        lang === 'ru' ? 'Листинг на платформе' : 'Platform listing',
                        lang === 'ru' ? 'Трёхъязычный дисплей' : 'Trilingual display',
                        lang === 'ru' ? 'Видимость в поиске' : 'Search visibility',
                        lang === 'ru' ? 'Сбор отзывов' : 'Review collection',
                      ]
                    },
                    {
                      name: 'NOMAD', price: '$149', per: '/mo', featured: true,
                      desc: lang === 'ru' ? 'Премиум + аналитика' : 'Premium listing + analytics',
                      feats: [
                        lang === 'ru' ? 'Премиум-листинг' : 'Premium listing',
                        lang === 'ru' ? 'AI-рекомендации' : 'AI recommendations',
                        lang === 'ru' ? 'Панель аналитики' : 'Analytics dashboard',
                        lang === 'ru' ? 'Бейдж верификации' : 'Verified badge',
                        lang === 'ru' ? 'Приоритетная поддержка' : 'Priority support',
                        lang === 'ru' ? 'Продвижение в соцсетях' : 'Social promotion',
                      ]
                    },
                    {
                      name: 'KHAN', price: '$299', per: '/mo', featured: false,
                      desc: lang === 'ru' ? 'White-label + API' : 'White-label + API access',
                      feats: [
                        lang === 'ru' ? 'White-label платформа' : 'White-label platform',
                        lang === 'ru' ? 'API доступ' : 'API access',
                        lang === 'ru' ? 'Управление клиентами' : 'Client management',
                        lang === 'ru' ? 'Кастомный брендинг' : 'Custom branding',
                        lang === 'ru' ? 'Лидогенерация' : 'Lead generation',
                        lang === 'ru' ? 'Персональный менеджер' : 'Dedicated manager',
                      ]
                    },
                  ].map((tier, i) => (
                    <Reveal key={i} delay={i * 0.1} className={`relative p-10 md:p-14 border ${tier.featured ? 'md:-my-6 md:py-20 z-10' : ''} transition-all`} style={{ borderColor: tier.featured ? theme.primary : `${theme.text}06`, background: tier.featured ? `${theme.primary}04` : 'transparent' }}>
                      {tier.featured && (
                        <>
                          <div className="absolute top-0 left-8 right-8 h-[3px]" style={{ backgroundColor: theme.primary }} />
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-[7px] font-black uppercase tracking-[0.4em]" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                            {lang === 'ru' ? 'Популярный' : 'Most Popular'}
                          </div>
                        </>
                      )}
                      <div className="text-[8px] font-black uppercase tracking-[0.6em] opacity-30 mb-8">{tier.name}</div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-5xl md:text-6xl font-black tracking-tighter" style={{ color: tier.featured ? theme.primary : theme.text }}>{tier.price}</span>
                        {tier.per && <span className="text-xs opacity-25 font-black">{tier.per}</span>}
                      </div>
                      <p className="text-xs opacity-35 mb-10">{tier.desc}</p>
                      <div className="space-y-3.5">
                        {tier.feats.map((f, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center shrink-0" style={{ background: `${theme.primary}10` }}>
                              <Check className="w-3 h-3" style={{ color: theme.primary }} />
                            </div>
                            <span className="text-[11px] opacity-55">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setStep(1)} className={`w-full mt-12 py-5 text-[9px] font-black uppercase tracking-[0.35em] transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 ${tier.featured ? '' : 'border'}`} style={{ backgroundColor: tier.featured ? theme.primary : 'transparent', color: tier.featured ? theme.primaryForeground : theme.text, borderColor: tier.featured ? 'transparent' : `${theme.text}10` }}>
                        {tx(lang, 'start')}
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0">
                <ResponsiveImage src={IMG_CTA} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.background}dd 30%, ${theme.background}cc 70%, ${theme.background} 100%)` }} />
              </div>
              <div className="relative max-w-[1800px] mx-auto px-6 md:px-16 py-36 md:py-52 text-center">
                <Reveal>
                  <h3 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.82] mb-10 max-w-4xl mx-auto">{tx(lang, 'cta_t')}</h3>
                  <p className="text-sm opacity-35 max-w-lg mx-auto mb-16 leading-relaxed">{tx(lang, 'hero_sub')}</p>
                  <button onClick={() => setStep(1)} className="group px-16 py-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 hover:-translate-y-1 flex items-center gap-5 mx-auto" style={{ backgroundColor: theme.primary, color: theme.primaryForeground, boxShadow: `0 20px 50px -12px ${theme.primary}40` }}>
                    <Handshake className="w-5 h-5" />
                    <span>{tx(lang, 'start')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </Reveal>
              </div>
            </section>

            {/* Spacer for bottom nav */}
            <div className="h-24" />
          </div>
        )}

        {/* ═══════════════════════════════ FORM ═══ */}
        {step >= 1 && step <= 4 && (
          <div className="max-w-3xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-32">
            {/* Progress */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[8px] font-black uppercase tracking-[0.6em] opacity-25">{tx(lang, 'step')} {step} / 4</span>
                <span className="text-[8px] font-black uppercase tracking-[0.6em] opacity-25">{tx(lang, 'hero_tag')}</span>
              </div>
              <div className="h-[2px] w-full overflow-hidden" style={{ background: `${theme.text}06` }}>
                <motion.div className="h-full" style={{ backgroundColor: theme.primary }} initial={{ width: 0 }} animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.7, ease: EASE }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-12">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.85]">{tx(lang, 'step1')}</h2>
                  <div className="space-y-4">
                    {([
                      { type: 'stay' as ListingType, icon: Building, t: tx(lang, 'stay'), d: tx(lang, 'stay_d') },
                      { type: 'place' as ListingType, icon: Compass, t: tx(lang, 'place'), d: tx(lang, 'place_d') },
                      { type: 'tour' as ListingType, icon: MapPin, t: tx(lang, 'tour'), d: tx(lang, 'tour_d') },
                    ]).map(opt => {
                      const Icon = opt.icon;
                      const sel = form.listingType === opt.type;
                      return (
                        <button key={opt.type} onClick={() => up('listingType', opt.type)} className="relative w-full p-8 md:p-10 border-2 text-left transition-all duration-300 hover:shadow-lg flex items-start gap-6" style={{ borderColor: sel ? theme.primary : `${theme.text}08`, background: sel ? `${theme.primary}04` : 'transparent' }}>
                          {sel && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center" style={{ background: theme.primary }}><Check className="w-4 h-4" style={{ color: theme.primaryForeground }} /></motion.div>}
                          <div className="w-14 h-14 shrink-0 flex items-center justify-center" style={{ background: `${theme.primary}08` }}>
                            <Icon className="w-6 h-6" style={{ color: theme.primary }} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-wider mb-2">{opt.t}</h3>
                            <p className="text-xs opacity-35 leading-relaxed">{opt.d}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-12">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.85]">{tx(lang, 'step2')}</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'biz')} *</label>
                      <input type="text" value={form.businessName} onChange={e => up('businessName', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder="e.g. Eagle's Nest Yurt Camp" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'owner')} *</label><input type="text" value={form.ownerName} onChange={e => up('ownerName', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} /></div>
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'phone')}</label><input type="tel" value={form.phone} onChange={e => up('phone', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder="+7 (7xx) xxx-xxxx" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'email')} *</label><input type="email" value={form.email} onChange={e => up('email', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} /></div>
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'web')}</label><input type="url" value={form.website} onChange={e => up('website', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder="https://" /></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-12">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.85]">{tx(lang, 'step3')}</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'region')} *</label><select value={form.region} onChange={e => up('region', e.target.value)} className={`${inputCls} cursor-pointer`} style={{ borderColor: `${theme.text}10`, color: theme.text, backgroundColor: theme.background }}><option value="">—</option>{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                      <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'city')}</label><input type="text" value={form.city} onChange={e => up('city', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} /></div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-4">{tx(lang, 'cat')}</label>
                      <div className="flex flex-wrap gap-2">
                        {cats.map(c => (
                          <button key={c} onClick={() => up('category', c)} className="px-4 py-2.5 border text-[9px] font-black uppercase tracking-wider transition-all" style={{ borderColor: form.category === c ? theme.primary : `${theme.text}10`, backgroundColor: form.category === c ? `${theme.primary}08` : 'transparent', color: form.category === c ? theme.primary : theme.text }}>{c}</button>
                        ))}
                      </div>
                    </div>
                    <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'desc')} *</label><textarea value={form.description} onChange={e => up('description', e.target.value)} rows={5} className={`${inputCls} resize-none`} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder={tx(lang, 'desc_h')} /></div>
                    <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'price')}</label><input type="text" value={form.priceRange} onChange={e => up('priceRange', e.target.value)} className={inputCls} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder="e.g. $30 - $120" /></div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-12">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.85]">{tx(lang, 'step4')}</h2>
                  <div className="space-y-8">
                    {form.listingType === 'stay' && (
                      <div>
                        <label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-4">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {AMENITIES.map(a => {
                            const sel = form.amenities.includes(a);
                            return (
                              <button key={a} onClick={() => toggleAm(a)} className="flex items-center gap-3 px-4 py-3 border text-[9px] font-black uppercase tracking-wider transition-all text-left" style={{ borderColor: sel ? theme.primary : `${theme.text}10`, backgroundColor: sel ? `${theme.primary}06` : 'transparent' }}>
                                <div className="w-4 h-4 flex items-center justify-center shrink-0" style={{ backgroundColor: sel ? theme.primary : `${theme.text}08` }}>{sel && <Check className="w-3 h-3" style={{ color: theme.primaryForeground }} />}</div>
                                <span style={{ color: sel ? theme.primary : theme.text }}>{a}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3"><ImageIcon className="w-3 h-3 inline mr-2 -mt-0.5" />{tx(lang, 'imgs')}</label><textarea value={form.images} onChange={e => up('images', e.target.value)} rows={3} className={`${inputCls} resize-none`} style={{ borderColor: `${theme.text}10`, color: theme.text }} placeholder={tx(lang, 'imgs_h')} /></div>
                    <div><label className="block text-[8px] font-black uppercase tracking-[0.4em] opacity-35 mb-3">{tx(lang, 'extra')}</label><textarea value={form.additionalInfo} onChange={e => up('additionalInfo', e.target.value)} rows={4} className={`${inputCls} resize-none`} style={{ borderColor: `${theme.text}10`, color: theme.text }} /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t" style={{ borderColor: `${theme.text}06` }}>
              <button onClick={() => setStep(s => s === 1 ? 0 : s - 1)} className="flex items-center gap-3 px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] border transition-all hover:shadow-lg" style={{ borderColor: `${theme.text}10` }}>
                <ArrowLeft className="w-4 h-4" /><span>{tx(lang, 'back')}</span>
              </button>
              {step < 4 ? (
                <button onClick={() => canGo(step) && setStep(s => s + 1)} disabled={!canGo(step)} className="flex items-center gap-3 px-12 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-xl disabled:opacity-15 disabled:cursor-not-allowed" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                  <span>{tx(lang, 'next')}</span><ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => { toast.success(tx(lang, 'ok_t')); setStep(5); }} className="flex items-center gap-3 px-12 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-xl group" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                  <span>{tx(lang, 'submit')}</span><CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════ SUCCESS ═══ */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center py-24">
            <div className="max-w-2xl mx-auto px-6 space-y-14">
              <div className="text-center space-y-6">
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }} className="w-20 h-20 mx-auto flex items-center justify-center" style={{ background: `${theme.primary}10` }}>
                  <CheckCircle className="w-10 h-10" style={{ color: theme.primary }} />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{tx(lang, 'ok_t')}</h2>
                <p className="text-sm opacity-40 leading-relaxed max-w-md mx-auto">{tx(lang, 'ok_d')}</p>
              </div>

              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-8">
                <div className="text-center"><span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-25">YOUR PARTNER CARD</span></div>
                <div className="flex justify-center">
                  <VisitCard form={form} accentColor={theme.primary} cardStyle={cardStyle} />
                </div>

                <div className="flex justify-center gap-3">
                  {cardStyles.map(cs => (
                    <button key={cs.id} onClick={() => setCardStyle(cs.id)} className={`flex items-center gap-2 px-4 py-2.5 border text-[8px] font-black uppercase tracking-[0.2em] transition-all ${cardStyle === cs.id ? 'scale-105' : 'opacity-35 hover:opacity-60'}`} style={{ borderColor: cardStyle === cs.id ? `${theme.primary}40` : `${theme.text}06`, background: cardStyle === cs.id ? `${theme.primary}05` : 'transparent' }}>
                      <div className="w-3.5 h-3.5 border" style={{ backgroundColor: cs.dot, borderColor: `${theme.text}12` }} />
                      {cs.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                  <button onClick={() => { navigator.clipboard?.writeText(`Kendala Partner: ${form.businessName} — ${form.region}`); toast.success('Copied!'); }} className="flex items-center justify-center gap-2 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] border transition-all hover:shadow-lg" style={{ borderColor: `${theme.text}10` }}>
                    <Copy className="w-4 h-4" /> Share
                  </button>
                  <button onClick={() => { setStep(0); setForm(initialForm); }} className="flex items-center justify-center gap-2 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-xl" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                    <ArrowLeft className="w-4 h-4" /> {tx(lang, 'ok_back')}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center pt-10 border-t" style={{ borderColor: `${theme.text}04` }}>
                <div className="text-[7px] font-black uppercase tracking-[0.5em] opacity-15 mb-2">Partner ID</div>
                <div className="font-mono text-xs opacity-20 tracking-wider">KDL-{Math.random().toString(36).substring(2, 8).toUpperCase()}-{new Date().getFullYear()}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};
