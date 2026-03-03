"use client";

import React, { useMemo, useRef, ReactElement, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------
    TYPES FOR CARD ITEMS
--------------------------- */

interface StickyCardItemProps {
    heading: string;
    imgsrc: string;
    mobimgsrc?: string;
    children: ReactNode;
}

type StickyCardElement = ReactElement<StickyCardItemProps> | string;

interface PanelsData {
    id: number;
    heading: string;
    img: string;
    mobImg?: string;
    children: ReactNode;
}

interface StickyCardsProps {
    data: StickyCardElement[];
}

/* --------------------------
    COMPONENT
--------------------------- */

const CustomStickyCards = ({ data }: StickyCardsProps) => {
    const container = useRef<HTMLDivElement | null>(null);

    /* --------------------------
        PARSE CHILD ELEMENTS
    --------------------------- */

    const panelsData: PanelsData[] = useMemo(() => {
        if (!data) return [];

        return data.map((item, index) => {
            // CASE 1: item is string
            if (typeof item === "string") {
                return {
                    id: index + 1,
                    heading: "",
                    img: "",
                    children: item
                };
            }

            // CASE 2: item is a valid StickyCardElement
            if (React.isValidElement(item)) {
                const { heading, imgsrc, mobimgsrc, children } = item.props;

                return {
                    id: index + 1,
                    heading,
                    img: imgsrc,
                    mobImg: mobimgsrc,
                    children
                };
            }

            // Fallback
            return {
                id: index + 1,
                heading: "",
                img: "",
                children: null
            };
        });
    }, [data]);


    /* --------------------------
        GSAP EFFECTS
    --------------------------- */

    useGSAP(
        () => {
            const stickyCards = document.querySelectorAll(".sticky-card");

            stickyCards.forEach((card, index) => {
                if (index < stickyCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top top",
                        endTrigger: stickyCards[stickyCards.length - 1],
                        end: "top top",
                        pin: true,
                        pinSpacing: false
                    });
                }

                if (index < stickyCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: stickyCards[index + 1],
                        start: "top bottom",
                        end: "top top",
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const scale = 1 - progress * 0.75;

                            gsap.set(card, {
                                scale,
                                rotation: 0, // ← your original logic always returns 0
                                "--after-opacity": progress * 50
                            });
                        }
                    });
                }
            });
        },
        { scope: container }
    );

    /* --------------------------
        RENDER
    --------------------------- */

    return (
        <div ref={container} className="sticky-cards">
            {panelsData.map((card) => (
                <div
                    className="sticky-card"
                    key={card.id}
                    style={{ backgroundImage: `url(${card.img})` }}
                >
                    <div className="sticky-card-content">
                        <div className="container cus-container h-100">
                            <div className="row h-100">
                                <div className="col-12 h-100">
                                    <div className="sticky-card-content-wrapper h-100">
                                        <h1 className="sticky-card-header c-heading-65">
                                            {card.heading}
                                        </h1>
                                        {card.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomStickyCards;
