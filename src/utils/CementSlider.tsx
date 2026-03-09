'use client'
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
interface ProductData { id: number; category: string; title: string; description: string; image: string; }
const productData: ProductData[] = [
    {
        id: 1,
        category: "PLAIN CEMENT CONCRETE",
        title: "Jindal Panther Tuffy",
        description: "Designed for high-strength applications and faster structural stability, Panther Tuffy delivers enhanced compressive performance for critical construction stages.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772825991_bag1.png",
    },
    {
        id: 2,
        category: "COMPOSITE & SLAG CEMENT",
        title: "Jindal Panther Shield",
        description: "Built for consistent strength across residential and commercial applications. A trusted choice for independent home builders and contractors.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772826065_bag4.png",
    },
    {
        id: 3,
        category: "GROUND GRANULATED BLAST FURNACE SLAG",
        title: "Jindal Panther GGBS",
        description: "Transforms industrial by-products into high-performance supplementary cementitious material. Enables greener concrete with improved durability.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772825992_bag2.png",
    },
    {
        id: 4,
        category: "GROUND GRANULATED BLAST FURNACE SLAG",
        title: "Jindal Panther GGBS",
        description: "Transforms industrial by-products into high-performance supplementary cementitious material. Enables greener concrete with improved durability.",
        image: "https://d2lptvt2jijg6f.cloudfront.net/document/126/1772825979_bag3.png",
    }
];
const ProductSlider: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.realIndex);
    };

    return (
        <section className="product-slider">
            <div className="product-slider__container">

                {/* Left Side */}
                <div className="product-slider__visuals">

                    <Swiper
                        modules={[EffectFade]}
                        effect="fade"
                        speed={600}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={handleSlideChange}
                        className="product-slider__swiper"
                    >
                        {productData.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="product-slider__image-wrapper">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="product-slider__product-img"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

                {/* Right Side */}
                <div className="product-slider__content">
                    <span className="product-slider__category">
                        {productData[activeIndex].category}
                    </span>

                    <h2 className="product-slider__title">
                        {productData[activeIndex].title}
                    </h2>

                    <p className="product-slider__description">
                        {productData[activeIndex].description}
                    </p>

                    <div className="product-slider__controls">

                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="product-slider__btn"
                        >
                            &lt;
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="product-slider__btn"
                        >
                            &gt;
                        </button>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProductSlider;