import { AppSettings, FeedbackItem } from '../types/index.ts';

// Clean vector logos representing FPT University, 20 Năm, and Partner/Club matching user reference image
const FPT_EDU_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none"><text x="12" y="16" fill="%23cbd5e1" font-size="11" font-family="sans-serif" font-weight="600" letter-spacing="1">FPT Education</text><g transform="translate(12, 22)"><path d="M0 24 L10 2 L24 2 L14 24 Z" fill="%230066b2"/><path d="M16 24 L26 2 L40 2 L30 24 Z" fill="%23f37021"/><path d="M32 24 L42 2 L56 2 L46 24 Z" fill="%2300a850"/><text x="64" y="19" fill="%23ffffff" font-size="16" font-family="sans-serif" font-weight="900" letter-spacing="0.5">FPT UNIVERSITY</text></g></svg>`;

const FPT_20YEARS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" fill="none"><text x="50" y="32" fill="%23f97316" font-size="28" font-family="sans-serif" font-weight="900" text-anchor="middle">20</text><text x="50" y="46" fill="%23cbd5e1" font-size="7" font-family="sans-serif" font-weight="700" letter-spacing="1" text-anchor="middle">FPT UNIVERSITY</text></svg>`;

const CLUB_PARTNER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" fill="none"><circle cx="30" cy="30" r="18" fill="%233b82f6" opacity="0.3"/><circle cx="25" cy="22" r="5" fill="%230f172a"/><circle cx="35" cy="22" r="5" fill="%230f172a"/><circle cx="30" cy="30" r="14" fill="%23ffffff"/><circle cx="26" cy="28" r="3" fill="%230f172a"/><circle cx="34" cy="28" r="3" fill="%230f172a"/><path d="M28 34 Q30 36 32 34" stroke="%230f172a" stroke-width="2" fill="none"/><text x="54" y="31" fill="%2360a5fa" font-size="12" font-family="sans-serif" font-weight="800">JS CLUB</text><text x="54" y="43" fill="%23facc15" font-size="9">★★★★★</text></svg>`;

export const INITIAL_SETTINGS: AppSettings = {
  eventName: "LỄ TÔN VINH SINH VIÊN - PRISM SKY",
  eventSubtitle: "Student Achievement Awards Summer 2026",
  eventDate: "25/11/2026 - 18:00 (Thứ Tư)",
  eventVenue: "Hội trường Penrose Hall - FPT University Quy Nhơn A.I Campus",
  isOpen: true,
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1LV6BTcTGk7xkNOShqHUWF5AsdFt9UMMOngkeroTGXm8/edit?gid=0#gid=0",
  webhookUrl: "https://script.google.com/macros/s/AKfycby4xN9KFhe0QrKKH0GzkUOKojxmZDZB1gNa5MBArlWTftfAWUB1pcuMikCjm641z4JV0A/exec",
  partners: [
    {
      id: "partner-1",
      name: "FPT University",
      role: "Đơn vị Đào tạo & Chủ quản",
      imageUrl: "https://i.postimg.cc/28hfcQtN/FPTU-EN.png",
      websiteUrl: "https://quynhon.fpt.edu.vn"
    },
    {
      id: "partner-2",
      name: "20 Năm FPT University",
      role: "Kỷ niệm 20 năm phát triển",
      imageUrl: "https://i.postimg.cc/28hfcQtN/FPTU-EN.png",
      websiteUrl: "https://fpt.edu.vn"
    }
  ]
};

export const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: "fb-001",
    createdAt: "2026-11-25T19:45:00.000Z",
    fullName: "Nguyễn Hoàng Nam",
    studentId: "QE170024",
    department: "Trí tuệ nhân tạo (A.I)",
    role: "honoree",
    ratings: {
      overall: 5,
      organization: 5,
      stage: 5,
      content: 5,
      hospitality: 4
    },
    feedbackCurrent: "Sân khấu Penrose Hall đợt này hiệu ứng visual Prism Sky cực kỳ mãn nhãn và xúc động! Khoảnh khắc nhận Cóc Vàng thực sự là kỷ niệm đẹp nhất đời sinh viên.",
    feedbackFuture: "Kỳ sau BTC có thể mở thêm màn chiếu livestream tương tác trực tiếp lời chúc từ gia đình ở xa lên màn hình LED chính thì sẽ càng tuyệt vời hơn nữa. Concept gợi ý: Cyberpunk Aurora hoặc Odyssey to Mars.",
    selectedTags: ["Tự Hào Cóc Vàng", "PRISM SKY Rực Rỡ", "Penrose Hall Mãn Nhãn"],
    luckyCode: "PRISM-1082",
    isFeatured: true
  },
  {
    id: "fb-002",
    createdAt: "2026-11-25T20:10:00.000Z",
    fullName: "Trần Mai Phương",
    studentId: "SE180415",
    department: "Kỹ thuật phần mềm (SE)",
    role: "honoree",
    ratings: {
      overall: 5,
      organization: 4,
      stage: 5,
      content: 5,
      hospitality: 5
    },
    feedbackCurrent: "Khâu check-in và quà lưu niệm pha lê rất chỉn chu. Âm thanh ánh sáng chuẩn chỉnh, vinh danh các CLB xuất sắc rất sôi động.",
    feedbackFuture: "Nên bố trí thêm 1 photobooth 360 độ ở sảnh ngoài vì đông bạn chụp hình quá phải xếp hàng hơi lâu. Concept kỳ tới: The Ocean Realm - Tinh hoa Biển Quy Nhơn.",
    selectedTags: ["Vươn Mình Cùng Đất Nước", "Bản Lĩnh Dẫn Đầu", "Cháy Hết Đam Mê"],
    luckyCode: "PRISM-3941",
    isFeatured: true
  },
  {
    id: "fb-003",
    createdAt: "2026-11-25T20:25:00.000Z",
    fullName: "Lê Gia Bảo",
    studentId: "CS170119",
    department: "Thiết kế Mỹ thuật số (GD)",
    role: "student",
    ratings: {
      overall: 5,
      organization: 5,
      stage: 5,
      content: 4,
      hospitality: 4
    },
    feedbackCurrent: "Ấn tượng mạnh với bộ nhận diện KV Prism Sky, màu sắc chuyển gradient pha lê và hiệu ứng chiếu sáng sân khấu cực kỳ nghệ thuật. Team Design đỉnh chóp!",
    feedbackFuture: "Mong kỳ sau có thêm phần trình diễn nghệ thuật kết hợp công nghệ Hologram hoặc Mapping trên nền trang phục truyền thống Bình Định.",
    selectedTags: ["PRISM SKY Rực Rỡ", "Trí Tuệ Vươn Tầm", "Tỏa Sáng Thiên Hà"],
    luckyCode: "PRISM-5509",
    isFeatured: false
  },
  {
    id: "fb-004",
    createdAt: "2026-11-25T20:40:00.000Z",
    fullName: "Võ Thị Quỳnh Như",
    studentId: "BA180092",
    department: "Quản trị kinh doanh (BA)",
    role: "student",
    ratings: {
      overall: 4,
      organization: 4,
      stage: 5,
      content: 4,
      hospitality: 5
    },
    feedbackCurrent: "Chương trình rất trang trọng và nhiều năng lượng tích cực. MC dẫn cuốn hút, thời lượng vừa phải không bị kéo dài.",
    feedbackFuture: "Mong đợt tới có thêm hoạt động mini game tương tác nhanh qua điện thoại giữa các tiết mục. Concept gợi ý: Starry Night in Quy Nhon.",
    selectedTags: ["Rực Rỡ Tuổi Trẻ FPT", "Khát Vọng Tiên Phong"],
    luckyCode: "PRISM-8217",
    isFeatured: false
  }
];

export const QUICK_TAGS = [
  "🌟 PRISM SKY Rực Rỡ",
  "🐸 Tự Hào Cóc Vàng",
  "🏛️ Penrose Hall Mãn Nhãn",
  "🚀 Khát Vọng Tiên Phong",
  "🇻🇳 Vươn Mình Cùng Đất Nước",
  "🔥 Cháy Hết Đam Mê",
  "💎 Tỏa Sáng Thiên Hà",
  "✨ Bản Lĩnh Dẫn Đầu",
  "💡 Trí Tuệ Vươn Tầm",
  "🎉 20 Năm FPTU Mãi Đỉnh"
];
