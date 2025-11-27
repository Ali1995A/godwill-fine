import React from 'react';

export const YaoLineTest: React.FC = () => {
  return (
    <div className="p-8 bg-slate-900 rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">爻线样式测试 - Apple风格</h2>
      
      {/* 阳爻测试 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300">阳爻 (实线)</h3>
        <div className="flex items-center space-x-4">
          <div className="gua-line-yang"></div>
          <span className="text-slate-400 text-sm">标准阳爻</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="gua-line-mutating">
            <div className="gua-line-yang"></div>
          </div>
          <span className="text-slate-400 text-sm">变爻阳爻 (红色高亮)</span>
        </div>
      </div>

      {/* 阴爻测试 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300">阴爻 (断线)</h3>
        <div className="flex items-center space-x-4">
          <div className="gua-line-yin">
            <div className="gua-line-yin-segment"></div>
            <div className="gua-line-yin-segment"></div>
          </div>
          <span className="text-slate-400 text-sm">标准阴爻</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="gua-line-mutating">
            <div className="gua-line-yin">
              <div className="gua-line-yin-segment"></div>
              <div className="gua-line-yin-segment"></div>
            </div>
          </div>
          <span className="text-slate-400 text-sm">变爻阴爻 (红色高亮)</span>
        </div>
      </div>

      {/* 尺寸说明 */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">尺寸规格</h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• 总宽度: 120px</li>
          <li>• 高度: 11px</li>
          <li>• 圆角: 5px</li>
          <li>• 阴爻段宽: 45px</li>
          <li>• 阴爻间距: 30px</li>
        </ul>
      </div>
    </div>
  );
};