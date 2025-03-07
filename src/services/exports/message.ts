
// Re-export message services
// Avoid type conflicts by using more specific naming
import { messageService as messagesModuleService } from '../messages';

// Named export with specific name
export { messagesModuleService };

// For backward compatibility
export const message = messagesModuleService;
