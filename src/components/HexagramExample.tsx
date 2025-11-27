import React from 'react';
import { HexagramDisplay } from './HexagramDisplay';

/**
 * 卦象示例组件
 * ============================================
 * 注意：本组件展示审定后的爻线在实际卦象中的应用
 * 爻线尺寸规范已经过项目负责人审定，禁止随意修改
 * ============================================
 * 总宽度: 120px (固定)
 * 高度: 11px (固定)
 * 圆角: 5px (固定)
 * 阴爻段宽: 45px (固定)
 * 阴爻间距: 30px (固定)
 * 审定人: 项目负责人
 * 审定日期: 2025-11-27
 * ============================================
 */

export const HexagramExample: React.FC = () => {
  // 示例卦象：包含阳爻、阴爻、变爻的组合
  const exampleYaos = [
    [9, 7, 8, 6, 7, 8], // 包含老阳(9)和老阴(6)的变爻
    [7, 8, 7, 8, 7, 8], // 纯阳爻和阴爻交替
    [6, 6, 9, 9, 7, 8], // 多个变爻
  ];

  return (
    <div className="p-8 bg-slate-900 rounded-2xl space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">卦象显示示例 - Apple风格爻线</h2>
      
      {exampleYaos.map((yaos, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-300">示例卦象 {index + 1}</h3>
          <div className="bg-slate-800/30 rounded-xl p-6">
            <HexagramDisplay 
              yaos={yaos} 
              showLabels={true}
              animate={true}
            />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">爻线说明</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              {yaos.map((yao, yaoIndex) => (
                <li key={yaoIndex}>
                  • 第{['初', '二', '三', '四', '五', '上'][yaoIndex]}爻: 
                  {yao === 6 ? '老阴(变爻)' : 
                   yao === 7 ? '少阳' : 
                   yao === 8 ? '少阴' : '老阳(变爻)'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* 爻线规格说明 */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">爻线样式规格</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="gua-line-yang"></div>
              <div>
                <p className="text-slate-300 font-medium">阳爻</p>
                <p className="text-slate-400 text-xs">120×11px</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="gua-line-yin">
                <div className="gua-line-yin-segment"></div>
                <div className="gua-line-yin-segment"></div>
              </div>
              <div>
                <p className="text-slate-300 font-medium">阴爻</p>
                <p className="text-slate-400 text-xs">45×11px ×2</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="gua-line-mutating">
                <div className="gua-line-yang"></div>
              </div>
              <div>
                <p className="text-slate-300 font-medium">变爻阳爻</p>
                <p className="text-slate-400 text-xs">红色高亮</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="gua-line-mutating">
                <div className="gua-line-yin">
                  <div className="gua-line-yin-segment"></div>
                  <div className="gua-line-yin-segment"></div>
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-medium">变爻阴爻</p>
                <p className="text-slate-400 text-xs">红色高亮</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};