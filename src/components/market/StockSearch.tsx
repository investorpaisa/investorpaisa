
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { searchStocks, getStockQuote } from '@/services/market/marketService';
import { StockQuote } from '@/services/messages/types';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

const StockSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [symbol, setSymbol] = useState<string | null>(null);

  const { data: searchResults, isLoading: isSearching, refetch: refetchSearch } = useQuery({
    queryKey: ['stockSearch', searchInput],
    queryFn: () => searchStocks(searchInput),
    enabled: false,
  });

  const { data: stockQuote, isLoading: isLoadingQuote } = useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => getStockQuote(symbol!),
    enabled: !!symbol,
    refetchInterval: 60000, // Refresh every minute when a stock is selected
  });

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error('Please enter a stock name or symbol');
      return;
    }
    
    refetchSearch();
  };

  const handleSelectStock = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setSearchInput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search for a stock..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-premium-dark-800/50"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          variant="outline" 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-premium-dark-800/60 hover:bg-premium-dark-700/80"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isSearching && (
        <div className="space-y-2 mt-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {searchResults && searchResults.length > 0 && searchInput && !symbol && (
        <div className="border border-premium-dark-700/20 rounded-md overflow-hidden">
          {searchResults.map((result) => (
            <div 
              key={result.symbol}
              className="p-3 border-b border-premium-dark-700/20 hover:bg-premium-dark-700/30 cursor-pointer transition-colors last:border-b-0"
              onClick={() => handleSelectStock(result.symbol)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{result.symbol}</div>
                  <div className="text-xs text-muted-foreground">{result.companyName}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{result.lastPrice.toLocaleString('en-IN')}</div>
                  <div className={`flex items-center text-xs ${result.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {result.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {result.pChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults && searchResults.length === 0 && searchInput && (
        <div className="text-center py-4 text-muted-foreground">
          No stocks found for "{searchInput}"
        </div>
      )}

      {isLoadingQuote && symbol && (
        <Card className="mt-4 bg-premium-dark-800/60 backdrop-blur-md">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-24 mb-4" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stockQuote && (
        <Card className="mt-4 bg-premium-dark-800/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{stockQuote.symbol}</h3>
                <p className="text-sm text-muted-foreground">{stockQuote.companyName}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSymbol(null)}
                className="text-xs hover:bg-premium-dark-700/50"
              >
                Close
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold mb-1">₹{stockQuote.lastPrice.toLocaleString('en-IN')}</div>
              <div className={`flex items-center text-sm ${stockQuote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stockQuote.change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                {stockQuote.change.toFixed(2)} ({stockQuote.pChange.toFixed(2)}%)
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open</span>
                <span>₹{stockQuote.open.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prev Close</span>
                <span>₹{stockQuote.previousClose.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High</span>
                <span>₹{stockQuote.high.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low</span>
                <span>₹{stockQuote.low.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span>{stockQuote.volume.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
