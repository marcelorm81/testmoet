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
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // --- PHYSICS STATE ---
  const physicsState = useRef({
    isDragging: false,
    startX: 0,
    lastX: 0,
    currentScroll: 0,
    targetScroll: 0,
    velocity: 0,
  });

  // Initial Entrance Animation
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

  // Filter Logic
  const handleFilter = (category: string) => {
    if (category === activeCategory) return;

    // 1. Animate Out
    gsap.to('.experience-card', {
      opacity: 0,
      y: 10,
      duration: 0.2,
      stagger: 0.03,
      ease: "power1.in",
      onComplete: () => {
        // 2. Update Data
        setActiveCategory(category);
        const filtered = category === 'ALL' 
          ? EXPERIENCES 
          : EXPERIENCES.filter(item => item.category === category);
        setDisplayedItems(filtered);
        
        // Reset scroll position and physics
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = 0;
            physicsState.current.currentScroll = 0;
            physicsState.current.targetScroll = 0;
            physicsState.current.velocity = 0;
        }
      }
    });
  };

  // Update animation when items change
  useLayoutEffect(() => {
    gsap.fromTo('.experience-card', 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out",
            clearProps: "all" 
        }
    );
  }, [displayedItems]);

  // --- PHYSICS LOOP ---
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let animationFrameId: number;

    const updatePhysics = () => {
        const state = physicsState.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Inertia & Friction (when not dragging)
        if (!state.isDragging) {
            state.targetScroll += state.velocity;
            state.velocity *= 0.95; // Friction factor
        }

        // Bounds Checking
        if (state.targetScroll < 0) {
            state.targetScroll = 0;
            state.velocity = 0;
        } else if (state.targetScroll > maxScroll) {
            state.targetScroll = maxScroll;
            state.velocity = 0;
        }

        // Lerp: Smoothly interpolate current scroll to target scroll
        // 0.08 is the ease factor. Lower = softer, Higher = snappier.
        state.currentScroll += (state.targetScroll - state.currentScroll) * 0.08;

        // Apply scroll if there's significant delta or velocity
        if (Math.abs(state.targetScroll - state.currentScroll) > 0.1 || Math.abs(state.velocity) > 0.1) {
            container.scrollLeft = state.currentScroll;
        }

        animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    // Event Handlers attached to container/window for robust drag
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
        const state = physicsState.current;
        state.isDragging = true;
        const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
        state.startX = pageX;
        state.lastX = pageX;
        state.velocity = 0;
        
        // Sync state with actual scroll position in case we grab mid-animation
        state.targetScroll = container.scrollLeft;
        state.currentScroll = container.scrollLeft;
        
        container.style.cursor = 'grabbing';
        // Disable snap to allow free drag
        container.style.scrollSnapType = 'none';
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
        const state = physicsState.current;
        if (!state.isDragging) return;
        if (e.cancelable) e.preventDefault();
        
        const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
        const delta = pageX - state.startX;
        
        // Apply Drag (1.5x multiplier for responsive feel)
        state.targetScroll = state.currentScroll - delta * 1.5;
        
        // Calculate velocity for throw
        state.velocity = -(pageX - state.lastX) * 1.5;
        
        state.startX = pageX; // Reset start for continuous delta
        state.lastX = pageX;
    };

    const onMouseUp = () => {
        physicsState.current.isDragging = false;
        container.style.cursor = 'grab';
        // We leave scrollSnapType as 'none' to allow the inertia (lerp) to finish smoothly.
        // If we want it to snap after stopping, we'd need complex logic to re-enable it 
        // only when velocity is near zero, but 'none' feels more 'GSAP-like'.
    };

    // Attach listeners
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('touchstart', onMouseDown, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('touchstart', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchend', onMouseUp);
    };
  }, [displayedItems]); // Re-run if items change layout

  return (
    <section id="experience-section" ref={containerRef} className="reveal-section py-20 bg-white overflow-hidden">
      <div className="w-full flex flex-col items-center">
        
        {/* HEADER */}
        <h2 
          ref={titleRef}
          className="font-handwritten text-[29px] text-[#1a1a1a] mb-12 relative z-0 select-none leading-[1.1] text-center"
        >
          Our<br/>Experiences
        </h2>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 px-6">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleFilter(cat)}
              className="relative py-2 group"
            >
              <span className={`font-trenda text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${activeCategory === cat ? 'text-[#990000]' : 'text-[#A69F97] group-hover:text-black'}`}>
                {cat === 'ALL' ? 'Show All' : cat}
              </span>
              {/* Active Dot */}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#990000]" />
              )}
            </button>
          ))}
        </div>

        {/* CAROUSEL CONTAINER */}
        <div 
          ref={carouselRef}
          className="w-full overflow-x-auto pb-12 px-6 hide-scrollbar cursor-grab active:cursor-grabbing scroll-pl-6"
          // We removed 'snap-x' classes here to let JS physics handle the motion fluidly
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 w-max">
            {displayedItems.map((item) => (
              <div 
                key={item.id}
                className="experience-card w-[75vw] max-w-[280px] flex flex-col gap-2 bg-white group select-none shrink-0"
              >
                {/* Image Card */}
                <div className="w-full aspect-square overflow-hidden rounded-[20px] relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Reviews Tag Removed */}
                </div>

                {/* Content */}
                {/* Increased gap and margins for better breathing room */}
                <div className="flex flex-col px-1 mt-3">
                  <h3 className="text-[#1a1a1a] font-trenda text-[16px] leading-[1.3] font-normal line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#A69F97] font-trenda text-[11px] leading-[1.6] font-light line-clamp-4 mt-2">
                    {item.desc}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 border-t border-black/5 mt-4">
                    <div className="flex items-center gap-1.5 text-[#1a1a1a]">
                      <Clock size={11} strokeWidth={1.5} />
                      <span className="text-[10px] font-trenda font-medium uppercase tracking-wide">{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1a1a1a]">
                      <MapPin size={11} strokeWidth={1.5} />
                      <span className="text-[10px] font-trenda font-medium uppercase tracking-wide">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1a1a1a]">
                      <Ticket size={11} strokeWidth={1.5} />
                      <span className="text-[10px] font-trenda font-medium uppercase tracking-wide">{item.price}</span>
                    </div>
                  </div>

                  {/* Single CTA Pill */}
                  <button className="flex items-center gap-2 mt-2 group w-fit">
                     <span className="text-[10px] font-trenda font-bold uppercase tracking-wider text-[#1a1a1a] group-hover:opacity-70 transition-opacity">
                       Discover
                     </span>
                     <div className="w-4 h-4 rounded-full border border-[#1a1a1a]/30 flex items-center justify-center group-hover:border-[#990000] group-hover:bg-[#990000] transition-all duration-300">
                        <ChevronRight size={10} className="text-[#1a1a1a] group-hover:text-white transition-colors" strokeWidth={2.5} />
                     </div>
                  </button>

                </div>
              </div>
            ))}
            {/* Spacer for right side padding */}
            <div className="w-2 shrink-0" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
