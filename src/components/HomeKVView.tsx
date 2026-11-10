import React, { useRef } from 'react';
import { PartnerConfig } from '../types/index.ts';
import { Send, Sparkles, MapPin, Calendar, Award } from 'lucide-react';

interface HomeKVViewProps {
  onStartFeedback: () => void;
  onOpenAdmin: () => void;
  partners: PartnerConfig[];
  eventName: string;
  eventDate: string;
  eventVenue: string;
}

export const HomeKVView: React.FC<HomeKVViewProps> = ({
  onStartFeedback,
  onOpenAdmin,
  partners,
  eventName,
  eventDate,
  eventVenue
}) => {
  const kvImagePath = "/assets/aistudio/1794287171256_1350196512176844073_1350196512176844073_78cf5fd2f19be742412a61b55991e6ad_268d0fc0.jpg";

  // Secret Admin Access: Triggered strictly by clicking/tapping 3 consecutive times on the KV
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const resetTimerRef = useRef<any>(null);

  const handleKVClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 600) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 700);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-start items-center px-4 py-5 sm:py-8 overflow-hidden">
      
      {/* Prismatic atmospheric background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Single KV & Feedback Hero Area */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* HÀNG ĐẦU: 3 LOGO ĐỐI TÁC NGUYÊN BẢN (HOÀN TOÀN KHÔNG ĐỂ KHUNG) */}
        <div className="mb-4 sm:mb-5 w-full flex justify-center">
          <div className="inline-flex items-center justify-center gap-4 sm:gap-8 py-2">
            {partners.map((partner, index) => (
              <React.Fragment key={partner.id || index}>
                {index > 0 && (
                  <div className="h-5 sm:h-7 w-[1px] bg-white/30 shrink-0" />
                )}
                <a
                  href={partner.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  {partner.imageUrl ? (
                    <img
                      src={partner.imageUrl}
                      alt={partner.name || `Logo đối tác ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[160px] object-contain drop-shadow"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-300">
                      {partner.name}
                    </span>
                  )}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* PROMINENT EVENT TITLE */}
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
          Lễ Tôn Vinh Sinh Viên
          <span className="block mt-1 font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-cyan-200 to-indigo-300 tracking-wider">
            PRISM SKY
          </span>
        </h1>

        {/* Event tagline & meta */}
        <div className="mt-2 text-xs sm:text-sm font-semibold text-cyan-300 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Vươn Mình Cùng Đất Nước · Thắp Sáng Ngôi Sao Dải Ngân Hà</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>25/11/2026 · 18:00</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sảnh Penrose · AI Campus</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>Cóc Vàng & CLB Xuất Sắc</span>
          </span>
        </div>

        {/* CENTERPIECE: KEY VISUAL POSTER NGUYÊN BẢN (KHÔNG BỊ CẮT CHỮ, BÍ MẬT 3 TAP MỞ ADMIN) */}
        <div 
          onClick={handleKVClick}
          className="relative mt-4 sm:mt-5 group w-full max-w-sm sm:max-w-md md:max-w-lg cursor-pointer select-none"
        >
          {/* Prismatic aura glow */}
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 opacity-60 blur-lg group-hover:opacity-85 transition duration-700" />
          
          <div className="relative rounded-2xl overflow-hidden bg-[#070b1e] border-2 border-white/20 shadow-2xl">
            <img
              src={kvImagePath}
              alt="Key Visual Lễ Tôn Vinh PRISM SKY - FPT University Quy Nhơn"
              referrerPolicy="no-referrer"
              className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* NÚT "FEEDBACK NGAY" RIÊNG BIỆT & NỔI BẬT */}
        <div className="mt-6 mb-8 w-full max-w-sm sm:max-w-md flex flex-col items-center">
          <button
            type="button"
            onClick={onStartFeedback}
            className="w-full relative group py-4 px-8 rounded-2xl font-black text-base sm:text-lg text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-200 active:scale-98 transition-all duration-300 shadow-xl shadow-amber-400/30 border border-amber-200/50 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="absolute -inset-0.5 rounded-2xl bg-amber-400 opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />
            
            <div className="relative flex items-center gap-2.5">
              <Send className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:translate-x-1 transition-transform" />
              <span className="uppercase tracking-wider">Feedback ngay</span>
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
          </button>
          {/* ĐÃ XÓA HOÀN TOÀN DÒNG CHỮ '1 phút chia sẻ / vé may mắn / mở mã qr' DƯỚI NÚT THEO YÊU CẦU */}
        </div>

      </div>

    </div>
  );
};
