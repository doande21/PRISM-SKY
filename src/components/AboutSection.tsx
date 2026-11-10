import React from 'react';
import { Award, Sparkles, Star, Users, MapPin, Calendar, HeartHandshake } from 'lucide-react';

interface AboutSectionProps {
  onOpenFeedback: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenFeedback }) => {
  const awardCategories = [
    {
      title: "Cóc Vàng Danh Giá",
      enTitle: "Golden Toad Award",
      icon: "🐸",
      desc: "Biểu tượng vinh danh cao quý nhất trao cho sinh viên có thành tích học tập và hoạt động phong trào dẫn đầu toàn trường kỳ Summer 2026."
    },
    {
      title: "Sinh Viên Xuất Sắc",
      enTitle: "Outstanding Student",
      icon: "⭐",
      desc: "Tôn vinh những cá nhân sở hữu GPA vượt trội và có nhiều đóng góp tích cực cho cộng đồng học thuật FPT University Quy Nhơn."
    },
    {
      title: "Câu Lạc Bộ Xuất Sắc",
      enTitle: "Best Club Award",
      icon: "🏆",
      desc: "Ghi nhận tập thể CLB năng động, tổ chức các chuỗi sự kiện truyền cảm hứng và bồi dưỡng tài năng cho sinh viên Quy Nhơn."
    },
    {
      title: "Sinh Viên Hoạt Động Tích Cực",
      enTitle: "Most Active Student",
      icon: "🔥",
      desc: "Những gương mặt thủ lĩnh tiên phong trong công tác tình nguyện, văn hóa nghệ thuật và phát triển đời sống sinh viên."
    }
  ];

  return (
    <section id="about-ltv" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nghi Thức Vinh Danh Danh Giá</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Khát Vọng PRISM SKY - Tỏa Sáng Dải Ngân Hà
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Lấy cảm hứng từ lăng kính đa sắc (Prism) hội tụ những luồng ánh sáng tri thức, đêm tôn vinh là nơi thăng hoa của sự nỗ lực, nhiệt huyết và bản lĩnh FPTU Quy Nhơn.
          </p>
        </div>

        {/* 4 Award Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awardCategories.map(cat => (
            <div
              key={cat.title}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-4 p-3 rounded-xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {cat.title}
              </h3>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                {cat.enTitle}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Penrose Hall Highlight Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Đồng Hành Cùng Ban Tổ Chức LTV
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Bạn có ấn tượng hoặc muốn góp ý điều gì cho chương trình?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tất cả phản hồi của bạn được tổng hợp trực tiếp vào hệ thống quản lý của Ban Tổ Chức để không ngừng nâng tầm trải nghiệm của sinh viên các kỳ tới.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFeedback}
            className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 transition-all shadow-lg shadow-amber-400/20 whitespace-nowrap cursor-pointer text-sm"
          >
            Đóng góp ý kiến ngay
          </button>
        </div>

      </div>
    </section>
  );
};
