
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockSearch, CryptoSearch, MarketInsights } from '@/components/market';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';

const Market = () => {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Market Research</h1>
        <p className="text-muted-foreground">Research stocks, mutual funds, cryptocurrencies, bonds, and commodities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketInsights />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Research</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stocks" className="w-full">
                <TabsList className="grid grid-cols-5 h-auto mb-4">
                  <TabsTrigger value="stocks" className="py-2">Stocks</TabsTrigger>
                  <TabsTrigger value="mutual-funds" className="py-2">Mutual Funds</TabsTrigger>
                  <TabsTrigger value="crypto" className="py-2">Cryptocurrency</TabsTrigger>
                  <TabsTrigger value="bonds" className="py-2">Bonds</TabsTrigger>
                  <TabsTrigger value="commodities" className="py-2">Commodities</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stocks" className="mt-4">
                  <StockSearch />
                </TabsContent>
                
                <TabsContent value="mutual-funds" className="mt-4">
                  <div className="p-4 border rounded-md text-center">
                    <p className="text-muted-foreground">Mutual fund research is coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="crypto" className="mt-4">
                  <CryptoSearch />
                </TabsContent>
                
                <TabsContent value="bonds" className="mt-4">
                  <div className="p-4 border rounded-md text-center">
                    <p className="text-muted-foreground">Bond research is coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="commodities" className="mt-4">
                  <div className="p-4 border rounded-md text-center">
                    <p className="text-muted-foreground">Commodities research is coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <CategoryNewsSection
            title="Market News"
            topic="stock market news market analysis and trading insights"
            category="Markets"
            limit={4}
          />
          
          <CategoryNewsSection
            title="Economic Updates"
            topic="economic indicators GDP inflation and federal reserve news"
            category="Economy"
            limit={3}
          />
          
          <CategoryNewsSection
            title="Investment Insights"
            topic="investment strategies portfolio management and financial planning"
            category="Financial"
            limit={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Market;
