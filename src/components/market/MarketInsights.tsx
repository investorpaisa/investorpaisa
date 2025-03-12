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
import { toast } from '@/components/ui/toast';

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
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching market data...');
      
      // Fetch market status
      const marketStatus = await getMarketStatus();
      console.log("Market status:", marketStatus);
      setStatus(marketStatus);

      // Fetch index data for Nifty 50
      const indexData = await getIndexData('NIFTY 50');
      console.log("Index data:", indexData);
      setIndices([indexData]);

      // Fetch top gainers and losers
      const [topGainers, topLosers] = await Promise.all([
        getTopGainers(),
        getTopLosers()
      ]);
      
      console.log("Top gainers:", topGainers);
      console.log("Top losers:", topLosers);
      
      setGainers(topGainers);
      setLosers(topLosers);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      setError("Failed to load market data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch data every minute when the market is open
    const intervalId = setInterval(() => {
      if (status?.status === 'open') {
        fetchData();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [status?.status]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
        <CardDescription>Real-time market status and insights.</CardDescription>
      </CardHeader>
      <CardContent className="pl-4 pb-4">
        {loading ? (
          <div>Loading market data...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {status && (
              <div className="mb-4">
                Market Status:{" "}
                <Badge
                  variant={status.status.includes('open') ? "default" : "destructive"}
                  className={status.status.includes('open') ? "bg-green-500" : ""}
                >
                  {status.status.includes('open') ? "Open" : "Closed"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {status.message}
                </p>
                <p className="text-xs text-muted-foreground">
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
                  {indices.length > 0 ? (
                    indices.map((index) => (
                      <div key={index.name} className="flex items-center justify-between p-2">
                        <span>{index.name}</span>
                        <div className="text-right">
                          <div>{index.lastPrice.toLocaleString()}</div>
                          <div className={index.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {index.change.toFixed(2)} ({index.pChange.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No index data available</div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="gainers" className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  {gainers.length > 0 ? (
                    gainers.map((gainer) => (
                      <div key={gainer.symbol} className="flex items-center justify-between p-2">
                        <span>{gainer.symbol}</span>
                        <div className="text-right">
                          <div>₹{gainer.lastPrice.toLocaleString()}</div>
                          <div className="text-green-500">
                            {gainer.change.toFixed(2)} ({gainer.pChange.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No gainers data available</div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="losers" className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  {losers.length > 0 ? (
                    losers.map((loser) => (
                      <div key={loser.symbol} className="flex items-center justify-between p-2">
                        <span>{loser.symbol}</span>
                        <div className="text-right">
                          <div>₹{loser.lastPrice.toLocaleString()}</div>
                          <div className="text-red-500">
                            {loser.change.toFixed(2)} ({loser.pChange.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No losers data available</div>
                  )}
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
