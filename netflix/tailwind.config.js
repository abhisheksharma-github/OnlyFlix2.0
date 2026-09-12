/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          DEFAULT: '#E50914',
          hover: '#FF1E27',
          dark: '#B80710',
          glow: 'rgba(229, 9, 20, 0.35)',
        },
        canvas: {
          base: '#08080A',
          subtle: '#0F1015',
          card: '#15161E',
          cardHover: '#1B1D28',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          muted: '#8A8D9F',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to top, #08080A 0%, rgba(8, 8, 10, 0.7) 40%, rgba(8, 8, 10, 0.2) 75%, rgba(8, 8, 10, 0.8) 100%)',
        'hero-radial': 'radial-gradient(ellipse at 80% 20%, rgba(229, 9, 20, 0.15), transparent 70%)',
        'card-gradient': 'linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(229, 9, 20, 0.3)',
        'glow-lg': '0 0 35px -5px rgba(229, 9, 20, 0.4)',
        'tactile': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'modal': '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
