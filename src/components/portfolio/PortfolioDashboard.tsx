
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FinancialProfileService } from '@/services/financial/profileService';
import { FinancialMetrics, TrackedAsset } from '@/types/financial';
import { AddAssetModal } from './AddAssetModal';
import { AssetsList } from './AssetsList';
import { PortfolioChart } from './PortfolioChart';
import { AchievementsBadges } from './AchievementsBadges';
import { PortfolioSyncDashboard } from './PortfolioSyncDashboard';
import { toast } from '@/hooks/use-toast';

export const PortfolioDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [assets, setAssets] = useState<TrackedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPortfolioData();
    }
  }, [user]);

  const loadPortfolioData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [metricsData, assetsData] = await Promise.all([
        FinancialProfileService.getFinancialMetrics(user.id),
        FinancialProfileService.getTrackedAssets(user.id)
      ]);

      setMetrics(metricsData);
      setAssets(assetsData);

      // Update metrics if we have assets but no metrics
      if (assetsData.length > 0 && !metricsData) {
        await FinancialProfileService.updateFinancialMetrics(user.id);
        const updatedMetrics = await FinancialProfileService.getFinancialMetrics(user.id);
        setMetrics(updatedMetrics);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetAdded = async () => {
    setIsAddModalOpen(false);
    await loadPortfolioData();
    
    // Check for new achievements
    if (user) {
      await FinancialProfileService.checkAndAwardAchievements(user.id);
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="btn-premium">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-premium-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.portfolio_size || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total value of your investments
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-premium-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics?.annualized_returns || 0).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Annualized return rate
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Award className="h-4 w-4 text-premium-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">
              Tracked investments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Sync Dashboard */}
      <PortfolioSyncDashboard />

      {/* Portfolio Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetsList assets={assets} onAssetsChange={loadPortfolioData} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioChart assetAllocation={metrics?.asset_allocation || {}} />
            </CardContent>
          </Card>

          <AchievementsBadges userId={user?.id} />
        </div>
      </div>

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAssetAdded={handleAssetAdded}
      />
    </div>
  );
};
