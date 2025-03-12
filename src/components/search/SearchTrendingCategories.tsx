
import React from 'react';
import { Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrendingCategory {
  id: string;
  name: string;
  posts: number;
}

interface SearchTrendingCategoriesProps {
  categories: TrendingCategory[];
}

const SearchTrendingCategories = ({ categories }: SearchTrendingCategoriesProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-black flex items-center gap-2">
          <Hash className="h-4 w-4 text-gold" />
          Trending Categories
        </h3>
        <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-md text-xs font-medium cursor-pointer text-black transition-colors flex items-center gap-1"
          >
            {category.name}
            <span className="text-gold/80 text-[10px]">{category.posts}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTrendingCategories;
