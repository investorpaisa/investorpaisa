
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Search,
  RefreshCw,
  Globe,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveCoinWatchResearch } from './hooks/useLiveCoinWatchResearch';

export const LiveCoinWatchResearch: React.FC = () => {
  const {
    searchInput,
    searchQuery,
    selectedTimeframe,
    sortBy,
    sortOrder,
    coinData,
    topCryptos,
    marketOverview,
    exchanges,
    chartData,
    performanceTest,
    coinLoading,
    topCryptosLoading,
    overviewLoading,
    exchangesLoading,
    historyLoading,
    coinError,
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleCoinClick,
    handleTimeframeChange,
    handleSortChange,
  } = useLiveCoinWatchResearch();

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            LiveCoinWatch Crypto Research Platform
            <Badge variant="secondary">16k requests/month</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter cryptocurrency symbol (e.g., BTC, ETH)"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="flex-1"
              />
              <Button type="submit" disabled={coinLoading}>
                <Search className="h-4 w-4 mr-2" />
                Research
              </Button>
              <Button onClick={handleRefresh} variant="outline" disabled={coinLoading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex flex-wrap gap-4">
              <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [sort, order] = value.split('-');
                handleSortChange(sort, order);
              }}>
                <SelectTrigger className="w-48">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank-ascending">Rank (Low to High)</SelectItem>
                  <SelectItem value="rate-descending">Price (High to Low)</SelectItem>
                  <SelectItem value="cap-descending">Market Cap (High to Low)</SelectItem>
                  <SelectItem value="volume-descending">Volume (High to Low)</SelectItem>
                  <SelectItem value="delta.day-descending">24h Change (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid grid-cols-5 h-auto mb-4">
          <TabsTrigger value="research" className="py-2">🔍 Coin Research</TabsTrigger>
          <TabsTrigger value="market" className="py-2">📊 Market Overview</TabsTrigger>
          <TabsTrigger value="top-coins" className="py-2">🏆 Top Coins</TabsTrigger>
          <TabsTrigger value="exchanges" className="py-2">🏪 Exchanges</TabsTrigger>
          <TabsTrigger value="performance" className="py-2">⚡ API Test</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="mt-4">
          {/* Individual Coin Research */}
          {coinLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Researching {searchQuery}...</p>
              </CardContent>
            </Card>
          )}
          
          {coinError && (
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-500">Failed to research {searchQuery}. Please try again.</p>
              </CardContent>
            </Card>
          )}
          
          {coinData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {coinData.iconUrl && (
                      <img src={coinData.iconUrl} alt={coinData.symbol} className="w-8 h-8" />
                    )}
                    {coinData.name} ({coinData.symbol})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold">${coinData.price?.toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {coinData.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-medium ${coinData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coinData.change24h >= 0 ? '+' : ''}{coinData.change24h?.toFixed(2)}% (24h)
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {coinData.change1h !== undefined && (
                        <div>
                          <p className="text-muted-foreground">1h Change</p>
                          <p className={`font-medium ${coinData.change1h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coinData.change1h >= 0 ? '+' : ''}{coinData.change1h?.toFixed(2)}%
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">7d Change</p>
                        <p className={`font-medium ${coinData.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change7d >= 0 ? '+' : ''}{coinData.change7d?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">30d Change</p>
                        <p className={`font-medium ${coinData.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change30d >= 0 ? '+' : ''}{coinData.change30d?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">1y Change</p>
                        <p className={`font-medium ${coinData.change1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change1y >= 0 ? '+' : ''}{coinData.change1y?.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Cap</p>
                        <p className="font-medium">${(coinData.marketCap / 1e9)?.toFixed(1)}B</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">24h Volume</p>
                        <p className="font-medium">${(coinData.volume24h / 1e6)?.toFixed(1)}M</p>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="w-full justify-center">
                      ✅ Live data from {coinData.source}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Price Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Chart ({selectedTimeframe})</CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Clock className="h-8 w-8 animate-spin" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#3b82f6" 
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No historical data available for {selectedTimeframe}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="market" className="mt-4">
          {/* Market Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Global Cryptocurrency Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2">Loading market overview...</p>
                </div>
              ) : marketOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Total Market Cap</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(marketOverview.cap / 1e12)?.toFixed(2)}T
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">24h Volume</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${(marketOverview.volume / 1e9)?.toFixed(1)}B
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Total Coins</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {marketOverview.coins?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">BTC Dominance</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {marketOverview.btcDominance?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Market overview data unavailable
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-coins" className="mt-4">
          {/* Top Cryptocurrencies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent>
              {topCryptosLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2">Loading top cryptocurrencies...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {topCryptos.slice(0, 20).map((coin: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCoinClick(coin.symbol)}
                    >
                      <div className="flex items-center gap-3">
                        {coin.iconUrl && (
                          <img src={coin.iconUrl} alt={coin.symbol} className="w-8 h-8" />
                        )}
                        <div>
                          <div className="font-medium">{coin.symbol}</div>
                          <div className="text-sm text-muted-foreground">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${coin.price?.toLocaleString()}</div>
                        <div className={`text-sm ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="mt-4">
          {/* Exchange Data */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cryptocurrency Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              {exchangesLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2">Loading exchange data...</p>
                </div>
              ) : exchanges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exchanges.slice(0, 10).map((exchange: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        {exchange.png64 && (
                          <img src={exchange.png64} alt={exchange.name} className="w-8 h-8" />
                        )}
                        <div>
                          <div className="font-medium">{exchange.name}</div>
                          <div className="text-sm text-muted-foreground">
                            24h Volume: ${(exchange.volume / 1e9)?.toFixed(2)}B
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Exchange data unavailable
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {/* API Performance Test */}
          <Card>
            <CardHeader>
              <CardTitle>LiveCoinWatch API Performance Test</CardTitle>
            </CardHeader>
            <CardContent>
              {performanceTest ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {performanceTest.success ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <span className="text-lg font-medium">
                      {performanceTest.success ? 'Performance Test Passed' : 'Performance Test Failed'}
                    </span>
                    <Badge variant="outline">{performanceTest.apiName}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Response Time</div>
                      <div className="text-xl font-bold text-blue-600">{performanceTest.duration}ms</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                      <div className="text-xl font-bold text-green-600">
                        {performanceTest.success ? '100%' : '0%'}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Coins Retrieved</div>
                      <div className="text-xl font-bold text-purple-600">
                        {performanceTest.coinsRetrieved || 0}/{performanceTest.coinsRequested || 0}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Data Quality</div>
                      <div className="text-xl font-bold text-orange-600">Excellent</div>
                    </div>
                  </div>
                  
                  {performanceTest.success && performanceTest.data && (
                    <div>
                      <h4 className="font-medium mb-2">Sample Retrieved Data:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {performanceTest.data.slice(0, 4).map((coin: any, index: number) => (
                          <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{coin.symbol}</span>
                            <span>${coin.price?.toFixed(2)}</span>
                            <span className={coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!performanceTest.success && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-red-700 font-medium">Error Details:</p>
                      <p className="text-red-600 text-sm">{performanceTest.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2">Running performance test...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
