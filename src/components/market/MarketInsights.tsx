
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketStatus, MarketIndex, StockQuote } from '@/services/messages/types';
import { 
  getMarketStatus, 
  getIndexData, 
  getTopGainers, 
  getTopLosers,
  NSE_INDICES
} from '@/services/market/marketService';
import { ArrowUp, ArrowDown, Clock, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

const IndexCard = ({ indexName }: { indexName: string }) => {
  const { data: indexData, isLoading, error } = useQuery({
    queryKey: ['indexData', indexName],
    queryFn: () => getIndexData(indexName),
    refetchInterval: 60000 // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card className="mb-4 bg-premium-dark-800/60 backdrop-blur-md">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-24 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !indexData) {
    return (
      <Card className="mb-4 bg-premium-dark-800/60 backdrop-blur-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">{indexName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">Failed to load data</div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = indexData.change >= 0;
  
  return (
    <Card className="mb-4 bg-premium-dark-800/60 backdrop-blur-md hover:bg-premium-dark-800/80 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{indexData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold mb-1">{indexData.lastPrice.toLocaleString('en-IN')}</div>
        <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span className="text-sm">{indexData.change.toFixed(2)} ({indexData.pChange.toFixed(2)}%)</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Open: {indexData.open.toLocaleString('en-IN')}</div>
          <div>Prev: {indexData.previousClose.toLocaleString('en-IN')}</div>
          <div>High: {indexData.high.toLocaleString('en-IN')}</div>
          <div>Low: {indexData.low.toLocaleString('en-IN')}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const StockList = ({ stocks, title, icon }: { stocks: StockQuote[], title: string, icon: React.ReactNode }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No stocks available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3 border-b border-premium-dark-700/30 pb-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="mb-2 p-3 bg-premium-dark-800/40 hover:bg-premium-dark-800/60 cursor-pointer transition-colors">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-xs text-muted-foreground">{stock.companyName}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{stock.lastPrice.toLocaleString('en-IN')}</div>
              <div className={`flex items-center justify-end text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {stock.change.toFixed(2)} ({stock.pChange.toFixed(2)}%)
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const MarketInsights = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: marketStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ['marketStatus'],
    queryFn: getMarketStatus,
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: topGainers, isLoading: loadingGainers } = useQuery({
    queryKey: ['topGainers'],
    queryFn: getTopGainers,
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const { data: topLosers, isLoading: loadingLosers } = useQuery({
    queryKey: ['topLosers'],
    queryFn: getTopLosers,
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">Market Insights</h2>
        {marketStatus && (
          <div className={`flex items-center text-xs px-2 py-1 rounded ${marketStatus.status === 'open' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
            <Clock className="h-3 w-3 mr-1" />
            <span>{marketStatus.status.toUpperCase()}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 bg-premium-dark-800/60 backdrop-blur-md w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IndexCard indexName={NSE_INDICES.NIFTY_50} />
            <IndexCard indexName={NSE_INDICES.NIFTY_BANK} />
            <IndexCard indexName={NSE_INDICES.NIFTY_IT} />
            <IndexCard indexName={NSE_INDICES.NIFTY_PHARMA} />
          </div>
        </TabsContent>
        
        <TabsContent value="gainers" className="mt-0">
          {loadingGainers ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <StockList 
              stocks={topGainers || []} 
              title="Top Gainers" 
              icon={<TrendingUp className="h-4 w-4 text-green-500" />} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="losers" className="mt-0">
          {loadingLosers ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <StockList 
              stocks={topLosers || []} 
              title="Top Losers" 
              icon={<TrendingDown className="h-4 w-4 text-red-500" />} 
            />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MarketInsights;
