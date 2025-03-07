
// Re-export all services
export * from './auth';
export * from './profiles';
export * from './posts';
export * from './circles';
export * from './engagement';
export * from './messages';
export * from './market';
export * from './news';
export * from './api';
export * from './analytics/metricsService';
export * from './categoryService';
export * from './postService';
export * from './authService';

// Backward compatibility exports
import { authService } from './auth';
import { profileService } from './profiles';
import { postService } from './posts';
import { circleService } from './circles';
import { engagement } from './engagement';
import { messageService } from './messages';
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
