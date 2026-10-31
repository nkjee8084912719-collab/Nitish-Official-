import React, { useState } from 'react';
import {
  User,
  Edit3,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronRight,
  LogOut,
  Volume2,
  VolumeX,
  Globe,
  Radio,
  X,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audioFx';

interface ProfilePageProps {
  userName: string;
  onLogout: () => void;
  isHindi: boolean;
  onToggleLanguage: () => void;
  showToast: (msg: string) => void;
  roomsHostedCount?: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userName,
  onLogout,
  isHindi,
  onToggleLanguage,
  showToast,
  roomsHostedCount = 3,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [nameVal, setNameVal] = useState(userName);
  const [bio, setBio] = useState('Voice room enthusiast • Chit Chat regular 🎙️');

  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    showToast(sound.enabled ? 'Audio effects enabled' : 'Audio effects muted');
  };

  return (
    <div className="min-h-full bg-[#10101D] text-white flex flex-col">
      {/* AppBar */}
      <div className="bg-[#10101D] px-4 py-3.5 flex items-center justify-between border-b border-white/5 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">My Profile</h1>
      </div>

      {/* Profile Center Header */}
      <div className="p-6 flex flex-col items-center text-center max-w-md mx-auto w-full">
        {/* Circle Avatar (pink bg) */}
        <div className="w-26 h-26 rounded-full bg-[#FF4D8D] flex items-center justify-center text-white shadow-xl shadow-[#FF4D8D]/30 mb-4">
          <User className="w-14 h-14" />
        </div>

        <h2 className="text-2xl font-bold text-white">{nameVal}</h2>
        <p className="text-sm text-gray-400 mt-1">Chit Chat Member</p>
        <p className="text-xs text-gray-400 max-w-xs mt-1.5 italic">&quot;{bio}&quot;</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 w-full bg-[#202035] p-3.5 rounded-2xl border border-white/5 mt-5">
          <div className="text-center">
            <div className="text-lg font-black text-white">{roomsHostedCount}</div>
            <div className="text-[11px] text-gray-400">Rooms Hosted</div>
          </div>
          <div className="text-center border-x border-gray-700/60">
            <div className="text-lg font-black text-[#FF4D8D]">148</div>
            <div className="text-[11px] text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-amber-400">2.1k</div>
            <div className="text-[11px] text-gray-400">Hearts</div>
          </div>
        </div>

        {/* Action ListTiles matching Flutter exact specification */}
        <div className="w-full mt-6 space-y-2">
          {/* Edit Profile */}
          <div
            onClick={() => setShowEditModal(true)}
            className="p-4 bg-[#202035] rounded-2xl border border-white/5 hover:border-gray-700 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white/5 text-[#FF4D8D]">
                <Edit3 className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Settings */}
          <div
            onClick={() => setShowSettingsModal(true)}
            className="p-4 bg-[#202035] rounded-2xl border border-white/5 hover:border-gray-700 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white/5 text-blue-400">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Help & Support */}
          <div
            onClick={() => setShowHelpModal(true)}
            className="p-4 bg-[#202035] rounded-2xl border border-white/5 hover:border-gray-700 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white/5 text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">Help &amp; Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Sound FX Toggle */}
          <div
            onClick={handleToggleSound}
            className="p-4 bg-[#202035] rounded-2xl border border-white/5 hover:border-gray-700 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white/5 text-amber-400">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <span className="font-semibold text-sm text-white">Audio Sound Effects</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Language Toggle */}
          <div
            onClick={onToggleLanguage}
            className="p-4 bg-[#202035] rounded-2xl border border-white/5 hover:border-gray-700 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-xl bg-white/5 text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-white">Language / भाषा</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] font-bold">
              {isHindi ? 'हिंदी' : 'English'}
            </span>
          </div>

          {/* Logout */}
          <div
            onClick={onLogout}
            className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 hover:bg-red-500/20 flex items-center justify-between transition cursor-pointer mt-4"
          >
            <div className="flex items-center gap-3.5 text-red-400 font-semibold text-sm">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/60" />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#202035] rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Display Name</label>
              <input
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#10101D] border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-[#10101D] border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                showToast('Profile updated!');
              }}
              className="w-full py-3 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-xl text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#202035] rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Settings</h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#10101D]">
                <span>Room Push Notifications</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#10101D]">
                <span>Microphone Noise Suppression</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#10101D]">
                <span>Data Saver Mode</span>
                <span className="text-xs text-gray-500">Auto</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-[#FF4D8D] text-white font-bold rounded-xl text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#202035] rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Help &amp; Support</h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-300 space-y-2">
              <p>• Chit Chat is an interactive audio room social network.</p>
              <p>• You can tap &quot;Create Live Room&quot; to host your own audio session.</p>
              <p>• Toggle your mic to speak when unmuted by the host.</p>
              <p>• For queries: support@chitchat.app</p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-[#FF4D8D] text-white font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
