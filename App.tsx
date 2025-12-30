
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    // Outer container: Removed 'bg-white', now transparent to let body bg (#990000) show for top overscroll
    <div ref={containerRef} className="relative w-full min-h-screen md:bg-[#f0f0f0] md:flex md:justify-center">
      {/* Inner container: Removed 'bg-white' from top level, applied to specific content areas instead if needed, 
          but usually the components have their own backgrounds. 
          Actually, we keep bg-white here but make it start AFTER the hero? 
          No, the Hero is fixed/pinned. 
          Best strategy: Keep bg-white but rely on 'viewport-fit=cover' + body bg #990000.
          If we make this transparent, the red body will show.
      */}
      <div className="relative w-full min-h-screen desktop-constraint shadow-2xl bg-white">
        <main>
          <PinnedHero theme={headerTheme} />
          
          <div className="relative z-10 bg-white">
            <BottleSwitcher onThemeChange={setHeaderTheme} />
            <F1Story />
            <ExperienceSection />
            <CraftsmanshipCarousel />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
