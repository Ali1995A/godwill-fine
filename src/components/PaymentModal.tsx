import React, { useState, useEffect } from 'react';

/**
 * 支付确认模态框组件
 *
 * ⚠️ 重要说明：
 * - 本组件的交互逻辑和支付流程已通过用户审核审定
 * - 包括3天倒计时机制、开发环境白名单、支付确认流程等
 * - 任何修改需要重新审核确认
 * - 开发环境自动绕过锁定，允许无限次测试
 */
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirm?: () => void;
}

const PAYMENT_LOCK_KEY = 'payment_confirmed_time';
const LOCK_DURATION_DAYS = 3;

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentConfirm
}) => {
  const [isPaymentLocked, setIsPaymentLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    checkPaymentLock();
  }, [isOpen]);

  const checkPaymentLock = () => {
    // 开发环境白名单：本地开发时绕过锁定检查
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      console.log('🧪 开发环境：自动通过支付锁定检查');
      setIsPaymentLocked(false);
      return;
    }
    
    const lockedTime = localStorage.getItem(PAYMENT_LOCK_KEY);
    if (lockedTime) {
      const lockTimestamp = parseInt(lockedTime);
      const currentTime = Date.now();
      const timeDiff = currentTime - lockTimestamp;
      const lockDuration = LOCK_DURATION_DAYS * 24 * 60 * 60 * 1000;

      if (timeDiff < lockDuration) {
        setIsPaymentLocked(true);
        const remainingMs = lockDuration - timeDiff;
        const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
        const remainingHours = Math.ceil((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        setRemainingTime(`${remainingDays}天${remainingHours}小时`);
      } else {
        // 锁定期已过，清除记录
        localStorage.removeItem(PAYMENT_LOCK_KEY);
        setIsPaymentLocked(false);
      }
    } else {
      setIsPaymentLocked(false);
    }
  };

  const handlePaymentConfirm = () => {
    if (isPaymentLocked) return;
    
    // 开发环境白名单：本地开发时不记录锁定时间
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      console.log('🧪 开发环境：跳过支付锁定时间记录');
      if (onPaymentConfirm) {
        onPaymentConfirm();
      }
      onClose();
      return;
    }
    
    // 记录支付确认时间
    localStorage.setItem(PAYMENT_LOCK_KEY, Date.now().toString());
    
    if (onPaymentConfirm) {
      onPaymentConfirm();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
        {/* 头部 */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">
              支持我们
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[15px] text-slate-600 mt-2">
            如果您觉得我们的服务对您有帮助，欢迎扫码支持
          </p>
        </div>

        {/* 二维码区域 */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* 微信支付 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
                <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
                  <img
                    src="https://ac35844.webp.li/微信.jpg"
                    alt="微信支付"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">微</span>
                  </div>
                  <span className="text-[15px] font-medium text-slate-800">微信支付</span>
                </div>
              </div>
            </div>

            {/* 支付宝 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50">
                <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
                  <img
                    src="https://ac35844.webp.li/支付宝.jpg"
                    alt="支付宝"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">支</span>
                  </div>
                  <span className="text-[15px] font-medium text-slate-800">支付宝</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
            <p className="text-[13px] text-slate-600 text-center leading-relaxed">
              您的支持是我们持续优化产品的动力 ❤️
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={handlePaymentConfirm}
            disabled={isPaymentLocked}
            className={`w-full py-3.5 px-6 rounded-2xl font-medium text-[15px] transition-all duration-200 ${
              isPaymentLocked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
            }`}
          >
            {isPaymentLocked ? `已确认支付（${remainingTime}后可再次确认）` : '我已完成支付'}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            稍后支持
          </button>
        </div>
      </div>
    </div>
  );
};