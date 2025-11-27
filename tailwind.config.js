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
  // 安全列表：确保关键的自定义类名不被Tree-shaking清除
  safelist: [
    // 爻线样式类
    'gua-line-yang',
    'gua-line-yin',
    'gua-line-yin-segment',
    'gua-line-mutating',
    
    // 动画类
    'animate-fade-in-up',
    'animate-bounce-gentle',
    
    // 组件样式类
    'card',
    'btn-primary',
    'btn-secondary',
    
    // 玻璃态效果
    'glass-card',
    'floating-card',
    
    // 确保所有动态使用的类名
    {
      pattern: /bg-(slate|blue|indigo|purple|green|amber|red|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(slate|blue|indigo|purple|green|amber|red|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(slate|blue|indigo|purple|green|amber|red|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /shadow-(sm|md|lg|xl|2xl)/,
    },
    {
      pattern: /rounded-(sm|md|lg|xl|2xl|3xl|full)/,
    },
    {
      pattern: /p-(3|4|5|6|8)/,
    },
    {
      pattern: /px-(2|3|4|6|8)/,
    },
    {
      pattern: /py-(1|2|3|4|12|16)/,
    },
    {
      pattern: /space-(x|y)-(2|3|4|5|6|8|10)/,
    },
    {
      pattern: /w-(1|2|4|5|6|8|9|10|16|20|24|full)/,
    },
    {
      pattern: /h-(1|2|4|5|6|8|9|10|16|20|24|auto|px)/,
    },
    {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|5xl|6xl|7xl)/,
    },
    {
      pattern: /font-(light|normal|medium|semibold|bold)/,
    },
    {
      pattern: /from-(blue|indigo|purple|slate|gray|green|amber|red)-(50|100|400|500|600|700)/,
    },
    {
      pattern: /to-(blue|indigo|purple|slate|gray|green|amber|red)-(50|100|400|500|600|700)/,
    },
  ],
}