/**
 * AI深度分析组件
 * 更新时间：2025-11-27 17:11
 *
 * ⚠️ 重要说明：
 * - 本组件的交互逻辑已通过用户审核审定
 * - 包括支付确认流程、AI分析触发机制、错误处理逻辑等
 * - 任何UI或交互修改需要重新审核确认
 * - 开发环境白名单已配置，用于本地测试
 */
import React, { useState, useEffect } from 'react';
import { gua_ci } from '../data/hexagrams';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

interface AIDeepAnalysisProps {
  hexagramInfo: any;
  result: any;
  onAnalysisComplete?: (analysis: string) => void;
  onShowPayment?: () => void;
  triggerAnalysis?: boolean;
  onAnalysisStart?: () => void;
}

export const AIDeepAnalysis: React.FC<AIDeepAnalysisProps> = ({
  hexagramInfo,
  result,
  onAnalysisComplete,
  onShowPayment,
  triggerAnalysis,
  onAnalysisStart
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (triggerAnalysis && !analysisResult) {
      startAIAnalysis();
      if (onAnalysisStart) onAnalysisStart();
    }
  }, [triggerAnalysis]);

  const startAIAnalysis = async (retryCount = 0) => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const changedHexagramCode = result.changedCode || result.code;
      const changedHexagramInfo = gua_ci[changedHexagramCode] || hexagramInfo;

      const hexagramData = {
        original_hexagram: {
          name: hexagramInfo.name,
          alternate: hexagramInfo.alternate,
          meaning: hexagramInfo.meaning,
          structure: hexagramInfo.structure,
          yaos: result.yaos || []
        },
        changed_hexagram: {
          name: changedHexagramInfo.name,
          alternate: changedHexagramInfo.alternate,
          meaning: changedHexagramInfo.meaning,
          structure: changedHexagramInfo.structure
        },
        moving_lines: result.movingLines || []
      };

      const isDevelopment = import.meta.env.DEV;
      // 统一使用代理路径，避免CORS问题
      const apiUrl = '/api/ai-analysis';
      
      // 创建超时控制器 - 增加超时时间以适应AI分析耗时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hexagram_data: hexagramData }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`服务器错误: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('响应格式错误，未返回JSON');
      }

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        onAnalysisComplete?.(data.analysis);
      } else {
        throw new Error(data.error || 'AI解析失败');
      }
      
    } catch (err: any) {
      console.error('AI分析详细错误:', err);
      
      // 重试逻辑
      if (retryCount < 2 && !err.name?.includes('Abort')) {
        console.log(`重试第 ${retryCount + 1} 次...`);
        setTimeout(() => startAIAnalysis(retryCount + 1), 1000);
        return;
      }
      
      // 详细的错误分类
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        setError('请求超时，请检查网络连接后重试');
      } else if (err.message?.includes('fetch') || err.message?.includes('网络')) {
        setError('网络连接失败，请检查网络后重试');
      } else if (err.message?.includes('500') || err.message?.includes('服务器错误')) {
        setError('服务器暂时不可用，请稍后重试');
      } else if (err.message?.includes('401') || err.message?.includes('认证')) {
        setError('认证失败，请检查API配置');
      } else {
        setError('AI服务暂时不可用，请稍后重试');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleButtonClick = () => {
    if (onShowPayment) onShowPayment();
  };

  return (
    <div className="space-y-4">
      {!analysisResult ? (
        <div className="p-8 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-sm">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-slate-900 mb-2">深度解析</h4>
              <p className="text-slate-600 text-[15px]">正在为您深度解读...</p>
            </div>
          </div>
          <div className="pl-16">
            <button onClick={handleButtonClick} disabled={isAnalyzing} className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              {isAnalyzing ? '正在分析中...' : '获取深度解析'}
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 p-8 rounded-3xl">
          <div className="flex justify-between mb-4">
            <h4 className="text-lg font-semibold">解析结果</h4>
            <button onClick={() => setAnalysisResult('')} className="text-blue-600 text-sm">重新解析</button>
          </div>
          <div className="prose max-w-none text-slate-700">
            <ReactMarkdown>{analysisResult}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
