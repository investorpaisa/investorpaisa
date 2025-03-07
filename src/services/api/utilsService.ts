
import { toast } from "@/hooks/use-toast";

export const utilsService = {
  // Error handler helper
  handleError(error: unknown): never {
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Unknown error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    throw new Error("An unexpected error occurred");
  }
};
