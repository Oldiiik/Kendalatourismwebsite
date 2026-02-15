import { useEffect, useState } from 'react';

export const useImagePreloader = (images: string[]) => {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!images || images.length === 0) {
      setImagesPreloaded(true);
      return;
    }

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      });
    };

    Promise.all(images.map(src => preloadImage(src)))
      .then(() => {
        if (isMounted) {
          setImagesPreloaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [images]);

  return imagesPreloaded;
};