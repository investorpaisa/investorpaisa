
export const RAPIDAPI_HOST = "alpha-vantage.p.rapidapi.com";
export const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") || "23ec2c7ac8mshca999ef26c89cebp1512c6jsne5275655a950";
export const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");

if (!ALPHA_VANTAGE_API_KEY) {
  console.warn("ALPHA_VANTAGE_API_KEY is not configured");
}
