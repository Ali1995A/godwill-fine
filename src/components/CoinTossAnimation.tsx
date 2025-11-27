/**
 * 铜钱投掷动画组件
 * 更新时间：2025-11-27 17:11
 */
import React, { useState, useEffect } from 'react';

interface CoinTossAnimationProps {
  onComplete: (results: number[]) => void;
  isActive: boolean;
}

export const CoinTossAnimation: React.FC<CoinTossAnimationProps> = ({ 
  onComplete, 
  isActive 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coinResults, setCoinResults] = useState<number[]>([]);
  const [coins, setCoins] = useState<Array<{ id: number; flipping: boolean; result: number | null }>>([]);

  // 初始化三枚铜钱
  useEffect(() => {
    setCoins([
      { id: 1, flipping: false, result: null },
      { id: 2, flipping: false, result: null },
      { id: 3, flipping: false, result: null }
    ]);
  }, []);

  // 开始投掷动画
  const startToss = async () => {
    if (currentStep >= 6) return;

    // 重置铜钱状态
    setCoins(coins.map(coin => ({ ...coin, flipping: true, result: null })));

    // 模拟投掷过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 随机生成三枚铜钱的结果（2=字，3=背）
    const tossResults = Array.from({ length: 3 }, () => 
      Math.random() > 0.5 ? 3 : 2
    );

    // 更新铜钱显示结果
    setCoins(coins.map((coin, index) => ({
      ...coin,
      flipping: false,
      result: tossResults[index]
    })));

    // 计算本次投掷的总和
    const total = tossResults.reduce((sum, value) => sum + value, 0);
    
    // 根据总和确定爻的类型
    let yaoValue: number;
    if (total === 6) { // 3字 = 6
      yaoValue = 6; // 老阴（变爻）
    } else if (total === 7) { // 1背2字 = 7
      yaoValue = 7; // 少阳
    } else if (total === 8) { // 2背1字 = 8
      yaoValue = 8; // 少阴
    } else { // total === 9, 3背 = 9
      yaoValue = 9; // 老阳（变爻）
    }

    const newResults = [...coinResults, yaoValue];
    setCoinResults(newResults);
    setCurrentStep(currentStep + 1);

    // 如果完成6次投掷，调用完成回调
    if (currentStep + 1 >= 6) {
      setTimeout(() => onComplete(newResults), 1000);
    }
  };

  // 自动开始投掷
  useEffect(() => {
    if (isActive && currentStep < 6) {
      const timer = setTimeout(startToss, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4 border border-white/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/50 shadow-xl animate-bounce-gentle">
            <span className="text-3xl">💰</span>
          </div>
          <h3 className="text-3xl font-medium text-slate-800 mb-3 font-chinese">
            第 {currentStep + 1} 爻
          </h3>
          <p className="text-slate-600 text-lg">诚心投掷三枚铜钱</p>
          <div className="mt-3 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* 铜钱投掷动画 */}
        <div className="flex justify-center space-x-10 mb-8">
          {coins.map((coin) => (
            <div key={coin.id} className="flex flex-col items-center group">
              <div className={`relative w-24 h-24 rounded-full border-2 shadow-xl transition-all duration-700 transform group-hover:scale-110 ${
                coin.flipping
                  ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-blue-200 animate-bounce shadow-blue-300'
                  : coin.result
                    ? (coin.result === 2
                      ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-green-300'
                      : 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-purple-300')
                    : 'border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 shadow-slate-300'
              } flex items-center justify-center hover:shadow-2xl`}>
                
                {/* 铜钱中心方孔 */}
                <div className={`absolute w-8 h-8 border-2 rounded-sm rotate-45 ${
                  coin.flipping ? 'border-blue-300' :
                  coin.result ? (coin.result === 2 ? 'border-green-300' : 'border-purple-300') :
                  'border-slate-300'
                }`}></div>
                
                {/* 铜钱文字 */}
                {coin.result && (
                  <span className={`text-2xl font-bold z-10 ${
                    coin.result === 2 ? 'text-green-700' : 'text-purple-700'
                  }`}>
                    {coin.result === 2 ? '字' : '背'}
                  </span>
                )}
                
                {/* 投掷中的闪烁效果 */}
                {coin.flipping && (
                  <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-40"></div>
                )}
              </div>
              <span className="text-sm text-slate-600 mt-4 font-medium group-hover:text-slate-700 transition-colors">铜钱{coin.id}</span>
            </div>
          ))}
        </div>

        {/* 投掷结果和进度 */}
        <div className="text-center mb-6">
          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>占卜进度</span>
              <span>{currentStep}/6 爻</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {coinResults.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">
                本次投掷: <span className={
                  coinResults[coinResults.length - 1] === 6 ? 'text-gray-700' :
                  coinResults[coinResults.length - 1] === 7 ? 'text-green-600' :
                  coinResults[coinResults.length - 1] === 8 ? 'text-gray-600' : 'text-gray-700'
                }>
                  {coinResults[coinResults.length - 1] === 6 ? '老阴' :
                   coinResults[coinResults.length - 1] === 7 ? '少阳' :
                   coinResults[coinResults.length - 1] === 8 ? '少阴' : '老阳'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* 爻位预览 */}
        {coinResults.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl mb-4 border border-blue-100 shadow-inner">
            <h4 className="text-gray-900 text-center mb-4 font-light text-lg">当前卦象</h4>
            <div className="flex flex-col-reverse items-center space-y-3">
              {coinResults.map((result, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <span className="text-sm text-gray-600 w-8 text-right font-medium">
                    {['初', '二', '三', '四', '五', '上'][index]}
                  </span>
                  <div className="flex items-center justify-center rounded-lg transition-all duration-300 bg-white border border-gray-100 group-hover:shadow-md group-hover:scale-105">
                    <div className={`relative ${result === 6 || result === 9 ? 'gua-line-mutating' : ''}`}>
                      {result === 6 || result === 8 ? (
                        // 阴爻 - 断线
                        <div className="gua-line-yin">
                          <div className="gua-line-yin-segment"></div>
                          <div className="gua-line-yin-segment"></div>
                        </div>
                      ) : (
                        // 阳爻 - 实线
                        <div className="gua-line-yang"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium min-w-12">
                    {result === 6 ? '老阴' :
                     result === 7 ? '少阳' :
                     result === 8 ? '少阴' : '老阳'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700">正在生成第 {currentStep + 1} 爻</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};