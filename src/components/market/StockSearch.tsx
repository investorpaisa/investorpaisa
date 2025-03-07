import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockQuote, searchStocks, getStockQuote } from '@/services/market';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';

interface StockSearchProps {
  onSelectStock: (stock: StockQuote) => void;
}

export const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchStocks(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Stock search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStock = async (symbol: string) => {
    setIsLoading(true);
    try {
      const stock = await getStockQuote(symbol);
      if (stock) {
        onSelectStock(stock);
      } else {
        console.error("Stock quote not found for symbol:", symbol);
      }
    } catch (error) {
      console.error("Failed to fetch stock quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Search</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by symbol"
          />
          <Button variant="outline" className="col-span-1" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : <SearchIcon className="mr-2 h-4 w-4" />}
            {isLoading ? "" : "Search"}
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="grid gap-2">
            {searchResults.map((stock) => (
              <Button
                key={stock.symbol}
                variant="ghost"
                className="justify-start"
                onClick={() => handleSelectStock(stock.symbol)}
                disabled={isLoading}
              >
                {stock.name} ({stock.symbol})
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
