
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, TrendingUp, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CryptoData } from './types';

interface CryptoSearchFormProps {
  searchInput: string;
  loading: boolean;
  trendingCryptos: CryptoData[];
  isTrendingLoading: boolean;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
  onTrendingClick: (symbol: string) => void;
}

export const CryptoSearchForm: React.FC<CryptoSearchFormProps> = ({
  searchInput,
  loading,
  trendingCryptos,
  isTrendingLoading,
  onSearchInputChange,
  onSearch,
  onRefresh,
  onTrendingClick,
}) => {
  return (
    <>
      <form onSubmit={onSearch} className="flex gap-2">
        <Input
          placeholder="Enter cryptocurrency (e.g. bitcoin, ethereum)"
          value={searchInput}
          onChange={onSearchInputChange}
          className="flex-1"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button type="button" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </form>

      {/* Trending section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          Trending Cryptocurrencies
        </h3>
        <div className="flex flex-wrap gap-2">
          {isTrendingLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))
          ) : (
            trendingCryptos.slice(0, 5).map((crypto) => (
              <Button 
                key={crypto.symbol} 
                variant="outline" 
                size="sm"
                onClick={() => onTrendingClick(crypto.name.toLowerCase())}
              >
                {crypto.symbol}
              </Button>
            ))
          )}
        </div>
      </div>
    </>
  );
};
