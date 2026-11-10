import React, { useState, useMemo } from 'react';
import { FeedbackItem, AppSettings, PartnerConfig } from '../types/index.ts';
import { exportFeedbacksToCSV, exportFeedbacksQuickCSV, copyForGoogleSheets } from '../utils/exportCsv.ts';
import { APPS_SCRIPT_TEMPLATE, USER_TARGET_SHEET_URL, sendFeedbackToGoogleSheet } from '../utils/googleSheetSync.ts';
import { 
  Shield, 
  X, 
  BarChart3, 
  Users, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Bookmark, 
  Settings, 
  Lock, 
  Check, 
  Copy, 
  FileSpreadsheet, 
  Sparkles,
  Building2,
  TrendingUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: FeedbackItem[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDeleteFeedback: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  feedbacks,
  settings,
  onUpdateSettings,
  onDeleteFeedback,
  onToggleFeatured
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'feedbacks' | 'settings'>('analytics');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3_below'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  // Copy status
  const [copiedSheetData, setCopiedSheetData] = useState(false);

  const [sheetUrlInput, setSheetUrlInput] = useState(settings.googleSheetUrl || USER_TARGET_SHEET_URL);
  const [webhookUrlInput, setWebhookUrlInput] = useState(settings.webhookUrl || '');
  const [isOpenSurvey, setIsOpenSurvey] = useState(settings.isOpen);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [partner1Url, setPartner1Url] = useState(settings.partners[0].imageUrl);
  const [partner1Name, setPartner1Name] = useState(settings.partners[0].name);
  const [partner1Web, setPartner1Web] = useState(settings.partners[0].websiteUrl);

  const [partner2Url, setPartner2Url] = useState(settings.partners[1].imageUrl);
  const [partner2Name, setPartner2Name] = useState(settings.partners[1].name);
  const [partner2Web, setPartner2Web] = useState(settings.partners[1].websiteUrl);

  const [partner3Url, setPartner3Url] = useState(settings.partners[2].imageUrl);
  const [partner3Name, setPartner3Name] = useState(settings.partners[2].name);
  const [partner3Web, setPartner3Web] = useState(settings.partners[2].websiteUrl);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute analytics
  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) {
      return {
        total: 0,
        avgOverall: 0,
        avgOrg: 0,
        avgStage: 0,
        avgContent: 0,
        avgHosp: 0,
        csatPercent: 0,
        fiveStars: 0,
        fourStars: 0,
        threeOrLess: 0
      };
    }

    let sumOverall = 0;
    let sumOrg = 0;
    let sumStage = 0;
    let sumContent = 0;
    let sumHosp = 0;
    let five = 0;
    let four = 0;
    let low = 0;

    feedbacks.forEach(f => {
      sumOverall += f.ratings.overall;
      sumOrg += f.ratings.organization;
      sumStage += f.ratings.stage;
      sumContent += f.ratings.content;
      sumHosp += f.ratings.hospitality;

      if (f.ratings.overall === 5) five++;
      else if (f.ratings.overall === 4) four++;
      else low++;
    });

    const avgOverall = Number((sumOverall / total).toFixed(1));
    const avgOrg = Number((sumOrg / total).toFixed(1));
    const avgStage = Number((sumStage / total).toFixed(1));
    const avgContent = Number((sumContent / total).toFixed(1));
    const avgHosp = Number((sumHosp / total).toFixed(1));
    const csatPercent = Math.round(((five + four) / total) * 100);

    return {
      total,
      avgOverall,
      avgOrg,
      avgStage,
      avgContent,
      avgHosp,
      csatPercent,
      fiveStars: five,
      fourStars: four,
      threeOrLess: low
    };
  }, [feedbacks]);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        f.fullName.toLowerCase().includes(q) ||
        f.studentId.toLowerCase().includes(q) ||
        f.feedbackCurrent.toLowerCase().includes(q) ||
        f.feedbackFuture.toLowerCase().includes(q) ||
        (f.department && f.department.toLowerCase().includes(q));

      let matchRating = true;
      if (ratingFilter === '5') matchRating = f.ratings.overall === 5;
      else if (ratingFilter === '4') matchRating = f.ratings.overall === 4;
      else if (ratingFilter === '3_below') matchRating = f.ratings.overall <= 3;

      let matchRole = true;
      if (roleFilter !== 'all') {
        matchRole = f.role === roleFilter;
      }

      return matchQuery && matchRating && matchRole;
    });
  }, [feedbacks, searchQuery, ratingFilter, roleFilter]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass: fptlvn2026 or admin123
    if (adminPassword.trim() === 'fptlvn2026' || adminPassword.trim() === 'admin123' || adminPassword.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Mật khẩu không chính xác. Mẹo thử: fptlvn2026 hoặc admin123');
    }
  };

  const handleCopySheets = () => {
    const text = copyForGoogleSheets(feedbacks);
    navigator.clipboard.writeText(text);
    setCopiedSheetData(true);
    setTimeout(() => setCopiedSheetData(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPartners: [PartnerConfig, PartnerConfig, PartnerConfig] = [
      {
        ...settings.partners[0],
        name: partner1Name,
        imageUrl: partner1Url,
        websiteUrl: partner1Web
      },
      {
        ...settings.partners[1],
        name: partner2Name,
        imageUrl: partner2Url,
        websiteUrl: partner2Web
      },
      {
        ...settings.partners[2],
        name: partner3Name,
        imageUrl: partner3Url,
        websiteUrl: partner3Web
      }
    ];

    onUpdateSettings({
      ...settings,
      googleSheetUrl: sheetUrlInput.trim(),
      webhookUrl: webhookUrlInput.trim(),
      isOpen: isOpenSurvey,
      partners: updatedPartners
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrlInput.trim()) {
      setTestWebhookStatus({ type: 'error', message: 'Vui lòng dán Webhook URL trước khi thử nghiệm' });
      return;
    }
    setIsTestingWebhook(true);
    setTestWebhookStatus(null);
    try {
      const res = await sendFeedbackToGoogleSheet({
        id: `test-${Date.now()}`,
        createdAt: new Date().toISOString(),
        fullName: 'Nguyễn Văn Test',
        studentId: 'QE179999',
        role: 'student',
        ratings: { overall: 5, organization: 5, stage: 5, content: 5, hospitality: 5 },
        feedbackCurrent: 'Dòng test tự động map vào sheet FEEDBACK LTV từ hệ thống',
        feedbackFuture: 'Gợi ý concept kỳ sau',
        selectedTags: ['PRISM SKY Rực Rỡ'],
        luckyCode: 'TEST-8888'
      }, webhookUrlInput.trim());

      setTestWebhookStatus({ type: 'success', message: 'Đã gửi dòng dữ liệu thử nghiệm! Hãy kiểm tra sheet FEEDBACK LTV của bạn.' });
    } catch (err: any) {
      setTestWebhookStatus({ type: 'error', message: err?.message || 'Gửi thất bại' });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // If not logged in yet, show auth gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
        <div className="relative w-full max-w-md rounded-2xl bg-[#090d22] border border-white/15 p-6 sm:p-8 text-center shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-indigo-400" />
          </div>

          <h3 className="text-xl font-bold text-white">Quản Trị Ban Tổ Chức</h3>
          <p className="mt-1 text-xs text-slate-400">
            Truy cập bảng điều khiển thống kê phản hồi và cấu hình Lễ Tôn Vinh PRISM SKY
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Nhập mã truy cập BTC..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              {authError && (
                <p className="mt-2 text-xs text-red-400 text-left">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 transition-all shadow-md cursor-pointer"
            >
              Mở Bảng Điều Khiển
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Mật khẩu mặc định: <code className="text-amber-300 font-mono">fptlvn2026</code></span>
            <button
              type="button"
              onClick={() => {
                setAdminPassword('fptlvn2026');
                setIsAuthenticated(true);
              }}
              className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Điền nhanh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      
      <div className="relative w-full max-w-6xl rounded-2xl bg-[#080c20] border border-white/15 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Admin Navigation Top Header */}
        <div className="px-5 py-4 bg-[#0c122e] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Trung Tâm Quản Trị LTV PRISM SKY
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  {settings.isOpen ? 'Cổng Feedback Đang Mở' : 'Đã Đóng Cổng'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                FPT University Quy Nhơn · Hội trường Penrose Hall
              </p>
            </div>
          </div>

          {/* Tab Selector & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Chỉ Số Đánh Giá</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('feedbacks')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'feedbacks'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Danh Sách Feedback ({feedbacks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Cài Đặt & Logo Đối Tác</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Tab 1: Analytics & Metrics */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-medium text-slate-400">Tổng Lượt Phản Hồi</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-white tabular-nums">
                    {stats.total}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">người tham gia</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Mẫu kiểm tra & phản hồi trực tiếp</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-medium text-slate-400">Điểm Đánh Giá Tổng Quan</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-3xl font-extrabold text-amber-300 tabular-nums">
                    {stats.avgOverall}
                  </span>
                  <span className="text-sm text-slate-400">/ 5.0</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(stats.avgOverall)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Thang điểm tiêu chuẩn LTV</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-medium text-slate-400">Chỉ Số Hài Lòng (CSAT)</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-emerald-400 tabular-nums">
                    {stats.csatPercent}%
                  </span>
                  <span className="text-xs text-slate-300">đánh giá 4-5 sao</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Tỉ lệ phản hồi tích cực cao</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-medium text-slate-400">Điểm Sân Khấu & Visual LED</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-cyan-300 tabular-nums">
                    {stats.avgStage}
                  </span>
                  <span className="text-sm text-slate-400">/ 5.0</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Penrose Hall hiệu ứng Prism</div>
              </div>

            </div>

            {/* Detailed Criteria Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Điểm Đánh Giá Chi Tiết Từng Hạng Mục
                </h4>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>1. Đánh giá tổng quan chương trình PRISM SKY</span>
                      <span className="font-mono font-bold text-amber-300">{stats.avgOverall} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(stats.avgOverall / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>2. Khâu tiếp đón & Hướng dẫn Check-in</span>
                      <span className="font-mono font-bold text-indigo-300">{stats.avgOrg} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(stats.avgOrg / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>3. Visual, Âm thanh, Ánh sáng Penrose Hall</span>
                      <span className="font-mono font-bold text-cyan-300">{stats.avgStage} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(stats.avgStage / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>4. Kịch bản & Nghi thức tôn vinh (Cóc Vàng, CLB...)</span>
                      <span className="font-mono font-bold text-yellow-300">{stats.avgContent} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(stats.avgContent / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>5. Quà tặng kỷ niệm & Hậu cần</span>
                      <span className="font-mono font-bold text-purple-300">{stats.avgHosp} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(stats.avgHosp / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Concept Suggestions & Future Wishes */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Tổng Hợp Ý Tưởng Concept Kỳ Tới Từ Sinh Viên
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Gợi ý nổi bật nhất được sinh viên đề xuất trong mục câu hỏi số 2:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                      🪐 Cyberpunk Aurora & AI Future
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold">
                      🌊 The Ocean Realm - Tinh hoa Biển Quy Nhơn
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                      📸 Thêm Photobooth 360 độ check-in sảnh
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">
                      ✨ Màn chiếu lời chúc gia đình tương tác trực tiếp
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-semibold">
                      🎭 Mapping trang phục truyền thống Bình Định
                    </span>
                  </div>
                </div>

                {/* Quick Export CTA */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Sẵn sàng xuất file báo cáo cho Ban Lãnh đạo
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => exportFeedbacksQuickCSV(feedbacks)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Xuất 3 cột: Họ và tên, MSSV, Ý kiến đóng góp"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Xuất File (Họ và tên, MSSV, Ý kiến)
                    </button>
                    <button
                      type="button"
                      onClick={() => exportFeedbacksToCSV(feedbacks)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      Xuất File Chi Tiết
                    </button>
                    <button
                      type="button"
                      onClick={handleCopySheets}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSheetData ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSheetData ? 'Đã Chép Dữ Liệu!' : 'Chép Cho Google Sheets'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Feedbacks Table & Management */}
        {activeTab === 'feedbacks' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            
            {/* Search, Filter & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo Tên, MSSV hoặc nội dung ý kiến..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={ratingFilter}
                  onChange={e => setRatingFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#0e142e] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="all">Tất cả số sao</option>
                  <option value="5">5 Sao (Tuyệt vời)</option>
                  <option value="4">4 Sao (Rất tốt)</option>
                  <option value="3_below">≤ 3 Sao (Cần cải thiện)</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0e142e] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="all">Tất cả đối tượng</option>
                  <option value="honoree">Sinh viên Tôn vinh</option>
                  <option value="student">Sinh viên tham dự</option>
                  <option value="alumni">Cựu sinh viên</option>
                  <option value="guest">Khách mời</option>
                </select>

                <button
                  type="button"
                  onClick={() => exportFeedbacksQuickCSV(feedbacks)}
                  className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Xuất file gồm 3 cột: Họ và tên, MSSV, Ý kiến đóng góp"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất File (Họ tên, MSSV, Ý kiến)
                </button>

                <button
                  type="button"
                  onClick={() => exportFeedbacksToCSV(feedbacks)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Xuất toàn bộ các cột điểm số chi tiết"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Xuất Chi Tiết
                </button>
              </div>

            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Họ và Tên</th>
                    <th className="py-3 px-4">MSSV / Ngành</th>
                    <th className="py-3 px-4 text-center">Đánh giá</th>
                    <th className="py-3 px-4 max-w-xs">Góp ý LTV đợt này</th>
                    <th className="py-3 px-4 max-w-xs">Concept mong muốn</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Không tìm thấy phản hồi nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredFeedbacks.map(fb => (
                      <tr key={fb.id} className="hover:bg-white/[0.03] transition-colors group">
                        
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-white font-mono font-bold text-[11px]">
                            {fb.luckyCode}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(fb.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {fb.fullName}
                            {fb.isFeatured && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          <span className="text-[10px] text-indigo-300">
                            {fb.role === 'honoree' ? 'SV Tôn vinh' : 'SV Tham gia'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-amber-300 font-bold">
                            {fb.studentId}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {fb.department || '-'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 font-bold">
                            <span>{fb.ratings.overall}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-300 line-clamp-2 italic">
                            "{fb.feedbackCurrent}"
                          </p>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-400 line-clamp-2">
                            {fb.feedbackFuture || '-'}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedFeedback(fb)}
                              title="Xem chi tiết"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onToggleFeatured(fb.id)}
                              title={fb.isFeatured ? "Bỏ đánh dấu sao" : "Đánh dấu sao nổi bật"}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                fb.isFeatured
                                  ? 'text-amber-400 hover:bg-amber-400/10'
                                  : 'text-slate-500 hover:text-amber-300 hover:bg-white/10'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Xác nhận xóa phản hồi của ${fb.fullName} (${fb.studentId})?`)) {
                                  onDeleteFeedback(fb.id);
                                }
                              }}
                              title="Xóa phản hồi"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Settings & 3 Strategic Partner Logo URLs (Requirement 3 & Sheet Link) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 space-y-6 overflow-y-auto">
            
            {/* Google Sheet Direct Mapping & Webhook Section */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-emerald-500/20 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Đồng Bộ & Map Dữ Liệu Vào Sheet: FEEDBACK LTV
                    </h4>
                    <p className="text-xs text-slate-400">
                      Map 3 cột A (Họ và tên), B (MSSV), C (Ý kiến đóng góp) tự động hoặc 1 chạm
                    </p>
                  </div>
                </div>

                <a
                  href={sheetUrlInput || USER_TARGET_SHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Mở Google Sheet FEEDBACK LTV</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Đường dẫn Sheet */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Trang Tính Google Sheet Của Bạn:
                </label>
                <input
                  type="url"
                  value={sheetUrlInput}
                  onChange={e => setSheetUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 font-mono"
                />
              </div>

              {/* PHƯƠNG THỨC 1: TỰ ĐỘNG THỜI GIAN THỰC (REAL-TIME APPS SCRIPT WEBHOOK) */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Cách 1: Tự Động Map Thời Gian Thực (Khi Sinh Viên Bấm Gửi Sẽ Vào Ngay Sheet)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Đã Chép Mã Apps Script!' : 'Sao Chép Đoạn Mã Apps Script'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 bg-black/30 p-3 rounded-lg border border-white/5">
                  <div className="font-semibold text-amber-200 mb-1">Hướng dẫn cài đặt trong 30 giây:</div>
                  <p>1. Trong Google Sheet <strong>FEEDBACK LTV</strong>, bấm menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.</p>
                  <p>2. Xóa hết mã có sẵn trong đó, bấm nút <strong>"Sao Chép Đoạn Mã Apps Script"</strong> ở trên rồi <strong>Ctrl+V</strong> vào, bấm <strong>Lưu</strong> (Ctrl+S).</p>
                  <p>3. Bấm <strong>Triển khai (Deploy)</strong> ở góc trên bên phải &gt; <strong>Triển khai dưới dạng ứng dụng web (New deployment &gt; Web app)</strong>:</p>
                  <p className="pl-4 text-slate-400">• Người có quyền truy cập (Who has access): Chọn <strong>Bất kỳ ai (Anyone)</strong>.</p>
                  <p>4. Bấm <strong>Triển khai</strong>, cấp quyền rồi sao chép <strong>URL Ứng Dụng Web</strong> dán vào ô bên dưới:</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={webhookUrlInput}
                    onChange={e => setWebhookUrlInput(e.target.value)}
                    placeholder="Dán URL Webhook Apps Script (VD: https://script.google.com/macros/s/.../exec)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingWebhook ? (
                      <span>Đang gửi thử...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>Gửi Thử 1 Dòng Vào Sheet</span>
                      </>
                    )}
                  </button>
                </div>

                {testWebhookStatus && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    testWebhookStatus.type === 'success' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {testWebhookStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{testWebhookStatus.message}</span>
                  </div>
                )}
              </div>

              {/* PHƯƠNG THỨC 2: SAO CHÉP NHANH 1 CLICK DÁN VÀO A1 */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">Cách 2: Sao Chép Nhanh Dán Vào Ô A1</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Bấm nút bên cạnh, sau đó mở Sheet FEEDBACK LTV chọn ô <strong>A1</strong> và bấm <strong>Ctrl + V</strong> là xong ngay lập tức!
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopySheets}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    {copiedSheetData ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSheetData ? 'Đã Chép Xong! Bấm Ctrl+V vào ô A1' : 'Sao Chép 3 Cột (A, B, C)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportFeedbacksQuickCSV(feedbacks)}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tải CSV 3 Cột</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3 STRATEGIC PARTNER LOGO SLOTS CONFIG (Requirement 3) */}
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-5">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Cấu Hình 3 Vị Trí URL Logo Đối Tác Chiến Lược (Tại Trang Chủ)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Thay đổi đường dẫn hình ảnh logo, tên đối tác và liên kết website hiển thị trực tiếp ngay tại trang chủ LTV.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Partner 1 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase">Vị Trí Đối Tác 1</span>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tên Đối Tác</label>
                    <input
                      type="text"
                      value={partner1Name}
                      onChange={e => setPartner1Name(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">URL Hình Ảnh Logo</label>
                    <input
                      type="url"
                      value={partner1Url}
                      onChange={e => setPartner1Url(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={partner1Web}
                      onChange={e => setPartner1Web(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  {/* Logo Preview */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 block mb-1">Xem trước:</span>
                    <div className="h-16 rounded-lg bg-black/40 border border-white/5 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={partner1Url}
                        alt="Preview 1"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                </div>

                {/* Partner 2 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase">Vị Trí Đối Tác 2</span>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tên Đối Tác</label>
                    <input
                      type="text"
                      value={partner2Name}
                      onChange={e => setPartner2Name(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">URL Hình Ảnh Logo</label>
                    <input
                      type="url"
                      value={partner2Url}
                      onChange={e => setPartner2Url(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={partner2Web}
                      onChange={e => setPartner2Web(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  {/* Logo Preview */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 block mb-1">Xem trước:</span>
                    <div className="h-16 rounded-lg bg-black/40 border border-white/5 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={partner2Url}
                        alt="Preview 2"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                </div>

                {/* Partner 3 */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase">Vị Trí Đối Tác 3</span>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tên Đối Tác</label>
                    <input
                      type="text"
                      value={partner3Name}
                      onChange={e => setPartner3Name(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">URL Hình Ảnh Logo</label>
                    <input
                      type="url"
                      value={partner3Url}
                      onChange={e => setPartner3Url(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={partner3Web}
                      onChange={e => setPartner3Web(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  {/* Logo Preview */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 block mb-1">Xem trước:</span>
                    <div className="h-16 rounded-lg bg-black/40 border border-white/5 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={partner3Url}
                        alt="Preview 3"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Portal Survey Status Toggle */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Trạng Thái Cổng Nhận Feedback</div>
                <div className="text-[11px] text-slate-400">Bật/tắt khả năng gửi phản hồi của sinh viên</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpenSurvey}
                  onChange={e => setIsOpenSurvey(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã lưu cấu hình thành công!
                </span>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 transition-colors shadow-md cursor-pointer text-xs sm:text-sm"
              >
                Lưu Thay Đổi
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Individual Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0b1029] border border-white/20 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedFeedback.fullName}</h3>
                <span className="text-xs font-mono text-amber-300">{selectedFeedback.studentId} · {selectedFeedback.department}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400">Mã Gửi:</span>
                <span className="font-mono font-bold text-amber-300">{selectedFeedback.luckyCode}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                <span className="text-slate-400">Đánh giá chung:</span>
                <span className="font-bold text-amber-400">{selectedFeedback.ratings.overall}/5 Sao</span>
              </div>
              
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 font-semibold block mb-1">1. Đóng góp ý kiến LTV đợt này:</span>
                <p className="text-white italic leading-relaxed">{selectedFeedback.feedbackCurrent}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 font-semibold block mb-1">2. Góp ý đợt sau & Concept mong muốn:</span>
                <p className="text-white italic leading-relaxed">{selectedFeedback.feedbackFuture || 'Không có'}</p>
              </div>

              {selectedFeedback.selectedTags && selectedFeedback.selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedFeedback.selectedTags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedFeedback(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
