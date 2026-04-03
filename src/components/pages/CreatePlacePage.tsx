import React, { useState, useEffect, useCallback } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  MapPin, ArrowRight, ArrowLeft, Check, X, Plus, Mountain,
  Loader2, ShieldCheck, AlertTriangle, CheckCircle, Eye, Clock,
  Compass, Star, Globe, Upload, Sparkles, ChevronDown,
} from '../ui/icons';

const SNAP = [0.16, 1, 0.3, 1] as const;

type PlaceType = 'nature' | 'sacred' | 'history';

interface PlaceForm {
  name: string;
  type: PlaceType | '';
  region: string;
  city: string;
  lat: string;
  lng: string;
  description: string;
  category: string;
  imageUrl: string;
  whySpecial: string;
}

interface VerificationCheck {
  check: string;
  passed: boolean;
  note: string;
}

interface VerificationResult {
  score: number;
  verdict: string;
  confidence: string;
  checks: VerificationCheck[];
  suggestion?: string;
}

interface SubmittedPlace {
  id: string;
  name: string;
  type: string;
  region: string;
  status: string;
  verificationResult: VerificationResult | null;
  createdAt: string;
}

const tx = (lang: string, key: string): string => {
  const t: Record<string, Record<string, string>> = {
    page_tag: { en: 'COMMUNITY PLACES', ru: 'МЕСТА ОТ ПУТЕШЕСТВЕННИКОВ', kz: 'ҚАУЫМДАСТЫҚ ЖЕРЛЕРІ' },
    hero_t1: { en: 'DISCOVER', ru: 'ОТКРОЙТЕ', kz: 'АШЫҢЫЗ' },
    hero_t2: { en: 'SOMETHING', ru: 'НОВОЕ', kz: 'ЖАҢА' },
    hero_t3: { en: 'NEW?', ru: 'МЕСТО?', kz: 'ЖЕРДІ?' },
    hero_sub: { en: 'Share a hidden gem with the world. Submit a place you\'ve discovered in Kazakhstan and our AI will verify its authenticity.', ru: 'Поделитесь скрытой жемчужиной. Отправьте место, которое вы открыли в Казахстане, и наш AI проверит его подлинность.', kz: 'Жасырын асыл тасты әлеммен бөлісіңіз. Қазақстаннан тапқан жеріңізді жіберіңіз.' },
    start: { en: 'Submit a Place', ru: 'Предложить место', kz: 'Жер ұсыну' },
    my_places: { en: 'My Submissions', ru: 'Мои заявки', kz: 'Менің өтінімдерім' },
    login_req: { en: 'You need to be logged in to submit places.', ru: 'Необходимо войти в систему для отправки мест.', kz: 'Жерлерді жіберу үшін жүйеге кіру керек.' },
    step: { en: 'STEP', ru: 'ШАГ', kz: 'ҚАДАМ' },
    s1_title: { en: 'What kind of place is it?', ru: 'Какой это тип места?', kz: 'Бұл қандай жер?' },
    type_nature: { en: 'Natural Wonder', ru: 'Природное чудо', kz: 'Табиғат ғажайыбы' },
    type_nature_d: { en: 'Lakes, canyons, mountains, waterfalls, unique landscapes', ru: 'Озёра, каньоны, горы, водопады, ландшафты', kz: 'Көлдер, каньондар, таулар, сарқырамалар' },
    type_sacred: { en: 'Sacred / Cultural', ru: 'Сакральное / Культурное', kz: 'Қасиетті / Мәдени' },
    type_sacred_d: { en: 'Mosques, mausoleums, pilgrimage sites, petroglyph sites', ru: 'Мечети, мавзолеи, места паломничества, петроглифы', kz: 'Мешіттер, мазарлар, зиярат орындары' },
    type_history: { en: 'Historical', ru: 'Историческое', kz: 'Тарихи' },
    type_history_d: { en: 'Ancient ruins, Soviet-era sites, fortifications, museums', ru: 'Древние руины, советские объекты, крепости, музеи', kz: 'Ежелгі қирандылар, кеңестік нысандар, бекіністер' },
    s2_title: { en: 'Location details', ru: 'Данные о расположении', kz: 'Орналасу мәліметтері' },
    name_label: { en: 'Place Name', ru: 'Название места', kz: 'Жер атауы' },
    name_ph: { en: 'e.g. Singing Dune of Altyn-Emel', ru: 'напр. Поющий бархан Алтын-Эмеля', kz: 'мыс. Алтын-Емел әнші құм' },
    region_label: { en: 'Region', ru: 'Регион', kz: 'Аймақ' },
    city_label: { en: 'Nearest Settlement', ru: 'Ближайший нас. пункт', kz: 'Ең жақын елді мекен' },
    lat_label: { en: 'Latitude', ru: 'Широта', kz: 'Ендік' },
    lng_label: { en: 'Longitude', ru: 'Долгота', kz: 'Бойлық' },
    coords_hint: { en: 'Optional but helps AI verification. Get from Google Maps.', ru: 'Необязательно, но помогает AI верификации.', kz: 'Міндетті емес, бірақ AI тексеруге көмектеседі.' },
    s3_title: { en: 'Tell the story', ru: 'Расскажите историю', kz: 'Тарихын айтып беріңіз' },
    desc_label: { en: 'Description', ru: 'Описание', kz: 'Сипаттама' },
    desc_ph: { en: 'Describe this place - what makes it worth visiting? What will travelers find here?', ru: 'Опишите это место — почему стоит его посетить?', kz: 'Бұл жерді сипаттаңыз — неге бару керек?' },
    cat_label: { en: 'Category', ru: 'Категория', kz: 'Санат' },
    why_label: { en: 'What makes it special?', ru: 'Что делает его особенным?', kz: 'Оны не ерекшелейді?' },
    why_ph: { en: 'A personal note about why you think this place deserves attention', ru: 'Почему вы считаете, что это место заслуживает внимания', kz: 'Бұл жер назар аударуға лайық деп ойлайсыз ба' },
    img_label: { en: 'Image URL', ru: 'URL изображения', kz: 'Сурет URL' },
    img_ph: { en: 'Link to a photo of this place (Unsplash, Google, etc.)', ru: 'Ссылка на фото этого места', kz: 'Бұл жердің фотосына сілтеме' },
    back: { en: 'Back', ru: 'Назад', kz: 'Артқа' },
    next: { en: 'Continue', ru: 'Далее', kz: 'Жалғастыру' },
    submit_verify: { en: 'Submit & Verify with AI', ru: 'Отправить и проверить AI', kz: 'Жіберу және AI тексеру' },
    submitting: { en: 'Submitting...', ru: 'Отправка...', kz: 'Жіберілуде...' },
    verifying: { en: 'AI is analyzing your submission...', ru: 'AI анализирует вашу заявку...', kz: 'AI сіздің өтініміңізді талдауда...' },
    verify_done: { en: 'Verification Complete', ru: 'Верификация завершена', kz: 'Тексеру аяқталды' },
    score: { en: 'Authenticity Score', ru: 'Оценка подлинности', kz: 'Түпнұсқалық бағасы' },
    approved: { en: 'APPROVED', ru: 'ОДОБРЕНО', kz: 'МАҚҰЛДАНДЫ' },
    needs_review: { en: 'NEEDS REVIEW', ru: 'ТРЕБУЕТ ПРОВЕРКИ', kz: 'ТЕКСЕРУ ҚАЖЕТ' },
    rejected: { en: 'REJECTED', ru: 'ОТКЛОНЕНО', kz: 'ҚАБЫЛДАНБАДЫ' },
    pending: { en: 'PENDING', ru: 'ОЖИДАНИЕ', kz: 'КҮТУДЕ' },
    submit_another: { en: 'Submit Another Place', ru: 'Предложить ещё место', kz: 'Тағы жер ұсыну' },
    back_home: { en: 'Back to Home', ru: 'На главную', kz: 'Басты бетке' },
    no_submissions: { en: 'No submissions yet. Be the first to share a hidden gem!', ru: 'Заявок пока нет. Будьте первым!', kz: 'Әлі өтінім жоқ. Бірінші болыңыз!' },
    how_title: { en: 'HOW IT WORKS', ru: 'КАК ЭТО РАБОТАЕТ', kz: 'ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ' },
    how_1_t: { en: 'Submit', ru: 'Отправьте', kz: 'Жіберіңіз' },
    how_1_d: { en: 'Fill out the place details with as much info as possible', ru: 'Заполните данные места как можно подробнее', kz: 'Жер мәліметтерін мүмкіндігінше толық толтырыңыз' },
    how_2_t: { en: 'AI Verifies', ru: 'AI проверяет', kz: 'AI тексереді' },
    how_2_d: { en: 'Our AI analyzes existence, coordinates, and accuracy', ru: 'Наш AI анализирует существование, координаты и точность', kz: 'AI бар-жоғын, координаттарын тексереді' },
    how_3_t: { en: 'Goes Live', ru: 'Публикация', kz: 'Жариялау' },
    how_3_d: { en: 'Approved places appear on the platform for all travelers', ru: 'Одобренные места появляются на платформе', kz: 'Мақұлданған жерлер платформада көрінеді' },
  };
  return t[key]?.[lang] || t[key]?.['en'] || key;
};

const regions = [
  'Almaty', 'Astana', 'Turkestan', 'Mangystau', 'East Kazakhstan',
  'Karaganda', 'Aktobe', 'Atyrau', 'North Kazakhstan', 'Kostanay',
  'Pavlodar', 'Zhambyl', 'South Kazakhstan', 'West Kazakhstan', 'Akmola',
];

const natureCategories = ['Lake', 'Canyon', 'Mountain', 'Waterfall', 'Desert', 'Forest', 'Hot Spring', 'Cave', 'Island', 'Valley'];
const sacredCategories = ['Mosque', 'Mausoleum', 'Pilgrimage Site', 'Petroglyph', 'Sacred Mountain', 'Ancient Temple', 'Shrine'];
const historyCategories = ['Ruins', 'Fortress', 'Museum', 'Soviet Monument', 'Ancient Settlement', 'Battleground', 'Archaeological Site'];

const HERO_IMG = 'https://images.unsplash.com/photo-1730744741007-760cdbfeb1ac?w=1920&q=80&fm=webp&auto=format&fit=crop';
const SECTION_IMG = 'https://images.unsplash.com/photo-1763307786383-8c1df4489e5c?w=1080&q=80&fm=webp&auto=format&fit=crop';

const initialForm: PlaceForm = {
  name: '', type: '', region: '', city: '', lat: '', lng: '',
  description: '', category: '', imageUrl: '', whySpecial: '',
};

export const CreatePlacePage = () => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const { user, isGuest } = useAuth();
  const lang = language || 'en';

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PlaceForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submittedPlace, setSubmittedPlace] = useState<SubmittedPlace | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [myPlaces, setMyPlaces] = useState<SubmittedPlace[]>([]);
  const [showMyPlaces, setShowMyPlaces] = useState(false);
  const [loadingMyPlaces, setLoadingMyPlaces] = useState(false);

  if (!theme) return null;

  const isLoggedIn = !!user && !isGuest;

  const updateField = (field: keyof PlaceForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const categories = form.type === 'nature' ? natureCategories
    : form.type === 'sacred' ? sacredCategories
    : form.type === 'history' ? historyCategories : [];

  const canProceed = (s: number) => {
    if (s === 1) return form.type !== '';
    if (s === 2) return form.name.trim().length >= 3 && form.region !== '';
    if (s === 3) return form.description.trim().length >= 20;
    return true;
  };

  const fetchMyPlaces = useCallback(async () => {
    if (!user) return;
    setLoadingMyPlaces(true);
    try {
      const session = await (await import('../../utils/supabase/client')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) return;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/user-places/my`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': token },
      });
      if (res.ok) {
        const data = await res.json();
        setMyPlaces(data);
      }
    } catch (e) {
      console.error('Failed to fetch my places:', e);
    } finally {
      setLoadingMyPlaces(false);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const session = await (await import('../../utils/supabase/client')).supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) { toast.error('Auth error'); return; }

      const payload = {
        name: form.name.trim(),
        type: form.type,
        region: form.region,
        city: form.city.trim(),
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        description: form.description.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        whySpecial: form.whySpecial.trim(),
      };

      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/user-places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setSubmittedPlace(data.place);

      // Now auto-verify
      setIsVerifying(true);
      const verifyRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/user-places/${data.place.id}/verify`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'x-user-token': token,
          },
        }
      );

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        setVerification(verifyData.verification);
      } else {
        setVerification({ score: 0, verdict: 'pending', confidence: 'low', checks: [], suggestion: 'Verification will be done manually.' });
      }

      setStep(5);
    } catch (e: any) {
      toast.error(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
      setIsVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      case 'needs_review': return '#f59e0b';
      case 'verifying': return theme.primary;
      default: return `${theme.text}60`;
    }
  };

  const getStatusLabel = (status: string) => {
    const key = status === 'needs_review' ? 'needs_review' : status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending';
    return tx(lang, key);
  };

  const checkLabelMap: Record<string, string> = {
    existence: 'Place Exists',
    coordinates: 'GPS Coords Valid',
    description_accuracy: 'Description Accuracy',
    category_match: 'Category Match',
    content_quality: 'Content Quality',
    region_match: 'Region Match',
  };

  const inputBase = `w-full px-5 py-4 border bg-transparent text-sm transition-all focus:outline-none focus:ring-2`;

  return (
    <PageTransition>
      <div className="min-h-screen pb-32" style={{ background: theme.background, color: theme.text, fontFamily: 'Montserrat, sans-serif' }}>

        {/* ───── HERO (step 0) ───── */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Hero */}
            <section className="relative h-[92vh] overflow-hidden flex items-end">
              <div className="absolute inset-0">
                <ResponsiveImage src={HERO_IMG} className="w-full h-full object-cover" priority />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 100%)`,
                }} />
              </div>

              <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24 max-w-[1600px] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: SNAP }}
                >
                  <div className="inline-flex items-center gap-3 px-5 py-2 border border-white/20 backdrop-blur-xl mb-8" style={{ background: `${theme.primary}15` }}>
                    <Plus className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: theme.primary }}>
                      {tx(lang, 'page_tag')}
                    </span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.82] text-white mb-8">
                    {tx(lang, 'hero_t1')}<br />
                    <span style={{ color: theme.primary }}>{tx(lang, 'hero_t2')}</span><br />
                    <span className="opacity-40">{tx(lang, 'hero_t3')}</span>
                  </h1>

                  <p className="text-white/60 text-sm md:text-base max-w-xl mb-12 leading-relaxed">
                    {tx(lang, 'hero_sub')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => isLoggedIn ? setStep(1) : toast.error(tx(lang, 'login_req'))}
                      className="group px-12 py-6 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
                      style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>{tx(lang, 'start')}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>

                    {isLoggedIn && (
                      <button
                        onClick={() => { setShowMyPlaces(true); fetchMyPlaces(); }}
                        className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] border-2 border-white/20 text-white/80 hover:border-white/50 transition-all flex items-center gap-3"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{tx(lang, 'my_places')}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* How it works */}
            <section className="py-24 md:py-32">
              <div className="max-w-[1600px] mx-auto px-6 md:px-16">
                <div className="text-center mb-20">
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] opacity-30">
                    {tx(lang, 'how_title')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {[
                    { num: '01', icon: Upload, t: tx(lang, 'how_1_t'), d: tx(lang, 'how_1_d') },
                    { num: '02', icon: Sparkles, t: tx(lang, 'how_2_t'), d: tx(lang, 'how_2_d') },
                    { num: '03', icon: Globe, t: tx(lang, 'how_3_t'), d: tx(lang, 'how_3_d') },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, duration: 0.7, ease: SNAP }}
                        className="relative p-12 md:p-16 border-b md:border-b-0 md:border-r last:border-r-0"
                        style={{ borderColor: `${theme.text}08` }}
                      >
                        <div className="text-[80px] font-black opacity-[0.03] absolute top-4 right-8 tracking-tighter" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {item.num}
                        </div>
                        <div className="w-14 h-14 flex items-center justify-center mb-8" style={{ background: `${theme.primary}10` }}>
                          <Icon className="w-6 h-6" style={{ color: theme.primary }} />
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.3em] mb-1 opacity-30" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {item.num}
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.t}</h3>
                        <p className="text-xs opacity-50 leading-relaxed">{item.d}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Divider image strip */}
            <section className="h-[40vh] relative overflow-hidden">
              <ResponsiveImage src={SECTION_IMG} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${theme.background}ee 0%, ${theme.background}88 50%, ${theme.background}ee 100%)`,
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-6xl md:text-8xl font-black uppercase tracking-tighter opacity-10">
                    KENDALA
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ───── FORM STEPS (1-4) ───── */}
        {step >= 1 && step <= 4 && (
          <div className="max-w-3xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
            {/* Progress header */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {tx(lang, 'step')} {step} / 4
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">
                  {tx(lang, 'page_tag')}
                </span>
              </div>
              <div className="h-[2px] w-full overflow-hidden" style={{ background: `${theme.text}08` }}>
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: theme.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.6, ease: SNAP }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Type */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: SNAP }} className="space-y-10">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.88]">{tx(lang, 's1_title')}</h2>
                  <div className="space-y-4">
                    {([
                      { type: 'nature' as PlaceType, icon: Mountain, t: tx(lang, 'type_nature'), d: tx(lang, 'type_nature_d') },
                      { type: 'sacred' as PlaceType, icon: Star, t: tx(lang, 'type_sacred'), d: tx(lang, 'type_sacred_d') },
                      { type: 'history' as PlaceType, icon: Compass, t: tx(lang, 'type_history'), d: tx(lang, 'type_history_d') },
                    ]).map(opt => {
                      const Icon = opt.icon;
                      const sel = form.type === opt.type;
                      return (
                        <button
                          key={opt.type}
                          onClick={() => updateField('type', opt.type)}
                          className="relative w-full p-8 border-2 text-left transition-all duration-300 hover:shadow-lg group flex items-start gap-6"
                          style={{
                            borderColor: sel ? theme.primary : `${theme.text}10`,
                            background: sel ? `${theme.primary}06` : 'transparent',
                          }}
                        >
                          {sel && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center"
                              style={{ background: theme.primary }}
                            >
                              <Check className="w-4 h-4" style={{ color: theme.primaryForeground }} />
                            </motion.div>
                          )}
                          <div className="w-12 h-12 shrink-0 flex items-center justify-center" style={{ background: `${theme.primary}10` }}>
                            <Icon className="w-5 h-5" style={{ color: theme.primary }} />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-wider mb-2">{opt.t}</h3>
                            <p className="text-xs opacity-40 leading-relaxed">{opt.d}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: SNAP }} className="space-y-10">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.88]">{tx(lang, 's2_title')}</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'name_label')} *</label>
                      <input
                        type="text" value={form.name} onChange={e => updateField('name', e.target.value)}
                        className={inputBase} style={{ borderColor: `${theme.text}12`, color: theme.text }}
                        placeholder={tx(lang, 'name_ph')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'region_label')} *</label>
                        <select
                          value={form.region} onChange={e => updateField('region', e.target.value)}
                          className={`${inputBase} cursor-pointer`}
                          style={{ borderColor: `${theme.text}12`, color: theme.text, backgroundColor: theme.background }}
                        >
                          <option value="">—</option>
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'city_label')}</label>
                        <input
                          type="text" value={form.city} onChange={e => updateField('city', e.target.value)}
                          className={inputBase} style={{ borderColor: `${theme.text}12`, color: theme.text }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'lat_label')} / {tx(lang, 'lng_label')}</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text" value={form.lat} onChange={e => updateField('lat', e.target.value)}
                          className={inputBase} style={{ borderColor: `${theme.text}12`, color: theme.text }}
                          placeholder="43.2381"
                        />
                        <input
                          type="text" value={form.lng} onChange={e => updateField('lng', e.target.value)}
                          className={inputBase} style={{ borderColor: `${theme.text}12`, color: theme.text }}
                          placeholder="76.9454"
                        />
                      </div>
                      <p className="text-[10px] opacity-30 mt-2">{tx(lang, 'coords_hint')}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Description */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: SNAP }} className="space-y-10">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.88]">{tx(lang, 's3_title')}</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'desc_label')} *</label>
                      <textarea
                        value={form.description} onChange={e => updateField('description', e.target.value)}
                        rows={5} className={`${inputBase} resize-none`}
                        style={{ borderColor: `${theme.text}12`, color: theme.text }}
                        placeholder={tx(lang, 'desc_ph')}
                      />
                    </div>
                    {categories.length > 0 && (
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">{tx(lang, 'cat_label')}</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => updateField('category', form.category === cat ? '' : cat)}
                              className="px-4 py-2.5 border text-[10px] font-black uppercase tracking-wider transition-all"
                              style={{
                                borderColor: form.category === cat ? theme.primary : `${theme.text}12`,
                                backgroundColor: form.category === cat ? `${theme.primary}10` : 'transparent',
                                color: form.category === cat ? theme.primary : theme.text,
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'why_label')}</label>
                      <textarea
                        value={form.whySpecial} onChange={e => updateField('whySpecial', e.target.value)}
                        rows={3} className={`${inputBase} resize-none`}
                        style={{ borderColor: `${theme.text}12`, color: theme.text }}
                        placeholder={tx(lang, 'why_ph')}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Image & Confirm */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: SNAP }} className="space-y-10">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.88]">
                    {lang === 'ru' ? 'Последний штрих' : lang === 'kz' ? 'Соңғы қадам' : 'Final Touch'}
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">{tx(lang, 'img_label')}</label>
                      <input
                        type="url" value={form.imageUrl} onChange={e => updateField('imageUrl', e.target.value)}
                        className={inputBase} style={{ borderColor: `${theme.text}12`, color: theme.text }}
                        placeholder={tx(lang, 'img_ph')}
                      />
                    </div>

                    {form.imageUrl && (
                      <div className="relative h-48 overflow-hidden border" style={{ borderColor: `${theme.text}10` }}>
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-8 border space-y-4" style={{ borderColor: `${theme.text}10`, background: `${theme.primary}04` }}>
                      <h4 className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
                        {lang === 'ru' ? 'СВОДКА' : lang === 'kz' ? 'ТҮЙІН' : 'SUMMARY'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="opacity-40">Name</span><span className="font-black">{form.name}</span></div>
                        <div className="flex justify-between"><span className="opacity-40">Type</span><span className="font-black uppercase text-xs">{form.type}</span></div>
                        <div className="flex justify-between"><span className="opacity-40">Region</span><span className="font-black">{form.region}</span></div>
                        {form.category && <div className="flex justify-between"><span className="opacity-40">Category</span><span className="font-black">{form.category}</span></div>}
                        {form.lat && <div className="flex justify-between"><span className="opacity-40">GPS</span><span className="font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{form.lat}, {form.lng}</span></div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-14 pt-8 border-t" style={{ borderColor: `${theme.text}08` }}>
              <button
                onClick={() => setStep(s => s === 1 ? 0 : s - 1)}
                className="flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] border transition-all hover:shadow-lg"
                style={{ borderColor: `${theme.text}15` }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{tx(lang, 'back')}</span>
              </button>

              {step < 4 ? (
                <button
                  onClick={() => canProceed(step) && setStep(s => s + 1)}
                  disabled={!canProceed(step)}
                  className="flex items-center gap-3 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  <span>{tx(lang, 'next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-xl disabled:opacity-50 group"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isVerifying ? tx(lang, 'verifying') : tx(lang, 'submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{tx(lang, 'submit_verify')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ───── VERIFICATION RESULTS (step 5) ───── */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-6 md:px-12 pt-16 md:pt-24"
          >
            <div className="space-y-10">
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.15 }}
                  className="w-20 h-20 mx-auto flex items-center justify-center"
                  style={{ background: `${verification?.verdict === 'approved' ? '#22c55e' : verification?.verdict === 'rejected' ? '#ef4444' : theme.primary}15` }}
                >
                  {verification?.verdict === 'approved' ? (
                    <CheckCircle className="w-10 h-10" style={{ color: '#22c55e' }} />
                  ) : verification?.verdict === 'rejected' ? (
                    <X className="w-10 h-10" style={{ color: '#ef4444' }} />
                  ) : (
                    <Clock className="w-10 h-10" style={{ color: theme.primary }} />
                  )}
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{tx(lang, 'verify_done')}</h2>
                <p className="text-sm opacity-50">{form.name} — {form.region}</p>
              </div>

              {/* Score gauge */}
              {verification && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-10 border space-y-8"
                  style={{ borderColor: `${theme.text}10` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{tx(lang, 'score')}</span>
                    <span
                      className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em]"
                      style={{
                        background: `${getStatusColor(verification.verdict)}20`,
                        color: getStatusColor(verification.verdict),
                      }}
                    >
                      {getStatusLabel(verification.verdict)}
                    </span>
                  </div>

                  <div className="flex items-end gap-4">
                    <div className="text-7xl md:text-8xl font-black tracking-tighter" style={{ color: theme.primary, fontFamily: 'Montserrat, sans-serif' }}>
                      {verification.score}
                    </div>
                    <div className="text-2xl font-black opacity-20 pb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>/100</div>
                  </div>

                  <div className="h-2 w-full overflow-hidden" style={{ background: `${theme.text}08` }}>
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${verification.score}%` }}
                      transition={{ duration: 1.5, ease: SNAP, delay: 0.5 }}
                      style={{ backgroundColor: verification.score >= 70 ? '#22c55e' : verification.score >= 40 ? '#f59e0b' : '#ef4444' }}
                    />
                  </div>

                  {/* Checks grid */}
                  {verification.checks && verification.checks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {verification.checks.map((check, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-start gap-3 p-4 border"
                          style={{ borderColor: `${theme.text}08` }}
                        >
                          <div className="w-6 h-6 shrink-0 flex items-center justify-center mt-0.5" style={{ background: check.passed ? '#22c55e20' : '#ef444420' }}>
                            {check.passed ? (
                              <Check className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                            ) : (
                              <X className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider">{checkLabelMap[check.check] || check.check}</div>
                            <div className="text-[10px] opacity-40 mt-1 leading-relaxed">{check.note}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {verification.suggestion && (
                    <div className="p-5 border-l-2 mt-4" style={{ borderColor: theme.primary, background: `${theme.primary}06` }}>
                      <p className="text-xs opacity-60 leading-relaxed">
                        <Sparkles className="w-3 h-3 inline mr-2" style={{ color: theme.primary }} />
                        {verification.suggestion}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  onClick={() => { setStep(0); setForm(initialForm); setVerification(null); setSubmittedPlace(null); }}
                  className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:shadow-xl flex items-center gap-3 justify-center"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{tx(lang, 'submit_another')}</span>
                </button>
                <button
                  onClick={() => { setStep(0); setForm(initialForm); setVerification(null); setSubmittedPlace(null); }}
                  className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all hover:shadow-xl flex items-center gap-3 justify-center"
                  style={{ borderColor: `${theme.text}15` }}
                >
                  <span>{tx(lang, 'back_home')}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ───── MY PLACES MODAL ───── */}
        <AnimatePresence>
          {showMyPlaces && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.85)' }}
              onClick={() => setShowMyPlaces(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 md:p-12"
                style={{ background: theme.background, color: theme.text }}
              >
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black uppercase tracking-tight">{tx(lang, 'my_places')}</h3>
                  <button onClick={() => setShowMyPlaces(false)} className="w-10 h-10 flex items-center justify-center" style={{ background: `${theme.text}08` }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loadingMyPlaces ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: theme.primary }} />
                  </div>
                ) : myPlaces.length === 0 ? (
                  <p className="text-center py-20 text-sm opacity-40">{tx(lang, 'no_submissions')}</p>
                ) : (
                  <div className="space-y-4">
                    {myPlaces.map(place => (
                      <div key={place.id} className="p-6 border flex items-center justify-between" style={{ borderColor: `${theme.text}08` }}>
                        <div>
                          <h4 className="text-sm font-black">{place.name}</h4>
                          <p className="text-[10px] opacity-40 mt-1">{place.region} • {place.type}</p>
                          <p className="text-[10px] opacity-30 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {new Date(place.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shrink-0"
                          style={{
                            background: `${getStatusColor(place.status)}20`,
                            color: getStatusColor(place.status),
                          }}
                        >
                          {getStatusLabel(place.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
