"use client";

import { FC, ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Project {
    title: string;
    description: string;
    image: string;
}

const projects: Project[] = [
    {
        title: "Phulwari Bridge",
        description:
            "Bridge infrastructure supporting reinforced foundations and long-term structural performance.",
        image: "https://picsum.photos/1920/1080?random=1",
    },
    {
        title: "River Dam Project",
        description:
            "Water infrastructure designed for long-term environmental sustainability.",
        image: "https://picsum.photos/1920/1080?random=2",
    },
    {
        title: "Metro Rail Tunnel",
        description:
            "Urban underground transport infrastructure supporting smart mobility.",
        image: "https://picsum.photos/1920/1080?random=3",
    },
    {
        title: "Coastal Highway",
        description:
            "Advanced highway engineering built for durability and performance.",
        image: "https://picsum.photos/1920/1080?random=4",
    },
];

interface StackProjectsProps {
    data?: any;
}

const StackProjects: FC<StackProjectsProps> = ({ data }) => {
    const container = useRef<HTMLDivElement | null>(null);

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
            {projects.map((project, index) => (
                <div
                    key={index}
                    className="stack-projects__card"
                    style={{ backgroundImage: `url(${project.image})` }}
                >
                    <div className="stack-projects__overlay">
                        <div className="stack-projects__content">
                            <h2 className="stack-projects__heading">
                                <span className="stack-projects__accent"></span>
                                Infrastructure Projects
                            </h2>

                            <h3 className="stack-projects__title">{project.title}</h3>

                            <p className="stack-projects__description">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default StackProjects;