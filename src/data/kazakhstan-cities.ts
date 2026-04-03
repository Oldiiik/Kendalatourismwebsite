/**
 * Centralized Kazakhstan destinations data module.
 * Enterprise-grade data layer for search, filtering, and city selection.
 */

export interface KZCity {
  id: string;
  slug: string;
  name: { en: string; ru: string; kz: string };
  region: { en: string; ru: string; kz: string };
  population?: number;
  /** Whether it's a major travel hub */
  tier: 1 | 2 | 3;
  coords: { lat: number; lng: number };
  image: string;
  tags: string[];
}

export const KAZAKHSTAN_CITIES: KZCity[] = [
  // ── Tier 1: Major hubs ──
  { id: 'almaty', slug: 'almaty', name: { en: 'Almaty', ru: 'Алматы', kz: 'Алматы' }, region: { en: 'Almaty', ru: 'Алматы', kz: 'Алматы' }, population: 2000000, tier: 1, coords: { lat: 43.238, lng: 76.946 }, image: 'https://images.unsplash.com/photo-1609750530834-2a72390769be?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['mountains', 'culture', 'urban', 'ski'] },
  { id: 'astana', slug: 'astana', name: { en: 'Astana', ru: 'Астана', kz: 'Астана' }, region: { en: 'Astana', ru: 'Астана', kz: 'Астана' }, population: 1350000, tier: 1, coords: { lat: 51.169, lng: 71.449 }, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['capital', 'modern', 'architecture', 'business'] },
  { id: 'shymkent', slug: 'shymkent', name: { en: 'Shymkent', ru: 'Шымкент', kz: 'Шымкент' }, region: { en: 'Turkistan', ru: 'Туркестанская обл.', kz: 'Түркістан облысы' }, population: 1050000, tier: 1, coords: { lat: 42.317, lng: 69.597 }, image: 'https://images.unsplash.com/photo-1596306499317-8490832d3852?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['southern', 'ancient', 'bazaar'] },

  // ── Tier 2: Regional capitals & popular destinations ──
  { id: 'aktau', slug: 'aktau', name: { en: 'Aktau', ru: 'Актау', kz: 'Ақтау' }, region: { en: 'Mangystau', ru: 'Мангистауская обл.', kz: 'Маңғыстау облысы' }, population: 190000, tier: 2, coords: { lat: 43.652, lng: 51.158 }, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['caspian', 'beach', 'desert'] },
  { id: 'aktobe', slug: 'aktobe', name: { en: 'Aktobe', ru: 'Актобе', kz: 'Ақтөбе' }, region: { en: 'Aktobe', ru: 'Актюбинская обл.', kz: 'Ақтөбе облысы' }, population: 500000, tier: 2, coords: { lat: 50.300, lng: 57.166 }, image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['western', 'steppe'] },
  { id: 'atyrau', slug: 'atyrau', name: { en: 'Atyrau', ru: 'Атырау', kz: 'Атырау' }, region: { en: 'Atyrau', ru: 'Атырауская обл.', kz: 'Атырау облысы' }, population: 350000, tier: 2, coords: { lat: 47.095, lng: 51.923 }, image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['oil', 'caspian', 'business'] },
  { id: 'karaganda', slug: 'karaganda', name: { en: 'Karaganda', ru: 'Караганда', kz: 'Қарағанды' }, region: { en: 'Karaganda', ru: 'Карагандинская обл.', kz: 'Қарағанды облысы' }, population: 500000, tier: 2, coords: { lat: 49.802, lng: 73.103 }, image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['industrial', 'history', 'mining'] },
  { id: 'kostanay', slug: 'kostanay', name: { en: 'Kostanay', ru: 'Костанай', kz: 'Қостанай' }, region: { en: 'Kostanay', ru: 'Костанайская обл.', kz: 'Қостанай облысы' }, population: 240000, tier: 2, coords: { lat: 53.214, lng: 63.632 }, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['northern', 'agriculture', 'steppe'] },
  { id: 'pavlodar', slug: 'pavlodar', name: { en: 'Pavlodar', ru: 'Павлодар', kz: 'Павлодар' }, region: { en: 'Pavlodar', ru: 'Павлодарская обл.', kz: 'Павлодар облысы' }, population: 370000, tier: 2, coords: { lat: 52.287, lng: 76.967 }, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['irtysh', 'industry'] },
  { id: 'semey', slug: 'semey', name: { en: 'Semey', ru: 'Семей', kz: 'Семей' }, region: { en: 'Abai', ru: 'Абайская обл.', kz: 'Абай облысы' }, population: 340000, tier: 2, coords: { lat: 50.411, lng: 80.227 }, image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['literature', 'abai', 'history'] },
  { id: 'oskemen', slug: 'oskemen', name: { en: 'Oskemen', ru: 'Усть-Каменогорск', kz: 'Өскемен' }, region: { en: 'East Kazakhstan', ru: 'ВКО', kz: 'ШҚО' }, population: 330000, tier: 2, coords: { lat: 49.948, lng: 82.628 }, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['altai', 'mountains', 'nature'] },
  { id: 'taraz', slug: 'taraz', name: { en: 'Taraz', ru: 'Тараз', kz: 'Тараз' }, region: { en: 'Jambyl', ru: 'Жамбылская обл.', kz: 'Жамбыл облысы' }, population: 360000, tier: 2, coords: { lat: 42.900, lng: 71.378 }, image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['ancient', 'silk-road', 'history'] },
  { id: 'turkistan', slug: 'turkistan', name: { en: 'Turkistan', ru: 'Туркестан', kz: 'Түркістан' }, region: { en: 'Turkistan', ru: 'Туркестанская обл.', kz: 'Түркістан облысы' }, population: 175000, tier: 2, coords: { lat: 43.301, lng: 68.251 }, image: 'https://images.unsplash.com/photo-1580294672675-91afc5c23560?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['spiritual', 'unesco', 'silk-road', 'mausoleum'] },
  { id: 'petropavl', slug: 'petropavl', name: { en: 'Petropavl', ru: 'Петропавловск', kz: 'Петропавл' }, region: { en: 'North Kazakhstan', ru: 'СКО', kz: 'СҚО' }, population: 220000, tier: 2, coords: { lat: 54.875, lng: 69.162 }, image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['northern', 'border', 'history'] },
  { id: 'kyzylorda', slug: 'kyzylorda', name: { en: 'Kyzylorda', ru: 'Кызылорда', kz: 'Қызылорда' }, region: { en: 'Kyzylorda', ru: 'Кызылординская обл.', kz: 'Қызылорда облысы' }, population: 310000, tier: 2, coords: { lat: 44.852, lng: 65.509 }, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['aral', 'baikonur', 'space'] },
  { id: 'taldykorgan', slug: 'taldykorgan', name: { en: 'Taldykorgan', ru: 'Талдыкорган', kz: 'Талдықорған' }, region: { en: 'Jetisu', ru: 'Жетысуская обл.', kz: 'Жетісу облысы' }, population: 160000, tier: 2, coords: { lat: 45.015, lng: 78.373 }, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['jetisu', 'nature', 'lakes'] },
  { id: 'kokshetau', slug: 'kokshetau', name: { en: 'Kokshetau', ru: 'Кокшетау', kz: 'Көкшетау' }, region: { en: 'Akmola', ru: 'Акмолинская обл.', kz: 'Ақмола облысы' }, population: 160000, tier: 2, coords: { lat: 53.283, lng: 69.396 }, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['burabay', 'lakes', 'nature'] },

  // ── Tier 3: Smaller cities & tourist spots ──
  { id: 'burabay', slug: 'burabay', name: { en: 'Burabay', ru: 'Бурабай', kz: 'Бурабай' }, region: { en: 'Akmola', ru: 'Акмолинская обл.', kz: 'Ақмола облысы' }, tier: 3, coords: { lat: 53.083, lng: 70.319 }, image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['resort', 'lakes', 'nature', 'forest'] },
  { id: 'baikonur', slug: 'baikonur', name: { en: 'Baikonur', ru: 'Байконур', kz: 'Байқоңыр' }, region: { en: 'Kyzylorda', ru: 'Кызылординская обл.', kz: 'Қызылорда облысы' }, tier: 3, coords: { lat: 45.964, lng: 63.305 }, image: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['space', 'cosmodrome', 'unique'] },
  { id: 'balkhash', slug: 'balkhash', name: { en: 'Balkhash', ru: 'Балхаш', kz: 'Балқаш' }, region: { en: 'Karaganda', ru: 'Карагандинская обл.', kz: 'Қарағанды облысы' }, tier: 3, coords: { lat: 46.844, lng: 74.995 }, image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['lake', 'unique', 'nature'] },
  { id: 'zhezkazgan', slug: 'zhezkazgan', name: { en: 'Zhezkazgan', ru: 'Жезказган', kz: 'Жезқазған' }, region: { en: 'Ulytau', ru: 'Улытауская обл.', kz: 'Ұлытау облысы' }, tier: 3, coords: { lat: 47.783, lng: 67.714 }, image: 'https://images.unsplash.com/photo-1518173946687-a64ed4174fac?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['ulytau', 'steppe', 'mining'] },
  { id: 'ridder', slug: 'ridder', name: { en: 'Ridder', ru: 'Риддер', kz: 'Риддер' }, region: { en: 'East Kazakhstan', ru: 'ВКО', kz: 'ШҚО' }, tier: 3, coords: { lat: 50.344, lng: 83.515 }, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['altai', 'mountains', 'skiing'] },
  { id: 'saty', slug: 'saty', name: { en: 'Saty', ru: 'Саты', kz: 'Саты' }, region: { en: 'Almaty Region', ru: 'Алматинская обл.', kz: 'Алматы облысы' }, tier: 3, coords: { lat: 42.879, lng: 78.303 }, image: 'https://images.unsplash.com/photo-1644620426342-471c3ed4e1d4?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['kolsay', 'kaindy', 'trekking'] },
  { id: 'mangystau', slug: 'mangystau', name: { en: 'Mangystau', ru: 'Мангистау', kz: 'Маңғыстау' }, region: { en: 'Mangystau', ru: 'Мангистауская обл.', kz: 'Маңғыстау облысы' }, tier: 3, coords: { lat: 43.35, lng: 52.06 }, image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['desert', 'canyons', 'caspian', 'unique'] },
  { id: 'charyn', slug: 'charyn', name: { en: 'Charyn Canyon', ru: 'Чарынский каньон', kz: 'Шарын шатқалы' }, region: { en: 'Almaty Region', ru: 'Алматинская обл.', kz: 'Алматы облысы' }, tier: 3, coords: { lat: 43.353, lng: 79.076 }, image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['canyon', 'nature', 'hiking'] },
  { id: 'aralsk', slug: 'aralsk', name: { en: 'Aralsk', ru: 'Аральск', kz: 'Арал' }, region: { en: 'Kyzylorda', ru: 'Кызылордин��кая обл.', kz: 'Қызылорда облысы' }, tier: 3, coords: { lat: 46.799, lng: 61.667 }, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['aral-sea', 'history', 'ecological'] },
  { id: 'kapchagay', slug: 'kapchagay', name: { en: 'Kapchagay', ru: 'Капшагай', kz: 'Қапшағай' }, region: { en: 'Almaty Region', ru: 'Алматинская обл.', kz: 'Алматы облысы' }, tier: 3, coords: { lat: 43.881, lng: 77.068 }, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['reservoir', 'entertainment', 'beach'] },
  { id: 'ekibastuz', slug: 'ekibastuz', name: { en: 'Ekibastuz', ru: 'Экибастуз', kz: 'Екібастұз' }, region: { en: 'Pavlodar', ru: 'Павлодарская обл.', kz: 'Павлодар облысы' }, tier: 3, coords: { lat: 51.729, lng: 75.322 }, image: 'https://images.unsplash.com/photo-1518173946687-a64ed4174fac?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['industrial', 'energy'] },
  { id: 'kentau', slug: 'kentau', name: { en: 'Kentau', ru: 'Кентау', kz: 'Кентау' }, region: { en: 'Turkistan', ru: 'Туркестанская обл.', kz: 'Түркістан облысы' }, tier: 3, coords: { lat: 43.517, lng: 68.507 }, image: 'https://images.unsplash.com/photo-1596306499317-8490832d3852?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['southern', 'mining'] },
  { id: 'stepnogorsk', slug: 'stepnogorsk', name: { en: 'Stepnogorsk', ru: 'Степногорск', kz: 'Степногорск' }, region: { en: 'Akmola', ru: 'Акмолинская обл.', kz: 'Ақмола облысы' }, tier: 3, coords: { lat: 52.350, lng: 71.893 }, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=75&fm=webp&auto=format&fit=crop', tags: ['soviet', 'closed-city'] },
];

/** Top destinations for the homepage search suggestions */
export const TOP_DESTINATIONS = KAZAKHSTAN_CITIES.filter(c => c.tier <= 2).sort((a, b) => (a.tier - b.tier) || ((b.population || 0) - (a.population || 0)));

/** Get city by id */
export const getCityById = (id: string) => KAZAKHSTAN_CITIES.find(c => c.id === id);

/** Get city name by language */
export const getCityName = (city: KZCity, lang: 'en' | 'ru' | 'kz') => city.name[lang];

/** Search cities by query */
export const searchCities = (query: string, lang: 'en' | 'ru' | 'kz') => {
  const q = query.toLowerCase();
  return KAZAKHSTAN_CITIES.filter(c =>
    c.name.en.toLowerCase().includes(q) ||
    c.name.ru.toLowerCase().includes(q) ||
    c.name.kz.toLowerCase().includes(q) ||
    c.tags.some(t => t.includes(q))
  );
};

/** Get unique regions */
export const getRegions = (lang: 'en' | 'ru' | 'kz') => {
  const seen = new Set<string>();
  return KAZAKHSTAN_CITIES
    .filter(c => {
      const name = c.region[lang];
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .map(c => ({ id: c.region.en, name: c.region[lang] }));
};
