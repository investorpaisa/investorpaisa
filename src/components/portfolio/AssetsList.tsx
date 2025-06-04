
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { TrackedAsset } from '@/types/financial';
import { FinancialProfileService } from '@/services/financial/profileService';
import { toast } from '@/hooks/use-toast';

interface AssetsListProps {
  assets: TrackedAsset[];
  onAssetsChange: () => void;
}

export const AssetsList: React.FC<AssetsListProps> = ({
  assets,
  onAssetsChange
}) => {
  const handleDeleteAsset = async (assetId: string, ticker: string) => {
    try {
      await FinancialProfileService.deleteTrackedAsset(assetId);
      toast({
        title: "Asset Removed",
        description: `${ticker} has been removed from your portfolio.`,
      });
      onAssetsChange();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to remove asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateValue = (asset: TrackedAsset) => {
    const price = asset.current_price || asset.purchase_price || 0;
    return asset.quantity * price;
  };

  const calculateGainLoss = (asset: TrackedAsset) => {
    if (!asset.current_price || !asset.purchase_price) return null;
    const gain = (asset.current_price - asset.purchase_price) * asset.quantity;
    const gainPercent = ((asset.current_price - asset.purchase_price) / asset.purchase_price) * 100;
    return { gain, gainPercent };
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No assets in your portfolio yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first asset to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => {
        const value = calculateValue(asset);
        const gainLoss = calculateGainLoss(asset);
        
        return (
          <Card key={asset.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-semibold">{asset.ticker}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {asset.asset_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{asset.quantity}</p>
                  </div>
                  
                  {asset.purchase_price && (
                    <div>
                      <p className="text-muted-foreground">Purchase Price</p>
                      <p className="font-medium">{formatCurrency(asset.purchase_price)}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium">{formatCurrency(value)}</p>
                  </div>
                  
                  {gainLoss && (
                    <div>
                      <p className="text-muted-foreground">Gain/Loss</p>
                      <div className={`flex items-center gap-1 ${gainLoss.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainLoss.gain >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span className="font-medium">
                          {formatCurrency(Math.abs(gainLoss.gain))} ({gainLoss.gainPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAsset(asset.id, asset.ticker)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
