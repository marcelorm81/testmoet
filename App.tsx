
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
      {/* Inner container: Changed bg-white to bg-[#C00115] to prevent white gaps during scroll transitions */}
      <div className="relative w-full min-h-screen desktop-constraint shadow-2xl bg-[#C00115]">
        <main>
          <PinnedHero theme={headerTheme} />
          
          {/* Changed z-10 wrapper bg-white to bg-[#C00115] for seamless connection between Hero and BottleSwitcher */}
          <div className="relative z-10 bg-[#C00115]">
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
