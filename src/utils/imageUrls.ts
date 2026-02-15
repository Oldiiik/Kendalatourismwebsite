export const buildImageUrl = (url: string, width: number = 1920, quality: number = 85): string => {
  if (!url) return url;
  if (!url.includes('unsplash.com')) return url;
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?w=${width}&q=${quality}&fm=webp&auto=format&fit=crop`;
};

export const buildSrcSet = (url: string): string => {
  if (!url || !url.includes('unsplash.com')) return '';
  const widths = [640, 750, 828, 1080, 1200, 1920, 2400, 3840];
  return widths
    .map(w => `${buildImageUrl(url, w)} ${w}w`)
    .join(', ');
};

export const hq = (url: string, width: number = 1920): string => buildImageUrl(url, width, 85);

export const LANG_BG_URLS = [
  'https://images.unsplash.com/photo-1637842729600-d256c8960194',
  'https://images.unsplash.com/photo-1737973832585-d8b3ba781211',
  'https://images.unsplash.com/photo-1562595706-61433957484a',
] as const;

export const SEASON_SELECTION_URLS: Record<string, string> = {
  winter: 'https://images.unsplash.com/photo-1715534968151-097f0651e561',
  spring: 'https://images.unsplash.com/photo-1626251446230-f24d2dc814ed',
  summer: 'https://images.unsplash.com/photo-1672928130266-aaf030518e4f',
  autumn: 'https://images.unsplash.com/photo-1696882144000-940a2f67fa21',
};

export const HOME_HERO_URLS: Record<string, string> = {
  winter: 'https://images.unsplash.com/photo-1646656673850-cf3dc0c25759',
  spring: 'https://images.unsplash.com/photo-1693642988144-3ba970781679',
  summer: 'https://images.unsplash.com/photo-1752503256243-2edf964c00d0',
  autumn: 'https://images.unsplash.com/photo-1672928130266-aaf030518e4f',
};

export const HOME_FEATURE_URLS = {
  places: 'https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d',
  map: 'https://images.unsplash.com/photo-1488375634201-b85b28653a79',
  ai: 'https://images.unsplash.com/photo-1514524929069-1021cbe21035',
} as const;

export const NEWS_FEATURE_URLS = [
    'https://images.unsplash.com/photo-1604145703889-5c58d94ee681',
    'https://images.unsplash.com/photo-1459196198227-6655e22114d8',
];

export const REGION_HERO_URLS: Record<string, string> = {
  north: 'https://images.unsplash.com/photo-1642693373768-0b86505bd7c8',
  south: 'https://images.unsplash.com/photo-1752584157449-a3c95f6b7b2d',
  west: 'https://images.unsplash.com/photo-1763365803423-48d4b9402c5e',
  east: 'https://images.unsplash.com/photo-1605354180969-0f3fc29665bf',
};

export const getLangBgUrl = (index: number): string =>
  buildImageUrl(LANG_BG_URLS[index % LANG_BG_URLS.length], 1920);

export const getSeasonSelectionUrl = (season: string): string => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const width = isMobile ? 800 : 2400;
  return buildImageUrl(SEASON_SELECTION_URLS[season] || SEASON_SELECTION_URLS.summer, width, 75);
};

export const getHomeHeroUrl = (season: string): string =>
  buildImageUrl(HOME_HERO_URLS[season] || HOME_HERO_URLS.summer, 3840);

export const getHomeFeatureUrl = (key: keyof typeof HOME_FEATURE_URLS): string =>
  buildImageUrl(HOME_FEATURE_URLS[key], 3840);

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
  const seasonWidth = isMobile ? 800 : 2400;
  
  if (!hasLanguage) {
    LANG_BG_URLS.forEach(url => {
      entries.push({ url: buildImageUrl(url, 1920), priority: 'critical' });
    });

    Object.values(SEASON_SELECTION_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, seasonWidth, 75), priority: isMobile ? 'critical' : 'medium' });
    });
  } else if (!savedSeason) {
    Object.values(SEASON_SELECTION_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, seasonWidth, 75), priority: 'critical' });
    });

    Object.values(HOME_HERO_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, 3840), priority: 'medium' });
    });
  } else {
    if (HOME_HERO_URLS[savedSeason]) {
      entries.push({ url: buildImageUrl(HOME_HERO_URLS[savedSeason], 3840), priority: 'critical' });
    }

    Object.values(HOME_FEATURE_URLS).forEach(url => {
      entries.push({ url: buildImageUrl(url, 3840), priority: 'high' });
    });

    Object.entries(HOME_HERO_URLS).forEach(([s, url]) => {
      if (s !== savedSeason) {
        entries.push({ url: buildImageUrl(url, 3840), priority: 'low' });
      }
    });
  }

  Object.values(REGION_HERO_URLS).forEach(url => {
    entries.push({ url: buildImageUrl(url, 1920), priority: 'medium' });
  });

  NEWS_FEATURE_URLS.forEach(url => {
      entries.push({ url: buildImageUrl(url, 1200), priority: 'low' });
  });

  return entries;
};
