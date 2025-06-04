
import { useEffect } from 'react';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadImage = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Optimize font loading
    const optimizeFonts = () => {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    };

    // Reduce animation on low-end devices
    const optimizeAnimations = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
      }
    };

    // Optimize images with Intersection Observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    optimizeFonts();
    optimizeAnimations();
    optimizeImages();

    // Cleanup
    return () => {
      // Clean up observers if needed
    };
  }, []);
};
