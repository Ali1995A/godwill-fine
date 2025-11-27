import React from 'react';

interface HexagramDisplayProps {
  yaos: number[]; // 6,7,8,9 数组，6=老阴, 7=少阳, 8=少阴, 9=老阳
  showLabels?: boolean;
  animate?: boolean;
}

export const HexagramDisplay: React.FC<HexagramDisplayProps> = ({
  yaos,
  showLabels = true,
  animate = false
}) => {
  // 爻位名称（从下往上）
  const yaoNames = ['初', '二', '三', '四', '五', '上'];
  
  return (
    <div className="flex flex-col items-center space-y-3 p-8 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
      {showLabels && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200/50">
            <span className="text-slate-500">📿</span>
            <h3 className="text-lg font-medium text-slate-700">卦象</h3>
          </div>
        </div>
      )}
      
      {/* 从下到上显示6个爻 - 传统文化顺序 */}
      <div className="space-y-4">
        {yaos.map((yao, index) => (
          <div key={index} className="flex items-center justify-center space-x-5 group">
            {showLabels && (
              <div className="text-right w-10">
                <span className="text-sm text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
                  {yaoNames[5 - index]}
                </span>
              </div>
            )}
            
            <div className={`flex items-center relative ${animate ? 'animate-fade-in-up' : ''}`}
                 style={{ animationDelay: `${index * 0.15}s` }}>
              {/* 爻线显示 */}
              <div className={`yao-line relative ${
                yao === 6 || yao === 8 ? 'yin' : 'yang'
              } ${yao === 6 || yao === 9 ? 'moving' : ''}`}>
              </div>
              
              {/* 爻值显示 */}
              {showLabels && (
                <div className="ml-3">
                  <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50/50 rounded-full border border-slate-200/30">
                    {yao === 6 ? '老阴' :
                     yao === 7 ? '少阳' :
                     yao === 8 ? '少阴' : '老阳'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )).reverse()} {/* 反转数组以从下往上显示 */}
      </div>
      
      {showLabels && (
        <div className="flex space-x-6 mt-6 pt-4 border-t border-slate-200/50">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">上卦</div>
            <div className="font-mono text-sm font-medium text-slate-600 bg-slate-50/50 px-3 py-1 rounded-lg border border-slate-200/30">
              {yaos.slice(3, 6).map(y => y > 7 ? 1 : 0).join('')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">下卦</div>
            <div className="font-mono text-sm font-medium text-slate-600 bg-slate-50/50 px-3 py-1 rounded-lg border border-slate-200/30">
              {yaos.slice(0, 3).map(y => y > 7 ? 1 : 0).join('')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};