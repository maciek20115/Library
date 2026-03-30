/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        trading: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#21262d',
          panel: '#1c2128',
          green: '#00c853',
          red: '#ff1744',
          yellow: '#ffd600',
          blue: '#2979ff',
          purple: '#7c4dff',
          text: '#e6edf3',
          muted: '#8b949e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

