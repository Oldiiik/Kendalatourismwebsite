import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { 
  ArrowRight, Clock, MapPin, Share, Tag, Calendar, 
  Search, X, Eye, ThumbsUp, ChevronDown, Bookmark, Globe, 
  TrendingUp, ArrowUpRight, Sparkles, Users, Zap
} from '../ui/icons';
import { localizedData } from '../../data_localized';
import { hq } from '../../utils/imageUrls';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';

const uiLabels: Record<string, any> = {
  en: { views: 'Views', likes: 'Likes', tags: 'Related Tags', share: 'Share', live: 'LIVE', readTime: 'min read', search: 'Search stories...', noResults: 'No stories found', readMore: 'Read Full Story', featured: 'Featured', keyFacts: 'Key Facts', photoGallery: 'Gallery', moreStories: 'More from Kendala', backToAll: 'All Stories', minutes: 'min', scrollDown: 'Scroll to explore', loadMore: 'Load More Stories' },
  ru: { views: 'Просмотры', likes: 'Лайки', tags: 'Теги', share: 'Поделиться', live: 'LIVE', readTime: 'мин чтения', search: 'Поиск историй...', noResults: 'Истории не найдены', readMore: 'Читать полностью', featured: 'Избранное', keyFacts: 'Ключевые факты', photoGallery: 'Галерея', moreStories: 'Ещё от Kendala', backToAll: 'Все истории', minutes: 'мин', scrollDown: 'Прокрутите вниз', loadMore: 'Загрузить еще' },
  kz: { views: 'Қаралым', likes: 'Лүпіл', tags: 'Тегтер', share: 'Бөлісу', live: 'LIVE', readTime: 'мин оқу', search: 'Оқиғалар іздеу...', noResults: 'Оқиғалар табылмады', readMore: 'Толық оқу', featured: 'Таңдаулы', keyFacts: 'Негізгі фактілер', photoGallery: 'Галерея', moreStories: 'Kendala-дан көбірек', backToAll: 'Барлық оқиғалар', minutes: 'мин', scrollDown: 'Төмен жылжытыңыз', loadMore: 'Көбірек жүктеу' }
};

const getNormalizedLang = (lang: string): 'en' | 'ru' | 'kz' => {
    if (!lang) return 'en';
    const l = lang.toLowerCase();
    if (l.startsWith('kz') || l.startsWith('kk')) return 'kz';
    if (l.startsWith('ru')) return 'ru';
    return 'en';
};

const MagicParticles = ({ theme }: { theme: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    let particles: any[] = [];
    
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((w * h) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = theme.background || '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = theme.primary || '#fff';
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = theme.primary || '#fff';
            ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

const getStatsForArticle = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const views = ((Math.abs(hash % 90) + 10) / 10).toFixed(1) + 'k';
  const likes = Math.abs(hash % 2000) + 200;
  return { views, likes };
};

const ARTICLES = [
  {
    id: "news-01",
    title: {
      en: "Kazakhstan Launches 'Neo-Nomad' Digital Visa",
      ru: "Казахстан запускает цифровую визу 'Neo-Nomad'",
      kz: "Қазақстан 'Neo-Nomad' цифрлық визасын іске қосты"
    },
    summary: {
      en: "In a major move to attract global talent, Kazakhstan has officially introduced the 'Neo-Nomad' visa, allowing remote workers from over 50 countries to live and work in the country for up to one year, positioning itself as the new hub for digital professionals.",
      ru: "С целью привлечения глобальных талантов Казахстан официально ввел визу 'Neo-Nomad', позволяющую удаленным работникам из более чем 50 стран жить и работать в стране до одного года, позиционируя себя как новый центр для цифровых профессионалов.",
      kz: "Жаһандық таланттарды тарту мақсатында Қазақстан ресми түрде 'Neo-Nomad' визасын енгізді. Бұл виза 50-ден астам елден келген қашықтан жұмыс істейтін мамандарға елде бір жылға дейін тұруға және жұмыс істеуге мүмкіндік береді."
    },
    image: "https://images.unsplash.com/photo-1604145703889-5c58d94ee681",
    category: "Business",
    date: "2026-02-05",
    author: "Almas Sadykov",
    authorRole: { en: "Senior Tech Reporter", ru: "Технический обозреватель", kz: "Аға техникалық шолушы" },
    readTime: 12,
    location: "Astana / Almaty",
    featured: true,
    sections: [
      {
        heading: { 
          en: "A Strategic Move for the Digital Economy", 
          ru: "Стратегический шаг для цифровой экономики", 
          kz: "Цифрлық экономика үшін стратегиялық қадам" 
        },
        body: { 
          en: "The Ministry of Tourism and Sports, in collaboration with the Ministry of Digital Development, has unveiled the 'Neo-Nomad' visa program, a landmark initiative designed to integrate Kazakhstan into the global remote work revolution. As of February 2026, foreign nationals with a verified steady income of at least $3,000 per month can apply for this residency permit, which grants them the right to stay in the country for up to one year, renewable annually.",
          ru: "Министерство туризма и спорта совместно с Министерством цифрового развития представили программу визы 'Neo-Nomad' — знаковую инициативу, призванную интегрировать Казахстан в глобальную революцию удаленной работы. С февраля 2026 года иностранные граждане с подтвержденным стабильным доходом не менее 3000 долларов в месяц могут подать заявку на получение этого вида на жительство, который дает право находиться в стране до одного года с возможностью ежегодного продления.",
          kz: "Туризм және спорт министрлігі Цифрлық даму министрлігімен бірлесіп 'Neo-Nomad' визалық бағдарламасын ұсынды. Бұл бастама Қазақстанды жаһандық қашықтан жұмыс істеу революциясына біріктіруге арналған. 2026 жылдың ақпанынан бастап айына кемінде 3000 доллар тұрақты табысы бар шетел азаматтары осы тұру рұқсатына өтініш бере алады."
        }
      },
      {
        heading: { 
            en: "Why Kazakhstan? The Competitive Edge", 
            ru: "Почему Казахстан? Конкурентное преимущество", 
            kz: "Неліктен Қазақстан? Бәсекелестік артықшылық" 
        },
        body: { 
            en: "For the digital nomad, Kazakhstan offers a compelling value proposition. Almaty, the cultural capital, boasts a cafe culture that rivals European cities, with high-speed fiber internet widely available even in residential areas. The cost of living remains significantly lower than in Western Europe or North America, allowing remote workers to enjoy a higher quality of life—premium apartments, dining, and leisure activities—at a fraction of the cost.", 
            ru: "Для цифровых кочевников Казахстан предлагает убедительное ценностное предложение. Алматы, культурная столица, может похвастаться кофейной культурой, соперничающей с европейскими городами, и высокоскоростным оптоволоконным интернетом. Стоимость жизни остается значительно ниже, чем в Западной Европе или Северной Америке, что позволяет удаленным работникам наслаждаться более высоким качеством жизни.", 
            kz: "Цифрлық көшпенділер үшін Қазақстан тартымды ұсыныстар жасайды. Мәдени астана Алматы еуропалық қалалармен бәсекелесетін кофейня мәдениетімен және жоғары жылдамдықты интернетпен мақтана алады. Өмір сүру құны Батыс Еуропа немесе Солтүстік Америкаға қарағанда едәуір төмен." 
        }
      }
    ],
    stats: [
      { value: "$3k+", label: { en: "Min Income", ru: "Мин. доход", kz: "Мин. табыс" } },
      { value: "1 yr", label: { en: "Visa Duration", ru: "Срок визы", kz: "Виза мерзімі" } },
      { value: "50+", label: { en: "Countries", ru: "Стран", kz: "Елдер" } },
      { value: "5 Days", label: { en: "Processing", ru: "Оформление", kz: "Өңдеу уақыты" } }
    ],
    quote: { 
        text: { 
            en: "Kazakhstan offers the perfect blend of modern digital infrastructure and untamed nature. It is the frontier for the next generation of global workers.", 
            ru: "Казахстан предлагает идеальное сочетание современной цифровой инфраструктуры и дикой природы. Это рубеж для следующего поколения глобальных работников.", 
            kz: "Қазақстан заманауи цифрлық инфрақұрылым мен табиғи сұлулықтың керемет үйлесімін ұсынады. Бұл жаһандық қызметкерлердің келесі буыны үшін жаңа мүмкіндік." 
        }, 
        author: "Digital Nomad Association" 
    }
  },
  {
    id: "news-02",
    title: {
      en: "Shymbulak Mountain Resort Extends Night Skiing Operations",
      ru: "Горный курорт Шымбулак продлевает ночные катания",
      kz: "Шымбұлақ тау курорты түнгі сырғанау уақытын ұзартты"
    },
    summary: {
      en: "Following a record-breaking snowfall and major infrastructure upgrades, Shymbulak Ski Resort has announced an unprecedented extension of its night skiing season, featuring new illuminated trails and 24-hour services.",
      ru: "После рекордного снегопада и масштабной модернизации инфраструктуры горнолыжный курорт Шымбулак объявил о беспрецедентном продлении сезона ночных катаний с новыми освещенными трассами и круглосуточным сервисом.",
      kz: "Рекордтық қар жаууы мен инфрақұрылымды жаңғыртудан кейін Шымбұлақ тау шаңғысы курорты түнгі сырғанау маусымын бұрын-соңды болмаған мерзімге ұзартып, жаңа жарықтандырылған трассалар мен тәулік бойы қызмет көрсетуді ұсынды."
    },
    image: "https://images.unsplash.com/photo-1459196198227-6655e22114d8",
    category: "Nature",
    date: "2026-02-03",
    author: "Elena Konovalova",
    authorRole: { en: "Winter Sports Editor", ru: "Редактор зимних видов спорта", kz: "Қысқы спорт редакторы" },
    readTime: 8,
    location: "Almaty Region",
    sections: [
      {
        heading: { en: "Lighting Up the Peaks", ru: "Огни на вершинах", kz: "Шыңдардағы жарық" },
        body: { 
            en: "Shymbulak Mountain Resort has officially completed the installation of a state-of-the-art LED lighting system along the Talgar Pass. This ambitious project effectively doubles the skiable terrain available after sunset, making it the largest illuminated night skiing area in the CIS.", 
            ru: "Горный курорт Шымбулак официально завершил установку современной системы светодиодного освещения вдоль Талгарского перевала. Этот амбициозный проект фактически удваивает зону катания, доступную после захода солнца, делая её крупнейшей освещенной зоной ночного катания в СНГ.",
            kz: "Шымбұлақ тау курорты Талғар асуы бойында заманауи LED жарықтандыру жүйесін орнатуды ресми түрде аяқтады. Бұл ауқымды жоба күн батқаннан кейін қолжетімді сырғанау аймағын екі есеге ұлғайтып, оны ТМД-дағы ең үлкен түнгі сырғанау аймағына айналдырды."
        }
      }
    ],
    stats: [
      { value: "3200m", label: { en: "Elevation", ru: "Высота", kz: "Биіктік" } },
      { value: "25km", label: { en: "Total Piste", ru: "Трассы", kz: "Трассалар" } },
      { value: "12am", label: { en: "Closing Time", ru: "Закрытие", kz: "Жабылуы" } },
      { value: "100%", label: { en: "Green Energy", ru: "Эко-энергия", kz: "Эко-қуат" } }
    ]
  },
  {
    id: "news-03",
    title: {
        en: "Turkistan's Ancient Mausoleum Restoration Completed",
        ru: "Завершена реставрация древнего мавзолея в Туркестане",
        kz: "Түркістандағы ежелгі кесене реставрациясы аяқталды"
    },
    summary: {
        en: "The comprehensive five-year restoration project of the Khoja Ahmed Yasawi Mausoleum has concluded, revitalizing the UNESCO World Heritage site with traditional techniques and modern structural reinforcement.",
        ru: "Завершен комплексный пятилетний проект реставрации мавзолея Ходжи Ахмеда Ясави, вдохнувший новую жизнь в объект Всемирного наследия ЮНЕСКО с использованием традиционных техник и современного структурного укрепления.",
        kz: "Қожа Ахмет Ясауи кесенесін қалпына келтірудің бес жылдық кешенді жобасы аяқталып, ЮНЕСКО-ның Бүкіләлемдік мұра нысаны дәстүрлі әдістер мен заманауи құрылымдық нығайту арқылы жаңартылды."
    },
    image: "https://images.unsplash.com/photo-1579983291208-99ab7827fd5c",
    category: "History",
    date: "2026-02-01",
    author: "Serik Bolat",
    authorRole: { en: "Chief Historian", ru: "Главный историк", kz: "Бас тарихшы" },
    readTime: 10,
    location: "Turkistan",
    sections: [
      {
        heading: { en: "A Monument Reborn", ru: "Возрождение памятника", kz: "Ескерткіштің қайта жаңғыруы" },
        body: { 
            en: "The scaffolding has finally come down, revealing the Khoja Ahmed Yasawi Mausoleum in its full, breathtaking glory. Initiated in 2021, this restoration project was one of the most complex heritage conservation efforts in Central Asia.", 
            ru: "Строительные леса наконец убраны, открывая мавзолей Ходжи Ахмеда Ясави во всей его захватывающей дух красоте. Этот проект реставрации, начатый в 2021 году, стал одним из самых сложных усилий по сохранению наследия в Центральной Азии.",
            kz: "Қожа Ахмет Ясауи кесенесінің құрылыс ормандары алынып, оның толық сән-салтанаты ашылды. 2021 жылы басталған бұл реставрациялық жоба Орталық Азиядағы мұраны сақтау бойынша ең күрделі жұмыстардың бірі болды."
        }
      }
    ],
    stats: [
      { value: "1389", label: { en: "Founded", ru: "Основан", kz: "Құрылды" } },
      { value: "39m", label: { en: "Dome Height", ru: "Высота купола", kz: "Күмбез биіктігі" } },
      { value: "5 Yrs", label: { en: "Restoration", ru: "Реставрация", kz: "Реставрация" } },
      { value: "2M+", label: { en: "Visitors", ru: "Посетителей", kz: "Келушілер" } }
    ]
  },
  {
    id: "news-04",
    title: {
        en: "Luxury Eco-Lodge 'Kolsai Serenity' Opens Doors",
        ru: "Открылся люксовый эко-лодж 'Kolsai Serenity'",
        kz: "'Kolsai Serenity' люкс эко-лоджы есігін айқара ашты"
    },
    summary: {
        en: "Setting a new benchmark for sustainable tourism, a high-end eco-lodge has opened in the Kolsai Lakes National Park, offering zero-emission luxury in the heart of the Tien Shan mountains.",
        ru: "Устанавливая новый стандарт устойчивого туризма, в Национальном парке 'Кольсайские озера' открылся высококлассный эко-лодж, предлагающий роскошный отдых с нулевым уровнем выбросов в самом сердце Тянь-Шаня.",
        kz: "Тұрақты туризмнің жаңа стандартын белгілей отырып, 'Көлсай көлдері' ұлттық паркінде Тянь-Шань тауларының қақ ортасында қалдықсыз люкс демалысын ұсынатын жоғары сапалы эко-лодж ашылды."
    },
    image: "https://images.unsplash.com/photo-1671894618012-b1f9d305a97f",
    category: "Travel",
    date: "2026-01-28",
    author: "Travel Weekly Staff",
    authorRole: { en: "Hotel Reviewer", ru: "Отельный критик", kz: "Қонақ үй сыншысы" },
    readTime: 7,
    location: "Kolsai Lakes",
    sections: [
      {
        heading: { en: "Sustainable Luxury Defined", ru: "Определение устойчивой роскоши", kz: "Тұрақты сән-салтанат" },
        body: { 
            en: "Nestled in the pine forests overlooking the first Kolsai Lake, 'Kolsai Serenity' is the first hotel of its kind in Kazakhstan. The lodge was constructed using a modular design that required no heavy machinery, preserving the forest floor intact.",
            ru: "Расположенный в сосновых лесах с видом на первое озеро Кольсай, 'Kolsai Serenity' является первым отелем такого рода в Казахстане. Лодж был построен с использованием модульной конструкции, не требующей тяжелой техники, что позволило сохранить лесную почву нетронутой.",
            kz: "Бірінші Көлсай көліне қарайтын қарағайлы ормандарда орналасқан 'Kolsai Serenity' — Қазақстандағы осындай алғашқы қонақ үй. Лодж орман топырағын сақтай отырып, ауыр техниканы қажет етпейтін модульдік дизайн арқылы салынған."
        }
      }
    ],
    stats: [
      { value: "0%", label: { en: "Emissions", ru: "Выбросы", kz: "Шығарындылар" } },
      { value: "100%", label: { en: "Renewable Energy", ru: "ВИЭ", kz: "ЖЭК" } },
      { value: "90%", label: { en: "Local Sourcing", ru: "Локальные продукты", kz: "Жергілікті өнім" } }
    ]
  },
  {
    id: "news-05",
    title: {
        en: "Almaty Green Bazaar Goes Digital",
        ru: "Зеленый базар Алматы переходит в цифру",
        kz: "Алматының Көк базары цифрлық форматқа көшуде"
    },
    summary: {
        en: "The historic Green Bazaar launches an online delivery platform, bringing fresh spices and local produce to doorsteps citywide.",
        ru: "Исторический Зеленый базар запускает онлайн-платформу доставки, привозя свежие специи и местные продукты прямо к дверям по всему городу.",
        kz: "Тарихи Көк базар онлайн жеткізу платформасын іске қосып, жаңа піскен дәмдеуіштер мен жергілікті өнімдерді қала бойынша үйге дейін жеткізеді."
    },
    image: "https://images.unsplash.com/photo-1756363886854-b51467278a52",
    category: "Food",
    date: "2026-01-25",
    author: "Dina Ibraeva",
    authorRole: { en: "Food Tech Analyst", ru: "Фудтех аналитик", kz: "Фудтех сарапшысы" },
    readTime: 6,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Tradition Meets Tech", ru: "Традиции встречают технологии", kz: "Дәстүр мен технология" },
            body: { 
                en: "For over a century, the Green Bazaar has been the beating heart of Almaty's culinary life. Now, it is entering the digital age. The bazaar administration has launched a dedicated mobile app that allows residents to browse stalls virtually.",
                ru: "Более века Зеленый базар был бьющимся сердцем кулинарной жизни Алматы. Теперь он вступает в цифровую эпоху. Администрация базара запустила специальное мобильное приложение, позволяющее жителям виртуально посещать прилавки.",
                kz: "Бір ғасырдан астам уақыт бойы Көк базар Алматының аспаздық өмірінің жүрегі болып келді. Енді ол цифрлық дәуірге қадам басуда. Базар әкімшілігі тұрғындарға сөрелерді виртуалды түрде аралауға мүмкіндік беретін арнайы мобильді қосымшаны іске қосты."
            }
        }
    ],
    stats: [
      { value: "1875", label: { en: "Est. Year", ru: "Год основания", kz: "Құрылған жылы" } },
      { value: "500+", label: { en: "Vendors", ru: "Продавцов", kz: "Сатушылар" } },
      { value: "1hr", label: { en: "Delivery", ru: "Доставка", kz: "Жеткізу" } }
    ]
  },
  {
    id: "news-06",
    title: {
        en: "Space Tourism Flights Resume at Baikonur",
        ru: "Возобновлены космические туристические полеты на Байконуре",
        kz: "Байқоңырда ғарыштық туристік ұшулар қайта жанданды"
    },
    summary: {
        en: "Roscosmos and private partners announce the resumption of tourist launches from the world's oldest spaceport.",
        ru: "Роскосмос и частные партнеры объявляют о возобновлении туристических запусков со старейшего космодрома мира.",
        kz: "Роскосмос пен жеке серіктестер әлемдегі ең көне ғарыш айлағынан туристік ұшырылымдардың қайта жанданғанын хабарлады."
    },
    image: "https://images.unsplash.com/photo-1614642240262-a452c2c11724",
    category: "Travel",
    date: "2026-01-22",
    author: "Space Daily Staff",
    authorRole: { en: "Aerospace Reporter", ru: "Аэрокосмический репортер", kz: "Аэроғарыш тілшісі" },
    readTime: 9,
    location: "Baikonur",
    sections: [
        {
            heading: { en: "A Ticket to Orbit", ru: "Билет на орбиту", kz: "Орбитаға билет" },
            body: { 
                en: "Baikonur Cosmodrome is once again opening its doors to private explorers. A new agreement has paved the way for two annual dedicated tourist missions. The 'Soyuz-MS' tourist variant spacecraft has been retrofitted to accommodate passengers.",
                ru: "Космодром Байконур снова открывает свои двери для частных исследователей. Новое соглашение открыло путь для двух ежегодных специальных туристических миссий. Космический корабль 'Союз-МС' в туристическом варианте был переоборудован для размещения пассажиров.",
                kz: "Байқоңыр ғарыш айлағы жеке зерттеушілерге есігін қайта ашуда. Жаңа келісім жыл сайынғы екі арнайы туристік миссияға жол ашты. 'Союз-МС' туристік ғарыш кемесі жолаушыларды қабылдау үшін қайта жабдықталды."
            }
        }
    ]
  },
  {
    id: "news-07",
    title: {
        en: "Rare Snow Leopard Family Sighting",
        ru: "Редкая встреча с семьей снежных барсов",
        kz: "Қар барысы отбасымен сирек кездесу"
    },
    summary: {
        en: "Trap cameras in the Ile-Alatau National Park capture stunning footage of a snow leopard mother with three cubs.",
        ru: "Фотоловушки в Иле-Алатауском национальном парке запечатлели потрясающие кадры матери снежного барса с тремя детенышами.",
        kz: "Іле-Алатау ұлттық паркіндегі фототұзақтар үш күшігі бар қар барысының таңғажайып кадрларын түсіріп алды."
    },
    image: "https://images.unsplash.com/photo-1768477259900-e647a82d0dde",
    category: "Nature",
    date: "2026-01-20",
    author: "Wild Planet",
    authorRole: { en: "Conservationist", ru: "Эколог", kz: "Эколог" },
    readTime: 5,
    location: "Almaty Region",
    sections: [
        {
            heading: { en: "The Ghost of the Mountains Returns", ru: "Возвращение призрака гор", kz: "Тау елесінің оралуы" },
            body: { 
                en: "The snow leopard, an elusive apex predator, is rarely seen. The footage shows a healthy female guiding three playful cubs through a rocky ravine just 40 kilometers from Almaty.",
                ru: "Снежный барс, неуловимый хищник, встречается крайне редко. На кадрах видно, как здоровая самка ведет трех игривых детенышей через скалистое ущелье всего в 40 километрах от Алматы.",
                kz: "Таудың елесі саналатын қар барысы өте сирек кездеседі. Кадрлардан Алматыдан небәрі 40 шақырым жердегі жартасты шатқалда үш ойнақы күшігін ертіп жүрген сау ұрғашы барысты көруге болады."
            }
        }
    ],
    quote: { 
        text: { en: "To see a mother with three cubs is incredibly rare.", ru: "Увидеть мать с тремя детенышами — невероятная редкость.", kz: "Анасын үш күшігімен көру — өте сирек кездесетін жағдай." }, 
        author: "Park Director" 
    }
  },
  {
    id: "news-08",
    title: {
        en: "Charyn Canyon Visitor Center Opens",
        ru: "Открылся визит-центр Чарынского каньона",
        kz: "Шарын шатқалының визит-орталығы ашылды"
    },
    summary: {
        en: "A modern visitor complex with glamping pods and a geological museum enhances the Charyn Canyon experience.",
        ru: "Современный комплекс для посетителей с глэмпингами и геологическим музеем улучшает впечатления от посещения Чарынского каньона.",
        kz: "Глэмпингтері мен геологиялық мұражайы бар заманауи келушілер кешені Шарын шатқалына саяхат сапасын жақсартады."
    },
    image: "https://images.unsplash.com/photo-1548586196-6fe665a5c1f0",
    category: "Nature",
    date: "2026-01-18",
    author: "Nature Trails",
    authorRole: { en: "Destination Guide", ru: "Гид", kz: "Гид" },
    readTime: 6,
    location: "Almaty Region",
    sections: [
        {
            heading: { en: "Comfort in the Desert", ru: "Комфорт в пустыне", kz: "Шөлдегі жайлылық" },
            body: { 
                en: "Visiting the spectacular red sandstone formations used to be a rugged trip. Now, the new 'Valley of Castles' visitor complex has transformed it into a comfortable destination.",
                ru: "Посещение впечатляющих скал из красного песчаника раньше было суровым путешествием. Теперь новый визит-центр 'Долина замков' превратил его в комфортное направление.",
                kz: "Қызыл құмтас түзілімдерін аралау бұрын қиын саяхат болатын. Енді жаңа 'Қамалдар алқабы' кешені оны жайлы демалыс орнына айналдырды."
            }
        }
    ]
  },
  {
    id: "news-09",
    title: {
        en: "Almaty's Third Wave Coffee Scene Booms",
        ru: "Бум кофейной культуры третьей волны в Алматы",
        kz: "Алматыдағы үшінші толқын кофе мәдениетінің дүмпуі"
    },
    summary: {
        en: "From micro-roasteries to world-class latte art, Almaty has firmly established itself as the coffee capital of Central Asia.",
        ru: "От микро-обжарочных цехов до латте-арта мирового класса — Алматы прочно утвердился в статусе кофейной столицы Центральной Азии.",
        kz: "Шағын қуыру цехтарынан бастап әлемдік деңгейдегі латте-артқа дейін Алматы Орталық Азияның кофе астанасы ретінде қалыптасты."
    },
    image: "https://images.unsplash.com/photo-1604145703889-5c58d94ee681",
    category: "Food",
    date: "2026-01-15",
    author: "The Bean Scene",
    authorRole: { en: "Lifestyle Editor", ru: "Лайфстайл редактор", kz: "Лайфстайл редакторы" },
    readTime: 5,
    location: "Almaty",
    sections: [
        {
            heading: { en: "A Caffeinated Revolution", ru: "Кофейная революция", kz: "Кофе революциясы" },
            body: { 
                en: "Walking through Almaty's Golden Square, the smell of freshly roasted Arabica is unmistakable. Local roasteries are sourcing green beans directly from farmers, roasting them locally to highlight their unique terroir.",
                ru: "Прогуливаясь по Золотому квадрату Алматы, невозможно не заметить запах свежеобжаренной арабики. Местные обжарщики закупают зеленые зерна напрямую у фермеров, обжаривая их на месте.",
                kz: "Алматының Алтын алаңымен серуендегенде жаңа қуырылған арабиканың иісі бірден сезіледі. Жергілікті қуырушылар жасыл дәндерді фермерлерден тікелей сатып алып, оларды жергілікті жерде қуырады."
            }
        }
    ]
  },
  {
    id: "news-10",
    title: {
        en: "Beshbarmak Festival Sets Guinness World Record",
        ru: "Фестиваль бешбармака установил рекорд Гиннесса",
        kz: "Бешбармақ фестивалі Гиннесс рекордын орнатты"
    },
    summary: {
        en: "Chefs in Astana have cooked up the world's largest serving of Beshbarmak, the national dish, feeding thousands in a massive celebration.",
        ru: "Повара в Астане приготовили самую большую в мире порцию бешбармака, национального блюда, накормив тысячи людей на масштабном празднике.",
        kz: "Астана аспаздары ұлттық тағам – бешбармақтың әлемдегі ең үлкен үлесін дайындап, мыңдаған адамды ауқымды мерекеде тамақтандырды."
    },
    image: "https://images.unsplash.com/photo-1703820775340-b923e5929371",
    category: "Food",
    date: "2026-01-12",
    author: "Gulnar M.",
    authorRole: { en: "Culinary Critic", ru: "Кулинарный критик", kz: "Аспаздық сыншы" },
    readTime: 4,
    location: "Astana",
    sections: [
        {
            heading: { en: "A Record-Breaking Feast", ru: "Рекордное застолье", kz: "Рекордтық той" },
            body: { 
                en: "In a monumental display of culinary coordination, a team of 50 chefs in Astana prepared a single serving of Beshbarmak weighing 7,365 kilograms. The dish was cooked in a custom-made giant kazan.",
                ru: "В монументальной демонстрации кулинарной координации команда из 50 поваров в Астане приготовила одну порцию бешбармака весом 7 365 килограммов. Блюдо готовили в огромном казане, сделанном на заказ.",
                kz: "Аспаздық үйлесімнің керемет үлгісі ретінде Астанадағы 50 аспаздан құралған топ салмағы 7 365 келі болатын бешбармақ дайындады. Тағам арнайы жасалған алып қазанда пісірілді."
            }
        }
    ],
    stats: [
      { value: "7.3T", label: { en: "Weight", ru: "Вес", kz: "Салмағы" } },
      { value: "50", label: { en: "Chefs", ru: "Поваров", kz: "Аспаздар" } },
      { value: "15k+", label: { en: "Fed", ru: "Накормлено", kz: "Тамақтандырылды" } }
    ]
  },
  {
    id: "news-11",
    title: {
        en: "Astana's Skyline Evolution: The 'Steppe Towers' Top Out",
        ru: "Эволюция скайлайна Астаны: завершены 'Степные башни'",
        kz: "Астана келбетінің эволюциясы: 'Дала мұнаралары' бой көтерді"
    },
    summary: {
        en: "The capital's futuristic architecture gets a new addition as the 'Steppe Towers', designed by Zaha Hadid Architects, reach their final height.",
        ru: "Футуристическая архитектура столицы получила новое дополнение: 'Степные башни', спроектированные Zaha Hadid Architects, достигли своей финальной высоты.",
        kz: "Елорданың футуристік сәулеті жаңа нысанмен толықты: Zaha Hadid Architects жобалаған 'Дала мұнаралары' соңғы биіктігіне жетті."
    },
    image: "https://images.unsplash.com/photo-1683334087142-3036da3628dc",
    category: "Business",
    date: "2026-01-10",
    author: "ArchDaily",
    authorRole: { en: "Architecture Desk", ru: "Архитектура", kz: "Сәулет бөлімі" },
    readTime: 6,
    location: "Astana",
    sections: [
        {
            heading: { en: "Fluid Forms", ru: "Плавные формы", kz: "Жұмсақ пішіндер" },
            body: { 
                en: "Astana has long been a playground for avant-garde architecture. The twin residential and office skyscrapers avoid sharp angles, featuring fluid, organic curves inspired by the wind-swept grasses of the Kazakh steppe.",
                ru: "Астана давно стала площадкой для авангардной архитектуры. Две жилые и офисные высотки избегают острых углов, отличаясь плавными, органичными изгибами, вдохновленными ветреными травами казахской степи.",
                kz: "Астана көптен бері авангардтық сәулет алаңына айналды. Егіз тұрғын үй және кеңсе зәулім ғимараттары өткір бұрыштардан аулақ, қазақ даласының желі тербеген шөптерінен шабыттанған жұмсақ, органикалық қисықтарға ие."
            }
        }
    ]
  },
  {
    id: "news-12",
    title: {
        en: "Eagle Hunter Festival in Altai Draws Global Crowds",
        ru: "Фестиваль беркутчи на Алтае привлекает толпы туристов",
        kz: "Алтайдағы бүркітшілер фестивалі әлем назарын аударды"
    },
    summary: {
        en: "The ancient tradition of 'Burkitshi' was on full display in the Altai Mountains, where hunters and their golden eagles demonstrated their bond.",
        ru: "Древняя традиция 'Беркутчи' была продемонстрирована во всей красе в Алтайских горах, где охотники и их беркуты показали свою связь.",
        kz: "'Бүркітші' ежелгі дәстүрі Алтай тауларында толық көрініс тапты, онда аңшылар мен олардың бүркіттері өз өнерлерін паш етті."
    },
    image: "https://images.unsplash.com/photo-1562682346-cec0224a4c3b",
    category: "Culture",
    date: "2026-01-08",
    author: "Nomad Soul",
    authorRole: { en: "Cultural Anthropologist", ru: "Антрополог", kz: "Антрополог" },
    readTime: 7,
    location: "East Kazakhstan",
    sections: [
        {
            heading: { en: "Wings of the Steppe", ru: "Крылья степи", kz: "Дала қанаттары" },
            body: { 
                en: "Against the backdrop of the snow-capped Altai peaks, over 100 eagle hunters gathered. The speed, power, and grace of the golden eagles is a sight that connects the observer directly to the ancient nomadic past.",
                ru: "На фоне заснеженных вершин Алтая собралось более 100 беркутчи. Скорость, мощь и грация беркутов — это зрелище, которое напрямую связывает наблюдателя с древним кочевым прошлым.",
                kz: "Қарлы Алтай шыңдарының аясында 100-ден астам бүркітші жиналды. Бүркіттердің жылдамдығы, күші мен сымбаты көрерменді ежелгі көшпенділер тарихымен тікелей байланыстыратын көрініс."
            }
        }
    ]
  },
  {
    id: "news-13",
    title: {
        en: "New High-Speed Train Link to Tashkent Launched",
        ru: "Запущен новый скоростной поезд в Ташкент",
        kz: "Ташкентке жаңа жүрдек пойыз іске қосылды"
    },
    summary: {
        en: "The 'Silk Road Express' creates a seamless rail connection between Almaty and Tashkent, reducing travel time to 4 hours.",
        ru: "'Шелковый путь экспресс' создает бесшовное железнодорожное сообщение между Алматы и Ташкентом, сокращая время в пути до 4 часов.",
        kz: "'Жібек жолы экспресі' Алматы мен Ташкент арасында үздіксіз теміржол байланысын орнатып, жол жүру уақытын 4 сағатқа дейін қысқартады."
    },
    image: "https://images.unsplash.com/photo-1698753864905-a447aa362ec9",
    category: "Business",
    date: "2026-01-05",
    author: "Transit Map",
    authorRole: { en: "Transport Correspondent", ru: "Транспортный корр.", kz: "Көлік тілшісі" },
    readTime: 5,
    location: "Almaty / Tashkent",
    sections: [
        {
            heading: { en: "Connecting the Capitals", ru: "Соединяя столицы", kz: "Астаналарды жалғау" },
            body: { 
                en: "A historic joint infrastructure project between Kazakhstan and Uzbekistan has officially launched. The new high-speed rail line allows the modern Talgo-based train to travel between Almaty and Tashkent in just under 4 hours.",
                ru: "Официально запущен исторический совместный инфраструктурный проект Казахстана и Узбекистана. Новая скоростная железнодорожная линия позволяет современному поезду Talgo курсировать между Алматы и Ташкентом менее чем за 4 часа.",
                kz: "Қазақстан мен Өзбекстан арасындағы тарихи бірлескен инфрақұрылымдық жоба ресми түрде іске қосылды. Жаңа жүрдек теміржол желісі заманауи Talgo пойызына Алматы мен Ташкент арасын 4 сағатқа жетпей жүріп өтуге мүмкіндік береді."
            }
        }
    ]
  },
  {
    id: "news-14",
    title: {
        en: "Almaty Jazz Festival Lineup Announced",
        ru: "Объявлен лайнап Алматинского джазового фестиваля",
        kz: "Алматы джаз фестивалінің құрамы жарияланды"
    },
    summary: {
        en: "Grammy-winning artists and local ethno-jazz fusion bands are set to perform at the open-air festival near Kok Tobe.",
        ru: "Обладатели Грэмми и местные этно-джаз группы выступят на фестивале под открытым небом возле Кок-Тобе.",
        kz: "Грэмми иегерлері мен жергілікті этно-джаз топтары Көк-Төбе маңындағы ашық аспан астындағы фестивальде өнер көрсетеді."
    },
    image: "https://images.unsplash.com/photo-1765850262569-6db347d596f5",
    category: "Culture",
    date: "2026-01-02",
    author: "Music Weekly",
    authorRole: { en: "Arts Critic", ru: "Музыкальный критик", kz: "Музыка сыншысы" },
    readTime: 4,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Jazz Under the Stars", ru: "Джаз под звездами", kz: "Жұлдыздар астындағы джаз" },
            body: { 
                en: "The 2026 Almaty Jazz Festival promises to be the most ambitious edition yet. Scheduled for April at the open-air venue, the festival will feature headliners sharing the stage with Kazakhstan's own rising stars.",
                ru: "Алматинский джазовый фестиваль 2026 года обещает стать самым амбициозным. Запланированный на апрель на открытой площадке, фестиваль представит хедлайнеров, которые разделят сцену с восходящими звездами Казахстана.",
                kz: "2026 жылғы Алматы джаз фестивалі ең ауқымды шара болмақ. Сәуір айына жоспарланған ашық аспан астындағы фестивальде хедлайнерлер Қазақстанның жарық жұлдыздарымен бір сахнада өнер көрсетеді."
            }
        }
    ]
  },
  {
    id: "news-15",
    title: {
        en: "Aktau's Caspian Riviera Continues Expansion",
        ru: "Расширение Каспийской Ривьеры в Актау",
        kz: "Ақтаудағы Каспий Ривьерасы кеңеюде"
    },
    summary: {
        en: "With new 5-star resorts and a 5km seaside promenade, Aktau is rapidly transforming into the premier beach destination.",
        ru: "С новыми 5-звездочными курортами и 5-километровой набережной Актау быстро превращается в первоклассное пляжное направление.",
        kz: "Жаңа 5 жұлдызды курорттар мен 5 шақырымдық жағалау променадымен Ақтау тез арада жоғары деңгейлі жағажай демалыс орнына айналуда."
    },
    image: "https://images.unsplash.com/photo-1752418720889-fdf6b1da6284",
    category: "Travel",
    date: "2025-12-28",
    author: "Sun & Sand",
    authorRole: { en: "Travel Reporter", ru: "Тревел-репортер", kz: "Саяхат тілшісі" },
    readTime: 5,
    location: "Aktau",
    sections: [
        {
            heading: { en: "The Blue Pearl", ru: "Голубая жемчужина", kz: "Көк інжу" },
            body: { 
                en: "Aktau is shedding its reputation as purely an oil town. The 'Caspian Riviera' development plan has delivered the new Rixos Water World expansion and the 'Rock Trail'—a stunning pedestrian promenade built into the cliffs.",
                ru: "Актау избавляется от репутации исключительно нефтяного города. План развития 'Каспийской Ривьеры' привел к расширению Rixos Water World и созданию 'Скальной тропы' — потрясающей пешеходной набережной в скалах.",
                kz: "Ақтау тек мұнай қаласы деген атақтан арылуда. 'Каспий Ривьерасын' дамыту жоспары Rixos Water World-ті кеңейтуге және жартастарға салынған таңғажайып жаяу жүргіншілер жолы – 'Жартасты соқпақты' жасауға мүмкіндік берді."
            }
        }
    ]
  },
  {
    id: "news-16",
    title: {
        en: "Aport Apples: Reviving a Legend",
        ru: "Апорт: возрождение легенды",
        kz: "Апорт: аңыздың қайта оралуы"
    },
    summary: {
        en: "Through genetic research and dedicated farming, the legendary giant Aport apples of Almaty are making a comeback.",
        ru: "Благодаря генетическим исследованиям и самоотверженному фермерству легендарные гигантские яблоки Апорт возвращаются.",
        kz: "Генетикалық зерттеулер мен фермерлердің еңбегінің арқасында Алматының аты аңызға айналған алып Апорт алмалары қайта оралуда."
    },
    image: "https://images.unsplash.com/photo-1767972325688-2ccea3fbd383",
    category: "Nature",
    date: "2025-12-25",
    author: "AgroTech Daily",
    authorRole: { en: "Science Reporter", ru: "Научный репортер", kz: "Ғылыми тілші" },
    readTime: 6,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Return of the King", ru: "Возвращение короля", kz: "Патшаның оралуы" },
            body: { 
                en: "The Aport apple is the symbol of Almaty. Scientists have propagated disease-resistant saplings that produce the authentic, massive fruit. Over 50 hectares of new Aport orchards have been planted.",
                ru: "Яблоко Апорт — символ Алматы. Ученые размножили устойчивые к болезням саженцы, которые дают аутентичные, массивные плоды. Высажено более 50 гектаров новых садов Апорта.",
                kz: "Апорт алмасы — Алматының символы. Ғалымдар ауруға төзімді, нағыз алып жеміс беретін көшеттерді көбейтті. 50 гектардан астам жаңа Апорт бақтары отырғызылды."
            }
        }
    ]
  },
  {
    id: "news-17",
    title: {
        en: "The Mystery of the Singing Dunes Decoded",
        ru: "Разгадана тайна Поющего бархана",
        kz: "Әнші құмның құпиясы ашылды"
    },
    summary: {
        en: "New geological research explains the unique acoustic phenomenon of the Singing Dunes in Altyn-Emel National Park.",
        ru: "Новое геологическое исследование объясняет уникальный акустический феномен Поющего бархана в национальном парке Алтын-Эмель.",
        kz: "Жаңа геологиялық зерттеу Алтын-Емел ұлттық паркіндегі Әнші құмның бірегей акустикалық құбылысын түсіндіреді."
    },
    image: "https://images.unsplash.com/photo-1560131324-735a23ea0304",
    category: "Nature",
    date: "2025-12-20",
    author: "GeoScience Now",
    authorRole: { en: "Science Desk", ru: "Наука", kz: "Ғылым бөлімі" },
    readTime: 5,
    location: "Altyn-Emel",
    sections: [
        {
            heading: { en: "The Desert's Organ", ru: "Орган пустыни", kz: "Шөл органы" },
            body: { 
                en: "The Singing Dune emits a deep hum when sand slides down its slopes. A new study confirms that the sound is caused by friction between sand grains coated in a specific type of silica glaze.",
                ru: "Поющий бархан издает глубокий гул, когда песок скатывается по его склонам. Новое исследование подтверждает, что звук вызван трением песчинок, покрытых особым типом кварцевой глазури.",
                kz: "Әнші құм баурайынан құм сырғығанда терең гуіл шығарады. Жаңа зерттеу дыбыстың кремний глазурінің ерекше түрімен қапталған құм түйіршіктері арасындағы үйкелістен туындайтынын растады."
            }
        }
    ]
  },
  {
    id: "news-18",
    title: {
        en: "Horse Trekking the Silk Road: A New 500km Route",
        ru: "Конный треккинг по Шелковому пути: новый маршрут 500 км",
        kz: "Жібек жолымен атпен саяхат: жаңа 500 шақырымдық маршрут"
    },
    summary: {
        en: "Adventure tourism gets a boost with the opening of a long-distance horse trekking trail through the Zhetysu region.",
        ru: "Приключенческий туризм получил импульс с открытием длинного маршрута для конного треккинга через регион Жетысу.",
        kz: "Жетісу өңірі арқылы өтетін ұзақ қашықтыққа арналған атпен жүру маршрутының ашылуымен приключенческий туризм жаңа серпін алды."
    },
    image: "https://images.unsplash.com/photo-1761872936161-9c2075a7ca11",
    category: "Travel",
    date: "2025-12-15",
    author: "Equestrian Life",
    authorRole: { en: "Adventure Guide", ru: "Гид", kz: "Гид" },
    readTime: 7,
    location: "Zhetysu",
    sections: [
        {
            heading: { en: "Slow Travel on Hoof", ru: "Медленное путешествие", kz: "Ат үстіндегі саяхат" },
            body: { 
                en: "For those seeking to disconnect, the 'Silk Road Gallop' offers the ultimate escape. This mapped 500km route traverses diverse landscapes. Riders stay in guest yurts hosted by local shepherd families.",
                ru: "Для тех, кто ищет уединения, 'Галоп Шелкового пути' предлагает идеальный побег. Этот маршрут длиной 500 км проходит через разнообразные ландшафты. Всадники останавливаются в гостевых юртах местных пастухов.",
                kz: "Демалуды қалайтындар үшін 'Жібек жолы шабысы' таптырмас мүмкіндік. Бұл 500 шақырымдық маршрут әртүрлі ландшафттар арқылы өтеді. Шабандоздар жергілікті шопандардың қонақ үйлерінде тұрақтайды."
            }
        }
    ]
  },
  {
    id: "news-19",
    title: {
        en: "National Kokpar Championship Sees Record Turnout",
        ru: "Рекордная посещаемость чемпионата по кокпару",
        kz: "Көкпардан ұлттық чемпионатқа рекордтық көрермен жиналды"
    },
    summary: {
        en: "The traditional sport of Kokpar is seeing a resurgence, with thousands attending the national finals in Taraz.",
        ru: "Традиционный спорт кокпар переживает возрождение: тысячи людей посетили национальный финал в Таразе.",
        kz: "Көкпар ұлттық спорты қайта жандануда, Тараздағы ұлттық финалға мыңдаған адам жиналды."
    },
    image: "https://images.unsplash.com/photo-1619265180726-6c11823ebf6a",
    category: "Culture",
    date: "2025-12-10",
    author: "SportKZ",
    authorRole: { en: "Sports Reporter", ru: "Спортивный репортер", kz: "Спорт тілшісі" },
    readTime: 5,
    location: "Taraz",
    sections: [
        {
            heading: { en: "Warriors on Horseback", ru: "Воины на конях", kz: "Ат үстіндегі батырлар" },
            body: { 
                en: "The stadium in Taraz was packed to capacity as regional teams clashed. Often described as a rugged ancestor of polo, the sport involves teams of riders battling to carry a goal.",
                ru: "Стадион в Таразе был забит до отказа, когда столкнулись региональные команды. Этот вид спорта, который часто называют суровым предком поло, включает в себя борьбу команд всадников за гол.",
                kz: "Тараздағы стадион лық толы болды, аймақтық командалар өзара бақ сынасты. Поло ойынының арғы атасы саналатын бұл спорт түрінде шабандоздар командалары көкпар тарту үшін сайысқа түседі."
            }
        }
    ]
  },
  {
    id: "news-20",
    title: {
        en: "Luxury Glamping in the Forests of Burabay",
        ru: "Люксовый глэмпинг в лесах Бурабая",
        kz: "Бурабай ормандарындағы люкс глэмпинг"
    },
    summary: {
        en: "Burabay National Park introduces 'Forest Glass' pods, allowing visitors to sleep in the snowy forest in 5-star comfort.",
        ru: "Национальный парк Бурабай представляет капсулы 'Forest Glass', позволяющие посетителям спать в заснеженном лесу с 5-звездочным комфортом.",
        kz: "Бурабай ұлттық паркі келушілерге қарлы орманда 5 жұлдызды жайлылықпен түнеуге мүмкіндік беретін 'Forest Glass' капсулаларын ұсынды."
    },
    image: "https://images.unsplash.com/photo-1759421754364-2310e30f2bab",
    category: "Travel",
    date: "2025-12-05",
    author: "Luxe Life",
    authorRole: { en: "Travel Review", ru: "Обзор", kz: "Шолу" },
    readTime: 4,
    location: "Burabay",
    sections: [
        {
            heading: { en: "Winter Wonderland", ru: "Зимняя сказка", kz: "Қысқы ертегі" },
            body: { 
                en: "Known as the 'Switzerland of Kazakhstan', Burabay is beautiful year-round. The new resort features transparent, heated spherical pods nestled among the pine trees.",
                ru: "Известный как 'Казахстанская Швейцария', Бурабай прекрасен круглый год. Новый курорт предлагает прозрачные сферические капсулы с подогревом, расположенные среди сосен.",
                kz: "'Қазақстанның Швейцариясы' аталып кеткен Бурабай жыл бойы әсем. Жаңа курорт қарағайлар арасында орналасқан мөлдір, жылытылатын сфералық капсулаларды ұсынады."
            }
        }
    ]
  },
  {
    id: "news-21",
    title: {
        en: "International Hotel Boom in Almaty",
        ru: "Бум международных отелей в Алматы",
        kz: "Алматыдағы халықаралық қонақ үйлер дүмпуі"
    },
    summary: {
        en: "Major global hotel chains including Marriott and Hilton announce new properties in Almaty, adding 2,000 premium rooms.",
        ru: "Крупные мировые гостиничные сети, включая Marriott и Hilton, объявляют о новых объектах в Алматы, добавляя 2000 номеров премиум-класса.",
        kz: "Marriott және Hilton сияқты ірі әлемдік қонақ үй желілері Алматыда жаңа нысандарын жариялап, 2000 премиум бөлме қосуда."
    },
    image: "https://images.unsplash.com/photo-1707061788694-9dba5d6a0478",
    category: "Business",
    date: "2025-12-01",
    author: "Biz Insider",
    authorRole: { en: "Real Estate Analyst", ru: "Аналитик недвижимости", kz: "Жылжымайтын мүлік талдаушысы" },
    readTime: 5,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Meeting Global Demand", ru: "Удовлетворение спроса", kz: "Сұранысты қанағаттандыру" },
            body: { 
                en: "As tourist numbers to Almaty surge, the hospitality sector is racing to catch up. Five new 5-star hotels are under construction, scheduled to open before the 2027 Winter Asian Games.",
                ru: "Поскольку число туристов в Алматы растет, гостиничный сектор стремится не отставать. Строятся пять новых 5-звездочных отелей, открытие которых запланировано до зимних Азиатских игр 2027 года.",
                kz: "Алматыға келуші туристер саны артқан сайын қонақ үй секторы да ілесуге тырысуда. 2027 жылғы Қысқы Азия ойындарына дейін ашылуы жоспарланған бес жаңа 5 жұлдызды қонақ үй салынуда."
            }
        }
    ]
  },
  {
    id: "news-22",
    title: {
        en: "Kazakh Cinema's Golden Age Continues",
        ru: "Золотой век казахского кино продолжается",
        kz: "Қазақ киносының алтын ғасыры жалғасуда"
    },
    summary: {
        en: "Kazakh directors secure top prizes at Cannes and Venice, bringing stories of the steppe to global audiences.",
        ru: "Казахские режиссеры получают главные призы в Каннах и Венеции, донося истории степи до мировой аудитории.",
        kz: "Қазақ режиссерлері Канн мен Венецияда бас жүлделерді иеленіп, дала хикаяларын әлемдік аудиторияға жеткізуде."
    },
    image: "https://images.unsplash.com/photo-1765850262569-6db347d596f5",
    category: "Culture",
    date: "2025-11-28",
    author: "Film Review",
    authorRole: { en: "Film Critic", ru: "Кинокритик", kz: "Киносыншы" },
    readTime: 6,
    location: "International",
    sections: [
        {
            heading: { en: "Stories That Resonate", ru: "Истории, которые резонируют", kz: "Жүрекке жететін хикаялар" },
            body: { 
                en: "The 'Kazakh New Wave' is showing no signs of slowing down. Recent wins at major European festivals highlight the unique voice of local cinema—gritty, visually stunning, and deeply human.",
                ru: "'Казахская новая волна' не сбавляет оборотов. Недавние победы на крупных европейских фестивалях подчеркивают уникальный голос местного кино — сурового, визуально потрясающего и глубоко человечного.",
                kz: "'Қазақ жаңа толқыны' баяулайтын емес. Ірі еуропалық фестивальдердегі соңғы жеңістер жергілікті киноның ерекше үнін — шынайы, көз тартарлық және терең адами қасиеттерін көрсетеді."
            }
        }
    ]
  },
  {
    id: "news-23",
    title: {
        en: "Yurt Interior Design Trends Go Global",
        ru: "Тренды дизайна интерьера юрт выходят на глобальный уровень",
        kz: "Киіз үй интерьерінің дизайны әлемдік деңгейге шығуда"
    },
    summary: {
        en: "Contemporary designers are reimagining traditional yurt aesthetics, creating modern, minimalist spaces that retain nomadic warmth.",
        ru: "Современные дизайнеры переосмысливают традиционную эстетику юрт, создавая современные минималистичные пространства, сохраняющие кочевое тепло.",
        kz: "Заманауи дизайнерлер дәстүрлі киіз үй эстетикасын қайта қарастырып, көшпенділер жылуын сақтай отырып, заманауи, минималистік кеңістіктер жасауда."
    },
    image: "https://images.unsplash.com/photo-1579776722778-8365fa4c3f76",
    category: "Culture",
    date: "2025-11-25",
    author: "Design Daily",
    authorRole: { en: "Interior Design", ru: "Дизайн интерьера", kz: "Интерьер дизайны" },
    readTime: 4,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Nomadic Minimalism", ru: "Кочевой минимализм", kz: "Көшпенді минимализмі" },
            body: { 
                en: "A new generation of Kazakh designers is stripping back heavy carpets in favor of clean lines and natural felt textures. These 'neo-yurts' are finding buyers in Europe and the US.",
                ru: "Новое поколение казахских дизайнеров отказывается от тяжелых ковров в пользу чистых линий и натуральных войлочных текстур. Эти 'нео-юрты' находят покупателей в Европе и США.",
                kz: "Қазақ дизайнерлерінің жаңа буыны ауыр кілемдерден бас тартып, таза сызықтар мен табиғи киіз фактураларын таңдауда. Бұл 'нео-киіз үйлер' Еуропа мен АҚШ-та сатып алушыларын табуда."
            }
        }
    ]
  },
  {
    id: "news-24",
    title: {
        en: "Camel Milk Chocolate Brand Expands Exports",
        ru: "Бренд шоколада из верблюжьего молока расширяет экспорт",
        kz: "Түйе сүтінен жасалған шоколад бренді экспортын кеңейтуде"
    },
    summary: {
        en: "The 'Steppe Gold' confectionery brand signs major deals to supply camel milk chocolate to high-end retailers in Japan and Europe.",
        ru: "Кондитерский бренд 'Steppe Gold' подписывает крупные сделки на поставку шоколада из верблюжьего молока элитным ритейлерам в Японии и Европе.",
        kz: "'Steppe Gold' кондитерлік бренді Жапония мен Еуропадағы жоғары деңгейлі ритейлерлерге түйе сүтінен жасалған шоколад жеткізу бойынша ірі келісімдерге қол қойды."
    },
    image: "https://images.unsplash.com/photo-1703820775340-b923e5929371",
    category: "Business",
    date: "2025-11-20",
    author: "Export Today",
    authorRole: { en: "Trade News", ru: "Новости торговли", kz: "Сауда жаңалықтары" },
    readTime: 4,
    location: "Shymkent",
    sections: [
        {
            heading: { en: "A Taste of the Desert", ru: "Вкус пустыни", kz: "Шөл дәмі" },
            body: { 
                en: "Camel milk gives the chocolate a unique savory-sweet flavor profile. Based in Shymkent, 'Steppe Gold' sources milk from local farms, providing income for herders.",
                ru: "Верблюжье молоко придает шоколаду уникальный пикантно-сладкий вкус. Базирующаяся в Шымкенте компания 'Steppe Gold' закупает молоко на местных фермах, обеспечивая доход пастухам.",
                kz: "Түйе сүті шоколадқа ерекше дәм береді. Шымкентте орналасқан 'Steppe Gold' сүтті жергілікті фермалардан сатып алып, бақташыларға табыс көзін ұсынады."
            }
        }
    ]
  },
  {
    id: "news-25",
    title: {
        en: "New 100km Trail Network in Trans-Ili Alatau",
        ru: "Новая 100-километровая сеть троп в Заилийском Алатау",
        kz: "Іле Алатауындағы жаңа 100 шақырымдық соқпақ желісі"
    },
    summary: {
        en: "Volunteers and park rangers have completed a massive trail building project, opening up new valleys to hikers.",
        ru: "Волонтеры и рейнджеры парка завершили масштабный проект по строительству троп, открыв новые долины для туристов.",
        kz: "Еріктілер мен парк қорықшылары туристерге жаңа аңғарларды ашатын ауқымды соқпақ салу жобасын аяқтады."
    },
    image: "https://images.unsplash.com/photo-1707061788694-9dba5d6a0478",
    category: "Nature",
    date: "2025-11-15",
    author: "Alpinist",
    authorRole: { en: "Outdoor Editor", ru: "Редактор", kz: "Редактор" },
    readTime: 5,
    location: "Almaty",
    sections: [
        {
            heading: { en: "Sustainable Trekking", ru: "Устойчивый треккинг", kz: "Тұрақты треккинг" },
            body: { 
                en: "A new network of 100km of marked trails has been developed in adjacent valleys. The trails feature proper drainage, signage, and eco-toilets to minimize environmental impact.",
                ru: "В соседних долинах разработана новая сеть из 100 км маркированных троп. Тропы оснащены дренажем, указателями и эко-туалетами для минимизации воздействия на окружающую среду.",
                kz: "Көршілес аңғарларда 100 шақырымдық таңбаланған соқпақтардың жаңа желісі әзірленді. Қоршаған ортаға тигізетін әсерді азайту үшін соқпақтар дренажбен, белгілермен және эко-дәретханалармен жабдықталған."
            }
        }
    ]
  },
  {
    id: "news-26",
    title: {
        en: "Kazakhstan Wins 'Best Adventure Destination' Again",
        ru: "Казахстан снова признан 'Лучшим местом для приключений'",
        kz: "Қазақстан тағы да 'Ең үздік приключенческий бағыт' атанды"
    },
    summary: {
        en: "For the second consecutive year, the World Travel Awards has named Kazakhstan the leading adventure destination in Asia.",
        ru: "Второй год подряд World Travel Awards называет Казахстан ведущим местом для приключенческого туризма в Азии.",
        kz: "World Travel Awards екінші жыл қатарынан Қазақстанды Азиядағы жетекші приключенческий туризм бағыты деп таныды."
    },
    image: "https://images.unsplash.com/photo-1562682346-cec0224a4c3b",
    category: "Travel",
    date: "2025-11-10",
    author: "Travel Awards",
    authorRole: { en: "Industry News", ru: "Новости индустрии", kz: "Сала жаңалықтары" },
    readTime: 3,
    location: "Global",
    sections: [
        {
            heading: { en: "Unmatched Diversity", ru: "Непревзойденное разнообразие", kz: "Теңдессіз әртүрлілік" },
            body: { 
                en: "The award recognizes Kazakhstan's unparalleled landscape diversity—from the glaciated peaks of the Tian Shan to the vast steppes and the canyons of Charyn.",
                ru: "Награда признает непревзойденное ландшафтное разнообразие Казахстана — от ледяных пиков Тянь-Шаня до бескрайних степей и каньонов Чарына.",
                kz: "Марапат Қазақстанның ландшафттық әртүрлілігін — Тянь-Шаньның мұзды шыңдарынан бастап ұлан-ғайыр далалар мен Шарын шатқалдарына дейін мойындайды."
            }
        }
    ]
  },
  {
    id: "news-27",
    title: {
        en: "Astana Art Fest Transforms the Capital",
        ru: "Astana Art Fest преображает столицу",
        kz: "Astana Art Fest елорданы өзгертті"
    },
    summary: {
        en: "The streets of Astana have become an open-air gallery, with massive sculptures exploring the theme of 'Nomadic Future'.",
        ru: "Улицы Астаны превратились в галерею под открытым небом с массивными скульптурами, исследующими тему 'Кочевого будущего'.",
        kz: "Астана көшелері ашық аспан астындағы галереяға айналып, 'Көшпенді болашақ' тақырыбындағы алып мүсіндер қойылды."
    },
    image: "https://images.unsplash.com/photo-1683334087142-3036da3628dc",
    category: "Culture",
    date: "2025-11-05",
    author: "Art Now",
    authorRole: { en: "Arts Reporter", ru: "Арт-репортер", kz: "Өнер тілшісі" },
    readTime: 4,
    location: "Astana",
    sections: [
        {
            heading: { en: "Urban Canvas", ru: "Городской холст", kz: "Қала кенебі" },
            body: { 
                en: "Artists have installed works that blend traditional nomadic motifs with cyberpunk aesthetics. Highlights include a 20-meter holographic horse over the Ishim River.",
                ru: "Художники установили работы, сочетающие традиционные кочевые мотивы с эстетикой киберпанка. Среди основных моментов — 20-метровая голографическая лошадь над рекой Ишим.",
                kz: "Суретшілер дәстүрлі көшпенділер мотивтерін киберпанк эстетикасымен үйлестіретін туындылар орнатты. Ерекше назар аударарлығы — Есіл өзенінің үстіндегі 20 метрлік голографиялық жылқы."
            }
        }
    ]
  },
  {
    id: "news-28",
    title: {
        en: "Luxury Rail Tour: The Orient Silk Road Express",
        ru: "Люксовый железнодорожный тур: Orient Silk Road Express",
        kz: "Люкс теміржол туры: Orient Silk Road Express"
    },
    summary: {
        en: "A private luxury train service launches a 14-day grand tour of the 'Stans', starting and ending in Almaty.",
        ru: "Частный люксовый поезд запускает 14-дневный гранд-тур по 'Станам', начинающийся и заканчивающийся в Алматы.",
        kz: "Жеке люкс пойыз қызметі Алматыдан басталып, сонда аяқталатын 'Стандар' бойынша 14 күндік үлкен турды іске қосты."
    },
    image: "https://images.unsplash.com/photo-1698753864905-a447aa362ec9",
    category: "Travel",
    date: "2025-11-01",
    author: "Luxury Rail",
    authorRole: { en: "Travel Editor", ru: "Тревел-редактор", kz: "Саяхат редакторы" },
    readTime: 6,
    location: "Central Asia",
    sections: [
        {
            heading: { en: "Slow Travel in Style", ru: "Стильное медленное путешествие", kz: "Сәнді саяхат" },
            body: { 
                en: "The Orient Silk Road Express offers en-suite cabins and fine dining. The journey takes passengers through Almaty, Turkistan, Tashkent, Samarkand, Bukhara, and Merv.",
                ru: "Orient Silk Road Express предлагает каюты с ванными комнатами и изысканную кухню. Путешествие проходит через Алматы, Туркестан, Ташкент, Самарканд, Бухару и Мерв.",
                kz: "Orient Silk Road Express жуынатын бөлмелері бар каюталар мен дәмді тағамдарды ұсынады. Саяхат Алматы, Түркістан, Ташкент, Самарқанд, Бұхара және Мерв арқылы өтеді."
            }
        }
    ]
  },
  {
    id: "news-29",
    title: {
        en: "Raptor Rehabilitation Center Opens in Nura",
        ru: "Центр реабилитации хищных птиц открылся в Нуре",
        kz: "Нұрада жыртқыш құстарды оңалту орталығы ашылды"
    },
    summary: {
        en: "A new center dedicated to the care and rehabilitation of injured birds of prey opens, serving as an educational hub.",
        ru: "Открылся новый центр, посвященный уходу и реабилитации раненых хищных птиц, который также служит образовательным хабом.",
        kz: "Жараланған жыртқыш құстарды күтуге және оңалтуға арналған жаңа орталық ашылып, білім беру хабы қызметін атқаруда."
    },
    image: "https://images.unsplash.com/photo-1562682346-cec0224a4c3b",
    category: "Nature",
    date: "2025-10-28",
    author: "Bird Watch",
    authorRole: { en: "Conservationist", ru: "Орнитолог", kz: "Орнитолог" },
    readTime: 5,
    location: "Akmola Region",
    sections: [
        {
            heading: { en: "Protecting the Hunters", ru: "Защита охотников", kz: "Аңшыларды қорғау" },
            body: { 
                en: "The new center provides veterinary care for eagles and falcons. It teaches young aspiring falconers about the biology of the birds and conservation.",
                ru: "Новый центр предоставляет ветеринарную помощь орлам и соколам. Он обучает молодых сокольников биологии птиц и охране природы.",
                kz: "Жаңа орталық бүркіттер мен сұңқарларға ветеринарлық көмек көрсетеді. Ол жас құсбегілерді құстардың биологиясы мен табиғатты қорғауға үйретеді."
            }
        }
    ]
  },
  {
    id: "news-30",
    title: {
        en: "New Discoveries in the Underground Mosques of Mangystau",
        ru: "Новые открытия в подземных мечетях Мангистау",
        kz: "Маңғыстаудың жерасты мешіттеріндегі жаңа жаңалықтар"
    },
    summary: {
        en: "Archaeologists using 3D scanning have revealed hidden chambers in the Sufi underground mosques.",
        ru: "Археологи с помощью 3D-сканирования обнаружили скрытые камеры в суфийских подземных мечетях.",
        kz: "Археологтар 3D сканерлеу арқылы сопылық жерасты мешіттеріндегі жасырын бөлмелерді тапты."
    },
    image: "https://images.unsplash.com/photo-1752418720889-fdf6b1da6284",
    category: "History",
    date: "2025-10-25",
    author: "History Today",
    authorRole: { en: "Archaeologist", ru: "Археолог", kz: "Археолог" },
    readTime: 7,
    location: "Mangystau",
    sections: [
        {
            heading: { en: "Carved in Stone", ru: "Высечено в камне", kz: "Тасқа қашалған" },
            body: { 
                en: "Recent surveys have found previously unknown meditation cells and inscriptions dating back to the 10th century, suggesting the sites were active earlier than thought.",
                ru: "Недавние исследования обнаружили ранее неизвестные кельи для медитации и надписи, датируемые 10 веком, что говорит о том, что эти места были активны раньше, чем предполагалось.",
                kz: "Соңғы зерттеулер бұрын белгісіз медитация камералары мен 10 ғасырға жататын жазбаларды тапты, бұл орындардың ойлағаннан ертерек белсенді болғанын көрсетеді."
            }
        }
    ]
  }
];

const ArticleDetail = ({ article, lang, labels, theme, onClose }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sections = article.sections || [];
  const gallery = article.gallery || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100]"
    >
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        ref={scrollRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="absolute inset-0 md:inset-x-[5vw] md:top-[3vh] md:bottom-0 bg-white overflow-y-auto shadow-2xl"
        style={{ background: theme.background, color: theme.text }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-20 right-4 md:top-8 md:right-[7vw] z-50 p-4 bg-black hover:bg-red-600 text-white transition-colors cursor-pointer rounded-none shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero */}
        <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
          <ResponsiveImage src={hq(article.image)} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 text-white">
            <div className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black rounded-none">
                  {article.category}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <Calendar className="w-3 h-3" /> {article.date}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <Clock className="w-3 h-3" /> {article.readTime || 8} {labels.minutes}
                </span>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <MapPin className="w-3 h-3" /> {article.location}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] uppercase tracking-tighter mb-8 pr-4 sm:pr-12 relative z-10 break-words" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 4px 30px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.5)' }}>
                {article.title?.[lang] || article.title?.en}
              </h1>
              <div className="flex items-center gap-6 border-t border-white/20 pt-8">
                <div className="w-12 h-12 bg-white text-black flex items-center justify-center text-lg font-black rounded-none">
                  {article.author?.charAt(0) || 'K'}
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider">{article.author}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">{article.authorRole?.[lang] || article.authorRole?.en}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
          {/* Summary */}
          <p className="text-xl md:text-3xl font-medium leading-relaxed opacity-90 mb-16 border-l-4 pl-8" style={{ borderColor: theme.primary }}>
            {article.summary?.[lang] || article.summary?.en}
          </p>

          {/* Engagement bar */}
          <div className="flex items-center justify-between border-y py-6 mb-16 opacity-60" style={{ borderColor: `${theme.text}20` }}>
            <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-3"><Eye className="w-4 h-4" /> {article.stats.views}</span>
              <span className="flex items-center gap-3"><ThumbsUp className="w-4 h-4" /> {article.stats.likes}</span>
            </div>
            <div className="flex gap-4">
              <button className="p-3 hover:bg-black/5 transition-colors rounded-none"><Share className="w-4 h-4" /></button>
              <button className="p-3 hover:bg-black/5 transition-colors rounded-none"><Bookmark className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Sections */}
          {sections.length > 0 ? (
            sections.map((section: any, idx: number) => (
              <div key={idx} className="mb-20">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8" style={{ color: theme.primary }}>
                  {section.heading?.[lang] || section.heading?.en || ''}
                </h2>

                <div className="prose prose-xl max-w-none leading-[1.8] opacity-90 text-base md:text-xl whitespace-pre-line mb-10 font-medium">
                  {(section.body?.[lang] || section.body?.en || '').split('\n\n').map((p: string, i: number) => (
                    <p key={i} className="mb-8">{p}</p>
                  ))}
                </div>

                {/* Quote (Only for first section if exists in article) */}
                {idx === 0 && article.quote && (
                  <blockquote className="my-16 relative p-8 md:p-12 bg-current/5 border-l-8" style={{ borderColor: theme.primary }}>
                    <Sparkles className="absolute right-8 top-8 w-8 h-8 opacity-20" />
                    <p className="text-2xl md:text-3xl italic leading-tight font-black uppercase tracking-tight opacity-80 mb-6">
                      "{article.quote.text?.[lang] || article.quote.text?.en}"
                    </p>
                    <cite className="text-sm font-black uppercase tracking-widest opacity-50 not-italic block text-right">
                      — {article.quote.author}
                    </cite>
                  </blockquote>
                )}
                
                {/* Stats Grid - Only show for first section if article has stats */}
                {idx === 0 && article.stats && article.stats.length > 0 && (
                  <div className="my-16 border-2 border-black/5 p-8 bg-black/[0.02]" style={{ borderColor: `${theme.text}10` }}>
                    <div className="flex items-center gap-4 mb-8">
                      <Zap className="w-5 h-5" style={{ color: theme.primary }} />
                      <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
                        {lang === 'kz' ? 'Деректер' : lang === 'ru' ? 'Данные' : 'Key Figures'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {article.stats.map((stat: any, si: number) => (
                        <div key={si} className="relative">
                          <div className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2" style={{ color: theme.primary }}>
                            {stat.value}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            {stat.label?.[lang] || stat.label?.en}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="prose prose-xl max-w-none opacity-80">
              <p>Full content for this article is being updated.</p>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 1 && (
            <div className="mt-20 mb-12">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-8 border-b pb-4">{labels.photoGallery}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {gallery.map((img: string, i: number) => (
                  <div key={i} className="overflow-hidden aspect-[4/3] group relative">
                    <ResponsiveImage src={hq(img, 800)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};


export const NewsPage = () => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const lang = getNormalizedLang(language);

  const safeData = { 
    title: "Steppe Journal", 
    magazine: "Kendala", 
    all: "All", 
    categories: ["All", "Business", "Nature", "History", "Travel", "Food", "Culture"], 
    articles: ARTICLES 
  };

  const [activeCategory, setActiveCategory] = useState(safeData.all || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const labels = uiLabels[lang] || uiLabels['en'];


  const allArticles = useMemo(() => {
    return ARTICLES.map((a: any) => ({
       ...a,
       stats: { ...getStatsForArticle(a.id), ...(a.stats ? { custom: a.stats } : {}) }
    }));
  }, []);

  const categories = safeData.categories;
  const effectiveCategory = categories.includes(activeCategory) ? activeCategory : safeData.all;

  const filteredArticles = allArticles.filter((article: any) => {
    const matchesCategory = effectiveCategory === safeData.all || article.category === effectiveCategory;
    const title = article.title?.[lang] || article.title?.en || '';
    const summary = article.summary?.[lang] || article.summary?.en || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find((a: any) => a.featured) || filteredArticles[0];
  const gridArticles = filteredArticles.filter((a: any) => a.id !== featuredArticle?.id).slice(0, visibleCount);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  if (!theme) return null;

  return (
    <div className="min-h-screen font-sans relative" style={{ background: theme.background, color: theme.text }}>

      {/* Magic Particles Background */}
      <MagicParticles theme={theme} />

      {/* ─── HERO SECTION ─── */}
      <div className="relative z-10 min-h-[85vh] flex flex-col justify-end overflow-hidden border-b" style={{ borderColor: `${theme.text}10` }}>
        {/* Cinematic Hero Image */}
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
            <div className="absolute inset-0 bg-black z-0" />
            <ResponsiveImage 
                src={hq(featuredArticle?.image || 'https://images.unsplash.com/photo-1683334087142-3036da3628dc')} 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-6 md:px-12 lg:px-20 pb-20 text-white w-full">
          <div className="max-w-7xl mx-auto border-l-2 border-white/20 pl-8 md:pl-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-80">
                {safeData.magazine || 'Kendala Journal'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 max-w-6xl break-words mix-blend-overlay"
            >
              {featuredArticle?.title?.[lang] || featuredArticle?.title?.en || safeData.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-2xl text-lg md:text-xl opacity-80 leading-relaxed font-medium mb-12 line-clamp-3"
            >
               {featuredArticle?.summary?.[lang] || featuredArticle?.summary?.en}
            </motion.p>

            {/* Featured Teaser Button */}
            {featuredArticle && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group flex items-center gap-6 px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors rounded-none"
              >
                <span>{labels.readMore}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── CONTENT AREA ─── */}
      <div className="relative z-10">
        
        {/* Sticky Controls */}
        <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: `${theme.background}e6`, borderColor: `${theme.text}10` }}>
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-6 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all rounded-none border ${
                      activeCategory === cat 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent hover:bg-black/5 border-transparent'
                    }`}
                    style={activeCategory === cat && theme.primary ? { backgroundColor: theme.primary, borderColor: theme.primary, color: theme.primaryForeground } : { borderColor: `${theme.text}10` }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type="text"
                  placeholder={labels.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 border-none py-3 pl-12 pr-4 text-xs font-bold uppercase tracking-wide outline-none focus:ring-1 ring-black/20 rounded-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 md:py-20">
          <AnimatePresence mode="wait">
            {filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center opacity-40"
              >
                <Search className="w-16 h-16 mx-auto mb-6 opacity-50" />
                <p className="text-xl font-black uppercase tracking-widest">{labels.noResults}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {gridArticles.map((article: any, idx: number) => (
                  <motion.article
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    onClick={() => setSelectedArticle(article)}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative overflow-hidden aspect-[3/2] mb-6 bg-black/5">
                      <ResponsiveImage 
                        src={hq(article.image, 600)} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 text-[9px] font-black uppercase tracking-widest shadow-sm rounded-none">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {article.date}</span>
                        <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {article.readTime} {labels.minutes}</span>
                      </div>
                      
                      <h2 className="text-2xl font-black uppercase tracking-tight leading-[1.1] mb-3 group-hover:text-amber-600 transition-colors">
                        {article.title?.[lang] || article.title?.en}
                      </h2>
                      
                      <p className="text-sm opacity-60 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {article.summary?.[lang] || article.summary?.en}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between border-t pt-4" style={{ borderColor: `${theme.text}10` }}>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                          <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> {article.stats.views}</span>
                          <span className="flex items-center gap-2"><ThumbsUp className="w-3 h-3" /> {article.stats.likes}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                          {labels.readMore}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Load More */}
          {filteredArticles.length > visibleCount && (
            <div className="text-center mt-20">
              <button
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="px-10 py-4 border-2 hover:bg-black hover:text-white transition-all font-black uppercase tracking-widest text-xs rounded-none"
                style={{ borderColor: theme.text, color: theme.text }}
              >
                {labels.loadMore}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail 
            article={selectedArticle} 
            lang={lang} 
            labels={labels}
            theme={theme}
            onClose={() => setSelectedArticle(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default NewsPage;