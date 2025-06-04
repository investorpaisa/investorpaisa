
import { fetchMarketData } from './api';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface IndexData {
  name: string;
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: string;
}

export const NSE_INDICES = {
  NIFTY_50: 'NIFTY 50',
  NIFTY_BANK: 'NIFTY BANK',
  NIFTY_IT: 'NIFTY IT',
  NIFTY_PHARMA: 'NIFTY PHARMA'
};

class MarketService {
  async getStockQuote(symbol: string): Promise<MarketData> {
    try {
      const data = await fetchMarketData('stocks', { symbol });
      
      return {
        symbol: data.info?.symbol || symbol,
        name: data.info?.companyName || symbol,
        price: data.priceInfo?.lastPrice || 0,
        change: data.priceInfo?.change || 0,
        changePercent: data.priceInfo?.pChange || 0,
        volume: data.securityInfo?.tradedVolume || 0,
        high: data.priceInfo?.intraDayHighLow?.max || 0,
        low: data.priceInfo?.intraDayHighLow?.min || 0,
        open: data.priceInfo?.open || 0,
        previousClose: data.priceInfo?.previousClose || 0
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
  }

  async getIndexData(indexName: string): Promise<IndexData> {
    try {
      const data = await fetchMarketData('indices', { index: indexName });
      
      return {
        name: data.name || indexName,
        lastPrice: data.lastPrice || 0,
        change: data.change || 0,
        pChange: data.pChange || 0,
        open: data.open || 0,
        high: data.high || 0,
        low: data.low || 0,
        previousClose: data.previousClose || 0,
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching index data:', error);
      throw new Error(`Failed to fetch data for ${indexName}`);
    }
  }

  async searchStocks(query: string): Promise<Array<{symbol: string; name: string; type: string}>> {
    try {
      const data = await fetchMarketData('search', { query });
      return data || [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async updateAssetPrices(assets: Array<{id: string; ticker: string; asset_type: string}>) {
    const updates = [];
    
    for (const asset of assets) {
      try {
        let currentPrice = 0;
        
        if (asset.asset_type === 'stock') {
          const stockData = await this.getStockQuote(asset.ticker);
          currentPrice = stockData.price;
        }
        // Add more asset types as needed
        
        if (currentPrice > 0) {
          updates.push({
            id: asset.id,
            current_price: currentPrice
          });
        }
      } catch (error) {
        console.error(`Error updating price for ${asset.ticker}:`, error);
      }
    }
    
    return updates;
  }
}

export const marketService = new MarketService();

// Export functions for backwards compatibility
export const getStockQuote = (symbol: string) => marketService.getStockQuote(symbol);
export const getIndexData = (indexName: string) => marketService.getIndexData(indexName);
export const searchStocks = (query: string) => marketService.searchStocks(query);
