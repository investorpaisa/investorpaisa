
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockSearch, MarketInsights } from '@/components/market';
import { CryptoAPIComparison } from '@/components/market/crypto-search/CryptoAPIComparison';
import { LiveCoinWatchResearch } from '@/components/market/crypto-search/LiveCoinWatchResearch';
import CategoryNewsSection from '@/components/news/CategoryNewsSection';

const MarketWithComparison = () => {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Advanced Market Research & API Testing</h1>
        <p className="text-muted-foreground">Research investments with comprehensive cryptocurrency data and test multiple API sources</p>
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
              <CardTitle>Investment Research & API Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="livecoinwatch" className="w-full">
                <TabsList className="grid grid-cols-5 h-auto mb-4">
                  <TabsTrigger value="livecoinwatch" className="py-2">🚀 LiveCoinWatch</TabsTrigger>
                  <TabsTrigger value="crypto-test" className="py-2">🧪 API Comparison</TabsTrigger>
                  <TabsTrigger value="stocks" className="py-2">📈 Stocks</TabsTrigger>
                  <TabsTrigger value="mutual-funds" className="py-2">💼 Mutual Funds</TabsTrigger>
                  <TabsTrigger value="bonds" className="py-2">📊 Bonds</TabsTrigger>
                </TabsList>
                
                <TabsContent value="livecoinwatch" className="mt-4">
                  <LiveCoinWatchResearch />
                </TabsContent>
                
                <TabsContent value="crypto-test" className="mt-4">
                  <CryptoAPIComparison />
                </TabsContent>
                
                <TabsContent value="stocks" className="mt-4">
                  <StockSearch />
                </TabsContent>
                
                <TabsContent value="mutual-funds" className="mt-4">
                  <div className="p-4 border rounded-md text-center">
                    <p className="text-muted-foreground">Mutual fund research is coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="bonds" className="mt-4">
                  <div className="p-4 border rounded-md text-center">
                    <p className="text-muted-foreground">Bond research is coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <CategoryNewsSection
            title="Crypto Market News"
            topic="cryptocurrency market analysis bitcoin ethereum price trends LiveCoinWatch"
            category="Crypto"
            limit={4}
          />
          
          <CategoryNewsSection
            title="API & Tech News"
            topic="API integration cryptocurrency data sources financial technology LiveCoinWatch"
            category="Technology"
            limit={3}
          />
          
          <CategoryNewsSection
            title="Exchange News"
            topic="cryptocurrency exchanges trading platforms market data"
            category="Finance"
            limit={3}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketWithComparison;
