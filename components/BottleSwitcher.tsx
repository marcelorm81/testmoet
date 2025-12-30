
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronRight } from 'lucide-react';

const BOTTLES = [
  {
    id: 'red',
    title: 'Moët IMPÉRIALE\nred limited edition',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/moetbottle.png',
    bgColor: '#990000',
    textColor: '#FFFBF7',
    theme: 'light' as const // White Logo
  },
  {
    id: 'white',
    title: 'Moët IMPÉRIALE\nBrut Classic',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/moetbottle2.png',
    bgColor: '#FFFFFF',
    textColor: '#1a1a1a',
    theme: 'dark' as const // Black Logo
  }
];

interface BottleSwitcherProps {
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const BottleSwitcher: React.FC<BottleSwitcherProps> = ({ onThemeChange }) => {
  const [index, setIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initial setup for positions
  useEffect(() => {
    // Initialize theme based on default index (0)
    if (onThemeChange) {
      onThemeChange(BOTTLES[0].theme);
    }

    // Set initial positions based on current index (0)
    // Active bottle (0) centered. Others (1) off-screen to the right.
    // Scale reduced from 1.2 to 1.14 (~5% reduction)
    bottleRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === 0) {
        gsap.set(el, { xPercent: 0, scale: 1.14, opacity: 1, zIndex: 2 });
      } else {
        gsap.set(el, { xPercent: 100, scale: 1.14, opacity: 1, zIndex: 1 });
      }
    });

    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === 0) {
        // Active content: Relative, Visible
        gsap.set(el, { autoAlpha: 1, position: 'relative', x: 0 }); 
      } else {
        // Inactive content: Absolute, Hidden, No offset
        gsap.set(el, { autoAlpha: 0, position: 'absolute', top: 0, left: 0, width: '100%', x: 0 });
      }
    });
  }, [onThemeChange]);

  const switchBottle = (newIndex: number) => {
    if (newIndex === index || isAnimating) return;
    setIsAnimating(true);

    const direction = newIndex > index ? 1 : -1; 
    
    const outgoing = bottleRefs.current[index];
    const incoming = bottleRefs.current[newIndex];
    const outgoingContent = contentRefs.current[index];
    const incomingContent = contentRefs.current[newIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
      }
    });
    
    // Update state immediately for BG color transition (handled by CSS class)
    setIndex(newIndex);
    
    // Notify parent of theme change
    if (onThemeChange) {
      onThemeChange(BOTTLES[newIndex].theme);
    }

    const exitTo = direction === 1 ? -150 : 150;
    const enterFrom = direction === 1 ? 150 : -150;

    // --- BOTTLES (Seamless Slide) ---
    // Outgoing
    tl.to(outgoing, {
      xPercent: exitTo,
      duration: 1.0,
      ease: 'power3.inOut'
    }, 0);

    // Incoming
    tl.fromTo(incoming, 
      { xPercent: enterFrom, zIndex: 2 },
      { xPercent: 0, duration: 1.0, ease: 'power3.inOut' },
      0
    );

    // --- CONTENT (Discreet Crossfade - No Movement) ---
    if (outgoingContent) {
        tl.to(outgoingContent, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, 0);
    }

    if (incomingContent) {
        // Incoming starts absolute to overlap perfectly
        tl.fromTo(incomingContent,
            { autoAlpha: 0, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 },
            { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' },
            0 // Sync with outgoing fade
        );
        
        // After transition, swap positioning to maintain document flow
        tl.set(incomingContent, { position: 'relative', clearProps: 'top,left,width,zIndex' });
        if (outgoingContent) tl.set(outgoingContent, { position: 'absolute', top: 0, left: 0, width: '100%' });
    }
  };

  const handleDragStart = (clientX: number) => {
    setDragStart(clientX);
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStart === null || isAnimating) return;
    const diff = dragStart - clientX;
    const threshold = 50; 

    if (Math.abs(diff) > threshold) {
        // Swipe Left (diff > 0) -> Next Bottle
        // Swipe Right (diff < 0) -> Prev Bottle
        const newIndex = diff > 0 
           ? (index + 1) % BOTTLES.length 
           : (index - 1 + BOTTLES.length) % BOTTLES.length;
           
        switchBottle(newIndex);
    }
    setDragStart(null);
  };

  const current = BOTTLES[index];

  return (
    <section 
      className="relative w-full min-h-screen flex flex-col items-center justify-start transition-colors duration-1000 py-[30px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ backgroundColor: current.bgColor }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onMouseLeave={() => setDragStart(null)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {/* Main Container: 393px width, flex column, gap 30px */}
      <div className="relative z-10 flex flex-col items-center gap-[30px] w-full max-w-[393px]">
        
        {/* Bottle Image Container: h-[550px]
            We render BOTH bottles absolutely.
        */}
        <div className="relative h-[550px] w-full overflow-hidden">
          {BOTTLES.map((bottle, i) => (
             <div
               key={bottle.id}
               ref={(el) => { bottleRefs.current[i] = el; }}
               className="absolute inset-0 flex items-center justify-center w-full h-full will-change-transform"
             >
                <img
                  src={bottle.image}
                  alt={bottle.title}
                  className="h-full w-full object-contain scale-[1.14]"
                  style={{ aspectRatio: '131/240' }}
                  draggable={false}
                />
             </div>
          ))}
        </div>

        {/* Carousel Buttons: Flex, Gap 4px */}
        <div className="flex items-center gap-[4px] z-20">
          {BOTTLES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); switchBottle(i); }}
              className="focus:outline-none transition-all duration-300 p-2"
              aria-label={`Select bottle ${i + 1}`}
            >
              {i === index ? (
                <svg width="12" height="5" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="12" height="5" rx="2.5" fill={current.textColor}/>
                </svg>
              ) : (
                <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2.5" cy="2.5" r="2.5" fill={current.textColor} fillOpacity="0.5"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Section: Name and CTA */}
        {/* Removed 'px-6' from here and added to inner items to ensure absolute positioning matches */}
        <div className="relative w-full min-h-[50px]">
          {BOTTLES.map((bottle, i) => (
            <div 
              key={bottle.id}
              ref={(el) => { contentRefs.current[i] = el; }}
              className="flex items-center justify-between gap-[20px] w-full px-6"
              // Initially, only render the active one as relative, others absolute hidden
              style={{ 
                color: bottle.textColor,
                visibility: i === 0 ? 'visible' : 'hidden' // GSAP will override this on mount
              }}
            >
              <div className="flex flex-col justify-center w-[200px]">
                <h3 className="font-trenda text-[10px] font-semibold leading-[14px] tracking-[0.6px] uppercase whitespace-pre-line text-left">
                  {bottle.title}
                </h3>
              </div>

              <button 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-6 py-3 rounded-[4px] backdrop-blur-2xl transition-transform active:scale-95 shrink-0 group"
                style={{ 
                  backgroundColor: bottle.id === 'white' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.10)',
                  color: bottle.textColor
                }}
              >
                  <span className="text-[9px] tracking-[0.02em] uppercase font-black font-trenda leading-none">
                    DISCOVER
                  </span>
                  <div 
                    className="w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: bottle.id === 'white' ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.20)' }}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BottleSwitcher;
