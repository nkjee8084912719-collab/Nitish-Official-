import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Image as ImageIcon, Video, CheckCircle2 } from 'lucide-react';

interface PlusPageProps {
  onBack?: () => void;
  showToast: (msg: string) => void;
  isHindi: boolean;
}

export const PlusPage: React.FC<PlusPageProps> = ({ onBack, showToast, isHindi }) => {
  const [photoSelected, setPhotoSelected] = useState(false);
  const [videoSelected, setVideoSelected] = useState(false);
  const [caption, setCaption] = useState('');

  const handleAddPhoto = () => {
    setPhotoSelected(true);
    showToast('Photo upload ready. Add a caption or share!');
  };

  const handleAddVideo = () => {
    setVideoSelected(true);
    showToast('Video clip ready. Add a caption or share!');
  };

  const handlePost = () => {
    if (!photoSelected && !videoSelected && !caption.trim()) {
      showToast('Please select a photo/video or write a moment');
      return;
    }
    showToast('Post shared with Chit Chat community! 🎉');
    setPhotoSelected(false);
    setVideoSelected(false);
    setCaption('');
    if (onBack) onBack();
  };

  return (
    <div className="min-h-full bg-[#10101D] text-white flex flex-col">
      {/* AppBar */}
      <div className="bg-[#10101D] px-4 py-3.5 flex items-center gap-3 border-b border-white/5 sticky top-0 z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full hover:bg-white/10 text-gray-300"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white">Create Post</h1>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
        <div className="text-[#FF4D8D] mb-4">
          <PlusCircle className="w-20 h-20 mx-auto" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Share your moments</h2>
        <p className="text-sm text-gray-400 mb-6">
          {isHindi
            ? 'अपने पलों को चिट चैट परिवार के साथ साझा करें'
            : 'Post updates, photos or video clips with friends'}
        </p>

        <div className="w-full space-y-3.5">
          {/* Post text caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={isHindi ? 'आज क्या खास है?' : 'What’s on your mind?'}
            rows={3}
            className="w-full px-4 py-3 bg-[#202035] border border-gray-700/80 rounded-2xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FF4D8D] transition resize-none"
          />

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddPhoto}
              className={`py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                photoSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#202035] hover:bg-[#282844] text-white border border-gray-700'
              }`}
            >
              {photoSelected ? <CheckCircle2 className="w-4 h-4" /> : <ImageIcon className="w-4 h-4 text-[#FF4D8D]" />}
              <span>{photoSelected ? 'Photo Added' : 'Add Photo'}</span>
            </button>

            <button
              type="button"
              onClick={handleAddVideo}
              className={`py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                videoSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#202035] hover:bg-[#282844] text-white border border-gray-700'
              }`}
            >
              {videoSelected ? <CheckCircle2 className="w-4 h-4" /> : <Video className="w-4 h-4 text-[#FF4D8D]" />}
              <span>{videoSelected ? 'Video Added' : 'Add Video'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePost}
            className="w-full py-3.5 bg-[#FF4D8D] hover:bg-[#ff337a] text-white font-bold rounded-xl shadow-lg shadow-[#FF4D8D]/30 transition text-sm cursor-pointer mt-2"
          >
            Post to Feed
          </button>
        </div>
      </div>
    </div>
  );
};
