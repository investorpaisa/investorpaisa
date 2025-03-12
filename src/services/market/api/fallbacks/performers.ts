
// Fallback data for top gainers and losers
import { createMockStock } from './utils';

export function mockTopGainers() {
  return [
    createMockStock('RELIANCE', 2540.75, 45.30),
    createMockStock('TCS', 3456.80, 78.25),
    createMockStock('HDFCBANK', 1678.25, 32.45),
    createMockStock('INFY', 1540.65, 28.75),
    createMockStock('ITC', 450.20, 8.50)
  ];
}

export function mockTopLosers() {
  return [
    createMockStock('ADANIPORTS', 985.35, -32.65),
    createMockStock('TATASTEEL', 147.80, -5.20),
    createMockStock('ICICIBANK', 1054.55, -25.45),
    createMockStock('AXISBANK', 1078.90, -21.10),
    createMockStock('WIPRO', 478.35, -7.65)
  ];
}
