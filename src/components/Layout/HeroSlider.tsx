'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCreative } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(SplitText);
}

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-creative';

// Data
interface Slide {
    id: number;
    image: string;
    video?: string;
    title: string;
    subtitle: string;
    type: string;
}

const SLIDES: Slide[] = [
    {
        id: 1,
        image: 'https://picsum.photos/1920/1080?random=1',
        subtitle: 'Inspired by Growth, Driven by Resources',
        title: 'Natural Resources',
        type: "image"
    },
    {
        id: 2,
        image: 'https://picsum.photos/1920/1080?random=2',
        video: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
        subtitle: 'Sustainable Energy For Tomorrow',
        title: 'Solar Power',
        type: "video"
    },
    {
        id: 3,
        image: 'https://picsum.photos/1920/1080?random=3',
        subtitle: 'Global Logistics Network',
        title: 'Shipping & Transport',
        type: "image"
    },
    {
        id: 4,
        image: 'https://picsum.photos/1920/1080?random=4',
        subtitle: 'Building Modern Infrastructure',
        title: 'Construction',
        type: "image"
    },
    {
        id: 5,
        image: 'https://picsum.photos/1920/1080?random=5',
        subtitle: 'Global Logistics Network',
        title: 'Shipping & Transport',
        type: "image"
    },
];

export default function HeroSlider() {
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [thumbnailQueue, setThumbnailQueue] = useState<number[]>([1, 2, 3]); // Initially show all other slides
    const [navigationDisabled, setNavigationDisabled] = useState<boolean>(true); // Disable for first 2s
    const progressFillRef = useRef<HTMLDivElement>(null);
    const thumbWrapperRef = useRef<HTMLDivElement>(null);
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const subtitleRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    // Update thumbnail queue when slide changes
    useEffect(() => {
        // Create queue with all slides except the current one
        const queue: number[] = [];
        for (let i = 1; i < SLIDES.length; i++) {
            queue.push((currentSlideIndex + i) % SLIDES.length);
        }
        setThumbnailQueue(queue);
    }, [currentSlideIndex]);

    // Animate title and subtitle when slide changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Animate the active slide
        const titleElement = titleRefs.current[currentSlideIndex];
        const subtitleElement = subtitleRefs.current[currentSlideIndex];

        if (titleElement) {
            const splitTitle = new SplitText(titleElement, { type: "words, chars" });

            gsap.fromTo(splitTitle.chars,
                {
                    y: 100,
                    rotateX: -90,
                    opacity: 0
                },
                {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.3
                }
            );
        }

        if (subtitleElement) {
            const splitSubtitle = new SplitText(subtitleElement, { type: "words" });

            gsap.fromTo(splitSubtitle.words,
                {
                    y: 20,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.8
                }
            );
        }
    }, [currentSlideIndex]);

    // Animation Loop Handler
    const onAutoplayTimeLeft = (s: SwiperType, time: number, progress: number) => {
        // 1. Update Progress Bar
        if (progressFillRef.current) {
            progressFillRef.current.style.width = `${(1 - progress) * 100}%`;
        }

        // 2. Toggle Visibility (Hide between 6000ms and 2000ms remaining)
        // 8000ms total -> visible (2s) -> hidden (4s) -> visible (2s)
        if (thumbWrapperRef.current) {
            const hiddenClass = 'hero-slider__thumbs--hidden';

            if (time <= 6000 && time >= 2000) {
                if (!thumbWrapperRef.current.classList.contains(hiddenClass)) {
                    thumbWrapperRef.current.classList.add(hiddenClass);
                }
            } else {
                if (thumbWrapperRef.current.classList.contains(hiddenClass)) {
                    thumbWrapperRef.current.classList.remove(hiddenClass);
                }
            }
        }

        // 3. Disable Navigation for first 2 seconds (time > 6000ms)
        const shouldDisableNav = time > 6000;
        if (navigationDisabled !== shouldDisableNav) {
            setNavigationDisabled(shouldDisableNav);
        }
    };

    const handleSlideChange = (swiper: SwiperType) => {
        setCurrentSlideIndex(swiper.realIndex);
    };

    const handleThumbnailClick = (slideIndex: number) => {
        if (mainSwiper && !mainSwiper.destroyed) {
            mainSwiper.slideToLoop(slideIndex);
        }
    };

    return (
        <div className="hero-slider">

            {/* --- Main Background Slider --- */}
            <Swiper
                onSwiper={setMainSwiper}
                modules={[Autoplay, Navigation, EffectCreative]}
                loop={true}
                speed={1000}
                allowTouchMove={false}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: '.hero-slider__nav-btn--next',
                    prevEl: '.hero-slider__nav-btn--prev',
                }}
                effect={'creative'}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ['-20%', 0, -1],
                        opacity: 0,
                    },
                    next: {
                        // Start from origin (handled in SCSS transform-origin)
                        translate: ['0%', '0%', 1],
                        scale: 0.1,
                        opacity: 0,
                    },
                    limitProgress: 2,
                }}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                onSlideChange={handleSlideChange}
                className="hero-slider__main"
            >
                {SLIDES.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {slide.type === 'video' && slide.video ? (
                            <video
                                className="hero-slider__bg"
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster={slide.image}
                            >
                                <source src={slide.video} type="video/mp4" />
                            </video>
                        ) : (
                            <img src={slide.image} alt={slide.subtitle} className="hero-slider__bg" />
                        )}
                        <div className="hero-slider__content">
                            <h1
                                className="hero-slider__title"
                                ref={(el) => { titleRefs.current[slide.id - 1] = el; }}
                            >
                                {slide.title.split(',').map((part, i) => (
                                    <React.Fragment key={i}>
                                        {part}{i === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </h1>
                            <p
                                className="hero-slider__subtitle"
                                ref={(el) => { subtitleRefs.current[slide.id - 1] = el; }}
                            >
                                {slide.subtitle}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* --- Bottom Controls Wrapper --- */}
            <div className="hero-slider__controls-wrapper">

                {/* 1. Thumbnails Slider */}
                <div className="hero-slider__thumbs" ref={thumbWrapperRef}>
                    <div className="hero-slider__thumb-container">
                        {thumbnailQueue.map((slideIndex, index) => (
                            <div
                                key={`thumb-${slideIndex}-${index}`}
                                className="hero-slider__thumb-slide"
                                onClick={() => handleThumbnailClick(slideIndex)}
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                <img
                                    src={SLIDES[slideIndex].image}
                                    alt={`Thumbnail ${slideIndex + 1}`}
                                    className="hero-slider__thumb-img"
                                />
                                <div className="hero-slider__thumb-title">
                                    {SLIDES[slideIndex].title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Control Bar (Progress + Arrows) */}
                <div className="hero-slider__control-bar">
                    <div className="hero-slider__progress-track">
                        <div className="hero-slider__progress-fill" ref={progressFillRef}></div>
                    </div>

                    <div className="hero-slider__nav">
                        <div className={`hero-slider__nav-btn hero-slider__nav-btn--prev ${navigationDisabled ? 'hero-slider__nav-btn--disabled' : ''}`}></div>
                        <div className={`hero-slider__nav-btn hero-slider__nav-btn--next ${navigationDisabled ? 'hero-slider__nav-btn--disabled' : ''}`}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}