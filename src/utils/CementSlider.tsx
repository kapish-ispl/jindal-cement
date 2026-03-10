'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Controller } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';

// ... (productData remains the same)
interface ProductData {
    id: number;
    category: string;
    title: string;
    description: string;
    mainimage: string;
    image: string;
}

const productData: ProductData[] = [
    {
        id: 1,
        category: "Portland Slag Cement | Long-Life Performance",
        title: "Jindal Panther Ultima",
        description: "Engineered using processed slag and optimized clinker content, Ultima delivers superior durability, corrosion resistance, and smooth workability. Ideal for demanding infrastructure and industrial construction.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773137442_main-slider-1.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773135797_bag-41.png",
    },
    {
        id: 2,
        category: "Composite Cement | Everyday Reliability",
        title: "Panther Cement – Shield",
        description: "Built for consistent strength across residential and commercial applications. A trusted choice for independent home builders and contractors, offering dependable performance and better finish quality.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773137442_main-slider-1.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773135797_bag-31.png",
    },
    {
        id: 3,
        category: "Sustainable SCM | Low-Carbon Advantage",
        title: "Jindal Panther GGBS",
        description: "Transforms industrial by-products into high-performance supplementary cementitious material. Enables greener concrete with improved lifecycle durability and a reduced carbon footprint.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773137115_main-slider-2.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773135797_bag-21.png",
    },
    {
        id: 4,
        category: "Plain Cement Concrete",
        title: "Jindal Panther Tuffy",
        description: "Designed for high-strength applications and faster structural stability, Panther Tuffy delivers enhanced compressive performance for critical construction stages and heavy-duty requirements.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773137442_main-slider-1.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773135797_bag-11.png",
    }
];

const ProductSlider: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % productData.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + productData.length) % productData.length);
    };

    return (
        <section className='commonSection-lg c-twoColumnContainer'>
            <div className="container-fluid px-5">
                <div className="row align-items-center">

                    {/* LEFT SIDE: BUILDING + BAGS CLUSTER */}
                    <div className="col-lg-7 position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '600px' }}>

                        {/* 1. Background Building */}
                        <div className="bg-image-container">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`bg-${productData[activeIndex].id}`}
                                    src={productData[activeIndex].mainimage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="img-fluid"
                                    alt="building sketch"
                                    style={{ width: '100%', height: '600px' }}
                                />
                            </AnimatePresence>
                        </div>

                        {/* 2. Cement Bags Cluster - ANCHORED CONTAINER */}
                        <div className="bags-stack-wrapper" style={{
                            position: 'absolute',
                            zIndex: 10,
                            width: '600px',
                            height: '600px',
                            perspective: '1500px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            margin: '0 auto' // Centers the fixed-width box in the col-lg-7
                        }}>
                            {productData.map((item, index) => {
                                const isActive = activeIndex === index;
                                const total = productData.length;

                                // Stable 4-item looping math
                                let diff = index - activeIndex;
                                if (diff > total / 2) diff -= total;
                                if (diff < -total / 2) diff += total;

                                // Only hide the bag that is exactly opposite the active one (2 steps away)
                                // to prevent it from flying through the middle.
                                const isHidden = Math.abs(diff) > 1.5;

                                return (
                                    <motion.div
                                        key={`bag-${item.id}`}
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.05 : 0.65,
                                            opacity: isHidden ? 0 : 1,
                                            x: diff * 150,
                                            y: isActive ? -10 : 40,
                                            zIndex: isActive ? 100 : (50 - Math.abs(diff)),
                                            rotateY: isActive ? 0 : (diff < 0 ? 35 : -35),
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 180,
                                            damping: 24
                                        }}
                                        style={{
                                            position: 'absolute',
                                            // Fixing the width of the individual bag div so it doesn't affect flow
                                            width: '240px',
                                            filter: isActive ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.2))' : 'none',
                                            transformStyle: 'preserve-3d',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            // This prevents the hidden bag from being clickable
                                            pointerEvents: isHidden ? 'none' : 'auto'
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="img-fluid"
                                            style={{ width: '100%', height: 'auto', pointerEvents: 'none' }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT SIDE: TEXT CONTENT */}
                    <div className="col-lg-5 ps-lg-5">
                        <div className="content-box" style={{ maxWidth: '500px' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h6 className="c-content-20 ft_bold clr-gray text-uppar lh_1-4" >
                                        {productData[activeIndex].category}
                                    </h6>
                                    <h1 className="c-content-32 clr-peach ft_bold lh_1-2 mb-3" >
                                        {productData[activeIndex].title}
                                    </h1>
                                    <p className="c-content-20 clr-gray lh_1-6 ft_regular" >
                                        {productData[activeIndex].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="d-flex gap-3">
                                <button onClick={handlePrev} className="nav-btn up-btn">
                                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.2644 18.0183L11.5168 13.2706L16.2644 8.52298L14.7007 6.95923L8.38927 13.2706L14.7007 19.582L16.2644 18.0183Z" fill="#636466" />
                                    </svg>

                                </button>
                                <button onClick={handleNext} className="nav-btn down-btn">
                                    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 1.56377L4.74764 6.31141L0 11.0591L1.56375 12.6228L7.87514 6.31141L1.56375 1.81198e-05L0 1.56377Z" fill="#636466" />
                                    </svg>

                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .nav-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid #636466;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    color: #636466;
                }
            `}</style>
        </section>
    );
};

export default ProductSlider;