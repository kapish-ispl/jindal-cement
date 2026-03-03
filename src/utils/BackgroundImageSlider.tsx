'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedCountUp from '@/components/AnimatedCountUp';

gsap.registerPlugin(ScrollTrigger);

// --- Data structure remains the same ---
const slidesData = [
    // --- Steel Group ---
    {
        groupName: 'Steel',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759858408_Group1441.jpg',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Steel Slide 1: Raw Materials',
        description: 'Excellence in every particle.',
        statValue: 13.5,
        statUnit: 'MTPA',
        statLabel: 'Global Steel Making Capacity',
    },
    {
        groupName: 'Steel',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle546.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Steel Slide 2: Production Line',
        description: 'Forging the future of steel.',
        statValue: 98,
        statUnit: '% Purity',
        statLabel: 'Achieved in Production',
    },
    {
        groupName: 'Steel',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle540.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Steel Slide 3: Final Product',
        description: 'Delivering strength and quality.',
        statValue: 500,
        statUnit: '+ Grades',
        statLabel: 'Of High-Strength Steel',
    },
    // --- Infra Group ---
    {
        groupName: 'Infra',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle545.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Infra Slide 1: Bridge Construction',
        description: 'Connecting communities.',
        statValue: 50,
        statUnit: '+ Projects',
        statLabel: 'Major Infrastructure Projects',
    },
    {
        groupName: 'Infra',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830750_Rectangle542.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Infra Slide 2: Urban Development',
        description: 'Building cities of tomorrow.',
        statValue: 12,
        statUnit: 'Smart Cities',
        statLabel: 'Currently in Development',
    },
    // --- Energy Group ---
    {
        groupName: 'Energy',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle540.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Energy Slide 1: Power Grid',
        description: 'Sustainable energy solutions.',
        statValue: 3400,
        statUnit: 'MW',
        statLabel: 'Installed Power Capacity',
    },
    // --- Resources Group ---
    {
        groupName: 'Resources',
        imageSrc: 'https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle540.png',
        logoSrc: '/images/logo/jindal-steel-logo-black.svg',
        title: 'Resources Slide 1: Mining Ops',
        description: 'Sourcing the future.',
        statValue: 10,
        statUnit: '+ Countries',
        statLabel: 'Operational Presence',
    },
];

const orderedGroupNames = Array.from(new Set(slidesData.map(s => s.groupName)));

interface DotButtonProps {
    selected: boolean;
    onClick: () => void;
}

const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
    <button
        className={`dot ${selected ? 'active' : ''}`}
        type="button"
        onClick={onClick}
        aria-label="Go to slide"
    />
);
const InteractiveSlider: React.FC = () => {
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    // Single Embla instance for the combined carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    // Syncs the browser's scrollbar to the carousel's position
    const syncScrollTrigger = useCallback((slideIndex: number) => {
        if (!scrollTriggerRef.current) return;
        const trigger = scrollTriggerRef.current;
        const progress = slideIndex / (slidesData.length - 1);
        const targetScrollY = trigger.start + progress * (trigger.end - trigger.start);
        window.scrollTo({ top: targetScrollY, behavior: 'auto' });
    }, []);

    // Handles clicking on the top tabs
    const onTabClick = useCallback((groupName: string) => {
        const firstSlideInGroupIndex = slidesData.findIndex(s => s.groupName === groupName);
        if (firstSlideInGroupIndex === -1 || !emblaApi) return;

        emblaApi.scrollTo(firstSlideInGroupIndex);
        syncScrollTrigger(firstSlideInGroupIndex);
    }, [emblaApi, syncScrollTrigger]);

    // Updates the active index state when the carousel settles on a new slide
    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };
        emblaApi.on('select', onSelect);
        onSelect(); // Set initial index
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    // Main GSAP ScrollTrigger setup for pinning and scroll-based control
    useGSAP(() => {
        if (!emblaApi) return;
        const numSlides = slidesData.length;
        const tween = gsap.to({}, {
            scrollTrigger: {
                trigger: pinContainerRef.current,
                pin: true,
                start: '-=130px top',
                end: `+=${(numSlides - 1) * 300}`,
                snap: { snapTo: 1 / (numSlides - 1), duration: 0.2, ease: 'power1.inOut' },
                onUpdate: (self) => {
                    const slideIndex = Math.round(self.progress * (numSlides - 1));
                    if (emblaApi.selectedScrollSnap() !== slideIndex) {
                        emblaApi.scrollTo(slideIndex);
                    }
                },
            },
        });
        scrollTriggerRef.current = tween.scrollTrigger!;
        return () => { tween.kill(); scrollTriggerRef.current?.kill(); };
    }, { scope: pinContainerRef, dependencies: [emblaApi] });

    // Animates the content of the active slide into view
    useEffect(() => {
        if (!emblaApi) return;
        const allContent = gsap.utils.toArray('.anim-content-wrapper');
        const activeContent = allContent[selectedIndex];

        gsap.set(allContent, { opacity: 0, x: 60 });

        if (activeContent) {
            gsap.to(activeContent, { // Animate in the active one
                opacity: 1,
                x: 0,
                delay: 0.5,
                duration: 0.7,
                ease: 'power2.out',
            });
        }
    }, [selectedIndex, emblaApi]);

    // Handles clicking on the navigation dots
    const onDotClick = useCallback((index: number) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
        syncScrollTrigger(index);
    }, [emblaApi, syncScrollTrigger]);

    // Calculations for the navigation dots
    const activeGroupName = slidesData[selectedIndex]?.groupName;
    const { currentGroupSlides, groupStartIndex, localSelectedIndex } = useMemo(() => {
        if (!activeGroupName) return { currentGroupSlides: [], groupStartIndex: 0, localSelectedIndex: 0 };
        const currentSlides = slidesData.filter(s => s.groupName === activeGroupName);
        const startIndex = slidesData.findIndex(s => s.groupName === activeGroupName);
        const localIndex = selectedIndex - startIndex;
        return { currentGroupSlides: currentSlides, groupStartIndex: startIndex, localSelectedIndex: localIndex };
    }, [selectedIndex, activeGroupName]);

    return (
        <>
            <section ref={pinContainerRef} className="slider-section">
                <div className="slider-wrapper">
                    <div className="tabView">
                        {orderedGroupNames.map((groupName) => (
                            <div
                                key={groupName}
                                onClick={() => onTabClick(groupName)}
                                className={`tabView__item ${activeGroupName === groupName ? 'active' : ''}`}
                            >
                                <span className='tabView__item-link'>{groupName}</span>
                            </div>
                        ))}
                    </div>

                    <div className="tabContent">
                        <div className="embla" ref={emblaRef}>
                            <div className="embla__container">
                                {slidesData.map((slide, index) => (
                                    <div className="embla__slide embla__slide--composite" key={index}>
                                        {/* --- Content part of the slide --- */}
                                        <div className="composite-slide__content">
                                            <div className="tabContent__ls anim-content-wrapper">
                                                <div className="logo">
                                                    <img src={slide.logoSrc} alt={`${slide.groupName} logo`} className="img-fluid u-img" />
                                                </div>
                                                <div className="genric__content">
                                                    <p className="c-content-24 ft_light clr-gray">
                                                        {slide.title}<br />{slide.description}
                                                    </p>
                                                </div>
                                                <div className="listView">
                                                    <div className="listView__item">
                                                        <div className="listView__item-info">
                                                            <div className="title clr-gray c-content-32 ft_bold">
                                                                <AnimatedCountUp key={index} to={slide.statValue} />
                                                                &nbsp;&nbsp;{slide.statUnit}
                                                            </div>
                                                            <div className="desc clr-gray c-content-19">{slide.statLabel}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="action-btn mt-30"><a className="u-btn clr-green" href="#"><span
                                                    className="icon-move-right icon"></span></a></div>
                                            </div>
                                        </div>
                                        {/* --- Image part of the slide --- */}
                                        <div className="composite-slide__image">
                                            <div className="cus-shadow ratio ratio-16x9">
                                                <img src={slide.imageSrc} className='img-fluid' alt={`Slide ${index + 1}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="navigation-container text-end mt-3">
                        <div className="group-container nav-dots">
                            {currentGroupSlides.map((_, index) => (
                                <DotButton
                                    key={`group-dot-${index}`}
                                    selected={index === localSelectedIndex}
                                    onClick={() => onDotClick(groupStartIndex + index)}
                                />
                            ))}
                        </div>
                        <div className="nav-dots">
                            {slidesData.map((_, index) => (
                                <DotButton
                                    key={`global-dot-${index}`}
                                    selected={index === selectedIndex}
                                    onClick={() => onDotClick(index)}
                                />
                            ))}
                        </div>
                        <span onClick={() => onDotClick(slidesData.length - 1)} className='cursor-pointer'>
                            <svg width="30" height="47" viewBox="0 0 30 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 36L15.5999 41.736C15.2686 42.088 14.7314 42.088 14.4001 41.736L9 36" stroke="#A1A1A1" strokeLinecap="round" />
                                <path d="M21 40L15.5999 45.736C15.2686 46.088 14.7314 46.088 14.4001 45.736L9 40" stroke="#A1A1A1" strokeLinecap="round" />
                                <circle cx="15" cy="15" r="14.5" stroke="#A1A1A1" />
                                <path d="M15 0.5C16.6233 0.5 18.2487 1.92945 19.4971 4.60449C20.7265 7.23902 21.5 10.9141 21.5 15C21.5 19.0859 20.7265 22.761 19.4971 25.3955C18.2487 28.0705 16.6233 29.5 15 29.5C13.3767 29.5 11.7513 28.0705 10.5029 25.3955C9.27349 22.761 8.5 19.0859 8.5 15C8.5 10.9141 9.27349 7.23902 10.5029 4.60449C11.7513 1.92945 13.3767 0.5 15 0.5Z" stroke="#A1A1A1" />
                                <path d="M3 6.49463C5.75158 8.02623 9.88209 9.00005 14.5 9.00005C19.1179 9.00005 23.2484 8.02623 26 6.49463" stroke="#A1A1A1" />
                                <path d="M26 23.5054C23.2484 21.9738 19.1179 20.9999 14.5 20.9999C9.88209 20.9999 5.75158 21.9738 3 23.5054" stroke="#A1A1A1" />
                                <path d="M1 15L29 15" stroke="#A1A1A1" strokeLinecap="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default InteractiveSlider;