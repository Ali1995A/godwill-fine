/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css", // 包含CSS文件中的自定义类名
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
  // 安全列表：只保留核心业务类名，避免内存溢出
  safelist: [
    // 爻线样式类 - 核心业务类
    'gua-line-yang',
    'gua-line-yin',
    'gua-line-yin-segment',
    'gua-line-mutating',
    
    // 动画类 - 核心业务类
    'animate-fade-in-up',
    'animate-bounce-gentle',
    
    // 组件样式类 - 核心业务类
    'card',
    'btn-primary',
    'btn-secondary',
    'glass-card',
    'floating-card',
    
    // 仅保留最必要的动态类名模式
    // 避免宽泛的正则表达式，防止内存溢出
    {
      pattern: /animate-(fade-in-up|bounce-gentle)/,
    },
  ],
}