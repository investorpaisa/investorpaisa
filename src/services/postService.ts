
// Re-export from the new modular structure for backward compatibility
import { postService, Post, Category, Comment } from './posts';

export { postService };
export type { Post, Category, Comment };
