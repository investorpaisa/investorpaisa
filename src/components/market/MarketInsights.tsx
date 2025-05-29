
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Loader,
  Globe
} from 'lucide-react';
import { getLiveCoinWatchOverview, getLiveCoinWatchData } from '@/services/market/api/livecoinwatch';

const MarketInsights = () => {
  // Get market overview from LiveCoinWatch
  const { data: marketOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ['market-overview'],
    queryFn: getLiveCoinWatchOverview,
    staleTime: 15 * 60 * 1000,
    retry: 2
  });

  // Get top 5 cryptocurrencies
  const { data: topCryptos = [], isLoading: cryptosLoading } = useQuery({
    queryKey: ['top-cryptos-insights'],
    queryFn: () => getLiveCoinWatchData(undefined, 5),
    staleTime: 10 * 60 * 1000,
    retry: 2
  });

  if (overviewLoading || cryptosLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-3 text-gray-600">Loading market insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Global Market Overview</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="h-4 w-4" />
          <span>Live Data</span>
        </div>
      </div>

      {/* Market Overview Stats */}
      {marketOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 bg-blue-50">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-sm text-gray-600 mb-1">Total Market Cap</div>
              <div className="text-2xl font-bold text-blue-600">
                ${(marketOverview.cap / 1e12)?.toFixed(2)}T
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-green-50">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-sm text-gray-600 mb-1">24h Volume</div>
              <div className="text-2xl font-bold text-green-600">
                ${(marketOverview.volume / 1e9)?.toFixed(1)}B
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="text-sm text-gray-600 mb-1">Active Cryptocurrencies</div>
              <div className="text-2xl font-bold text-purple-600">
                {marketOverview.coins?.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-orange-50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-sm text-gray-600 mb-1">BTC Dominance</div>
              <div className="text-2xl font-bold text-orange-600">
                {marketOverview.btcDominance?.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Cryptocurrencies */}
      <div>
        <h4 className="text-md font-semibold mb-4 text-gray-900">Market Leaders</h4>
        <div className="space-y-3">
          {topCryptos.map((crypto: any, index: number) => (
            <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {crypto.iconUrl && (
                      <img src={crypto.iconUrl} alt={crypto.symbol} className="w-10 h-10" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{crypto.symbol}</div>
                      <div className="text-sm text-gray-500">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${crypto.price?.toLocaleString()}</div>
                    <div className={`text-sm font-medium flex items-center gap-1 ${
                      crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {crypto.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Source Attribution */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t">
        Market data provided by professional-grade APIs • Updated in real-time
      </div>
    </div>
  );
};

export default MarketInsights;
