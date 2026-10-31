import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { OtpPage } from './components/OtpPage';
import { MainPage } from './components/MainPage';
import { RoomPage } from './components/RoomPage';
import { CreateLiveModal } from './components/CreateLiveModal';
import { RankingModal } from './components/RankingModal';
import { PlusPage } from './components/PlusPage';
import { LiveRoom } from './types';

const INITIAL_ROOMS: LiveRoom[] = [
  {
    id: 'room-1',
    name: 'Friendship Zone',
    host: 'Rahul',
    topic: 'Friendship',
    isPublic: true,
    capacity: 50,
    members: 28,
    isActive: true,
    isMuted: false,
    memberNames: ['Rahul', 'Aman', 'Priya'],
  },
  {
    id: 'room-2',
    name: 'Music Lovers',
    host: 'Aman',
    topic: 'Music',
    isPublic: true,
    capacity: 30,
    members: 16,
    isActive: true,
    isMuted: false,
    memberNames: ['Aman', 'Neha'],
  },
  {
    id: 'room-3',
    name: 'Chit Chat Family',
    host: 'Priya',
    topic: 'Talk & Fun',
    isPublic: true,
    capacity: 50,
    members: 42,
    isActive: true,
    isMuted: false,
    memberNames: ['Priya', 'Ravi', 'Simran'],
  },
  {
    id: 'room-4',
    name: 'Gaming Club',
    host: 'Arjun',
    topic: 'Gaming',
    isPublic: false,
    capacity: 20,
    members: 12,
    isActive: true,
    isMuted: false,
    memberNames: ['Arjun', 'Karan'],
  },
];

export default function App() {
  const [userName, setUserName] = useState<string>('');
  const [tempPhone, setTempPhone] = useState<string>('');
  const [currentView, setCurrentView] = useState<'login' | 'otp' | 'main' | 'room' | 'plus'>('login');
  const [hindi, setHindi] = useState<boolean>(true);
  const [rooms, setRooms] = useState<LiveRoom[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<LiveRoom | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState<boolean>(false);

  // SnackBar / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Support ?autostart=1 for rapid verification & testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setUserName('Demo User');
      setCurrentView('main');
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Login Continue -> Goes to OTP Page
  const handleLoginContinue = (name: string, phone: string) => {
    setUserName(name);
    setTempPhone(phone);
    setCurrentView('otp');
  };

  // OTP Verified -> Goes to MainPage
  const handleOtpVerified = () => {
    setCurrentView('main');
    showToast(hindi ? `नमस्ते ${userName}! Chit Chat में आपका स्वागत है।` : `Welcome ${userName}!`);
  };

  // Back from OTP to Login
  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  // Logout
  const handleLogout = () => {
    setUserName('');
    setTempPhone('');
    setCurrentView('login');
    showToast('Logged out successfully.');
  };

  // Open Room
  const handleOpenRoom = (room: LiveRoom) => {
    setActiveRoom(room);
    setCurrentView('room');
  };

  // Leave Room
  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setCurrentView('main');
  };

  // Update room state (members, muted, etc.)
  const handleUpdateRoom = (updated: LiveRoom) => {
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setActiveRoom(updated);
  };

  // End live room
  const handleEndRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, isActive: false } : r))
    );
    setActiveRoom(null);
    setCurrentView('main');
  };

  // Add new room
  const handleCreateRoom = (newRoom: LiveRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    showToast(hindi ? 'लाइव रूम सफलतापूर्वक शुरू हुआ!' : 'Live room created!');
    handleOpenRoom(newRoom);
  };

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col font-sans">
      {/* View routing */}
      {currentView === 'login' && (
        <LoginPage onContinue={handleLoginContinue} showToast={showToast} />
      )}

      {currentView === 'otp' && (
        <OtpPage
          name={userName}
          phone={tempPhone}
          onVerified={handleOtpVerified}
          onBack={handleBackToLogin}
          showToast={showToast}
        />
      )}

      {currentView === 'main' && (
        <MainPage
          userName={userName}
          rooms={rooms}
          onOpenRoom={handleOpenRoom}
          onRequestCreateRoom={() => setIsCreateModalOpen(true)}
          onOpenRanking={() => setIsRankingModalOpen(true)}
          onOpenPlus={() => setCurrentView('plus')}
          onLogout={handleLogout}
          hindi={hindi}
          onToggleHindi={() => setHindi(!hindi)}
          showToast={showToast}
        />
      )}

      {currentView === 'room' && activeRoom && (
        <RoomPage
          room={activeRoom}
          currentUser={userName || 'You'}
          isHindi={hindi}
          onUpdateRoom={handleUpdateRoom}
          onLeave={handleLeaveRoom}
          onEndRoom={handleEndRoom}
          showToast={showToast}
        />
      )}

      {currentView === 'plus' && (
        <div className="max-w-lg mx-auto w-full min-h-screen bg-[#10101D]">
          <PlusPage
            onBack={() => setCurrentView('main')}
            showToast={showToast}
            isHindi={hindi}
          />
        </div>
      )}

      {/* Create Live Modal */}
      <CreateLiveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRoom}
        currentUser={userName || 'You'}
        isHindi={hindi}
        showToast={showToast}
      />

      {/* Ranking / Leaderboard Modal */}
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        rooms={rooms}
        onSelectRoom={handleOpenRoom}
        isHindi={hindi}
      />

      {/* SnackBar / Toast Notification (matches Flutter ScaffoldMessenger SnackBar) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 bg-[#202035] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#FF4D8D]/40 flex items-center justify-between gap-3 text-sm animate-fade-in"
        >
          <span className="line-clamp-2">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-[#FF4D8D] font-bold hover:underline shrink-0 cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
}
