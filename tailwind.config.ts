
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

        // New dark mode colors
        "dark-100": "#1E1E1E", // Lightest dark background
        "dark-200": "#181818", 
        "dark-300": "#141414", 
        "dark-400": "#121212", // Main dark background
        "dark-500": "#0F0F0F",
        "dark-600": "#0A0A0A",
        "dark-700": "#070707", // Darkest dark background
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
        
        // Purple accent colors
        "purple-100": "#E5DEFF", // Soft Purple
        "purple-200": "#D6BCFA", // Light Purple
        "purple-300": "#B39DDB",
        "purple-400": "#9B87F5", // Primary Purple
        "purple-500": "#8B5CF6", // Vivid Purple
        "purple-600": "#7E69AB", // Secondary Purple
        "purple-700": "#6E59A5", // Tertiary Purple
        "purple-800": "#5E4A9D",
        "purple-900": "#1A1F2C", // Dark Purple
        
        // IP brand colors
        "ip-blue": "#1A3A6C",
        "ip-blue-600": "#14305A",
        "ip-blue-700": "#102648",
        "ip-blue-800": "#0C1C36", 
        "ip-blue-900": "#081424",
        "ip-blue-50": "#E5EAF2",
        "ip-blue-100": "#B3C3DC",
        
        "ip-teal": "#27B0AC",
        "ip-teal-600": "#1E8C89",
        "ip-teal-700": "#186865",
        "ip-teal-800": "#114443",
        "ip-teal-900": "#0B2C2B",
        "ip-teal-50": "#E6F5F5",
        "ip-teal-100": "#B0E3E1",
        
        // Premium colors - updated for better dark mode
        "premium-gold": "#DFBD69",
        "premium-gold-light": "#F1D689",
        "premium-gold-dark": "#C0A65C",
        "premium-dark-900": "#0A0A0A", 
        "premium-dark-800": "#121212",
        "premium-dark-700": "#1A1A1A",
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
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(223, 189, 105, 0.05)",
        "premium-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 4px 12px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(223, 189, 105, 0.1)",
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
