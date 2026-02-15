import React, { useState, useRef, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'motion/react';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { PageTransition } from '../ui/PageTransition';
import { ArrowRight, X, ChevronLeft, Clock } from '../ui/icons';

interface EraStat {
  label: string;
  value: string;
}

interface EraDetail {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: EraStat[];
  chapters: { title: string; content: string }[];
  gallery: string[];
}

const historyContent: Record<string, EraDetail[]> = {
  en: [
    {
      id: 'ancient',
      year: '800 BC — 300 BC',
      title: 'The Saka Era',
      subtitle: 'Golden Warriors of the Steppe',
      description: 'Long before the Silk Road, the Saka (Scythian) tribes ruled the vast Eurasian steppes. They were masters of mounted warfare and goldsmithing, leaving behind kurgans filled with treasures that rival the pharaohs.',
      image: 'https://images.unsplash.com/photo-1668261200441-afd5c5c55415?w=1600&q=80',
      stats: [
        { label: 'Key Artifact', value: 'The Golden Man' },
        { label: 'Territory', value: 'Zhetysu to Black Sea' },
        { label: 'Technology', value: 'Composite Bow' },
        { label: 'Legacy', value: 'Animal Style Art' },
      ],
      chapters: [
        { title: 'The Animal Style', content: 'Saka art is defined by dynamic, intertwined animal figures — snow leopards, eagles, and deer — cast in pure gold. This was more than decoration; it was a spiritual language connecting the nomad to the wild. Every curve of gold told a story of predator and prey, of life and death cycles.' },
        { title: 'Masters of the Horse', content: 'They were among the first to master horseback archery, creating a military advantage that let them dominate the steppe for centuries. Their tactics influenced the Persians, Greeks, and Chinese. The Saka horseman was one with his steed, shooting accurately while galloping at full speed.' },
        { title: 'The Issyk Kurgan', content: 'Discovered in 1969, the "Golden Man" remains the most significant archaeological find in Kazakhstan — a warrior prince clad in 4,000 gold plates, now a national symbol. The intricacy of the armor points to a society of great wealth and craft.' },
        { title: 'The Great Migration', content: 'The Saka were not static; their empire moved. They followed the seasons, their herds, and the stars. This mobility made them unconquerable by settled empires like Persia, whose armies could never catch the "ghosts of the steppe."' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1618748274531-74442d558432?w=800&q=80',
         'https://images.unsplash.com/photo-1700130064667-d6f25001babd?w=800&q=80',
         'https://images.unsplash.com/photo-1767096612165-b5a33caa48a5?w=800&q=80',
         'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'
      ]
    },
    {
      id: 'silkroad',
      year: '600 AD — 1200 AD',
      title: 'The Silk Road',
      subtitle: 'Crossroads of Civilizations',
      description: 'The Great Silk Road was not a single path but a web of trade routes. Cities like Otrar, Taraz, and Turkestan blossomed as hubs of commerce, science, and spirituality, connecting China to Rome.',
      image: 'https://images.unsplash.com/photo-1744177311003-505304e4daaf?w=1600&q=80',
      stats: [
        { label: 'Major Hubs', value: 'Otrar, Taraz, Turkestan' },
        { label: 'Trade Goods', value: 'Silk, Spices, Paper' },
        { label: 'Religion', value: 'Islam, Tengrism' },
        { label: 'Science', value: 'Al-Farabi' },
      ],
      chapters: [
        { title: 'Urban Flourishing', content: 'While nomads roamed the open plains, sophisticated cities rose along the riverbanks. These hubs had running water, public baths, and vast libraries. They were cosmopolitan centers where dozens of languages were spoken daily.' },
        { title: 'The Philosopher', content: 'Al-Farabi, known as the "Second Teacher" after Aristotle, was born in Otrar. His works on logic, music, and philosophy influenced the entire medieval world. He envisioned the "Virtuous City," a utopia built on reason and justice.' },
        { title: 'The Caravan Life', content: 'Camels carried not just goods, but ideas. Buddhism, Nestorian Christianity, and Islam all traveled these routes, leaving a rich architectural legacy. A single caravan could stretch for miles — a moving city of merchants, guards, and explorers.' },
        { title: 'Architecture of Faith', content: 'The Mausoleum of Khoja Ahmed Yasawi in Turkestan stands as a masterpiece of this era. Its turquoise tiles and massive dome are a testament to the engineering and artistic skill of the Silk Road builders.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1763394157649-468c92832a4f?w=800&q=80',
         'https://images.unsplash.com/photo-1636308624774-a9881678685d?w=800&q=80',
         'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
         'https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?w=800&q=80'
      ]
    },
    {
      id: 'khanate',
      year: '1465 AD — 1847 AD',
      title: 'Kazakh Khanate',
      subtitle: 'The Unification of the Clans',
      description: 'In the crumbling wake of the Golden Horde, Khans Kerei and Janibek led their people to the Chu Valley, raising the banner of the first Kazakh state. This era forged the national identity.',
      image: 'https://images.unsplash.com/photo-1761872936183-255a939c463a?w=1600&q=80',
      stats: [
        { label: 'Founders', value: 'Kerei & Janibek' },
        { label: 'Law Code', value: 'Zheti Zhargy' },
        { label: 'Structure', value: 'Three Zhuzes' },
        { label: 'Symbol', value: 'The Yurt' },
      ],
      chapters: [
        { title: 'The Great Migration', content: 'Seeking freedom from the Uzbek Khanate, 200,000 nomads migrated to the banks of the Jetisu rivers. This act of defiance marks the birth of the "Kazakh" (Free Warrior) name. It was a choice of liberty over submission.' },
        { title: 'Steppe Democracy', content: 'Tauke Khan introduced "Zheti Zhargy" — the Seven Charters. It was a legal system based on nomadic wisdom, settling disputes through Biys (judges) rather than dungeons. Words were weapons, and justice was restorative, not punitive.' },
        { title: 'Heroic Age', content: 'Battles against the Dzungars defined this period. Heroes like Bogenbai and Kabanbai Batyr became legends, uniting the three Zhuzes against existential threats. This period is known as the "Years of Great Disaster," but also of great resilience.' },
        { title: 'The Last Kenesary', content: 'Kenesary Khan, the last great khan, fought a fierce war for independence against imperial expansion. His story is one of tragic heroism, marking the end of the traditional Khanate but sparking the flame of modern nationalism.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1548261358-0cb925d48347?w=800&q=80',
         'https://images.unsplash.com/photo-1770413189035-751b32c31538?w=800&q=80',
         'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800&q=80',
         'https://images.unsplash.com/photo-1599576838663-8324d3858c8a?w=800&q=80'
      ]
    },
    {
      id: 'soviet',
      year: '1920 AD — 1991 AD',
      title: 'The Soviet Era',
      subtitle: 'Industry, Iron, and Space',
      description: 'A time of radical transformation. The steppe was industrialized, cities rose from concrete, and humanity touched the stars from Kazakh soil. Yet, it came at a heavy cost to tradition and life.',
      image: 'https://images.unsplash.com/photo-1770053472466-80329ce5a7af?w=1600&q=80',
      stats: [
        { label: 'Project', value: 'Baikonur' },
        { label: 'Economy', value: 'Industrialization' },
        { label: 'Capital', value: 'Almaty' },
        { label: 'Impact', value: 'Modernization' },
      ],
      chapters: [
        { title: 'Gateway to the Stars', content: 'Baikonur Cosmodrome became the shore of the universe. From here, Sputnik launched, and Yuri Gagarin became the first human in space. For decades, the steppe was the world\'s launchpad to the cosmos.' },
        { title: 'The Virgin Lands', content: 'The massive agricultural project transformed northern pastures into wheat fields, changing the demography and ecology of the region forever. New cities appeared overnight, bringing thousands of settlers.' },
        { title: 'Cultural Shift', content: 'While nomadism was forcibly ended, a new urban intelligentsia emerged. Opera, ballet, and sciences flourished in Almaty, blending European forms with Kazakh spirit. A new "Soviet Kazakh" identity was forged in universities and factories.' },
        { title: 'Brutalist Legacy', content: 'The architecture of this era remains striking. Massive concrete structures, mosaics depicting space exploration and labor, and wide avenues define the urban fabric of cities like Almaty and Karaganda.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1571938937267-5d75d39fbad5?w=800&q=80',
         'https://images.unsplash.com/photo-1569661448657-6178c775a25e?w=800&q=80',
         'https://images.unsplash.com/photo-1638009185192-4b03191ab0c3?w=800&q=80',
         'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=800&q=80'
      ]
    },
    {
      id: 'modern',
      year: '1991 AD — Present',
      title: 'Independent Kazakhstan',
      subtitle: 'A New Nation Rising',
      description: 'On December 16, 1991, a new era began. Kazakhstan emerged as a sovereign nation, building a futuristic capital on the steppe and becoming a bridge between East and West.',
      image: 'https://images.unsplash.com/photo-1759167631410-8b5520862329?w=1600&q=80',
      stats: [
        { label: 'Capital', value: 'Astana' },
        { label: 'Policy', value: 'Multi-vector' },
        { label: 'Symbol', value: 'Baiterek' },
        { label: 'Vision', value: 'Digital Future' },
      ],
      chapters: [
        { title: 'Astana: City of Future', content: 'The new capital is a manifesto in glass and steel. Designed by world-renowned architects like Norman Foster, it symbolizes the ambition and forward-looking spirit of the nation. It is a city built from scratch to define a new destiny.' },
        { title: 'Global Mediator', content: 'Kazakhstan abandoned the world\'s 4th largest nuclear arsenal to become a global leader in peace and nuclear non-proliferation. It now stands as a neutral ground for solving global conflicts.' },
        { title: 'Digital Steppe', content: 'Today, the country is rapidly digitizing, blending its ancient nomadic flexibility with modern technology to create a dynamic hub in Central Asia. Fintech and e-gov services are among the most advanced in the region.' },
        { title: 'Cultural Renaissance', content: 'A new generation of artists, musicians, and filmmakers is reinterpreting Kazakh identity, blending traditional instruments like the dombra with modern beats, creating a distinct "Neo-Nomad" culture.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1759167632170-95fb7fcc00cd?w=800&q=80',
         'https://images.unsplash.com/photo-1558588942-930faae5a389?w=800&q=80',
         'https://images.unsplash.com/photo-1759167631378-0545007f9799?w=800&q=80',
         'https://images.unsplash.com/photo-1461301214746-1e790926d323?w=800&q=80'
      ]
    }
  ],
  ru: [
    {
      id: 'ancient',
      year: '800 до н.э. — 300 до н.э.',
      title: 'Эпоха Саков',
      subtitle: 'Золотые Воины Степи',
      description: 'Задолго до Шелкового пути племена саков правили огромными евразийскими степями. Они были мастерами конной войны и ювелирного дела, оставив после себя курганы с сокровищами, не уступающими египетским.',
      image: 'https://images.unsplash.com/photo-1668261200441-afd5c5c55415?w=1600&q=80',
      stats: [
        { label: 'Артефакт', value: 'Золотой Человек' },
        { label: 'Территория', value: 'Жетысу — Черное море' },
        { label: 'Технология', value: 'Композитный лук' },
        { label: 'Наследие', value: 'Звериный стиль' },
      ],
      chapters: [
        { title: 'Звериный Стиль', content: 'Искусство саков — это динамичные фигуры животных: снежных барсов, орлов и оленей, отлитых из чистого золота. Это был не просто декор, а духовный язык, связывающий кочевника с природой. Каждый изгиб золота рассказывал историю хищника и жертвы, циклов жизни и смерти.' },
        { title: 'Всадники Степи', content: 'Саки одними из первых освоили конную стрельбу из лука, что давало им военное превосходство на протяжении веков. Их тактика повлияла на персов, греков и китайцев. Сакский всадник был единым целым со своим конем и мог метко стрелять на полном скаку.' },
        { title: 'Иссыкский Курган', content: 'Найденный в 1969 году «Золотой человек» — самая значимая археологическая находка Казахстана. Воин-принц в доспехах из 4000 золотых пластин стал национальным символом. Мастерство исполнения говорит о богатом и высокоразвитом обществе.' },
        { title: 'Великая Миграция', content: 'Саки не стояли на месте — их империя была в постоянном движении. Они следовали за сезонами, стадами и звездами. Эта мобильность делала их неуловимыми для оседлых империй вроде Персии, чьи армии не могли поймать «призраков степи».' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1618748274531-74442d558432?w=800&q=80',
         'https://images.unsplash.com/photo-1700130064667-d6f25001babd?w=800&q=80',
         'https://images.unsplash.com/photo-1767096612165-b5a33caa48a5?w=800&q=80',
         'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'
      ]
    },
    {
      id: 'silkroad',
      year: '600 н.э. — 1200 н.э.',
      title: 'Шелковый Путь',
      subtitle: 'Перекресток Цивилизаций',
      description: 'Великий Шелковый путь был не одной дорогой, а сетью торговых маршрутов. Отрар, Тараз и Туркестан расцветали как центры торговли, науки и духовности, связывая Китай с Римом.',
      image: 'https://images.unsplash.com/photo-1744177311003-505304e4daaf?w=1600&q=80',
      stats: [
        { label: 'Центры', value: 'Отрар, Тараз' },
        { label: 'Товары', value: 'Шелк, Специи' },
        { label: 'Религия', value: 'Ислам, Тенгрианство' },
        { label: 'Наука', value: 'Аль-Фараби' },
      ],
      chapters: [
        { title: 'Расцвет Городов', content: 'Пока кочевники бродили по равнинам, вдоль рек вырастали города с водопроводом, общественными банями и большими библиотеками. Это были космополитичные центры, где ежедневно звучали десятки языков.' },
        { title: 'Философ', content: 'Аль-Фараби — «Второй учитель» после Аристотеля — родился в Отраре. Его труды по логике, музыке и философии повлияли на весь средневековый мир. Он мечтал о «Добродетельном городе», утопии, основанной на разуме и справедливости.' },
        { title: 'Жизнь Каравана', content: 'Верблюды перевозили не только товары, но и идеи. Буддизм, несторианство и ислам распространялись по этим маршрутам, оставляя богатое архитектурное наследие. Караван мог растянуться на мили — движущийся город купцов, охранников и путешественников.' },
        { title: 'Архитектура Веры', content: 'Мавзолей Ходжи Ахмеда Ясави в Туркестане — шедевр этой эпохи. Бирюзовые плитки и массивный купол — свидетельство инженерного и художественного мастерства строителей Шелкового пути.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1763394157649-468c92832a4f?w=800&q=80',
         'https://images.unsplash.com/photo-1636308624774-a9881678685d?w=800&q=80',
         'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
         'https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?w=800&q=80'
      ]
    },
    {
      id: 'khanate',
      year: '1465 н.э. — 1847 н.э.',
      title: 'Казахское Ханство',
      subtitle: 'Объединение Кланов',
      description: 'На руинах Золотой Орды ханы Керей и Жанибек привели свой народ в долину Чу, подняв знамя первого казахского государства. Эта эпоха сформировала национальную идентичность.',
      image: 'https://images.unsplash.com/photo-1761872936183-255a939c463a?w=1600&q=80',
      stats: [
        { label: 'Основатели', value: 'Керей и Жанибек' },
        { label: 'Закон', value: 'Жеты Жаргы' },
        { label: 'Структура', value: 'Три Жуза' },
        { label: 'Символ', value: 'Юрта' },
      ],
      chapters: [
        { title: 'Великая Откочевка', content: 'В поисках свободы от Узбекского ханства 200 000 кочевников ушли к берегам рек Жетысу. Этот шаг знаменует рождение имени «Казах» — свободный воин. Это был выбор свободы вместо подчинения.' },
        { title: 'Степная Демократия', content: 'Тауке-хан ввел «Жеты Жаргы» — Семь Уложений. Уникальная правовая система, основанная на мудрости кочевников: споры решались через биев (судей), а не через темницы. Слово было оружием, а правосудие — восстановительным.' },
        { title: 'Героическая Эпоха', content: 'Битвы с джунгарами определили этот период. Богенбай и Кабанбай батыры стали легендами, объединив три жуза перед лицом угрозы. Эти годы известны как «Великое бедствие», но и как время великой стойкости.' },
        { title: 'Последний Хан', content: 'Кенесары-хан — последний великий хан — вел ожесточенную войну за независимость против имперской экспансии. Его история — это трагический героизм: конец Ханства, но начало современного национального самосознания.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1548261358-0cb925d48347?w=800&q=80',
         'https://images.unsplash.com/photo-1770413189035-751b32c31538?w=800&q=80',
         'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800&q=80',
         'https://images.unsplash.com/photo-1599576838663-8324d3858c8a?w=800&q=80'
      ]
    },
    {
      id: 'soviet',
      year: '1920 н.э. — 1991 н.э.',
      title: 'Советская Эпоха',
      subtitle: 'Индустрия, Железо и Космос',
      description: 'Время радикальных перемен. Степь была индустриализирована, города выросли из бетона, а человечество шагнуло к звездам с казахской земли. Но цена для традиций и жизней оказалась огромной.',
      image: 'https://images.unsplash.com/photo-1770053472466-80329ce5a7af?w=1600&q=80',
      stats: [
        { label: 'Проект', value: 'Байконур' },
        { label: 'Экономика', value: 'Индустриализация' },
        { label: 'Столица', value: 'Алматы' },
        { label: 'Влияние', value: 'Модернизация' },
      ],
      chapters: [
        { title: 'Ворота к Звездам', content: 'Байконур стал берегом вселенной. Отсюда стартовал Спутник, и Гагарин стал первым человеком в космосе. На протяжении десятилетий степь была стартовой площадкой мира.' },
        { title: 'Целина', content: 'Масштабный сельскохозяйственный проект превратил северные пастбища в пшеничные поля, навсегда изменив демографию и экологию региона. Новые города появлялись за считанные месяцы.' },
        { title: 'Культурный Сдвиг', content: 'Кочевой образ жизни был принудительно прекращен, но возникла новая городская интеллигенция. В Алматы расцвели опера, балет и науки, соединив европейские формы с казахской душой.' },
        { title: 'Наследие Брутализма', content: 'Архитектура этой эпохи остается впечатляющей. Массивные бетонные здания, мозаики с космическими и трудовыми сюжетами, широкие проспекты — все это определяет облик Алматы и Караганды.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1571938937267-5d75d39fbad5?w=800&q=80',
         'https://images.unsplash.com/photo-1569661448657-6178c775a25e?w=800&q=80',
         'https://images.unsplash.com/photo-1638009185192-4b03191ab0c3?w=800&q=80',
         'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=800&q=80'
      ]
    },
    {
      id: 'modern',
      year: '1991 н.э. — Настоящее',
      title: 'Независимый Казахстан',
      subtitle: 'Восход Новой Нации',
      description: '16 декабря 1991 года началась новая эра. Казахстан стал суверенным государством, построил футуристическую столицу в степи и занял место моста между Востоком и Западом.',
      image: 'https://images.unsplash.com/photo-1759167631410-8b5520862329?w=1600&q=80',
      stats: [
        { label: 'Столица', value: 'Астана' },
        { label: 'Политика', value: 'Многовекторность' },
        { label: 'Символ', value: 'Байтерек' },
        { label: 'Видение', value: 'Цифровое будущее' },
      ],
      chapters: [
        { title: 'Астана: Город Будущего', content: 'Новая столица — манифест из стекла и стали. Спроектированная архитекторами вроде Нормана Фостера, она воплощает амбиции и устремленность нации. Город, построенный с нуля ради новой судьбы.' },
        { title: 'Глобальный Медиатор', content: 'Казахстан добровольно отказался от 4-го по величине ядерного арсенала, став мировым лидером в области нераспространения. Сегодня страна выступает нейтральной площадкой для решения международных конфликтов.' },
        { title: 'Цифровая Степь', content: 'Страна стремительно цифровизируется, сочетая древнюю кочевую гибкость с современными технологиями. Финтех и государственные электронные сервисы — одни из самых продвинутых в регионе.' },
        { title: 'Культурный Ренессанс', content: 'Новое поколение художников, музыкантов и кинематографистов переосмысливает казахскую идентичность, соединяя домбру с современными ритмами и создавая самобытную культуру «нео-номадов».' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1759167632170-95fb7fcc00cd?w=800&q=80',
         'https://images.unsplash.com/photo-1558588942-930faae5a389?w=800&q=80',
         'https://images.unsplash.com/photo-1759167631378-0545007f9799?w=800&q=80',
         'https://images.unsplash.com/photo-1461301214746-1e790926d323?w=800&q=80'
      ]
    }
  ],
  kz: [
    {
      id: 'ancient',
      year: 'Б.з.д. 800 — б.з.д. 300',
      title: 'Сак Дауірі',
      subtitle: 'Даланың Алтын Сарбаздары',
      description: 'Жібек жолынан көп бұрын сақ тайпалары кең Еуразия даласында билік құрды. Олар ат үстіндегі соғыс пен зергерлік өнердің шеберлері еді, артында перғауындармен бәсекелесетін қазыналы қорғандар қалдырды.',
      image: 'https://images.unsplash.com/photo-1668261200441-afd5c5c55415?w=1600&q=80',
      stats: [
        { label: 'Жәдігер', value: 'Алтын Адам' },
        { label: 'Аумағы', value: 'Жетісудан Қара теңізге дейін' },
        { label: 'Технология', value: 'Құрама садақ' },
        { label: 'Мұра', value: 'Аң стилі' },
      ],
      chapters: [
        { title: 'Аң Стилі', content: 'Сақ өнері — қар барыстары, бүркіттер және бұғылар бейнеленген динамикалық алтын фигуралар. Бұл жай ғана әшекей емес, көшпендіні табиғатпен байланыстыратын рухани тіл болды. Алтынның әрбір иілісі жыртқыш пен олжаның, өмір мен өлімнің тарихын баяндайтын.' },
        { title: 'Ат Құлағында Ойнағандар', content: 'Олар ат үстінде садақ атуды алғашқылардың бірі болып меңгеріп, ғасырлар бойы далада үстемдік етті. Тактикасы парсыларға, гректерге және қытайларға әсер етті. Сақ сарбазы атымен бір бүтін болып, шауып бара жатып дәл атқан.' },
        { title: 'Есік Қорғаны', content: '1969 жылы табылған «Алтын адам» — Қазақстандағы ең маңызды археологиялық жаңалық. 4000 алтын пластинамен қапталған жауынгер-ханзада ұлттық символға айналды. Сауыттың күрделілігі бай және шеберлігі жоғары қоғамды көрсетеді.' },
        { title: 'Ұлы Көш', content: 'Сақтар бір орында тұрмады — олардың империясы қозғалыста болды. Жыл мезгілдеріне, малдарына және жұлдыздарға ерді. Бұл ұтқырлық оларды Парсы сияқты отырықшы империялар үшін жеңілмейтін «дала елестеріне» айналдырды.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1618748274531-74442d558432?w=800&q=80',
         'https://images.unsplash.com/photo-1700130064667-d6f25001babd?w=800&q=80',
         'https://images.unsplash.com/photo-1767096612165-b5a33caa48a5?w=800&q=80',
         'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'
      ]
    },
    {
      id: 'silkroad',
      year: '600 жыл — 1200 жыл',
      title: 'Жібек Жолы',
      subtitle: 'Өркениеттер Тоғысы',
      description: 'Ұлы Жібек жолы жалғыз жол емес, сауда маршруттарының желісі болды. Отырар, Тараз және Түркістан Қытайды Риммен байланыстыратын сауда, ғылым және руханият орталықтары ретінде гүлденді.',
      image: 'https://images.unsplash.com/photo-1744177311003-505304e4daaf?w=1600&q=80',
      stats: [
        { label: 'Орталықтар', value: 'Отырар, Тараз' },
        { label: 'Тауарлар', value: 'Жібек, Дәмдеуіштер' },
        { label: 'Дін', value: 'Ислам, Тәңіршілдік' },
        { label: 'Ғылым', value: 'Әл-Фараби' },
      ],
      chapters: [
        { title: 'Қалалардың Гүлденуі', content: 'Көшпенділер жазықта жүргенде, өзен жағаларында су құбыры, моншалар және кітапханалары бар қалалар бой көтерді. Бұл жерлерде күн сайын ондаған тілде сөйлесетін.' },
        { title: 'Фәлсафашы', content: 'Аристотельден кейінгі «Екінші ұстаз» Әл-Фараби Отырарда дүниеге келген. Оның логика, музыка және философия туралы еңбектері бүкіл ортағасырлық әлемге әсер етті. Ол ақыл мен әділеттілікке негізделген «Қайырымды қаланы» армандады.' },
        { title: 'Керуен Өмірі', content: 'Түйелер тек тауарларды ғана емес, идеяларды да тасымалдады. Буддизм, несториандық және ислам осы жолдармен таралып, бай сәулеттік мұра қалдырды. Бір керуен шақырымдарға созылатын саудагерлер, күзетшілер мен зерттеушілердің жылжымалы қаласы еді.' },
        { title: 'Сенім Сәулеті', content: 'Түркістандағы Қожа Ахмет Ясауи кесенесі осы дәуірдің жауһары. Көгілдір плиткалары мен ауқымды күмбезі Жібек жолы шеберлерінің инженерлік және көркемдік даналығының куәсі.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1763394157649-468c92832a4f?w=800&q=80',
         'https://images.unsplash.com/photo-1636308624774-a9881678685d?w=800&q=80',
         'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
         'https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?w=800&q=80'
      ]
    },
    {
      id: 'khanate',
      year: '1465 жыл — 1847 жыл',
      title: 'Қазақ Хандығы',
      subtitle: 'Рулардың Бірігуі',
      description: 'Алтын Орданың күйреуінен кейін Керей мен Жәнібек хандар өз халқын Шу аңғарына бастап, тұңғыш қазақ мемлекетінің туын тікті. Бұл дәуір ұлттық бірегейлікті қалыптастырды.',
      image: 'https://images.unsplash.com/photo-1761872936183-255a939c463a?w=1600&q=80',
      stats: [
        { label: 'Негізін қалаушылар', value: 'Керей мен Жәнібек' },
        { label: 'Заң', value: 'Жеті Жарғы' },
        { label: 'Құрылым', value: 'Үш Жүз' },
        { label: 'Символ', value: 'Киіз Үй' },
      ],
      chapters: [
        { title: 'Ұлы Көш', content: 'Өзбек хандығынан бостандық іздеген 200 000 көшпенді Жетісу өзендерінің жағасына қоныс аударды. Бұл қадам «Қазақ» (еркін жауынгер) атауының туылуын білдіреді. Бұл бағынудан гөрі бостандықты таңдау болды.' },
        { title: 'Дала Демократиясы', content: 'Тәуке хан «Жеті Жарғыны» енгізді. Бұл көшпенділер даналығына негізделген бірегей құқықтық жүйе: дауларды зындандар емес, билер шешетін. Сөз қару болды, ал әділдік қалпына келтіруші болды.' },
        { title: 'Батырлар Заманы', content: 'Жоңғарларға қарсы шайқастар осы кезеңді айқындады. Бөгенбай және Қабанбай батырлар аңызға айналып, үш жүзді жойылып кету қаупіне қарсы біріктірді. Бұл кезең «Ақтабан шұбырынды» деп аталғанымен, сонымен бірге ұлы төзімділік дәуірі болды.' },
        { title: 'Соңғы Хан', content: 'Кенесары хан, соңғы ұлы хан, империялық экспансияға қарсы тәуелсіздік үшін қатаң соғыс жүргізді. Оның тарихы — дәстүрлі Хандықтың аяқталуын білдіретін, бірақ қазіргі ұлтшылдықтың отын тұтатқан ерлік.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1548261358-0cb925d48347?w=800&q=80',
         'https://images.unsplash.com/photo-1770413189035-751b32c31538?w=800&q=80',
         'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800&q=80',
         'https://images.unsplash.com/photo-1599576838663-8324d3858c8a?w=800&q=80'
      ]
    },
    {
      id: 'soviet',
      year: '1920 жыл — 1991 жыл',
      title: 'Кеңес Дәуірі',
      subtitle: 'Өндіріс, Темір және Ғарыш',
      description: 'Түбегейлі өзгерістер уақыты. Дала индустрияландырылды, бетоннан қалалар бой көтерді және адамзат қазақ жерінен жұлдыздарға қол созды. Алайда, бұл дәстүр мен өмір үшін үлкен құрбандықтармен келді.',
      image: 'https://images.unsplash.com/photo-1770053472466-80329ce5a7af?w=1600&q=80',
      stats: [
        { label: 'Жоба', value: 'Байқоңыр' },
        { label: 'Экономика', value: 'Индустрияландыру' },
        { label: 'Астана', value: 'Алматы' },
        { label: 'Әсері', value: 'Жаңғырту' },
      ],
      chapters: [
        { title: 'Жұлдыздарға Жол', content: 'Байқоңыр ғарыш айлағы ғаламның жағалауына айналды. Осы жерден Спутник ұшырылды және Гагарин ғарышқа ұшқан тұңғыш адам болды. Ондаған жылдар бойы дала әлемнің ғарышқа шығатын алаңы болды.' },
        { title: 'Тың Игеру', content: 'Ауқымды ауыл шаруашылығы жобасы солтүстік жайылымдарды бидай алқаптарына айналдырып, аймақтың демографиясы мен экологиясын түбегейлі өзгертті. Жаңа қалалар бірнеше айда пайда болды.' },
        { title: 'Мәдени Өзгеріс', content: 'Көшпенді өмір салты күштеп тоқтатылғанымен, жаңа қалалық зиялы қауым пайда болды. Алматыда еуропалық формалар мен қазақ жанын үйлестірген опера, балет және ғылым гүлденді.' },
        { title: 'Брутализм Мұрасы', content: 'Бұл дәуірдің сәулеті таң қалдырарлық болып қала береді. Массивті бетон құрылымдар, ғарышты игеру мен еңбекті бейнелейтін мозаикалар және кең даңғылдар Алматы мен Қарағанды сияқты қалалардың келбетін айқындайды.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1571938937267-5d75d39fbad5?w=800&q=80',
         'https://images.unsplash.com/photo-1569661448657-6178c775a25e?w=800&q=80',
         'https://images.unsplash.com/photo-1638009185192-4b03191ab0c3?w=800&q=80',
         'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=800&q=80'
      ]
    },
    {
      id: 'modern',
      year: '1991 жыл — Қазіргі таң',
      title: 'Тәуелсіз Қазақстан',
      subtitle: 'Жаңа Елдің Өрлеуі',
      description: '1991 жылы 16 желтоқсанда жаңа дәуір басталды. Қазақстан егемен мемлекет ретінде пайда болып, далада футуристикалық астана салып, Шығыс пен Батыс арасындағы көпірге айналды.',
      image: 'https://images.unsplash.com/photo-1759167631410-8b5520862329?w=1600&q=80',
      stats: [
        { label: 'Астана', value: 'Астана' },
        { label: 'Саясат', value: 'Көпвекторлы' },
        { label: 'Символ', value: 'Бәйтерек' },
        { label: 'Болашақ', value: 'Цифрлық даму' },
      ],
      chapters: [
        { title: 'Астана: Болашақ Қаласы', content: 'Жаңа астана — әйнек пен болаттан жасалған манифест. Норман Фостер сияқты сәулетшілер жобалаған қала ұлттың амбициясы мен болашаққа ұмтылысын білдіреді. Жаңа тағдырды айқындау үшін нөлден салынған қала.' },
        { title: 'Жаһандық Медиатор', content: 'Қазақстан әлемдегі 4-ші ірі ядролық арсеналдан бас тартып, бейбітшілік пен ядролық таратпау саласындағы көшбасшыға айналды. Енді ол халықаралық қақтығыстарды шешудің бейтарап алаңы.' },
        { title: 'Цифрлық Дала', content: 'Бүгінде ел ежелгі көшпенді икемділігін заманауи технологиялармен үйлестіре отырып, Орталық Азиядағы динамикалық хабты құруда. Финтех және мемлекеттік қызметтер аймақтағы ең озықтардың қатарында.' },
        { title: 'Мәдени Ренессанс', content: 'Суретшілердің, музыканттардың және кинематографистердің жаңа буыны қазақ бірегейлігін қайта қарастырып, домбыра мен заманауи ырғақтарды үйлестіріп, өзіндік «Нео-Номад» мәдениетін қалыптастыруда.' }
      ],
      gallery: [
         'https://images.unsplash.com/photo-1759167632170-95fb7fcc00cd?w=800&q=80',
         'https://images.unsplash.com/photo-1558588942-930faae5a389?w=800&q=80',
         'https://images.unsplash.com/photo-1759167631378-0545007f9799?w=800&q=80',
         'https://images.unsplash.com/photo-1461301214746-1e790926d323?w=800&q=80'
      ]
    }
  ]
};

const EraCard = ({ era, index, theme, onOpen, t }: { era: EraDetail, index: number, theme: any, onOpen: (e: EraDetail) => void, t: (key: string) => string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -50 : 50, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, opacity }}
      className="relative min-h-[90vh] flex items-center justify-center py-20"
    >
      <div 
        onClick={() => onOpen(era)}
        className="relative w-full max-w-6xl aspect-[16/9] md:aspect-[21/9] cursor-pointer group perspective-1000"
      >
        <div className="absolute inset-0 overflow-hidden rounded-sm border border-white/10 group-hover:border-amber-500/50 transition-colors duration-700 bg-black">
          <motion.div style={{ scale: 1.1, y: parallaxY }} className="w-full h-full">
            <ResponsiveImage 
              src={era.image} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-105" 
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <motion.div 
          style={{ x }}
          className="absolute top-0 bottom-0 left-0 max-w-2xl p-8 md:p-16 flex flex-col justify-center z-20 pointer-events-none"
        >
          <span className="block text-amber-500 text-sm font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
             <span className="w-8 h-[2px] bg-amber-500" />
             {era.year}
          </span>
          <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.85] text-white mb-6 drop-shadow-2xl">
            {era.title}
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-8 max-w-lg">
            {era.subtitle}
          </p>
          
          <div className="pointer-events-auto">
             <button className="group/btn flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-white">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
                   <ArrowRight className="w-4 h-4" />
                </span>
                <span className="opacity-60 group-hover/btn:opacity-100 transition-opacity">{t('history_enter_era')}</span>
             </button>
          </div>
        </motion.div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-black text-white/5 leading-none select-none pointer-events-none mix-blend-overlay">
           0{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

const InfoWallDetail = ({ era, theme, onClose }: { era: EraDetail, theme: any, onClose: () => void }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressBar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#111] text-[#F5F1EC] flex flex-col overflow-hidden"
    >
      <div className="flex-none h-20 border-b border-white/10 flex items-center justify-between px-6 pr-16 md:px-10 bg-[#111]/90 backdrop-blur-md z-50 relative">
         <button 
           onClick={onClose}
           className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:text-amber-500 transition-colors cursor-pointer"
         >
           <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-500 transition-colors">
              <ChevronLeft className="w-4 h-4" />
           </div>
           {t('back_to_timeline')}
         </button>

         <span className="hidden md:block text-xs font-mono opacity-40 uppercase">{era.title} — {t('history_archive_protocol')}</span>

         <div className="absolute bottom-0 left-0 h-[2px] bg-amber-500" style={{ width: progressBar as any }} />
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
         
         <div className="relative h-[80vh] w-full">
            <ResponsiveImage src={era.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
               <motion.span 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                 className="block text-6xl md:text-[10rem] font-black text-white/10 leading-none mb-[-2vw] select-none"
               >
                 {era.year.split(' ')[0]}
               </motion.span>
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-8 max-w-5xl"
               >
                 {era.title}
               </motion.h1>
            </div>
         </div>

         <div className="max-w-[100rem] mx-auto px-6 md:px-12 py-20">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 border-b border-white/10 pb-20">
               <div className="lg:col-span-8">
                  <p className="text-2xl md:text-4xl leading-tight font-light opacity-90 mb-10">
                    {era.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                     {era.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 px-6 py-4 border border-white/5">
                           <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">{stat.label}</span>
                           <span className="block font-bold text-amber-500">{stat.value}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="lg:col-span-4 border-l border-white/10 pl-10 hidden lg:block">
                  <span className="block text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-8">{t('history_toc')}</span>
                  <ul className="space-y-4 text-sm opacity-60">
                     {era.chapters.map((c, i) => (
                        <li key={i} className="flex items-center gap-3">
                           <span className="text-amber-500">0{i+1}</span> {c.title}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="space-y-32">
               {era.chapters.map((chapter, i) => (
                  <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                     <div className="w-full lg:w-1/2 relative group">
                        <div className="aspect-[4/5] overflow-hidden rounded-sm relative z-10">
                           <ResponsiveImage 
                             src={era.gallery[i] || era.gallery[0]} 
                             className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                           />
                           <div className="absolute inset-0 bg-[#111]/20 mix-blend-multiply" />
                        </div>
                        <div className={`absolute top-10 ${i % 2 === 0 ? '-right-10' : '-left-10'} w-full h-full border border-white/10 z-0`} />
                     </div>

                     <div className="w-full lg:w-1/2">
                        <span className="text-9xl font-black text-white/5 block leading-none mb-6 select-none">0{i+1}</span>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 text-white relative inline-block">
                           {chapter.title}
                           <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-amber-500" />
                        </h3>
                        <div className="prose prose-invert prose-lg text-justify text-white/70 leading-relaxed">
                           <p className="first-letter:text-5xl first-letter:text-amber-500 first-letter:font-black first-letter:mr-3 first-letter:float-left">
                              {chapter.content}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-40 pt-20 border-t border-white/10">
               <h3 className="text-center text-xs font-black uppercase tracking-[0.5em] mb-12 opacity-50">{t('history_visual_archive')}</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[60vh]">
                  {era.gallery.map((img, i) => (
                     <div key={i} className={`relative overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                        <ResponsiveImage src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-32 text-center opacity-30 pb-32">
               <p className="text-[10px] uppercase tracking-widest">{t('history_end_record')} — {era.title}</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export const HistoryPage = () => {
  const { theme, season } = useSeason();
  const { language, t } = useLanguage();
  const [activeEra, setActiveEra] = useState<EraDetail | null>(null);
  const safeTheme = theme || { background: '#1D1B18', text: '#F5F1EC' };
  const content = historyContent[language as string] || historyContent['en'];

  return (
    <PageTransition>
      <div className="min-h-screen font-sans bg-[#111] text-[#F5F1EC] relative overflow-x-hidden">
        
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
        </div>

        <div className="h-[80vh] flex flex-col items-center justify-center relative z-10 px-6">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-white/5 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
           
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
              <span className="block text-center text-amber-500 text-xs font-black uppercase tracking-[0.5em] mb-6">{t('history_archives')}</span>
              <h1 className="text-6xl md:text-[8rem] font-black uppercase leading-[0.8] tracking-tighter text-center mb-8 mix-blend-difference">
                 {t('timelines_title')}
              </h1>
           </motion.div>
           
           <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50">
              <div className="w-px h-16 bg-gradient-to-b from-amber-500 to-transparent" />
              <span className="text-[10px] uppercase tracking-widest">{t('history_scroll_drive')}</span>
           </div>
        </div>

        <div className="relative z-10 pb-40">
           {content.map((era, i) => (
              <EraCard 
                key={era.id} 
                era={era} 
                index={i} 
                theme={safeTheme} 
                onOpen={setActiveEra}
                t={t}
              />
           ))}
        </div>

        <AnimatePresence mode="wait">
           {activeEra && (
             <InfoWallDetail 
               era={activeEra} 
               theme={safeTheme} 
               onClose={() => setActiveEra(null)} 
             />
           )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};
