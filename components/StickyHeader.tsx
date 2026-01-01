
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StickyHeaderProps {
  theme?: 'light' | 'dark';
}

// --- DATA ---
const RAW_BOTTLE_URLS = [
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/moet-imperial.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/moet-imperial-rose.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/ice-imperial.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/ice-imperial-rose.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/reserve-imperiale.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/nectar-imperial.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/nectar-imperial-rose.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/GRAND_VINTAGE_2016.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/GRAND_VINTAGE_ROSE_2016.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/grand-vintage-collection-2000.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/grand-vintage-collection-2009.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/moet-collection-imperiale-01.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/Moet_Impe%CC%81rial_Red_Limited_Edition.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/brut-imperial-bow-creation-pharrel.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/grand-vintage-limited-edition-bow-2003.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/limited-edition-brut-imperial-gold.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/limited-edition-brut-imperial-red.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/limited-edition-brut-imperial.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/limited-edition-nectar-imperial-rose.avif?raw=true",
  "https://github.com/marcelorm81/assets/blob/6faacf38f4b6ff818cb603e16ae7cf9cdb9ccb70/limited-edition-rose-bow-creation.avif?raw=true"
];

const formatBottleName = (url: string) => {
  try {
    let filename = url.split('/').pop()?.split('?')[0] || "";
    filename = decodeURIComponent(filename);
    const nameWithoutExt = filename.replace(/\.(avif|png|jpg|jpeg)/i, "");
    return nameWithoutExt.replace(/[-_]/g, " ").toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } catch (e) { return "Moët Bottle"; }
};

const CHAMPAGNE_LIST = RAW_BOTTLE_URLS.map(url => ({ name: formatBottleName(url), image: url }));

const MENU_DATA = {
  main: [
    { label: "OUR CHAMPAGNES", key: "champagnes" },
    { label: "EXPERIENCES", key: "experiences" },
    { label: "MOËT RITUALS", key: "rituals" },
    { label: "MAISON DE JOI", key: "joy" },
    { label: "FIND US", key: "find" }
  ],
  submenus: {
    champagnes: { title: "OUR CHAMPAGNES", layout: 'bottles', items: ["Brut & Rosé", "Fresh & Sweet", "Vintages", "Limited Editions"] },
    joy: { title: "MAISON DE JOI", layout: 'list_card', items: ["ABOUT US", "CRAFT & HERITAGE", "INSIDE MOËT", "OUR COMMITMENTS"], card: { subtitle: "INSIDE MOËT", title: "Gesture that became\na global icon", image: "https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/f1.jpg" } },
    experiences: { title: "EXPERIENCES", layout: 'list_card', items: ["TOURS", "DINING", "BARS"], card: { subtitle: "GUIDED CELLAR TOUR", title: "A timeless introduction\nto Moët & Chandon", image: "https://raw.githubusercontent.com/marcelorm81/assets/db2c7a658ac0e7dc017babe421f0e85c999477f2/experience.jpg" } },
    rituals: { title: "MOËT RITUALS", layout: 'list_card', items: ["HOW TO SERVE", "FOOD PAIRINGS", "COCKTAILS"], card: { subtitle: "OUR COCKTAILS", title: "Try the Impérial 1869:\nfresh citrus, floral lift, pure Moët.", image: "https://github.com/marcelorm81/assets/blob/b227c8555c849f2ffd6d7b53a27b819ddb0f0531/cocktail.avif?raw=true" } },
    find: { title: "FIND US", layout: 'list_card', items: ["OUR BARS", "OUR PARTNERS", "FIND BY PRODUCT"], card: { subtitle: "VISIT US", title: "Experience the magic\nin person", image: "https://raw.githubusercontent.com/marcelorm81/assets/refs/heads/main/Galerie-Imperiale_Copyright-James-Bort-for-Moet-Chandon-(1).avif" } }
  }
};

const StickyHeader: React.FC<StickyHeaderProps> = ({ theme = 'light' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<keyof typeof MENU_DATA['submenus'] | null>(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  // Refs
  const headerRootRef = useRef<HTMLDivElement>(null); // The fixed root
  const headerContentRef = useRef<HTMLDivElement>(null); // The inner wrapper (constrained width)
  
  const svgRef = useRef<SVGSVGElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuListRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const bottleThemeRef = useRef(theme);
  const isMenuOpenRef = useRef(isMenuOpen);

  useEffect(() => {
    bottleThemeRef.current = theme;
  }, [theme]);

  // --- 1. SENSOR ARCHITECTURE LOOP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {});
    
    const updateHeaderColor = () => {
        if (!headerRootRef.current) return;

        let targetColor = '#FFFBF7'; 
        let glassOpacity = 0;

        if (isMenuOpenRef.current) {
            targetColor = '#1a1a1a';
            glassOpacity = 0;
        } else {
            // SENSOR PROBE
            const x = window.innerWidth / 2;
            const y = 60; 
            
            // PIERCING LOGIC:
            // Get all elements at the probe point.
            const elements = document.elementsFromPoint(x, y);
            
            // Filter out the header itself (wrapper, svg, glass, etc.)
            // We want the first element that is NOT contained within the headerRootRef.
            const targetEl = elements.find(el => !headerRootRef.current?.contains(el));
            
            // Find the closest theme attribute on that valid target element
            const sectionTheme = targetEl?.closest('[data-header-theme]')?.getAttribute('data-header-theme');

            if (sectionTheme === 'black') {
                targetColor = '#1a1a1a';
                glassOpacity = 0; 
            } else if (sectionTheme === 'white') {
                targetColor = '#FFFBF7';
                glassOpacity = 0;
            } else {
                // FALLBACK (Hero or Gaps):
                // If no theme is found (e.g. video section, hero), fallback to Bottle Theme.
                if (bottleThemeRef.current === 'dark') {
                    targetColor = '#1a1a1a';
                    glassOpacity = 0.4;
                } else {
                    targetColor = '#FFFBF7';
                    glassOpacity = 0;
                }
            }
        }

        // Apply to CSS variables on the header container
        // IMPORTANT: Removed 'overwrite: auto' to prevent conflict with the Footer scroll animation
        gsap.to(headerRootRef.current, {
            '--logo-color': targetColor,
            '--glass-opacity': glassOpacity,
            duration: 0.4,
        });
    };

    gsap.ticker.add(updateHeaderColor);
    return () => {
        gsap.ticker.remove(updateHeaderColor);
        ctx.revert();
    };
  }, []);

  // --- 2. HERO SYNC ANIMATION & FOOTER HIDE ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // --- A. Shrink Animation ---
        const finalLogoTop = 'calc(45px + env(safe-area-inset-top))'; 
        const logoLeft = '30px'; 
        const initialScale = 3.1; 
        const finalScale = 0.85;   
        
        // Initial State - Use safe-area-inset-top for initial positioning
        const initialTop = 'calc(15% + env(safe-area-inset-top, 0px))';
        gsap.set(svgRef.current, { position: 'absolute', top: initialTop, left: logoLeft, x: 0, xPercent: 0, scale: initialScale, width: '318px', transformOrigin: 'left center', zIndex: 50 });
        gsap.set('#amp, #chandon', { opacity: 0, x: 15 });
        gsap.set(glassRef.current, { opacity: 0 });
        gsap.set(menuIconRef.current, { opacity: 0, scale: 0.5, right: '15px', top: finalLogoTop, position: 'absolute', zIndex: 50 });

        // Timeline linked to the pinned hero
        const shrinkTl = gsap.timeline({ 
            scrollTrigger: { 
                trigger: '#pinned-hero-trigger', 
                start: 'top top', 
                end: '+=100%', 
                scrub: 1, // Smooth scrubbing
                anticipatePin: 1 
            } 
        });
        
        shrinkTl.to(svgRef.current, { top: finalLogoTop, scale: finalScale, duration: 0.8, ease: 'power2.inOut' }, 0);
        shrinkTl.to('#amp', { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out' }, 0.1);
        shrinkTl.to('#chandon', { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out' }, 0.2);
        shrinkTl.to(menuIconRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 0.8);
        shrinkTl.to(glassRef.current, { opacity: 1, duration: 0.5 }, 0.5);

        // --- B. Footer Hide Logic (Updated) ---
        // Moves the entire header up out of view as soon as footer enters viewport
        const footer = document.querySelector('#main-footer');
        if (footer) {
            ScrollTrigger.create({
                trigger: footer,
                // CRITICAL FIX: refreshPriority: -1 ensures this is calculated LAST.
                // This waits for the F1 section (and any other pinned sections) to finish adding their
                // spacers to the DOM before calculating where the footer actually starts.
                refreshPriority: -1,
                
                // Start: When footer is 5% into the viewport (bottom) to ensure visual transition.
                start: 'top 95%', 
                // End: By the time footer is 30% into the screen (header fully hidden before content).
                end: 'top 70%',
                scrub: 1,
                animation: gsap.fromTo(headerRootRef.current, 
                    { y: 0 }, 
                    { y: -200, ease: 'none', immediateRender: false } 
                )
            });
        }
    }, headerRootRef);

    return () => ctx.revert();
  }, []);

  // --- 3. MENU LOGIC ---
  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
    const tl = gsap.timeline();
    if (isMenuOpen) {
        setActiveSubmenu(null); setIsNavigatingBack(false);
        gsap.set(menuOverlayRef.current, { visibility: 'visible' });
        // Hide glass when menu opens to prevent white fade - use CSS variable instead of opacity
        if (glassRef.current) {
            gsap.set(headerRootRef.current, { '--glass-opacity': 0 });
        }
        tl.to(menuOverlayRef.current, { clipPath: 'circle(150% at 90% 5%)', duration: 0.8, ease: 'power3.inOut' }, 0);
        if (menuIconRef.current) tl.to(menuIconRef.current.querySelector('.dots-container'), { rotate: 45, gap: '5px', duration: 0.5, ease: 'back.out(1.7)' }, 0.1);
        document.body.style.overflow = 'hidden';
    } else {
        if (menuListRef.current) tl.to(menuListRef.current.children, { opacity: 0, y: -10, duration: 0.2, }, 0);
        // Keep glass hidden during menu close animation to prevent white fade - use CSS variable
        if (glassRef.current) {
            gsap.set(headerRootRef.current, { '--glass-opacity': 0 });
        }
        tl.to(menuOverlayRef.current, { clipPath: 'circle(0% at 90% 5%)', duration: 0.8, ease: 'power3.inOut', onComplete: () => { 
            gsap.set(menuOverlayRef.current, { visibility: 'hidden' });
            // Let sensor logic restore glass opacity after menu closes
        } }, 0.2);
        if (menuIconRef.current) tl.to(menuIconRef.current.querySelector('.dots-container'), { rotate: 0, gap: '5px', duration: 0.5, ease: 'power2.inOut' }, 0);
        document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    if (!isMenuOpen || !menuListRef.current) return;
    const children = menuListRef.current.children; if (children.length === 0) return;
    let fromVars: any = { opacity: 0 }; let toVars: any = { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.04 };
    if (activeSubmenu === null && !isNavigatingBack) { fromVars.y = 30; toVars.y = 0; toVars.delay = 0.3; } 
    else { fromVars.x = isNavigatingBack ? -20 : 20; toVars.x = 0; toVars.delay = 0; }
    gsap.fromTo(children, fromVars, toVars);
  }, [activeSubmenu, isMenuOpen, isNavigatingBack]);

  const handleSubmenuClick = (key: string) => { if (!menuListRef.current) return; gsap.to(menuListRef.current.children, { x: -20, opacity: 0, duration: 0.3, stagger: 0.02, ease: 'power2.in', onComplete: () => { setIsNavigatingBack(false); setActiveSubmenu(key as any); } }); };
  const handleBackClick = () => { if (!menuListRef.current) return; gsap.to(menuListRef.current.children, { x: 20, opacity: 0, duration: 0.3, stagger: 0.02, ease: 'power2.in', onComplete: () => { setIsNavigatingBack(true); setActiveSubmenu(null); } }); };
  
  // Carousel logic
  useEffect(() => {
    if (activeSubmenu !== 'champagnes' || !carouselContainerRef.current) return;
    const container = carouselContainerRef.current; container.scrollLeft = 0;
    let targetScroll = 0; let currentScroll = 0; let isDragging = false; let startX = 0; let startScroll = 0; let velocity = 0; let lastX = 0; let animationFrameId: number;
    const updatePhysics = () => {
        if (!isDragging) { targetScroll += velocity; velocity *= 0.95; }
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (targetScroll < 0) { targetScroll = 0; velocity = 0; } else if (targetScroll > maxScroll) { targetScroll = maxScroll; velocity = 0; }
        currentScroll += (targetScroll - currentScroll) * 0.08; 
        if (Math.abs(targetScroll - currentScroll) > 0.1 || Math.abs(velocity) > 0.1) { container.scrollLeft = currentScroll; }
        animationFrameId = requestAnimationFrame(updatePhysics);
    };
    updatePhysics();
    const onMouseDown = (e: MouseEvent | TouchEvent) => { isDragging = true; const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX; startX = pageX; lastX = pageX; startScroll = targetScroll; velocity = 0; container.style.cursor = 'grabbing'; };
    const onMouseMove = (e: MouseEvent | TouchEvent) => { if (!isDragging) return; if (e.cancelable) e.preventDefault(); const pageX = 'touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX; const delta = pageX - startX; targetScroll = startScroll - delta * 1.2; velocity = -(pageX - lastX) * 1.2; lastX = pageX; };
    const onMouseUp = () => { isDragging = false; container.style.cursor = 'grab'; };
    container.addEventListener('mousedown', onMouseDown); container.addEventListener('touchstart', onMouseDown, { passive: false });
    window.addEventListener('mousemove', onMouseMove); window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp); window.addEventListener('touchend', onMouseUp);
    return () => { cancelAnimationFrame(animationFrameId); container.removeEventListener('mousedown', onMouseDown); container.removeEventListener('touchstart', onMouseDown); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('touchmove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); window.removeEventListener('touchend', onMouseUp); };
  }, [activeSubmenu]);
  
  return (
    // ROOT FIXED CONTAINER: Centered horizontally
    <div ref={headerRootRef} className="fixed top-0 left-0 w-full h-0 z-50 pointer-events-none flex justify-center">
      
      {/* MENU OVERLAY - Full screen, breaks out of constraint */}
      <div ref={menuOverlayRef} className="fixed top-0 left-0 w-screen h-[100dvh] bg-[#FFFBF7] z-40 flex flex-col justify-start px-[30px] pointer-events-auto" 
              style={{ 
                  clipPath: 'circle(0% at 90% 5%)', 
                  visibility: 'hidden',
                  paddingTop: 'calc(115px + env(safe-area-inset-top))',
                  paddingLeft: 'max(30px, env(safe-area-inset-left, 0px) + 30px)',
                  paddingRight: 'max(30px, env(safe-area-inset-right, 0px) + 30px)',
                  width: '100vw',
                  left: 0,
                  right: 0
              }}>
      
      {/* 
         INNER CONSTRAINT WRAPPER:
         Ensures logo respects the desktop max-width (393px equivalent scale).
         We apply the CSS max-width calculation inline to ensure it matches exactly what index.html uses.
      */}
      <div 
        ref={headerContentRef}
        className="w-full h-full relative"
        style={{ maxWidth: 'calc(100vh * (393 / 769))' }} // Matches .desktop-constraint in index.html
      >
        
                {/* Menu List Content */}
                <div ref={menuListRef} className="flex flex-col w-full h-full pb-10">
                    {activeSubmenu === null ? (
                        <>
                        <div className="flex flex-col gap-5">
                            {MENU_DATA.main.map((item) => (
                                <div key={item.key} onClick={() => handleSubmenuClick(item.key)} className="flex items-center justify-between group cursor-pointer w-full py-2">
                                    <span className="font-trenda font-semibold text-[14px] leading-none text-[#1a1a1a] uppercase tracking-wide group-hover:opacity-60 transition-opacity">{item.label}</span>
                                    <ChevronRight size={16} className="text-[#1a1a1a]" strokeWidth={2} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto w-full flex items-center justify-between pb-6">
                            <button className="flex items-center gap-2 group hover:opacity-70 transition-opacity"><span className="font-trenda text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a]">Newsletter</span><ChevronRight size={10} className="text-[#C00115] stroke-[3]" /></button>
                            <button className="flex items-center gap-2 group hover:opacity-70 transition-opacity"><span className="font-trenda text-[12px] font-medium uppercase tracking-wide text-[#1a1a1a]">English</span><ChevronRight size={10} className="text-[#C00115] stroke-[3]" /></button>
                        </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full relative">
                            <div className="flex items-center justify-between mb-6 shrink-0 z-30">
                                <h3 className="font-trenda text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wide">{MENU_DATA.submenus[activeSubmenu].title}</h3>
                                <div className="flex items-center gap-1 cursor-pointer group" onClick={handleBackClick}>
                                    <ChevronLeft size={10} className="text-[#C00115] stroke-[3]" />
                                    <span className="text-[#C00115] text-[10px] tracking-[0.15em] uppercase font-bold font-trenda">Back</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 mb-auto shrink-0 z-30 pointer-events-none">
                                {MENU_DATA.submenus[activeSubmenu].items.map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer pointer-events-auto w-fit">
                                        <span className="font-trenda font-normal text-[12px] text-[#1a1a1a] uppercase tracking-wide group-hover:opacity-60 transition-opacity">{item}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Submenu Visuals */}
                            <div className="absolute bottom-0 left-[-30px] w-[calc(100%+60px)] h-[80vh] flex flex-col justify-end z-10 pointer-events-auto">
                                {MENU_DATA.submenus[activeSubmenu].layout === 'bottles' ? (
                                    <div ref={carouselContainerRef} className="w-full h-full overflow-x-auto overflow-y-hidden cursor-grab [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        <div ref={carouselTrackRef} className="flex items-end h-full px-[30px] pt-20 pb-1">
                                            {CHAMPAGNE_LIST.map((bottle, i) => (
                                                <div key={i} className="relative flex flex-col items-center justify-end shrink-0 w-[180px] h-full mx-2">
                                                    <img src={bottle.image} alt={bottle.name} className="h-auto max-h-[55vh] w-auto object-contain drop-shadow-xl pointer-events-none transition-transform duration-300 hover:scale-105" />
                                                    <p className="mt-4 text-center font-trenda text-[10px] font-normal tracking-[0.05em] text-[#1a1a1a] max-w-[150px] leading-tight">{bottle.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    MENU_DATA.submenus[activeSubmenu].card && (
                                    <div className="w-full px-[30px] pb-2">
                                        <div className="w-full h-[180px] rounded-sm overflow-hidden mb-4">
                                            <img src={MENU_DATA.submenus[activeSubmenu].card?.image} alt="Feature" className="w-full h-full object-cover"/>
                                        </div>
                                        <span className="text-[#C00115] text-[9px] font-bold tracking-[0.15em] uppercase block mb-1">{MENU_DATA.submenus[activeSubmenu].card?.subtitle}</span>
                                        <p className="text-[#1a1a1a] text-[15px] font-normal leading-[1.3] font-trenda">{MENU_DATA.submenus[activeSubmenu].card?.title}</p>
                                    </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
          </div>

          {/* HEADER VISUALS (GLASS & LOGO) */}
          <div className="relative w-full h-screen z-50 overflow-hidden pointer-events-none">
                {/* Glass Background - separate layer */}
                <div ref={glassRef} className="header-glass absolute top-0 left-0 w-full" 
                      style={{ 
                          position: 'absolute',
                          height: 'calc(160px + env(safe-area-inset-top))',
                          opacity: 1, // Always visible, opacity controlled by CSS variable
                      }} />
                
                {/* Logo SVG - always visible, independent of glass */}
                <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width="318" height="34" viewBox="0 0 318 34" fill="none" className="pointer-events-auto overflow-visible transition-colors" style={{ opacity: 1, visibility: 'visible' }}>
                    <g id="moet">
                      <path d="M25.4569 9.8501L28.1813 7.14246C27.0355 7.14246 23.3496 7.14246 21.3223 7.13435C18.9986 12.5091 15.9056 19.4647 15.2485 20.8995L8.86226 7.11814H1.89905L4.63145 9.88253C4.63145 9.88253 2.66829 28.7225 2.54810 30.2142L0 32.7029H7.04333L4.39106 30.1088L6.26608 12.1443L14.1107 27.8389C14.6556 26.5986 20.9697 12.4118 21.3063 11.6011C21.3864 12.3308 23.8383 29.6143 23.8864 30.2628L21.4906 32.711H30.9378L28.3256 30.1007C28.2855 29.5332 25.5691 11.0418 25.4569 9.8501Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M43.6465 6.60738C37.2442 6.60738 32.0599 12.4685 32.0599 19.8537C32.0599 27.239 37.2522 33.2136 43.6465 33.2136C50.0408 33.2136 55.2412 27.2309 55.2412 19.8537C55.2412 12.4766 50.0488 6.60738 43.6465 6.60738ZM43.6706 31.4788C39.568 31.4788 36.8356 26.4769 36.8356 19.8862C36.8356 13.2954 39.568 8.41517 43.6706 8.41517C47.7731 8.41517 50.5055 13.2954 50.5055 19.8862C50.5055 26.4769 47.7731 31.4788 43.6706 31.4788Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M80.0878 7.12591L78.9339 12.2575L82.3394 8.86074H88.4692V29.9058L85.6487 32.7026H95.6488L93.0206 30.1003V8.86074H99.1744L102.564 12.2575L101.402 7.12591H80.0878Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M64.607 30.9679V19.9996H68.4852L70.7449 22.2694L70.7289 16.0597L68.4852 18.2971H64.607V8.86094H72.2433L75.6327 12.2576L74.4629 7.1261H57.3153L60.0557 9.84995V30.1005L57.4515 32.7028H75.3843L76.8347 26.6876L72.4516 30.9679H64.607Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M62.6137 4.42626C63.8557 4.42626 64.8653 3.43725 64.8653 2.21313C64.8653 0.989019 63.8557 0 62.6137 0C61.3717 0 60.3621 0.989019 60.3621 2.21313C60.3621 3.43725 61.3717 4.42626 62.6137 4.42626Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M70.5862 4.42626C71.8282 4.42626 72.8298 3.43725 72.8298 2.21313C72.8298 0.989019 71.8202 0 70.5862 0C69.3522 0 68.3346 0.989019 68.3346 2.21313C68.3346 3.43725 69.3442 4.42626 70.5862 4.42626Z" style={{ fill: 'var(--logo-color)' }} />
                    </g>
                    <g id="amp">
                      <path d="M130.425 21.1833L132.821 18.8242H126.955L129.007 21.1428C128.863 22.1885 128.654 23.137 128.406 24.0044L121.098 16.8948C123.262 15.46 125.457 13.9521 125.449 11.1715C125.449 8.43144 123.069 6.44529 119.8 6.4534C116.386 6.4534 113.814 8.71517 113.814 11.7065C113.814 13.4819 114.015 15.4194 117.092 18.4351C114.335 20.251 111.026 22.529 111.042 26.5905C111.05 30.4574 114.552 33.2055 118.806 33.4406C123.566 33.7001 126.234 31.5275 127.917 28.9657L133.085 34V28.5685L129.616 25.188C130.016 23.8342 130.265 22.456 130.425 21.1914V21.1833ZM117.052 10.0204C117.332 8.30984 118.542 7.47484 119.624 7.4181C121.298 7.32892 122.268 8.91784 122.268 11.4471C122.268 13.4576 121.731 14.7385 120.273 16.1004C116.907 13.2144 116.803 11.5039 117.052 10.0285V10.0204ZM119.776 30.9843C116.859 30.6276 114.792 28.7631 114.784 25.261C114.784 22.9343 115.609 21.313 117.837 19.3512L117.949 19.262L126.699 27.774C124.912 30.3682 122.388 31.3005 119.776 30.9843Z" style={{ fill: 'var(--logo-color)' }} />
                    </g>
                    <g id="chandon">
                      <path d="M251.694 7.12591H242.847L245.588 9.84976L245.636 30.1003L243.04 32.7107L252.864 32.6945C260.86 32.6783 265.324 27.0279 265.308 19.4968C265.292 11.463 259.466 7.1178 251.694 7.13402V7.12591ZM252.391 31.0245C250.299 31.0245 250.187 30.9272 250.187 30.9272L250.139 8.83642C250.139 8.83642 250.163 8.79589 250.892 8.78778C256.517 8.77157 260.348 12.7844 260.364 19.7318C260.38 26.2983 257.487 31.0245 252.391 31.0245Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M232.556 7.12591L235.296 9.84976L235.328 24.8634L221.61 7.13402H214.903C214.903 7.13402 217.051 9.14448 218.157 10.3767L218.197 30.1003L215.584 32.7107H222.956L220.344 30.1003L220.304 12.8817L235.641 32.711H237.444L237.395 9.85787L240.128 7.13402H232.548L232.556 7.12591Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M189.097 7.12591H179.025L181.75 9.84976V18.8239H171.974V9.84976L174.738 7.12591H164.658L167.383 9.84976V30.1328L164.786 32.7026H174.578L171.974 30.1003V20.6074H181.75V30.1246L179.145 32.7026H188.945L186.349 30.1003V9.84976L189.097 7.12591Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M280.123 6.60738C273.721 6.60738 268.537 12.4685 268.537 19.8537C268.537 27.239 273.729 33.2136 280.123 33.2136C286.518 33.2136 291.718 27.2309 291.718 19.8537C291.718 12.4766 286.526 6.60738 280.123 6.60738ZM280.147 31.4788C276.045 31.4788 273.312 26.4769 273.312 19.8862C273.312 13.2954 276.045 8.41517 280.147 8.41517C284.25 8.41517 286.982 13.2954 286.982 19.8862C286.982 26.4769 284.25 31.4788 280.147 31.4788Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M317.992 7.12591H310.412L313.152 9.84996L313.184 24.8634L299.466 7.13402H292.174C292.174 7.13402 294.907 9.14448 296.02 10.3767L296.061 30.1003L293.448 32.7107H300.82L298.208 30.1003L298.168 12.8817L313.505 32.7107H315.307L315.259 9.85787L317.992 7.13402V7.12591Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M146.613 20.6641C146.14 14.1301 147.863 9.48496 151.517 8.84453C151.837 8.78778 152.11 8.73914 152.679 8.73914C156.485 8.77968 159.482 12.2331 160.427 13.9112L160.379 7.12591H153.039C146.725 7.12591 141.597 12.4844 141.597 19.821C141.597 27.1657 146.14 33.116 152.855 33.116C157.911 33.116 160.219 30.4732 161.773 27.5305C161.773 27.5305 159.177 29.7842 155.499 30.1328C151.044 30.5543 147.126 27.7494 146.613 20.6641Z" style={{ fill: 'var(--logo-color)' }} />
                      <path d="M202.637 6.62363H201.491L193.142 30.0926L190.506 32.7029H197.685L195.057 30.0926L197.629 22.756L204.176 22.7884L206.996 30.0926L204.376 32.7029H214.416L211.788 30.0926L202.629 6.62363H202.637ZM198.054 21.5075L200.73 13.9116L203.687 21.5075H198.054Z" style={{ fill: 'var(--logo-color)' }} />
                    </g>
                </svg>
                
                {/* Menu Button */}
                <div ref={menuIconRef} onClick={() => setIsMenuOpen(!isMenuOpen)} className="pointer-events-auto cursor-pointer p-4 z-50 group absolute">
                  <div className="dots-container flex flex-col gap-[5px] items-center origin-center">
                    <div className="menu-dot w-[5px] h-[5px] rounded-full transition-colors" style={{ backgroundColor: 'var(--logo-color)' }} />
                    <div className="menu-dot w-[5px] h-[5px] rounded-full transition-colors" style={{ backgroundColor: 'var(--logo-color)' }} />
                  </div>
                </div>
          </div>
      </div>
    </div>
  );
};

export default StickyHeader;
