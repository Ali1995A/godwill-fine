/**
 * AI深度分析组件
 * 更新时间：2025-11-27 17:11
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

  const startAIAnalysis = async () => {
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
      const apiUrl = isDevelopment ? 'http://localhost:5000/api/ai-analysis' : '/api/ai-analysis';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hexagram_data: hexagramData })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        onAnalysisComplete?.(data.analysis);
      } else {
        throw new Error(data.error || 'AI解析失败');
      }
      
    } catch (err) {
      setError('AI解析失败，请稍后重试');
      console.error('AI分析错误:', err);
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
