import React from 'react';

interface FooterProps {
  eventName: string;
}

export const Footer: React.FC<FooterProps> = ({ eventName }) => {
  return (
    <footer className="border-t border-white/5 bg-[#040612]/90 text-xs text-slate-400 py-6 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <div className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider">
          {eventName}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Trường Đại học FPT Phân hiệu Quy Nhơn · Hội trường Penrose Hall
        </div>
        <div className="mt-2 text-[10px] text-slate-400">
          © 2026 Đại học FPT Quy Nhơn · Mọi phản hồi được tổng hợp trực tiếp đến Ban Tổ Chức
        </div>
      </div>
    </footer>
  );
};
