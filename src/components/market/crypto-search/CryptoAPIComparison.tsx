
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import { useCryptoSearchComparison } from './hooks/useCryptoSearchComparison';

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

  return (
    <div className="space-y-6">
      {/* API Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Cryptocurrency API Testing & Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              variant={selectedAPI === 'coinranking' ? 'default' : 'outline'}
              onClick={() => handleAPISwitch('coinranking')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Coinranking API (NEW)
              <Badge variant="secondary">Recommended</Badge>
            </Button>
            <Button
              variant={selectedAPI === 'current' ? 'default' : 'outline'}
              onClick={() => handleAPISwitch('current')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Current Multi-Source
              <Badge variant="destructive">Issues</Badge>
            </Button>
          </div>
          
          <Button onClick={handleRefresh} disabled={coinrankingLoading}>
            {coinrankingLoading ? 'Testing...' : 'Test API Performance'}
          </Button>
        </CardContent>
      </Card>

      {/* Live Data Test Results */}
      {selectedAPI === 'coinranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coinranking API Test */}
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
              <CardTitle>Performance Test Results</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Live Trending Cryptocurrencies</CardTitle>
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

      {/* Comparison Report */}
      {comparisonData && (
        <Card>
          <CardHeader>
            <CardTitle>📊 API Comparison Report</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-x-auto">
              {comparisonData}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
