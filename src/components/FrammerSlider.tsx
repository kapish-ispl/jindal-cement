import React, { useState, useEffect, useRef, useMemo } from "react";
import { easeInOut, motion, useAnimation } from "framer-motion";

interface FrammerSliderProps {
    data: React.ReactNode | React.ReactNode[];
    showprogress?: "yes" | "no";
    showdots?: "yes" | "no";
    duration?: number;
}

// What we actually use after extracting props from each child
interface SlideGroup {
    id: number;
    region?: string;
    title?: string;
    caption?: string;
    subtitle?: string;
    src: string;
    link?: React.ReactNode;
    progressTitle?: string;
}
interface SlideChildProps {
    region?: string;
    title?: string;
    caption?: string;
    subtitle?: string;
    mediasrc: string;
    progresstitle?: string;
    children?: React.ReactNode;
}
interface DotButtonProps {
    selected: boolean;
    title: string;
    onClick: () => void;
}
const FrammerSlider: React.FC<FrammerSliderProps> = ({ data, showprogress = "yes", showdots = "no", duration = 7000 }) => {

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const progressControls = useAnimation();

    const startTimeRef = useRef<number | null>(null);
    const pauseElapsedRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const slides = useMemo<SlideGroup[]>(() => {
        if (!data) return [];

        return React.Children.toArray(data)
            .filter((child): child is React.ReactElement<SlideChildProps> => React.isValidElement<SlideChildProps>(child)
            )
            .map((child, index) => {
                const { region, title, caption, subtitle, mediasrc, progresstitle, children } = child.props;

                const link = typeof children === "string" && children.trim().length === 0 ? '' : children;

                return {
                    id: index + 1,
                    region,
                    title,
                    caption,
                    subtitle,
                    src: mediasrc,
                    progressTitle: progresstitle,
                    link,
                };
            })
            .filter((slide) => !!slide.src);
    }, [data]);



    const startProgress = (remainingTime = Number(duration), fromPercent = -100) => {
        startTimeRef.current = Date.now();
        progressControls.start({
            x: [fromPercent + "%", "100%"],
            transition: {
                duration: remainingTime / 1000,
                ease: easeInOut,
            },
        });

        timerRef.current = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, remainingTime);
    };


    const stopProgress = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        progressControls.stop();
    };

    useEffect(() => {
        stopProgress();
        pauseElapsedRef.current = 0;
        startProgress();
        return () => stopProgress();
    }, [activeIndex]);

    const handlePause = () => {
        if (!startTimeRef.current) return;
        stopProgress();
        pauseElapsedRef.current = Date.now() - startTimeRef.current;
    };

    const handleResume = () => {
        if (pauseElapsedRef.current > 0) {
            const elapsed = pauseElapsedRef.current;
            const remaining = duration - elapsed;
            const fromPercent = (elapsed / duration) * 200 - 100;
            startProgress(remaining, fromPercent);
            pauseElapsedRef.current = 0;
        }
    };

    const DotButton: React.FC<DotButtonProps> = ({ selected, onClick, title }) => (
        <div className={`dot__item ${selected ? 'active' : ''}`} onClick={onClick}>
            <span>{title}</span>
            <button
                className="dot"
                type="button"
                aria-label="Go to slide"
            />
        </div>
    );
    return (
        <div className="frammer-slider-container">
            <div className="slider-main" onMouseEnter={handlePause} onMouseLeave={handleResume}>
                {slides.map((slide, index) => {
                    return (
                        <div key={slide.id} className={`slide-wrapper ${index === activeIndex ? "active" : ""}`}>
                            <img src={slide.src} alt={slide.title} className="slide-image" />

                            <div className="container cus-container h-100">
                                <div className="row h-100">
                                    <div className="col-12 h-100">
                                        <div className="text-overlay h-100">
                                            {slide.title !== "" && slide.title !== undefined && (
                                                <div style={{ overflow: "hidden", display: "block" }}>
                                                    <h2><span>{slide.title}</span><span className="desc">{slide.caption}</span></h2>
                                                </div>
                                            )}
                                            {
                                                slide.region !== "" && slide.region !== undefined && (
                                                    <div style={{ overflow: "hidden", display: "block" }}>
                                                        <p>{slide.region}</p>
                                                    </div>
                                                )
                                            }
                                            {
                                                slide.subtitle !== "" && slide.subtitle !== undefined && (
                                                    <div style={{ overflow: "hidden", display: "block" }}>
                                                        <h4 className="subtitle">{slide.subtitle}</h4>
                                                    </div>
                                                )
                                            }
                                            {
                                                slide.link !== "" && slide.link !== undefined && (
                                                    <div style={{ overflow: "hidden", display: "block" }}>
                                                        <span>
                                                            {slide.link}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {showdots === "yes" && (
                                            <div className="nav-dots">
                                                {slides.map((item, index: number) => (
                                                    <DotButton
                                                        key={`group-dot-${index}`}
                                                        title={item.title || ""}
                                                        selected={index === activeIndex}
                                                        onClick={() => setActiveIndex(index)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Progress bar */}
                {showprogress === "yes" && (
                    <div className="progress-bar-container">
                        <div className="container cus-container">
                            <div className="row">
                                <div className="col-12 d-flex gap-50">
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`progress-segment-wrapper ${activeIndex === index ? "active" : ""
                                                }`}
                                        >
                                            <motion.div className="progress-content-wrapper" onMouseEnter={handlePause}
                                                onMouseLeave={handleResume}
                                                onClick={() => setActiveIndex(index)}
                                                whileHover={
                                                    activeIndex !== index ? "hover" : "rest"
                                                }
                                                initial="rest"
                                                animate="rest"
                                            >
                                                <motion.div
                                                    variants={{
                                                        rest: { opacity: 1, y: 0 },
                                                        hover: {
                                                            y: -140,
                                                            transition: {
                                                                duration: 0.5,
                                                                ease: "easeInOut",
                                                            },
                                                        },
                                                    }}
                                                    className="progress-title"
                                                >
                                                    {slide?.progressTitle || slide.title}
                                                </motion.div>

                                                {activeIndex !== index && (
                                                    <motion.img
                                                        src={slide.src}
                                                        alt={slide.title}
                                                        className="progress-image"
                                                        variants={{
                                                            rest: { opacity: 0, y: 30 },
                                                            hover: {
                                                                opacity: 1,
                                                                y: 0,
                                                                transition: {
                                                                    duration: 0.5,
                                                                    ease: "easeInOut",
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </motion.div>

                                            <motion.div
                                                className="progress-segment"
                                                onMouseEnter={handlePause}
                                                onMouseLeave={handleResume}
                                                onClick={() => setActiveIndex(index)}
                                            >
                                                {activeIndex === index && (
                                                    <motion.div
                                                        className="progress-fill"
                                                        initial={{ x: "-100%" }}
                                                        animate={progressControls}
                                                    />
                                                )}
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrammerSlider;
