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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
        // Botanical colors
				berry: {
					blue: '#3b82f6',
					red: '#ef4444',
					yellow: '#eab308',
					purple: '#8b5cf6',
					green: '#22c55e',
					orange: '#f97316',
          brown: '#7B3F00',
          teal: '#008080',
          blurple: '#5865F2',
				},
				plant: {
					light: '#F2FCE2',
					medium: '#86EFAC',
					dark: '#15803d',
					accent: '#4ADE80',
				},
				parchment: {
					light: '#f8fafc', 
					DEFAULT: '#f1f5f9',
					dark: '#e2e8f0',
				},
        puzzle: {
          off: "#8E9196",
          lo: "#0EA5E9",
          hi: "#8B5CF6",
          connection: "#403E43",
        
          primary: '#9b87f5',
          secondary: '#7E69AB',
          dark: '#1A1F2C',
          error: '#ea384c',
          success: '#4ade80',
          neutral: '#8E9196',
          highlight: '#D6BCFA',
          background: '#221F26',
        },
        industrial: {
					bg: '#1A1F2C',
					grid: '#8E9196',
					gridLine: '#F1F0FB',
					highlight: '#D6BCFA',
					current: '#1EAEDB',
					overlay: '#0000001a',
					error: '#ea384c',
					metal: '#aaadb0',
				}
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 8px 2px rgba(155, 135, 245, 0.2)' 
					},
					'50%': { 
						boxShadow: '0 0 12px 4px rgba(155, 135, 245, 0.5)' 
					},
				},
				'flash': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.6' },
				},
				'success-flash': {
					'0%': { backgroundColor: 'rgba(74, 222, 128, 0.6)' },
					'50%': { backgroundColor: 'rgba(74, 222, 128, 1)' },
					'100%': { backgroundColor: 'rgba(74, 222, 128, 0.8)' },
				},
				'error-flash': {
					'0%': { backgroundColor: 'rgba(234, 56, 76, 0.6)' },
					'50%': { backgroundColor: 'rgba(234, 56, 76, 1)' },
					'100%': { backgroundColor: 'rgba(234, 56, 76, 0.8)' },
				},
        'plant-grow': {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
        },
        'leaf-wiggle': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' }
        },
        'success-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(74, 222, 128, 0.6)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
				'flash': 'flash 3.5s ease-out',
				'success-flash': 'success-flash 1s ease-in-out',
				'error-flash': 'error-flash 0.5s ease-in-out',
        'plant-grow': 'plant-grow 0.5s ease-out forwards',
				'leaf-wiggle': 'leaf-wiggle 2s ease-in-out infinite',
				'success-pulse': 'success-pulse 1.5s ease-in-out infinite'
      },
      // Custom colors for our industrial theme
			backgroundImage: {
				'parchment-texture': "url('data:image/svg+xml;charset=utf8,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.04%22 stitchTiles=%22stitch%22%3E%3C%2FfeTurbulence%3E%3CfeColorMatrix type=%22saturate%22 values=%220%22%2F%3E%3C%2Ffilter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.1%22%2F%3E%3C%2Fsvg%3E')",
        'tallplant': "url('/tallplant.png')",
        'shortplant': "url('/shortplant.png')",
        'mediumplant': "url('/mediumplant.png')",
        'bushyplant': "url('/bushyplant.png')",
        'splitplant': "url('/splitplant.png')",
        'sprawlingplant': "url('/sprawlingplant.png')",
        'twistedplant': "url('/twistedplant.png')",
        'vineplant': "url('/vineplant.png')",
        'droopingplant': "url('/droopingplant.png')",

			}
		
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
