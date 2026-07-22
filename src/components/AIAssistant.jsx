import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';

// Placeholder — future floating AI assistant ke liye jagah reserve ki gayi hai.
// Abhi koi AI functionality nahi, sirf position/z-index/responsive placement taiyaar hai.
const AIAssistant = () => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {showHint && (
        <div
          role="status"
          className="glass rounded-xl border border-accent/20 px-3 py-2 text-xs text-gray-200 shadow-lg shadow-black/40 max-w-[210px] animate-fade-in"
        >
          🤖 AI Assistant coming soon — abhi ke liye Contact form use karein.
        </div>
      )}
      <button
        type="button"
        aria-label="AI assistant (coming soon)"
        aria-expanded={showHint}
        onClick={() => setShowHint((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-accent to-green-400 text-dark flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-transform outline-none"
      >
        <FaCommentDots size={22} />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-dark rounded-full flex items-center justify-center">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </span>
      </button>
    </div>
  );
};

export default AIAssistant;
