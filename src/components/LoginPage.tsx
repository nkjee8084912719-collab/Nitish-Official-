import React, { useState } from 'react';
import { MessageSquare, Phone, User, CheckSquare, Square } from 'lucide-react';
import { validateLoginInput } from '../utils/chatLogic';

interface LoginPageProps {
  onContinue: (name: string, phone: string) => void;
  showToast: (msg: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onContinue, showToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLoginInput(name, phone, accepted);
    if (!result.isValid) {
      showToast(result.error || 'Name, valid mobile number and terms are required');
      return;
    }
    onContinue(name.trim(), phone.trim());
  };

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#202035] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
        {/* App Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] to-[#7928CA] flex items-center justify-center shadow-lg shadow-[#FF4D8D]/30 mb-3 animate-pulse">
            <MessageSquare className="w-11 h-11 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-widest text-white">CHIT CHAT</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium tracking-wide">Connect • Talk • Enjoy</p>
        </div>

        {/* Welcome Section */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome!</h2>
          <p className="text-xs text-gray-400 mt-0.5">Enter your details to join active audio rooms</p>
        </div>

        {/* Form */}
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label htmlFor="login-name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-11 pr-4 py-3 bg-[#10101D] border border-gray-700/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D8D] transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-phone" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative flex rounded-xl border border-gray-700/80 bg-[#10101D] overflow-hidden focus-within:border-[#FF4D8D] transition">
              <span className="flex items-center pl-3.5 pr-2 text-gray-400 bg-white/5 border-r border-gray-700/80 text-sm font-semibold">
                <Phone className="w-4 h-4 mr-1.5 text-[#FF4D8D]" />
                +91
              </span>
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit number"
                className="w-full px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={accepted}
              onClick={() => setAccepted(!accepted)}
              className="flex items-center gap-2.5 text-left text-xs text-gray-300 hover:text-white transition cursor-pointer"
            >
              {accepted ? (
                <CheckSquare className="w-5 h-5 text-[#FF4D8D] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-gray-500 shrink-0" />
              )}
              <span>I agree to Terms &amp; Conditions</span>
            </button>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-xl shadow-lg shadow-[#FF4D8D]/30 transition transform active:scale-[0.98] cursor-pointer mt-2"
          >
            Continue
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700/60" />
          <span className="px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">OR</span>
          <div className="flex-1 border-t border-gray-700/60" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => showToast('Google Sign-In needs authentication setup.')}
            className="w-full py-2.5 px-4 border border-gray-700 hover:border-gray-500 bg-[#10101D]/70 hover:bg-[#10101D] text-gray-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-black text-gray-900">
              G
            </span>
            Sign up with Google
          </button>
          <button
            type="button"
            onClick={() => showToast('Facebook Sign-In needs authentication setup.')}
            className="w-full py-2.5 px-4 border border-gray-700 hover:border-gray-500 bg-[#10101D]/70 hover:bg-[#10101D] text-gray-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-xs font-bold text-white">
              f
            </span>
            Continue with Facebook
          </button>
        </div>

        {/* Demo Fast Hint */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Tip: You can use any 10-digit number. Demo OTP is <span className="text-emerald-400 font-mono">123456</span>
        </div>
      </div>
    </div>
  );
};
