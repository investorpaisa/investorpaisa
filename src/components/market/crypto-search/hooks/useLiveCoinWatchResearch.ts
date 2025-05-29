
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getLiveCoinWatchData, 
  getLiveCoinWatchCoin, 
  getLiveCoinWatchHistory,
  getLiveCoinWatchOverview,
  getLiveCoinWatchExchanges
} from '@/services/market/api/livecoinwatch';

export const useLiveCoinWatchResearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>('BTC');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [sortOrder, setSortOrder] = useState<string>('ascending');

  // Get specific coin data
  const { 
    data: coinData, 
    isLoading: coinLoading,
    isError: coinError,
    refetch: refetchCoin
  } = useQuery({
    queryKey: ['livecoinwatch-coin', searchQuery],
    queryFn: () => getLiveCoinWatchCoin(searchQuery),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Get top cryptocurrencies with advanced sorting
  const { 
    data: topCryptos = [], 
    isLoading: topCryptosLoading,
    refetch: refetchTopCryptos
  } = useQuery({
    queryKey: ['livecoinwatch-top', sortBy, sortOrder],
    queryFn: () => getLiveCoinWatchData(undefined, 50, sortBy, sortOrder),
    staleTime: 10 * 60 * 1000,
    retry: 2
  });

  // Get market overview
  const { 
    data: marketOverview,
    isLoading: overviewLoading
  } = useQuery({
    queryKey: ['livecoinwatch-overview'],
    queryFn: getLiveCoinWatchOverview,
    staleTime: 15 * 60 * 1000,
    retry: 1
  });

  // Get exchange data
  const { 
    data: exchanges = [],
    isLoading: exchangesLoading
  } = useQuery({
    queryKey: ['livecoinwatch-exchanges'],
    queryFn: getLiveCoinWatchExchanges,
    staleTime: 30 * 60 * 1000,
    retry: 1
  });

  // Get historical data for selected coin
  const { 
    data: historicalData = [],
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['livecoinwatch-history', searchQuery, selectedTimeframe],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const now = Date.now();
      let start: number;
      
      switch (selectedTimeframe) {
        case '1d':
          start = now - (24 * 60 * 60 * 1000);
          break;
        case '7d':
          start = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = now - (30 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          start = now - (365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = now - (7 * 24 * 60 * 60 * 1000);
      }
      
      return getLiveCoinWatchHistory(searchQuery, start, now);
    },
    enabled: !!searchQuery,
    staleTime: 15 * 60 * 1000,
    retry: 1
  });

  // Performance test with multiple coins
  const { data: performanceTest } = useQuery({
    queryKey: ['livecoinwatch-performance'],
    queryFn: async () => {
      console.log('Running LiveCoinWatch performance test...');
      const testSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX'];
      const startTime = Date.now();
      
      try {
        const results = await getLiveCoinWatchData(testSymbols, 8);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`LiveCoinWatch performance test completed in ${duration}ms`);
        console.log(`Retrieved ${results.length} coins successfully`);
        
        return {
          success: true,
          duration,
          coinsRetrieved: results.length,
          coinsRequested: testSymbols.length,
          data: results,
          apiName: 'LiveCoinWatch'
        };
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.error(`LiveCoinWatch performance test failed after ${duration}ms:`, error);
        return {
          success: false,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error',
          apiName: 'LiveCoinWatch'
        };
      }
    },
    staleTime: 15 * 60 * 1000,
    retry: 1
  });

  // Prepare chart data from historical data
  const chartData = historicalData.map((point: number[], index: number) => ({
    time: point[0] || index,
    price: point[1] || 0,
    timestamp: new Date(point[0] || Date.now()).toLocaleDateString()
  }));

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim().toUpperCase());
    }
  };

  const handleRefresh = () => {
    refetchCoin();
    refetchTopCryptos();
    toast.success("Refreshing LiveCoinWatch data");
  };

  const handleCoinClick = (symbol: string) => {
    setSearchInput(symbol);
    setSearchQuery(symbol.toUpperCase());
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleSortChange = (sort: string, order: string) => {
    setSortBy(sort);
    setSortOrder(order);
  };

  return {
    // State
    searchInput,
    searchQuery,
    selectedTimeframe,
    sortBy,
    sortOrder,
    
    // Data
    coinData,
    topCryptos,
    marketOverview,
    exchanges,
    historicalData,
    chartData,
    performanceTest,
    
    // Loading states
    coinLoading,
    topCryptosLoading,
    overviewLoading,
    exchangesLoading,
    historyLoading,
    
    // Error states
    coinError,
    
    // Actions
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleCoinClick,
    handleTimeframeChange,
    handleSortChange,
  };
};
