"use client";

import { FC, ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

interface Project {
    title: string;
    description: string;
    image: string;
}

interface StackProjectsProps {
    data?: any;
    children?: ReactNode;
}

const StackProjects: FC<StackProjectsProps> = ({ data, children }) => {
    const container = useRef<HTMLDivElement | null>(null);
    console.log(data)
    const filteredItems = data?.filter((item: any) => typeof item !== "string") || React.Children.toArray(children);
    console.log(filteredItems)
    useGSAP(
        () => {
            const items = gsap.utils.toArray<HTMLDivElement>(".stack-projects__card");

            if (items.length === 0) return;

            // initial position (stacked below)
            gsap.set(items, {
                yPercent: (i) => (i === 0 ? 0 : 100),
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: () => `+=${window.innerHeight * (items.length - 1)}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            items.forEach((card, i) => {
                if (i === 0) return;

                tl.to(card, {
                    yPercent: 0,
                    duration: 1,
                    ease: "none",
                });
            });
        },
        { scope: container }
    );

    return (
        <section className="stack-projects" ref={container}>
            {filteredItems.map((project: any, index: number) => (
                <div
                    key={index}
                    className="stack-projects__card"
                    style={{ backgroundImage: `url(${project.props.imgsrc})` }}
                >
                    {project.props.children}
                </div>
            ))}
        </section>
    );
};

export default StackProjects;