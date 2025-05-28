
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, ExternalLink } from 'lucide-react';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';

const SearchTrendingNews = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-500" />
            Trending Financial News
          </CardTitle>
          <CardDescription>
            Latest market updates and financial insights powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryNewsSection
            title="Market Trending"
            topic="trending market news financial insights and investment updates"
            category="Markets"
            limit={4}
            showCrawlButton={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Search Financial Topics</CardTitle>
          <CardDescription>
            Use our AI-powered search to find specific financial information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trendingSearches.map((search, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{search}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const trendingSearches = [
  "Federal Reserve Interest Rates",
  "Stock Market Volatility",
  "Cryptocurrency Regulation",
  "Real Estate Investment",
  "Inflation Impact",
  "Tech Stock Analysis",
  "Banking Sector Updates",
  "Economic Indicators"
];

export default SearchTrendingNews;
