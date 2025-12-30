
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
  // This state now ONLY controls the top Hero/Switcher section.
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
    <div ref={containerRef} className="relative w-full min-h-screen bg-white md:bg-[#f0f0f0] md:flex md:justify-center">
      <div className="relative bg-white w-full min-h-screen desktop-constraint shadow-2xl">
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
