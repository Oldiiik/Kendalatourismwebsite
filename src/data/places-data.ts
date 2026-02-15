import { type Language } from '../contexts/LanguageContext';

export interface PlaceData {
  id: number;
  name_kz: string;
  name_ru: string;
  name_en: string;
  region_kz: string;
  region_ru: string;
  region_en: string;
  desc_kz: string;
  desc_ru: string;
  desc_en: string;
  longDesc_kz: string;
  longDesc_ru: string;
  longDesc_en: string;
  image: string;
  tag_kz: string;
  tag_ru: string;
  tag_en: string;
  coords: string;
  stats: {
    altitude: string;
    difficulty_kz: string;
    difficulty_ru: string;
    difficulty_en: string;
    bestTime_kz: string;
    bestTime_ru: string;
    bestTime_en: string;
    distance_kz: string;
    distance_ru: string;
    distance_en: string;
    duration_kz: string;
    duration_ru: string;
    duration_en: string;
    accommodation_kz: string;
    accommodation_ru: string;
    accommodation_en: string;
  };
}

export const PLACES_RAW: PlaceData[] = [
  {
    id: 1,
    name_kz: 'Көлсай көлдері', name_ru: 'Озера Кольсай', name_en: 'Kolsay Lakes',
    region_kz: 'Алматы облысы', region_ru: 'Алматинская область', region_en: 'Almaty Region',
    desc_kz: 'Солтүстік Тянь-Шаньның маржандары. Үш деңгейлі альпілік көлдер жүйесі.',
    desc_ru: 'Жемчужины Северного Тянь-Шаня. Система из трех альпийских озер.',
    desc_en: 'Pearls of the Northern Tian Shan. Three-tiered alpine lake system.',
    longDesc_kz: 'Көлсай көлдері — Солтүстік Тянь-Шаньның інжу-маржаны деп аталады. Үш көл 1800, 2250 және 2700 метр биіктікте орналасқан. Олардың суы мөлдір, түсі ауа райына байланысты көкшілден қою көкке дейін өзгереді. Айналасы шыршалы орманмен қоршалған, бұл жерде жаяу жүру маршруттары, атпен серуендеу және қайықпен жүзу мүмкіндіктері бар.',
    longDesc_ru: 'Озера Кольсай называют жемчужинами Северного Тянь-Шаня. Три озера расположены на высоте 1800, 2250 и 2700 метров. Вода в них кристально чистая, цвет меняется от голубого до глубокого синего в зависимости от погоды. Окруженные хвойными лесами, здесь проложены пешеходные маршруты, есть возможности для конных прогулок и катания на лодках.',
    longDesc_en: 'The Kolsay Lakes are called the pearls of the Northern Tian Shan. Three lakes sit at elevations of 1800, 2250, and 2700 meters. Their waters are crystal clear, with colors ranging from turquoise to deep blue depending on the weather. Surrounded by coniferous forests, the area offers hiking trails, horseback riding, and boating opportunities.',
    image: 'https://images.unsplash.com/photo-1752583649031-a8a8cc17fb7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tag_kz: 'Көлдер', tag_ru: 'Озера', tag_en: 'Lakes',
    coords: '42.99° N, 78.33° E',
    stats: {
      altitude: '1800-2700м',
      difficulty_kz: 'Орташа', difficulty_ru: 'Средний', difficulty_en: 'Moderate',
      bestTime_kz: 'Маусым-Қыркүйек', bestTime_ru: 'Июнь-Сентябрь', bestTime_en: 'June-September',
      distance_kz: 'Алматыдан 300 км', distance_ru: 'От Алматы 300 км', distance_en: '300 km from Almaty',
      duration_kz: '2-3 күн', duration_ru: '2-3 дня', duration_en: '2-3 days',
      accommodation_kz: 'Қонақ үйлер, Глэмпинг, Кемпинг', accommodation_ru: 'Гостевые дома, Глэмпинг, Кемпинг', accommodation_en: 'Guest houses, Glamping, Camping'
    }
  },
];

export function getLocalizedPlace(place: PlaceData, lang: Language) {
  return {
    id: place.id,
    name: lang === 'kz' ? place.name_kz : lang === 'ru' ? place.name_ru : place.name_en,
    region: lang === 'kz' ? place.region_kz : lang === 'ru' ? place.region_ru : place.region_en,
    desc: lang === 'kz' ? place.desc_kz : lang === 'ru' ? place.desc_ru : place.desc_en,
    longDesc: lang === 'kz' ? place.longDesc_kz : lang === 'ru' ? place.longDesc_ru : place.longDesc_en,
    image: place.image,
    tag: lang === 'kz' ? place.tag_kz : lang === 'ru' ? place.tag_ru : place.tag_en,
    coords: place.coords,
    stats: {
      altitude: place.stats.altitude,
      difficulty: lang === 'kz' ? place.stats.difficulty_kz : lang === 'ru' ? place.stats.difficulty_ru : place.stats.difficulty_en,
      bestTime: lang === 'kz' ? place.stats.bestTime_kz : lang === 'ru' ? place.stats.bestTime_ru : place.stats.bestTime_en,
      distance: lang === 'kz' ? place.stats.distance_kz : lang === 'ru' ? place.stats.distance_ru : place.stats.distance_en,
      duration: lang === 'kz' ? place.stats.duration_kz : lang === 'ru' ? place.stats.duration_ru : place.stats.duration_en,
      accommodation: lang === 'kz' ? place.stats.accommodation_kz : lang === 'ru' ? place.stats.accommodation_ru : place.stats.accommodation_en,
    }
  };
}

export function getAllLocalizedPlaces(lang: Language) {
  return PLACES_RAW.map(place => getLocalizedPlace(place, lang));
}
