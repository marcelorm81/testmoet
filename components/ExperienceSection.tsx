
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Drag State for Desktop Mouse Interaction
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    if (!scrollContainerRef.current) return;

    // Fade Out
    gsap.to(scrollContainerRef.current, {
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
        
        // Reset Scroll Position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
        
        // Fade In
        gsap.to(scrollContainerRef.current, {
           opacity: 1,
           y: 0,
           duration: 0.4,
           ease: "power2.out"
        });
      }
    });
  };

  // --- MOUSE DRAG HANDLERS (Desktop "Swipe") ---
  useEffect(() => {
    const slider = scrollContainerRef.current;
    if (!slider) return;

    const onMouseDown = (e: MouseEvent) => {
      isDown.current = true;
      slider.style.cursor = 'grabbing';
      // Disable snap while dragging for smoothness
      slider.style.scrollSnapType = 'none'; 
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
    };
    
    const onMouseLeave = () => {
      isDown.current = false;
      slider.style.cursor = 'grab';
      slider.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    };
    
    const onMouseUp = () => {
      isDown.current = false;
      slider.style.cursor = 'grab';
      slider.style.scrollSnapType = 'x mandatory';
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      e.preventDefault(); // Stop text selection
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5; // Scroll-fast multiplier
      slider.scrollLeft = scrollLeft.current - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    // Tagged 'black' so the main white area enforces a Black Logo
    <section 
      id="experience-section" 
      data-header-theme="black"
      ref={containerRef} 
      className="reveal-section pt-32 pb-10 bg-white overflow-hidden"
    >
      <div className="w-full flex flex-col items-center">
        
        {/* HEADER */}
        <h2 
          ref={titleRef}
          className="font-handwritten text-[32px] md:text-[40px] text-[#1a1a1a] mb-20 relative z-0 select-none leading-[1.1] text-center"
        >
          Our<br/>Experiences
        </h2>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 px-6">
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
          ref={scrollContainerRef}
          className="w-full flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-8 hide-scrollbar scroll-smooth cursor-grab"
          style={{ 
             touchAction: 'pan-y', // Allow vertical page scroll
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
             WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Hide Scrollbar */}
          <style>{`
             .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>

          {displayedItems.map((item) => (
              <div 
                key={item.id}
                className="experience-card w-[75vw] md:w-[25vw] max-w-[320px] flex flex-col gap-4 bg-white group select-none shrink-0 snap-center"
              >
                {/* 
                   Image Card Container 
                   Tagged 'white' so the logo turns WHITE when overlapping this dark image
                */}
                <div 
                    data-header-theme="white"
                    className="w-full aspect-square overflow-hidden rounded-[2px] relative shadow-sm"
                >
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
                        <div className="w-5 h-5 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center group-hover:border-white group-hover:bg-[#C00115] transition-all duration-300">
                            <ChevronRight size={10} className="text-[#1a1a1a] group-hover:text-white transition-colors" strokeWidth={2.5} />
                        </div>
                    </button>
                  </div>

                </div>
              </div>
          ))}
          
           {/* Spacer to allow last item to snap fully without hitting edge */}
           <div className="w-1 shrink-0" />
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
