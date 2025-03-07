
import { Category } from './types';

export const categoryService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock categories
    return [
      {
        id: "cat-1",
        name: "Taxation",
        description: "Discussions about tax planning and compliance",
        icon: "shield",
        postCount: 234
      },
      {
        id: "cat-2",
        name: "Investments",
        description: "Topics related to various investment options",
        icon: "line-chart",
        postCount: 567
      },
      {
        id: "cat-3",
        name: "Personal Finance",
        description: "Budget planning and financial management",
        icon: "wallet",
        postCount: 432
      },
      {
        id: "cat-4",
        name: "Debt Management",
        description: "Strategies to manage and reduce debt",
        icon: "info",
        postCount: 189
      }
    ];
  }
};
