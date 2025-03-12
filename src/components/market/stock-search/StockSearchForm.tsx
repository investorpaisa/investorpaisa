
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, TrendingUp } from 'lucide-react';

// Popular stocks to show by default
const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOG', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' }
];

interface StockSearchFormProps {
  symbol: string;
  searchQuery: string;
  recentSearches: string[];
  loading: boolean;
  searchResults: any[];
  onSymbolChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onGetQuote: () => void;
  onSelectStock: (stockSymbol: string) => void;
}

export const StockSearchForm: React.FC<StockSearchFormProps> = ({
  symbol,
  searchQuery,
  recentSearches,
  loading,
  searchResults,
  onSymbolChange,
  onSearchQueryChange,
  onSearch,
  onGetQuote,
  onSelectStock
}) => {
  return (
    <CardContent>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={onSymbolChange}
          className="uppercase"
        />
        <Button onClick={onGetQuote} disabled={loading}>
          {loading ? "Loading..." : "Get Quote"}
        </Button>
      </div>
      
      {/* Search for stocks */}
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search for stocks by name or symbol"
          value={searchQuery}
          onChange={onSearchQueryChange}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button onClick={onSearch} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Recent and Popular Searches */}
      <div className="mb-4">
        {recentSearches.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(s => (
                <Badge 
                  key={s} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => onSelectStock(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-1 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular Stocks
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map(stock => (
              <Badge 
                key={stock.symbol} 
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
                onClick={() => onSelectStock(stock.symbol)}
              >
                {stock.symbol}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border rounded-md p-3 mb-4">
          <h4 className="text-sm font-medium mb-2">Search Results</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((result: any) => (
              <div 
                key={result.symbol} 
                className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => onSelectStock(result.symbol)}
              >
                <div>
                  <p className="font-medium">{result.symbol}</p>
                  <p className="text-xs text-muted-foreground">{result.name}</p>
                </div>
                <Badge variant="outline">View</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  );
};
