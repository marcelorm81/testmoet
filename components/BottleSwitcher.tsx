
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

const BOTTLES = [
  {
    id: 'red',
    title: 'Moët IMPÉRIALE\nred limited edition',
    textColor: '#FFFBF7', // White text for Red Bottle (Start)
    theme: 'light' as const 
  },
  {
    id: 'white',
    title: 'Moët IMPÉRIALE\nBrut Classic',
    textColor: '#1a1a1a', // Black text for White Bottle (End)
    theme: 'dark' as const 
  }
];

// Video Specs
const VIDEO_URL = "https://github.com/marcelorm81/assets/blob/84ac379f6c3511a0a306ea2c5c97c1c396159105/switchbootle_moreair.mp4?raw=true";
const MIN_TIME = 1.0;
const MAX_TIME = 3.0;

interface BottleSwitcherProps {
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const BottleSwitcher: React.FC<BottleSwitcherProps> = ({ onThemeChange }) => {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Physics State (Refs for performance)
  const state = useRef({
    targetTime: MIN_TIME,
    displayTime: MIN_TIME,
    isDragging: false,
    startX: 0,
    startTimeAtDrag: MIN_TIME,
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    // Notify parent of initial theme
    if (onThemeChange) onThemeChange(BOTTLES[0].theme);
  }, []);

  // --- PHYSICS LOOP ---
  useLayoutEffect(() => {
    let animationFrameId: number;

    const loop = () => {
        const s = state.current;
        const video = videoRef.current;

        if (video) {
            // Easing Factors:
            // Heavy/Responsive (0.2) when dragging.
            // Soft/Luxurious (0.08) when released.
            const friction = s.isDragging ? 0.2 : 0.08;
            
            const diff = s.targetTime - s.displayTime;
            s.displayTime += diff * friction;

            // Apply to video
            // Check if diff is significant to avoid unnecessary updates
            if (Math.abs(diff) > 0.0001) {
               video.currentTime = s.displayTime;
            }
        }

        animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- GLOBAL EVENT HANDLERS (Window) ---
  // We use useCallback to keep references stable for add/removeEventListener

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    const s = state.current;
    if (!s.isDragging) return;

    // Prevent default scrolling on touch devices while dragging
    if (e.cancelable) e.preventDefault();

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const deltaX = clientX - s.startX;
    
    // MAPPING: 200px = 2 seconds (0.01s per pixel)
    // INVERSE DRAG: Drag Left (negative delta) -> Advance Time (positive add).
    // Formula: newTime = start - (delta * 0.01)
    let newTime = s.startTimeAtDrag - (deltaX * 0.01);
    
    // Clamp constraints
    if (newTime < MIN_TIME) newTime = MIN_TIME;
    if (newTime > MAX_TIME) newTime = MAX_TIME;

    s.targetTime = newTime;
  }, []);

  const handleDragEnd = useCallback(() => {
    const s = state.current;
    if (!s.isDragging) return;

    s.isDragging = false;

    // Clean up window listeners
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);

    // Snap Logic
    const midPoint = (MIN_TIME + MAX_TIME) / 2;
    let newIndex = 0;

    if (s.targetTime >= midPoint) {
        newIndex = 1;
        s.targetTime = MAX_TIME;
    } else {
        newIndex = 0;
        s.targetTime = MIN_TIME;
    }

    // Update React State only if changed
    setIndex((prevIndex) => {
        if (prevIndex !== newIndex) {
            if (onThemeChange) onThemeChange(BOTTLES[newIndex].theme);
            return newIndex;
        }
        return prevIndex;
    });
  }, [handleDragMove, onThemeChange]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const s = state.current;
    s.isDragging = true;
    
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    s.startX = clientX;
    s.startTimeAtDrag = s.targetTime;

    // Attach to window to handle drag outside the component
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
  };

  // --- CLICK NAVIGATION (Dots) ---
  const handleDotClick = (i: number) => {
      const s = state.current;
      const newTime = i === 0 ? MIN_TIME : MAX_TIME;
      
      s.targetTime = newTime;
      setIndex(i);
      if (onThemeChange) onThemeChange(BOTTLES[i].theme);
  };

  const currentBottle = BOTTLES[index];

  return (
    <section 
      className="relative w-full min-h-screen flex flex-col items-center justify-start py-[30px] overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* 
         VIDEO BACKGROUND LAYER 
         Attributes set for Mobile Safari Optimization (playsInline, muted, autoPlay).
         Paused immediately on load to prevent auto-playing.
      */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <video 
            ref={videoRef}
            src={VIDEO_URL}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
            disablePictureInPicture
            onLoadedData={(e) => {
                const v = e.currentTarget;
                v.pause();
                v.currentTime = MIN_TIME;
            }}
         />
      </div>

      {/* 
         CONTENT LAYER 
         Overlaid on top of the video using z-index.
         Pointer events pass through to section for dragging, except on interactive elements.
      */}
      <div className="relative z-10 flex flex-col items-center gap-[30px] w-full max-w-[393px] pointer-events-none">
        
        {/* Spacer for Bottle Visual */}
        <div className="h-[550px] w-full pointer-events-none" />

        {/* Dots Navigation */}
        <div className="flex items-center gap-[4px] z-20 pointer-events-auto">
          {BOTTLES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); handleDotClick(i); }}
              className="focus:outline-none transition-all duration-300 p-2"
              aria-label={`Select bottle ${i + 1}`}
            >
              {i === index ? (
                <svg width="12" height="5" viewBox="0 0 12 5" fill="none">
                  <rect width="12" height="5" rx="2.5" fill={currentBottle.textColor}/>
                </svg>
              ) : (
                <svg width="5" height="5" viewBox="0 0 5 5" fill="none">
                  <circle cx="2.5" cy="2.5" r="2.5" fill={currentBottle.textColor} fillOpacity="0.5"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Text & CTA */}
        <div className="relative w-full min-h-[50px] px-6 pointer-events-auto">
           <div className="flex items-center justify-between gap-[20px] w-full transition-opacity duration-500" style={{ color: currentBottle.textColor }}>
              
              <div className="flex flex-col justify-center w-[200px]">
                <h3 className="font-trenda text-[10px] font-semibold leading-[14px] tracking-[0.6px] uppercase whitespace-pre-line text-left transition-colors duration-500">
                  {currentBottle.title}
                </h3>
              </div>

              <button 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-6 py-3 rounded-[4px] backdrop-blur-2xl transition-all duration-300 active:scale-95 shrink-0 group"
                style={{ 
                  backgroundColor: index === 1 ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.10)',
                  color: currentBottle.textColor,
                  border: `1px solid ${index === 1 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`
                }}
              >
                  <span className="text-[9px] tracking-[0.02em] uppercase font-black font-trenda leading-none">
                    DISCOVER
                  </span>
                  <div 
                    className="w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: index === 1 ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.20)' }}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </div>
              </button>

           </div>
        </div>

      </div>
    </section>
  );
};

export default BottleSwitcher;
