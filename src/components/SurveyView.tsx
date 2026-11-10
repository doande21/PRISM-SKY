import React, { useState } from 'react';
import { FeedbackItem, ParticipantRole } from '../types/index.ts';
import { QUICK_TAGS } from '../data/initialData.ts';
import { 
  ArrowLeft, 
  Send, 
  Star, 
  User, 
  Hash, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Heart,
  HelpCircle
} from 'lucide-react';

interface SurveyViewProps {
  onBackToHome: () => void;
  onSubmitSuccess: (item: FeedbackItem) => void;
  eventName: string;
  partners: [import('../types/index.ts').PartnerConfig, import('../types/index.ts').PartnerConfig, import('../types/index.ts').PartnerConfig];
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  onBackToHome,
  onSubmitSuccess,
  eventName,
  partners
}) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Kỹ thuật phần mềm (SE)');
  const [role, setRole] = useState<ParticipantRole>('student');

  // Rating scales (1 - 5)
  const [overallRating, setOverallRating] = useState<number>(5);
  const [orgRating, setOrgRating] = useState<number>(5);
  const [stageRating, setStageRating] = useState<number>(5);
  const [contentRating, setContentRating] = useState<number>(5);
  const [hospitalityRating, setHospitalityRating] = useState<number>(5);

  // Main Feedback Questions (Requirement 4)
  const [feedbackCurrent, setFeedbackCurrent] = useState('');
  const [feedbackFuture, setFeedbackFuture] = useState('');

  // Quick Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = 'Vui lòng nhập Họ và tên của bạn';
    }
    if (!studentId.trim()) {
      errs.studentId = 'Vui lòng nhập Mã số sinh viên (MSSV) hoặc Đơn vị';
    }
    if (!feedbackCurrent.trim()) {
      errs.feedbackCurrent = 'Vui lòng chia sẻ cảm nhận hoặc đóng góp ý kiến cho LTV đợt này';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const luckyCode = `PRISM-${randomNum}`;

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      studentId: studentId.trim().toUpperCase(),
      department,
      role,
      ratings: {
        overall: overallRating,
        organization: orgRating,
        stage: stageRating,
        content: contentRating,
        hospitality: hospitalityRating
      },
      feedbackCurrent: feedbackCurrent.trim(),
      feedbackFuture: feedbackFuture.trim() || 'Chưa có ý tưởng bổ sung',
      selectedTags,
      luckyCode
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    onSubmitSuccess(newFeedback);
  };

  const renderStarPicker = (
    label: string,
    sub: string,
    value: number,
    onChange: (val: number) => void
  ) => {
    const scoreText: Record<number, string> = {
      1: 'Cần khắc phục',
      2: 'Tạm ổn',
      3: 'Khá tốt',
      4: 'Rất hài lòng',
      5: 'Tuyệt vời!'
    };

    return (
      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.06] transition-colors">
        <div>
          <div className="text-sm font-bold text-white">{label}</div>
          <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className="p-1 rounded hover:scale-125 transition-transform cursor-pointer"
                aria-label={`${s} sao`}
              >
                <Star
                  className={`w-5 h-5 ${
                    s <= value
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-amber-300 w-24 text-right tabular-nums hidden sm:inline-block">
            {value}/5 · {scoreText[value]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 relative animate-in fade-in duration-300">
      
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Top navigation back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ (KV)</span>
          </button>

          <span className="text-xs text-amber-300 font-medium">
            Lễ Tôn Vinh PRISM SKY Summer 2026
          </span>
        </div>

        {/* Survey Form Card */}
        <div className="rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl shadow-black/60 overflow-hidden">
          
          {/* HÀNG ĐẦU: 3 LOGO NGUYÊN BẢN (KHÔNG KHUNG) - Y HỆT ẢNH MẪU CHECK-IN */}
          <div className="pt-6 pb-2 px-6 flex justify-center">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-md">
              {partners.map((partner, index) => (
                <React.Fragment key={partner.id || index}>
                  {index > 0 && <div className="h-5 w-[1px] bg-white/20 shrink-0" />}
                  <a
                    href={partner.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={partner.name}
                    className="flex items-center justify-center hover:opacity-85 transition-opacity"
                  >
                    {partner.imageUrl ? (
                      <img
                        src={partner.imageUrl}
                        alt={partner.name || `Logo ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-7 sm:h-8 w-auto max-w-[110px] sm:max-w-[130px] object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-300">{partner.name}</span>
                    )}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-blue-900/40 border-b border-white/10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Khảo Sát Ý Kiến & Đóng Góp Người Tham Gia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gửi Phản Hồi Cho Ban Tổ Chức
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
              Mỗi ý kiến của bạn là viên ngọc quý giúp hoàn thiện và bứt phá các kỳ Lễ Tôn Vinh tiếp theo tại Đại học FPT Quy Nhơn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* SECTION 1: Personal Info (Họ và tên, MSSV) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  1. Thông Tin Người Tham Gia
                </h3>
                <span className="text-xs text-slate-400">(*) Bắt buộc</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Họ và tên (Requirement 4) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Họ và Tên <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="VD: Nguyễn Hoàng Nam"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all ${
                        errors.fullName ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* MSSV (Requirement 4) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Mã Số Sinh Viên (MSSV) / Đơn Vị <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={e => {
                        setStudentId(e.target.value);
                        if (errors.studentId) setErrors(prev => ({ ...prev, studentId: '' }));
                      }}
                      placeholder="VD: QE170024 hoặc Khách mời"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all ${
                        errors.studentId ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.studentId && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.studentId}
                    </p>
                  )}
                </div>

                {/* Khoa / Ngành */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Chuyên Ngành Học Tại FPT Quy Nhơn
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0e142e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value="Trí tuệ nhân tạo (A.I)">Trí tuệ nhân tạo (A.I)</option>
                    <option value="Kỹ thuật phần mềm (SE)">Kỹ thuật phần mềm (SE)</option>
                    <option value="Thiết kế Mỹ thuật số (GD)">Thiết kế Mỹ thuật số (GD)</option>
                    <option value="Quản trị kinh doanh (BA)">Quản trị kinh doanh (BA)</option>
                    <option value="Truyền thông đa phương tiện">Truyền thông đa phương tiện</option>
                    <option value="An toàn thông tin">An toàn thông tin</option>
                    <option value="Khác / Cán bộ / Giảng viên">Khác / Cán bộ / Giảng viên</option>
                  </select>
                </div>

                {/* Tư cách tham dự */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Tư Cách Tham Dự Chương Trình
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as ParticipantRole)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0e142e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value="honoree">Sinh viên được Tôn vinh (Cóc Vàng, SV Giỏi, CLB)</option>
                    <option value="student">Sinh viên tham dự cổ vũ</option>
                    <option value="alumni">Cựu sinh viên FPTU</option>
                    <option value="guest">Khách mời / Phụ huynh / Doanh nghiệp</option>
                  </select>
                </div>

              </div>
            </div>

            {/* SECTION 2: Thang điểm đánh giá (1 - 5 Sao) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  2. Đánh Giá Theo Thang Điểm (1 - 5 Sao)
                </h3>
                <span className="text-xs text-slate-400">Chọn mức độ hài lòng</span>
              </div>

              <div className="space-y-3">
                {renderStarPicker(
                  '1. Đánh giá tổng quan chương trình LTV PRISM SKY',
                  'Mức độ hài lòng chung về quy mô và không khí buổi lễ',
                  overallRating,
                  setOverallRating
                )}

                {renderStarPicker(
                  '2. Công tác tiếp đón & Check-in',
                  'Tốc độ đón tiếp, chu đáo và thân thiện của BTC',
                  orgRating,
                  setOrgRating
                )}

                {renderStarPicker(
                  '3. Âm thanh, ánh sáng & Visual Penrose Hall',
                  'Hiệu ứng sân khấu pha lê, visual LED và âm nhạc',
                  stageRating,
                  setStageRating
                )}

                {renderStarPicker(
                  '4. Kịch bản & Nghi thức tôn vinh (Cóc Vàng, CLB...)',
                  'Sự trang trọng, xúc động và truyền cảm hứng',
                  contentRating,
                  setContentRating
                )}

                {renderStarPicker(
                  '5. Quà tặng kỷ niệm & Hậu cần sự kiện',
                  'Kỷ niệm chương, quà tặng và sự chu toàn của ban tổ chức',
                  hospitalityRating,
                  setHospitalityRating
                )}
              </div>
            </div>

            {/* SECTION 3: Ý Kiến Đóng Góp Chi Tiết (Requirement 4) */}
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  3. Ý Kiến Đóng Góp Chi Tiết
                </h3>
              </div>

              {/* Câu hỏi 1 (Requirement 4) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Bạn có đóng góp ý kiến gì đến LTV đợt này không? <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackCurrent}
                  onChange={e => {
                    setFeedbackCurrent(e.target.value);
                    if (errors.feedbackCurrent) setErrors(prev => ({ ...prev, feedbackCurrent: '' }));
                  }}
                  placeholder="Chia sẻ những điểm bạn thích nhất, khoảnh khắc đáng nhớ hoặc những điều BTC cần cải thiện..."
                  className={`w-full p-4 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-y transition-all ${
                    errors.feedbackCurrent ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.feedbackCurrent && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.feedbackCurrent}
                  </p>
                )}
              </div>

              {/* Câu hỏi 2 (Requirement 4) */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Bạn có những góp ý gì đến BTC tổ chức LTV đợt tiếp theo không? Concept mong muốn (nếu có).
                </label>
                <textarea
                  rows={3}
                  value={feedbackFuture}
                  onChange={e => setFeedbackFuture(e.target.value)}
                  placeholder="Gợi ý concept sân khấu mong ước (VD: Cyberpunk Quy Nhơn, Đại Dương Huyền Ảo, Dạ Hội Cổ Điển...), hoạt động bạn muốn thấy ở kỳ sau..."
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-y transition-all"
                />
              </div>

              {/* Quick Stickers / Tags */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  ✨ Chọn nhanh thông điệp cảm xúc:
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/25 text-amber-300 border-amber-400 font-semibold shadow-sm'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Quay lại trang chủ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Đang gửi phản hồi...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-slate-950" />
                    <span>Gửi Feedback Cho BTC</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
