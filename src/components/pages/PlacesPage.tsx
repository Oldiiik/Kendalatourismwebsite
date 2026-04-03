import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Star, ArrowRight, X, Plus, Share, Clock, Heart, Activity, Shield, Zap, Globe, Leaf } from '../ui/icons';
import { PageTransition } from '../ui/PageTransition';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageHero, PageFilterBar, PageCard } from '../ui/PageShell';
import { PLACES } from '../data/map_places';
import { useWishlist } from './useWishlist';
import { toast } from 'sonner@2.0.3';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { ReviewSection } from '../reviews/ReviewSection';
import { PartnerCTA } from '../ui/PartnerCTA';

export const PlacesPage = () => {
  const { theme, season } = useSeason();
  const { language, t } = useLanguage();
  const { isLiked, toggleWishlist } = useWishlist();
  const onNavigate = useAppNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  useEffect(() => { setActiveFilter('all'); }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      const place = PLACES.find(p => p.id === id);
      if (place) {
        // Find formatted place from useMemo
        const formattedPlace = {
          id: place.id,
          name: place.name[language as keyof typeof place.name] || place.name.en,
          region: 'Kazakhstan',
          desc: place.desc[language as keyof typeof place.desc] || place.desc.en,
          longDesc: place.desc[language as keyof typeof place.desc] || place.desc.en,
          image: place.image,
          tag: place.type,
          coords: `${place.lat.toFixed(4)}° N, ${place.lng.toFixed(4)}° E`,
          stats: {
            altitude: place.type === 'nature' ? '1,500m - 3,200m' : '300m - 800m',
            difficulty: place.type === 'nature' ? t('hard') : t('easy'),
            bestTime: t('summer') + ' - ' + t('autumn'),
            distance: '15km - 45km',
            duration: '2-4 ' + t('field_days'),
            accommodation: place.type === 'nature' ? t('opt_tent') : t('opt_guesthouse'),
          },
        };
        setSelectedPlace(formattedPlace);
      }
    }
  }, [location.search, language, t]);

  const handleAddToTrip = (place: any) => {
    localStorage.setItem('kendala_pending_activity', JSON.stringify({ ...place, type: 'activity', price: 0 }));
    onNavigate?.('planner');
  };

  if (!theme) return null;

  const places = useMemo(() => {
    return PLACES.map((p) => ({
      id: p.id,
      name: p.name[language],
      region: 'Kazakhstan',
      desc: p.desc[language],
      longDesc: p.desc[language],
      image: p.image,
      tag: p.type,
      coords: `${p.lat.toFixed(4)}° N, ${p.lng.toFixed(4)}° E`,
      stats: {
        altitude: p.type === 'nature' ? '1,500m - 3,200m' : '300m - 800m',
        difficulty: p.type === 'nature' ? t('hard') : t('easy'),
        bestTime: t('summer') + ' - ' + t('autumn'),
        distance: '15km - 45km',
        duration: '2-4 ' + t('field_days'),
        accommodation: p.type === 'nature' ? t('opt_tent') : t('opt_guesthouse'),
      },
    }));
  }, [language, t]);

  const featuredDetails = useMemo(() => {
    const generateDetail = (p: any) => {
      const typeLabels = {
        sacred: { kz: "КИЕЛІ НЫСАН", ru: "САКРАЛЬНЫЙ ОБЪЕКТ", en: "SACRED SITE" },
        nature: { kz: "ТАБИҒИ ҚОРЫҚ", ru: "ПРИРОДНЫЙ ЗАПОВЕДНИК", en: "NATURE RESERVE" },
        history: { kz: "ТАРИХИ ЕСКЕРТКІШ", ru: "ИСТОРИКО-КУЛЬТУРНЫЙ ПАМЯТНИК", en: "HISTORICAL MONUMENT" },
      };
      const isNature = p.tag === "nature";
      const name = p.name[language];
      return {
        overview: p.desc[language],
        typeLabel: typeLabels[p.tag as keyof typeof typeLabels]?.[language as 'kz'|'ru'|'en'] || "OBJECT",
        chronos: [
          { year: language === "en" ? "GENESIS" : language === "ru" ? "ИСТОКИ" : "БАСТАУЫ", event: language === "en" ? `The location of ${name} emerged during ancient epochs. Archaeological evidence suggests human presence for over 3,000 years.` : language === "ru" ? `Локация ${name} возникла в древние эпохи. Археологические свидетельства указывают на присутствие человека более 3000 лет.` : `${name} орны ежелгі дәуірлерде пайда болған. Археологиялық деректер мұнда 3000 жылдан астам уақыт бойы адамдар болғанын көрсетеді.` },
          { year: "ERA II", event: language === "en" ? `Integration into the Nomadic Steppe Empire. ${name} became a vital landmark for seasonal migrations and ritual gatherings.` : language === "ru" ? `Интеграция в кочевую Степную Империю. ${name} стал жизненно важным ориентиром для сезонных миграций и ритуальных собраний.` : `Көшпелі Дала Империясына бірігу. ${name} маусымдық көші-қон мен ритуалдық жиындар үшін маңызды бағдарға айналды.` },
          { year: "POST-SILK", event: language === "en" ? `Period of relative isolation allowing for the preservation of unique bio-diversity or spiritual integrity in ${name}.` : language === "ru" ? `Период относительной изоляции, позволивший сохранить уникальное биоразнообразие или духовную целостность ${name}.` : `Салыстырмалы оқшаулану кезеңі, бұл ${name} нысанының бірегей биоалуантүрлілігін немесе рухани тұтастығын сақтауға мүмкіндік берді.` },
          { year: "MODERN", event: language === "en" ? `Modern scientific classification. Status assigned as a protected site within the Republic of Kazakhstan.` : language === "ru" ? `Современная научная классификация. Объекту ${name} присвоен статус охраняемой территории Республики Казахстан.` : `Заманауи ғылыми жіктеу. ${name} нысанына Қазақстан Республикасының қорғалатын аумағы мәртебесі берілді.` },
        ],
        science: {
          [language === "en" ? "Geology" : "Геология"]: isNature ? (language === "en" ? "Primary composition of volcanic and sedimentary layers dating back millions of years." : language === "ru" ? "Первичный состав из вулканических и осадочных слоев, возраст которых исчисляется миллионами лет." : "Миллиондаған жылдар бұрынғы жанартаулық және шөгінді қабаттардың алғашқы құрамы.") : (language === "en" ? "Architectural engineering using localized stone and ancient binding materials." : language === "ru" ? "Архитектурное проектирование с использованием местного камня и древних связующих материалов." : "Жергілікті тас пен ежелгі байланыстырушы материалдарды пайдаланатын архитектуралық жобалау."),
          [language === "en" ? "Microclimate" : "Микроклимат"]: language === "en" ? "Distinct thermal regulation due to terrain geometry or structural mass." : language === "ru" ? "Особое тепловое регулирование за счет геометрии рельефа или структурной массы." : "Жер бедерінің геометриясы немесе құрылымдық массасы арқасындағы ерекше термиялық реттеу.",
          [language === "en" ? "Ecology" : "Экология"]: language === "en" ? "High biodiversity index with several endemic species recorded in the vicinity." : language === "ru" ? "Высокий индекс биоразнообразия с несколькими эндемичными видами, зарегистрированными в окрестностях." : "Айналада тіркелген бірнеше эндемикалық түрлері бар биоалуантүрліктің жоғары индексі.",
        },
        culture: language === "en" ? `An essential anchor for the local regional identity. ${name} reflects the deep connection between the Kazakh people and their ancestral lands.` : language === "ru" ? `Важный якорь для локальной региональной идентичности. ${name} отражает глубокую связь казахского народа со своей землей.` : `Жергілікті аймақтық бірегейліктің маңызды тірегі. ${name} қазақ халқының өз жерімен терең байланысын көрсетеді.`,
        tactics: [
          { label: language === "en" ? "Map Protocol" : "Картография", value: language === "en" ? "Check high-resolution topographical overlays before ascent." : language === "ru" ? "Перед восхождением проверьте топографические наложения высокого разрешения." : "Көтерілер алдында жоғары ажыратымдылықтағы топографиялық карталарды тексеріңіз." },
          { label: language === "en" ? "Hydration" : "Гидратация", value: language === "en" ? "Maintain 3L/day minimum. Local springs may require filtration." : language === "ru" ? "Поддерживайте минимум 3 литра в день. Местные источники могут требовать фильтрации." : "Күніне кемінде 3 литр су ішіңіз. Жергілікті бұлақтар сүзуді қажет етуі мүмкін." },
          { label: language === "en" ? "Ethics" : "Этика", value: language === "en" ? "Zero waste policy. Respect quiet zones." : language === "ru" ? "Политика нулевых отходов. Соблюдайте зоны тишины." : "Қалдықсыз саясат. Тыныштық аймақтарын сақтаңыз." },
        ],
      };
    };

    const overrides: Record<string, any> = {
      '1': {
        overview: language === 'en' ? 'A titan of Timurid architecture, this mausoleum stands as a spiritual lighthouse for the entire Turkic world.' : language === 'ru' ? 'Титан тимуридской архитектуры, этот мавзолей служит духовным маяком для всего тюркского мира.' : 'Темір дәуірі сәулет өнерінің алып туындысы, бұл кесене бүкіл түркі әлемінің рухани темірқазығы болып табылады.',
        chronos: [
          { year: '1166', event: language === 'en' ? 'The passing of Khoja Ahmed Yasawi, the Sultan of Sufis.' : language === 'ru' ? 'Кончина Ходжи Ахмета Ясауи, султана суфиев.' : 'Сопылардың сұлтаны Қожа Ахмет Ясауидің дүниеден өтуі.' },
          { year: '1389', event: language === 'en' ? 'Tamerlane issues the Imperial Decree to begin construction.' : language === 'ru' ? 'Тамерлан издает имперский указ о начале строительства.' : 'Әмір Темір құрылысты бастау туралы жарлық шығарады.' },
          { year: '1395', event: language === 'en' ? 'Arrival of the 2-ton bronze Taykazan, cast in nearby Karnak.' : language === 'ru' ? 'Прибытие 2-тонного бронзового Тайказана, отлитого в соседнем Карнаке.' : 'Жақын маңдағы Қарнақта құйылған 2 тонналық қола Тайқазанның әкелінуі.' },
          { year: '1405', event: language === 'en' ? 'Construction halts abruptly upon Timur\'s death in Otrar.' : language === 'ru' ? 'Строительство резко прекращается после смерти Тимура в Отраре.' : 'Отырарда Әмір Темір қайтыс болған соң құрылыс кілт тоқтады.' },
          { year: '2003', event: language === 'en' ? 'First site in Kazakhstan to join UNESCO World Heritage.' : language === 'ru' ? 'Первый объект в Казахстане, включенный в список ЮНЕСКО.' : 'Қазақстандағы ЮНЕСКО-ның Бүкіләлемдік мұралар тізіміне енген алғашқы нысан.' },
        ],
        science: {
          [language === 'en' ? 'Acoustics' : 'Акустика']: language === 'en' ? 'The Kazandyk hall reflects sound with near-perfect 1.2s reverb.' : language === 'ru' ? 'Зал Казандык отражает звук с почти идеальной реверберацией 1,2 с.' : 'Қазандық залы дыбысты 1,2 секундтық тамаша реверберациямен қайтарады.',
          [language === 'en' ? 'Glazing' : 'Глазурь']: language === 'en' ? 'The blue tiles use cobalt and tin, recipes lost for 500 years.' : language === 'ru' ? 'Синяя плитка использует кобальт и олово, рецепты которых были утеряны на 500 лет.' : 'Көк плиткалар кобальт пен қалайыны пайдаланады, олардың рецепті 500 жыл бойы жоғалған.',
          [language === 'en' ? 'Geodesy' : 'Геодезия']: language === 'en' ? 'The dome alignment is synchronized with the spring equinox.' : language === 'ru' ? 'Выравнивание купола синхронизировано с весенним равноденствием.' : 'Күмбездің орналасуы көктемгі күн мен түннің теңелуімен үйлестірілген.',
        },
        culture: language === 'en' ? 'The physical embodiment of the Sufi path (Tariqat).' : language === 'ru' ? 'Физическое воплощение суфийского пути (Тарикат).' : 'Сопылық жолдың (Тариқат) физикалық бейнесі.',
      },
      '2': {
        overview: language === 'en' ? 'A subterranean spiritual fortress carved into the white chalk canyons.' : language === 'ru' ? 'Подземная духовная крепость, высеченная в белых меловых каньонах.' : 'Ақ бор каньондарында қашаған жерасты рухани қамалы.',
        chronos: [
          { year: '1750', event: language === 'en' ? 'Birth of Beket Ata, great warrior and teacher.' : language === 'ru' ? 'Рождение Бекет Ата, великого воина и учителя.' : 'Ұлы жауынгер әрі ұстаз Бекет Атаның дүниеге келуі.' },
          { year: '1780', event: language === 'en' ? 'The saint begins the manual excavation of the sanctuary.' : language === 'ru' ? 'Святой начинает ручную выемку грунта в святилище.' : 'Әулие ғибадатхананы өз қолымен қазуды бастайды.' },
          { year: '1813', event: language === 'en' ? 'The mosque becomes a center for Sufi education.' : language === 'ru' ? 'Мечеть становится центром суфийского образования.' : 'Мешіт сопылық білім беру орталығына айналды.' },
        ],
        science: { [language === 'en' ? 'Speleology' : 'Спелеология']: language === 'en' ? 'Natural ventilation maintains constant 18C inside.' : language === 'ru' ? 'Естественная вентиляция поддерживает внутри постоянную температуру 18°C.' : 'Табиғи желдету жүйесі ішінде тұрақты 18°C температураны сақтайды.' },
      },
      '48': {
        overview: language === 'en' ? 'The portal between Earth and the Cosmos.' : language === 'ru' ? 'Портал между Землей и Космосом.' : 'Жер мен Ғарыш арасындағы портал.',
        chronos: [
          { year: '1957', event: language === 'en' ? 'Sputnik-1 launch: The first artificial satellite.' : language === 'ru' ? 'Запуск Спутника-1: первый искусственный спутник.' : 'Спутник-1 ұшырылуы: алғашқы жасанды серік.' },
          { year: '1961', event: language === 'en' ? 'Yuri Gagarin becomes the first human in space.' : language === 'ru' ? 'Юрий Гагарин становится первым человеком в космосе.' : 'Юрий Гагарин ғарышқа ұшқан алғашқы адам болды.' },
        ],
      },
      '11': {
        overview: language === 'en' ? '12 million years of tectonic evolution frozen in red sandstone.' : language === 'ru' ? '12 миллионов лет тектонической эволюции, застывшей в красном песчанике.' : 'Қызыл құмдақта қатып қалған 12 миллион жылдық тектоникалық эволюция.',
        chronos: [
          { year: '12M BCE', event: language === 'en' ? 'Tectonic movements begin splitting the plateau.' : language === 'ru' ? 'Тектонические движения начинают раскалывать плато.' : 'Тектоникалық қозғалыстар үстіртті жара бастайды.' },
          { year: 'ICE AGE', event: language === 'en' ? 'The Sogdian Ash grove survives the global cooling.' : language === 'ru' ? 'Роща согдийского ясеня переживает глобальное похолодание.' : 'Согды шетені тоғайы жаһандық суынудан аман қалды.' },
        ],
      },
      '47': {
        overview: language === 'en' ? 'The historical and geographical heart of Kazakhstan.' : language === 'ru' ? 'Историческое и географическое сердце Казахстана.' : 'Қазақстанның тарихи және географиялық жүрегі.',
        chronos: [
          { year: '1465', event: language === 'en' ? 'Foundation of the Kazakh Khanate.' : language === 'ru' ? 'Основание Казахского ханства.' : 'Қазақ хандығының құрылуы.' },
          { year: '1730', event: language === 'en' ? 'The Great Council of Khans to unite.' : language === 'ru' ? 'Великий курултай ханов для объединения.' : 'Бірігу үшін хандардың ұлы құрылтайы.' },
        ],
      },
    };

    const finalDetails: any = {};
    PLACES.forEach(p => {
      const base = generateDetail(p);
      const override = overrides[p.id] || {};
      finalDetails[p.id] = { ...base, ...override, science: { ...base.science, ...(override.science || {}) }, chronos: override.chronos || base.chronos, tactics: override.tactics || base.tactics };
    });
    return finalDetails;
  }, [language]);

  const getDetails = (id: string) => featuredDetails[id] || {};

  const filters = [
    { id: 'all', label: t('places_all') },
    { id: 'sacred', label: t('sacred_places') },
    { id: 'nature', label: t('nature_places') },
    { id: 'history', label: t('history_places') },
  ];

  const filteredPlaces = activeFilter === 'all' ? places : places.filter(place => place.tag === activeFilter);

  const tagColors: Record<string, string> = { sacred: '#C084FC', nature: '#34D399', history: '#F59E0B' };

  return (
    <div>
      <PageTransition>
        <div className="min-h-screen font-sans" style={{ color: theme.text, backgroundColor: theme.background }}>
          {/* ── Hero ── */}
          <PageHero
            image="https://images.unsplash.com/photo-1559678158-dfb59abfe9b8?w=1200&q=80&fm=webp&auto=format&fit=crop"
            tag={t('places_index')}
            title={t('places_title')}
            subtitle={language === 'en' ? 'Handpicked destinations across Kazakhstan — from ancient sacred sites to untouched alpine lakes.' : language === 'ru' ? 'Лучшие направления Казахстана — от священных мест до нетронутых горных озёр.' : 'Қазақстанның таңдаулы бағыттары — киелі орындардан бастап таулы көлдерге дейін.'}
            count={filteredPlaces.length}
            countLabel={t('places_found')}
            theme={theme}
          />

          {/* ── Filter Bar ── */}
          <PageFilterBar
            filters={filters}
            active={activeFilter}
            onFilter={setActiveFilter}
            theme={theme}
            rightContent={
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: theme.text }}>
                {filteredPlaces.length} {t('places_found')}
              </span>
            }
          />

          {/* ── Card Grid ── */}
          <div className="max-w-[1800px] mx-auto">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredPlaces.map((place, idx) => (
                  <PageCard
                    key={place.id}
                    image={place.image}
                    index={idx}
                    priority={idx < 6}
                    category={place.tag === 'sacred' ? (language === 'en' ? 'Sacred' : language === 'ru' ? 'Сакральный' : 'Киелі') : place.tag === 'nature' ? (language === 'en' ? 'Nature' : language === 'ru' ? 'Природа' : 'Табиғат') : (language === 'en' ? 'Historical' : language === 'ru' ? 'Исторический' : 'Тарихи')}
                    categoryColor={tagColors[place.tag]}
                    title={place.name}
                    subtitle={place.coords}
                    description={place.desc}
                    isLiked={isLiked(place.id)}
                    onLike={() => toggleWishlist(PLACES.find(p => p.id === place.id)!, place.region)}
                    onClick={() => setSelectedPlace(place)}
                    theme={theme}
                    ctaLabel={t('places_view_details')}
                    topLeft={
                      <span className="bg-black/30 backdrop-blur-md px-2.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/80 border border-white/10">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                    }
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Partner CTA */}
            <div className="px-6 md:px-12">
              <PartnerCTA variant="places" theme={theme} language={language} />
            </div>
          </div>
        </div>
      </PageTransition>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedPlace && (() => {
          const detail = getDetails(selectedPlace.id);
          const labels = {
            summary: { en: '01 // EXECUTIVE SUMMARY', ru: '01 // КРАТКИЙ ОБЗОР', kz: '01 // ҚЫСҚАША ШОЛУ' },
            chronos: { en: 'CHRONOLOGICAL LAYERS', ru: 'ХРОНОЛОГИЯ', kz: 'УАҚЫТ ҚАБАТТАРЫ' },
            tactics: { en: 'TACTICAL PROTOCOL', ru: 'ТАКТИЧЕСКИЙ ПРОТОКОЛ', kz: 'ТАКТИКАЛЫҚ ПРОТОКОЛ' },
            science: { en: 'SCIENTIFIC DATA MATRIX', ru: 'НАУЧНЫЕ ДАННЫЕ', kz: 'ҒЫЛЫМИ ДЕРЕКТЕР' },
            culture: { en: 'CULTURAL SIGNIFICANCE', ru: 'КУЛЬТУРНЫЙ КОД', kz: 'МӘДЕНИ МАҢЫЗДЫЛЫҒЫ' },
            bio: { en: 'BIOLOGICAL DIVERSITY MATRIX', ru: 'МАТРИЦА БИОРАЗНООБРАЗИЯ', kz: 'БИОЛОГИЯЛЫҚ ӘРТҮРЛІЛІК МАТРИЦАСЫ' },
          };
          const cl = {
            summary: labels.summary[language as keyof typeof labels.summary] || labels.summary.en,
            chronos: labels.chronos[language as keyof typeof labels.chronos] || labels.chronos.en,
            tactics: labels.tactics[language as keyof typeof labels.tactics] || labels.tactics.en,
            science: labels.science[language as keyof typeof labels.science] || labels.science.en,
            culture: labels.culture[language as keyof typeof labels.culture] || labels.culture.en,
            bio: labels.bio[language as keyof typeof labels.bio] || labels.bio.en,
          };

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPlace(null)} className="absolute inset-0 bg-zinc-950/98 backdrop-blur-xl" />
              <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }}
                className="relative w-full h-full max-w-[1800px] bg-white overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-200"
                style={{ color: '#18181B' }}
              >
                <button onClick={() => setSelectedPlace(null)} className="absolute top-6 right-6 z-[110] p-4 bg-white hover:bg-zinc-100 text-zinc-900 transition-all border border-zinc-200 active:scale-90 mt-16 md:mt-0"><X className="w-6 h-6" /></button>
                <div className="w-full md:w-[40%] h-[35vh] md:h-full relative shrink-0 overflow-hidden border-r border-zinc-100">
                  <ResponsiveImage src={selectedPlace.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 space-y-6">
                    <span className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-[0.3em]">{detail.typeLabel}</span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-4 text-zinc-950">{selectedPlace.name}</h2>
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200">
                      <div><span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{t('coordinates')}</span><span className="text-xs font-mono text-zinc-600">{selectedPlace.coords}</span></div>
                      <div><span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{t('altitude')}</span><span className="text-xs text-zinc-600">{selectedPlace.stats.altitude}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-white flex flex-col">
                  <div className="p-8 md:p-12 lg:p-16 border-b border-zinc-100 bg-zinc-50">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 block mb-6">{cl.summary}</span>
                    <p className="text-xl md:text-2xl leading-relaxed text-zinc-800 max-w-4xl italic">"{detail.overview}"</p>
                  </div>
                  <div className="p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-1 bg-zinc-50/30">
                    <div className="lg:col-span-7 border border-zinc-100 p-8 space-y-8 bg-white">
                      <div className="flex items-center gap-4 mb-4"><Clock className="w-5 h-5 text-zinc-400" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{cl.chronos}</span></div>
                      <div className="space-y-6">{detail.chronos.map((item: any, i: number) => (<div key={i} className="flex gap-8 group"><span className="text-2xl font-black text-zinc-200 group-hover:text-zinc-900 transition-colors w-24 shrink-0 uppercase tracking-tighter">{item.year}</span><p className="text-sm text-zinc-600 leading-relaxed pt-1.5 border-l border-zinc-100 pl-6 group-hover:border-zinc-900 transition-colors">{item.event}</p></div>))}</div>
                    </div>
                    <div className="lg:col-span-5 border border-zinc-100 p-8 space-y-8 bg-zinc-50">
                      <div className="flex items-center gap-4 mb-4"><Shield className="w-5 h-5 text-amber-600" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{cl.tactics}</span></div>
                      <div className="space-y-6">{detail.tactics.map((tac: any, i: number) => (<div key={i} className="p-6 bg-white border border-zinc-100 space-y-2 shadow-sm"><div className="flex items-center justify-between"><span className="text-[9px] font-black uppercase tracking-widest text-amber-600 block">{tac.label}</span><Zap className="w-3 h-3 text-zinc-200" /></div><p className="text-sm text-zinc-800">{tac.value}</p></div>))}</div>
                    </div>
                    <div className="lg:col-span-12 border border-zinc-100 p-10 mt-8 bg-white">
                      <div className="flex items-center gap-4 mb-10"><Activity className="w-5 h-5 text-zinc-400" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{cl.science}</span></div>
                      <div className="grid md:grid-cols-3 gap-12">{Object.entries(detail.science).map(([key, val]: [string, any], i: number) => (<div key={i} className="space-y-4"><div className="flex items-center gap-2 border-b border-zinc-100 pb-2"><Globe className="w-3 h-3 text-zinc-300" /><h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{key}</h5></div><p className="text-sm text-zinc-700 leading-relaxed">{val}</p></div>))}</div>
                    </div>
                    <div className="lg:col-span-12 border border-zinc-100 p-10 mt-8 bg-zinc-50">
                      <div className="flex items-center gap-4 mb-6"><Star className="w-5 h-5 text-amber-600" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{cl.culture}</span></div>
                      <div className="flex flex-col md:flex-row gap-8 items-start"><div className="text-6xl font-black text-zinc-200/50 leading-none shrink-0 font-serif italic">&ldquo;</div><p className="text-xl text-zinc-700 leading-relaxed max-w-5xl">{detail.culture}</p></div>
                    </div>
                    {selectedPlace.tag === 'nature' && (
                      <div className="lg:col-span-12 border border-zinc-200 p-10 mt-8 bg-white text-zinc-900 shadow-sm">
                        <div className="flex items-center gap-4 mb-8"><Leaf className="w-5 h-5 text-green-600" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{cl.bio}</span></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          {[
                            { label: { en: 'FLORA INDEX', ru: 'ИНДЕКС ФЛОРЫ', kz: 'ФЛОРА ИНДЕКСІ' }[language as 'en'|'ru'|'kz'] || 'FLORA INDEX', val: { en: 'Endemic high-altitude shrubs, rare spruce varieties.', ru: 'Эндемичные высокогорные кустарники, редкие сорта ели.', kz: 'Эндемикалық биік таулы бұталар, шыршаның сирек сорттары.' }[language as 'en'|'ru'|'kz'] || '' },
                            { label: { en: 'FAUNA SIGNS', ru: 'СЛЕДЫ ФАУНЫ', kz: 'ФАУНА ІЗДЕРІ' }[language as 'en'|'ru'|'kz'] || 'FAUNA SIGNS', val: { en: 'Snow leopard sightings reported, golden eagle habitat.', ru: 'Зафиксированы снежные барсы, ареал обитания беркута.', kz: 'Қар барыстары тіркелген, бүркіттің мекені.' }[language as 'en'|'ru'|'kz'] || '' },
                            { label: { en: 'SOIL PROFILE', ru: 'ПРОФИЛЬ ПОЧВЫ', kz: 'ТОПЫРАҚ ПРОФИЛІ' }[language as 'en'|'ru'|'kz'] || 'SOIL PROFILE', val: { en: 'Rich mineral deposits, ancient glacial moraine.', ru: 'Богатые минеральные отложения, древняя ледниковая морена.', kz: 'Бай минералды шөгінділер, ежелгі мұздық моренасы.' }[language as 'en'|'ru'|'kz'] || '' },
                            { label: { en: 'AIR IONIZATION', ru: 'ИОНИЗАЦИЯ ВОЗДУХА', kz: 'АУА ИОНИЗАЦИЯСЫ' }[language as 'en'|'ru'|'kz'] || 'AIR IONIZATION', val: { en: 'Extreme purity levels, negative ion concentration > 2000/cm³.', ru: 'Экстремальный уровень чистоты, концентрация отрицательных ионов > 2000/см³.', kz: 'Экстремалды тазалық деңгейі, теріс иондар концентрациясы > 2000/см³.' }[language as 'en'|'ru'|'kz'] || '' },
                          ].map((item, i) => (<div key={i}><span className="text-[9px] font-black text-zinc-400 block mb-2">{item.label}</span><p className="text-xs text-zinc-700">{item.val}</p></div>))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-12 border-t border-zinc-100"><ReviewSection targetId={selectedPlace.id} targetType="place" targetName={selectedPlace.name} /></div>
                  <div className="mt-auto p-8 md:p-12 border-t border-zinc-100 bg-white flex flex-col md:flex-row gap-4 items-center">
                    <button onClick={() => handleAddToTrip(selectedPlace)} className="w-full md:flex-1 py-5 bg-zinc-100 border border-zinc-200 text-zinc-900 font-black uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-sm flex items-center justify-center gap-4 group"><Plus className="w-5 h-5" />{t('places_add_to_trip')}</button>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => toggleWishlist(PLACES.find(p => p.id === selectedPlace.id)!, selectedPlace.region)} className="flex-1 md:w-16 h-16 flex items-center justify-center border border-zinc-200 hover:bg-zinc-100 transition-all active:scale-95"><Heart className={`w-5 h-5 ${isLiked(selectedPlace.id) ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} /></button>
                      <button className="flex-1 md:w-16 h-16 flex items-center justify-center border border-zinc-200 hover:bg-zinc-100 transition-all active:scale-95"><Share className="w-5 h-5 text-zinc-400" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
