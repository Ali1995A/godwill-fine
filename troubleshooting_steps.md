# AI解析超时问题 - 故障排除指南

## 🔧 深度故障排除步骤

### 步骤1: 彻底重启所有服务
```bash
# 1. 停止所有服务 (按 Ctrl+C)
# 2. 清理Node.js缓存
npm run build  # 清理构建缓存
# 3. 重新启动后端
cd backend && python app.py
# 4. 重新启动前端 (新终端)
npm run dev
```

### 步骤2: 检查浏览器控制台错误
1. 按F12打开开发者工具
2. 转到Network标签页
3. 点击"获取深度解析"
4. 查看是否有红色的错误请求
5. 复制错误信息

### 步骤3: 检查后端日志
观察Flask应用控制台输出：
- 是否显示"使用API密钥: xxx..."？
- 是否显示"DeepSeek API错误"？
- 是否有其他错误信息？

### 步骤4: 验证代理配置
在浏览器地址栏测试：
```
http://localhost:3000/api/health
```
应该返回: `{"status":"healthy",...}`

### 步骤5: 清除浏览器DNS缓存
Chrome: chrome://net-internals/#dns → Clear host cache
Edge: edge://net-internals/#dns → Clear host cache

### 步骤6: 检查网络代理设置
确保没有系统级代理干扰：
- Windows设置 → 网络 → 代理 → 关闭"自动检测代理"
- VPN用户请暂时断开VPN

### 步骤7: 测试API连通性
在浏览器地址栏直接访问：
```
http://localhost:5000/api/health
```
应该正常显示健康状态