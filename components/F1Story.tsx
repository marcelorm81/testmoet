
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const F1Story: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Media query for desktop logic vs mobile
    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", 
            end: "+=150%", // Pin for 1.5x viewport height to allow reading time
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          }
        });

        // 1. Image Zoom Effect (Cinematic constant movement)
        tl.to(bgRef.current, {
            scale: 1.15,
            duration: 1,
            ease: "none"
        }, 0);

        // 2. Card Slide Up Reveal
        // Starts off-screen (y: 120%) and slides to its final position
        tl.fromTo(cardRef.current, 
            { y: "120%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.6, ease: "power2.out" },
            0.1 // Start slightly after pin
        );

        // 3. Blur the image (keep rich color, just defocus)
        tl.to(bgRef.current, {
            filter: 'blur(10px)', 
            duration: 0.4,
            ease: "power1.inOut"
        }, 0.6); 
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      id="f1-section"
      ref={containerRef} 
      className="relative w-full h-[100dvh] overflow-hidden bg-white z-20"
    >
      {/* 
         Background Image Layer 
         Full bleed, fixed cover.
         TAGGED: 'white' -> Forces WHITE Logo when over this image
      */}
      <div 
        ref={bgRef}
        data-header-theme="white"
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center will-change-transform"
        style={{ 
          backgroundImage: `url('https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/f1.jpg')`,
        }}
      >
        {/* Subtle overlay to ensure text contrast if needed */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 
         Editorial Card Layer 
         Positioned absolutely. GSAP controls its Y-axis.
      */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ paddingBottom: 'max(48px, env(safe-area-inset-bottom, 0px) + 48px)' }}>
         {/* 
            TAGGED: 'black' -> Forces BLACK Logo when over this white card
            Updated: Compact sizing with reduced padding and gap.
         */}
         <div 
           id="f1-card"
           ref={cardRef}
           data-header-theme="black"
           className="relative w-[85%] max-w-[360px] bg-[#F4F0EB] pointer-events-auto shadow-2xl flex flex-col"
         >
            {/* Red Accent Border Top */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#C00115]" />

            {/* Content Container - Use flex to distribute content within the square */}
            <div className="w-full px-7 py-[35px] flex flex-col justify-between">
                
                <div className="flex flex-col gap-4">
                    {/* Headline - Title line height tight (way smaller than normal) */}
                    <h2 className="text-[#C00115] font-trenda text-[22px] leading-[24px] font-normal tracking-normal">
                      Gesture <br/>
                      that became <br/>
                      a global icon
                    </h2>

                    {/* Body Text - Line height normal */}
                    <p className="text-[#1a1a1a] font-trenda text-[12px] leading-normal font-light">
                      The podium celebration is one of Formula 1’s most iconic moments. Since the 1960s, Moët & Chandon has been there when victory turns into joy.
                    </p>
                </div>

                {/* CTA - Pushed to bottom by justify-between */}
                <button className="group flex items-center gap-2 mt-2 text-[#1a1a1a] hover:opacity-70 transition-opacity">
                    <span className="font-trenda text-[9px] font-bold tracking-[0] uppercase">
                        Step Inside The Story
                    </span>
                    <div className="bg-black/10 rounded-full p-1 group-hover:bg-black/20 transition-colors">
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </button>
            </div>
         </div>
      </div>
    </section>
  );
};

export default F1Story;
