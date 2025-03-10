
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon, TrendingUp, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  sparkline: { price: number[] };
}

// Function to fetch crypto data
const fetchCryptoData = async (symbol: string): Promise<CryptoData | null> => {
  try {
    // Use CoinGecko API for crypto data
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    
    return {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      price: data.market_data.current_price.usd,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      change24h: data.market_data.price_change_percentage_24h,
      sparkline: { 
        price: data.market_data.sparkline_7d?.price || [] 
      }
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
};

// Function to fetch trending cryptos
const fetchTrendingCryptos = async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending cryptos');
    }
    
    const data = await response.json();
    
    return data.coins.map((coin: any) => ({
      symbol: coin.item.symbol.toUpperCase(),
      name: coin.item.name,
      price: coin.item.price_btc * 40000, // Rough estimation using BTC price
      marketCap: 0,
      volume24h: 0,
      change24h: 0,
      sparkline: { price: [] }
    }));
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
    return [];
  }
};

const CryptoSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('bitcoin');
  const [searchInput, setSearchInput] = useState<string>('');

  // Query for specific crypto data
  const { data: cryptoData, isLoading, isError, refetch } = useQuery({
    queryKey: ['crypto', searchQuery],
    queryFn: () => fetchCryptoData(searchQuery),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for trending cryptos
  const { data: trendingCryptos = [], isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending-cryptos'],
    queryFn: fetchTrendingCryptos,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing crypto data");
  };

  const handleTrendingClick = (symbol: string) => {
    setSearchInput(symbol);
    setSearchQuery(symbol);
  };

  // Prepare chart data
  const chartData = cryptoData?.sparkline?.price.map((price, index) => ({
    time: index,
    price
  })) || [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Enter cryptocurrency (e.g. bitcoin, ethereum)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button type="button" variant="outline" onClick={handleRefresh}>
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
                onClick={() => handleTrendingClick(crypto.name.toLowerCase())}
              >
                {crypto.symbol}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Crypto data display */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Failed to load crypto data. Please try again.</p>
          </CardContent>
        </Card>
      ) : cryptoData ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{cryptoData.name} ({cryptoData.symbol})</h2>
                <div className="flex items-center mt-1">
                  <span className="text-xl">${cryptoData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`ml-2 ${cryptoData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
              </div>
            </div>
            
            {/* Price chart */}
            <div className="h-48 my-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={false}
                      label={{ value: 'Time (days)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      width={60}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      labelFormatter={(label) => `Day ${Math.floor(label / 24)}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#8884d8" 
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No historical data available
                </div>
              )}
            </div>
            
            {/* Market stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-medium">${cryptoData.marketCap.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="font-medium">${cryptoData.volume24h.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default CryptoSearch;
