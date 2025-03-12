
// Fallback data for market status
export function mockMarketStatus() {
  const now = new Date();
  const marketOpen = now.getHours() >= 9 && now.getHours() < 16;
  
  return {
    status: marketOpen ? "The market is currently open" : "The market is currently closed",
    timestamp: new Date().toISOString()
  };
}
