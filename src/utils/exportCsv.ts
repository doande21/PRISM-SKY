import { FeedbackItem } from '../types/index.ts';

// Comprehensive CSV export with all metrics
export function exportFeedbacksToCSV(feedbacks: FeedbackItem[], filename = 'FPTU_QuyNhon_Feedback_LTV_PRISM_SKY_ChiTiet.csv') {
  const headers = [
    'STT',
    'Mã May Mắn',
    'Thời Gian Gửi',
    'Họ và Tên',
    'MSSV',
    'Khoa / Ngành',
    'Vai Trò',
    'Điểm Tổng Quan (1-5)',
    'Điểm Đón Tiếp (1-5)',
    'Điểm Sân Khấu (1-5)',
    'Điểm Kịch Bản (1-5)',
    'Điểm Hậu Cần (1-5)',
    'Ý Kiến Đóng Góp LTV Đợt Này',
    'Góp Ý BTC Đợt Tiếp Theo & Concept Mong Muốn',
    'Thẻ Cảm Xúc'
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const cleanStr = String(str).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const rows = feedbacks.map((fb, index) => [
    index + 1,
    escapeCSV(fb.luckyCode),
    escapeCSV(new Date(fb.createdAt).toLocaleString('vi-VN')),
    escapeCSV(fb.fullName),
    escapeCSV(fb.studentId),
    escapeCSV(fb.department || 'Chưa cập nhật'),
    escapeCSV(
      fb.role === 'honoree' ? 'Sinh viên được tôn vinh' :
      fb.role === 'student' ? 'Sinh viên tham dự' :
      fb.role === 'alumni' ? 'Cựu sinh viên' : 'Khách mời / Cán bộ'
    ),
    fb.ratings.overall,
    fb.ratings.organization,
    fb.ratings.stage,
    fb.ratings.content,
    fb.ratings.hospitality,
    escapeCSV(fb.feedbackCurrent),
    escapeCSV(fb.feedbackFuture),
    escapeCSV((fb.selectedTags || []).join('; '))
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Quick 3-column CSV export matching the user's attachment: "Họ và tên,MSSV,Ý kiến đóng góp"
export function exportFeedbacksQuickCSV(feedbacks: FeedbackItem[], filename = 'FPTU_FEEDBACK_LTV.csv') {
  const headers = ['Họ và tên', 'MSSV', 'Ý kiến đóng góp'];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const cleanStr = String(str).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const rows = feedbacks.map((fb) => {
    // Combine feedback current and future concept for the "Ý kiến đóng góp" column
    const combinedFeedback = fb.feedbackFuture && fb.feedbackFuture !== 'Chưa có ý tưởng bổ sung'
      ? `${fb.feedbackCurrent} | Concept kỳ sau: ${fb.feedbackFuture}`
      : fb.feedbackCurrent;

    return [
      escapeCSV(fb.fullName),
      escapeCSV(fb.studentId),
      escapeCSV(combinedFeedback)
    ];
  });

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Copy as tab-separated data for direct paste into Google Sheet A1:C1
export function copyForGoogleSheets(feedbacks: FeedbackItem[]): string {
  const headers = ['Họ và tên', 'MSSV', 'Ý kiến đóng góp'];

  const rows = feedbacks.map((fb) => {
    const combinedFeedback = fb.feedbackFuture && fb.feedbackFuture !== 'Chưa có ý tưởng bổ sung'
      ? `${fb.feedbackCurrent} (Concept kỳ sau: ${fb.feedbackFuture})`
      : fb.feedbackCurrent;

    return [
      fb.fullName,
      fb.studentId,
      combinedFeedback.replace(/\t|\r|\n/g, ' ')
    ].join('\t');
  });

  return [headers.join('\t'), ...rows].join('\n');
}
