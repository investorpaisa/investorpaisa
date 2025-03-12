
// Handler for market status endpoint
import { corsHeaders } from "../utils/cors.ts";

export async function getMarketStatus(req: Request) {
  // For demo purposes, we'll check current time (IST) to determine if market is open
  // BSE/NSE market hours: 9:15 AM - 3:30 PM IST, Monday-Friday
  const now = new Date();
  const istOptions = { timeZone: 'Asia/Kolkata' };
  const istTimeStr = now.toLocaleString('en-US', istOptions);
  const ist = new Date(istTimeStr);
  
  const hour = ist.getHours();
  const minute = ist.getMinutes();
  const day = ist.getDay();
  
  // Check if within market hours (9:15 AM - 3:30 PM IST) and weekday (1-5)
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = (hour > 9 || (hour === 9 && minute >= 15)) && (hour < 15 || (hour === 15 && minute <= 30));
  const isOpen = isWeekday && isMarketHours;

  const status = {
    marketState: isOpen ? "open" : "closed",
    marketStatus: isOpen ? "The market is currently open" : "The market is currently closed",
    timestamp: new Date().toISOString()
  };

  return new Response(
    JSON.stringify(status),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
