export const preloadCriticalImage = (src: string, sizes?: string) => {
  if (typeof window === 'undefined') return;
  
  const existingPreload = document.querySelector(`link[rel="preload"][href="${src}"]`);
  if (existingPreload) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (sizes) {
    link.setAttribute('imagesizes', sizes);
  }
  
  document.head.appendChild(link);
};

export const preloadCriticalImages = (images: Array<{ src: string; sizes?: string }>) => {
  images.forEach(({ src, sizes }) => {
    preloadCriticalImage(src, sizes);
  });
};
