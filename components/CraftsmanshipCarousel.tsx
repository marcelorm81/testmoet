
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 1,
    title: "Our Commitment\nto Tomorrow",
    desc: "At Moët & Chandon, we protect the nature that inspires us, cultivating our vineyards with respect for ecosystems and future generations.",
    src: "https://github.com/marcelorm81/assets/blob/202a42dcfc9764f71f3ff20d1a796ef2038558a9/IMG_4245.jpg?raw=true",
    type: 'image'
  },
  {
    id: 2,
    title: "Our Unique\nSavoir-Faire",
    desc: "Generations of expertise and meticulous attention to detail come together to create champagnes of incomparable quality and elegance.",
    src: "https://github.com/marcelorm81/assets/blob/98484cc8e7006134140ea52530d1568d9bd997a0/unique-savoir-faire.mp4?raw=true",
    type: 'video'
  },
  {
    id: 3,
    title: "Discover our\nvineyards",
    desc: "Our vast vineyards across Champagne give us unparalleled diversity of terroirs and grapes, shaping the signature style of Moët & Chandon.",
    src: "https://github.com/marcelorm81/assets/blob/202a42dcfc9764f71f3ff20d1a796ef2038558a9/IMG_4211.jpg?raw=true",
    type: 'image'
  }
];

const CraftsmanshipCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag State for Desktop Mouse Interaction
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    // --- VISUAL SYNC (Crossfade Backgrounds) ---
    const updateVisuals = () => {
        const currentScroll = scroller.scrollLeft;
        const width = scroller.offsetWidth;
        
        // Progress: 0.0 -> 1.0 -> 2.0
        const progress = currentScroll / width;

        // 1. Update Backgrounds
        SLIDES.forEach((_, i) => {
            const bg = bgRefs.current[i];
            if (!bg) return;
            
            // Calculate distance from center of viewport
            const dist = Math.abs(progress - i);
            
            // Crossfade Logic:
            // If dist is 0 (centered), opacity 1.
            // If dist is 1 (offscreen), opacity 0.
            let opacity = 1 - dist;
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;

            // Z-Index: The most visible slide stays on top
            const zIndex = opacity > 0.5 ? 2 : 1;
            
            gsap.set(bg, { opacity, zIndex });
        });

        // 2. Update Dots
        dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            const dist = Math.abs(progress - i);
            
            let w = 6;
            let alpha = 0.3;
            
            // Smooth transition for dots
            if (dist < 1) {
                w = 6 + (1 - dist) * 18; 
                alpha = 0.3 + (1 - dist) * 0.7;
            }
            
            gsap.set(dot, { 
                width: w, 
                backgroundColor: `rgba(255, 251, 247, ${alpha})` 
            });
        });
    };

    // --- MOUSE DRAG HANDLERS (Desktop "Swipe") ---
    // We strictly use this for Mouse events. Touch events are handled natively by CSS 'touch-action: pan-x pan-y'.
    
    const onMouseDown = (e: MouseEvent) => {
        isDown.current = true;
        scroller.style.cursor = 'grabbing';
        scroller.style.scrollSnapType = 'none'; // Disable snap while dragging for smoothness
        startX.current = e.pageX - scroller.offsetLeft;
        scrollLeft.current = scroller.scrollLeft;
    };

    const onMouseLeave = () => {
        if (!isDown.current) return;
        isDown.current = false;
        scroller.style.cursor = 'grab';
        scroller.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    };

    const onMouseUp = () => {
        if (!isDown.current) return;
        isDown.current = false;
        scroller.style.cursor = 'grab';
        scroller.style.scrollSnapType = 'x mandatory';
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDown.current) return;
        e.preventDefault(); // Prevent text selection
        const x = e.pageX - scroller.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Scroll-fast multiplier
        scroller.scrollLeft = scrollLeft.current - walk;
    };

    // Attach Listeners
    scroller.addEventListener('scroll', updateVisuals, { passive: true });
    
    // Mouse Drag Listeners
    scroller.addEventListener('mousedown', onMouseDown);
    scroller.addEventListener('mouseleave', onMouseLeave);
    scroller.addEventListener('mouseup', onMouseUp);
    scroller.addEventListener('mousemove', onMouseMove);

    // Initial Draw
    updateVisuals();

    return () => {
        scroller.removeEventListener('scroll', updateVisuals);
        scroller.removeEventListener('mousedown', onMouseDown);
        scroller.removeEventListener('mouseleave', onMouseLeave);
        scroller.removeEventListener('mouseup', onMouseUp);
        scroller.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section 
      data-header-theme="white" 
      className="relative w-full h-[100dvh] overflow-hidden bg-black z-20"
    >
      
      {/* 1. BACKGROUND LAYER (Fixed/Absolute) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        {SLIDES.map((slide, i) => (
          <div 
            key={`bg-${slide.id}`}
            ref={el => { bgRefs.current[i] = el; }}
            className="absolute inset-0 w-full h-full will-change-opacity bg-black"
          >
             {slide.type === 'video' ? (
               <video 
                 src={slide.src} 
                 autoPlay 
                 muted 
                 loop 
                 playsInline 
                 className="w-full h-full object-cover opacity-80" 
               />
             ) : (
               <img 
                 src={slide.src} 
                 alt="" 
                 className="w-full h-full object-cover opacity-80"
               />
             )}
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
          </div>
        ))}
      </div>

      {/* 2. SCROLL CONTAINER */}
      {/* 
          - touch-action: pan-x pan-y -> CRITICAL. Allows horizontal scroll (carousel via overflow) and vertical scroll (page).
          - overflow-x-auto -> Native scroll.
          - snap-x snap-mandatory -> Clean alignment.
      */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 w-full h-full overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory z-20 cursor-grab active:cursor-grabbing hide-scrollbar"
        style={{ 
            touchAction: 'pan-x pan-y', // Explicitly allow vertical panning (browser handles horizontal overflow)
            WebkitOverflowScrolling: 'touch', // iOS Momentum
        }}
      >
         <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
         `}</style>

         {SLIDES.map((slide) => (
           <div 
             key={`text-${slide.id}`} 
             className="relative w-full h-full flex-shrink-0 snap-center flex flex-col justify-end px-8 pb-24 md:pb-32"
           >
              <div className="w-full max-w-[85vw] md:max-w-[320px] pointer-events-none select-none">
                 <div className="w-[40px] h-[2px] bg-[#FFFBF7] mb-6" />
                 
                 <h2 className="text-[#FFFBF7] font-trenda text-[22px] leading-[1.2] font-normal mb-5 whitespace-pre-line tracking-tight drop-shadow-lg">
                   {slide.title}
                 </h2>
                 
                 <p className="text-[#FFFBF7]/90 font-trenda text-[10px] leading-[1.6] font-light mb-8 pr-4 drop-shadow-md">
                   {slide.desc}
                 </p>

                 <button className="group flex items-center gap-3 text-[#FFFBF7] hover:opacity-80 transition-opacity pointer-events-auto">
                   <span className="font-trenda text-[9px] font-bold tracking-[0.2em] uppercase">
                     Explore
                   </span>
                   <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                   </div>
                 </button>
              </div>
           </div>
         ))}
      </div>

      {/* 3. INDICATORS */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center items-center gap-3 pointer-events-auto">
        {SLIDES.map((_, i) => (
          <div 
            key={`dot-${i}`}
            ref={el => { dotRefs.current[i] = el; }}
            className="h-[4px] rounded-full"
            style={{ 
                width: '6px', 
                backgroundColor: 'rgba(255, 251, 247, 0.3)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)' 
            }}
          />
        ))}
      </div>

    </section>
  );
};

export default CraftsmanshipCarousel;
