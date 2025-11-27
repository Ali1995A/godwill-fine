import React, { useState } from 'react';
import { godwill, coinDivination, randomCoinToss, CoinDivinationResult } from './lib/divination';
import { gua_ci } from './data/hexagrams';
import { hexagramCharacteristics } from './data/hexagramCharacteristics';
import { HexagramCard } from './components/HexagramCard';
import { CoinTossAnimation } from './components/CoinTossAnimation';
import { PaymentModal } from './components/PaymentModal';
import { AIDeepAnalysis } from './components/AIDeepAnalysis';
import './index.css';

function App() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCoinTossDivination = async () => {
    setShowCoinToss(true);
  };

  const handleCoinTossComplete = (coinResults: number[]) => {
    setShowCoinToss(false);
    setIsLoading(true);
    
    // 模拟占卜过程
    setTimeout(() => {
      const divinationResult = coinDivination(coinResults);
      setResult(divinationResult);
      setIsLoading(false);
    }, 1000);
  };

  const handleRandomDivination = async () => {
    setIsLoading(true);
    
    // 模拟占卜过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 快速占卜也使用铜钱法算法，生成包含变爻的完整卦象
    const coinResults = randomCoinToss();
    const divinationResult = coinDivination(coinResults);
    setResult(divinationResult);
    setIsLoading(false);
  };


  const hexagramInfo = result ? gua_ci[result.code] : null;

  const [triggerAIAnalysis, setTriggerAIAnalysis] = useState(false);

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentConfirm = () => {
    setTriggerAIAnalysis(true);
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 头部 */}
        <header className="text-center mb-16 animate-fade-in-up max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-slate-900 mb-4 tracking-tight" style={{ fontFamily: "'KaiTi', '楷体', 'STKaiti', 'BiauKai', 'DFKai-SB', 'serif'", fontWeight: 700 }}>
            周易占卜
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-1">
            基于传统周易64卦的在线占卜工具
          </p>
          <p className="text-[15px] text-slate-500">
            传承古典智慧，洞察天机奥秘
          </p>
        </header>

        {/* 主内容区 */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 占卜操作区 */}
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-chinese tracking-tight">
              选择占卜方式
            </h2>
            
            <div className="space-y-5">
              {/* 铜钱投掷占卜 */}
              <div className="group">
                <div className="mb-3">
                  <span className="text-2xl">🔮</span>
                  <h3 className="text-lg font-medium text-slate-800 mt-2">
                    铜钱投掷占卜
                  </h3>
                </div>
                <button
                  onClick={handleCoinTossDivination}
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>占卜中</span>
                    </span>
                  ) : (
                    '开始占卜'
                  )}
                </button>
                <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                  传统三枚铜钱法，体验完整占卜仪式
                </p>
              </div>

              {/* 分割线 */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white/80 backdrop-blur-sm text-[13px] text-slate-500 font-medium">
                    或
                  </span>
                </div>
              </div>

              {/* 快速占卜 */}
              <div className="group">
                <div className="mb-3">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-lg font-medium text-slate-800 mt-2">
                    快速占卜
                  </h3>
                </div>
                <button
                  onClick={handleRandomDivination}
                  disabled={isLoading}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>占卜中</span>
                    </span>
                  ) : (
                    '快速开始'
                  )}
                </button>
                <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                  使用传统算法快速生成卦象
                </p>
              </div>
            </div>
          </div>

          {/* 加载动画 */}
          {isLoading && (
            <div className="card text-center animate-fade-in-up">
              <div className="flex flex-col items-center space-y-5">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-3 border-slate-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl animate-bounce-gentle">🔮</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-lg font-medium text-slate-800">正在为您占卜</p>
                  <p className="text-[13px] text-slate-500 animate-pulse-gentle">卦象即将显现</p>
                </div>
              </div>
            </div>
          )}

          {/* 占卜结果 */}
          {result && hexagramInfo && (
            <div className="space-y-6">
              <HexagramCard
                result={result}
                hexagramInfo={hexagramInfo}
              />
              
              {/* 深度解读内容 */}
              <div className="card animate-fade-in-up">
                {/* AI深度解析组件 */}
                <AIDeepAnalysis
                  hexagramInfo={hexagramInfo}
                  result={result}
                  onShowPayment={() => setShowPaymentModal(true)}
                  triggerAnalysis={triggerAIAnalysis}
                  onAnalysisStart={() => setTriggerAIAnalysis(false)}
                />
                  
                {/* 专业深度解析 - 苹果风格设计 */}
                <div className="mt-6 space-y-4">
                    {(() => {
                      const characteristics = hexagramCharacteristics[hexagramInfo.name];
                      if (!characteristics) return null;
                      
                      return (
                        <>
                          {/* 核心洞察 */}
                          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-sm">
                            <div className="flex items-start space-x-3 sm:space-x-4 mb-5">
                              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">核心洞察</h3>
                                <p className="text-[13px] sm:text-[14px] text-slate-600">基于《{hexagramInfo.name}》卦象的深层解读</p>
                              </div>
                            </div>
                            <div className="space-y-3 sm:pl-14">
                              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/50">
                                <div className="flex items-center space-x-2 mb-2.5">
                                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                  <h4 className="text-[15px] font-medium text-slate-900">卦象本质</h4>
                                </div>
                                <p className="text-[15px] text-slate-700 leading-relaxed">
                                  {hexagramInfo.name}（{hexagramInfo.alternate}）象征着<strong className="text-blue-600 font-semibold">{hexagramInfo.meaning}</strong>。
                                  {characteristics.advice}
                                </p>
                              </div>
                              
                              {result.movingLines && result.movingLines.length > 0 && (
                                <div className="bg-amber-50/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-amber-200/50">
                                  <div className="flex items-center space-x-2 mb-2.5">
                                    <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                                    <h4 className="text-[15px] font-medium text-amber-900">变化趋势</h4>
                                  </div>
                                  <p className="text-[15px] text-slate-700 leading-relaxed">
                                    本次占卜显示<strong className="text-amber-700 font-semibold">{result.movingLines.length}个变爻</strong>，
                                    预示着您的处境正在经历重要转变。变爻代表着变化的契机，
                                    是从当前状态向新状态过渡的关键节点。这种变化既是挑战也是机遇，
                                    需要您审时度势，顺应天时。
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 多维度分析 */}
                          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* 事业发展 */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2.5 mb-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">事业发展</h4>
                              </div>
                              <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.career}</p>
                            </div>

                            {/* 财富运势 */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2.5 mb-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">财富运势</h4>
                              </div>
                              <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.wealth}</p>
                            </div>

                            {/* 感情状况 */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2.5 mb-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">感情状况</h4>
                              </div>
                              <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.relationship}</p>
                            </div>

                            {/* 健康提示 */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2.5 mb-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">健康提示</h4>
                              </div>
                              <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.health}</p>
                            </div>
                          </div>

                          {/* 行动指南 */}
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 rounded-3xl p-6 sm:p-8 border border-indigo-200/50 shadow-sm">
                            <div className="flex items-start space-x-3 sm:space-x-4 mb-5">
                              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">行动指南</h3>
                                <p className="text-[13px] sm:text-[14px] text-slate-600">基于卦象的实践建议</p>
                              </div>
                            </div>
                            <div className="space-y-3 sm:pl-14">
                              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-indigo-200/50">
                                <div className="flex items-center space-x-2 mb-2.5">
                                  <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                                  <h4 className="text-[15px] font-medium text-slate-900">关注重点</h4>
                                </div>
                                <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.focus}</p>
                              </div>
                              
                              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-purple-200/50">
                                <div className="flex items-center space-x-2 mb-2.5">
                                  <div className="w-1 h-1 bg-purple-600 rounded-full"></div>
                                  <h4 className="text-[15px] font-medium text-slate-900">心态调整</h4>
                                </div>
                                <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.attitude}</p>
                              </div>
                              
                              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-pink-200/50">
                                <div className="flex items-center space-x-2 mb-2.5">
                                  <div className="w-1 h-1 bg-pink-600 rounded-full"></div>
                                  <h4 className="text-[15px] font-medium text-slate-900">时机把握</h4>
                                </div>
                                <p className="text-[15px] text-slate-700 leading-relaxed">{characteristics.timing}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
               </div>
             </div>
           </div>
         )}

          {/* 底部说明 */}
          <footer className="text-center mt-12">
            <div className="card">
              <p className="text-[13px] text-slate-500 leading-relaxed">本占卜工具基于传统周易理论，仅供娱乐参考</p>
              <p className="text-[12px] text-slate-400 mt-2">© 2025 传承古典智慧</p>
            </div>
          </footer>
        </div>
      </div>

      {/* 铜钱投掷动画 */}
      <CoinTossAnimation
        onComplete={handleCoinTossComplete}
        isActive={showCoinToss}
      />

      {/* 支付模态框 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        onPaymentConfirm={handlePaymentConfirm}
      />
    </div>
  );
}

export default App;
