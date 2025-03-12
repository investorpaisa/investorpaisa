
import { corsHeaders } from "../utils/cors.ts";

export async function getMarketStatus(req: Request) {
  try {
    // For now, we'll return market status based on NSE trading hours
    // NSE trading hours are 9:15 AM - 3:30 PM IST
    // Converting to UTC (IST-5:30): 3:45 - 10:00 UTC
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const day = now.getUTCDay();

    const isWeekend = day === 0 || day === 6;
    const isBeforeOpen = hour < 3 || (hour === 3 && minute < 45);
    const isAfterClose = hour >= 10;

    let status;
    let message;

    if (isWeekend) {
      status = 'closed';
      message = 'Market is closed for the weekend';
    } else if (isBeforeOpen) {
      status = 'pre-open';
      message = 'Market will open at 9:15 AM IST';
    } else if (isAfterClose) {
      status = 'post-close';
      message = 'Market has closed for the day';
    } else {
      status = 'open';
      message = 'Market is open for trading';
    }

    return new Response(
      JSON.stringify({
        marketState: status,
        marketStatus: message,
        timestamp: now.toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in getMarketStatus:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
