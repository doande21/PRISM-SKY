import React, { useState } from 'react';
import { PartnerConfig } from '../types/index.ts';
import { ExternalLink, Building2, Sparkles } from 'lucide-react';

interface StrategicPartnersProps {
  partners: [PartnerConfig, PartnerConfig, PartnerConfig];
  onOpenSettings?: () => void;
}

export const StrategicPartners: React.FC<StrategicPartnersProps> = ({
  partners,
  onOpenSettings
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="partners" className="py-12 sm:py-16 relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đồng Hành Cùng Sự Tỏa Sáng</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Đối Tác Chiến Lược Của Chương Trình
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Trân trọng cảm ơn các doanh nghiệp và tổ chức đồng hành cùng Lễ Tôn Vinh Sinh Viên FPT University Quy Nhơn
          </p>
        </div>

        {/* 3 Strategic Partner Logo Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {partners.map((partner, index) => {
            const hasError = imageErrors[partner.id];

            return (
              <a
                key={partner.id}
                href={partner.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.1] transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-1"
              >
                {/* Slot index label */}
                <div className="absolute top-4 right-4 text-[10px] font-mono uppercase text-slate-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Đối tác #{index + 1}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Partner Logo Container */}
                <div className="w-full h-24 mb-5 flex items-center justify-center p-3 rounded-xl bg-[#030612]/70 border border-white/5 overflow-hidden">
                  {!hasError && partner.imageUrl ? (
                    <img
                      src={partner.imageUrl}
                      alt={`Logo đối tác ${partner.name}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(partner.id)}
                      className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400">
                      <Building2 className="w-8 h-8 text-indigo-400/80 mb-1" />
                      <span className="text-xs font-semibold text-slate-300">{partner.name}</span>
                    </div>
                  )}
                </div>

                {/* Partner Details */}
                <div className="w-full text-center">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {partner.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {partner.role}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Small note & quick admin link */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <span>* Các vị trí logo đối tác được cấu hình trực tiếp từ ban tổ chức</span>
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Cập nhật URL Logo trong Cài đặt Admin
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
