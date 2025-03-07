
// Re-export news services
import { newsService } from '../news';

// Named export
export { newsService };

// For backward compatibility
export const news = newsService;
