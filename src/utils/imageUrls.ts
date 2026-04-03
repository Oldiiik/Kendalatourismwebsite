const fallbackFiles = [
  'abay_qunanbayuli.jpg', 'abylai_khan.jpg', 'aisha_bibi.jpg', 'al_farabi.jpg', 'autumn.jpg',
  'baursak.jpg', 'bayterek.jpg', 'beldik.jpg', 'beshbarmak.jpg', 'blacksmithing.jpg',
  'bogenbay_batyr.webp', 'bone_carving.jpg', 'chapan.jpg', 'dina_nurpeisova.jpg', 'embroidery.jpg',
  'felt_making.jpg', 'golden_man.jpg', 'irimshik.jpg', 'jewelry.jpg', 'kamzol.webp',
  'kazy.jpg', 'kazygurt.jpg', 'kenesary_khan.jpg', 'kimeshek.jpg', 'korkyt_ata.jpg',
  'kozy_korpesh.jpg', 'kurmangazy.jpg', 'kurt.jpg', 'kymyz.jpg', 'lake_balkhash.jpg',
  'leatherwork.jpg', 'masi.webp', 'pottery.jpg', 'saukele.jpg', 'shekpan.jpg',
  'shelpek.jpg', 'shokan_walikhanov.jpg', 'shubat.jpg', 'spring.jpg', 'summer.jpg',
  'sybyzgy.jpg', 'syrmak.jpg', 'takiya.jpg', 'tomyris.jpg', 'turkestan.jpg',
  'tymak.jpg', 'winter.jpg', 'wood_carving.jpg', 'zhent.jpg'
];

export const buildImageUrl = (url: string, width: number = 1920, quality: number = 85): string => {
  if (!url) return url;
  if (url.includes('unsplash.com')) {
      let sum = 0;
      for(let i=0; i<url.length; i++) sum += url.charCodeAt(i);
      const file = fallbackFiles[sum % fallbackFiles.length];
      return `https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/${file}`;
  }
  // Supabase Storage doesn't support image transformation query params — return URL as-is
  return url.split('?')[0];
};

// Tiny 20px blur placeholder for instant LQIP
export const buildLqipUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
      let sum = 0;
      for(let i=0; i<url.length; i++) sum += url.charCodeAt(i);
      const file = fallbackFiles[sum % fallbackFiles.length];
      return `https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/${file}`;
  }
  // Supabase Storage doesn't support image transformation — return URL as-is
  return url.split('?')[0];
};

export const buildSrcSet = (url: string): string => {
  // Supabase Storage doesn't support width-based variants — return empty
  return '';
};

export const hq = (url: string, width: number = 1920): string => buildImageUrl(url, width, 85);

export const LANG_BG_URLS = [
  'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
  'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
  'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
] as const;

export const SEASON_SELECTION_URLS: Record<string, string> = {
  winter: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/winter.jpg',
  spring: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
  summer: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
  autumn: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
};

export const HOME_HERO_URLS: Record<string, string> = {
  winter: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/winter.jpg',
  spring: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/spring.jpg',
  summer: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/summer.jpg',
  autumn: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/autumn.jpg',
};

export const HOME_FEATURE_URLS = {
  places: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
  map: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
  ai: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/golden_man.jpg',
} as const;

export const NEWS_FEATURE_URLS = [
    'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/abay_qunanbayuli.jpg',
    'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
];

export const REGION_HERO_URLS: Record<string, string> = {
  north: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/winter.jpg',
  south: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/turkestan.jpg',
  west: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/lake_balkhash.jpg',
  east: 'https://wrxtnfwckeqhwfjsaifh.supabase.co/storage/v1/object/public/make-1a93d248-public-assets/kazygurt.jpg',
};

export const getLangBgUrl = (index: number): string =>
  buildImageUrl(LANG_BG_URLS[index % LANG_BG_URLS.length], 1920);

export const getSeasonSelectionUrl = (season: string): string => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const width = isMobile ? 640 : 1440;
  return buildImageUrl(SEASON_SELECTION_URLS[season] || SEASON_SELECTION_URLS.summer, width, 75);
};

export const getHomeHeroUrl = (season: string): string =>
  buildImageUrl(HOME_HERO_URLS[season] || HOME_HERO_URLS.summer, 1920);

export const getHomeFeatureUrl = (key: keyof typeof HOME_FEATURE_URLS): string =>
  buildImageUrl(HOME_FEATURE_URLS[key], 1080);

export type PreloadPriority = 'critical' | 'high' | 'medium' | 'low';

export interface PreloadEntry {
  url: string;
  priority: PreloadPriority;
}

export const getPreloadManifest = (opts: {
  hasLanguage: boolean;
  savedSeason: string | null;
}): PreloadEntry[] => {
  const entries: PreloadEntry[] = [];
  const { hasLanguage, savedSeason } = opts;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const seasonWidth = isMobile ? 640 : 1440;
  
  if (!hasLanguage) {
    // Only preload the first language bg as critical, rest as medium
    entries.push({ url: buildImageUrl(LANG_BG_URLS[0], 1080), priority: 'critical' });
    LANG_BG_URLS.slice(1).forEach(url => {
      entries.push({ url: buildImageUrl(url, 1080), priority: 'medium' });
    });

    Object.values(SEASON_SELECTION_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, seasonWidth, 75), priority: 'low' });
    });
  } else if (!savedSeason) {
    // Only preload season images at reduced size
    Object.values(SEASON_SELECTION_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, seasonWidth, 75), priority: 'critical' });
    });

    // Hero images are low priority until season is picked
    Object.values(HOME_HERO_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, 1080), priority: 'low' });
    });
  } else {
    if (HOME_HERO_URLS[savedSeason]) {
      entries.push({ url: buildImageUrl(HOME_HERO_URLS[savedSeason], 1920), priority: 'critical' });
    }

    Object.values(HOME_FEATURE_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, 1080), priority: 'medium' });
    });

    Object.entries(HOME_HERO_URLS).forEach(([s, url]) => {
      if (s !== savedSeason) {
        entries.push({ url: buildImageUrl(url, 1080), priority: 'low' });
      }
    });
  }

  Object.values(REGION_HERO_URLS).forEach(url => {
    entries.push({ url: buildImageUrl(url, 1080), priority: 'low' });
  });

  NEWS_FEATURE_URLS.forEach(url => {
      entries.push({ url: buildImageUrl(url, 800), priority: 'low' });
  });

  return entries;
};