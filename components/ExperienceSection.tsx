
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, Ticket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { 
          y: 60, 
          opacity: 0,
          scale: 0.95 
        },
        { 
          y: 0, 
          opacity: 0.9, 
          scale: 1,
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <section id="experience-section" className="reveal-section py-[60px] bg-white text-center overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Background Text: Spacing adjusted to 30px gap. Broken into two lines. Line height 125%. */}
        {/* Animated via GSAP ref */}
        <h2 
          ref={titleRef}
          className="font-handwritten text-[30px] text-[#1a1a1a] mb-[30px] relative z-0 pointer-events-none select-none leading-[1.25]"
          style={{ opacity: 0 }} // Initial opacity 0 to prevent FOUC before GSAP takes over
        >
          Our<br/>Experiences
        </h2>

        {/* Image: 
            Width reduced by ~20% from previous 90% (now 70%).
            Shape: Pill (rounded-[1000px])
            Height: Fixed at 350px as requested
        */}
        <div className="relative z-10 w-[70%] max-w-[354px] md:max-w-[400px] h-[350px] mb-12 overflow-hidden rounded-[1000px]">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[5000ms] hover:scale-110"
            style={{ backgroundImage: `url('https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/experience.jpg')` }}
          />
        </div>

        {/* Content Block: Increased horizontal padding to px-10 (40px) and constrained width */}
        <div className="flex flex-col items-center gap-6 max-w-[400px] mx-auto px-10 relative z-10">
          <div className="flex flex-col items-center gap-3">
            {/* Subtitle: 10px, Red, 0.02em tracking (2%), Semibold */}
            <span className="text-[#990000] text-[10px] font-semibold tracking-[0.02em] uppercase font-trenda">
              Signature Tour
            </span>
            
            {/* Heading: 18px, Leading 1.0 */}
            <h3 className="font-trenda text-black text-[18px] leading-[1.0]">
              The Grand Vintage <br/>
              Cellar Journey
            </h3>
          </div>
          
          {/* Body: Reduced to match F1Story (10px, leading 1.6) */}
          <p className="text-gray-500 font-trenda font-light text-[10px] leading-[1.6]">
            Discover our historic chalk cellars, a UNESCO World Heritage site, and discover the soul of our most prestigious cuvées.
          </p>

          {/* INFO ROW WITH ICONS */}
          {/* Reduced gap to gap-x-3 to ensure single line on mobile */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-3 text-[11px] text-[#A69F97] font-medium tracking-[0.1em] uppercase font-trenda">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>1H30</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#A69F97]" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>ÉPERNAY</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#A69F97]" />
            <div className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>FROM €65</span>
            </div>
          </div>

          {/* Buttons: Updated to match Header 'Discover' dimensions and typography */}
          {/* Header Btn: px-[18px] py-3. Text: text-[9px] tracking-[0.02em] font-black */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mt-2">
            <button className="flex-1 w-full flex justify-center items-center px-[18px] py-3 rounded-[4px] border border-black/10 bg-black/5 hover:bg-black/10 transition-colors uppercase">
              <span className="text-[9px] tracking-[0.02em] font-black font-trenda leading-none text-[#1a1a1a]">Discover</span>
            </button>
            <button className="flex-1 w-full flex justify-center items-center px-[18px] py-3 rounded-[4px] border border-[#1a1a1a] bg-[#1a1a1a] hover:bg-black/80 transition-colors uppercase">
              <span className="text-[9px] tracking-[0.02em] font-black font-trenda leading-none text-white">Book Now</span>
            </button>
          </div>

          {/* Reviews */}
          <div className="text-[10px] text-[#A69F97] tracking-[0.2em] font-semibold uppercase">
            42 Reviews
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
