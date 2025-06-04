
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { FinancialProfileService } from '@/services/financial/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { TrackedAsset, FinancialMetrics } from '@/types/financial';
import { AddAssetModal } from './AddAssetModal';
import { AssetsList } from './AssetsList';
import { PortfolioChart } from './PortfolioChart';
import { AchievementsBadges } from './AchievementsBadges';

export const PortfolioDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<TrackedAsset[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, [user]);

  const loadPortfolioData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [assetsData, metricsData] = await Promise.all([
        FinancialProfileService.getTrackedAssets(user.id),
        FinancialProfileService.getFinancialMetrics(user.id)
      ]);

      setAssets(assetsData);
      setMetrics(metricsData);

      // Check and award achievements
      await FinancialProfileService.checkAndAwardAchievements(user.id);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetAdded = async () => {
    await loadPortfolioData();
    setShowAddModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalValue = metrics?.portfolio_size || 0;
  const totalReturns = metrics?.investment_returns || 0;
  const annualizedReturns = metrics?.annualized_returns || 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-premium-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Returns</p>
                <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalReturns)}
                </p>
              </div>
              {totalReturns >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annualized Returns</p>
                <p className={`text-2xl font-bold ${annualizedReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(annualizedReturns)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-premium-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <AchievementsBadges userId={user?.id} />

      {/* Portfolio Chart */}
      {metrics?.asset_allocation && Object.keys(metrics.asset_allocation).length > 0 && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart assetAllocation={metrics.asset_allocation} />
          </CardContent>
        </Card>
      )}

      {/* Assets Management */}
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Assets</CardTitle>
          <Button onClick={() => setShowAddModal(true)} className="btn-premium">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </CardHeader>
        <CardContent>
          <AssetsList assets={assets} onAssetsChange={loadPortfolioData} />
        </CardContent>
      </Card>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAssetAdded={handleAssetAdded}
      />
    </div>
  );
};
