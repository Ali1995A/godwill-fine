#!/bin/bash

# Vercel部署脚本 - 解决缓存和文件大小写问题

echo "🚀 开始Vercel部署..."

# 清除可能的缓存
echo "🧹 清除构建缓存..."
rm -rf node_modules/.cache
rm -rf .vite
rm -rf dist

# 重新安装依赖
echo "📦 重新安装依赖..."
npm ci

# 构建CSS
echo "🎨 构建CSS..."
npm run build:css

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建输出目录: dist/"
    ls -la dist/
else
    echo "❌ 构建失败！"
    exit 1
fi

echo "🎉 部署准备完成！"