import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { validateOtp } from '../utils/chatLogic';

interface OtpPageProps {
  name: string;
  phone: string;
  onVerified: () => void;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const OtpPage: React.FC<OtpPageProps> = ({
  name,
  phone,
  onVerified,
  onBack,
  showToast,
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateOtp(otp);
    if (!result.isValid) {
      showToast(result.error || 'Incorrect demo OTP. Use 123456.');
      return;
    }
    onVerified();
  };

  const handleFillDemo = () => {
    setOtp('123456');
  };

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#202035] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5 relative">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Login"
          className="absolute top-6 left-6 p-2 rounded-xl bg-[#10101D] hover:bg-white/10 text-gray-300 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4D8D]/20 border border-[#FF4D8D]/40 flex items-center justify-center text-[#FF4D8D] mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-white">OTP Verification</h1>
          <p className="text-sm text-gray-300 mt-1">Verify your mobile number</p>
          <p className="text-base font-semibold text-[#FF4D8D] mt-1 font-mono tracking-wider">
            +91 {phone}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Logging in as {name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 text-center">
              Enter Demo OTP
            </label>
            <div className="relative">
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="w-full py-3.5 px-4 text-center tracking-[0.5em] text-2xl font-mono bg-[#10101D] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#FF4D8D] transition"
                autoFocus
              />
            </div>
            <div className="flex justify-between items-center mt-2 px-1 text-xs">
              <span className="text-emerald-400 font-medium">Demo OTP: 123456</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[#FF4D8D] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Fill Demo
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-xl shadow-lg shadow-[#FF4D8D]/30 transition transform active:scale-[0.98] cursor-pointer mt-4"
          >
            Verify &amp; Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => showToast('Resent demo code 123456 to your phone.')}
            className="text-xs text-gray-400 hover:text-white transition cursor-pointer"
          >
            Didn&apos;t receive code? <span className="text-[#FF4D8D] font-medium">Resend OTP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
