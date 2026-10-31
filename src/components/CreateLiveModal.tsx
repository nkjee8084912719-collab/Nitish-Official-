import React, { useState } from 'react';
import { Radio, X, Users, Globe, Lock, Sparkles } from 'lucide-react';
import { validateCreateRoom } from '../utils/chatLogic';
import { LiveRoom } from '../types';

interface CreateLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (room: LiveRoom) => void;
  currentUser: string;
  isHindi: boolean;
  showToast: (msg: string) => void;
}

const POPULAR_TOPICS = ['Friendship', 'Music', 'Talk & Fun', 'Gaming', 'Late Night', 'Shayari'];

export const CreateLiveModal: React.FC<CreateLiveModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  currentUser,
  isHindi,
  showToast,
}) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateCreateRoom(name, topic, capacity);
    if (!val.isValid || !val.capacity) {
      showToast(val.error || 'Enter room details. Capacity must be 2–100.');
      return;
    }

    const newRoom: LiveRoom = {
      id: `room-${Date.now()}`,
      name: name.trim(),
      host: currentUser || 'You',
      topic: topic.trim(),
      isPublic,
      capacity: val.capacity,
      members: 1,
      isActive: true,
      isMuted: false,
      memberNames: [currentUser || 'You'],
      speakers: [currentUser || 'You'],
      coHosts: [],
      moderators: [],
      createdAt: Date.now(),
    };

    onCreate(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#202035] rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-700/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF4D8D]/20 text-[#FF4D8D]">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isHindi ? 'लाइव रूम बनाएं' : 'Create Live Room'}
              </h2>
              <p className="text-xs text-gray-400">
                {isHindi ? 'दोस्तों को आमंत्रित करें और तुरंत बात करें' : 'Invite friends and start talking now'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="room-name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'रूम का नाम' : 'Room Name'}
            </label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isHindi ? 'उदा. मस्ती की पाठशाला' : 'e.g. Chai & Chill Lounge'}
              className="w-full px-4 py-3 bg-[#10101D] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D8D] transition"
            />
          </div>

          <div>
            <label htmlFor="room-topic" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'रूम का विषय' : 'Room Topic'}
            </label>
            <input
              id="room-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isHindi ? 'उदा. गपशप, संगीत, शेरो-शायरी' : 'e.g. Friendship, Music, Gaming'}
              className="w-full px-4 py-3 bg-[#10101D] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D8D] transition"
            />
            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {POPULAR_TOPICS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTopic(item)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    topic === item
                      ? 'bg-[#FF4D8D] text-white font-semibold'
                      : 'bg-[#10101D] text-gray-300 hover:bg-white/10 border border-gray-700/60'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="room-capacity" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'अधिकतम सदस्य (2–100)' : 'Maximum Members (2–100)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Users className="w-4 h-4" />
              </span>
              <input
                id="room-capacity"
                type="number"
                min={2}
                max={100}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#10101D] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#FF4D8D] transition"
              />
            </div>
          </div>

          {/* Privacy Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              {isHindi ? 'रूम प्राइवेसी' : 'Room Privacy'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isPublic
                    ? 'border-[#FF4D8D] bg-[#FF4D8D]/10 text-white'
                    : 'border-gray-700 bg-[#10101D] text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className={`p-2 rounded-lg ${isPublic ? 'bg-[#FF4D8D] text-white' : 'bg-white/5 text-gray-400'}`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{isHindi ? 'पब्लिक रूम' : 'Public Room'}</div>
                  <div className="text-[11px] text-gray-400">{isHindi ? 'कोई भी जुड़ सकता है' : 'Anyone can join'}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  !isPublic
                    ? 'border-[#FF4D8D] bg-[#FF4D8D]/10 text-white'
                    : 'border-gray-700 bg-[#10101D] text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className={`p-2 rounded-lg ${!isPublic ? 'bg-[#FF4D8D] text-white' : 'bg-white/5 text-gray-400'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{isHindi ? 'प्राइवेट रूम' : 'Private Room'}</div>
                  <div className="text-[11px] text-gray-400">{isHindi ? 'होस्ट की अनुमति चाहिए' : 'Host approval'}</div>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-xl shadow-lg shadow-[#FF4D8D]/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Radio className="w-5 h-5" />
              {isHindi ? 'लाइव शुरू करें' : 'Create Live'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
