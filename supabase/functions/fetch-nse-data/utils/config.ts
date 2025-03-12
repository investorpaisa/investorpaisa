
export const RAPIDAPI_HOST = "alpha-vantage.p.rapidapi.com";
export const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") || "23ec2c7ac8mshca999ef26c89cebp1512c6jsne5275655a950";
export const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");

// If we can't find the RapidAPI key in environment variables, use the provided key
if (!RAPIDAPI_KEY || RAPIDAPI_KEY === "23ec2c7ac8mshca999ef26c89cebp1512c6jsne5275655a950") {
  console.log("Using provided RAPIDAPI_KEY for Alpha Vantage API");
}

// API function names for different data categories
export const API_FUNCTIONS = {
  STOCK: {
    QUOTE: "GLOBAL_QUOTE",
    DAILY: "TIME_SERIES_DAILY",
    INTRADAY: "TIME_SERIES_INTRADAY",
    WEEKLY: "TIME_SERIES_WEEKLY",
    MONTHLY: "TIME_SERIES_MONTHLY"
  },
  FOREX: {
    RATE: "CURRENCY_EXCHANGE_RATE",
    INTRADAY: "FX_INTRADAY",
    DAILY: "FX_DAILY",
    WEEKLY: "FX_WEEKLY",
    MONTHLY: "FX_MONTHLY"
  },
  CRYPTO: {
    RATE: "CURRENCY_EXCHANGE_RATE",
    DAILY: "DIGITAL_CURRENCY_DAILY",
    WEEKLY: "DIGITAL_CURRENCY_WEEKLY",
    MONTHLY: "DIGITAL_CURRENCY_MONTHLY"
  },
  TECHNICAL: {
    SMA: "SMA",
    EMA: "EMA",
    MACD: "MACD",
    RSI: "RSI",
    STOCH: "STOCH",
    BBANDS: "BBANDS",
    ADX: "ADX"
  }
};
