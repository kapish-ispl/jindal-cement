'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function VerticalCarousel() {
    const [activeIndex, setActiveIndex] = useState(1);
    const [totalSlides, setTotalSlides] = useState(0);

    const handleSlideChange = (swiper: any) => {
        // Swiper realIndex starts at 0, so we add 1 for display
        setActiveIndex(swiper.realIndex + 1);
    };

    const handleSwiper = (swiper: any) => {
        setTotalSlides(swiper.slides.length - (swiper.params.loop ? swiper.loopedSlides * 2 : 0));
        setTotalSlides(swiper.slides.filter((slide: any) => !slide.classList.contains('swiper-slide-duplicate')).length);
    };

    const progress = totalSlides > 0 ? (activeIndex / totalSlides) * 100 : 0;

    return (
        <div className="carousel-wrapper">
            <Swiper
                direction={'vertical'}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                allowTouchMove={false}
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiper}
                navigation={{
                    nextEl: '.down-btn',
                    prevEl: '.up-btn',
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>Slide 1 Content</SwiperSlide>
                <SwiperSlide>Slide 2 Content</SwiperSlide>
                <SwiperSlide>Slide 3 Content</SwiperSlide>
                <SwiperSlide>Slide 4 Content</SwiperSlide>
                <SwiperSlide>Slide 5 Content</SwiperSlide>
            </Swiper>

            {/* Custom Pagination Container - Moved back to React for smooth transition */}
            <div className="custom-pagination">
                <div className="fraction">{activeIndex} / {totalSlides}</div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ height: `${progress}%` }}></div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="nav-buttons">
                <button className="up-btn">↑</button>
                <button className="down-btn">↓</button>
            </div>
        </div>
    );
}
