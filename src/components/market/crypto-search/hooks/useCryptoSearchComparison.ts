
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CryptoData } from '../types';
import { getCoinrankingData, searchCoin, getTrendingCoins } from '@/services/market/api/coinranking';
import { generateComparisonReport, logComparisonReport } from '@/services/market/api/apiComparison';

// Hook to test and compare both APIs
export const useCryptoSearchComparison = () => {
  const [selectedAPI, setSelectedAPI] = useState<'current' | 'coinranking'>('coinranking');
  const [searchQuery, setSearchQuery] = useState<string>('bitcoin');
  const [searchInput, setSearchInput] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<any>(null);

  // Test Coinranking API
  const { 
    data: coinrankingData, 
    isLoading: coinrankingLoading,
    isError: coinrankingError,
    refetch: refetchCoinranking
  } = useQuery({
    queryKey: ['coinranking-test', searchQuery],
    queryFn: async () => {
      console.log('Testing Coinranking API...');
      const result = await searchCoin(searchQuery);
      console.log('Coinranking result:', result);
      return result;
    },
    enabled: selectedAPI === 'coinranking' && !!searchQuery,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Get trending coins from Coinranking
  const { 
    data: trendingCoinranking = [], 
    isLoading: trendingLoading 
  } = useQuery({
    queryKey: ['coinranking-trending'],
    queryFn: getTrendingCoins,
    staleTime: 10 * 60 * 1000,
    retry: 1
  });

  // Log API comparison on mount
  useEffect(() => {
    logComparisonReport();
    setComparisonData(generateComparisonReport());
  }, []);

  // Test multiple coins to show API performance
  const { data: performanceTest } = useQuery({
    queryKey: ['coinranking-performance'],
    queryFn: async () => {
      console.log('Running performance test with multiple coins...');
      const testSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'DOT'];
      const startTime = Date.now();
      
      try {
        const results = await getCoinrankingData(testSymbols, 5);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`Performance test completed in ${duration}ms`);
        console.log(`Retrieved ${results.length} coins successfully`);
        
        return {
          success: true,
          duration,
          coinsRetrieved: results.length,
          coinsRequested: testSymbols.length,
          data: results
        };
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.error(`Performance test failed after ${duration}ms:`, error);
        return {
          success: false,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },
    staleTime: 15 * 60 * 1000,
    retry: 1
  });

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
    refetchCoinranking();
    toast.success("Refreshing cryptocurrency data");
  };

  const handleTrendingClick = (symbol: string) => {
    setSearchInput(symbol);
    setSearchQuery(symbol.toLowerCase());
  };

  const handleAPISwitch = (api: 'current' | 'coinranking') => {
    setSelectedAPI(api);
    toast.info(`Switched to ${api === 'current' ? 'Current Multi-Source' : 'Coinranking'} API`);
  };

  return {
    // State
    selectedAPI,
    searchInput,
    searchQuery,
    comparisonData,
    
    // Coinranking data
    coinrankingData,
    trendingCoinranking,
    performanceTest,
    
    // Loading states
    coinrankingLoading,
    trendingLoading,
    
    // Error states
    coinrankingError,
    
    // Actions
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleTrendingClick,
    handleAPISwitch,
  };
};
