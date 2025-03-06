import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...fontFamily.sans],
        heading: ["Playfair Display", ...fontFamily.serif],
        serif: ["Cormorant Garamond", ...fontFamily.serif],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // New premium colors
        "p-100": "#F87C00",
        "p-200": "#5D3C00",
        "p-300": "#322115",

        // Dark mode colors
        "dark-100": "#1E1E1E", 
        "dark-200": "#181818", 
        "dark-300": "#141414", 
        "dark-400": "#121212", // Main dark background
        "dark-500": "#0F0F0F",
        "dark-600": "#0A0A0A",
        "dark-700": "#070707", 
        "dark-800": "#050505",
        "dark-900": "#000000",
        
        // Gray scale
        "gray-50":  "#F9F9F9",
        "gray-100": "#EBEBEB",
        "gray-200": "#DEDEDE",
        "gray-300": "#C8C8C8",
        "gray-400": "#B0B0B0",
        "gray-500": "#8E9196", // Neutral Gray
        "gray-600": "#666666",
        "gray-700": "#474747",
        "gray-800": "#2E2E2E",
        "gray-900": "#1A1A1A",
        
        // Premium colors - updated for better dark mode
        "premium-gold": "#F87C00",      // Updated to P-100
        "premium-gold-light": "#FFA857", // Lighter version of P-100
        "premium-gold-dark": "#5D3C00",  // P-200
        "premium-dark-900": "#322115",   // P-300
        "premium-dark-800": "#221A14",
        "premium-dark-700": "#1A1410",
        "premium-dark-600": "#222222",
        "premium-dark-500": "#2A2A2A",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(248, 124, 0, 0.05)",
        "premium-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 4px 12px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(248, 124, 0, 0.1)",
        smooth: "0 4px 20px -2px rgba(0, 0, 0, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.15)",
        hover: "0 10px 30px -5px rgba(0, 0, 0, 0.25), 0 5px 15px -3px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default config;
