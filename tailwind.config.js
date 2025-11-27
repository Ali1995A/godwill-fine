/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ancient': {
          gold: '#D4AF37',
          dark: '#2F1B14',
          light: '#F4E4BC'
        }
      },
      fontFamily: {
        'chinese': ['Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', 'Source Han Sans SC', 'sans-serif']
      }
    },
  },
  plugins: [],
}