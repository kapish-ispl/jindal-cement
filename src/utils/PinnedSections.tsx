"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Slide {
    id: string;
    title: string;
    desc: string;
    img: string;
}

const slides: Slide[] = [
    { id: "1", title: "Phulwari Bridge", desc: "Bridge infrastructure supporting reinforced foundations.", img: "https://picsum.photos/id/122/1920/1080" },
    { id: "2", title: "Ganga Expressway", desc: "Multi-lane high-speed corridor connecting major zones.", img: "https://picsum.photos/id/146/1920/1080" },
    { id: "3", title: "Narmada Dam", desc: "Hydraulic engineering and water management systems.", img: "https://picsum.photos/id/164/1920/1080" },
    { id: "4", title: "Mumbai Metro", desc: "Underground and elevated urban rail infrastructure.", img: "https://picsum.photos/id/184/1920/1080" },
];

export default function StackingSections() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".stack-area__panel");

        // Create a context to ensure all ScrollTriggers are killed on unmount
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1px)", () => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${(panels.length - 1) * window.innerHeight}`,
                pin: true,
                pinSpacing: true,
                // This is crucial: it prevents ScrollTrigger from 
                // conflicting with React's DOM updates during refreshes
                anticipatePin: 1,
            });

            panels.forEach((panel, i) => {
                if (i !== 0) {
                    gsap.set(panel, { yPercent: 100 });
                    gsap.to(panel, {
                        yPercent: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: () => `+=${(i - 1) * window.innerHeight}`,
                            end: () => `+=${i * window.innerHeight}`,
                            scrub: true,
                        }
                    });
                }
            });
        });

        return () => mm.revert(); // Manually killing everything if useGSAP cleanup misses it
    }, { scope: containerRef, revertOnUpdate: true });

    return (
        <>
            <section ref={containerRef} className="stack-area">
                {slides.map((slide) => (
                    <div key={slide.id} className="stack-area__panel">
                        <div className="stack-area__bg-wrapper">
                            <img src={slide.img} alt={slide.title} className="stack-area__image" />
                            <div className="stack-area__overlay" />
                        </div>

                        <div className="stack-area__label">
                            <span className="stack-area__orange-bar" />
                            <h2 className="stack-area__label-text">Infrastructure Projects</h2>
                        </div>

                        <div className="stack-area__card">
                            <h3 className="stack-area__card-title">{slide.title}</h3>
                            <p className="stack-area__card-desc">{slide.desc}</p>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}