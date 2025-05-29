import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, TrendingUp, Zap, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCryptoSearchComparison } from './hooks/useCryptoSearchComparison';
import { LiveCoinWatchResearch } from './LiveCoinWatchResearch';
import { generateComparisonReport, logComparisonReport } from '@/services/market/api/apiComparison';

export const CryptoAPIComparison: React.FC = () => {
  const {
    selectedAPI,
    coinrankingData,
    trendingCoinranking,
    performanceTest,
    coinrankingLoading,
    coinrankingError,
    comparisonData,
    handleAPISwitch,
    handleRefresh
  } = useCryptoSearchComparison();

  // Generate updated comparison report
  React.useEffect(() => {
    logComparisonReport();
  }, []);

  return (
    <div className="space-y-6">
      {/* API Selection Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Cryptocurrency API Testing & Comprehensive Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              variant={selectedAPI === 'livecoinwatch' ? 'default' : 'outline'}
              onClick={() => handleAPISwitch('livecoinwatch' as any)}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              LiveCoinWatch API (NEW)
              <Badge variant="default">Best Choice</Badge>
            </Button>
            <Button
              variant={selectedAPI === 'coinranking' ? 'default' : 'outline'}
              onClick={() => handleAPISwitch('coinranking')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Coinranking API
              <Badge variant="secondary">Good</Badge>
            </Button>
            <Button
              variant={selectedAPI === 'current' ? 'default' : 'outline'}
              onClick={() => handleAPISwitch('current')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Current Multi-Source
              <Badge variant="destructive">Limited</Badge>
            </Button>
          </div>
          
          <Button onClick={handleRefresh} disabled={coinrankingLoading}>
            {coinrankingLoading ? 'Testing APIs...' : 'Test All APIs Performance'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="livecoinwatch" className="w-full">
        <TabsList className="grid grid-cols-4 h-auto mb-4">
          <TabsTrigger value="livecoinwatch" className="py-2">🚀 LiveCoinWatch (Best)</TabsTrigger>
          <TabsTrigger value="coinranking" className="py-2">📈 Coinranking</TabsTrigger>
          <TabsTrigger value="current" className="py-2">⚠️ Current Solution</TabsTrigger>
          <TabsTrigger value="comparison" className="py-2">📊 Full Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="livecoinwatch" className="mt-4">
          <LiveCoinWatchResearch />
        </TabsContent>

        <TabsContent value="coinranking" className="mt-4">
          {/* Coinranking API Test */}
          {selectedAPI === 'coinranking' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {coinrankingError ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : coinrankingData ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    Coinranking API Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coinrankingLoading && (
                    <div className="text-center py-4">
                      <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Testing live data...</p>
                    </div>
                  )}
                  
                  {coinrankingError && (
                    <div className="text-red-500 p-4 bg-red-50 rounded-md">
                      <p className="font-medium">API Test Failed</p>
                      <p className="text-sm mt-1">Please check API key and connection</p>
                    </div>
                  )}
                  
                  {coinrankingData && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{coinrankingData.name}</span>
                        <Badge variant="outline">{coinrankingData.symbol}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium">${coinrankingData.price?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">24h Change</p>
                          <p className={`font-medium ${coinrankingData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coinrankingData.change24h?.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Market Cap</p>
                          <p className="font-medium">${(coinrankingData.marketCap / 1e9)?.toFixed(1)}B</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rank</p>
                          <p className="font-medium">#{coinrankingData.rank}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-full justify-center">
                        ✅ Real-time data from {coinrankingData.source}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Coinranking Performance Test</CardTitle>
                </CardHeader>
                <CardContent>
                  {performanceTest ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {performanceTest.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {performanceTest.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{performanceTest.duration}ms</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coins Retrieved</p>
                          <p className="font-medium">
                            {performanceTest.coinsRetrieved || 0}/{performanceTest.coinsRequested || 5}
                          </p>
                        </div>
                      </div>
                      
                      {performanceTest.success && performanceTest.data && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Sample Data:</p>
                          <div className="space-y-1 text-xs">
                            {performanceTest.data.slice(0, 3).map((coin: any, index: number) => (
                              <div key={index} className="flex justify-between">
                                <span>{coin.symbol}</span>
                                <span>${coin.price?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!performanceTest.success && (
                        <div className="text-red-500 text-sm">
                          Error: {performanceTest.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Run test to see performance metrics</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trending Coins */}
          {trendingCoinranking.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Coinranking Trending Cryptocurrencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingCoinranking.slice(0, 6).map((coin: any, index: number) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {coin.iconUrl && (
                            <img src={coin.iconUrl} alt={coin.symbol} className="w-6 h-6" />
                          )}
                          <span className="font-medium">{coin.symbol}</span>
                        </div>
                        <Badge variant="outline">#{coin.rank}</Badge>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">${coin.price?.toLocaleString()}</p>
                        <p className={`${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="current" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Current Multi-Source Solution Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Major Limitations:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Only 1,000 requests per month (very limited)</li>
                    <li>• Frequent 429 rate limiting errors</li>
                    <li>• Often returns fallback/estimated data instead of real prices</li>
                    <li>• Poor reliability during high market activity</li>
                    <li>• No real-time updates</li>
                    <li>• Limited to basic price and volume data</li>
                    <li>• No historical data or advanced metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">User Experience Impact:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Users often see "estimated" or outdated prices</li>
                    <li>• Loading errors and timeouts</li>
                    <li>• Inconsistent data quality</li>
                    <li>• Poor performance during market volatility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          {/* Comprehensive Comparison Report */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Comprehensive API Comparison Report</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-x-auto">
                {generateComparisonReport()}
              </pre>
            </CardContent>
          </Card>

          {/* Feature Comparison Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Feature Comparison Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Feature</th>
                      <th className="border border-gray-300 p-2 text-center">Current Solution</th>
                      <th className="border border-gray-300 p-2 text-center">Coinranking</th>
                      <th className="border border-gray-300 p-2 text-center">LiveCoinWatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Monthly Requests</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">1,000</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">10,000</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600 font-bold">16,000</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Real-time Data</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Historical Data</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-yellow-600">Limited</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅ Full</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Multiple Timeframes</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-yellow-600">Basic</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅ 1h,24h,7d,30d,1y</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Exchange Data</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Market Overview</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">❌</td>
                      <td className="border border-gray-300 p-2 text-center text-yellow-600">Basic</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">✅ Comprehensive</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-medium">Data Quality</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600">Poor</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600">High</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600 font-bold">Excellent</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300 p-2 font-bold">Overall Score</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">4/10</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600 font-bold">8.5/10</td>
                      <td className="border border-gray-300 p-2 text-center text-green-600 font-bold">9.2/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Final Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-bold text-green-800 mb-3">
                  🥇 LiveCoinWatch API is the Clear Winner
                </h3>
                <div className="space-y-2 text-green-700">
                  <p>• <strong>16,000 monthly requests</strong> - 16x more than current solution</p>
                  <p>• <strong>Comprehensive data</strong> - Historical prices, exchange data, market overview</p>
                  <p>• <strong>Multiple timeframes</strong> - 1h, 24h, 7d, 30d, 1y price changes</p>
                  <p>• <strong>Excellent reliability</strong> - Real-time accurate data</p>
                  <p>• <strong>Advanced features</strong> - Market statistics, exchange rankings</p>
                  <p>• <strong>Better user experience</strong> - No more fallback data or rate limiting</p>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="text-green-800 font-medium">
                    💡 Recommendation: Implement LiveCoinWatch as the primary API for all cryptocurrency features
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
