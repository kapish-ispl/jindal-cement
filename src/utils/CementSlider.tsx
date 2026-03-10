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
        category: "PLAIN CEMENT CONCRETE",
        title: "Jindal Panther Tuffy",
        description: "Designed for high-strength applications and faster structural stability, Panther Tuffy delivers enhanced compressive performance for critical construction stages.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059985_slider-background-01.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059999_image97.png",
    },
    {
        id: 2,
        category: "COMPOSITE & SLAG CEMENT",
        title: "Jindal Panther Shield",
        description: "Built for consistent strength across residential and commercial applications. A trusted choice for independent home builders and contractors.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059985_slider-background-01.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059999_image96.png",
    },
    {
        id: 3,
        category: "GROUND GRANULATED BLAST FURNACE SLAG",
        title: "Jindal Panther GGBS",
        description: "Transforms industrial by-products into high-performance supplementary cementitious material. Enables greener concrete with improved durability.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059985_slider-background-01.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059999_image98.png",
    },
    {
        id: 4,
        category: "GROUND GRANULATED BLAST FURNACE SLAG",
        title: "Jindal Panther GGBS",
        description: "Transforms industrial by-products into high-performance supplementary cementitious material. Enables greener concrete with improved durability.",
        mainimage: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059985_slider-background-02.png",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1773059999_image-99.png",
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
        <section className='product-slider-section' style={{ background: '#F2F2F2', padding: '100px 0', overflow: 'hidden' }}>
            <div className="container-fluid px-5">
                <div className="row align-items-center">

                    {/* LEFT SIDE: BUILDING + BAGS CLUSTER */}
                    <div className="col-lg-7 position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '600px' }}>

                        {/* 1. Background Building (Fast Fade) */}
                        <div className="bg-image-container" style={{ position: 'absolute', top: '10%', left: '0', width: '100%', zIndex: 1 }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={`bg-${productData[activeIndex].id}`}
                                    src={productData[activeIndex].mainimage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }} // Sketch opacity
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }} // Quicker fade
                                    className="img-fluid"
                                    alt="building sketch"
                                />
                            </AnimatePresence>
                        </div>

                        {/* 2. Cement Bags Cluster (Showing 4 Bags) */}
                        <div className="bags-stack" style={{
                            position: 'relative',
                            zIndex: 10,
                            width: '100%',
                            height: '450px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            perspective: '1500px' // Increased perspective for better 3D
                        }}>
                            {productData.map((item, index) => {
                                const isActive = activeIndex === index;
                                const total = productData.length;

                                // Looping distance math
                                let diff = index - activeIndex;
                                if (diff > total / 2) diff -= total;
                                if (diff < -total / 2) diff += total;

                                // To show 4 bags, we keep items where distance is up to 2
                                const isVisible = Math.abs(diff) <= 2;

                                return (
                                    <motion.div
                                        key={`bag-${item.id}`}
                                        initial={false}
                                        animate={{
                                            opacity: isVisible ? 1 : 0,
                                            scale: isActive ? 1.05 : 0.65,
                                            // Spread them out slightly more so 4 bags are distinct
                                            x: diff * 125,
                                            y: isActive ? -10 : 30,
                                            zIndex: isActive ? 100 : (50 - Math.abs(diff)),
                                            rotateY: isActive ? 0 : (diff < 0 ? 25 : -25),
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 160,
                                            damping: 22
                                        }}
                                        style={{
                                            position: 'absolute',
                                            width: '260px',
                                            filter: isActive ? 'drop-shadow(0 30px 50px rgba(0,0,0,0.18))' : 'none',
                                            transformStyle: 'preserve-3d',
                                            cursor: 'pointer',
                                            pointerEvents: isVisible ? 'auto' : 'none'
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <img src={item.image} alt={item.title} className="img-fluid" />
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
                                    transition={{ duration: 0.3 }} // Quicker text fade
                                >
                                    <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#888', letterSpacing: '2px', fontSize: '13px' }}>
                                        {productData[activeIndex].category}
                                    </h6>
                                    <h1 className="display-4 fw-bold mb-4" style={{ color: '#D28B5E', lineHeight: '1.1', fontSize: '2.8rem' }}>
                                        {productData[activeIndex].title}
                                    </h1>
                                    <p className="text-secondary mb-5" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                                        {productData[activeIndex].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="d-flex gap-3">
                                <button onClick={handlePrev} className="nav-btn">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <button onClick={handleNext} className="nav-btn">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
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
                    border: 1px solid #ddd;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    color: #555;
                }
                .nav-btn:hover {
                    background: #D28B5E;
                    border-color: #D28B5E;
                    color: white;
                    transform: scale(1.05);
                }
            `}</style>
        </section>
    );
};

export default ProductSlider;