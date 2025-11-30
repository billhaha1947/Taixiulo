/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dragon: {
          red: '#FF0000',
          gold: '#FFD700',
          dark: '#1a0000',
          crimson: '#DC143C'
        }
      },
      backgroundImage: {
        'casino-gradient': 'linear-gradient(135deg, #1a0000 0%, #330000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'red-glow': 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)'
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,0,0,0.5)',
        'neon-gold': '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.5)',
        'inner-glow': 'inset 0 0 30px rgba(255,0,0,0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'dice-roll': 'spin 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,0,0,0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255,0,0,1)' }
        }
      }
    },
  },
  plugins: [],
}
