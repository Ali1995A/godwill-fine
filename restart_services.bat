@echo off
echo =====================================
echo  AI解析服务重启脚本
echo =====================================
echo.

echo [1/5] 清理前端缓存...
npm run build
if errorlevel 1 (
    echo 错误: npm build 失败
    pause
    exit /b 1
)
echo.

echo [2/5] 停止所有Node进程...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul
echo.

echo [3/5] 等待服务完全停止...
timeout /t 3 /nobreak >nul
echo.

echo [4/5] 启动后端服务...
start "Backend Service" cmd /k "cd backend && python app.py"
timeout /t 5 /nobreak >nul
echo.

echo [5/5] 启动前端服务...
start "Frontend Service" cmd /k "npm run dev"
timeout /t 10 /nobreak >nul
echo.

echo =====================================
echo  服务启动完成！
echo  前端: http://localhost:3000
echo  后端API: http://localhost:5000
echo =====================================
echo.
echo 请稍等30秒让服务完全启动，然后访问前端进行测试
echo.
pause