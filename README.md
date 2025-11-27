# 周易占卜系统

基于传统周易64卦的现代化在线占卜工具，集成DeepSeek AI深度解析功能。

## 功能特点

- 🎯 **传统算法**：基于"混沌初开"传统占卜算法
- 💰 **铜钱投掷**：完整的三枚铜钱投掷仪式体验
- 🤖 **AI解析**：集成DeepSeek模型进行深度卦象解析
- 💳 **付费模式**：基础结果免费 + 深度解读付费
- 🎨 **现代UI**：简洁美观的现代化界面设计

## 技术栈

### 前端
- React + TypeScript
- Tailwind CSS
- Vite

### 后端
- Vercel Serverless Functions (Node.js)
- DeepSeek API

## 快速开始

### 1. 前端启动

```bash
cd gwill-web
npm install
npm run dev
```

前端将在 http://localhost:5173 运行

### 2. 环境变量配置

在项目根目录创建 `.env` 文件或在 Vercel 中配置：

```env
# DeepSeek API密钥
DEEPSEEK_API_KEY=your-deepseek-api-key-here

# 可选：外部API基础URL（如使用外部后端）
VITE_API_BASE_URL=
```

## API接口

### 健康检查
```
GET /api/health
```

### 起卦接口
```
POST /api/divine
Content-Type: application/json

{
  "coin_results": [6,7,8,9,7,8]  // 6次投掷结果
}
```

### AI深度解析
```
POST /api/ai-analysis
Content-Type: application/json

{
  "hexagram_data": {
    "original_hexagram": {
      "name": "乾卦",
      "alternate": "乾为天",
      "meaning": "刚健中正",
      "structure": "上乾下乾",
      "yaos": [9,7,8,7,9,8]
    },
    "changed_hexagram": {
      "name": "坤卦", 
      "alternate": "坤为地",
      "meaning": "柔顺伸展",
      "structure": "上坤下坤"
    },
    "moving_lines": [0,4]  // 变爻位置
  }
}
```

## 卦象数据

系统包含完整的64卦数据，包括：
- 卦名和别名
- 卦象含义
- 卦辞原文
- 卦象结构

## 商业模式

- **基础结果**：免费显示卦象基本信息
- **深度解读**：付费解锁AI深度解析（¥0.9）
  - 变卦分析
  - 爻辞详解  
  - AI个性化建议

## 开发说明

### 卦象显示规则
- 爻位从下往上显示：初爻（最下）到上爻（最上）
- 阳爻：实线（─）
- 阴爻：虚线（--）
- 变爻：红色标记

### 铜钱投掷算法
- 3背 (9)：老阳（变爻，阳变阴）
- 3字 (6)：老阴（变爻，阴变阳）
- 2背1字 (8)：少阴（不变）
- 1背2字 (7)：少阳（不变）

## 部署

### Vercel一键部署

项目已配置为全栈部署，前端和Serverless Functions将同时部署：

```bash
# 安装依赖
npm install

# 构建并部署
npm run build
vercel --prod
```

### 环境变量配置

在Vercel项目中配置以下环境变量：

```env
DEEPSEEK_API_KEY=your-actual-deepseek-api-key
```

### 架构说明

- **前端**: React + TypeScript + Vite
- **后端**: Vercel Serverless Functions (Node.js)
- **AI服务**: DeepSeek API集成
- **字体**: 微软雅黑等细黑字体，优化中文显示效果

## 许可证

MIT License