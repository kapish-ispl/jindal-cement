import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import gsap from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';


// --- DATA ---
// const sliderData = [
//     {
//         id: '01',
//         title: 'Steel',
//         subtitle: 'Mine-to-metal steel solutions powering infrastructure.',
//         image: 'https://picsum.photos/id/101/1920/1080',
//     },
//     {
//         id: '02',
//         title: 'Energy',
//         subtitle: 'Delivering thermal and solar power to support industry.',
//         image: 'https://picsum.photos/id/102/1920/1080',
//     },
//     {
//         id: '03',
//         title: 'Resources',
//         subtitle: 'Responsible mining operations that anchor our strategy.',
//         image: 'https://picsum.photos/id/103/1920/1080',
//     },
//     {
//         id: '04',
//         title: 'Ports',
//         subtitle: 'Port-led logistics enabling connectivity.',
//         image: 'https://picsum.photos/id/104/1920/1080',
//     },
//     {
//         id: '05',
//         title: 'Logistics',
//         subtitle: 'Integrated rail networks and cargo services.',
//         image: 'https://picsum.photos/id/106/1920/1080',
//     },
// ];

interface BannerMedia {
    type: string;
    cdnPath: string;
    caption?: string;
}

const HeroSlider: React.FC<{slides: BannerMedia[]}> = ({slides}) => {
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [thumbnailQueue, setThumbnailQueue] = useState<number[]>([1, 2, 3]); // Initially show next 3 slides
    const [navigationDisabled, setNavigationDisabled] = useState<boolean>(true); // Disable for first 2s
    const progressFillRef = useRef<HTMLSpanElement>(null);
    const thumbWrapperRef = useRef<HTMLDivElement>(null);

    // Update thumbnail queue when slide changes
    useEffect(() => {
        // Create queue with all slides except the current one (show next 3)
        const queue: number[] = [];
        for (let i = 1; i < slides.length; i++) {
            queue.push((currentSlideIndex + i) % slides.length);
        }
        setThumbnailQueue(queue);
    }, [currentSlideIndex]);

    /**
     * Handle Exit Animations (on the leaving slide)
     */
    const handleExitAnimations = (swiper: SwiperType) => {
        // Get the current active slide (the one that's about to leave)
        const leavingSlide = swiper.slides[swiper.activeIndex];
        if (!leavingSlide) return;

        const leavingTitle = leavingSlide.querySelector('.hero-slider__title');
        const leavingSubtitle = leavingSlide.querySelector('.hero-slider__subtitle');

        // Exit animation: Move up and fade out
        if (leavingTitle) {
            gsap.to(leavingTitle, {
                y: -100,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.in',
            });
        }

        if (leavingSubtitle) {
            gsap.to(leavingSubtitle, {
                y: -50,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.in',
                delay: 0.1,
            });
        }
    };

    /**
     * Handle Enter Animations (on the new active slide)
     */
    const handleEnterAnimations = (swiper: SwiperType) => {
        // 1. SELECT ACTIVE SLIDE FIRST
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) return;

        // Query elements within the active slide
        const activeImage = activeSlide.querySelector('.hero-slider__bg-image');
        const activeTitle = activeSlide.querySelector('.hero-slider__title');
        const activeSubtitle = activeSlide.querySelector('.hero-slider__subtitle');

        // 2. SMART CLEANUP: Only reset slides that aren't currently active
        // This prevents killing the zoom animation on the leaving slide
        const allImages = document.querySelectorAll('.hero-slider__bg-image');
        const allTitles = document.querySelectorAll('.hero-slider__title');
        const allSubtitles = document.querySelectorAll('.hero-slider__subtitle');

        allImages.forEach((img) => {
            // Don't reset the active slide's image during transition
            if (img !== activeImage) {
                gsap.killTweensOf(img);
                gsap.set(img, { scale: 1 });
            }
        });

        [...allTitles, ...allSubtitles].forEach((el) => {
            // Don't reset the active slide's text during transition
            if (el !== activeTitle && el !== activeSubtitle) {
                gsap.killTweensOf(el);
                gsap.set(el, { y: 100, opacity: 0 });
            }
        });

        // 3. ENTER ANIMATIONS
        if (activeImage) {
            gsap.to(activeImage, {
                scale: 1.25,
                duration: 8,
                ease: 'none',
            });
        }

        if (activeTitle) {
            gsap.to(activeTitle, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.6
            });
        }

        if (activeSubtitle) {
            gsap.to(activeSubtitle, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.8,
            });
        }
    };

    /**
     * Autoplay Time Left Handler
     */
    const onAutoplayTimeLeft = (s: SwiperType, time: number, progress: number) => {
        // 1. Update Progress Bar
        if (progressFillRef.current) {
            progressFillRef.current.style.width = `${(1 - progress) * 100}%`;
        }

        // 2. Toggle Thumbnail Visibility (Hide between 6000ms and 2000ms remaining)
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

        // 4. Trigger exit animation 1 second before slide change (time <= 1000ms)
        if (time <= 1000 && time > 900) {
            handleExitAnimations(s);
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

            {/* --- MAIN SLIDER --- */}
            <Swiper
                modules={[Autoplay, EffectCreative, Navigation]}
                effect="creative"
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ['-20%', 0, -1],
                        opacity: 0,
                    },
                    next: {
                        // Scale up from thumbnail position
                        translate: ['0%', '0%', 1],
                        scale: 0.1,
                        opacity: 0,
                    },
                    limitProgress: 2,
                }}
                speed={1000}
                loop={true}
                allowTouchMove={false}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: '.hero-slider__nav-btn--next',
                    prevEl: '.hero-slider__nav-btn--prev',
                }}
                className="hero-slider__main"
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                onSlideChange={handleSlideChange}
                onSlideChangeTransitionStart={(swiper) => handleEnterAnimations(swiper)}
                onSwiper={(swiper) => {
                    setMainSwiper(swiper);
                    setTimeout(() => handleEnterAnimations(swiper), 100);
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={slide.cdnPath}
                            alt={slide.caption}
                            className="hero-slider__bg-image"
                        />
                        <div className="hero-slider__content">
                            <div className="hero-slider__title-wrapper">
                                <h1 className="hero-slider__title">{slide.caption}</h1>
                            </div>
                            {/* <p className="hero-slider__subtitle">{slide.subtitle}</p> */}
                        </div>
                        <div className="hero-slider__counter">0{index+1}</div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* --- THUMBS SLIDER (Queue-based) --- */}
            <div className="hero-slider__thumbs" ref={thumbWrapperRef}>
                <div className="hero-slider__thumb-container">
                    {thumbnailQueue.map((slideIndex, index) => (
                        <div
                            key={`thumb-${slideIndex}-${index}`}
                            className="hero-slider__thumb-item"
                            onClick={() => handleThumbnailClick(slideIndex)}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <img
                                src={slides[slideIndex].cdnPath}
                                alt={slides[slideIndex].caption}
                                className="hero-slider__thumb-image"
                            />
                            <div className="hero-slider__thumb-text">
                                {slides[slideIndex].caption}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- PROGRESS BAR --- */}
            <div className="hero-slider__progress-track">
                <span
                    ref={progressFillRef}
                    className="hero-slider__progress-bar"
                ></span>
            </div>

            {/* --- NAVIGATION ARROWS --- */}
            <div className="hero-slider__nav">
                <div className={`hero-slider__nav-btn hero-slider__nav-btn--prev ${navigationDisabled ? 'hero-slider__nav-btn--disabled' : ''}`}></div>
                <div className={`hero-slider__nav-btn hero-slider__nav-btn--next ${navigationDisabled ? 'hero-slider__nav-btn--disabled' : ''}`}></div>
            </div>
        </div>
    );
};

export default HeroSlider;