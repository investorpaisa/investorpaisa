
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
				// Premium colors for Investor Paisa
				"ip-gold": {
					DEFAULT: "#E6B45E",
					50: "#FCF7ED",
					100: "#F9EFDB",
					200: "#F3DFB6",
					300: "#EED092",
					400: "#E8C06D",
					500: "#E6B45E",
					600: "#DF9F2F",
					700: "#BD8420",
					800: "#8C6218",
					900: "#5A3F10"
				},
				"ip-purple": {
					DEFAULT: "#9C6ADE",
					50: "#F4EEFB",
					100: "#E9DDF7",
					200: "#D3BCF0",
					300: "#BE9BE8",
					400: "#AA82E1",
					500: "#9C6ADE",
					600: "#7E3CD4",
					700: "#6626B6",
					800: "#4D1D88",
					900: "#34135A"
				},
				"ip-dark": {
					DEFAULT: "#111419",
					50: "#F2F3F4",
					100: "#E5E6E9",
					200: "#CDD0D4",
					300: "#B4B8BF",
					400: "#9CA2AB",
					500: "#838B97",
					600: "#697480",
					700: "#505866",
					800: "#373C46",
					900: "#111419"
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
				},
				// Premium dark colors - Cred-inspired
				"premium-dark": {
					DEFAULT: "#141418",
					50: "#F2F2F6",
					100: "#E5E5ED",
					200: "#CDCDDB",
					300: "#B4B4C9",
					400: "#9A9AB7",
					500: "#8080A5",
					600: "#66668C",
					700: "#4D4D69",
					800: "#333346",
					900: "#141418"
				},
				"premium-gold": {
					DEFAULT: "#ECBF45",
					50: "#FDF9ED",
					100: "#FBF3DB",
					200: "#F7E8B7",
					300: "#F3DD93",
					400: "#EFD26F",
					500: "#ECBF45",
					600: "#E6AD18",
					700: "#BC8C10",
					800: "#8D680C",
					900: "#5E4508"
				},
				"premium-charcoal": {
					DEFAULT: "#1A1A22",
					50: "#E9E9EA",
					100: "#D2D2D6",
					200: "#A5A5AD",
					300: "#797984",
					400: "#4C4C5B",
					500: "#1A1A22",
					600: "#17171E",
					700: "#14141A",
					800: "#111116",
					900: "#0E0E12"
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
				},
				"glow": {
					'0%, 100%': { 
						boxShadow: '0 0 15px rgba(236, 191, 69, 0.3), 0 0 30px rgba(236, 191, 69, 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 25px rgba(236, 191, 69, 0.5), 0 0 50px rgba(236, 191, 69, 0.2)' 
					}
				},
				"shimmer": {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				}
			},
			animation: {
				"accordion-down": 'accordion-down 0.2s ease-out',
				"accordion-up": 'accordion-up 0.2s ease-out',
				"fade-in": 'fade-in 0.3s ease-out',
				"fade-up": 'fade-up 0.4s ease-out',
				"slide-in-right": 'slide-in-right 0.4s ease-out',
				"slide-in-left": 'slide-in-left 0.4s ease-out',
				"glow": 'glow 2s ease-in-out infinite',
				"shimmer": 'shimmer 2s linear infinite'
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				heading: ['Cormorant Garamond', 'serif']
			},
			boxShadow: {
				'smooth': '0 4px 20px rgba(0, 0, 0, 0.15)',
				'hover': '0 10px 25px rgba(0, 0, 0, 0.2)',
				'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
				'premium': '0 8px 30px rgba(0, 0, 0, 0.25)', 
				'premium-hover': '0 12px 40px rgba(0, 0, 0, 0.35), 0 0 15px rgba(236, 191, 69, 0.1)'
			},
			backgroundImage: {
				'gradient-premium': 'linear-gradient(135deg, #141418 0%, #1A1A22 100%)',
				'gradient-gold': 'linear-gradient(135deg, #ECBF45 0%, #E6AD18 100%)',
				'gradient-card': 'linear-gradient(180deg, rgba(26, 26, 34, 0.8) 0%, rgba(20, 20, 24, 0.9) 100%)',
				'gradient-dark': 'linear-gradient(180deg, #141418 0%, #0E0E12 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
