
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, Ticket, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const EXPERIENCES = [
  // TOURS
  {
    id: 'signature-tour',
    category: 'TOURS',
    title: 'Signature Tour',
    desc: 'A classic journey through Moët & Chandon’s cellars, where heritage meets living craft.',
    duration: '1h30',
    location: 'Épernay',
    price: 'From €65',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/08d9b95aa3a49c57b666391fa6b09c90c924cc36/moet_experience_man.jpg'
  },
  {
    id: 'imperial-moment',
    category: 'TOURS',
    title: 'Imperial Moment Tour',
    desc: 'An immersion into the cuvées that define Moët & Chandon’s unmistakable style.',
    duration: '1h30',
    location: 'Épernay',
    price: 'From €45',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/385070a164c71538ad21f4d067b120de2464f609/ramdom.jpg'
  },
  {
    id: 'grand-vintage',
    category: 'TOURS',
    title: 'Grand Vintage Tour',
    desc: 'Every Grand Vintage tells the story of a singular year.',
    duration: '1h30',
    location: 'Épernay',
    price: 'From €85',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/08d9b95aa3a49c57b666391fa6b09c90c924cc36/moet_experience_woman.jpg'
  },
  // BARS
  {
    id: 'bar-epernay',
    category: 'BARS',
    title: 'Moët & Chandon Bar Épernay',
    desc: 'A relaxed moment to savour Moët, in the heart of Champagne.',
    duration: 'Flexible',
    location: 'Épernay',
    price: 'By the glass',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/385070a164c71538ad21f4d067b120de2464f609/ramdom2.jpg'
  },
  {
    id: 'bar-london',
    category: 'BARS',
    title: 'Moët & Chandon Bar London',
    desc: 'A refined pause for champagne, in the heart of the city.',
    duration: 'Flexible',
    location: 'London',
    price: 'By the glass',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/385070a164c71538ad21f4d067b120de2464f609/celeb.jpg'
  },
  {
    id: 'bar-berlin',
    category: 'BARS',
    title: 'Moët & Chandon Bar Berlin',
    desc: 'A vibrant Moët moment, surrounded by design and culture.',
    duration: 'Flexible',
    location: 'Berlin',
    price: 'By the glass',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/385070a164c71538ad21f4d067b120de2464f609/champ1.jpg'
  },
  // DINING
  {
    id: 'trianon-dinner',
    category: 'DINING',
    title: 'Trianon Grand Vintage Dinner',
    desc: 'A rare invitation to our private mansion. Six seasonal courses by our Michelin-starred chef.',
    duration: '5h10',
    location: 'Épernay',
    price: 'From €550',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/08d9b95aa3a49c57b666391fa6b09c90c924cc36/moet_dinner3.jpg'
  },
  {
    id: 'trianon-table',
    category: 'DINING',
    title: 'The Trianon Private Table',
    desc: 'A shared table inside historic residence, with rare vintages and culinary storytelling.',
    duration: '5h10',
    location: 'Épernay',
    price: 'From €550',
    image: 'https://raw.githubusercontent.com/marcelorm81/assets/08d9b95aa3a49c57b666391fa6b09c90c924cc36/moetdinner2.jpg'
  }
];

const CATEGORIES = ['ALL', 'TOURS', 'BARS', 'DINING'];

const ExperienceSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [displayedItems, setDisplayedItems] = useState(EXPERIENCES);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // --- ENTRANCE ANIMATION ---
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  // --- FILTER ANIMATION ---
  const handleFilter = (category: string) => {
    if (category === activeCategory) return;
    if (!trackRef.current) return;

    // Fade Out
    gsap.to(trackRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: "power1.in",
      onComplete: () => {
        // Update State
        setActiveCategory(category);
        const filtered = category === 'ALL' 
          ? EXPERIENCES 
          : EXPERIENCES.filter(item => item.category === category);
        setDisplayedItems(filtered);
        
        // Reset Position & Fade In
        // We use a simplified reset here; actual X reset happens in the LayoutEffect
        gsap.set(trackRef.current, { x: 0 }); 
        
        gsap.to(trackRef.current, {
           opacity: 1,
           y: 0,
           duration: 0.4,
           ease: "power2.out"
        });
      }
    });
  };

  // --- GSAP DRAGGABLE IMPLEMENTATION ---
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    // Physics Constants
    const FRICTION = 0.96;
    const BOUNCE_EASE = "back.out(0.8)";
    const DRAG_RESISTANCE = 0.4;

    // State Variables
    let currentX = 0;
    let isPressed = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let velocity = 0;
    let isLocked: 'horizontal' | 'vertical' | null = null;
    let rafId: number;

    const getBounds = () => {
        const wrapperW = wrapper.clientWidth;
        const trackW = track.scrollWidth;
        const min = Math.min(0, wrapperW - trackW);
        return { min, max: 0 };
    };

    const updatePosition = () => {
        gsap.set(track, { x: currentX });
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
        isPressed = true;
        isDragging = false;
        isLocked = null;
        
        const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        
        startX = cx;
        startY = cy;
        lastX = cx;
        velocity = 0;

        // Kill any ongoing inertia tweens
        gsap.killTweensOf(track);
        // Sync currentX with actual transform in case we interrupted a tween
        currentX = gsap.getProperty(track, "x") as number;

        wrapper.style.cursor = 'grabbing';
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isPressed) return;
        
        const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        
        // DIRECTION LOCKING FOR TOUCH
        if (isLocked === null && 'touches' in e) {
            const dx = Math.abs(cx - startX);
            const dy = Math.abs(cy - startY);
            if (dx > 5 || dy > 5) {
                if (dx > dy) {
                    isLocked = 'horizontal';
                } else {
                    isLocked = 'vertical';
                    // If vertical, release control
                    isPressed = false;
                    return;
                }
            }
        }
        
        // If locked vertical, do nothing (let native scroll happen)
        if (isLocked === 'vertical') return;

        // If locked horizontal (or mouse), prevent default to stop page scroll
        if (isLocked === 'horizontal' && e.cancelable) {
            e.preventDefault();
        }

        const delta = cx - lastX;
        lastX = cx;
        velocity = delta;

        if (Math.abs(cx - startX) > 5) isDragging = true;

        // Apply Drag
        currentX += delta;

        // Resistance/Rubber-banding at edges
        const { min, max } = getBounds();
        if (currentX > max) {
            // Pulling past start
            const overflow = currentX - max;
            currentX = max + overflow * DRAG_RESISTANCE; 
        } else if (currentX < min) {
            // Pulling past end
            const overflow = currentX - min;
            currentX = min + overflow * DRAG_RESISTANCE;
        }

        updatePosition();
    };

    const onUp = () => {
        if (!isPressed) return;
        isPressed = false;
        wrapper.style.cursor = 'grab';

        const { min, max } = getBounds();

        // 1. OUT OF BOUNDS SNAP BACK
        if (currentX > max) {
            gsap.to(track, { x: max, duration: 0.6, ease: BOUNCE_EASE });
            return;
        }
        if (currentX < min) {
            gsap.to(track, { x: min, duration: 0.6, ease: BOUNCE_EASE });
            return;
        }

        // 2. INERTIA THROW
        // Calculate destination based on velocity
        // The multiplier determines how "slippery" it feels.
        const inertiaDest = currentX + (velocity * 16); 

        let dest = inertiaDest;
        let duration = 0.8;
        let ease = "power3.out";

        // Check if destination overshoots bounds
        if (dest > max) {
            dest = max;
            ease = "back.out(0.6)"; // Subtle soft landing
        } else if (dest < min) {
            dest = min;
            ease = "back.out(0.6)";
        }

        gsap.to(track, { 
            x: dest, 
            duration: duration, 
            ease: ease 
        });
    };

    const onClick = (e: Event) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // Attach Events
    wrapper.addEventListener('mousedown', onDown);
    wrapper.addEventListener('touchstart', onDown, { passive: false });
    
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    
    wrapper.addEventListener('click', onClick, true); // Capture phase to block clicks

    return () => {
        wrapper.removeEventListener('mousedown', onDown);
        wrapper.removeEventListener('touchstart', onDown);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
        wrapper.removeEventListener('click', onClick, true);
    };
  }, [displayedItems]);

  return (
    <section id="experience-section" ref={containerRef} className="reveal-section py-24 bg-white overflow-hidden">
      <div className="w-full flex flex-col items-center">
        
        {/* HEADER */}
        <h2 
          ref={titleRef}
          className="font-handwritten text-[32px] md:text-[40px] text-[#1a1a1a] mb-12 relative z-0 select-none leading-[1.1] text-center"
        >
          Our<br/>Experiences
        </h2>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 px-6">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleFilter(cat)}
              className="relative py-2 group"
            >
              <span className={`font-trenda text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${activeCategory === cat ? 'text-[#C00115]' : 'text-[#A69F97] group-hover:text-black'}`}>
                {cat === 'ALL' ? 'Show All' : cat}
              </span>
              {/* Active Dot */}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C00115]" />
              )}
            </button>
          ))}
        </div>

        {/* CAROUSEL WRAPPER */}
        <div 
          ref={wrapperRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing px-6"
        >
          {/* MOVING TRACK */}
          {/* We use 'w-max' to let it grow horizontally based on content */}
          <div ref={trackRef} className="flex gap-5 w-max will-change-transform">
            {displayedItems.map((item) => (
              <div 
                key={item.id}
                className="experience-card w-[75vw] md:w-[25vw] max-w-[320px] flex flex-col gap-4 bg-white group select-none shrink-0"
              >
                {/* Image Card */}
                <div className="w-full aspect-square overflow-hidden rounded-[2px] relative shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="flex flex-col px-1">
                  <h3 className="text-[#1a1a1a] font-trenda text-[18px] leading-[1.3] font-normal line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#A69F97] font-trenda text-[11px] leading-[1.6] font-light line-clamp-3 mt-2 min-h-[3.2em]">
                    {item.desc}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4 border-t border-black/5 mt-4">
                    <div className="flex items-center gap-1.5 text-[#1a1a1a]/80">
                      <Clock size={11} strokeWidth={1.5} />
                      <span className="text-[10px] font-trenda font-medium uppercase tracking-wide">{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1a1a1a]/80">
                      <MapPin size={11} strokeWidth={1.5} />
                      <span className="text-[10px] font-trenda font-medium uppercase tracking-wide">{item.location}</span>
                    </div>
                  </div>

                  {/* Single CTA Pill */}
                  <div className="mt-2">
                      <button className="flex items-center gap-2 group/btn w-fit">
                        <span className="text-[10px] font-trenda font-bold uppercase tracking-wider text-[#1a1a1a] group-hover/btn:text-[#C00115] transition-colors">
                        Discover
                        </span>
                        <div className="w-5 h-5 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center group-hover/btn:border-[#C00115] group-hover/btn:bg-[#C00115] transition-all duration-300">
                            <ChevronRight size={10} className="text-[#1a1a1a] group-hover/btn:text-white transition-colors" strokeWidth={2.5} />
                        </div>
                    </button>
                  </div>

                </div>
              </div>
            ))}
            {/* Right padding spacer inside the track to ensure last item isn't flush with edge */}
            <div className="w-1 shrink-0" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
