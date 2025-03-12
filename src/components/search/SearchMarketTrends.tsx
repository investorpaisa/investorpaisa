
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketTrend {
  id: string;
  name: string;
  value: string;
  change: string;
  status: 'up' | 'down';
}

interface SearchMarketTrendsProps {
  markets: MarketTrend[];
}

const SearchMarketTrends = ({ markets }: SearchMarketTrendsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-black flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-gold" />
          Market Trends
        </h3>
        <Button variant="ghost" size="sm" className="text-gold text-xs">See All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {markets.map((market) => (
          <div key={market.id} className="p-3 border border-black/10 rounded-md hover:bg-black/5 cursor-pointer flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{market.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm">{market.value}</span>
                <span className={`text-xs ${market.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {market.change}
                </span>
              </div>
            </div>
            <div className="h-8 w-16 flex items-end justify-end">
              {/* Simple chart indication */}
              <div className={`h-1 w-full rounded-full ${market.status === 'up' ? 'bg-green-600' : 'bg-red-600'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMarketTrends;
