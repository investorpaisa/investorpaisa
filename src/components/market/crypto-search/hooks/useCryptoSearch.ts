
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CryptoData } from '../types';
import { fetchMarketData } from '@/services/market/api';

// Function to fetch crypto data with better error handling
const fetchCryptoData = async (symbol: string): Promise<CryptoData | null> => {
  try {
    console.log(`Fetching crypto data for ${symbol}`);
    
    // Try CoinGecko first for comprehensive data
    try {
      const geckoResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );
      
      if (geckoResponse.ok) {
        const geckoData = await geckoResponse.json();
        console.log('CoinGecko response:', geckoData);
        
        return {
          symbol: geckoData.symbol.toUpperCase(),
          name: geckoData.name,
          price: geckoData.market_data.current_price.usd,
          marketCap: geckoData.market_data.market_cap.usd,
          volume24h: geckoData.market_data.total_volume.usd,
          change24h: geckoData.market_data.price_change_percentage_24h,
          sparkline: { 
            price: geckoData.market_data.sparkline_7d?.price || [] 
          }
        };
      }
    } catch (geckoError) {
      console.error('Error with CoinGecko, falling back to our API:', geckoError);
    }
    
    // If CoinGecko fails, use our proxy API
    console.log('Using proxy API for crypto data');
    const data = await fetchMarketData('crypto-rate', {
      from_currency: symbol.toUpperCase(),
      to_currency: 'USD'
    });
    
    console.log('Received data from proxy API:', data);
    
    if (data && !data.error) {
      // Create response in the expected format
      return {
        symbol: data.fromCurrency,
        name: data.fromCurrency, // We may not have the full name
        price: data.exchangeRate,
        marketCap: data.marketCap || 0,
        volume24h: data.volume24h || 0,
        change24h: data.change24h || 0,
        sparkline: { price: [] } // Will be populated separately
      };
    }
    
    throw new Error('Failed to fetch crypto data from all available sources');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    toast.error('Failed to fetch crypto data. Please try again.');
    return null;
  }
};

// Function to fetch trending cryptos
const fetchTrendingCryptos = async (): Promise<CryptoData[]> => {
  try {
    // Try CoinGecko first for trending data
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
    
    // Return fallback data
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: 67000, marketCap: 1300000000000, volume24h: 25000000000, change24h: 1.2, sparkline: { price: [] } },
      { symbol: 'ETH', name: 'Ethereum', price: 3500, marketCap: 420000000000, volume24h: 15000000000, change24h: 0.8, sparkline: { price: [] } },
      { symbol: 'BNB', name: 'Binance Coin', price: 600, marketCap: 93000000000, volume24h: 2000000000, change24h: -0.5, sparkline: { price: [] } },
      { symbol: 'SOL', name: 'Solana', price: 170, marketCap: 72000000000, volume24h: 3000000000, change24h: 2.5, sparkline: { price: [] } },
      { symbol: 'XRP', name: 'XRP', price: 0.5, marketCap: 27000000000, volume24h: 1000000000, change24h: -1.0, sparkline: { price: [] } }
    ];
  }
};

// Function to fetch chart data with better error handling
const fetchChartData = async (symbol: string): Promise<number[]> => {
  try {
    console.log(`Fetching chart data for ${symbol}`);
    
    // Try CoinGecko first for chart data
    try {
      const geckoResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=7&interval=daily`
      );
      
      if (geckoResponse.ok) {
        const chartData = await geckoResponse.json();
        console.log('CoinGecko chart data:', chartData);
        return chartData.prices.map((price: any) => price[1]);
      }
    } catch (geckoError) {
      console.error('Error with CoinGecko chart data, falling back to our API:', geckoError);
    }
    
    // If CoinGecko fails, try our proxy API
    const data = await fetchMarketData('crypto-timeseries', {
      symbol: symbol.toUpperCase(),
      market: 'USD',
      function: 'DIGITAL_CURRENCY_DAILY'
    });
    
    if (data && data.prices && data.prices.length > 0) {
      console.log('Received chart data from proxy API:', data);
      return data.prices.map((p: any) => p.price);
    }
    
    throw new Error('Failed to fetch chart data from all available sources');
  } catch (error) {
    console.error('Error fetching chart data:', error);
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
    retry: 2,
    meta: {
      errorMessage: 'Failed to fetch crypto data. Please try again later.'
    },
    onError: (error: Error) => {
      console.error('Error in crypto data query:', error);
      toast.error('Failed to fetch crypto data. Please try again later.');
    }
  });

  // Query for trending cryptos
  const { 
    data: trendingCryptos = [], 
    isLoading: isTrendingLoading 
  } = useQuery({
    queryKey: ['trending-cryptos'],
    queryFn: fetchTrendingCryptos,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    onError: (error: Error) => {
      console.error('Error in trending cryptos query:', error);
    }
  });
  
  // Query for chart data
  const { data: sparklineData = [] } = useQuery({
    queryKey: ['crypto-chart', searchQuery],
    queryFn: () => fetchChartData(searchQuery),
    enabled: !!searchQuery && !!cryptoData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Prepare chart data
  const chartData = sparklineData.map((price, index) => ({
    time: index,
    price
  }));

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
    cryptoData: cryptoData ? {
      ...cryptoData,
      sparkline: { price: sparklineData }
    } : null,
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
