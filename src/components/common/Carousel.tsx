import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: React.ReactNode[];
  speedSeconds?: number; // duration of 1 full marquee loop, e.g. 25
  autoPlayInterval?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  speedSeconds = 25,
  className = '',
  title,
  subtitle,
  badge
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  if (!items || items.length === 0) return null;

  // Duplicate items twice to ensure seamless continuous left-to-right infinite loop
  const duplicatedItems = [...items, ...items, ...items];

  const handlePrev = () => {
    setManualOffset(prev => prev + 280);
  };

  const handleNext = () => {
    setManualOffset(prev => prev - 280);
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Header Controls */}
      {(title || badge) && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {title && <h3 className="text-sm font-extrabold text-white flex items-center gap-2">{title}</h3>}
            {badge && (
              <span className="px-2.5 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono uppercase">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {subtitle && <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">{subtitle}</span>}

            {/* Prev / Next Manual Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Shift Left"
                className="p-1.5 bg-[#181824] hover:bg-[#222232] text-slate-300 hover:text-amber-400 border border-slate-800 rounded-xl transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Shift Right"
                className="p-1.5 bg-[#181824] hover:bg-[#222232] text-slate-300 hover:text-amber-400 border border-slate-800 rounded-xl transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Width Continuous Infinite Marquee Track */}
      <div
        className="relative w-full overflow-hidden rounded-2xl p-1 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <style>{`
          @keyframes continuousMarqueeLeftToRight {
            0% {
              transform: translateX(-33.333%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          .animate-marquee-left-to-right {
            animation: continuousMarqueeLeftToRight ${speedSeconds}s linear infinite;
          }
          .marquee-paused {
            animation-play-state: paused !important;
          }
        `}</style>

        <div
          className={`flex gap-4 w-max ${isPaused ? 'marquee-paused' : ''} animate-marquee-left-to-right transition-transform duration-300 ease-out`}
          style={manualOffset !== 0 ? { transform: `translateX(${manualOffset}px)` } : undefined}
        >
          {duplicatedItems.map((item, idx) => (
            <div
              key={idx}
              className="w-[340px] sm:w-[380px] shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
