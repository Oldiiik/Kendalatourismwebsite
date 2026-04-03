import React, { useState, useRef, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePremium, FREE_PLAN, PREMIUM_PLAN, PremiumPlan } from '../../contexts/PremiumContext';
import { useNavigate } from 'react-router';
import {
  Crown, Zap, MessageCircle, Shield, Package, BarChart3,
  Eye, Palette, Rocket, X, Check, ArrowRight, Star,
  Lock, Sparkles, Download, Brain,
  Globe, Calendar, CreditCard,
} from '../ui/icons';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { toast } from 'sonner@2.0.3';

const EASE = [0.16, 1, 0.3, 1] as const;
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5E6B8';

const HERO_BG = 'https://images.unsplash.com/photo-1771747131849-41056d3d9be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbHV4dXJ5JTIwZ29sZCUyMGRhcmslMjBlbGVnYW50JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0ODg4MDExfDA&ixlib=rb-4.1.0&q=80&w=1080';
const STEPPE_IMG = 'https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYXpha2hzdGFuJTIwc3RlcHBlJTIwdmFzdCUyMGdyZWVuJTIwc3VtbWVyfGVufDF8fHx8MTc3NDg4ODAxNnww&ixlib=rb-4.1.0&q=80&w=1080';
const MOUNTAIN_IMG = 'https://images.unsplash.com/photo-1730741498879-5e40c9a85470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLYXpha2hzdGFuJTIwbW91bnRhaW4lMjBsYW5kc2NhcGUlMjBkcmFtYXRpYyUyMGdvbGRlbnxlbnwxfHx8fDE3NzM4NDYxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080';

const tx = (lang: string, en: string, ru: string, kz: string) =>
  lang === 'ru' ? ru : lang === 'kz' ? kz : en;

/* ─── Scroll Reveal ─── */
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
};

/* ─── Floating Gold Particles ─── */
const GoldParticles = ({ count = 20 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[2px] h-[2px]"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: GOLD,
        }}
        animate={{
          y: [0, -(80 + Math.random() * 200)],
          opacity: [0, 0.6, 0],
          scale: [0, 1 + Math.random(), 0],
        }}
        transition={{
          duration: 4 + Math.random() * 6,
          repeat: Infinity,
          delay: Math.random() * 8,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

/* ─── Feature Showcase items ─── */
interface ShowcaseItem {
  icon: React.ElementType;
  title: (l: string) => string;
  desc: (l: string) => string;
  image: string;
}

const SHOWCASE: ShowcaseItem[] = [
  {
    icon: Brain,
    title: l => tx(l, 'AI Trip Constructor', 'AI Конструктор Поездок', 'AI Сапар Конструкторы'),
    desc: l => tx(l, 'Tell the AI where you want to go. It crafts a day-by-day itinerary with real places, GPS coordinates, costs, and local secrets — all in seconds.', 'Расскажите AI куда хотите. Он создаст маршрут по дням с реальными местами, GPS-координатами, ценами и местными секретами — за секунды.', 'AI-ға қайда барғыңыз келетінін айтыңыз. Ол нақты орындармен, GPS координаттарымен, бағалармен толық маршрут жасайды.'),
    image: MOUNTAIN_IMG,
  },
  {
    icon: Eye,
    title: l => tx(l, '50+ Hidden Gems', '50+ Скрытых Жемчужин', '50+ Жасырын Жауһар'),
    desc: l => tx(l, 'Access a curated database of secret spots that no guidebook mentions. Ancient petroglyphs, hidden canyons, sacred springs — with exact GPS pins.', 'Доступ к тайным местам, которых нет в путеводителях. Древние петроглифы, скрытые каньоны, священные источники — с точными GPS-координатами.', 'Ешбір жол нұсқаулығында жоқ құпия орындарға қол жетімділік. Ежелгі петроглифтер, жасырын каньондар, қасиетті бұлақтар.'),
    image: STEPPE_IMG,
  },
  {
    icon: MessageCircle,
    title: l => tx(l, 'Unlimited AI Chat', 'Безлимитный AI Чат', 'Шексіз AI Чат'),
    desc: l => tx(l, 'Ask anything about Kazakhstan. Culture, food, routes, weather, safety — your personal AI guide has no daily limits and speaks your language.', 'Спрашивайте что угодно о Казахстане. Культура, еда, маршруты, погода — ваш AI-ид без лимитов.', 'Қазақстан туралы кез келген сұрақ қойыңыз. AI гидіңіздің күнделікті шектеулері жоқ.'),
    image: HERO_BG,
  },
  {
    icon: Download,
    title: l => tx(l, 'Offline PDF Maps', 'PDF Карты Офлайн', 'Офлайн PDF Карталар'),
    desc: l => tx(l, 'Download your entire trip as a beautiful PDF with maps, directions, and emergency info. No internet needed in the wilderness.', 'Скачайте всю поездку в PDF с картами и маршрутами. Интернет в дикой природе не нужен.', 'Барлық сапарыңызды карталармен PDF форматында жүктеп алыңыз. Табиғатта интернет қажет емес.'),
    image: MOUNTAIN_IMG,
  },
];

/* ═══════════════════════════════════════════
   CHECKOUT MODAL
   ═══════════════════════════════════════════ */
const CheckoutModal = ({ open, onClose, onSuccess, language }: {
  open: boolean; onClose: () => void; onSuccess: () => void; language: string;
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetAndClose = () => { setStep('form'); setCardNumber(''); setExpiry(''); setCvc(''); setName(''); setErrors({}); onClose(); };

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const validate = () => {
    const e: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 13) e.card = 'Required';
    if (expiry.length < 5) e.expiry = 'MM/YY';
    if (cvc.length < 3) e.cvc = 'CVC';
    if (name.trim().length < 2) e.name = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => { if (!validate()) return; setStep('processing'); await new Promise(r => setTimeout(r, 2500)); setStep('success'); onSuccess(); };

  if (!open) return null;

  const inputStyle = (err?: string) => ({
    backgroundColor: '#1a1a1a',
    borderColor: err ? '#ef4444' : '#333',
    color: '#F5F1EC',
    fontFamily: 'Montserrat, sans-serif',
  });

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', fontFamily: 'Montserrat, sans-serif' }}
        onClick={resetAndClose}
      >
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }} onClick={e => e.stopPropagation()}
          className="w-full max-w-lg border overflow-hidden relative" style={{ backgroundColor: '#111', borderColor: '#333' }}
        >
          <GoldParticles count={8} />
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent 10%, ${GOLD} 50%, transparent 90%)` }} />

          <div className="px-8 pt-8 pb-5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: `${GOLD}40` }}>
                <Crown className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.15em]" style={{ color: '#F5F1EC' }}>
                  {step === 'success' ? tx(language, 'Welcome, Nomad', 'Добр пожаловать, Nomad', 'Қош келдіңіз, Nomad') : tx(language, 'Become a Nomad', 'Стать Nomad', 'Nomad болу')}
                </div>
                <div className="text-[8px] uppercase tracking-[0.3em] opacity-30 mt-0.5" style={{ color: GOLD }}>
                  {step === 'success' ? 'ALL FEATURES UNLOCKED' : '$20.00 / MONTH'}
                </div>
              </div>
            </div>
            <button onClick={resetAndClose} className="p-1.5 opacity-30 hover:opacity-60 transition-opacity"><X className="w-4 h-4" style={{ color: '#F5F1EC' }} /></button>
          </div>

          <div className="px-8 pb-8 relative z-10">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="p-4 mb-6 border" style={{ borderColor: `${GOLD}25`, backgroundColor: `${GOLD}08` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Nomad Plan</div>
                        <div className="text-[8px] opacity-40 mt-0.5" style={{ color: '#F5F1EC' }}>{tx(language, '7-day free trial, then $20/mo', '7 дней бесплатно, затем $20/мес', '7 күн тегін, содан кейін $20/ай')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black" style={{ color: GOLD }}>$0</div>
                        <div className="text-[7px] uppercase tracking-widest opacity-30" style={{ color: '#F5F1EC' }}>{tx(language, 'due today', 'к оплате', 'бүгін')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1.5" style={{ color: '#F5F1EC' }}>{tx(language, 'Cardholder Name', 'Имя на карте', 'Аты')}</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 text-sm border outline-none" style={inputStyle(errors.name)} />
                    </div>
                    <div>
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1.5" style={{ color: '#F5F1EC' }}>{tx(language, 'Card Number', 'Номер карты', 'Карта нөмірі')}</label>
                      <div className="relative">
                        <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 pr-12 text-sm border outline-none" style={inputStyle(errors.card)} />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" style={{ color: '#F5F1EC' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1.5" style={{ color: '#F5F1EC' }}>Expiry</label>
                        <input type="text" value={expiry} onChange={e => setExpiry(formatExp(e.target.value))} placeholder="MM/YY" className="w-full px-4 py-3 text-sm border outline-none" style={inputStyle(errors.expiry)} />
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1.5" style={{ color: '#F5F1EC' }}>CVC</label>
                        <input type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className="w-full px-4 py-3 text-sm border outline-none" style={inputStyle(errors.cvc)} />
                      </div>
                    </div>
                  </div>
                  <motion.button onClick={handleSubmit} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                    style={{ backgroundColor: GOLD, color: '#111' }}
                  ><Lock className="w-3.5 h-3.5" />{tx(language, 'Start Free Trial', 'Начать Бесплатно', 'Тегін Бастау')}</motion.button>
                  <div className="flex items-center justify-center gap-2 mt-3 opacity-20">
                    <Shield className="w-3 h-3" style={{ color: '#F5F1EC' }} />
                    <span className="text-[7px] uppercase tracking-[0.3em]" style={{ color: '#F5F1EC' }}>Secure · Cancel anytime</span>
                  </div>
                </motion.div>
              )}
              {step === 'processing' && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-6 border" style={{ borderColor: `${GOLD}30` }}>
                    <Sparkles className="w-6 h-6" style={{ color: GOLD }} />
                  </motion.div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#F5F1EC' }}>Processing...</div>
                </motion.div>
              )}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                    className="inline-flex items-center justify-center w-20 h-20 mb-8 border-2" style={{ borderColor: GOLD, backgroundColor: `${GOLD}10` }}>
                    <Check className="w-8 h-8" style={{ color: GOLD }} />
                  </motion.div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3" style={{ color: '#F5F1EC' }}>
                    {tx(language, "You're a Nomad!", 'Вы Nomad!', 'Сіз Nomad-сыз!')}
                  </h3>
                  <p className="text-xs opacity-35 mb-8" style={{ color: '#F5F1EC' }}>
                    {tx(language, 'All premium features unlocked. 7-day free trial started.', 'Все функции разблокированы. 7 дней бесплатно.', 'Барлық мүмкіндіктер ашылды.')}
                  </p>
                  <button onClick={resetAndClose} className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 mx-auto"
                    style={{ backgroundColor: GOLD, color: '#111' }}><Zap className="w-4 h-4" />{tx(language, 'Start Exploring', 'Начать', 'Бастау')}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export const PremiumPage = () => {
  const { theme } = useSeason();
  const { t, language } = useLanguage();
  const { isPremium, activate, deactivate } = usePremium();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroScale = useTransform(scrollY, [0, 600], [1.1, 1.3]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Auto-cycle showcase
  useEffect(() => {
    const timer = setInterval(() => setActiveShowcase(prev => (prev + 1) % SHOWCASE.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleActivateSuccess = () => {
    activate();
    toast.success(tx(language, 'Welcome to Nomad!', 'Добро пожаловать в Nomad!', 'Nomad-қа қош келдіңіз!'));
  };

  const FEATURES_GRID = [
    { icon: Brain, label: tx(language, 'AI Trip Constructor', 'AI Конструктор', 'AI Конструктор') },
    { icon: MessageCircle, label: tx(language, 'Unlimited AI Chat', 'Безлимитный AI', 'Шексіз AI') },
    { icon: Eye, label: tx(language, '50+ Hidden Gems', '50+ Жемчужин', '50+ Жауһар') },
    { icon: Download, label: tx(language, 'PDF + Maps Export', 'PDF + Карты', 'PDF + Карталар') },
    { icon: Shield, label: tx(language, 'Priority SOS + GPS', 'SOS + GPS', 'SOS + GPS') },
    { icon: Calendar, label: tx(language, 'Unlimited Trips', 'Безлимит Поездки', 'Шексіз Сапарлар') },
    { icon: Package, label: tx(language, 'Smart Packing AI', 'AI Упаковка', 'AI Жинау') },
    { icon: Globe, label: tx(language, '14-Day Weather', '14-Дневный Прогноз', '14 Күндік Ауа') },
    { icon: BarChart3, label: tx(language, 'Trip Analytics', 'Аналитика', 'Аналитика') },
    { icon: Palette, label: tx(language, '12+ App Themes', '12+ Тем', '12+ Тақырып') },
    { icon: Rocket, label: tx(language, 'Early Access', 'Ранний Доступ', 'Ерте Қол Жетімділік') },
    { icon: Crown, label: tx(language, 'Nomad Badge', 'Бейдж Nomad', 'Nomad Бейджі') },
  ];

  const faqs = [
    { q: tx(language, 'How does the 7-day free trial work?', 'Как работает 7-дневный бесплатный период?', '7 күндік тегін кезең қалай жұмыс істейді?'),
      a: tx(language, 'Full access for 7 days. No charge until the trial ends. Cancel before day 7 and pay nothing.', '7 дней полный доступ. Оплата только после пробного периода.', '7 күн толық қол жетімділік. Тегін кезең аяқталғанша ақы алынбайды.') },
    { q: tx(language, 'Can I cancel anytime?', 'Могу ли я отменить в любое время?', 'Кез келген уақытта бас тарта аламын ба?'),
      a: tx(language, 'Yes. One tap in your profile. Keep access until end of billing period.', 'Да. Одно нажатие в профиле. Доступ до конца периода.', 'Иә. Профиліңізде бір рет асыңыз.') },
    { q: tx(language, 'What payments are accepted?', 'Какие способы оплаты?', 'Қандай төлем әдістері?'),
      a: tx(language, 'Visa, Mastercard, Kaspi QR, Apple Pay. All payments encrypted.', 'Visa, Mastercard, Kaspi QR, Apple Pay. Шифрованная оплата.', 'Visa, Mastercard, Kaspi QR, Apple Pay. Шифрланған.') },
    { q: tx(language, 'Do I need Premium to use Kendala?', 'Нужен ли Premium?', 'Premium қажет пе?'),
      a: tx(language, 'No. Free plan includes all pages, 10 AI messages/day, 3 trips, basic SOS.', 'Нет. Бесплатный план: все страницы, 10 AI сообщений, 3 поездки.', 'Жоқ. Тегін жоспар: барлық беттер, 10 AI хабарлама, 3 сапар.') },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] text-[#F5F1EC]" style={{ fontFamily: 'Montserrat, sans-serif' }}>

        {/* ═══ CINEMATIC HERO ═══ */}
        <section className="relative h-screen overflow-hidden flex items-center justify-center">
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <ResponsiveImage src={HERO_BG} className="w-full h-full object-cover" priority />
          </motion.div>
          <div className="absolute inset-0 bg-[#0a0a0a]/60" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #0a0a0a 75%)' }} />
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent 5%, ${GOLD} 50%, transparent 95%)` }} />
          <GoldParticles count={25} />

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl">
            {/* Crown */}
            <motion.div initial={{ opacity: 0, scale: 0, rotate: -180 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: EASE }} className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 border-2 relative" style={{ borderColor: `${GOLD}40` }}>
                <Crown className="w-10 h-10" style={{ color: GOLD }} />
                <motion.div className="absolute inset-0 border" style={{ borderColor: `${GOLD}15` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px]" style={{ backgroundColor: GOLD }} />
              <span className="text-[9px] font-black uppercase tracking-[0.6em]" style={{ color: GOLD }}>KENDALA NOMAD</span>
              <div className="w-12 h-[1px]" style={{ backgroundColor: GOLD }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: EASE }}>
              <span className="block text-6xl sm:text-8xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter">
                {tx(language, 'Travel', 'Путешествуй', 'Саяхатта')}
              </span>
              <span className="block text-6xl sm:text-8xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter" style={{ color: GOLD }}>
                {tx(language, 'Without', 'Без', 'Шексіз')}
              </span>
              <span className="block text-6xl sm:text-8xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter">
                {tx(language, 'Limits', 'Границ', '')}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 0.8 }}
              className="text-xs uppercase tracking-[0.25em] mt-8 max-w-md mx-auto leading-relaxed">
              {tx(language, '$20/month after 7-day free trial. Cancel anytime.', '$20/мес после 7 дней бесплатно. Отмена в любой момент.', '$20/ай 7 күндік тегін кезеңнен кейін.')}
            </motion.p>

            {!isPremium && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                onClick={() => setShowCheckout(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="mt-10 px-14 py-5 text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-4"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}>
                <Zap className="w-4 h-4" />
                {tx(language, 'Start Free Trial', 'Попробовать Бесплатно', 'Тегін Бастау')}
              </motion.button>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-12" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
          </motion.div>
        </section>

        {/* ═══ FEATURE SHOWCASE — Cinematic split-screen ═══ */}
        <section className="relative py-0">
          {SHOWCASE.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={i}>
                <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[70vh] md:min-h-[80vh]`}>
                  {/* Image side */}
                  <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto overflow-hidden">
                    <ResponsiveImage src={item.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0a0a0a]/30" />
                    <div className={`absolute inset-0 ${i % 2 === 0 ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent to-[#0a0a0a] hidden md:block`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] md:hidden" />
                    <div className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center border" style={{ borderColor: `${GOLD}40`, backgroundColor: '#0a0a0a80' }}>
                      <span className="text-[10px] font-black" style={{ color: GOLD }}>0{i + 1}</span>
                    </div>
                  </div>
                  {/* Content side */}
                  <div className="w-full md:w-1/2 flex items-center px-8 md:px-16 lg:px-24 py-12 md:py-0">
                    <div className="max-w-lg">
                      <div className="w-14 h-14 flex items-center justify-center mb-8 border" style={{ borderColor: `${GOLD}30` }}>
                        <Icon className="w-6 h-6" style={{ color: GOLD }} />
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                        {item.title(language)}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed opacity-45 mb-8">
                        {item.desc(language)}
                      </p>
                      <div className="w-16 h-[2px]" style={{ backgroundColor: GOLD }} />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </section>

        {/* ═══ FEATURES GRID ═══ */}
        <section className="py-24 md:py-32 px-6 border-t border-white/5">
          <Reveal className="text-center mb-16">
            <span className="text-[8px] font-black uppercase tracking-[0.5em]" style={{ color: GOLD }}>
              {tx(language, 'Everything Included', 'Всё Включено', 'Барлығы Қамтылған')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-4 leading-[0.85]">
              {tx(language, '12 Premium', '12 Премиум', '12 Премиум')}<br />
              <span style={{ color: GOLD }}>{tx(language, 'Features', 'Функций', 'Мүмкіндік')}</span>
            </h2>
          </Reveal>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px]" style={{ backgroundColor: '#ffffff08' }}>
            {FEATURES_GRID.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 0.04}>
                  <motion.div whileHover={{ backgroundColor: `${GOLD}08` }}
                    className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col items-center text-center gap-4 h-full transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: `${GOLD}20` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: GOLD }} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] opacity-60 leading-snug">{f.label}</span>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ═══ PRICING — Dark dramatic ═══ */}
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <ResponsiveImage src={STEPPE_IMG} className="w-full h-full object-cover opacity-10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="text-[8px] font-black uppercase tracking-[0.5em]" style={{ color: GOLD }}>
                {tx(language, 'Choose Your Path', 'Выберите Путь', 'Жолыңызды Таңдаңыз')}
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-4">
                {tx(language, 'Simple Pricing', 'Простые Цены', 'Қарапайым Баға')}
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-[1px]">
              {/* FREE */}
              <Reveal>
                <div className="p-8 md:p-12 border border-white/5 bg-[#0a0a0a] h-full flex flex-col">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 mb-3">
                    {tx(language, 'Free Forever', 'Бесплатно Навсегда', 'Мәңгілік Тегін')}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-1">Explorer</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black">$0</span>
                  </div>
                  <div className="space-y-3 flex-1">
                    {['10 AI messages/day', '3 saved trips', 'Basic SOS', '4 themes', '3-day weather'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-3 h-3 shrink-0 opacity-25" />
                        <span className="text-xs opacity-35">{item}</span>
                      </div>
                    ))}
                  </div>
                  {!isPremium ? (
                    <div className="mt-8 py-3.5 text-center text-[9px] font-black uppercase tracking-[0.2em] border opacity-40" style={{ borderColor: `${GOLD}30`, color: GOLD }}>
                      <Check className="w-3 h-3 inline mr-2" />{tx(language, 'Current Plan', 'Текущий План', 'Ағымдағы')}
                    </div>
                  ) : (
                    <div className="mt-8 py-3.5 text-center text-[9px] font-black uppercase tracking-[0.2em] opacity-15 border border-white/5">Previous Plan</div>
                  )}
                </div>
              </Reveal>

              {/* NOMAD */}
              <Reveal delay={0.1}>
                <div className="p-8 md:p-12 border relative h-full flex flex-col overflow-hidden" style={{ borderColor: `${GOLD}30`, backgroundColor: '#0f0f0f' }}>
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: GOLD }} />
                  <div className="absolute top-0 right-0 w-40 h-40" style={{ background: `radial-gradient(circle at 100% 0%, ${GOLD}12, transparent 60%)` }} />
                  <GoldParticles count={6} />

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-3 h-3 fill-current" style={{ color: GOLD }} />
                      <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                        {tx(language, 'Recommended', 'Рекомендуемый', 'Ұсынылған')}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-1" style={{ color: GOLD }}>Nomad</h3>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black" style={{ color: GOLD }}>$20</span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">/month</span>
                    </div>
                    <div className="text-[8px] uppercase tracking-[0.3em] opacity-30 mb-8">7-day free trial</div>

                    <div className="space-y-3 flex-1">
                      {[
                        { t: 'Unlimited AI messages', gold: true },
                        { t: 'AI Trip Constructor', gold: true },
                        { t: '50+ Hidden Gems + GPS', gold: true },
                        { t: 'PDF Export + Maps', gold: false },
                        { t: 'Priority SOS + GPS', gold: false },
                        { t: 'Unlimited trips', gold: false },
                        { t: '14-day weather', gold: false },
                        { t: '12+ themes + badge', gold: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Check className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
                          <span className="text-xs" style={{ color: item.gold ? GOLD : '#F5F1EC', opacity: item.gold ? 1 : 0.45 }}>{item.t}</span>
                        </div>
                      ))}
                    </div>

                    {isPremium ? (
                      <div className="mt-8">
                        <div className="py-3.5 text-center text-[9px] font-black uppercase tracking-[0.2em] mb-3" style={{ backgroundColor: `${GOLD}12`, color: GOLD, border: `1px solid ${GOLD}30` }}>
                          <Check className="w-3 h-3 inline mr-2" />{tx(language, 'Active', 'Активный', 'Белсенді')}
                        </div>
                        <button onClick={() => setShowCancel(true)} className="w-full text-center text-[8px] font-black uppercase tracking-[0.2em] opacity-20 hover:opacity-40 transition-opacity py-2">
                          {tx(language, 'Cancel', 'Отменить', 'Бас тарту')}
                        </button>
                      </div>
                    ) : (
                      <motion.button onClick={() => setShowCheckout(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                        style={{ backgroundColor: GOLD, color: '#0a0a0a' }}>
                        <Zap className="w-4 h-4" />
                        {tx(language, 'Start 7-Day Free Trial', 'Начать Бесплатно', '7 Күн Тегін')}
                      </motion.button>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-20 md:py-28 px-6 border-t border-white/5">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="text-[8px] font-black uppercase tracking-[0.5em]" style={{ color: GOLD }}>FAQ</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mt-4">
                {tx(language, 'Questions', 'Вопросы', 'Сұрақтар')}
              </h2>
            </Reveal>
            {faqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <div key={i} className="border-b border-white/5">
                  <button onClick={() => setExpandedFaq(isOpen ? null : i)} className="w-full flex items-center justify-between py-5 px-2 text-left group">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-[8px] font-black shrink-0 w-5 text-center" style={{ color: isOpen ? GOLD : 'rgba(245,241,236,0.2)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.05em]" style={{ color: isOpen ? GOLD : '#F5F1EC' }}>
                        {faq.q}
                      </span>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 ml-4">
                      <div className="w-4 h-4 relative flex items-center justify-center">
                        <div className="absolute w-3 h-[1.5px]" style={{ backgroundColor: isOpen ? GOLD : 'rgba(245,241,236,0.2)' }} />
                        <div className="absolute h-3 w-[1.5px]" style={{ backgroundColor: isOpen ? GOLD : 'rgba(245,241,236,0.2)' }} />
                      </div>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="text-xs leading-relaxed pb-5 pl-11 pr-4 opacity-35">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        {!isPremium && (
          <section className="py-32 md:py-40 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <ResponsiveImage src={MOUNTAIN_IMG} className="w-full h-full object-cover opacity-15" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
            <GoldParticles count={15} />
            <Reveal className="relative z-10 max-w-2xl mx-auto">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ type: 'spring', damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-10 border-2" style={{ borderColor: `${GOLD}40` }}>
                <Crown className="w-8 h-8" style={{ color: GOLD }} />
              </motion.div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
                {tx(language, 'The steppe is calling', 'Степь зовёт', 'Дала шақырады')}
              </h2>
              <p className="text-xs uppercase tracking-[0.3em] opacity-25 mb-12">
                {tx(language, '7-day free trial · $20/month · Cancel anytime', '7 дней бесплатно · $20/мес · Отмена', '7 күн тегін · $20/ай')}
              </p>
              <motion.button onClick={() => setShowCheckout(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-16 py-5 text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-4"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}>
                <Zap className="w-5 h-5" />
                {tx(language, 'Start Free Trial', 'Начать Бесплатно', 'Тегін Бастау')}
              </motion.button>
            </Reveal>
          </section>
        )}

        {isPremium && (
          <section className="py-20 px-6 border-t border-white/5">
            <div className="max-w-lg mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 border" style={{ borderColor: `${GOLD}30`, backgroundColor: `${GOLD}08` }}>
                <Crown className="w-3.5 h-3.5" style={{ color: GOLD }} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: GOLD }}>Nomad Active</span>
              </div>
              <p className="text-xs opacity-30 mb-6">
                {tx(language, 'All features unlocked. Manage from your profile.', 'Все функции разблокированы. Управление в профиле.', 'Барлық мүмкіндіктер ашылды.')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => navigate('/profile')} className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30 hover:opacity-60 transition-opacity">Profile</button>
                <span className="opacity-10">|</span>
                <button onClick={() => { deactivate(); toast.success('Cancelled.'); }} className="text-[8px] font-black uppercase tracking-[0.2em] opacity-15 hover:opacity-30 transition-opacity">Cancel</button>
              </div>
            </div>
          </section>
        )}

        <div className="h-20" />

        <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} onSuccess={handleActivateSuccess} language={language} />
      </div>
    </PageTransition>
  );
};