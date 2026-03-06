"use client";

import React, { FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TextScrollAnimationProps {
    data?: any;
}

const TextScrollAnimation: FC<TextScrollAnimationProps> = ({ data }) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLSpanElement | null>(null);

    useGSAP(() => {
        if (!textRef.current || !containerRef.current) return;

        // Find the closest section container to pin the entire section
        const sectionContainer = containerRef.current.closest('.commonSection-lg') as HTMLElement;
        if (!sectionContainer) return;

        const split = new GSAPSplitText(textRef.current, {
            type: "words,chars"
        });

        const chars = split.chars as HTMLElement[];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionContainer,
                start: "top top",
                end: () => `+=${sectionContainer.offsetHeight}`, // Pin for the full height of the section
                scrub: true,
                pin: true,
                anticipatePin: 1,
                pinSpacing: true
            }
        });

        tl.fromTo(
            chars,
            { color: "#A1A1A1" },
            {
                color: "#636466",
                stagger: 0.1,
                ease: 'power2.inOut'
            }
        );

    }, { scope: containerRef });

    return (
        <span ref={containerRef} className="text-animation-wrapper">
            <span ref={textRef} className="text-animation__text">
                {data}
            </span>
        </span>
    );
};

export default TextScrollAnimation;