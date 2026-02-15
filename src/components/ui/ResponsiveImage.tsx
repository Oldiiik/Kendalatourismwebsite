import { buildImageUrl } from '../../utils/imageUrls';

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

/**
 * Check if a URL is already in the browser's memory/disk cache.
 * Cached images complete synchronously when src is set on a new Image().
 */
const isImageCached = (url: string): boolean => {
  if (!url || url.startsWith('data:')) return false;
  const probe = new Image();
  probe.src = url;
  return probe.complete && probe.naturalWidth > 0;
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
  // Build the canonical URL once for cache probing
  const canonicalUrl = src ? buildImageUrl(src, 1920, 85) : '';
  const cachedOnMount = useRef(priority || isImageCached(canonicalUrl));

  const [isLoaded, setIsLoaded] = useState(cachedOnMount.current);
  const [isInView, setIsInView] = useState(priority || cachedOnMount.current);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // If priority changes to true (e.g., accordion opens), immediately mark as in-view
  useEffect(() => {
    if (priority) {
      setIsInView(true);
    }
  }, [priority]);

  // When the real image element completes (e.g. from browser cache), mark loaded
  useEffect(() => {
    if ((isInView || priority) && imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isInView, priority]);
  
  // Intersection Observer for lazy loading (skipped if already cached or priority)
  useEffect(() => {
    if (priority || isInView) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
            }
          });
        },
        { 
          rootMargin: '300px',
          threshold: 0
        }
      );
    }

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, [priority, isInView]);
  
  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Helper to construct Unsplash URLs - uses centralized builder for cache consistency
  const buildUrl = (url: string, w: number) => {
    return buildImageUrl(url, w, 85);
  };

  // Expanded srcset for 4K support
  const srcset = isInView || priority
    ? [640, 1280, 1920, 2560, 3840]
        .map(w => `${buildUrl(src, w)} ${w}w`)
        .join(', ')
    : undefined;

  const isUnsplash = src?.includes('unsplash.com');
  
  // Calculate aspect ratio for placeholder
  const paddingBottom = aspectRatio 
    ? `${(parseFloat(aspectRatio.split('/')[1]) / parseFloat(aspectRatio.split('/')[0])) * 100}%`
    : undefined;

  // Transparent placeholder bg - adapts to context (dark pages won't flash gray)
  const bgColor = placeholderColor || 'transparent';

  // Skip fade transition for images that were already cached when component mounted
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
      {/* Single optimized image - no duplicate loading */}
      <img
        ref={imgRef}
        src={isInView || priority ? buildUrl(src, 1920) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
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
        className={`absolute inset-0 w-full h-full transition-opacity ${skipTransition ? 'duration-0' : priority ? 'duration-300' : 'duration-700'} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        {...props}
      />
    </div>
  );
};