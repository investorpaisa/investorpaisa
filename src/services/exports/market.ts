
// Re-export market services
import { marketService } from '../market';

// Export market service
export { marketService };

// For backward compatibility
export const market = marketService;
