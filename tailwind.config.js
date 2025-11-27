/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css"
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
  safelist: [
    // --- 核心业务样式 (保留) ---
    'gua-line-yang',
    'gua-line-yin',
    'gua-line-yin-segment',
    'gua-line-mutating',
    'animate-fade-in-up',
    'animate-bounce-gentle',
    'card',
    'btn-primary',
    'btn-secondary',
    'glass-card',
    'floating-card'
    // --- 危险的正则已全部移除 ---
  ]
}