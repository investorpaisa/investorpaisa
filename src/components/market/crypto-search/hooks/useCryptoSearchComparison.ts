
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCoinrankingData, searchCoin } from '@/services/market/api/coinranking';

// Add livecoinwatch to the API selection type
type APISelection = 'current' | 'coinranking' | 'livecoinwatch';

export const useCryptoSearchComparison = () => {
  const [selectedAPI, setSelectedAPI] = useState<APISelection>('livecoinwatch');
  const [searchQuery, setSearchQuery] = useState<string>('BTC');

  // Coinranking API test
  const { 
    data: coinrankingData, 
    isLoading: coinrankingLoading,
    isError: coinrankingError,
    refetch: refetchCoinranking
  } = useQuery({
    queryKey: ['coinranking-test', searchQuery],
    queryFn: () => searchCoin(searchQuery),
    enabled: selectedAPI === 'coinranking',
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Get trending cryptocurrencies from Coinranking
  const { data: trendingCoinranking = [] } = useQuery({
    queryKey: ['coinranking-trending'],
    queryFn: () => getCoinrankingData(['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT'], 10),
    enabled: selectedAPI === 'coinranking',
    staleTime: 10 * 60 * 1000,
    retry: 1
  });

  // Performance test for multiple APIs
  const { data: performanceTest, refetch: refetchPerformanceTest } = useQuery({
    queryKey: ['api-performance-test'],
    queryFn: async () => {
      console.log('Running API performance comparison test...');
      const testSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL'];
      const startTime = Date.now();
      
      try {
        const results = await getCoinrankingData(testSymbols, 5);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`Coinranking API test completed in ${duration}ms`);
        console.log(`Retrieved ${results.length} coins successfully`);
        
        return {
          success: true,
          duration,
          coinsRetrieved: results.length,
          coinsRequested: testSymbols.length,
          data: results,
          apiName: 'Coinranking'
        };
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.error(`Coinranking API test failed after ${duration}ms:`, error);
        return {
          success: false,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error',
          apiName: 'Coinranking'
        };
      }
    },
    enabled: false, // Only run when manually triggered
    retry: 1
  });

  // Get comparison data for different APIs
  const comparisonData = {
    current: {
      name: 'Current Multi-Source',
      monthlyLimit: 1000,
      dataQuality: 'Poor',
      realTime: false,
      reliability: 'Low'
    },
    coinranking: {
      name: 'Coinranking API',
      monthlyLimit: 10000,
      dataQuality: 'High',
      realTime: true,
      reliability: 'High'
    },
    livecoinwatch: {
      name: 'LiveCoinWatch API',
      monthlyLimit: 16000,
      dataQuality: 'Excellent',
      realTime: true,
      reliability: 'Excellent'
    }
  };

  const handleAPISwitch = (api: APISelection) => {
    setSelectedAPI(api);
    toast.success(`Switched to ${api} API testing`);
  };

  const handleRefresh = () => {
    if (selectedAPI === 'coinranking') {
      refetchCoinranking();
    }
    refetchPerformanceTest();
    toast.success("Refreshing API comparison data");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toUpperCase());
  };

  return {
    selectedAPI,
    searchQuery,
    coinrankingData,
    trendingCoinranking,
    performanceTest,
    coinrankingLoading,
    coinrankingError,
    comparisonData,
    handleAPISwitch,
    handleRefresh,
    handleSearch
  };
};
