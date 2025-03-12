
import { corsHeaders } from "../utils/cors.ts";

export async function getMarketStatus(req: Request) {
  try {
    // For now, we'll return market status based on NYSE trading hours
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const day = now.getUTCDay();

    // NYSE trading hours (9:30 AM - 4:00 PM ET)
    // Converting to UTC (ET+4): 13:30 - 20:00 UTC
    const isWeekend = day === 0 || day === 6;
    const isBeforeOpen = hour < 13 || (hour === 13 && minute < 30);
    const isAfterClose = hour >= 20;

    let status;
    let message;

    if (isWeekend) {
      status = 'closed';
      message = 'Market is closed for the weekend';
    } else if (isBeforeOpen) {
      status = 'pre-open';
      message = 'Market will open at 9:30 AM ET';
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
