
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Clock,
  Globe
} from 'lucide-react';
import { getLiveCoinWatchOverview, getLiveCoinWatchData } from '@/services/market/api/livecoinwatch';

const MarketInsights = () => {
  // Get market overview from LiveCoinWatch
  const { data: marketOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ['market-overview'],
    queryFn: getLiveCoinWatchOverview,
    staleTime: 15 * 60 * 1000,
    retry: 1
  });

  // Get top cryptocurrencies
  const { data: topCryptos = [], isLoading: cryptosLoading } = useQuery({
    queryKey: ['top-cryptos'],
    queryFn: () => getLiveCoinWatchData(undefined, 5),
    staleTime: 10 * 60 * 1000,
    retry: 1
  });

  if (overviewLoading || cryptosLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Global Market Overview</h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          LiveCoinWatch
        </Badge>
      </div>

      {/* Market Overview Stats */}
      {marketOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Market Cap</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                ${(marketOverview.cap / 1e12)?.toFixed(2)}T
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">24h Volume</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                ${(marketOverview.volume / 1e9)?.toFixed(1)}B
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Total Coins</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                {marketOverview.coins?.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">BTC Dominance</span>
              </div>
              <div className="text-xl font-bold text-orange-600">
                {marketOverview.btcDominance?.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Cryptocurrencies */}
      <div>
        <h4 className="text-md font-semibold mb-3">Top Cryptocurrencies</h4>
        <div className="space-y-2">
          {topCryptos.map((crypto: any, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {crypto.iconUrl && (
                      <img src={crypto.iconUrl} alt={crypto.symbol} className="w-8 h-8" />
                    )}
                    <div>
                      <div className="font-medium">{crypto.symbol}</div>
                      <div className="text-sm text-muted-foreground">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${crypto.price?.toLocaleString()}</div>
                    <div className={`text-sm flex items-center gap-1 ${
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

      <div className="flex items-center justify-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        Data powered by LiveCoinWatch • Updated every 15 minutes
      </div>
    </div>
  );
};

export default MarketInsights;
