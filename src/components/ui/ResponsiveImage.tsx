import React, { useRef, useState, useEffect, useMemo } from 'react';
import { buildImageUrl, buildLqipUrl } from '../../utils/imageUrls';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  placeholderColor?: string;
}

const isImageCached = (url: string): boolean => {
  if (!url || url.startsWith('data:')) return false;
  const probe = new Image();
  probe.src = url;
  return probe.complete && probe.naturalWidth > 0;
};

// Shared observer for all non-priority images (much better perf than one per component)
let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, () => void>();

const getSharedObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              sharedObserver?.unobserve(entry.target);
              observerCallbacks.delete(entry.target);
            }
          }
        });
      },
      { rootMargin: '600px', threshold: 0 }
    );
  }
  return sharedObserver;
};

export const ResponsiveImage = ({ 
  src, 
  sizes = "100vw", 
  priority = false, 
  className = "", 
  imgClassName = "object-cover",
  alt = "",
  style,
  width,
  height,
  aspectRatio,
  placeholderColor,
  ...props 
}: ResponsiveImageProps) => {
  const canonicalUrl = src ? buildImageUrl(src, 1080, 85) : '';
  const cachedOnMount = useRef(priority || isImageCached(canonicalUrl));

  const [isLoaded, setIsLoaded] = useState(cachedOnMount.current);
  const [isInView, setIsInView] = useState(priority || cachedOnMount.current);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate LQIP URL (tiny 20px blurred placeholder)
  const lqipUrl = useMemo(() => buildLqipUrl(src), [src]);

  useEffect(() => {
    if (priority) setIsInView(true);
  }, [priority]);

  useEffect(() => {
    if ((isInView || priority) && imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isInView, priority]);
  
  useEffect(() => {
    if (priority || isInView) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = getSharedObserver();
    observerCallbacks.set(el, () => setIsInView(true));
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observerCallbacks.delete(el);
    };
  }, [priority, isInView]);

  const srcset = isInView || priority
    ? [480, 768, 1080, 1440, 1920]
        .map(w => `${buildImageUrl(src, w, 85)} ${w}w`)
        .join(', ')
    : undefined;
  
  const paddingBottom = aspectRatio 
    ? `${(parseFloat(aspectRatio.split('/')[1]) / parseFloat(aspectRatio.split('/')[0])) * 100}%`
    : undefined;

  const bgColor = placeholderColor || 'transparent';
  const skipTransition = cachedOnMount.current;

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        paddingBottom: paddingBottom,
        backgroundColor: bgColor,
        ...style 
      }}
      ref={containerRef}
    >
      {/* LQIP blur placeholder — loads instantly (~200 bytes) */}
      {lqipUrl && !skipTransition && (
        <img
          src={lqipUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full ${imgClassName} transition-opacity duration-500 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView || priority ? buildImageUrl(src, 1080, 85) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
        srcSet={srcset}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority || cachedOnMount.current ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "auto"}
        decoding={skipTransition ? "sync" : "async"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full transition-opacity ${skipTransition ? 'duration-0' : priority ? 'duration-300' : 'duration-500'} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        {...props}
      />
    </div>
  );
};
