
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getStockQuote, searchStocks, StockQuote } from '@/services/market';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, RefreshCw, TrendingUp, Search, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockSearchProps {
  // No props needed
}

const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

export const StockSearch: React.FC<StockSearchProps> = () => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<StockQuote | null>(null);
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

      // Generate historical data based on time range
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

  const calculateCAGR = () => {
    if (chartData.length < 2) return 'N/A';
    
    const initialPrice = parseFloat(chartData[0].price);
    const finalPrice = parseFloat(chartData[chartData.length - 1].price);
    
    // Time periods in years for different ranges
    const periods = {
      '1D': 1/365,
      '1W': 7/365,
      '1M': 1/12,
      '3M': 3/12,
      '6M': 6/12,
      '1Y': 1,
      '5Y': 5,
      'MAX': 10
    }[timeRange] || 1;
    
    const cagr = (Math.pow(finalPrice / initialPrice, 1 / periods) - 1) * 100;
    return cagr.toFixed(2) + '%';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Stock Search</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleGetQuote(symbol)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={handleSymbolChange}
              className="uppercase"
            />
            <Button onClick={() => handleGetQuote()} disabled={loading}>
              {loading ? "Loading..." : "Get Quote"}
            </Button>
          </div>
          
          {/* Search for stocks */}
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search for stocks by name or symbol"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Recent and Popular Searches */}
          <div className="mb-4">
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(s => (
                    <Badge 
                      key={s} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleGetQuote(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular Stocks
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularStocks.map(stock => (
                  <Badge 
                    key={stock.symbol} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleGetQuote(stock.symbol)}
                  >
                    {stock.symbol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-md p-3 mb-4">
              <h4 className="text-sm font-medium mb-2">Search Results</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((result: any) => (
                  <div 
                    key={result.symbol} 
                    className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleGetQuote(result.symbol)}
                  >
                    <div>
                      <p className="font-medium">{result.symbol}</p>
                      <p className="text-xs text-muted-foreground">{result.name}</p>
                    </div>
                    <Badge variant="outline">View</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Stock Quote and Chart */}
      {stockData && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{stockData.companyName}</CardTitle>
                <p className="text-sm text-muted-foreground">{stockData.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${stockData.lastPrice.toFixed(2)}</p>
                <div className={`flex items-center justify-end text-sm ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stockData.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{stockData.change.toFixed(2)}</span>
                  <span className="ml-1">({stockData.pChange.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Time range selector for chart */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <Tabs value={timeRange} onValueChange={handleTimeRangeChange}>
                  <TabsList className="gap-1">
                    {timeRanges.map(range => (
                      <TabsTrigger key={range} value={range} className="text-xs px-2">
                        {range}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">CAGR: <span className="font-medium">{calculateCAGR()}</span></p>
              </div>
            </div>
            
            {/* Stock Chart */}
            {chartData.length > 0 && (
              <div className="h-60 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        if (timeRange === '1D') return value.split(',')[1]?.trim().substring(0, 5) || value;
                        if (['1W', '1M'].includes(timeRange)) return value.split('/')[1] || value;
                        return value;
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Price']}
                      labelFormatter={(label) => timeRange === '1D' ? `${label}` : `Date: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Stock Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-3 border rounded-md">
                <p className="text-xs text-muted-foreground">Open</p>
                <p className="font-medium">${stockData.open.toFixed(2)}</p>
              </div>
              <div className="p-3 border rounded-md">
                <p className="text-xs text-muted-foreground">Prev Close</p>
                <p className="font-medium">${stockData.previousClose.toFixed(2)}</p>
              </div>
              <div className="p-3 border rounded-md">
                <p className="text-xs text-muted-foreground">High</p>
                <p className="font-medium">${stockData.high.toFixed(2)}</p>
              </div>
              <div className="p-3 border rounded-md">
                <p className="text-xs text-muted-foreground">Low</p>
                <p className="font-medium">${stockData.low.toFixed(2)}</p>
              </div>
            </div>
            
            {/* News and Related Stocks would go here */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Related News</h3>
              <p className="text-sm text-muted-foreground">News integration coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
