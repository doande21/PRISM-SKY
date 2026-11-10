import React, { useEffect } from 'react';
import { FeedbackItem } from '../types/index.ts';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, Star } from 'lucide-react';

interface SuccessModalProps {
  feedback: FeedbackItem | null;
  onClose: () => void;
  googleSheetUrl: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  feedback,
  onClose
}) => {
  useEffect(() => {
    if (feedback) {
      // Fire confetti burst
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [feedback]);

  if (!feedback) return null;

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

        {/* Feedback Summary Card */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
            <span>Đánh giá chung chương trình:</span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              {feedback.ratings.overall}/5
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
          </div>

          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">Ý kiến đóng góp LTV:</span>
            <p className="text-slate-200 italic leading-relaxed">
              "{feedback.feedbackCurrent}"
            </p>
          </div>

          {feedback.feedbackFuture && feedback.feedbackFuture !== 'Chưa có ý tưởng bổ sung' && (
            <div className="border-t border-white/5 pt-2">
              <span className="font-semibold text-slate-300 block mb-0.5">Gợi ý cho BTC & Concept mong muốn:</span>
              <p className="text-slate-200 italic leading-relaxed">
                "{feedback.feedbackFuture}"
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-amber-200 transition-all shadow-md shadow-amber-400/20 cursor-pointer text-sm"
          >
            Hoàn tất & Về Trang Chủ
          </button>
        </div>

      </div>

    </div>
  );
};
