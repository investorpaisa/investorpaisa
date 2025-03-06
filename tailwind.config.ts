
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

        // Premium colors
        "premium-gold": "#DFBD69",
        "premium-gold-light": "#F1D689",
        "premium-gold-dark": "#C0A65C",
        "premium-dark-900": "#0A0B10", 
        "premium-dark-800": "#121420",
        "premium-dark-700": "#1A1E2E",
        "premium-dark-600": "#252A40",
        "premium-dark-500": "#303650",

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
        premium: "0 10px 30px -10px rgba(10, 11, 16, 0.8), 0 2px 8px -2px rgba(10, 11, 16, 0.5), 0 0 0 1px rgba(223, 189, 105, 0.05)",
        "premium-hover": "0 20px 40px -12px rgba(10, 11, 16, 0.8), 0 4px 12px -4px rgba(10, 11, 16, 0.5), 0 0 0 1px rgba(223, 189, 105, 0.1)",
        smooth: "0 4px 20px -2px rgba(10, 11, 16, 0.3), 0 2px 6px -1px rgba(10, 11, 16, 0.2)",
        hover: "0 10px 30px -5px rgba(10, 11, 16, 0.3), 0 5px 15px -3px rgba(10, 11, 16, 0.2)",
        glow: "0 0 15px rgba(223, 189, 105, 0.4), 0 0 30px rgba(223, 189, 105, 0.2)",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "100%": { left: "150%" },
        },
        reveal: {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)" 
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)" 
          },
        },
        glow: {
          "from": {
            boxShadow: "0 0 5px rgba(223, 189, 105, 0.2), 0 0 10px rgba(223, 189, 105, 0.1)"
          },
          "to": {
            boxShadow: "0 0 10px rgba(223, 189, 105, 0.4), 0 0 20px rgba(223, 189, 105, 0.2)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "float-reverse": "float 10s ease-in-out infinite reverse",
        "shimmer": "shimmer 2.5s infinite",
        "reveal": "reveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default config;
