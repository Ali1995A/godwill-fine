@echo off
echo 🚀 开始Vercel部署...

echo 🧹 清除构建缓存...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist

echo 📦 重新安装依赖...
npm ci

echo 🎨 构建CSS...
npm run build:css

echo 🔨 构建项目...
npm run build

echo 📁 检查构建结果...
if exist dist (
    echo ✅ 构建成功！
    echo 📁 构建输出目录: dist/
    dir dist
) else (
    echo ❌ 构建失败！
    exit /b 1
)

echo 🎉 部署准备完成！
pause