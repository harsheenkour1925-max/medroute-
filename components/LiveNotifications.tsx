import React, { useState, useEffect } from 'react';

const STORIES = [
    "🌍 5 tons CO₂ emissions prevented this month",
    "🏥 Batch #772: Cardiac medication delivered to Mumbai",
    "📦 45 units donated from Bandra resident",
    "✅ Verified: NGO Hope Foundation received insulin batch",
    "🩺 Surplus medicines redirected to Rural Clinic",
    "🚀 Growth: 5 new donors joined the network",
    "🛡️ Safety Status: 100% verification rate today"
];

const LiveNotifications: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % STORIES.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!visible && index === -1) return null; // Logic if we wanted to hide permanently

  return (
    <div className="fixed bottom-8 left-8 z-[60] w-full max-w-[340px] pointer-events-none">
      <div className={`bg-[#0f172a] text-slate-200 px-4 py-3.5 rounded-xl shadow-2xl border border-white/5 flex items-center gap-4 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
        
        {/* Themed Icon Container */}
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
            <path d="m8.5 8.5 7 7"/>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <p className="text-sm font-medium leading-tight text-white/90">
            {STORIES[index]}
          </p>
        </div>

        {/* Close Button Decor */}
        <div className="flex-shrink-0 text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LiveNotifications;