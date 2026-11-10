import React from 'react';
import { Send, QrCode, Calendar, MapPin, Award, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onOpenFeedback: () => void;
  onOpenQR: () => void;
  feedbacksCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenFeedback,
  onOpenQR,
  feedbacksCount
}) => {
  const kvImagePath = "/assets/aistudio/1794287171256_1350196512176844073_1350196512176844073_78cf5fd2f19be742412a61b55991e6ad_268d0fc0.jpg";

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Prismatic atmospheric lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Badges & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-xs text-amber-300 font-medium tracking-wide shadow-inner backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>FPT EDUCATION · FPT UNIVERSITY QUY NHƠN</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300">SUMMER 2026</span>
          </div>

          {/* MAIN PROMINENT EVENT TITLE (Requirement 5) */}
          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-xl text-balance">
            Lễ Tôn Vinh Sinh Viên
            <span className="block mt-1 font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-cyan-200 to-indigo-300 tracking-wider">
              PRISM SKY
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto">
            Vinh danh những ngôi sao sinh viên xuất sắc nhất kỳ Summer 2026 và thắp sáng khát vọng tuổi trẻ trên dải ngân hà tri thức tại FPT University Quy Nhơn.
          </p>

          {/* Key Event Metadata */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>25/11/2026 · 18:00 (Thứ Tư)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Hội trường Penrose Hall · AI Campus</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Cóc Vàng & CLB Xuất Sắc</span>
            </div>
          </div>
        </div>

        {/* Center Grid: KV Display + Action Card */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* KV Poster Showcase (7 cols on desktop) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative group w-full max-w-md lg:max-w-none">
              {/* Outer glowing prismatic frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 opacity-60 blur-md group-hover:opacity-85 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden bg-[#090d22] border border-white/20 shadow-2xl">
                <img
                  src={kvImagePath}
                  alt="Key Visual Lễ Tôn Vinh PRISM SKY - FPT University Quy Nhơn"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[580px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                
                {/* Overlay gradient at bottom for seamless presentation */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#050814] via-[#050814]/70 to-transparent flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="font-semibold text-white tracking-wide">Key Visual Chính Thức LTV</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Penrose Hall 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Survey Welcome Card (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-xl shadow-black/50">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cổng Khảo Sát & Góp Ý
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {feedbacksCount} lượt đã gửi
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Ý kiến của bạn là viên ngọc quý kiến tạo tương lai!
              </h2>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Hãy dành 1 phút chia sẻ cảm nhận về đêm tôn vinh <span className="text-amber-300 font-semibold">PRISM SKY</span> và hiến kế concept cho các kỳ Lễ Tôn Vinh tiếp theo của Đại học FPT Quy Nhơn.
              </p>

              {/* Highlights List */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-300 border-t border-b border-white/10 py-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>Đánh giá thang điểm nhanh về sân khấu, check-in, âm thanh & kịch bản</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Góp ý trực tiếp đến BTC và đề xuất Concept kỳ tiếp theo</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Nhận ngay <strong className="text-amber-300">Vé May Mắn Lucky Draw</strong> bốc thăm quà tặng tại sự kiện</span>
                </div>
              </div>

              {/* PRIMARY PROMINENT CTA BUTTON (Requirement 1) */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onOpenFeedback}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-xl hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Feedback ngay</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenQR}
                  title="Hiển thị mã QR để sinh viên quét nhanh bằng điện thoại"
                  className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-cyan-300" />
                  <span>Mã QR</span>
                </button>
              </div>

            </div>

            {/* Micro proof bar */}
            <div className="px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Dữ liệu đồng bộ trực tiếp tới BTC
              </span>
              <span className="text-slate-400">Bảo mật thông tin sinh viên</span>
            </div>

          </div>

        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#about-ltv"
            className="flex flex-col items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Khám phá thêm</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
};
