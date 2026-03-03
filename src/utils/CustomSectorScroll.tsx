'use client';

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

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
export interface SlideItemProps {
    label: string;
    mediasrc?: string;
    btnlabel?: string;
    children?: React.ReactNode;
}

export type SlideItem = React.ReactElement<SlideItemProps>;

interface PropsTypes {
    data: SlideItem[];
}

interface SlideGroup {
    groupName: string;
    groupSlide: SlideItem[];
}



// 👇 USE THE PROPS INTERFACE
const InteractiveSlider = (props: PropsTypes) => {
    const { data: slidesData1, ...rest } = props;
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const hasMountedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const isManualScrollingRef = useRef(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    const slidesDataArray = useMemo(() => {
        if (!slidesData1) return [];
        return Array.isArray(slidesData1) ? slidesData1 : [slidesData1];
    }, [slidesData1]);

    const finalslidesData = useMemo<SlideGroup[]>(() => {
        return slidesDataArray
            .filter((item): item is SlideItem =>
                React.isValidElement(item) &&
                typeof item.props.label === "string"
            )
            .map((item) => ({
                groupName: item.props.label,
                groupSlide: React.Children.toArray(item.props.children)
                    .filter((child): child is SlideItem =>
                        React.isValidElement(child) &&
                        child.props !== undefined
                    ),
            }));
    }, [slidesDataArray]);



    const slidesData = useMemo(() => {
        return finalslidesData.flatMap((group) =>
            group.groupSlide.map((slide) => ({
                groupName: group.groupName,
                slide,
            }))
        );
    }, [finalslidesData]);

    const orderedGroupNames = Array.from(
        new Set(finalslidesData.map((s) => s.groupName))
    );

    // --- Sync ScrollTrigger with Embla ---
    const syncScrollTrigger = useCallback(
        (slideIndex: number) => {
            // 👇 ADDED GUARD for 0 or 1 slides
            if (!scrollTriggerRef.current || slidesData.length <= 1) return;

            const trigger = scrollTriggerRef.current;
            const progress = slideIndex / (slidesData.length - 1);
            const targetScrollY = trigger.start + progress * (trigger.end - trigger.start);
            window.scrollTo({ top: targetScrollY, behavior: "auto" });
        },
        [slidesData.length]
    );

    // --- Handle tab click ---
    const onTabClick = useCallback(
        (groupName: string) => {
            const firstSlideInGroupIndex = slidesData.findIndex(
                (s) => s.groupName === groupName
            );
            if (firstSlideInGroupIndex === -1 || !emblaApi) return;
            emblaApi.scrollTo(firstSlideInGroupIndex);
            syncScrollTrigger(firstSlideInGroupIndex);
        },
        [emblaApi, slidesData, syncScrollTrigger]
    );

    // --- Add Embla Listeners for Drag Sync & State ---
    useEffect(() => {
        if (!emblaApi) return;

        // --- 1. Update drag state ---
        const onPointerDown = () => {
            isDraggingRef.current = true;
        };
        const onPointerUp = () => {
            isDraggingRef.current = false;
        };

        // --- 2. Sync Embla Drag -> Page Scroll ---
        const onEmblaScroll = () => {
            if (!isDraggingRef.current) return; // Only run when user is dragging
            if (!scrollTriggerRef.current) return;

            const trigger = scrollTriggerRef.current;
            const emblaProgress = emblaApi.scrollProgress();
            const targetScrollY = trigger.start + emblaProgress * (trigger.end - trigger.start);

            window.scrollTo({ top: targetScrollY, behavior: 'auto' });
        };

        // --- 3. Update React state on select ---
        const onSelect = () => {
            const newIndex = emblaApi.selectedScrollSnap();
            setSelectedIndex(newIndex);

            if (!hasMountedRef.current) {
                hasMountedRef.current = true;
            }
        };

        // Add all listeners
        emblaApi.on('pointerDown', onPointerDown);
        emblaApi.on('pointerUp', onPointerUp);
        emblaApi.on('scroll', onEmblaScroll);
        emblaApi.on('select', onSelect);

        // Run select once on init
        onSelect();

        return () => {
            emblaApi.off('pointerDown', onPointerDown);
            emblaApi.off('pointerUp', onPointerUp);
            emblaApi.off('scroll', onEmblaScroll);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]); // No dependencies needed here

    // --- ScrollTrigger setup ---
    useGSAP(
        () => {
            if (!emblaApi) return;
            const numSlides = slidesData.length;

            // 👇 ADDED GUARD for 0 or 1 slides
            if (numSlides <= 1) return;

            const tween = gsap.to({}, {
                scrollTrigger: {
                    trigger: pinContainerRef.current,
                    pin: true,
                    start: "-=100px top",
                    end: `+=${(numSlides - 1) * 300}`,

                    // 👇 THIS IS THE CRITICAL FIX
                    // Use scrollTo() to trigger Embla's 'onSelect' event
                    onUpdate: (self) => {
                        // Skip updates while user is dragging OR we are manually scrolling
                        if (isDraggingRef.current || isManualScrollingRef.current) return;

                        const slideIndex = Math.round(self.progress * (numSlides - 1));
                        if (emblaApi.selectedScrollSnap() !== slideIndex) {
                            emblaApi.scrollTo(slideIndex);
                        }
                    },

                    onToggle: (self) => {
                        const pinSpacer = self.pin?.parentNode;
                        if (pinSpacer) {
                            (pinSpacer as HTMLElement)?.classList.toggle("is-active", self.isActive);
                        }
                    },
                },
            });
            scrollTriggerRef.current = tween.scrollTrigger!;
            return () => {
                tween.kill();
                scrollTriggerRef.current?.kill();
            };
        },
        { scope: pinContainerRef, dependencies: [emblaApi, slidesData.length] }
    );

    // --- Animate content on slide change ---
    useEffect(() => {

        if (!emblaApi || !pinContainerRef.current) return;

        const ctx = gsap.context(() => {
            const allContent = gsap.utils.toArray(".anim-content-wrapper");
            const activeContent = allContent[selectedIndex];

            gsap.set(allContent, { opacity: 0, x: 100 });

            if (activeContent) {
                gsap.to(activeContent, {
                    opacity: 1,
                    x: 0,
                    duration: 0.1,
                    ease: "power4.out",
                });
            }
        }, pinContainerRef);

        return () => ctx.revert();

    }, [selectedIndex, emblaApi]);


    // --- Dot navigation ---
    const onDotClick = useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
            syncScrollTrigger(index);
        },
        [emblaApi, syncScrollTrigger]
    );

    // --- Active group + local index ---
    const activeGroupName = slidesData[selectedIndex]?.groupName;
    const { currentGroupSlides, groupStartIndex, localSelectedIndex } = useMemo(() => {
        if (!activeGroupName)
            return { currentGroupSlides: [], groupStartIndex: 0, localSelectedIndex: 0 };
        const group = finalslidesData.find((g) => g.groupName === activeGroupName);
        const startIndex = slidesData.findIndex((s) => s.groupName === activeGroupName);
        const localIndex = selectedIndex - startIndex;
        return {
            currentGroupSlides: group ? group.groupSlide : [],
            groupStartIndex: startIndex,
            localSelectedIndex: localIndex,
        };
    }, [selectedIndex, activeGroupName, finalslidesData, slidesData]);

    const scrollToSection = () => {
        const element = document.getElementById("global-presence-section");
        if (!element || !scrollTriggerRef.current) return;

        // 1️⃣ Set manual scrolling flag
        isManualScrollingRef.current = true;

        // 2️⃣ Smooth scroll
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        // 3️⃣ After smooth scroll finishes, unset the flag
        setTimeout(() => {
            if (emblaApi) {
                emblaApi.scrollTo(slidesData.length - 1); // last slide
            }
            isManualScrollingRef.current = false;
        }, 1000); // adjust duration to match your smooth scroll
    };

    console.dir(props, { depth: null })

    return (
        <section className="slider-section" {...rest}>
            <div ref={pinContainerRef} className="slider-wrapper">
                <div className="tabView">
                    {orderedGroupNames.map((groupName) => (
                        <div
                            key={groupName}
                            onClick={() => onTabClick(groupName)}
                            className={`tabView__item ${activeGroupName === groupName ? "active" : ""}`}
                        >
                            <span className="tabView__item-link">{groupName}</span>
                        </div>
                    ))}
                </div>

                {/* --- Slider --- */}
                <div className="tabContent">
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container">
                            {finalslidesData.map((group, groupIndex) => {
                                return group.groupSlide.map((slide, slideIndex: number) => {
                                    const actionBtn = () => {
                                        if (!emblaApi) return;

                                        const currentGroupName = group.groupName;
                                        const currentGroup = finalslidesData.find(
                                            (g) => g.groupName === currentGroupName
                                        );

                                        if (!currentGroup) return;
                                        const groupLength = currentGroup.groupSlide.length;
                                        const firstSlideIndex = slidesData.findIndex(
                                            (s) => s.groupName === currentGroupName
                                        );
                                        const lastSlideIndex = firstSlideIndex + groupLength - 1;

                                        const globalSlideIndex = firstSlideIndex + slideIndex;

                                        if (groupLength > 1) {
                                            const nextSlideIndex =
                                                globalSlideIndex < lastSlideIndex ? globalSlideIndex + 1 : firstSlideIndex;

                                            emblaApi.scrollTo(nextSlideIndex);
                                            syncScrollTrigger(nextSlideIndex);
                                        } else {
                                            emblaApi.scrollTo(firstSlideIndex);
                                            syncScrollTrigger(firstSlideIndex);
                                        }
                                    };


                                    return (
                                        <div
                                            className="embla__slide embla__slide--composite"
                                            key={`${groupIndex}-${slideIndex}`}
                                        >
                                            {/* --- Content part of the slide --- */}
                                            <div className="composite-slide__content">
                                                <div className="tabContent__ls anim-content-wrapper">
                                                    {slide.props.children}

                                                    {slide.props.btnlabel !== undefined && (
                                                        <div className="action-btn slider-btn" onClick={actionBtn}>
                                                            <span className="u-btn clr-green withBorder btn-size">
                                                                {slideIndex === group.groupSlide.length - 1 ? (
                                                                    <>
                                                                        <span className="btn-label">{slide.props?.btnlabel}</span>
                                                                        <span className="icon">
                                                                            <img
                                                                                alt="right arrow"
                                                                                className="img-fluid u-img"
                                                                                src="https://docs.jindalsteel.in/document/124/1762250746_1761221289_Arrow1Stroke-left.jpg"
                                                                            />
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="icon">
                                                                            <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M0.420009 0.41741C0.980163 -0.139278 1.88847 -0.138996 2.4488 0.41741L11.5798 9.49188C12.1401 10.0487 12.1401 10.9513 11.5798 11.5081L2.44881 20.5826C1.88848 21.139 0.980165 21.1393 0.420011 20.5826C-0.140143 20.0259 -0.139859 19.1232 0.420011 18.5664L6.86686 12L8.33346 10.5L7.10186 9.07415L0.420009 2.43365C-0.139861 1.87679 -0.140145 0.974098 0.420009 0.41741Z" fill="#4FB848" />
                                                                            </svg>

                                                                        </span>
                                                                        <span className="btn-label">{slide.props?.btnlabel}</span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* --- Image part of the slide --- */}
                                            <div className="composite-slide__image">
                                                <div className="cus-shadow ratio ratio-16x9">
                                                    <img
                                                        src={slide.props.mediasrc}
                                                        className="img-fluid"
                                                        alt={`${group.groupName} Slide ${slideIndex + 1}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>

                </div>

                {/* --- Dots Navigation --- */}
                <div className="navigation-container text-end mt-3">
                    <div className="group-container nav-dots">
                        {currentGroupSlides.length > 1 && currentGroupSlides.map((_, index) => (
                            <DotButton
                                key={`group-dot-${index}`}
                                selected={index === localSelectedIndex}
                                onClick={() => onDotClick(groupStartIndex + index)}
                            />
                        ))}
                    </div>

                    <span onClick={scrollToSection} className='cursor-pointer'>
                        <svg width="30" height="47" viewBox="0 0 30 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 36L15.5999 41.736C15.2686 42.088 14.7314 42.088 14.4001 41.736L9 36" stroke="#A1A1A1" strokeLinecap="round" />
                            <path d="M21 40L15.5999 45.736C15.2686 46.088 14.7314 46.088 14.4001 45.736L9 40" stroke="#A1A1A1" strokeLinecap="round" />
                            <circle cx="15" cy="15" r="14.5" stroke="#A1A1A1" />
                            <path d="M15 0.5C16.6233 0.5 18.2487 1.92945 19.4971 4.60449C20.7265 7.23902 21.5 10.9141 21.5 15C21.5 19.0859 20.7265 22.761 19.4971 25.3955C18.2487 28.0705 16.6233 29.5 15 29.5C13.3767 29.5 11.7513 28.0705 10.5029 25.3955C9.27349 22.761 8.5 19.0859 8.5 15C8.5 10.9141 9.27349 7.23902 10.5029 4.60449C11.7513 1.92945 13.3767 0.5 15 0.5Z" stroke="#A1A1A1" />
                            <path d="M3 6.49463C5.75158 8.02623 9.88209 9.00005 14.5 9.00005C19.1179 9.00005 23.2484 8.02623 26 6.49463" stroke="#A1A1A1" />
                            <path d="M26 23.5054C23.2484 21.9738 19.1179 20.9999 14.5 20.9999C9.88209 20.9999 5.75158 21.9738 3 23.5054" stroke="#A1A1A1" />
                            <path d="M1 15L29 15" stroke="#A1A1A1" strokeLinecap="round" />
                        </svg>
                        <span className="skip-text">Skip to global presence</span>
                    </span>
                </div>
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
        </section>
    );
};


export default InteractiveSlider;