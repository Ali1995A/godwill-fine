// gwill-web/api/ai-analysis.js
module.exports = async (req, res) => {
  // 1. Handle CORS (Optional but recommended)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Your Logic
  try {
    const { hexagram_data } = req.body || {};

    if (!hexagram_data) {
      return res.status(400).json({ error: '缺少卦象数据' });
    }

    // 获取DeepSeek API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey || apiKey === 'your-deepseek-api-key-here') {
      return res.status(500).json({ 
        error: 'DeepSeek API密钥未配置',
        success: false 
      });
    }

    // 构建卦象信息
    const original_hexagram = hexagram_data.original_hexagram || {};
    const changed_hexagram = hexagram_data.changed_hexagram || {};
    const moving_lines = hexagram_data.moving_lines || [];

    const original_name = original_hexagram.name || '';
    const original_alternate = original_hexagram.alternate || '';
    const original_meaning = original_hexagram.meaning || '';
    const original_structure = original_hexagram.structure || '';
    
    const changed_name = changed_hexagram.name || '';
    const changed_meaning = changed_hexagram.meaning || '';

    // 构建提示词
    const prompt = `
作为周易专家，请对${original_name}（${original_alternate}）进行深度解析。

卦象含义：${original_meaning}
变卦：${changed_name}（${changed_meaning}）
变爻：${moving_lines.length}个

请从以下角度解析：
1. 卦象整体意义
2. 当前运势分析
3. 变卦转变意义
4. 个性化建议
5. 近期行动指南

请用简洁专业的语言进行解析，结合现代生活实际。
`;

    // 3. Call DeepSeek using native fetch
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通周易传统文化的专家，擅长用现代语言解读卦象，为求卦者提供智慧和指导。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
      timeout: 60000 // 60秒超时
    });

    if (response.ok) {
      const result = await response.json();
      const analysis = result.choices[0].message.content;

      return res.status(200).json({
        success: true,
        analysis: analysis,
        hexagram_name: original_name,
        hexagram_number: '',
        is_simulated: false
      });
    } else {
      console.error('DeepSeek API错误:', response.status, await response.text());
      
      // 返回模拟结果作为降级方案
      const simulatedAnalysis = `
## ${original_name}深度解析（API调用失败，使用模拟结果）

### 卦象整体意义
${original_name}（${original_alternate}）象征着${original_meaning}。

### 当前运势分析
根据卦象显示，您正处于一个${original_meaning}的阶段。

### 个性化建议
建议保持积极心态，抓住机遇。

**注意：DeepSeek API调用失败，这是模拟解析。**
`;

      return res.status(200).json({
        success: true,
        analysis: simulatedAnalysis,
        hexagram_name: original_name,
        hexagram_number: '',
        is_simulated: true,
        api_error: `DeepSeek API错误: ${response.status}`
      });
    }

  } catch (error) {
    console.error('服务器错误:', error);
    
    return res.status(500).json({
      success: false,
      error: `服务器错误: ${error.message}`
    });
  }
};