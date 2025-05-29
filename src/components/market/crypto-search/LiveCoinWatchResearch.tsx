
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Search,
  RefreshCw,
  Calendar,
  Loader
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
      {/* Professional Search Interface */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Cryptocurrency Research
          </CardTitle>
          <p className="text-sm text-gray-600">
            Professional-grade market data and analysis tools
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Search cryptocurrency (e.g., BTC, ETH, DOGE)"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="flex-1 h-11"
              />
              <Button type="submit" disabled={coinLoading} className="h-11 px-6">
                {coinLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Research
              </Button>
              <Button onClick={handleRefresh} variant="outline" disabled={coinLoading} className="h-11">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex gap-4">
              <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-36">
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
                  <SelectItem value="rank-ascending">Market Cap Rank</SelectItem>
                  <SelectItem value="rate-descending">Price (High to Low)</SelectItem>
                  <SelectItem value="cap-descending">Market Cap (High to Low)</SelectItem>
                  <SelectItem value="volume-descending">Volume (High to Low)</SelectItem>
                  <SelectItem value="delta.day-descending">24h Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid grid-cols-4 h-auto mb-6 bg-gray-50">
          <TabsTrigger value="research" className="py-3 font-medium">Individual Research</TabsTrigger>
          <TabsTrigger value="market" className="py-3 font-medium">Market Overview</TabsTrigger>
          <TabsTrigger value="top-coins" className="py-3 font-medium">Market Leaders</TabsTrigger>
          <TabsTrigger value="exchanges" className="py-3 font-medium">Exchange Data</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="mt-6">
          {/* Individual Coin Research */}
          {coinLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-3 text-gray-600">Analyzing {searchQuery}...</p>
              </CardContent>
            </Card>
          )}
          
          {coinError && (
            <Card className="border-red-200">
              <CardContent className="p-6 text-center">
                <div className="text-red-600 mb-2">Research Unavailable</div>
                <p className="text-gray-600">Unable to fetch data for {searchQuery}. Please try a different symbol.</p>
              </CardContent>
            </Card>
          )}
          
          {coinData && !coinLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {coinData.iconUrl && (
                      <img src={coinData.iconUrl} alt={coinData.symbol} className="w-10 h-10" />
                    )}
                    <div>
                      <div className="text-xl font-bold">{coinData.name}</div>
                      <div className="text-sm text-gray-500">{coinData.symbol}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ${coinData.price?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {coinData.change24h >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`text-lg font-semibold ${coinData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change24h >= 0 ? '+' : ''}{coinData.change24h?.toFixed(2)}%
                        </span>
                        <span className="text-gray-500">24h</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {coinData.change1h !== undefined && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">1 Hour</div>
                          <div className={`text-lg font-semibold ${coinData.change1h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coinData.change1h >= 0 ? '+' : ''}{coinData.change1h?.toFixed(2)}%
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">7 Days</div>
                        <div className={`text-lg font-semibold ${coinData.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change7d >= 0 ? '+' : ''}{coinData.change7d?.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">30 Days</div>
                        <div className={`text-lg font-semibold ${coinData.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change30d >= 0 ? '+' : ''}{coinData.change30d?.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">1 Year</div>
                        <div className={`text-lg font-semibold ${coinData.change1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coinData.change1y >= 0 ? '+' : ''}{coinData.change1y?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Market Cap</div>
                          <div className="text-lg font-semibold">${(coinData.marketCap / 1e9)?.toFixed(2)}B</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">24h Volume</div>
                          <div className="text-lg font-semibold">${(coinData.volume24h / 1e6)?.toFixed(1)}M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Professional Price Chart */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Price Analysis ({selectedTimeframe})</CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <Loader className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="timestamp" 
                            tick={{ fontSize: 12 }}
                            stroke="#666"
                          />
                          <YAxis 
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12 }}
                            stroke="#666"
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => `${label}`}
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#3b82f6" 
                            dot={false}
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Historical data unavailable for this timeframe</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          {/* Clean Market Overview */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Global Cryptocurrency Market</CardTitle>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="text-center py-12">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-3 text-gray-600">Loading market data...</p>
                </div>
              ) : marketOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-sm text-gray-600 mb-1">Total Market Cap</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(marketOverview.cap / 1e12)?.toFixed(2)}T
                    </div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <div className="text-sm text-gray-600 mb-1">24h Volume</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${(marketOverview.volume / 1e9)?.toFixed(1)}B
                    </div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Active Cryptocurrencies</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {marketOverview.coins?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-sm text-gray-600 mb-1">Bitcoin Dominance</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {marketOverview.btcDominance?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Market data temporarily unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-coins" className="mt-6">
          {/* Professional Top Cryptocurrencies */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Market Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              {topCryptosLoading ? (
                <div className="text-center py-12">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-3 text-gray-600">Loading market leaders...</p>
                </div>
              ) : topCryptos.length > 0 ? (
                <div className="space-y-3">
                  {topCryptos.slice(0, 20).map((coin: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleCoinClick(coin.symbol)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 w-8">#{index + 1}</div>
                        {coin.iconUrl && (
                          <img src={coin.iconUrl} alt={coin.symbol} className="w-10 h-10" />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{coin.symbol}</div>
                          <div className="text-sm text-gray-500">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${coin.price?.toLocaleString()}</div>
                        <div className={`text-sm font-medium ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Market data temporarily unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="mt-6">
          {/* Exchange Data */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Top Cryptocurrency Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              {exchangesLoading ? (
                <div className="text-center py-12">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-3 text-gray-600">Loading exchange data...</p>
                </div>
              ) : exchanges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exchanges.slice(0, 10).map((exchange: any, index: number) => (
                    <div key={index} className="p-6 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4 mb-3">
                        {exchange.png64 && (
                          <img src={exchange.png64} alt={exchange.name} className="w-12 h-12" />
                        )}
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{exchange.name}</div>
                          <div className="text-sm text-gray-500">Exchange</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        24h Volume: <span className="font-semibold">${(exchange.volume / 1e9)?.toFixed(2)}B</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Exchange data temporarily unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
