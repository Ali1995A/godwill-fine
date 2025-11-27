import React from 'react';
import { DivinationResult, CoinDivinationResult } from '../lib/divination';
import { HexagramInfo } from '../data/hexagrams';
import { HexagramDisplay } from './HexagramDisplay';

interface HexagramCardProps {
  result: DivinationResult | CoinDivinationResult;
  hexagramInfo: HexagramInfo;
}

export const HexagramCard: React.FC<HexagramCardProps> = ({ result, hexagramInfo }) => {
  const isCoinDivination = 'movingLines' in result;
  const coinResult = result as CoinDivinationResult;
  
  return (
    <div className="glass-card floating-card animate-fade-in-up">
      {/* 卦象显示 */}
      <div className="text-center mb-8">
        <div className="relative">
          <HexagramDisplay
            yaos={result.yaos}
            animate={true}
          />
          {/* 添加装饰性元素 */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm animate-bounce-gentle">
            🔮
          </div>
        </div>
      </div>

      {/* 卦名信息 */}
      <div className="text-center space-y-4">
        <div className="space-y-3">
          <h2 className="text-5xl md:text-6xl text-slate-900 tracking-tight" style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif', fontWeight: 700 }}>
            {hexagramInfo.name}
          </h2>
          <p className="text-lg text-slate-700 tracking-tight" style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif', fontWeight: 300 }}>
            {hexagramInfo.alternate}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto" style={{ fontFamily: '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif', fontWeight: 300 }}>
            {hexagramInfo.meaning}
          </p>
        </div>
        
        {/* 变卦信息 */}
        {isCoinDivination && coinResult.movingLines.length > 0 && (
          <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 mt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">变</span>
              </span>
              <p className="text-amber-700 font-medium">
                变卦信息
              </p>
            </div>
            <p className="text-amber-600 font-medium mb-2">
              {coinResult.movingLines.length} 个变爻
            </p>
            <p className="text-sm text-amber-600/80">
              变爻位置: {coinResult.movingLines.map(pos => ['初', '二', '三', '四', '五', '上'][pos]).join('、')}
            </p>
          </div>
        )}
        
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200/50">
          <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
          <span className="text-sm text-slate-600 font-mono">卦象代码: {result.code}</span>
        </div>
      </div>

      {/* 装饰性分割线 */}
      <div className="my-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300"></div>
        </div>
      </div>

      {/* 占卜信息 */}
      <div className="text-center text-sm text-slate-500 space-y-2">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-50/50 rounded-full">
          <span className="text-slate-400">🕐</span>
          <span>占卜时间: {new Date(result.timestamp).toLocaleString('zh-CN')}</span>
        </div>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-50/50 rounded-full">
          <span className="text-slate-400">⚙️</span>
          <span>
            {isCoinDivination
              ? '卦象由传统三枚铜钱法生成'
              : '卦象由传统的混沌初开算法生成'
            }
          </span>
        </div>
      </div>
    </div>
  );
};