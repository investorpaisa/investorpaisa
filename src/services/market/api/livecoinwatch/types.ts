
export interface LiveCoinWatchCoin {
  code: string;
  name: string;
  rate: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
  png32: string;
  png64: string;
  webp32: string;
  webp64: string;
}

export interface TransformedCoinData {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  change1h: number;
  change7d: number;
  change30d: number;
  change1y: number;
  iconUrl: string;
  source: string;
}

export interface MarketOverview {
  cap: number;
  volume: number;
  coins: number;
  btcDominance: number;
}

export interface ExchangeData {
  name: string;
  volume: number;
  png64: string;
}
