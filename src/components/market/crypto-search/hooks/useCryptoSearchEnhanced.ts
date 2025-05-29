
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CryptoData } from '../types';
import { getCoinrankingData, searchCoin, getTrendingCoins } from '@/services/market/api/coinranking';

// Enhanced crypto search hook with Coinranking integration
export const useCryptoSearchEnhanced = () => {
  const [searchQuery, setSearchQuery] = useState<string>('bitcoin');
  const [searchInput, setSearchInput] = useState<string>('');
  const [useNewAPI, setUseNewAPI] = useState<boolean>(true); // Default to new API

  // Query for specific crypto data using Coinranking
  const { 
    data: cryptoData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['crypto-enhanced', searchQuery, useNewAPI],
    queryFn: async () => {
      if (useNewAPI) {
        console.log(`Fetching crypto data for ${searchQuery} using Coinranking API`);
        const result = await searchCoin(searchQuery);
        return result;
      } else {
        // Fallback to existing implementation would go here
        throw new Error('Legacy API not implemented in this hook');
      }
    },
    enabled: !!searchQuery,
    staleTime: 2 * 60 * 1000, // 2 minutes cache for real-time feel
    retry: 2,
    meta: {
      errorMessage: 'Failed to fetch crypto data. Please try again later.'
    }
  });

  // Query for trending cryptos using Coinranking
  const { 
    data: trendingCryptos = [], 
    isLoading: isTrendingLoading 
  } = useQuery({
    queryKey: ['trending-cryptos-enhanced'],
    queryFn: getTrendingCoins,
    staleTime: 10 * 60 * 1000, // 10 minutes for trending
    retry: 1
  });
  
  // Get multiple popular coins for better chart data
  const { data: popularCoins = [] } = useQuery({
    queryKey: ['popular-cryptos'],
    queryFn: () => getCoinrankingData(['BTC', 'ETH', 'BNB', 'ADA', 'SOL'], 5),
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Prepare chart data (simplified for now)
  const chartData = cryptoData?.sparkline?.price?.map((price: number, index: number) => ({
    time: index,
    price
  })) || [];

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim().toLowerCase());
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing crypto data with live prices");
  };

  const handleTrendingClick = (symbol: string) => {
    setSearchInput(symbol);
    setSearchQuery(symbol.toLowerCase());
  };

  const toggleAPI = () => {
    setUseNewAPI(!useNewAPI);
    toast.info(`Switched to ${!useNewAPI ? 'Coinranking API (Live)' : 'Legacy API'}`);
  };

  return {
    searchInput,
    searchQuery,
    cryptoData,
    trendingCryptos,
    popularCoins,
    chartData,
    isLoading,
    isTrendingLoading,
    isError,
    useNewAPI,
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleTrendingClick,
    toggleAPI,
  };
};
