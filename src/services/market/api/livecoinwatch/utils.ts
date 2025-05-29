
// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key: string): any | null => {
  const cachedItem = cache.get(key);
  if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_DURATION)) {
    return cachedItem.data;
  }
  return null;
};

export const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Mock data generators for fallback
export function generateMockCryptoData(limit: number) {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43500, change24h: 2.5, marketCap: 850000000000, volume24h: 25000000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 2650, change24h: -1.2, marketCap: 320000000000, volume24h: 12000000000 },
    { symbol: 'BNB', name: 'BNB', price: 315, change24h: 0.8, marketCap: 48000000000, volume24h: 1500000000 },
    { symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 3.1, marketCap: 34000000000, volume24h: 1200000000 },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, change24h: -0.5, marketCap: 17000000000, volume24h: 380000000 },
    { symbol: 'SOL', name: 'Solana', price: 98, change24h: 4.2, marketCap: 44000000000, volume24h: 2100000000 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.2, change24h: -2.1, marketCap: 9000000000, volume24h: 180000000 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.85, change24h: 1.8, marketCap: 8500000000, volume24h: 420000000 }
  ];
  
  return cryptos.slice(0, limit).map((crypto, index) => ({
    ...crypto,
    change1h: (Math.random() - 0.5) * 2,
    change7d: (Math.random() - 0.5) * 20,
    change30d: (Math.random() - 0.5) * 50,
    change1y: (Math.random() - 0.5) * 200,
    iconUrl: `https://cryptologos.cc/logos/${crypto.symbol.toLowerCase()}-${crypto.symbol.toLowerCase()}-logo.png`,
    source: 'LiveCoinWatch'
  }));
}

export function generateMockCoinData(symbol: string) {
  const basePrice = symbol === 'BTC' ? 43500 : symbol === 'ETH' ? 2650 : Math.random() * 100;
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol} Token`,
    price: basePrice,
    change24h: (Math.random() - 0.5) * 10,
    change1h: (Math.random() - 0.5) * 2,
    change7d: (Math.random() - 0.5) * 20,
    change30d: (Math.random() - 0.5) * 50,
    change1y: (Math.random() - 0.5) * 200,
    marketCap: basePrice * 21000000,
    volume24h: basePrice * 1000000,
    iconUrl: `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
    source: 'LiveCoinWatch'
  };
}

export function generateMockOverviewData() {
  return {
    cap: 1.65e12, // 1.65T
    volume: 45e9, // 45B
    coins: 2847,
    btcDominance: 52.3
  };
}

export function generateMockExchangeData() {
  return [
    { name: 'Binance', volume: 15e9, png64: '' },
    { name: 'Coinbase', volume: 8e9, png64: '' },
    { name: 'Kraken', volume: 3e9, png64: '' },
    { name: 'KuCoin', volume: 2e9, png64: '' }
  ];
}

export function generateMockHistoryData(code: string, start: number, end: number) {
  const points = [];
  const duration = end - start;
  const intervals = Math.min(100, Math.max(10, duration / (24 * 60 * 60 * 1000))); // Max 100 points
  const basePrice = code === 'BTC' ? 43500 : code === 'ETH' ? 2650 : Math.random() * 100;
  
  for (let i = 0; i < intervals; i++) {
    const timestamp = start + (duration / intervals) * i;
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.1); // ±5% variation
    points.push([timestamp, price]);
  }
  
  return points;
}
