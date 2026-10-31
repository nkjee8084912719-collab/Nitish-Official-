import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Settings,
  Users,
  Mic,
  MicOff,
  UserPlus,
  Shield,
  Star,
  Hand,
  Send,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  X,
  Radio,
  UserX,
} from 'lucide-react';
import { LiveRoom, ChatMessage } from '../types';
import { sound } from '../utils/audioFx';
import {
  joinRoomLogic,
  leaveRoomLogic,
  kickMemberLogic,
  toggleRoomMuteLogic,
} from '../utils/chatLogic';

interface RoomPageProps {
  room: LiveRoom;
  currentUser: string;
  isHindi: boolean;
  onUpdateRoom: (updated: LiveRoom) => void;
  onLeave: () => void;
  onEndRoom: (roomId: string) => void;
  showToast: (msg: string) => void;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export const RoomPage: React.FC<RoomPageProps> = ({
  room,
  currentUser,
  isHindi,
  onUpdateRoom,
  onLeave,
  onEndRoom,
  showToast,
}) => {
  const isHost = room.host === currentUser || room.host === 'You';
  const isJoined = isHost || room.memberNames.includes(currentUser);

  const [isMicOn, setIsMicOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showHostSheet, setShowHostSheet] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: room.host,
      text: isHindi ? 'नमस्ते सभी को! Chit Chat रूम में स्वागत है 🙌' : 'Welcome to the room everyone! Feel free to chat 🙌',
      timestamp: 'Just now',
      isHost: true,
    },
    {
      id: 'm-2',
      sender: 'Aman',
      text: isHindi ? 'शानदार महफ़िल! क्या बात है।' : 'Great conversation happening here!',
      timestamp: 'Just now',
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle joining room
  const handleJoin = () => {
    const res = joinRoomLogic(room, currentUser);
    if (!res.success) {
      showToast(res.error || 'Could not join room');
      return;
    }
    sound.playPop();
    onUpdateRoom(res.updatedRoom);
    showToast(isHindi ? 'आप रूम में शामिल हो गए हैं' : `Joined ${room.name}`);
  };

  // Handle leaving room
  const handleLeave = () => {
    sound.playPop();
    const updated = leaveRoomLogic(room, currentUser);
    onUpdateRoom(updated);
    onLeave();
  };

  // Host kick member
  const handleKickMember = (memberName: string) => {
    if (memberName === room.host) return;
    const updated = kickMemberLogic(room, memberName);
    onUpdateRoom(updated);
    showToast(isHindi ? `${memberName} को रूम से हटाया गया` : `Removed ${memberName} from room`);
  };

  // Host toggle mute
  const handleToggleRoomMute = () => {
    const updated = toggleRoomMuteLogic(room);
    onUpdateRoom(updated);
    showToast(updated.isMuted ? 'Room muted by host' : 'Room unmuted');
    if (updated.isMuted) {
      setIsMicOn(false);
    }
  };

  // Toggle user mic
  const handleMicToggle = () => {
    if (room.isMuted && !isHost) {
      showToast(isHindi ? 'रूम अभी होस्ट द्वारा म्यूट है' : 'Room is currently muted by host');
      return;
    }
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    sound.playMicToggle(!nextState);
  };

  // Send reaction gift
  const sendReaction = (emoji: string) => {
    sound.playGiftChime();
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40, // 30% to 70% width
    };
    setFloatingReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  // Send in-room chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sound.playReaction();
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: currentUser || 'You',
      text: chatInput.trim(),
      timestamp: 'Now',
      isHost,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Host quick actions
  const handleHostAction = (action: string) => {
    sound.playPop();
    showToast(`${action}: Demo action executed.`);
    setShowHostSheet(false);
  };

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col relative pb-20 select-none">
      {/* Floating Reactions Overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {floatingReactions.map((r) => (
          <span
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-24 text-3xl animate-float-up transform -translate-x-1/2"
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#10101D]/90 backdrop-blur-md px-4 py-3.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLeave}
            aria-label="Back"
            className="p-2 rounded-xl bg-[#202035] hover:bg-white/10 text-gray-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 line-clamp-1">
              {room.name}
              {!room.isPublic && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  Private
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400">
              {room.topic} • Host: <span className="text-[#FF4D8D] font-semibold">{room.host}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {room.isMuted && (
            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1 border border-red-500/30">
              <VolumeX className="w-3.5 h-3.5" />
              Muted
            </span>
          )}

          {isHost && (
            <button
              type="button"
              onClick={() => setShowHostSheet(true)}
              aria-label="Host Settings"
              className="p-2 rounded-xl bg-[#202035] hover:bg-white/10 text-white transition cursor-pointer"
            >
              <Settings className="w-5 h-5 text-[#FF4D8D]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Banner with gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF4D8D] via-[#7928CA] to-[#282B83] p-6 shadow-xl">
          <div className="absolute right-4 -bottom-4 text-white/10 pointer-events-none">
            <Radio className="w-40 h-40" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs font-semibold text-emerald-300 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE STAGE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">{room.name}</h2>
              <p className="text-sm text-white/80 mt-1">Topic: {room.topic}</p>
            </div>

            <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
              <Users className="w-5 h-5 text-[#FF4D8D]" />
              <div>
                <div className="text-xs text-gray-300">Live Members</div>
                <div className="text-lg font-black text-white">
                  {room.members} / {room.capacity}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Audio Visualizer (Speakers & Host) */}
        <div className="bg-[#202035] rounded-3xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#FF4D8D]" />
              {isHindi ? 'मंच / वक्ता (Stage)' : 'Stage & Speakers'}
            </h3>
            {isMicOn && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {isHindi ? 'आप बोल रहे हैं' : 'You are speaking'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {/* Host Avatar on Stage */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] to-amber-500 p-0.5 shadow-lg shadow-[#FF4D8D]/20">
                  <div className="w-full h-full bg-[#10101D] rounded-2xl flex items-center justify-center font-bold text-lg text-white">
                    {room.host.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-gray-950 p-1 rounded-full text-[10px] shadow">
                  <Star className="w-3 h-3 fill-current" />
                </span>
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                  <Mic className="w-3 h-3" />
                </span>
              </div>
              <span className="text-xs font-bold text-white mt-1.5 line-clamp-1">{room.host}</span>
              <span className="text-[10px] font-semibold text-amber-400">Host</span>
            </div>

            {/* Other Speakers / User */}
            {room.memberNames
              .filter((m) => m !== room.host)
              .slice(0, 5)
              .map((member, i) => {
                const isUser = member === currentUser;
                const isSpeaking = isUser && isMicOn;
                return (
                  <div key={member} className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-0.5 transition ${
                          isSpeaking
                            ? 'bg-gradient-to-r from-emerald-400 to-[#FF4D8D] ring-4 ring-[#FF4D8D]/40'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className="w-full h-full bg-[#10101D] rounded-2xl flex items-center justify-center font-bold text-lg text-white">
                          {member.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[10px] ${
                          isSpeaking ? 'bg-emerald-500 text-white animate-bounce' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {isSpeaking ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white mt-1.5 line-clamp-1">
                      {member} {isUser && '(You)'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {i === 0 ? 'Co-host' : 'Speaker'}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Voice Wave Visualizer when speaking */}
          {isMicOn && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 py-1">
              <span className="text-xs text-gray-400 mr-2 font-medium">Mic Audio:</span>
              {[40, 75, 90, 60, 100, 45, 80, 50, 95, 30, 85].map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height * 0.25}px` }}
                  className="w-1 bg-gradient-to-t from-[#FF4D8D] to-emerald-400 rounded-full animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Listeners & Members Grid */}
        <div className="bg-[#202035] rounded-3xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF4D8D]" />
              {isHindi ? 'श्रोता व सदस्य' : 'Room Members'} ({room.memberNames.length})
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {room.members}/{room.capacity}
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {room.memberNames.map((member) => {
              const isMemberHost = member === room.host;
              const isCurrentUser = member === currentUser;
              return (
                <div
                  key={member}
                  className="p-2.5 rounded-xl bg-[#10101D] border border-gray-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] flex items-center justify-center font-bold text-xs">
                      {member.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {member} {isCurrentUser && <span className="text-xs text-[#FF4D8D]">(You)</span>}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {isMemberHost ? 'Room Host' : 'Listener'}
                      </div>
                    </div>
                  </div>

                  {isHost && !isMemberHost && (
                    <button
                      type="button"
                      onClick={() => handleKickMember(member)}
                      title={`Remove ${member}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Chat Stream inside Room */}
        <div className="bg-[#202035] rounded-3xl p-5 border border-white/5 flex flex-col h-64">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {isHindi ? 'लाइव चैट' : 'Live In-Room Chat'}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3 text-xs">
            {messages.map((m) => (
              <div key={m.id} className="bg-[#10101D] p-2 rounded-xl border border-gray-800/80">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-0.5">
                  <span className={`font-bold ${m.isHost ? 'text-[#FF4D8D]' : 'text-gray-300'}`}>
                    {m.sender} {m.isHost && '👑'}
                  </span>
                  <span className="text-[10px] text-gray-500">{m.timestamp}</span>
                </div>
                <div className="text-white text-xs">{m.text}</div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isHindi ? 'कुछ कहें...' : 'Type a chat message...'}
              className="flex-1 px-3 py-2 bg-[#10101D] border border-gray-700 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#FF4D8D]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#FF4D8D] hover:bg-[#ff337a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Join / Leave Actions */}
        <div className="pt-2">
          {!isJoined && !isHost ? (
            <button
              type="button"
              onClick={handleJoin}
              className="w-full py-4 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-2xl shadow-lg shadow-[#FF4D8D]/30 transition text-base cursor-pointer"
            >
              {isHindi ? 'रूम में शामिल हों' : 'Join Room'}
            </button>
          ) : !isHost ? (
            <button
              type="button"
              onClick={handleLeave}
              className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-2xl transition text-sm cursor-pointer"
            >
              {isHindi ? 'रूम छोड़ें' : 'Leave Room'}
            </button>
          ) : (
            /* Host Controls Dashboard */
            <div className="p-5 rounded-3xl bg-[#202035] border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>{isHindi ? 'होस्ट डैशबोर्ड' : 'Host Dashboard'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                  Host
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleHostAction('Assign Co-host')}
                  className="p-2.5 rounded-xl border border-gray-700 hover:border-[#FF4D8D] bg-[#10101D] text-xs font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Star className="w-4 h-4 text-amber-400" />
                  Co-host
                </button>
                <button
                  type="button"
                  onClick={() => handleHostAction('Assign Moderator')}
                  className="p-2.5 rounded-xl border border-gray-700 hover:border-[#FF4D8D] bg-[#10101D] text-xs font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  Moderator
                </button>
                <button
                  type="button"
                  onClick={handleToggleRoomMute}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    room.isMuted
                      ? 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-gray-700 hover:border-[#FF4D8D] bg-[#10101D] text-gray-200'
                  }`}
                >
                  {room.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {room.isMuted ? 'Unmute All' : 'Mute Room'}
                </button>
                <button
                  type="button"
                  onClick={() => handleHostAction('Invite Friends')}
                  className="p-2.5 rounded-xl border border-gray-700 hover:border-[#FF4D8D] bg-[#10101D] text-xs font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Invite
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onEndRoom(room.id);
                  showToast(isHindi ? 'लाइव रूम समाप्त हो गया' : 'Ended live room');
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer"
              >
                {isHindi ? 'लाइव रूम समाप्त करें' : 'End Live Room'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar (Microphone & Quick Reactions) */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#202035]/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
        {/* Quick Reactions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => sendReaction('❤️')}
            className="p-2 rounded-xl bg-[#10101D] hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Heart"
          >
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          </button>
          <button
            type="button"
            onClick={() => sendReaction('🔥')}
            className="p-2 rounded-xl bg-[#10101D] hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Fire"
          >
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </button>
          <button
            type="button"
            onClick={() => sendReaction('🌹')}
            className="p-2 rounded-xl bg-[#10101D] hover:scale-110 active:scale-95 transition cursor-pointer text-lg"
            title="Rose"
          >
            🌹
          </button>
          <button
            type="button"
            onClick={() => sendReaction('👏')}
            className="p-2 rounded-xl bg-[#10101D] hover:scale-110 active:scale-95 transition cursor-pointer text-lg"
            title="Clap"
          >
            👏
          </button>
        </div>

        {/* Mic & Hand Raise Controls */}
        <div className="flex items-center gap-2">
          {!isHost && (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsHandRaised(!isHandRaised);
                showToast(
                  !isHandRaised
                    ? isHindi
                      ? 'आपने बोलने के लिए हाथ उठाया है'
                      : 'Raised hand to speak'
                    : 'Lowered hand'
                );
              }}
              className={`p-3 rounded-2xl transition cursor-pointer ${
                isHandRaised ? 'bg-amber-500 text-gray-950 font-bold' : 'bg-[#10101D] text-gray-300'
              }`}
              title="Raise hand"
            >
              <Hand className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleMicToggle}
            className={`px-5 py-3 rounded-2xl flex items-center gap-2 font-bold transition shadow-lg cursor-pointer ${
              isMicOn
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span className="text-sm">{isMicOn ? 'Mute' : 'Speak'}</span>
          </button>
        </div>
      </div>

      {/* Host Settings Bottom Sheet */}
      {showHostSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#202035] rounded-t-3xl p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-700/60">
              <h3 className="text-lg font-bold text-white">Host Controls</h3>
              <button
                type="button"
                onClick={() => setShowHostSheet(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleHostAction('Assign Co-host')}
                className="w-full p-3.5 rounded-xl bg-[#10101D] hover:bg-white/5 text-left flex items-center gap-3 transition cursor-pointer text-sm font-semibold"
              >
                <Star className="w-5 h-5 text-amber-400" />
                Assign Co-host
              </button>
              <button
                type="button"
                onClick={() => handleHostAction('Assign Moderator')}
                className="w-full p-3.5 rounded-xl bg-[#10101D] hover:bg-white/5 text-left flex items-center gap-3 transition cursor-pointer text-sm font-semibold"
              >
                <Shield className="w-5 h-5 text-blue-400" />
                Assign Moderator
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleRoomMute();
                  setShowHostSheet(false);
                }}
                className="w-full p-3.5 rounded-xl bg-[#10101D] hover:bg-white/5 text-left flex items-center gap-3 transition cursor-pointer text-sm font-semibold"
              >
                {room.isMuted ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-400" />
                )}
                {room.isMuted ? 'Unmute Room' : 'Mute Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
