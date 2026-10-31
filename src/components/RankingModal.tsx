import React, { useState } from 'react';
import { Trophy, X, Users, Crown, Flame, Star, Sparkles } from 'lucide-react';
import { LiveRoom } from '../types';
import { calculateRankings } from '../utils/chatLogic';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: LiveRoom[];
  onSelectRoom: (room: LiveRoom) => void;
  isHindi: boolean;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onSelectRoom,
  isHindi,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'hosts'>('rooms');

  if (!isOpen) return null;

  const rankedRooms = calculateRankings(rooms);

  // Top star hosts compiled from room data and community leaders
  const topHosts = [
    { name: 'Rahul Sharma', roomsHosted: 124, followers: '14.2k', score: '98k', badge: 'Diamond Voice' },
    { name: 'Priya Verma', roomsHosted: 98, followers: '11.8k', score: '82k', badge: 'ChitChat Queen' },
    { name: 'Aman Deep', roomsHosted: 76, followers: '9.4k', score: '64k', badge: 'Music Maestro' },
    { name: 'Neha Kapoor', roomsHosted: 54, followers: '6.1k', score: '45k', badge: 'Storyteller' },
    { name: 'Arjun Singh', roomsHosted: 43, followers: '5.2k', score: '38k', badge: 'Gaming Pro' },
  ];

  const getRankBadge = (index: number) => {
    if (index === 0) return { bg: 'bg-amber-400 text-gray-950 font-black', icon: <Crown className="w-3.5 h-3.5" /> };
    if (index === 1) return { bg: 'bg-slate-300 text-gray-950 font-black', icon: <Star className="w-3.5 h-3.5" /> };
    if (index === 2) return { bg: 'bg-amber-700 text-white font-black', icon: <Sparkles className="w-3.5 h-3.5" /> };
    return { bg: 'bg-gray-800 text-gray-300 font-bold', icon: null };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#202035] rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-700/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isHindi ? 'लीडरबोर्ड व रैंकिंग' : 'Ranking & Leaderboard'}
              </h2>
              <p className="text-xs text-gray-400">
                {isHindi ? 'आज के सबसे लोकप्रिय रूम और होस्ट' : 'Today’s top active rooms and star hosts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 p-1 bg-[#10101D] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'rooms'
                ? 'bg-[#FF4D8D] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isHindi ? 'टॉप रूम्स' : 'Top Rooms'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hosts')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'hosts'
                ? 'bg-[#FF4D8D] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isHindi ? 'स्टार होस्ट्स' : 'Star Hosts'}
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {activeTab === 'rooms' ? (
            rankedRooms.map((room, idx) => {
              const badge = getRankBadge(idx);
              return (
                <div
                  key={room.id}
                  onClick={() => {
                    onSelectRoom(room);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-[#10101D] hover:bg-[#151528] border border-gray-800 hover:border-[#FF4D8D]/50 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow ${badge.bg}`}
                    >
                      {badge.icon || idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-[#FF4D8D] transition">
                        {room.name}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{room.topic}</span>
                        <span>•</span>
                        <span>Host: {room.host}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {room.members}/{room.capacity}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            topHosts.map((host, idx) => {
              const badge = getRankBadge(idx);
              return (
                <div
                  key={host.name}
                  className="p-3.5 rounded-2xl bg-[#10101D] border border-gray-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow ${badge.bg}`}
                    >
                      {badge.icon || idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {host.name}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-[#FF4D8D] font-medium">
                          {host.badge}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {host.roomsHosted} {isHindi ? 'रूम्स होस्टेड' : 'rooms hosted'} • {host.followers} followers
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-400 flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {host.score}
                    </div>
                    <div className="text-[10px] text-gray-500">{isHindi ? 'पॉपुलैरिटी' : 'Popularity'}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
