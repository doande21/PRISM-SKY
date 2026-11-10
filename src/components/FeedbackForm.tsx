import React, { useState } from 'react';
import { FeedbackItem, ParticipantRole } from '../types/index.ts';
import { QUICK_TAGS } from '../data/initialData.ts';
import { Star, Send, X, Sparkles, User, Hash, GraduationCap, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (item: FeedbackItem) => void;
  googleSheetUrl: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  googleSheetUrl
}) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Kỹ thuật phần mềm (SE)');
  const [role, setRole] = useState<ParticipantRole>('student');
  
  // Rating Scales (1 - 5)
  const [overallRating, setOverallRating] = useState<number>(5);
  const [orgRating, setOrgRating] = useState<number>(5);
  const [stageRating, setStageRating] = useState<number>(5);
  const [contentRating, setContentRating] = useState<number>(5);
  const [hospitalityRating, setHospitalityRating] = useState<number>(5);

  // Main Feedback Questions (Requirement 4)
  const [feedbackCurrent, setFeedbackCurrent] = useState('');
  const [feedbackFuture, setFeedbackFuture] = useState('');

  // Quick chips
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Errors & Loading state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

    // Generate Lucky Draw Code for participant
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

    // Simulate async submission and optional sync
    await new Promise(resolve => setTimeout(resolve, 600));

    setIsSubmitting(false);
    onSubmitSuccess(newFeedback);
  };

  // Helper star rating picker
  const renderStarPicker = (
    label: string,
    description: string,
    value: number,
    onChange: (val: number) => void
  ) => {
    const scoreDescriptions: Record<number, string> = {
      1: 'Cần cải thiện nhiều',
      2: 'Tạm ổn',
      3: 'Khá tốt',
      4: 'Rất hài lòng',
      5: 'Tuyệt vời, trên cả mong đợi!'
    };

    return (
      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-xs text-slate-400">{description}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="p-1 rounded hover:scale-125 transition-transform cursor-pointer"
                aria-label={`${star} sao cho ${label}`}
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    star <= value
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-amber-300 w-28 text-right tabular-nums hidden sm:inline-block">
            {value}/5 · {scoreDescriptions[value]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#090d22] border border-white/15 shadow-2xl shadow-indigo-950/60 overflow-hidden my-6">
        
        {/* Prismatic Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-blue-900/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5">
              <div className="w-full h-full bg-[#090d22] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Khảo Sát & Góp Ý Lễ Tôn Vinh PRISM SKY
              </h2>
              <p className="text-xs text-slate-300">
                FPT University Quy Nhơn · Dữ liệu được bảo mật và tổng hợp tới BTC
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: Personal Info (Họ tên, MSSV, Ngành) */}
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
                    placeholder="VD: Nguyễn Văn An"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all ${
                      errors.fullName ? 'border-red-500/80' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
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
                    placeholder="VD: QE170123 hoặc Khách mời"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all ${
                      errors.studentId ? 'border-red-500/80' : 'border-white/10'
                    }`}
                  />
                </div>
                {errors.studentId && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.studentId}
                  </p>
                )}
              </div>

              {/* Khoa / Ngành học */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Chuyên Ngành Học Tại FPT Quy Nhơn
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e142e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
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

              {/* Vai trò tham dự */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Tư Cách Tham Dự Chương Trình
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as ParticipantRole)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e142e] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  <option value="honoree">Sinh viên được Tôn vinh (Cóc Vàng, SV Giỏi, CLB)</option>
                  <option value="student">Sinh viên tham dự cổ vũ</option>
                  <option value="alumni">Cựu sinh viên FPTU</option>
                  <option value="guest">Khách mời / Phụ huynh / Doanh nghiệp</option>
                </select>
              </div>

            </div>
          </div>

          {/* SECTION 2: Thang điểm đánh giá (Rating Scales 1 - 5) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400" />
                2. Đánh Giá Theo Thang Điểm (1 - 5 Sao)
              </h3>
              <span className="text-xs text-slate-400">Chạm sao để đánh giá</span>
            </div>

            <div className="space-y-3">
              {renderStarPicker(
                '1. Đánh giá tổng quan chương trình PRISM SKY',
                'Mức độ thỏa mãn và ấn tượng chung về đêm lễ',
                overallRating,
                setOverallRating
              )}

              {renderStarPicker(
                '2. Công tác tiếp đón & Hướng dẫn Check-in',
                'Tốc độ, sự chu đáo và thân thiện của ban tổ chức',
                orgRating,
                setOrgRating
              )}

              {renderStarPicker(
                '3. Visual, Âm thanh & Ánh sáng tại Sảnh Penrose',
                'Hiệu ứng sân khấu pha lê, visual LED và âm nhạc',
                stageRating,
                setStageRating
              )}

              {renderStarPicker(
                '4. Kịch bản & Nghi thức tôn vinh (Cóc Vàng, CLB...)',
                'Sự trang trọng, truyền cảm hứng và tinh thần tự hào',
                contentRating,
                setContentRating
              )}

              {renderStarPicker(
                '5. Quà tặng kỷ niệm & Hậu cần sự kiện',
                'Kỷ niệm chương, quà tặng và sự chăm chút của ban tổ chức',
                hospitalityRating,
                setHospitalityRating
              )}
            </div>
          </div>

          {/* SECTION 3: Ý Kiến Đóng Góp (Requirement 4) */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                3. Đóng Góp Ý Kiến Chi Tiết
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
                placeholder="Chia sẻ những điểm bạn thích nhất, khoảnh khắc đáng nhớ hoặc những điều BTC cần khắc phục tốt hơn..."
                className={`w-full p-3.5 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-y transition-all ${
                  errors.feedbackCurrent ? 'border-red-500/80' : 'border-white/10'
                }`}
              />
              {errors.feedbackCurrent && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
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
                placeholder="Gợi ý concept sân khấu mong ước (VD: Cyberpunk Quy Nhơn, Đại Dương Huyền Ảo, Dạ Hội Cổ Điển...), âm nhạc hay hoạt động bạn muốn thấy ở kỳ sau..."
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-y transition-all"
              />
            </div>

            {/* Quick Stickers / Tags (From User Image 1 reference) */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                ✨ Chèn nhanh cảm xúc của bạn về chương trình:
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-semibold shadow-sm'
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

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <span>Được liên kết với bảng tổng hợp của Ban Tổ Chức LTV</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-slate-950" />
                    <span>Gửi Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
};
