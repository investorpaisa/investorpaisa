
import React from 'react';
import MarketInsights from '@/components/market/MarketInsights';
import StockSearch from '@/components/market/StockSearch';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart2, DollarSign, LineChart } from 'lucide-react';

const MarketPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-md bg-premium-gold/10 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-premium-gold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Market Data</h1>
        </div>
        <p className="text-muted-foreground">Track real-time market data and insights for informed decisions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-accent p-1 rounded-lg mb-6">
            <div className="flex items-center justify-between p-3 border-b border-premium-dark-700/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-premium-gold" />
                <h2 className="text-xl font-semibold tracking-tight">Market Insights</h2>
              </div>
              <div className="flex gap-2">
                <span className="badge-premium">Live</span>
                <span className="text-xs text-muted-foreground">Last update: Just now</span>
              </div>
            </div>
            <MarketInsights />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="premium-card p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <LineChart className="h-5 w-5 text-premium-gold" />
                <h3 className="text-lg font-medium">Market Trends</h3>
              </div>
              <div className="h-40 bg-premium-dark-700/30 rounded-md flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Chart visualization</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-md bg-premium-dark-700/20">
                  <div className="text-xs text-muted-foreground">S&P 500</div>
                  <div className="text-sm font-medium">4,872.09</div>
                  <div className="text-xs text-green-500">+1.23%</div>
                </div>
                <div className="p-2 rounded-md bg-premium-dark-700/20">
                  <div className="text-xs text-muted-foreground">NASDAQ</div>
                  <div className="text-sm font-medium">15,703.12</div>
                  <div className="text-xs text-green-500">+0.89%</div>
                </div>
              </div>
            </Card>
            
            <Card className="premium-card p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-premium-gold" />
                <h3 className="text-lg font-medium">Currencies</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border-b border-premium-dark-700/20">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-premium-dark-700/50 flex items-center justify-center text-xs">$</div>
                    <span>USD/EUR</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">0.9183</div>
                    <div className="text-xs text-red-500">-0.12%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border-b border-premium-dark-700/20">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-premium-dark-700/50 flex items-center justify-center text-xs">£</div>
                    <span>GBP/USD</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">1.2754</div>
                    <div className="text-xs text-green-500">+0.34%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-premium-dark-700/50 flex items-center justify-center text-xs">¥</div>
                    <span>USD/JPY</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">151.24</div>
                    <div className="text-xs text-green-500">+0.52%</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="p-4 premium-card">
            <h2 className="text-xl font-semibold tracking-tight mb-4">Stock Search</h2>
            <StockSearch />
          </Card>
          
          <Card className="premium-card p-4">
            <h3 className="text-lg font-medium mb-3">Market News</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-premium-dark-700/30 hover:bg-premium-dark-700/50 transition-colors cursor-pointer">
                <div className="text-xs text-premium-gold mb-1">Breaking</div>
                <h4 className="text-sm font-medium mb-1">Fed Holds Interest Rates Steady</h4>
                <p className="text-xs text-muted-foreground">Federal Reserve maintains current rates amid economic stability concerns.</p>
              </div>
              <div className="p-3 rounded-md bg-premium-dark-700/30 hover:bg-premium-dark-700/50 transition-colors cursor-pointer">
                <div className="text-xs text-muted-foreground mb-1">2 hours ago</div>
                <h4 className="text-sm font-medium mb-1">Tech Stocks Rally After Earnings</h4>
                <p className="text-xs text-muted-foreground">Major tech companies exceeded expectations in quarterly reports.</p>
              </div>
              <div className="p-3 rounded-md bg-premium-dark-700/30 hover:bg-premium-dark-700/50 transition-colors cursor-pointer">
                <div className="text-xs text-muted-foreground mb-1">5 hours ago</div>
                <h4 className="text-sm font-medium mb-1">Oil Prices Surge on Supply Concerns</h4>
                <p className="text-xs text-muted-foreground">Crude oil reaches three-month high amid geopolitical tensions.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
