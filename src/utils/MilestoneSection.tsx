"use client";

import React, { FC, useState, useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import parse from "html-react-parser";

interface MilestoneData {
    year: string;
    imgsrc: string;
    location: string;
    caption: string;
}

const MilestoneSection: FC<{ data?: any, children?: ReactNode }> = ({ data, children }) => {
    const [activeIndex, setActiveIndex] = useState(0); // Target/Selected index
    const [displayIndex, setDisplayIndex] = useState(0); // Actually rendered index
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const containerRef = document.querySelector('#milestoneSection') as HTMLElement;
    const { contextSafe } = useGSAP({ scope: containerRef });

    const handleTabClick = contextSafe((index: number) => {
        if (index === activeIndex) return;

        setActiveIndex(index);

        const tl = gsap.timeline();
        const images = gsap.utils.toArray<HTMLImageElement>(".milestone-image", imageContainerRef.current);

        tl.to([images, contentRef.current], {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setDisplayIndex(index);
            }
        });

        tl.to([".milestone-image-active", contentRef.current], {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    });


    const filteredItems = data?.filter((item: any) => typeof item !== "string") || React.Children.toArray(children);
    const activeMilestone = filteredItems[displayIndex];

    return (
        <>
            {/* Middle: Vertical Tabs */}
            <div className="milestone-section__tabs-wrapper">
                <div className="milestone-section__tabs">
                    {filteredItems.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`milestone-section__tab ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {item.props.year}
                        </div>
                    ))}
                </div>
                <div className="milestone-section__wrapper" ref={imageContainerRef}>
                    {filteredItems.map((item: any, index: number) => (
                        <img
                            key={index}
                            src={item.props.imgsrc}
                            alt={item.props.year}
                            className={`milestone-image ${index === displayIndex ? 'milestone-image-active' : ''}`}
                            style={{ opacity: index === displayIndex ? 1 : 0 }}
                        />
                    ))}
                    <div className="milestone-overlay" ref={contentRef}>
                        <div className="location ft_medium lh_1-2 clr-primary">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            {activeMilestone.props.location}
                        </div>
                        <p className="caption c-content-20 clr-white ft_medium lh_1-6">{parse(activeMilestone.props.caption)}</p>
                        <div className="action-btn">
                            <Link className="u-btn clr-green" href="/our-story"><svg fill="none" height="28" viewBox="0 0 45 28" width="45" xmlns="http://www.w3.org/2000/svg"> <path d="M29.2084 0.556544C29.9723 -0.185706 31.211 -0.18533 31.9751 0.556544L44.4269 12.6558C45.191 13.3983 45.191 14.6017 44.4269 15.3442L31.9751 27.4435C31.211 28.1853 29.9723 28.1857 29.2084 27.4435C28.4446 26.7012 28.445 25.4976 29.2084 24.7551L38.3204 15.9011L1.39012e-06 15.9011L1.05772e-06 12.0989L38.3204 12.0989L29.2084 3.24486C28.445 2.50238 28.4446 1.29879 29.2084 0.556544Z" fill="#4FB848"></path> </svg> </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MilestoneSection;
