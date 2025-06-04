
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FinancialProfileService } from '@/services/financial/profileService';
import { marketService } from '@/services/market';
import { TrackedAsset } from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export const MarketDataSync: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<TrackedAsset[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAssets();
    }
  }, [user]);

  const loadAssets = async () => {
    if (!user) return;
    
    try {
      const data = await FinancialProfileService.getTrackedAssets(user.id);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const updateMarketPrices = async () => {
    if (!user || assets.length === 0) return;
    
    setIsUpdating(true);
    setUpdateProgress(0);
    
    try {
      const updates = await marketService.updateAssetPrices(assets);
      
      let updatedCount = 0;
      for (const update of updates) {
        try {
          await FinancialProfileService.updateAssetPrice(update.id, update.current_price);
          updatedCount++;
          setUpdateProgress((updatedCount / updates.length) * 100);
        } catch (error) {
          console.error('Error updating asset price:', error);
        }
      }
      
      // Update financial metrics after price updates
      await FinancialProfileService.updateFinancialMetrics(user.id);
      
      setLastUpdate(new Date().toLocaleString());
      toast({
        title: "Prices Updated",
        description: `Updated ${updatedCount} asset prices successfully.`,
      });
      
      // Reload assets to show updated prices
      await loadAssets();
    } catch (error) {
      console.error('Error updating market prices:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update some asset prices. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  };

  const assetsNeedingUpdate = assets.filter(asset => 
    !asset.current_price || 
    new Date(asset.updated_at).getTime() < Date.now() - (15 * 60 * 1000) // 15 minutes old
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Data Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {lastUpdate ? `Last update: ${lastUpdate}` : 'No recent updates'}
          </div>
          <Button
            onClick={updateMarketPrices}
            disabled={isUpdating || assets.length === 0}
            size="sm"
            className="btn-premium"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update Prices'}
          </Button>
        </div>

        {isUpdating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Updating asset prices...</span>
              <span>{Math.round(updateProgress)}%</span>
            </div>
            <Progress value={updateProgress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{assets.length}</div>
            <div className="text-xs text-muted-foreground">Total Assets</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {assets.filter(a => a.current_price).length}
            </div>
            <div className="text-xs text-muted-foreground">With Prices</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {assetsNeedingUpdate.length}
            </div>
            <div className="text-xs text-muted-foreground">Need Update</div>
          </div>
        </div>

        {assetsNeedingUpdate.length > 0 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-orange-800">Outdated Prices</div>
                <div className="text-orange-700 mt-1">
                  {assetsNeedingUpdate.length} assets have outdated or missing price data.
                </div>
              </div>
            </div>
          </div>
        )}

        {assets.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No assets to update</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some assets to your portfolio to track prices
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
