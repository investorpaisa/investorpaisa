
// Google Analytics service for tracking events and page views
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-2KS1ZW7BFC';

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user interactions
export const trackUserEvent = {
  login: (method: string) => trackEvent('login', 'user', method),
  signup: (method: string) => trackEvent('sign_up', 'user', method),
  logout: () => trackEvent('logout', 'user'),
  shareArticle: (articleId: string) => trackEvent('share', 'engagement', articleId),
  bookmarkArticle: (articleId: string) => trackEvent('bookmark', 'engagement', articleId),
  likePost: (postId: string) => trackEvent('like', 'engagement', postId),
  viewMarket: (symbol: string) => trackEvent('view_market', 'market', symbol),
  searchQuery: (query: string) => trackEvent('search', 'search', query),
};
