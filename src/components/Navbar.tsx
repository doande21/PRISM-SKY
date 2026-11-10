import React from 'react';
import { Sparkles, QrCode, Shield, Send, Home } from 'lucide-react';

interface NavbarProps {
  onOpenFeedback: () => void;
  onOpenQR: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  currentView: 'home' | 'survey';
  feedbacksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFeedback,
  onOpenQR,
  onOpenAdmin,
  onGoHome,
  currentView,
  feedbacksCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050814]/90 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 via-indigo-500 to-cyan-400 p-[1.5px] shadow-sm shadow-indigo-500/30">
            <div className="w-full h-full bg-[#070b1e] rounded-[7px] flex items-center justify-center">
              <span className="font-cinzel text-xs font-black text-amber-300">PS</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel tracking-wider text-xs sm:text-sm text-slate-100 uppercase group-hover:text-amber-300 transition-colors">
              FPT University Quy Nhơn
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={onGoHome}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'home' ? 'text-amber-300 font-bold' : 'hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Trang Chủ (KV)
          </button>

          <button 
            type="button"
            onClick={onOpenQR}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            Mã QR Truy Cập
          </button>

          <button 
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-indigo-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Quản trị BTC
            {feedbacksCount > 0 && (
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-1.5 py-0.2 rounded-full tabular-nums">
                {feedbacksCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'home' ? (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 rounded-lg hover:from-amber-200 hover:to-amber-300 active:scale-95 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>Feedback ngay</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer border border-white/10"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Về Trang Chủ (KV)</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
