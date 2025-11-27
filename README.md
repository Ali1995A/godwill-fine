# Godwill 周易占卜系统

基于传统周易64卦的现代化在线占卜工具，集成DeepSeek AI深度解析功能。项目包含完整的Python命令行工具和现代化的Web前端界面。

## 🌟 项目特色

### 双模式架构
- **命令行工具**: 基于Python的传统周易占卜命令行工具
- **Web前端**: 现代化的React + TypeScript在线占卜界面
- **AI集成**: 深度集成DeepSeek AI进行卦象解析

### 传统算法
- 🎯 **混沌初开**: 基于传统"混沌初开"占卜算法
- 💰 **铜钱投掷**: 完整的三枚铜钱投掷仪式体验
- 📜 **完整64卦**: 包含完整的周易64卦卦辞和详细解释

### 现代技术
- 🤖 **AI解析**: 集成DeepSeek模型进行深度卦象解析
- 💳 **付费模式**: 基础结果免费 + 深度解读付费
- 🎨 **现代UI**: 简洁美观的现代化界面设计
- 📱 **响应式**: 支持桌面和移动设备访问

## 🏗️ 项目架构

```
godwill/
├── gwill/                    # Python命令行工具核心包
│   ├── changes/             # 占卜算法
│   │   ├── BChanges.py      # 核心占卜逻辑
│   │   └── DrawGossip.py    # 图形绘制功能
│   ├── conf/                # 配置
│   │   └── GuaCi.py         # 卦辞配置
│   └── data/                # 数据
│       └── gua_ci/          # 64卦卦辞文件
│           ├── i_000000 到 i_111111  # 64个卦的卦辞
│           └── gwill_solution.py    # 卦象解决方案字典
├── src/                     # React前端源码
│   ├── components/          # React组件
│   │   ├── AIDeepAnalysis.tsx      # AI深度解析组件
│   │   ├── CoinTossAnimation.tsx   # 铜钱投掷动画
│   │   ├── HexagramCard.tsx        # 卦象卡片
│   │   ├── HexagramDisplay.tsx     # 卦象显示
│   │   └── PaymentModal.tsx        # 支付模态框
│   ├── data/                # 前端数据
│   │   ├── hexagrams.ts            # 卦象数据
│   │   └── hexagramCharacteristics.ts # 卦象特性
│   └── lib/                 # 工具库
│       └── divination.ts           # 占卜算法
├── backend/                 # Flask后端服务
│   ├── app.py              # 主应用文件
│   ├── requirements.txt    # Python依赖
│   └── test_*.py          # 测试文件
├── test/                   # Python测试
├── setup.py               # Python包安装配置
├── package.json           # Node.js依赖配置
└── vite.config.ts         # Vite构建配置
```

## 🚀 快速开始

### 1. Python命令行工具

#### 安装方法
```bash
# 克隆仓库
git clone https://github.com/Ali1995A/godwill.git
cd godwill

# 安装Python包
python setup.py install
```

#### 使用方法
```bash
# 随机占卜
gwill

# 输入特定数字进行占卜（最多6个数字）
gwill 1 2 3 4 5 6
```

#### 参数说明
- 支持输入1-6个整数
- 如果不输入参数，程序会自动随机生成数字
- 数字用于种子值，影响占卜结果

### 2. Web前端应用

#### 前端启动
```bash
# 安装前端依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:3000 运行

#### 后端启动
```bash
# 进入后端目录
cd backend

# 安装Python依赖
pip install -r requirements.txt

# 启动Flask服务器
python app.py
```

后端将在 http://localhost:5000 运行

### 3. 环境变量配置

在项目根目录创建 `.env` 文件或在部署平台中配置：

```env
# DeepSeek API密钥（用于AI深度解析）
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here

# 可选：外部API基础URL（如使用外部后端）
VITE_API_BASE_URL=http://localhost:5000
```

## 📡 API接口

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

## 📊 卦象数据

系统包含完整的64卦数据，包括：
- 卦名和别名
- 卦象含义
- 卦辞原文
- 卦象结构
- 变爻分析

## 💰 商业模式

- **基础结果**: 免费显示卦象基本信息
- **深度解读**: 付费解锁AI深度解析（¥0.9）
  - 变卦分析
  - 爻辞详解  
  - AI个性化建议
  - 多维度运势分析

## 🔧 开发说明

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

### 混沌初开算法
1. **混沌初开**: 将49颗算子分为天、地、人三部分
2. **三次变化**: 通过3次变化过程生成最终卦象
3. **二进制编码**: 使用6个爻位生成64卦的二进制编码

## 🚀 部署

### 前端部署 (Vercel)

项目已配置为全栈部署，前端和Serverless Functions将同时部署：

```bash
# 安装依赖
npm install

# 构建并部署
npm run build
vercel --prod
```

### 后端部署

```bash
# 使用Gunicorn部署Flask应用
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 环境变量配置

在部署平台中配置以下环境变量：

```env
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
```

## 🛠️ 技术栈

### 前端技术
- **React 18** + **TypeScript**
- **Tailwind CSS** - 现代化CSS框架
- **Vite** - 快速构建工具
- **ESLint** - 代码质量检查

### 后端技术
- **Flask** - Python Web框架
- **Flask-CORS** - 跨域支持
- **DeepSeek API** - AI模型集成
- **python-dotenv** - 环境变量管理

### 命令行工具
- **Python 3.7+** - 核心编程语言
- **setuptools** - 包管理
- **pytest** - 测试框架

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目Issues页面](https://github.com/Ali1995A/godwill/issues)
- 邮箱: 274935730@qq.com

---

**注意**: 本占卜工具基于传统周易理论，仅供娱乐参考。卦辞内容基于传统易经解释，建议理性看待占卜结果。