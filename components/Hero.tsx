
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const maskRef = useRef<HTMLDivElement>(null);
  const bgImage = "https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/header.jpg";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(maskRef.current, {
        clipPath: 'ellipse(38% 48% at 50% 50%)',
        scrollTrigger: {
          trigger: maskRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#C00115]">
      {/* Background with progressive mask */}
      <div 
        ref={maskRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300 z-0"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          clipPath: 'ellipse(100% 100% at 50% 50%)'
        }}
      />
      
      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 text-white z-10 px-4">
        <div className="text-center max-w-2xl w-full">
          <p className="text-[11px] tracking-[0.6em] uppercase mb-10 opacity-90 font-black font-trenda">Holiday Season</p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-trenda font-light leading-[1.1] mb-14 tracking-tight">
            Celebrate the <br/><span className="italic font-normal">Right Way</span>
          </h2>
          <button className="mx-auto flex items-center space-x-5 bg-white/10 backdrop-blur-2xl border border-white/40 px-14 py-5 rounded-full hover:bg-white hover:text-[#C00115] transition-all duration-500 group shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <span className="text-[11px] tracking-[0.3em] uppercase font-black font-trenda">Shop Collection</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-[#C00115]/20 transition-colors">
               <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
