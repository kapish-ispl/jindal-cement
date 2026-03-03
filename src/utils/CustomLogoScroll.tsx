"use client";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import gsap from 'gsap';

const CustomLogoScroll = ({ data }: { data: ReactNode[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const slides = useMemo(() => {
        return data
            .filter(
                (item): item is React.ReactElement =>
                    React.isValidElement(item)
            )
            .map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
            ));
    }, [data]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const content = container.querySelector('.cloned-items') as HTMLDivElement;
        if (!content) return;

        // Clone enough copies to cover at least twice the container width
        const containerWidth = container.offsetWidth;
        let totalContentWidth = content.offsetWidth;

        while (totalContentWidth < containerWidth * 2) {
            const clone = content.cloneNode(true) as HTMLDivElement;
            content.appendChild(clone);
            totalContentWidth += content.offsetWidth;
        }

        let x = 0;
        const speed = 1; // pixels per tick

        const tick = () => {
            x -= speed;
            // seamless reset using mod
            x = x % content.offsetWidth;
            gsap.set(container, { x });
        };

        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
        };
    }, []);

    return (
        <>
            <div className="scrollingIcons">
                <div ref={containerRef} className="scrollingIcons__container">
                    <div className="scrollingIcons__content marquee-content">
                        <div className="cloned-items">
                            {slides.length > 0 && slides.map((item: ReactNode, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        {item}
                                    </React.Fragment>
                                )
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}


export default CustomLogoScroll;