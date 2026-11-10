export interface RatingBreakdown {
  overall: number; // 1-5
  organization: number; // 1-5 (Đón tiếp & Check-in)
  stage: number; // 1-5 (Sân khấu, âm thanh, ánh sáng Sảnh Penrose)
  content: number; // 1-5 (Kịch bản & Nghi thức tôn vinh)
  hospitality: number; // 1-5 (Hậu cần, quà tặng, tiệc)
}

export type ParticipantRole = 'honoree' | 'student' | 'alumni' | 'guest';

export interface FeedbackItem {
  id: string;
  createdAt: string; // ISO string
  fullName: string;
  studentId: string;
  department?: string;
  role: ParticipantRole;
  ratings: RatingBreakdown;
  feedbackCurrent: string; // "Bạn có đóng góp ý kiến gì đến LTV đợt này không?"
  feedbackFuture: string; // "Bạn có những góp ý gì đến BTC tổ chức LTV đợt tiếp theo không? Concept mong muốn (nếu có)."
  selectedTags: string[];
  luckyCode: string;
  isFeatured?: boolean;
}

export interface PartnerConfig {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  websiteUrl: string;
}

export interface AppSettings {
  googleSheetUrl: string;
  webhookUrl: string;
  isOpen: boolean;
  eventName: string;
  eventSubtitle: string;
  eventDate: string;
  eventVenue: string;
  partners: PartnerConfig[];
}
