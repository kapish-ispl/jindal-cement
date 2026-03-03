"use client";

import React, { FC, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface CustomZoomScrollEffectProps {
    videourl: string;
}
const CustomZoomScrollEffect: FC<CustomZoomScrollEffectProps> = ({ videourl }) => {

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLVideoElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [showNextSection, setShowNextSection] = useState(false);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        let ctx: gsap.Context | null = null;

        const createTimeline = (endValue: string) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "-200px",
                    end: endValue,
                    scrub: true,
                    //pin: true,
                    // markers: true, // enable to debug
                    onUpdate: (self) => {
                        // When scroll progress reaches end
                        if (self.progress >= 0.4) {
                            setShowNextSection(true);
                        } else {
                            setShowNextSection(false);
                        }
                    },
                },
            });

            tl.to(imageWrapperRef.current, {
                width: "100%",
                ease: "power4.out",
            });

            tl.to(
                contentRef.current,
                {
                    y: 300,
                    opacity: 0,
                    ease: "power4.out",
                },
                "<"
            );
        };

        const createMobileTabletTimeline = (endValue: string) => {
            // Start fullwidth
            gsap.set(imageWrapperRef.current, { width: "200%" });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "-600px",
                    end: endValue,
                    scrub: true,
                    // markers: true,
                    onUpdate: (self) => {
                        if (self.progress >= 0.4) {
                            setShowNextSection(true);
                        } else {
                            setShowNextSection(false);
                        }
                    },
                },
            });

            // Shrink image on scroll
            tl.to(imageWrapperRef.current, {
                width: "100%",
                ease: "power2.out",
            });
        };

        ctx = gsap.context(() => {
            mm.add("(min-width: 1200px)", () => createTimeline("+=80%"));
            mm.add("(min-width: 992px) and (max-width: 1199px)", () => createTimeline("+=80%"));
            mm.add("(max-width: 991px)", () => createMobileTabletTimeline("+=80%"));
        }, sectionRef);

        if (imgRef.current) {
            // For video elements, check readyState and listen for 'loadeddata'
            if (imgRef.current.readyState < 4) {
                const onLoaded = () => {
                    ScrollTrigger.refresh();
                };
                imgRef.current.addEventListener("loadeddata", onLoaded, { once: true });
            } else {
                ScrollTrigger.refresh();
            }
        }

        return () => {
            if (ctx) ctx.revert();
            mm.revert();
        };
    }, []);


    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <section
                        ref={sectionRef}
                        className="zoomSection"
                        aria-label="image zoom pin"
                    >
                        <div className="zoomInner">
                            {/* Right - Image */}
                            <div ref={imageWrapperRef} className="zoomImageWrapper">
                                <video className="zoomImage" ref={imgRef} autoPlay muted loop playsInline>
                                    <source src={videourl} type="video/mp4" />
                                </video>
                            </div>
                            {/* Left - Content */}
                            <div ref={contentRef} className="zoomContent">
                                <div className="genric__content">
                                    <p className="c-content-24 ft_light">At the heart of our growth lies a deep commitment to people. Through education, sports, healthcare, women empowerment, skill-building and sustainable development, we&apos;ve touched over
                                        <span className="font-bold"> 14 million lives -</span> and we’re just getting started.
                                    </p>
                                </div>

                                <div className="action-btn mt-30">
                                    <a className="u-btn clr-green" href="#">
                                        <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M29.2084 0.556544C29.9723 -0.185706 31.211 -0.18533 31.9751 0.556544L44.4269 12.6558C45.191 13.3983 45.191 14.6017 44.4269 15.3442L31.9751 27.4435C31.211 28.1853 29.9723 28.1857 29.2084 27.4435C28.4446 26.7012 28.445 25.4976 29.2084 24.7551L38.3204 15.9011L1.39012e-06 15.9011L1.05772e-06 12.0989L38.3204 12.0989L29.2084 3.24486C28.445 2.50238 28.4446 1.29879 29.2084 0.556544Z" fill="#4FB848" />
                                        </svg>

                                    </a>
                                </div>
                            </div>
                        </div>
                        <section className={`d-none d-lg-flex nextSection ${showNextSection ? "visible" : "invisible"}`}>
                            <div className="action-btn mt-30 mb-0 pb-0">
                                <a className="u-btn clr-green" href="#">
                                    <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M29.2084 0.556544C29.9723 -0.185706 31.211 -0.18533 31.9751 0.556544L44.4269 12.6558C45.191 13.3983 45.191 14.6017 44.4269 15.3442L31.9751 27.4435C31.211 28.1853 29.9723 28.1857 29.2084 27.4435C28.4446 26.7012 28.445 25.4976 29.2084 24.7551L38.3204 15.9011L1.39012e-06 15.9011L1.05772e-06 12.0989L38.3204 12.0989L29.2084 3.24486C28.445 2.50238 28.4446 1.29879 29.2084 0.556544Z" fill="#4FB848" />
                                    </svg>
                                </a>
                            </div>
                        </section>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default CustomZoomScrollEffect;
