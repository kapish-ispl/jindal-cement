"use client";

import React, { useRef, useMemo, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SplitType from "split-type";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface PanelProps {
    heading: string;
    imgsrc: string;
    mobimgsrc?: string;
    children?: ReactNode;
}

interface Panel {
    id: number;
    heading: string;
    img: string;
    mobImg?: string;
    children?: ReactNode;
}

export interface ScrollAnimationProps {
    data: ReactNode[];
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ data }) => {
    const main = useRef<HTMLDivElement | null>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);
    const device = useDeviceType();

    const panelsData: Panel[] = useMemo(() => {
        if (!data) return [];

        return data
            .filter((item): item is React.ReactElement<PanelProps> =>
                React.isValidElement(item)
            )
            .map((item, index) => ({
                id: index + 1,
                heading: item.props.heading,
                img: item.props.imgsrc,
                mobImg: item.props.mobimgsrc,
                children: item.props.children,
            }));
    }, [data]);

    const setActiveDot = (dots: HTMLElement[], index: number) => {
        dots.forEach((dot) => dot.classList.remove("active"));
        if (dots[index]) dots[index].classList.add("active");
    };

    useGSAP(
        () => {
            if (panelsData.length === 0) return;

            const dots = gsap.utils.toArray<HTMLElement>(".dot");
            const splitInstances: SplitType[] = [];

            gsap.set(".nav-dots", { autoAlpha: 0 });
            gsap.set(".panel", { zIndex: 0, autoAlpha: 0 });
            gsap.set(".panel-1", { zIndex: 2, autoAlpha: 1 });
            setActiveDot(dots, 0);

            timeline.current = gsap.timeline({
                scrollTrigger: {
                    trigger: ".panels-container",
                    start: "top top",
                    end: () => `+=${(panelsData.length - 1.25) * 100}%`,
                    pin: true,
                    scrub: 2,
                    invalidateOnRefresh: true,
                    onEnter: () => gsap.to(".nav-dots", { autoAlpha: 1 }),
                    onLeave: () => gsap.to(".nav-dots", { autoAlpha: 0 }),
                    onEnterBack: () => gsap.to(".nav-dots", { autoAlpha: 1 }),
                    onLeaveBack: () => gsap.to(".nav-dots", { autoAlpha: 0 }),
                    onUpdate: (self) => {
                        const idx = Math.round(
                            self.progress * (panelsData.length - 1)
                        );
                        setActiveDot(dots, idx);
                    },
                },
            });

            panelsData.forEach((panel) => {
                const panelSelector = `.panel-${panel.id}`;
                const headingEl =
                    main.current?.querySelector(`.heading-${panel.id}`);

                if (!headingEl) return;

                const split = new SplitType(headingEl as HTMLElement, {
                    types: "chars",
                });
                splitInstances.push(split);

                // Parallax effect
                timeline.current!.fromTo(
                    `${panelSelector} .parallax-img`,
                    { scale: 1.15 },
                    { scale: 1, ease: "power2.inOut", duration: 1 },
                    panel.id - 1
                );

                // Crossfade effect
                if (panel.id > 1) {
                    const prevSelector = `.panel-${panel.id - 1}`;
                    const duration = 0.8;

                    timeline.current!.set(panelSelector, { zIndex: 2 });
                    timeline.current!.set(prevSelector, { zIndex: 1 });

                    timeline.current!.fromTo(
                        panelSelector,
                        { autoAlpha: 0, backdropFilter: "blur(12px)" },
                        { autoAlpha: 1, backdropFilter: "blur(0px)", duration },
                        panel.id - 1
                    );

                    timeline.current!.to(
                        prevSelector,
                        {
                            autoAlpha: 0,
                            backdropFilter: "blur(12px)",
                            duration,
                        },
                        panel.id - 1
                    );
                }

                // Split text animation
                timeline.current!.from(
                    split.chars,
                    {
                        y: 50,
                        opacity: 0,
                        stagger: 0.05,
                        ease: "power2.out",
                    },
                    panel.id - 1
                );
            });

            const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);

            return () => {
                clearTimeout(refreshTimeout);
                splitInstances.forEach((s) => s.revert());
            };
        },
        { scope: main, dependencies: [panelsData] }
    );

    // ---- Render UI ----
    return (
        <div ref={main} className="scroll-animation-container">
            <div className="panels-container">
                {panelsData.map((panel) => (
                    <section key={panel.id} className={`panel panel-${panel.id}`}>
                        <div className="parallax-container">
                            <img
                                src={device === "desktop" ? panel.img : panel.mobImg}
                                alt={panel.heading}
                                className="parallax-img"
                            />
                        </div>

                        <div className="container cus-container h-100">
                            <div className="row h-100">
                                <div className="col-12 h-100">
                                    <div className="scrollable_box_content h-100">
                                        <div className="scrollable_box_content_head">
                                            <h2 className={`pannel-heading c-heading-65 clr-green heading-${panel.id}`}>
                                                {panel.heading}
                                            </h2>
                                        </div>

                                        {panel.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {panelsData.length > 1 && (
                <nav className="nav-dots">
                    <ul>
                        {panelsData.map((_, i) => (
                            <li key={i} className="dot"></li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ScrollAnimation;
