import { FeedbackItem } from '../types/index.ts';

export const USER_TARGET_SHEET_URL = "https://docs.google.com/spreadsheets/d/1LV6BTcTGk7xkNOShqHUWF5AsdFt9UMMOngkeroTGXm8/edit?gid=0#gid=0";
export const USER_TARGET_SHEET_ID = "1LV6BTcTGk7xkNOShqHUWF5AsdFt9UMMOngkeroTGXm8";

// Ready-to-paste Google Apps Script specifically configured for this sheet
export const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Trang tính1") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Ghi tiêu đề vào hàng 1 nếu chưa có
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Họ và tên", "MSSV", "Ý kiến đóng góp"]);
      sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#002855").setFontColor("#ffffff");
    }
    
    // Map dữ liệu vào 3 cột A, B, C theo đúng yêu cầu
    var combinedFeedback = data.feedbackCurrent || data.feedback || "";
    if (data.feedbackFuture && data.feedbackFuture !== "Chưa có ý tưởng bổ sung") {
      combinedFeedback += " (Concept kỳ sau: " + data.feedbackFuture + ")";
    }
    
    sheet.appendRow([
      data.fullName || "",
      data.studentId || "",
      combinedFeedback
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

/**
 * Tự động gửi feedback lên Google Sheet thông qua Apps Script Webhook nếu có cấu hình
 */
export async function sendFeedbackToGoogleSheet(
  feedback: FeedbackItem,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  if (!webhookUrl || !webhookUrl.trim()) {
    // Chưa có Webhook, dữ liệu vẫn được lưu trữ trên ứng dụng và có thể copy 1-click vào Sheet
    return { success: false, error: 'Chưa cấu hình Webhook URL' };
  }

  try {
    const payload = {
      fullName: feedback.fullName,
      studentId: feedback.studentId,
      department: feedback.department || '',
      feedbackCurrent: feedback.feedbackCurrent,
      feedbackFuture: feedback.feedbackFuture,
      feedback: feedback.feedbackFuture && feedback.feedbackFuture !== 'Chưa có ý tưởng bổ sung'
        ? `${feedback.feedbackCurrent} (Concept kỳ sau: ${feedback.feedbackFuture})`
        : feedback.feedbackCurrent,
      overallRating: feedback.ratings.overall,
      luckyCode: feedback.luckyCode,
      createdAt: new Date(feedback.createdAt).toLocaleString('vi-VN')
    };

    // Google Apps Script requires mode: 'no-cors' from browser to avoid CORS redirect blocks
    await fetch(webhookUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi khi gửi lên Google Sheet Webhook:', err);
    return { success: false, error: err?.message || 'Lỗi kết nối' };
  }
}
