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
        },
        "magnetic-hover": {
          "0%": { transform: "scale(1) translateY(0)" },
          "100%": { transform: "scale(1.05) translateY(-5px)" },
        },
        "float-complex": {
          "0%, 100%": { 
            transform: "translateY(0) rotate(0deg)",
            filter: "hue-rotate(0deg)"
          },
          "33%": { 
            transform: "translateY(-10px) rotate(1deg)",
            filter: "hue-rotate(90deg)"
          },
          "66%": { 
            transform: "translateY(-5px) rotate(-1deg)",
            filter: "hue-rotate(180deg)"
          },
        },
        "pulse-scale": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "1"
          },
          "50%": { 
            transform: "scale(1.1)",
            opacity: "0.8"
          },
        },
        "slide-in-bottom": {
          "0%": { 
            transform: "translateY(100px)",
            opacity: "0"
          },
          "100%": { 
            transform: "translateY(0)",
            opacity: "1"
          },
        },
        "slide-in-right": {
          "0%": { 
            transform: "translateX(100px)",
            opacity: "0"
          },
          "100%": { 
            transform: "translateX(0)",
            opacity: "1"
          },
        },
        "rotate-in-scale": {
          "0%": { 
            transform: "rotate(-180deg) scale(0.5)",
            opacity: "0"
          },
          "100%": { 
            transform: "rotate(0deg) scale(1)",
            opacity: "1"
          },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(139, 69, 255, 0.4)"
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(139, 69, 255, 0.8), 0 0 60px rgba(255, 107, 158, 0.4)"
          },
        },
        "backdrop-blur-in": {
          "0%": { 
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(30, 30, 40, 0)"
          },
          "100%": { 
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(30, 30, 40, 0.8)"
          },
        },
        "typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink": {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "rgb(139, 69, 255)" },
        },
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
        "magnetic-hover": "magnetic-hover 0.3s ease-out",
        "float-complex": "float-complex 8s ease-in-out infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "slide-in-bottom": "slide-in-bottom 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "rotate-in-scale": "rotate-in-scale 0.8s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "backdrop-blur-in": "backdrop-blur-in 0.5s ease-out",
        "typing": "typing 3s steps(40) 1s forwards",
        "blink": "blink 1s infinite",
      },
      backgroundImage: {
        'gradient-cred': 'linear-gradient(135deg, rgb(139, 69, 255) 0%, rgb(255, 107, 158) 100%)',
        'gradient-cred-reverse': 'linear-gradient(135deg, rgb(255, 107, 158) 0%, rgb(139, 69, 255) 100%)',
        'gradient-green': 'linear-gradient(135deg, rgb(45, 212, 191) 0%, rgb(34, 197, 94) 100%)',
        'gradient-orange': 'linear-gradient(135deg, rgb(255, 159, 67) 0%, rgb(251, 146, 60) 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(circle at 20% 50%, rgb(139, 69, 255) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgb(255, 107, 158) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgb(45, 212, 191) 0%, transparent 50%)',
      },
      backdropBlur: {
        'xs': '2px',
        'cred': '20px',
      },
      blur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'cred': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default config;
