
import React from 'react';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrendingNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
}

interface SearchTrendingNewsProps {
  newsItems: TrendingNewsItem[];
}

const SearchTrendingNews = ({ newsItems }: SearchTrendingNewsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-black flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-gold" />
          Trending News
        </h3>
        <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
      </div>
      <div className="space-y-3">
        {newsItems.map((news) => (
          <div key={news.id} className="p-3 border border-black/10 rounded-md hover:bg-black/5 cursor-pointer">
            <h4 className="text-sm font-medium mb-1">{news.title}</h4>
            <div className="flex items-center text-xs text-black/60">
              <span>{news.source}</span>
              <span className="mx-2">•</span>
              <span>{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTrendingNews;
