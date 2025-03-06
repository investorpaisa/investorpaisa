
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Category } from "./api";

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        throw error;
      }

      return data.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description || '',
        icon: category.icon || 'help-circle',
        postCount: category.post_count || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Failed to fetch categories",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        icon: data.icon || 'help-circle',
        postCount: data.post_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();
