import React, { useEffect, useState } from 'react';
import { FeedbackItem } from '../types/index.ts';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, Copy, Check, Sparkles, Star, ArrowRight, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
  feedback: FeedbackItem | null;
  onClose: () => void;
  googleSheetUrl: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  feedback,
  onClose,
  googleSheetUrl
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (feedback) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Secondary glitter burst
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (!feedback) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(feedback.luckyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0c122e] to-[#070a1a] border border-amber-400/30 shadow-2xl shadow-amber-500/10 p-6 sm:p-8 text-center my-6">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-400/20 mb-5">
          <div className="w-full h-full bg-[#070a1a] rounded-[14px] flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-amber-400" />
          </div>
        </div>

        {/* Success Title */}
        <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center justify-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Ghi Nhận Thành Công!
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Cảm Ơn Bạn Đã Góp Ý!
        </h2>
        
        <p className="mt-2 text-sm text-slate-300">
          Những đóng góp quý báu của <strong className="text-white">{feedback.fullName}</strong> ({feedback.studentId}) đã được gửi trực tiếp đến Ban Tổ Chức Lễ Tôn Vinh PRISM SKY.
        </p>

        {/* Personalized Lucky Draw Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-400/10 via-indigo-500/10 to-amber-400/10 border border-amber-400/25 relative overflow-hidden text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wide">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Vé May Mắn Lucky Draw Sự Kiện</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Penrose Hall</span>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            Lưu lại mã này để tham gia bốc thăm may mắn nhận quà lưu niệm đặc biệt từ BTC chương trình!
          </p>

          <div className="flex items-center justify-between bg-[#040714] px-3.5 py-2.5 rounded-lg border border-white/10">
            <span className="font-mono text-lg font-black tracking-widest text-amber-300">
              {feedback.luckyCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Summary Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Đánh giá chung:</span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              {feedback.ratings.overall}/5
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="text-slate-400">
            <span className="font-semibold text-slate-300">Ý kiến đóng góp LTV:</span>
            <p className="text-slate-200 mt-0.5 line-clamp-2 italic">
              "{feedback.feedbackCurrent}"
            </p>
          </div>
          {feedback.feedbackFuture && (
            <div className="text-slate-400 border-t border-white/5 pt-1.5">
              <span className="font-semibold text-slate-300">Concept mong muốn kỳ sau:</span>
              <p className="text-slate-200 mt-0.5 line-clamp-2 italic">
                "{feedback.feedbackFuture}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-amber-200 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
          >
            Hoàn tất & Về Trang Chủ
          </button>
        </div>

      </div>

    </div>
  );
};
