const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function buildPrompt(hexagramData) {
  const original = hexagramData?.original_hexagram || {};
  const changed = hexagramData?.changed_hexagram || {};
  const movingLines = hexagramData?.moving_lines || [];

  const originalName = original.name || '';
  const originalAlternate = original.alternate || '';
  const originalMeaning = original.meaning || '';
  const changedName = changed.name || '';
  const changedMeaning = changed.meaning || '';

  return [
    `作为周易专家，请对${originalName}（${originalAlternate}）进行深度解析。`,
    ``,
    `卦象含义：${originalMeaning}`,
    `变卦：${changedName}（${changedMeaning}）`,
    `变爻：${movingLines.length}个`,
    ``,
    `请从以下角度解析：`,
    `1. 卦象整体意义`,
    `2. 当前运势分析`,
    `3. 变卦转变意义`,
    `4. 个性化建议`,
    `5. 近期行动指南`,
    ``,
    `请用简洁专业的语言进行解析，结合现代生活实际。`
  ].join('\n');
}

function buildFallbackAnalysis(hexagramData, reason) {
  const original = hexagramData?.original_hexagram || {};
  const originalName = original.name || '未知卦';
  const originalAlternate = original.alternate || '';
  const originalMeaning = original.meaning || '未知含义';

  return [
    `## ${originalName}深度解析（AI调用失败，使用模拟结果）`,
    ``,
    `### 卦象整体意义`,
    `${originalName}（${originalAlternate}）象征着${originalMeaning}。`,
    ``,
    `### 当前运势分析`,
    `根据卦象显示，您正处于一个${originalMeaning}的阶段。`,
    ``,
    `### 个性化建议`,
    `建议保持冷静，理性分析，等待合适时机。`,
    ``,
    `**注意：${reason || 'AI服务暂时不可用'}**`
  ].join('\n');
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      status: 'ok',
      message: 'Use POST with hexagram_data to request analysis.'
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      success: false,
      error: 'API密钥未配置，请检查环境变量DEEPSEEK_API_KEY'
    });
    return;
  }

  try {
    const hexagramData = req.body?.hexagram_data || {};
    const prompt = buildPrompt(hexagramData);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是一位精通周易传统文化的专家，擅长用现代语言解读卦象，为求卦者提供智慧和指导。'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      const fallback = buildFallbackAnalysis(hexagramData, `DeepSeek API错误: ${response.status}`);
      res.status(200).json({
        success: true,
        analysis: fallback,
        is_simulated: true,
        api_error: errorText || `DeepSeek API错误: ${response.status}`
      });
      return;
    }

    const data = await response.json();
    const analysis = data?.choices?.[0]?.message?.content || '';

    res.status(200).json({
      success: true,
      analysis,
      is_simulated: false
    });
  } catch (err) {
    const fallback = buildFallbackAnalysis(req.body?.hexagram_data, 'AI服务暂时不可用');
    res.status(200).json({
      success: true,
      analysis: fallback,
      is_simulated: true,
      api_error: err?.message || 'Unknown error'
    });
  }
};
