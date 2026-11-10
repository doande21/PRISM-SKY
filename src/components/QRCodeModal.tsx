import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, X, Maximize2, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
  eventName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
  eventName
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const url = targetUrl || window.location.href;
    setCurrentUrl(url);

    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff'
        }
      }).catch(err => {
        console.error('QR code generation error:', err);
      });
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QRCode_Feedback_LTV_PRISM_SKY.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Fullscreen Presentation Mode for Penrose Hall Projector / LED Screen
  if (isFullscreenMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#040614] flex flex-col items-center justify-center p-6 text-white animate-in fade-in">
        <button
          type="button"
          onClick={() => setIsFullscreenMode(false)}
          className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Thoát Chế Độ Chiếu</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            FPT University Quy Nhơn · Penrose Hall
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Quét Mã QR Để Gửi Ý Kiến Đóng Góp
          </h1>
          <p className="mt-2 text-base text-slate-300">
            Lễ Tôn Vinh Sinh Viên - PRISM SKY Summer 2026
          </p>
        </div>

        {/* Big Crisp QR Frame */}
        <div className="p-6 rounded-3xl bg-white shadow-2xl shadow-amber-400/20 border-4 border-amber-400/80">
          <canvas ref={canvasRef} className="rounded-xl w-72 h-72 sm:w-80 sm:h-80" />
        </div>

        <div className="mt-6 text-center">
          <div className="inline-block px-4 py-2 rounded-xl bg-white/10 border border-white/10 font-mono text-sm text-amber-300">
            {currentUrl}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Mở camera hoặc ứng dụng Zalo / Web trên điện thoại để quét mã
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl shadow-indigo-950/60 p-6 sm:p-7 text-center my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mã QR Khảo Sát & Feedback</h3>
              <p className="text-xs text-slate-400">Dành cho người tham dự quét nhanh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Canvas Display */}
        <div className="flex justify-center my-3">
          <div className="p-4 rounded-2xl bg-white shadow-xl shadow-black/40 border-2 border-indigo-500/20">
            <canvas ref={canvasRef} className="rounded-lg w-56 h-56 sm:w-64 sm:h-64" />
          </div>
        </div>

        {/* URL Box */}
        <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-300 truncate max-w-[240px] text-left">
            {currentUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Chép</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Tải ảnh QR (PNG)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreenMode(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 transition-colors shadow-md shadow-amber-400/20 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Chiếu màn hình LED</span>
          </button>
        </div>

      </div>

    </div>
  );
};
