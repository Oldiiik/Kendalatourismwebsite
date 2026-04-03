import { useEffect, useState } from 'react';

// Concurrent image preloader with max parallelism to avoid saturating bandwidth
export const useImagePreloader = (images: string[], concurrency = 4) => {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!images || images.length === 0) {
      setImagesPreloaded(true);
      return;
    }

    const preloadImage = (src: string): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve();
        // Timeout fallback — don't block forever
        setTimeout(resolve, 4000);
      });

    const queue = [...images];
    let active = 0;

    const processNext = () => {
      if (!isMounted) return;
      if (queue.length === 0 && active === 0) {
        setImagesPreloaded(true);
        return;
      }
      while (active < concurrency && queue.length > 0) {
        const src = queue.shift()!;
        active++;
        preloadImage(src).then(() => {
          active--;
          processNext();
        });
      }
    };

    processNext();

    return () => {
      isMounted = false;
    };
  }, [images, concurrency]);

  return imagesPreloaded;
};
