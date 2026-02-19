import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../ContentContext';

// ---- Built-in SVG patterns (same 6 from the old SvgPatternSection) ----
// Each renders over a dark gradient background so it looks good on a hero
const BUILTIN_PATTERNS = [
    // 0: Diagonal Lines
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p0-${uid}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M 0 5 L 80 5 M 0 15 L 80 15 M 0 25 L 80 25 M 0 35 L 80 35 M 0 45 L 80 45 M 0 55 L 80 55 M 0 65 L 80 65 M 0 75 L 80 75" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p0-${uid})`} />
        </svg>
    ),
    // 1: Dots
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p1-${uid}`} x="10" y="10" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="#FECACA" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p1-${uid})`} />
        </svg>
    ),
    // 2: Zigzag
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p2-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0,10 L 10,0 M 10,20 L 20,10" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p2-${uid})`} />
        </svg>
    ),
    // 3: Circles
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p3-${uid}`} width="50" height="50" patternUnits="userSpaceOnUse">
                    <circle cx="25" cy="25" r="10" stroke="#FECACA" strokeWidth="1" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p3-${uid})`} />
        </svg>
    ),
    // 4: Triangles
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p4-${uid}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 15 30 L 30 0 Z" fill="rgba(254, 202, 202, 0.5)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p4-${uid})`} />
        </svg>
    ),
    // 5: Grid
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p5-${uid}`} width="25" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M 12.5 0 L 12.5 25 M 0 12.5 L 25 12.5" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p5-${uid})`} />
        </svg>
    ),
];

export const PATTERN_NAMES = [
    'Diagonal Lines',
    'Dots',
    'Zigzag',
    'Circles',
    'Triangles',
    'Diamond Grid',
];

interface SlideBackgroundProps {
    slide: {
        bgType?: 'image' | 'svg';
        bgImage?: string;
        svgPatternIndex?: number;
        customSvg?: string;
    };
    uid: string;
}

const SlideBackground: React.FC<SlideBackgroundProps> = ({ slide, uid }) => {
    const bgType = slide.bgType ?? (slide.bgImage ? 'image' : 'svg');

    if (bgType === 'image' && slide.bgImage) {
        return (
            <img src={slide.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        );
    }

    // SVG mode: dark base + pattern overlay
    const patternIdx = slide.svgPatternIndex ?? 0;
    const renderFn = BUILTIN_PATTERNS[patternIdx] ?? BUILTIN_PATTERNS[0];

    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {slide.customSvg
                ? <div className="absolute inset-0 w-full h-full" dangerouslySetInnerHTML={{ __html: slide.customSvg }} />
                : renderFn(uid)}
        </div>
    );
};

const PAGE_KEYS = ['home', 'shop', 'about', 'contact'];

interface HeroSectionProps {
    onNavigate?: (page: string) => void;
}

// Smart CTA: routes to in-app page or anchor
const CtaButton: React.FC<{
    label: string;
    href: string;
    primary: boolean;
    onNavigate?: (page: string) => void;
}> = ({ label, href, primary, onNavigate }) => {
    const baseStyle = primary
        ? 'inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-7 rounded-full transition-all duration-300 hover:scale-105 shadow-lg'
        : 'inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-7 rounded-full transition-all duration-300';

    if (PAGE_KEYS.includes(href)) {
        return (
            <button onClick={() => onNavigate?.(href)} className={baseStyle}>
                {label}{primary ? ' →' : ''}
            </button>
        );
    }
    return (
        <a href={href} className={baseStyle}>
            {label}{primary ? ' →' : ''}
        </a>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
    const { content } = useContent();
    const slides = content.heroSlides || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
        setCurrentIndex((i) => (i + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const id = setInterval(next, 7000); // 7 seconds
        return () => clearInterval(id);
    }, [slides.length, next]);

    if (slides.length === 0) return null;

    const slide = slides[currentIndex];

    // Radial Timer Component
    const RadialTimer = () => (
        <div className="relative w-12 h-12 transition-transform hover:scale-110">
            <svg className="w-full h-full transform -rotate-90">
                {/* Track - Light Red with opacity */}
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-white opacity-30"
                />
                {/* Progress - Primary Red */}
                <circle
                    key={currentIndex} // Force restart animation on slide change
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="125.6" // 2 * PI * r (2 * 3.14159 * 20 = 125.66)
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="text-red-600 animate-radial-progress drop-shadow-md"
                />
            </svg>
        </div>
    );

    return (
        <section
            className="relative h-screen w-full flex items-end overflow-hidden"
        >
            {/* Inline style for the radial animation */}
            <style>{`
                @keyframes radial-progress {
                    from { stroke-dashoffset: 125.6; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-radial-progress {
                    animation: radial-progress 7000ms linear forwards;
                }
            `}</style>

            {/* Background slides */}
            {slides.map((s, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <SlideBackground slide={s} uid={`slide-${i}`} />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/55" />
                </div>
            ))}

            {/* Radial Timer - Positioned Top Left */}
            {slides.length > 1 && (
                <div className="absolute top-8 left-8 z-30 pointer-events-none">
                    <RadialTimer />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pb-24 max-w-4xl">
                {slide.badge && (
                    <span className="inline-block mb-4 px-4 py-1 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-full">
                        {slide.badge}
                    </span>
                )}

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-2">
                    {slide.heading}
                    {slide.headingAccent && (
                        <>
                            <br />
                            <span className="text-red-500 italic">{slide.headingAccent}</span>
                        </>
                    )}
                </h1>

                {slide.subtext && (
                    <p className="mt-4 text-white/80 text-lg max-w-xl leading-relaxed">
                        {slide.subtext}
                    </p>
                )}

                <div className="mt-8 flex flex-wrap gap-4">
                    {slide.primaryCta && (
                        <CtaButton
                            label={slide.primaryCta.label}
                            href={slide.primaryCta.href}
                            primary={true}
                            onNavigate={onNavigate}
                        />
                    )}
                    {slide.secondaryCta && (
                        <CtaButton
                            label={slide.secondaryCta.label}
                            href={slide.secondaryCta.href}
                            primary={false}
                            onNavigate={onNavigate}
                        />
                    )}
                </div>
            </div>

            {/* Slide indicators (dots) - Bottom Right */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-red-500 w-6' : 'bg-white/50 hover:bg-white'}`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;