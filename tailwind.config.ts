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
        sans: ["Gilroy", ...fontFamily.sans],
        heading: ["Gilroy", ...fontFamily.sans],
        serif: ["Georgia", ...fontFamily.serif],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary brand colors
        gold: "#DFBD69",
        "gold-light": "#F1D689",
        "gold-dark": "#C0A65C",
        
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
        premium: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(223, 189, 105, 0.1)",
        "premium-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(223, 189, 105, 0.2)",
        smooth: "0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -3px rgba(0, 0, 0, 0.05)",
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
