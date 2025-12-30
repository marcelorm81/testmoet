
import React from 'react';
import { Mail, MessageCircle, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white w-full py-16 px-6 flex flex-col items-center relative z-20">
      
      {/* 2. CTA BUTTONS (Logo Removed) */}
      <div className="flex flex-col w-full max-w-[320px] gap-4 mb-16 mt-12">
        <button className="flex items-center justify-center gap-3 w-full py-4 border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase group">
            <Mail size={14} className="group-hover:stroke-black transition-colors" />
            <span className="text-[10px] font-bold tracking-[0.2em] font-trenda">Newsletter</span>
        </button>
        <button className="flex items-center justify-center gap-3 w-full py-4 border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase group">
            <MessageCircle size={14} className="group-hover:stroke-black transition-colors" />
            <span className="text-[10px] font-bold tracking-[0.2em] font-trenda">Contact Us</span>
        </button>
      </div>

      {/* 3. SOCIAL MEDIA ICONS (Line Style) */}
      <div className="flex items-center gap-8 mb-16">
          <a href="#" aria-label="Instagram" className="hover:opacity-60 transition-opacity">
            <Instagram size={20} strokeWidth={1.2} />
          </a>
          
          <a href="#" aria-label="X (Twitter)" className="hover:opacity-60 transition-opacity">
            {/* Custom X Logo (Line Style Approximation) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>

          <a href="#" aria-label="YouTube" className="hover:opacity-60 transition-opacity">
            <Youtube size={22} strokeWidth={1.2} />
          </a>

          <a href="#" aria-label="TikTok" className="hover:opacity-60 transition-opacity">
            {/* Custom TikTok Logo (Line Style) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
      </div>

      {/* 4. DIVIDER */}
      <div className="w-full h-[1px] bg-white/20 mb-12 max-w-[320px] md:max-w-2xl"></div>

      {/* 5. FOOTER MENU ITEMS */}
      <nav className="flex flex-col items-center gap-4 mb-12 text-[10px] uppercase tracking-[0.1em] text-white/90 font-trenda md:flex-row md:flex-wrap md:justify-center md:gap-x-8">
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
