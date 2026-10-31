import React, { useState } from 'react';
import {
  Home,
  Tv,
  PlusCircle,
  Mail,
  User,
  Search,
  Trophy,
  Mic,
  Plus,
  ChevronRight,
  Radio,
  Users,
} from 'lucide-react';
import { LiveRoom } from '../types';
import { filterRooms } from '../utils/chatLogic';
import { PlusPage } from './PlusPage';
import { InboxPage } from './InboxPage';
import { ProfilePage } from './ProfilePage';

interface MainPageProps {
  userName: string;
  rooms: LiveRoom[];
  onOpenRoom: (room: LiveRoom) => void;
  onRequestCreateRoom: () => void;
  onOpenRanking: () => void;
  onOpenPlus: () => void;
  onLogout: () => void;
  hindi: boolean;
  onToggleHindi: () => void;
  showToast: (msg: string) => void;
}

const AVATAR_COLORS = [
  'bg-pink-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-cyan-600',
  'bg-rose-600',
];

export const MainPage: React.FC<MainPageProps> = ({
  userName,
  rooms,
  onOpenRoom,
  onRequestCreateRoom,
  onOpenRanking,
  onOpenPlus,
  onLogout,
  hindi,
  onToggleHindi,
  showToast,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const t = (hi: string, en: string) => (hindi ? hi : en);

  const activeRooms = filterRooms(rooms, searchQuery, selectedTopic);

  // Tab 0: Home Content
  const renderHomeContent = () => (
    <div className="flex flex-col flex-1 overflow-y-auto pb-24">
      {/* Top Bar */}
      <div className="p-3 flex items-center gap-2">
        {/* Language button */}
        <button
          type="button"
          onClick={onToggleHindi}
          className="p-2.5 px-3 bg-[#202035] rounded-xl text-white font-bold text-sm hover:bg-white/10 transition cursor-pointer shrink-0"
        >
          {hindi ? 'हिंदी' : 'EN'}
        </button>

        {/* Search Field */}
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('रूम खोजें...', 'Search rooms...')}
            className="w-full pl-9 pr-3 py-2 bg-[#202035] rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF4D8D]"
          />
        </div>

        {/* Ranking Trophy Button */}
        <button
          type="button"
          onClick={onOpenRanking}
          aria-label="View Leaderboard & Rankings"
          className="p-2 text-amber-400 hover:bg-white/10 rounded-xl transition cursor-pointer"
        >
          <Trophy className="w-7 h-7" />
        </button>
      </div>

      {/* LIVE PITCH Gradient Banner */}
      <div className="px-3">
        <div className="relative h-36 w-full rounded-[18px] bg-gradient-to-r from-[#FF4D8D] via-[#7928CA] to-[#282B83] overflow-hidden p-5 flex flex-col justify-center shadow-lg">
          {/* Watermark Mic Icon */}
          <div className="absolute right-3 top-2 text-white/20 pointer-events-none">
            <Mic className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-wide">LIVE PITCH</h2>
            <p className="text-white/90 text-sm mt-0.5">
              {t('दोस्तों से जुड़ें और बातें करें!', 'Connect with friends and chat!')}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>● LIVE NOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Live Room Card */}
      <div className="p-3">
        <div
          onClick={onRequestCreateRoom}
          className="p-3.5 bg-[#202035] rounded-[15px] border border-[#FF4D8D] flex items-center justify-between hover:bg-[#282844] transition cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF4D8D] text-white flex items-center justify-center shadow-md">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-base font-bold text-white">
              {t('लाइव रूम बनाएं', 'Create Live Room')}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Room Heading */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF4D8D]" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t('एक्टिव लाइव रूम', 'Active Live Rooms')}
          </h3>
        </div>
        <span className="text-xs sm:text-sm text-gray-400">
          {activeRooms.length} {t('रूम', 'Rooms')}
        </span>
      </div>

      {/* Rooms List */}
      <div className="px-3 flex-1">{renderRoomList(activeRooms)}</div>
    </div>
  );

  // Tab 1: Live Content
  const renderLiveContent = () => (
    <div className="flex flex-col flex-1 overflow-y-auto pb-24">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Rooms</h2>
        <button
          type="button"
          onClick={onRequestCreateRoom}
          className="px-4 py-2 bg-[#FF4D8D] hover:bg-[#ff337a] text-white rounded-xl font-bold text-sm flex items-center gap-1.5 shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </button>
      </div>

      {/* Topic Filter Chips */}
      <div className="px-4 flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {['All', 'Friendship', 'Music', 'Talk & Fun', 'Gaming'].map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTopic === topic
                ? 'bg-[#FF4D8D] text-white'
                : 'bg-[#202035] text-gray-400 hover:text-white'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Room Heading */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#FF4D8D]" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t('एक्टिव लाइव रूम', 'Active Live Rooms')}
          </h3>
        </div>
        <span className="text-xs sm:text-sm text-gray-400">
          {activeRooms.length} {t('रूम', 'Rooms')}
        </span>
      </div>

      <div className="px-3 flex-1">{renderRoomList(activeRooms)}</div>
    </div>
  );

  // Shared Room List Renderer matching Flutter
  const renderRoomList = (list: LiveRoom[]) => {
    if (list.length === 0) {
      return (
        <div className="py-16 text-center text-gray-400 text-sm">
          {t('कोई एक्टिव रूम नहीं है', 'No active rooms found')}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        {list.map((room, index) => {
          const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
          return (
            <div
              key={room.id}
              onClick={() => onOpenRoom(room)}
              className="p-3 bg-[#202035] rounded-[15px] border border-white/5 hover:border-[#FF4D8D]/40 transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-13 h-13 rounded-full ${colorClass} flex items-center justify-center shrink-0 text-white shadow`}
                >
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-[#FF4D8D] transition line-clamp-1">
                    {room.name}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {room.topic} • Host: {room.host}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white">
                  {room.members}/{room.capacity}
                </span>
                <span className="text-[10px] text-gray-400">Members</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const pages = [
    renderHomeContent(),
    renderLiveContent(),
    <PlusPage key="plus" showToast={showToast} isHindi={hindi} />,
    <InboxPage key="inbox" showToast={showToast} isHindi={hindi} />,
    <ProfilePage
      key="profile"
      userName={userName}
      onLogout={onLogout}
      isHindi={hindi}
      onToggleLanguage={onToggleHindi}
      showToast={showToast}
    />,
  ];

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col justify-between max-w-lg mx-auto w-full border-x border-white/5 relative">
      {/* Active Tab Page */}
      <div className="flex-1 flex flex-col overflow-hidden">{pages[selectedTab]}</div>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="App Navigation"
        className="fixed bottom-0 inset-x-0 max-w-lg mx-auto bg-[#202035] border-t border-white/5 px-2 py-1.5 flex justify-around items-center z-30"
      >
        {/* Home */}
        <button
          type="button"
          onClick={() => setSelectedTab(0)}
          className={`flex flex-col items-center py-1 px-3 transition cursor-pointer ${
            selectedTab === 0 ? 'text-[#FF4D8D]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Home</span>
        </button>

        {/* Live */}
        <button
          type="button"
          onClick={() => setSelectedTab(1)}
          className={`flex flex-col items-center py-1 px-3 transition cursor-pointer ${
            selectedTab === 1 ? 'text-[#FF4D8D]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Live</span>
        </button>

        {/* Plus (opens modal or plus tab) */}
        <button
          type="button"
          onClick={() => {
            onOpenPlus();
          }}
          className="flex flex-col items-center py-1 px-3 text-[#FF4D8D] hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <PlusCircle className="w-8 h-8" />
          <span className="text-[11px] font-bold mt-0.5">Plus</span>
        </button>

        {/* Inbox */}
        <button
          type="button"
          onClick={() => setSelectedTab(3)}
          className={`flex flex-col items-center py-1 px-3 transition cursor-pointer ${
            selectedTab === 3 ? 'text-[#FF4D8D]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Inbox</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => setSelectedTab(4)}
          className={`flex flex-col items-center py-1 px-3 transition cursor-pointer ${
            selectedTab === 4 ? 'text-[#FF4D8D]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
};
