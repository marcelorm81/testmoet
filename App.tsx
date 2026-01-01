
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StickyHeader from './components/StickyHeader';
import PinnedHero from './components/PinnedHero';
import BottleSwitcher from './components/BottleSwitcher';
import F1Story from './components/F1Story';
import ExperienceSection from './components/ExperienceSection';
import CraftsmanshipCarousel from './components/CraftsmanshipCarousel';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // 'light' = White Logo (Red Bottle), 'dark' = Black Logo (White Bottle)
  const [headerTheme, setHeaderTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Reveal animations for mobile viewport
    const sections = gsap.utils.toArray('.reveal-section') as HTMLElement[];
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen md:bg-[#f0f0f0] md:flex md:justify-center">
      {/* 
        Container Frame
        Transparent on mobile for immersive Safari UI, desktop keeps shadow
      */}
      <div className="relative w-full min-h-screen desktop-constraint md:shadow-2xl bg-transparent md:bg-white">
        
        {/* FIXED HEADER LAYER */}
        <StickyHeader theme={headerTheme} />

        <main className="relative bg-transparent">
          {/* SCROLLABLE CONTENT LAYER */}
          <PinnedHero />
          
          <div className="relative z-10 bg-[#C00115]">
             <BottleSwitcher onThemeChange={setHeaderTheme} />
             <F1Story />
             <ExperienceSection />
             <CraftsmanshipCarousel />
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default App;
