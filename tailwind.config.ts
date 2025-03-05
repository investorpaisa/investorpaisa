
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for Investor Paisa
				"ip-blue": {
					DEFAULT: "#0A2540",
					50: "#F7F9FC",
					100: "#E3E8F0",
					200: "#C5D0E0",
					300: "#A7B8D0",
					400: "#89A0C0",
					500: "#6B88B0",
					600: "#4D70A0",
					700: "#365890",
					800: "#1E4080",
					900: "#0A2540"
				},
				"ip-teal": {
					DEFAULT: "#36B37E",
					50: "#E6F7F0",
					100: "#CEEEE1",
					200: "#9DDFC3",
					300: "#6CD0A5",
					400: "#3BC187",
					500: "#36B37E",
					600: "#2E9A69",
					700: "#268154",
					800: "#1E683F",
					900: "#165030"
				},
				"ip-gray": {
					DEFAULT: "#627D98",
					50: "#F7F9FC",
					100: "#E5E9F0",
					200: "#D0D9E5",
					300: "#BAC8DA",
					400: "#A5B8CF",
					500: "#8FA7C4",
					600: "#7A97B9",
					700: "#6586AE",
					800: "#4F76A3",
					900: "#627D98"
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				"fade-in": {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				"fade-up": {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				"slide-in-right": {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				"slide-in-left": {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				}
			},
			animation: {
				"accordion-down": 'accordion-down 0.2s ease-out',
				"accordion-up": 'accordion-up 0.2s ease-out',
				"fade-in": 'fade-in 0.3s ease-out',
				"fade-up": 'fade-up 0.4s ease-out',
				"slide-in-right": 'slide-in-right 0.4s ease-out',
				"slide-in-left": 'slide-in-left 0.4s ease-out'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			},
			boxShadow: {
				'smooth': '0 4px 20px rgba(0, 0, 0, 0.05)',
				'hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
				'card': '0 2px 10px rgba(0, 0, 0, 0.03)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
