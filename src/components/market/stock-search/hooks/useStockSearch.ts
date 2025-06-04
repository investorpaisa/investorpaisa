import { useState, useEffect } from 'react';
import { getStockQuote, searchStocks } from '@/services/market';
import type { MarketData } from '@/services/market';
import { useToast } from '@/hooks/use-toast';

export function useStockSearch() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<MarketData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('1M');
  const [recentSearches, setRecentSearches] = useState<string[]>(['AAPL', 'MSFT', 'GOOG', 'AMZN']);
  const { toast } = useToast();

  // Popular stocks to show by default
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOG', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' }
  ];

  useEffect(() => {
    // Load initial stock data for a popular stock
    if (popularStocks.length > 0) {
      handleGetQuote(popularStocks[0].symbol);
    }
  }, []);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search Failed",
        description: "Unable to find stocks matching your query",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = async (stockSymbol: string = symbol) => {
    if (!stockSymbol) {
      toast({
        title: "Symbol Required",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const data = await getStockQuote(stockSymbol);
      setStockData(data);
      setSymbol(stockSymbol);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(stockSymbol)) {
        setRecentSearches(prev => [stockSymbol, ...prev.slice(0, 3)]);
      }

      // Generate historical data based on time range - use lastPrice
      generateChartData(stockSymbol, timeRange, data?.lastPrice || 0);
      
      toast({
        title: "Quote Retrieved",
        description: `Latest data for ${data?.companyName || stockSymbol} loaded`,
      });
    } catch (error) {
      console.error("Failed to fetch stock quote:", error);
      toast({
        title: "Quote Failed",
        description: "Unable to retrieve stock information",
        variant: "destructive"
      });
      setStockData(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (stockSymbol: string, range: string, currentPrice: number) => {
    // Number of data points for different ranges
    const dataPoints = {
      '1D': 24,  // hourly for a day
      '1W': 7,   // daily for a week
      '1M': 30,  // daily for a month
      '3M': 90,  // daily for 3 months
      '6M': 180, // daily for 6 months
      '1Y': 12,  // monthly for a year
      '5Y': 60,  // monthly for 5 years
      'MAX': 120 // monthly for 10 years
    }[range] || 30;
    
    // Volatility based on time range
    const volatility = {
      '1D': 0.005,
      '1W': 0.01,
      '1M': 0.03,
      '3M': 0.05,
      '6M': 0.08,
      '1Y': 0.15,
      '5Y': 0.25,
      'MAX': 0.4
    }[range] || 0.03;
    
    // Starting date based on range
    const startDate = new Date();
    switch (range) {
      case '1D': startDate.setDate(startDate.getDate() - 1); break;
      case '1W': startDate.setDate(startDate.getDate() - 7); break;
      case '1M': startDate.setMonth(startDate.getMonth() - 1); break;
      case '3M': startDate.setMonth(startDate.getMonth() - 3); break;
      case '6M': startDate.setMonth(startDate.getMonth() - 6); break;
      case '1Y': startDate.setFullYear(startDate.getFullYear() - 1); break;
      case '5Y': startDate.setFullYear(startDate.getFullYear() - 5); break;
      case 'MAX': startDate.setFullYear(startDate.getFullYear() - 10); break;
    }
    
    // Generate mock data
    const mockData = [];
    let lastPrice = currentPrice * 0.8; // Start 20% lower than current price for upward trend
    
    for (let i = 0; i < dataPoints; i++) {
      const pointDate = new Date(startDate);
      
      if (range === '1D') {
        pointDate.setHours(pointDate.getHours() + i);
      } else if (['1W', '1M', '3M', '6M'].includes(range)) {
        pointDate.setDate(pointDate.getDate() + i);
      } else {
        pointDate.setMonth(pointDate.getMonth() + i);
      }
      
      // Random price movement with trend toward current price
      const randomChange = (Math.random() - 0.45) * volatility * lastPrice;
      const targetDiff = (currentPrice - lastPrice) / (dataPoints - i);
      lastPrice = lastPrice + randomChange + targetDiff;
      
      mockData.push({
        date: pointDate.toLocaleDateString(),
        time: range === '1D' ? pointDate.toLocaleTimeString() : undefined,
        price: lastPrice.toFixed(2),
      });
    }
    
    setChartData(mockData);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    if (stockData) {
      generateChartData(symbol, range, stockData.lastPrice);
    }
  };

  return {
    symbol,
    stockData,
    searchQuery,
    searchResults,
    chartData,
    loading,
    timeRange,
    recentSearches,
    handleSymbolChange,
    handleSearchQueryChange,
    handleSearch,
    handleGetQuote,
    handleTimeRangeChange,
  };
}
