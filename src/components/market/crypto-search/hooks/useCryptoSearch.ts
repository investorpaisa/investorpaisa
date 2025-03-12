
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CryptoData } from '../types';

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

export const useCryptoSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('bitcoin');
  const [searchInput, setSearchInput] = useState<string>('');

  // Query for specific crypto data
  const { 
    data: cryptoData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['crypto', searchQuery],
    queryFn: () => fetchCryptoData(searchQuery),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for trending cryptos
  const { 
    data: trendingCryptos = [], 
    isLoading: isTrendingLoading 
  } = useQuery({
    queryKey: ['trending-cryptos'],
    queryFn: fetchTrendingCryptos,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Prepare chart data
  const chartData = cryptoData?.sparkline?.price.map((price, index) => ({
    time: index,
    price
  })) || [];

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

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

  return {
    searchInput,
    searchQuery,
    cryptoData,
    trendingCryptos,
    chartData,
    isLoading,
    isTrendingLoading,
    isError,
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleTrendingClick,
  };
};
