import React, { useState, useEffect } from 'react';
import { FeedbackItem, AppSettings } from './types/index.ts';
import { INITIAL_SETTINGS, INITIAL_FEEDBACKS } from './data/initialData.ts';
import { HomeKVView } from './components/HomeKVView.tsx';
import { SurveyView } from './components/SurveyView.tsx';
import { SuccessModal } from './components/SuccessModal.tsx';
import { QRCodeModal } from './components/QRCodeModal.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { Footer } from './components/Footer.tsx';

const STORAGE_KEY_FEEDBACKS = 'fpt_ltv_feedbacks_v6';
const STORAGE_KEY_SETTINGS = 'fpt_ltv_settings_v6';

export default function App() {
  // Navigation view state: 'home' (Duy nhất KV & nút Feedback ngay) | 'survey' (Form khảo sát chuyên biệt)
  const [currentView, setCurrentView] = useState<'home' | 'survey'>('home');

  // Initialize Feedbacks from LocalStorage or seed data
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading feedbacks from localStorage', e);
    }
    return INITIAL_FEEDBACKS;
  });

  // Initialize Settings from LocalStorage or default
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          googleSheetUrl: parsed.googleSheetUrl || INITIAL_SETTINGS.googleSheetUrl,
          webhookUrl: parsed.webhookUrl || INITIAL_SETTINGS.webhookUrl,
          partners: INITIAL_SETTINGS.partners
        };
      }
    } catch (e) {
      console.error('Failed reading settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Modals state
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackItem | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(feedbacks));
    } catch (e) {
      console.error('Failed writing feedbacks to localStorage', e);
    }
  }, [feedbacks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed writing settings to localStorage', e);
    }
  }, [settings]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle new feedback submission
  const handleSubmitSuccess = (newFeedback: FeedbackItem) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
    setCurrentView('home');
    setSubmittedFeedback(newFeedback);
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(item => item.id !== id));
  };

  // Handle toggle featured
  const handleToggleFeatured = (id: string) => {
    setFeedbacks(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
      )
    );
  };

  // Handle settings update
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#040714] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* ĐÃ XÓA HOÀN TOÀN THANH NAVBAR THEO YÊU CẦU TRONG ẢNH 1 - Giao diện bắt đầu trực tiếp từ 3 logo hàng đầu */}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' ? (
          /* TRANG CHỦ: Chứa DUY NHẤT 3 logo đối tác hàng đầu, tiêu đề, poster KV nguyên bản, nút Feedback ngay */
          <HomeKVView
            onStartFeedback={() => setCurrentView('survey')}
            onOpenAdmin={() => setIsAdminOpen(true)}
            partners={settings.partners}
            eventName={settings.eventName}
            eventDate={settings.eventDate}
            eventVenue={settings.eventVenue}
          />
        ) : (
          /* MÀN HÌNH KHẢO SÁT: Điều hướng qua form khảo sát riêng biệt khi nhấn nút */
          <SurveyView
            onBackToHome={() => setCurrentView('home')}
            onSubmitSuccess={handleSubmitSuccess}
            eventName={settings.eventName}
            partners={settings.partners}
            webhookUrl={settings.webhookUrl}
          />
        )}
      </main>

      {/* Footer gọn gàng (đã ẩn hoàn toàn nút admin) */}
      <Footer eventName={settings.eventName} />

      {/* Modals & Dialogs */}
      
      {/* 1. Success Confirmation Modal with Confetti & Lucky Draw Ticket */}
      <SuccessModal
        feedback={submittedFeedback}
        onClose={() => setSubmittedFeedback(null)}
        googleSheetUrl={settings.googleSheetUrl}
      />

      {/* 2. QR Code Generator Modal (có thể mở từ bên trong Admin Portal) */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        eventName={settings.eventName}
      />

      {/* 3. Admin Management Portal (Kích hoạt khi nhấn 3 lần liên tục vào KV) */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        feedbacks={feedbacks}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onDeleteFeedback={handleDeleteFeedback}
        onToggleFeatured={handleToggleFeatured}
      />

    </div>
  );
}
