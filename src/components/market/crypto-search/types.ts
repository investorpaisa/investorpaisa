
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  sparkline: { price: number[] };
}

export interface AlphaVantageCryptoRate {
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  lastRefreshed: string;
  timeZone: string;
  bidPrice: number;
  askPrice: number;
  isFallback?: boolean;
}

export interface AlphaVantageCryptoTimeSeries {
  symbol: string;
  market: string;
  prices: {
    timestamp: string;
    price: number;
  }[];
  metadata: {
    information?: string;
    symbol: string;
    refreshed: string;
  };
  isFallback?: boolean;
}
