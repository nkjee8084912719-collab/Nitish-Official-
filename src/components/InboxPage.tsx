import React, { useState } from 'react';
import { User, Bell, MessageSquare, ArrowLeft, Send } from 'lucide-react';

interface InboxPageProps {
  showToast: (msg: string) => void;
  isHindi: boolean;
}

interface MessageThread {
  id: string;
  sender: string;
  avatarBg: string;
  lastMsg: string;
  time: string;
  messages: { sender: string; text: string; time: string }[];
}

export const InboxPage: React.FC<InboxPageProps> = ({ showToast, isHindi }) => {
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [replyText, setReplyText] = useState('');

  const [threads, setThreads] = useState<MessageThread[]>([
    {
      id: 'cc-team',
      sender: 'Chit Chat Team',
      avatarBg: 'bg-[#FF4D8D]',
      lastMsg: isHindi ? 'चिट चैट में आपका स्वागत है! नए दोस्तों से मिलें।' : 'Welcome to Chit Chat! Connect with active audio rooms.',
      time: '10:30 AM',
      messages: [
        {
          sender: 'Chit Chat Team',
          text: isHindi ? 'नमस्ते! Chit Chat लाइव वॉइस कम्युनिटी में आपका स्वागत है।' : 'Hello! Welcome to the Chit Chat live voice community.',
          time: '10:30 AM',
        },
        {
          sender: 'Chit Chat Team',
          text: isHindi ? 'आप अपना पहला लाइव रूम बना सकते हैं या किसी भी एक्टिव रूम में शामिल हो सकते हैं।' : 'You can create your first live room or join any public room anytime.',
          time: '10:31 AM',
        },
      ],
    },
    {
      id: 'rahul',
      sender: 'Rahul (Host)',
      avatarBg: 'bg-indigo-600',
      lastMsg: isHindi ? 'अरे भाई, Friendship Zone में कब आ रहे हो?' : 'Hey! When are you joining Friendship Zone?',
      time: 'Yesterday',
      messages: [
        {
          sender: 'Rahul (Host)',
          text: isHindi ? 'अरे भाई, Friendship Zone में कब आ रहे हो?' : 'Hey! When are you joining Friendship Zone?',
          time: 'Yesterday',
        },
      ],
    },
    {
      id: 'priya',
      sender: 'Priya',
      avatarBg: 'bg-emerald-600',
      lastMsg: isHindi ? 'लाइव रूम में बहुत मज़ा आया!' : 'Had so much fun in the live room!',
      time: 'Oct 28',
      messages: [
        {
          sender: 'Priya',
          text: isHindi ? 'लाइव रूम में बहुत मज़ा आया!' : 'Had so much fun in the live room!',
          time: 'Oct 28',
        },
      ],
    },
  ]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const newMsg = {
      sender: 'You',
      text: replyText.trim(),
      time: 'Just now',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMsg: replyText.trim(),
              time: 'Just now',
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    setActiveThread((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    setReplyText('');
    showToast('Message sent');
  };

  return (
    <div className="min-h-full bg-[#10101D] text-white flex flex-col">
      {/* AppBar */}
      <div className="bg-[#10101D] px-4 py-3.5 flex items-center justify-between border-b border-white/5 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {activeThread && (
            <button
              type="button"
              onClick={() => setActiveThread(null)}
              className="p-1 rounded-full hover:bg-white/10 text-gray-300"
              aria-label="Back to threads"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold text-white">
            {activeThread ? activeThread.sender : 'Inbox'}
          </h1>
        </div>
      </div>

      {activeThread ? (
        /* Conversation view */
        <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {activeThread.messages.map((m, i) => {
              const isMe = m.sender === 'You';
              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMe
                        ? 'bg-[#FF4D8D] text-white rounded-br-none'
                        : 'bg-[#202035] text-gray-200 border border-white/5 rounded-bl-none'
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendReply} className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 px-4 py-3 bg-[#202035] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF4D8D]"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-[#FF4D8D] hover:bg-[#ff337a] text-white rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Original Flutter Inbox Page List */
        <div className="divide-y divide-white/5 max-w-2xl mx-auto w-full">
          {/* Welcome ListTile */}
          <div
            onClick={() => setActiveThread(threads[0])}
            className="p-4 hover:bg-[#202035]/60 transition flex items-center gap-3.5 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF4D8D] to-[#7928CA] flex items-center justify-center shrink-0 text-white">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-base">Welcome to Chit Chat</div>
              <div className="text-sm text-gray-400 truncate">Your messages will appear here.</div>
            </div>
          </div>

          {/* Additional threads */}
          {threads.slice(1).map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveThread(t)}
              className="p-4 hover:bg-[#202035]/60 transition flex items-center gap-3.5 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${t.avatarBg} flex items-center justify-center shrink-0 text-white font-bold text-sm`}>
                {t.sender.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-base truncate">{t.sender}</span>
                  <span className="text-xs text-gray-400 shrink-0">{t.time}</span>
                </div>
                <div className="text-sm text-gray-400 truncate">{t.lastMsg}</div>
              </div>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-white/5 my-2" />

          {/* Notifications ListTile */}
          <div
            onClick={() => showToast('You are all caught up! No new notifications.')}
            className="p-4 hover:bg-[#202035]/60 transition flex items-center gap-3.5 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-base">Notifications</div>
              <div className="text-sm text-gray-400">You have no new notifications.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
