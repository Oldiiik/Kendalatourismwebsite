import { useEffect } from 'react';
import { HOME_HERO_URLS, buildImageUrl } from './imageUrls';

export const useImagePreconnect = (season?: string) => {
  useEffect(() => {
    const existingPreconnect = document.querySelector('link[rel="preconnect"][href="https://images.unsplash.com"]');
    
    if (!existingPreconnect) {
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = 'https://images.unsplash.com';
      document.head.appendChild(dnsPrefetch);

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://images.unsplash.com';
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    }
  }, []);

  useEffect(() => {
    if (!season) return;

    const heroUrl = HOME_HERO_URLS[season] || HOME_HERO_URLS.summer;
    const fullUrl = buildImageUrl(heroUrl, 3840);

    if (document.querySelector(`link[rel="preload"][href="${fullUrl}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = fullUrl;
    link.setAttribute('fetchpriority', 'high');
    
    document.head.appendChild(link);

    return () => {};
  }, [season]);
};
