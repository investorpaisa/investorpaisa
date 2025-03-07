
// Re-export all services

// Auth services
export * from './auth';

// Profile services
export * from './profiles';

// Export from posts module using import/export to avoid conflicts
import { postService } from './posts';
export { postService };

// Circle services
export * from './circles';

// Engagement services
export * from './engagement';

// Message services - avoid type conflicts
import { messageService } from './messages';
export { messageService };

// Market services
export * from './market';

// News services
export * from './news';

// API services - avoid type conflicts
import { api } from './api';
export { api };

// Analytics services
export * from './analytics/metricsService';

// Standalone services
export * from './categoryService';
export * from './postService';
export * from './authService';

// Backward compatibility exports
import { authService } from './auth';
import { profileService } from './profiles';
import { circleService } from './circles';
import { engagement } from './engagement';
import { marketService } from './market';
import { newsService } from './news';

// Consolidated service object
export const services = {
  auth: authService,
  profiles: profileService,
  posts: postService,
  circles: circleService,
  engagement,
  messages: messageService,
  market: marketService,
  news: newsService
};
