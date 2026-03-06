"use client";

import React, { FC, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MilestoneData {
    year: string;
    image: string;
    location: string;
    caption: string;
}

const milestoneEntries: MilestoneData[] = [
    {
        year: "2010",
        image: "https://picsum.photos/1000/600?random=10",
        location: "Raigarh",
        caption: "Initial cement manufacturing capacity established at approximately <span>1 MTPA</span>, marking Naveen Jindal Group's early entry into cement manufacturing."
    },
    {
        year: "2021",
        image: "https://picsum.photos/1000/600?random=11",
        location: "Angul",
        caption: "Expansion of manufacturing unit in Angul with sustainable technology and enhanced safety protocols."
    },
    {
        year: "2022",
        image: "https://picsum.photos/1000/600?random=12",
        location: "Raigarh",
        caption: "Introduction of eco-friendly low-carbon cement solutions, setting new benchmarks in green engineering."
    },
    {
        year: "2023",
        image: "https://picsum.photos/1000/600?random=13",
        location: "Angul",
        caption: "Modernization of process units with precision engineering and advanced automation systems."
    },
    {
        year: "2024",
        image: "https://picsum.photos/1000/600?random=14",
        location: "Raigarh",
        caption: "Capacity roadmap toward 7 MTPA by FY27 initiated, supporting India's infrastructure growth."
    },
    {
        year: "FY27",
        image: "https://picsum.photos/1000/600?random=15",
        location: "Angul",
        caption: "Achieving significant manufacturing milestones with a focus on durability and performance."
    }
];

const MilestoneSection: FC<{ data?: any }> = () => {
    const [activeIndex, setActiveIndex] = useState(0); // Target/Selected index
    const [displayIndex, setDisplayIndex] = useState(0); // Actually rendered index
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const activeMilestone = milestoneEntries[displayIndex];

    return (
        <section className="commonSection-lg c-twoColumnContainer" ref={containerRef}>
            <div className="container cus-container">
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="hw mb-3">
                            <div className="c-content-20 ft_bold clr-gray text-uppar lh_1-4">Our Milestone</div>
                            <div className="c-heading-60 ft_bold clr-gray lh_1-1">Built Through Manufacturing</div>
                        </div>
                        <div className="c-content-20 clr-gray lh_1-6 ft_regular">Jindal Cement's journey is defined by a manufacturing-led approach to growth.</div>
                        <div className="c-content-20 clr-gray lh_1-6 ft_regular mb-3">Capacity has been built in phases—anchored in industrial discipline, integration of steel by-products, and long-term performance requirements.</div>
                        <div className="c-content-20 clr-gray lh_1-6 ft_regular">Each milestone reflects a deliberate step toward scalable, responsible cement manufacturing aligned with India's infrastructure needs.</div>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* Middle: Vertical Tabs */}
                        <div className="milestone-section__tabs-wrapper">
                            <div className="milestone-section__tabs">
                                {milestoneEntries.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`milestone-section__tab ${index === activeIndex ? 'active' : ''}`}
                                        onClick={() => handleTabClick(index)}
                                    >
                                        {item.year}
                                    </div>
                                ))}
                            </div>
                            <div className="milestone-section__wrapper" ref={imageContainerRef}>
                                {milestoneEntries.map((item, index) => (
                                    <img
                                        key={index}
                                        src={item.image}
                                        alt={item.year}
                                        className={`milestone-image ${index === displayIndex ? 'milestone-image-active' : ''}`}
                                        style={{ opacity: index === displayIndex ? 1 : 0 }}
                                    />
                                ))}
                                <div className="milestone-overlay" ref={contentRef}>
                                    <div className="location">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        {activeMilestone.location}
                                    </div>
                                    <p className="caption" dangerouslySetInnerHTML={{ __html: activeMilestone.caption }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MilestoneSection;
