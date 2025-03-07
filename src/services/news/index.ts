
// Re-export everything from newsService
import { 
  getLatestNews, 
  getNewsByCategory, 
  getTrendingNews, 
  getNewsById,
  triggerNewsFetch
} from './newsService';

// Export individual functions
export {
  getLatestNews,
  getNewsByCategory,
  getTrendingNews,
  getNewsById,
  triggerNewsFetch
};

// Export as a service object for backward compatibility
export const newsService = {
  getLatestNews,
  getNewsByCategory,
  getTrendingNews,
  getNewsById,
  triggerNewsFetch
};
