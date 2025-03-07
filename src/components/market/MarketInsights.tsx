import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getMarketStatus, 
  getIndexData, 
  getTopGainers, 
  getTopLosers,
  MarketStatus as MarketStatusType,
  MarketIndex
} from '@/services/market';
import { Badge } from '@/components/ui/badge';

interface MarketIndexProps {
  label: string;
  value: number;
  change: number;
}

interface GainersLosersProps {
  symbol: string;
  price: number;
  change: number;
}

const MarketInsights = () => {
  const [status, setStatus] = useState<MarketStatusType | null>(null);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('indices');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const marketStatus = await getMarketStatus();
      setStatus(marketStatus);

      const indexData = await getIndexData();
      setIndices(indexData);

      const topGainers = await getTopGainers();
      setGainers(topGainers);

      const topLosers = await getTopLosers();
      setLosers(topLosers);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
        <CardDescription>Real-time market status and insights.</CardDescription>
      </CardHeader>
      <CardContent className="pl-4 pb-4">
        {loading ? (
          <div>Loading market data...</div>
        ) : (
          <>
            {status && (
              <div className="mb-4">
                Market Status:{" "}
                <Badge
                  variant={status.isOpen ? "success" : "destructive"}
                >
                  {status.isOpen ? "Open" : "Closed"}
                </Badge>
                <p>
                  Last Updated: {new Date(status.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
            <Tabs defaultValue="indices" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="indices">Indices</TabsTrigger>
                <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                <TabsTrigger value="losers">Top Losers</TabsTrigger>
              </TabsList>
              <TabsContent value="indices" className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  {indices.map((index) => (
                    <div key={index.index} className="flex items-center justify-between p-2">
                      <span>{index.index}</span>
                      <div className="text-right">
                        <div>{index.last}</div>
                        <div className={index.variation >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {index.absoluteVariation} ({index.percentageVariation}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="gainers" className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  {gainers.map((gainer) => (
                    <div key={gainer.symbol} className="flex items-center justify-between p-2">
                      <span>{gainer.symbol}</span>
                      <div className="text-right">
                        <div>₹{gainer.lastPrice}</div>
                        <div className="text-green-500">
                          {gainer.change} ({gainer.pChange}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="losers" className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  {losers.map((loser) => (
                    <div key={loser.symbol} className="flex items-center justify-between p-2">
                      <span>{loser.symbol}</span>
                      <div className="text-right">
                        <div>₹{loser.lastPrice}</div>
                        <div className="text-red-500">
                          {loser.change} ({loser.pChange}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
