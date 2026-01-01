
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PinnedHero: React.FC = () => {
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial States
    gsap.set(maskRef.current, { clipPath: 'inset(0% 0% 0% 0% round 0px)' });
    gsap.set(pinRef.current, { backgroundColor: 'transparent' });

    // Pin Animation
    // This pins the hero for 100% of the viewport height.
    const tl = gsap.timeline({ 
        scrollTrigger: { 
            trigger: pinRef.current, 
            id: 'hero-pin',
            start: 'top top', 
            end: '+=100%', 
            pin: true, 
            scrub: 1, 
            anticipatePin: 1, 
            invalidateOnRefresh: true, 
        } 
    });
    
    // Animate mask to shrink (creating the border effect)
    tl.to(maskRef.current, { clipPath: 'inset(18% 15% 5% 15% round 300px 300px 300px 300px)', duration: 0.6, ease: 'power2.inOut' }, 0);
    // Change background to red - ensure it stays red at the end
    tl.to(pinRef.current, { backgroundColor: '#C00115', duration: 0.3, immediateRender: false }, 0);
    // Ensure red background persists after animation completes
    tl.set(pinRef.current, { backgroundColor: '#C00115' }, 1);
    
    // Parallax the background image
    tl.to(bgRef.current, { yPercent: 10, scale: 1.1, duration: 1.5, ease: 'none' }, 0);
    // Move content up and fade
    tl.to(contentRef.current, { y: -25, duration: 0.6, ease: 'power2.inOut' }, 0);

    return () => { 
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, []);

  return (
    // Added data-header-theme="white" to ensure logo is always white on the hero
    <div id="pinned-hero-trigger" ref={pinRef} data-header-theme="white" className="relative w-full h-[100dvh] overflow-hidden z-10" style={{ backgroundColor: 'transparent' }}>
         <div ref={maskRef} className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-transparent">
            <div ref={bgRef} className="absolute w-full h-full bg-cover bg-center" style={{ 
              backgroundImage: `url('https://raw.githubusercontent.com/marcelorm81/assets/f8ea16de177261070786196998039f302b305a26/moet_dance.png')`,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: '100dvh'
            }} />
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0 pointer-events-none" />
            <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-end text-white z-10 px-4" style={{ paddingBottom: 'max(50px, env(safe-area-inset-bottom, 0px) + 50px)' }}>
               <div className="text-center max-w-2xl w-full">
                 <p className="text-[9px] tracking-[0.2em] uppercase mb-5 opacity-90 font-semibold font-trenda leading-none">Moët Experiences</p>
                 <h2 className="text-[24px] font-trenda font-normal leading-[1.2] mb-8 tracking-tight">Make It a Moment<br/>to Remember</h2>
                 <button className="mx-auto flex items-center space-x-3 bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-[4px] hover:bg-white hover:text-[#C00115] transition-all duration-500 group shadow-[0_15px_40px_rgba(0,0,0,0.3)]"><span className="text-[9px] tracking-[0.02em] uppercase font-black font-trenda leading-none">DISCOVER</span><div className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-[#C00115]/20 transition-colors"><ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></div></button>
               </div>
            </div>
         </div>
    </div>
  );
};

export default PinnedHero;
