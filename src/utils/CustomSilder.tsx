"use client";

import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";

interface CustomSliderProps {
    cls?: string;
    customcls?: string;
    items?: number[] | string;
    data?: ReactNode[];
    arrows?: boolean | string;
    dots?: boolean | string;
    children?: ReactNode;
}

export default function CustomSlider({
    cls,
    customcls,
    items,
    data,
    arrows = false,
    dots = false,
    children,
}: CustomSliderProps) {

    const showArrows = arrows === true || arrows === "true";
    const showDots = dots === true || dots === "true";

    // Parse items safely
    const parsedItems = React.useMemo<number[]>(() => {
        try {
            if (typeof items === "string") {
                const parsed = JSON.parse(items);
                if (Array.isArray(parsed) && parsed.length === 3) return parsed;
            }
            if (Array.isArray(items)) return items;
            return [1, 1, 1];
        } catch {
            return [1, 1, 1];
        }
    }, [items]);

    // Select actual slider items
    const filteredItems: ReactNode[] =
        data?.filter((item) => typeof item !== "string") ||
        React.Children.toArray(children);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
    });

    const [slidesToShow, setSlidesToShow] = useState(parsedItems[0]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Use correct browser timeout type
    const autoplayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setSlidesToShow(parsedItems[2]);
            else if (window.innerWidth <= 1024) setSlidesToShow(parsedItems[1]);
            else setSlidesToShow(parsedItems[0]);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [parsedItems]);

    // Handle slide change
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    // Auto play handler
    useEffect(() => {
        if (!emblaApi) return;

        const play = () => emblaApi.scrollNext();

        autoplayInterval.current = setInterval(play, 3000);

        const root = emblaApi.rootNode();

        const handleMouseEnter = () =>
            autoplayInterval.current && clearInterval(autoplayInterval.current);

        const handleMouseLeave = () => {
            autoplayInterval.current = setInterval(play, 3000);
        };

        root.addEventListener("mouseenter", handleMouseEnter);
        root.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            autoplayInterval.current && clearInterval(autoplayInterval.current);
            root.removeEventListener("mouseenter", handleMouseEnter);
            root.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <div className={`c-embla ${customcls || ""}`}>
            <div className="c-embla__viewport" ref={emblaRef}>
                <div className={`c-embla__container ${cls || ""}`}>
                    {filteredItems?.map((item, index) => (
                        <div
                            key={index}
                            className="c-embla__slide"
                            style={{
                                flex: `0 0 calc(100% / ${slidesToShow})`,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {showArrows && filteredItems.length > slidesToShow && (
                <div className="c-embla__buttons">
                    <button
                        className="c-embla__arrow c-embla__arrow--prev"
                        onClick={scrollPrev}
                        aria-label="Previous Slide"
                    >
                        <img src="https://docs.jindalsteel.in/document/124/1761379695_Arrow1Stroke1.png" alt="Previous" />
                    </button>

                    <button
                        className="c-embla__arrow c-embla__arrow--next"
                        onClick={scrollNext}
                        aria-label="Next Slide"
                    >
                        <img src="https://docs.jindalsteel.in/document/124/1761379695_Arrow1Stroke1.png" alt="Next" />
                    </button>
                </div>
            )}

            {/* Dots */}
            {showDots && filteredItems.length > slidesToShow && (
                <div className="c-embla__dots-wrap">
                    <div className="c-embla__dots">
                        {filteredItems.map((_, i) => (
                            <button
                                key={i}
                                className={`c-embla__dot ${i === selectedIndex ? "is-selected" : ""
                                    }`}
                                onClick={() => emblaApi?.scrollTo(i)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
