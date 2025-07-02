
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockSearch, CryptoSearch, MarketInsights } from '@/components/market';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';
import { 
  TrendingUp, TrendingDown, DollarSign, BarChart3, 
  Globe, Zap, Star, ArrowRight, Plus, Minus,
  Activity, PieChart, Target, Briefcase
} from 'lucide-react';

const Market = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const marketIndices = [
    {
      name: 'NIFTY 50',
      value: '22,326.90',
      change: '+156.60',
      changePercent: '+0.71%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      name: 'SENSEX',
      value: '73,651.35',
      change: '+498.58',
      changePercent: '+0.68%',
      isPositive: true,
      icon: TrendingUp
    },
    {
      name: 'BANK NIFTY',
      value: '48,452.10',
      change: '-145.30',
      changePercent: '-0.30%',
      isPositive: false,
      icon: TrendingDown
    },
    {
      name: 'NIFTY IT',
      value: '40,128.45',
      change: '+287.15',
      changePercent: '+0.72%',
      isPositive: true,
      icon: TrendingUp
    }
  ];

  const topMovers = [
    { symbol: 'RELIANCE', price: '₹2,845.60', change: '+2.15%', isPositive: true },
    { symbol: 'TCS', price: '₹4,156.30', change: '+1.87%', isPositive: true },
    { symbol: 'INFY', price: '₹1,789.25', change: '-0.98%', isPositive: false },
    { symbol: 'HDFCBANK', price: '₹1,678.40', change: '+0.54%', isPositive: true },
    { symbol: 'ICICIBANK', price: '₹1,234.80', change: '-1.23%', isPositive: false },
  ];

  const cryptoPrices = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$67,245.30', change: '+3.42%', isPositive: true },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,456.78', change: '+2.18%', isPositive: true },
    { symbol: 'BNB', name: 'Binance Coin', price: '$612.45', change: '-0.87%', isPositive: false },
    { symbol: 'ADA', name: 'Cardano', price: '$0.89', change: '+5.23%', isPositive: true },
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Markets</h1>
              <p className="text-slate-600 text-lg">Real-time market data and comprehensive investment research</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </Badge>
            </div>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketIndices.map((index) => (
            <Card key={index.name} className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${index.isPositive ? 'bg-green-100' : 'bg-red-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <index.icon className={`h-6 w-6 ${index.isPositive ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`rounded-full ${index.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                  >
                    {index.changePercent}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{index.name}</h3>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{index.value}</p>
                  <p className={`text-sm font-medium ${index.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {index.isPositive ? '+' : ''}{index.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Investment Research */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
                    Investment Research
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {timeframes.map((tf) => (
                      <Button
                        key={tf}
                        variant={selectedTimeframe === tf ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`rounded-2xl ${selectedTimeframe === tf ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                      >
                        {tf}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stocks" className="w-full">
                  <TabsList className="grid grid-cols-5 h-auto mb-6 bg-slate-100 rounded-2xl p-1">
                    <TabsTrigger value="stocks" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Stocks
                    </TabsTrigger>
                    <TabsTrigger value="mutual-funds" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <PieChart className="h-4 w-4 mr-2" />
                      Mutual Funds
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Crypto
                    </TabsTrigger>
                    <TabsTrigger value="bonds" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Target className="h-4 w-4 mr-2" />
                      Bonds
                    </TabsTrigger>
                    <TabsTrigger value="commodities" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Commodities
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="stocks" className="mt-6">
                    <StockSearch />
                  </TabsContent>
                  
                  <TabsContent value="mutual-funds" className="mt-6">
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <PieChart className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Mutual Funds Research</h3>
                      <p className="text-slate-600 mb-4">Advanced mutual fund analysis and comparison tools coming soon</p>
                      <Button className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                        Request Early Access
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="mt-6">
                    <CryptoSearch />
                  </TabsContent>
                  
                  <TabsContent value="bonds" className="mt-6">
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Bond Research</h3>
                      <p className="text-slate-600 mb-4">Government and corporate bond analysis tools</p>
                      <Button className="rounded-2xl bg-gradient-to-r from-green-600 to-teal-600">
                        Coming Soon
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="commodities" className="mt-6">
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Commodities Research</h3>
                      <p className="text-slate-600 mb-4">Gold, silver, oil and agricultural commodities data</p>
                      <Button className="rounded-2xl bg-gradient-to-r from-orange-600 to-yellow-600">
                        Coming Soon
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-purple-600" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketInsights />
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Top Movers */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMovers.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{stock.symbol}</p>
                          <p className="text-xs text-slate-600">{stock.price}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`rounded-full ${stock.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {stock.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crypto Prices */}
            <Card className="rounded-3xl border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
                  Cryptocurrency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cryptoPrices.map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-xs">
                          {crypto.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{crypto.name}</p>
                          <p className="text-xs text-slate-600">{crypto.price}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`rounded-full ${crypto.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {crypto.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Market News */}
            <CategoryNewsSection
              title="Market News"
              topic="stock market news market analysis and trading insights"
              category="Markets"
              limit={4}
            />
            
            {/* Economic Updates */}
            <CategoryNewsSection
              title="Economic Updates"
              topic="economic indicators GDP inflation and federal reserve news"
              category="Economy"
              limit={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
