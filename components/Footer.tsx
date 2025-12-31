
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Instagram, Youtube, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal Animation for Newsletter Section
      // We animate the children (Title, Text, Form) in a staggered sequence
      gsap.fromTo(
        newsletterRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: 'top 85%', // Trigger when section is near bottom of view
          },
        }
      );

      // Reveal Animation for Contact Button (slightly delayed for cascade effect)
      gsap.fromTo(
        contactRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 90%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="main-footer" ref={containerRef} data-header-theme="white" className="bg-black text-white w-full pt-10 px-6 flex flex-col items-center relative z-20 overflow-hidden" style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom, 0px) + 80px)' }}>
      
      {/* 1. NEWSLETTER SIGN-IN MOMENT */}
      <div ref={newsletterRef} className="flex flex-col items-center w-full max-w-md text-center mb-16 mt-8">
        {/* Updated Title: Printed Font (font-handwritten), 24px, 55px line-height. 
            Increased margin-bottom from mb-4 to mb-8 */}
        <h3 className="font-handwritten text-[24px] leading-[55px] mb-8 text-white">
          Stay Close to the<br />
          Maison of joy
        </h3>
        
        {/* Increased margin-bottom from mb-10 to mb-14 */}
        <p className="font-trenda text-[11px] leading-[1.6] text-white/70 max-w-[280px] mb-14 font-light tracking-wide">
          Discover new experiences, exclusive moments, and the latest ways to explore Moët & Chandon.
        </p>

        <form 
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-[320px] relative flex items-center border-b border-white/30 hover:border-white focus-within:border-white transition-colors duration-300 pb-3"
        >
            <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-transparent border-none outline-none text-[13px] font-trenda text-white placeholder:text-white/40 tracking-wide appearance-none"
            />
            <button 
                type="submit" 
                className="ml-4 group p-1"
                aria-label="Subscribe"
            >
                <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </button>
        </form>
      </div>

      {/* 2. CONTACT US BUTTON (Newsletter Button Removed) */}
      <div ref={contactRef} className="flex flex-col w-full max-w-[320px] gap-4 mb-16">
        <button className="flex items-center justify-center gap-3 w-full py-4 border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase group">
            <MessageCircle size={14} className="group-hover:stroke-black transition-colors" />
            <span className="text-[10px] font-bold tracking-[0.2em] font-trenda">Contact Us</span>
        </button>
      </div>

      {/* 3. SOCIAL MEDIA ICONS */}
      <div className="flex items-center gap-8 mb-16">
          <a href="#" aria-label="Instagram" className="hover:opacity-60 transition-opacity">
            <Instagram size={20} strokeWidth={1.2} />
          </a>
          
          <a href="#" aria-label="X (Twitter)" className="hover:opacity-60 transition-opacity">
            {/* Custom X Logo */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>

          <a href="#" aria-label="YouTube" className="hover:opacity-60 transition-opacity">
            <Youtube size={22} strokeWidth={1.2} />
          </a>

          <a href="#" aria-label="TikTok" className="hover:opacity-60 transition-opacity">
            {/* Custom TikTok Logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
      </div>

      {/* 4. DIVIDER */}
      <div className="w-full h-[1px] bg-white/20 mb-12 max-w-[320px] md:max-w-2xl"></div>

      {/* 5. FOOTER MENU ITEMS */}
      <nav className="flex flex-col items-center gap-4 mb-12 text-[10px] uppercase tracking-[0.1em] text-white/90 font-trenda">
        <a href="#" className="hover:text-white/60 transition-colors">Accessibility</a>
        <a href="#" className="hover:text-white/60 transition-colors">Careers</a>
        <a href="#" className="hover:text-white/60 transition-colors">Sitemap</a>
        <a href="#" className="hover:text-white/60 transition-colors">Privacy policy</a>
        <a href="#" className="hover:text-white/60 transition-colors">Terms & Conditions of Use</a>
        <a href="#" className="hover:text-white/60 transition-colors">Rights request form</a>
        <a href="#" className="hover:text-white/60 transition-colors">Cookie and ad settings</a>
      </nav>

      {/* 6. LANGUAGE & COUNTRY */}
      <button className="mb-12 hover:opacity-70 transition-opacity group">
         <span className="text-[10px] uppercase tracking-[0.1em] font-trenda border-b border-white/40 pb-1 group-hover:border-white">
            Change Language and Country
         </span>
      </button>

      {/* 7. COPYRIGHT */}
      <p className="text-[9px] text-white/50 tracking-[0.1em] font-trenda uppercase">
        COPYRIGHT © 2026 MOËT & CHANDON
      </p>

    </footer>
  );
};

export default Footer;
