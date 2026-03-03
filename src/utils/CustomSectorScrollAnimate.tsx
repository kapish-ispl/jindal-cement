"use client";

import React, { ReactNode, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
interface CustomSectorProps {
    data: ReactNode[];
}

const CustomSectorScrollAnimate: React.FC<CustomSectorProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ---- Safe filtering for React elements ----
    const slides = useMemo(() => {
        return data.filter(
            (item): item is React.ReactElement =>
                React.isValidElement(item)
        );
    }, [data]);

    // ---- GSAP Scroll Animation ----
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const cards = gsap.utils.toArray<HTMLElement>(".c-sectorscroll__list");
        if (!cards.length) return;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            const totalScroll = (cards.length - 1) * 100;
            gsap.to(cards, {
                xPercent: -totalScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "-80px",
                    end: `+=${cards.length * 100}%`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                },
            });
        } else {
            gsap.set(cards, { xPercent: 150, opacity: 0 });

            cards.forEach((card) => {
                gsap.to(card, {
                    xPercent: card.classList.contains("single_item") ? 0 : -45,
                    opacity: 1,
                    duration: 2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "-800px",
                        end: "+=2000px",
                        toggleActions: "play reverse play reverse",
                    },
                });
            });
        }
    }, [data]);

    return (
        <div className="generic_spacer_container v3" ref={containerRef}>
            <div className="container cus-container">
                <div className="row align-items-center">
                    <div className="col-12">
                        <div className="row" style={{ flexWrap: "nowrap" }}>
                            {slides.map((slide, index) => (
                                <React.Fragment key={index}>{slide}</React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomSectorScrollAnimate;
