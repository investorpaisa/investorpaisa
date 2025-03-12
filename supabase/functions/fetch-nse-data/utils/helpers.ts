
// Common helper functions used across handlers
import { corsHeaders } from "./cors.ts";

// Helper to get company names
export function getCompanyName(symbol: string) {
  const companies: Record<string, string> = {
    'RELIANCE': 'Reliance Industries Ltd.',
    'TCS': 'Tata Consultancy Services Ltd.',
    'HDFCBANK': 'HDFC Bank Ltd.',
    'INFY': 'Infosys Ltd.',
    'ITC': 'ITC Ltd.',
    'ICICIBANK': 'ICICI Bank Ltd.',
    'WIPRO': 'Wipro Ltd.',
    'TATASTEEL': 'Tata Steel Ltd.',
    'AXISBANK': 'Axis Bank Ltd.',
    'SBIN': 'State Bank of India'
  };
  
  return companies[symbol] || `${symbol} Ltd.`;
}

// Standard JSON response helper
export function jsonResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status 
    }
  );
}
