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
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772791406_Rectangle658.jpg",
    },
    {
        title: "River Dam Project",
        description:
            "Water infrastructure designed for long-term environmental sustainability.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772791406_Rectangle660.jpg",
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
                >   <div className="stack-projects__overlay">
                        <div className="container cus-container h-100">
                            <div className="row h-100">
                                <div className="col-12 h-100">
                                    <div className="stack-projects__content">
                                        <div className="hw">
                                            <h2 className="stack-projects__heading c-content-32 ft_bold clr-white">
                                                <span className="stack-projects__accent"></span>
                                                Infrastructure Projects
                                            </h2>

                                        </div>
                                        <div className="hw">
                                            <h3 className="stack-projects__title c-content-32 ft_bold clr-white">{project.title}</h3>

                                            <p className="stack-projects__description c-content-20 clr-white ft_regular lh_1-6">
                                                {project.description}
                                            </p>

                                        </div>

                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default StackProjects;