
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 1,
    title: "Our Commitment\nto Tomorrow",
    desc: "At Moët & Chandon, we protect the nature that inspires us, cultivating our vineyards with respect for ecosystems and future generations.",
    img: "https://github.com/marcelorm81/assets/blob/202a42dcfc9764f71f3ff20d1a796ef2038558a9/IMG_4245.jpg?raw=true"
  },
  {
    id: 2,
    title: "Our Unique\nSavoir-Faire",
    desc: "Generations of expertise and meticulous attention to detail come together to create champagnes of incomparable quality and elegance.",
    img: "https://raw.githubusercontent.com/marcelorm81/assets/refs/heads/main/Galerie-Imperiale_Copyright-James-Bort-for-Moet-Chandon-(1).avif"
  },
  {
    id: 3,
    title: "Discover our\nvineyards",
    desc: "Our vast vineyards across Champagne give us unparalleled diversity of terroirs and grapes, shaping the signature style of Moët & Chandon.",
    img: "https://github.com/marcelorm81/assets/blob/202a42dcfc9764f71f3ff20d1a796ef2038558a9/IMG_4211.jpg?raw=true"
  }
];

const CraftsmanshipCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalSlides = SLIDES.length;
      
      // Horizontal Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1, // Smooth scrubbing
          snap: {
            snapTo: 1 / (totalSlides - 1),
            duration: { min: 0.3, max: 0.8 }, // Slightly longer for elegance
            delay: 0, // Instant snap start
            ease: "power2.inOut"
          },
          end: () => "+=" + (sectionRef.current?.offsetWidth || window.innerWidth) * 2.5, // Slower scroll
        }
      });

      // 1. Container Slide
      tl.to(containerRef.current, {
        xPercent: -100 * ((totalSlides - 1) / totalSlides),
        ease: "none",
      });

      // 2. Parallax Effect for Images (Elegant "Switching" Transition)
      // As container moves LEFT, images move slightly RIGHT to create depth
      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        const img = slide.querySelector('img');
        if (img) {
          // Subtle parallax: Move image 15% to the right over the course of the scroll
          gsap.fromTo(img, 
            { xPercent: -5 }, // Start slightly left
            { 
              xPercent: 5,   // End slightly right
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                scrub: 1,
                start: 'top top',
                end: () => "+=" + (sectionRef.current?.offsetWidth || window.innerWidth) * 2.5,
              }
            }
          );
        }
      });

    });
    
    return () => ctx.revert();
  }, []);

  return (
    <section id="craftsmanship-section" ref={sectionRef} className="relative w-full h-[100dvh] overflow-hidden bg-black z-20">
      <div 
        ref={containerRef} 
        className="flex h-full will-change-transform"
        style={{ width: `${SLIDES.length * 100}%` }}
      >
        {SLIDES.map((slide, i) => (
          <div 
            key={slide.id} 
            ref={el => { slidesRef.current[i] = el; }}
            className="relative h-full flex-shrink-0 overflow-hidden"
            style={{ width: `${100 / SLIDES.length}%` }}
          >
            {/* Image Layer - slightly larger for parallax */}
            <div className="absolute inset-0 w-[110%] h-full -left-[5%]">
               <img 
                 src={slide.img} 
                 alt={slide.title.replace('\n', ' ')} 
                 className="w-full h-full object-cover"
               />
               {/* 
                  Gradient Overlay: Updated to be stronger (black -> black/40 -> transparent) 
                  to fully protect text readability.
               */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:pb-32">
                <div className="w-full max-w-[85vw] md:max-w-[320px]">
                   {/* Decoration Line */}
                   <div className="w-[40px] h-[2px] bg-[#FFFBF7] mb-6" />
                   
                   {/* Title */}
                   <h2 className="text-[#FFFBF7] font-trenda text-[22px] leading-[1.2] font-normal mb-5 whitespace-pre-line tracking-tight">
                     {slide.title}
                   </h2>
                   
                   <p className="text-[#FFFBF7]/90 font-trenda text-[10px] leading-[1.6] font-light mb-8 pr-4">
                     {slide.desc}
                   </p>

                   <button className="group flex items-center gap-3 text-[#FFFBF7] hover:opacity-80 transition-opacity">
                     <span className="font-trenda text-[9px] font-bold tracking-[0.2em] uppercase">
                       Explore
                     </span>
                     <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                     </div>
                   </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CraftsmanshipCarousel;
