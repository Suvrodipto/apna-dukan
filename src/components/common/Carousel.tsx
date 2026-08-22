import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: React.ReactNode[];
  autoPlayInterval?: number; // in ms, e.g. 7000 (7s). Pass 0 to disable.
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlayInterval = 7000,
  className = '',
  title,
  subtitle,
  badge
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer with pause on hover/interaction
  useEffect(() => {
    if (!autoPlayInterval || autoPlayInterval <= 0 || isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, nextSlide, total]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  if (total === 0) return null;

  return (
    <div
      className={`relative w-full space-y-3 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel Slider"
    >
      {/* Header Controls */}
      {(title || badge) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title && <h3 className="text-sm font-extrabold text-white flex items-center gap-2">{title}</h3>}
            {badge && (
              <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono uppercase">
                {badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {subtitle && <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">{subtitle}</span>}
            
            {/* Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-1.5 bg-[#181824] hover:bg-[#222232] text-slate-300 hover:text-amber-400 border border-slate-800 rounded-xl transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-1.5 bg-[#181824] hover:bg-[#222232] text-slate-300 hover:text-amber-400 border border-slate-800 rounded-xl transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Track Container */}
      <div
        className="overflow-hidden rounded-2xl p-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="w-full shrink-0 px-1">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-6 bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm'
                : 'w-1.5 bg-slate-800 hover:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
