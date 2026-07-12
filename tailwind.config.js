/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080a10',
          card: 'rgba(15, 20, 35, 0.65)',
          border: 'rgba(255, 255, 255, 0.07)',
          text: '#f3f4f6',
          muted: '#9ca3af'
        },
        neon: {
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#10b981',
          cyan: '#06b6d4',
          yellow: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.4)',
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.4)'
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
