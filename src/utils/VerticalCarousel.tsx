'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useDeviceType } from '@/hooks/useDeviceType';

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

    const thumbHeight = totalSlides > 0 ? (1 / totalSlides) * 100 : 0;
    const thumbTop = totalSlides > 0 ? ((activeIndex - 1) / totalSlides) * 100 : 0;
    const deviceType = useDeviceType();

    return (
        <div className="carousel-wrapper">
            <Swiper
                direction={deviceType === 'desktop' ? 'vertical' : 'horizontal'}
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
                className="mySwiper c-swiperSlider"
            >
                <SwiperSlide>
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-6">
                            <div className="hw">
                                <div className="c-content-32 clr-peach ft_bold lh_1-2 mb-3">Building India’s Next Decade of Infrastructure.</div>
                                <div className="c-content-20 clr-gray lh_1-6 ft_regular">Jindal Cement continues to invest in new grinding units, modernisation, and sustainable
                                    manufacturing to support India’s next decade of growth.</div>
                                <div className="action-btn mt-30">
                                    <a href="#" target="_blank" className="u-btn clr-green">
                                        <svg fill="none" height="28" viewBox="0 0 45 28" width="45" xmlns="http://www.w3.org/2000/svg"> <path d="M29.2084 0.556544C29.9723 -0.185706 31.211 -0.18533 31.9751 0.556544L44.4269 12.6558C45.191 13.3983 45.191 14.6017 44.4269 15.3442L31.9751 27.4435C31.211 28.1853 29.9723 28.1857 29.2084 27.4435C28.4446 26.7012 28.445 25.4976 29.2084 24.7551L38.3204 15.9011L1.39012e-06 15.9011L1.05772e-06 12.0989L38.3204 12.0989L29.2084 3.24486C28.445 2.50238 28.4446 1.29879 29.2084 0.556544Z" fill="#4FB848"></path> </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-5 offset-lg-1">
                            <div className="twoColumnContainer__image">
                                <img src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1772442022_OBJECTS.png" alt="india map image" className="img-fluid u-img" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>Slide 2 Content</SwiperSlide>
                <SwiperSlide>Slide 3 Content</SwiperSlide>
                <SwiperSlide>Slide 4 Content</SwiperSlide>
                <SwiperSlide>Slide 5 Content</SwiperSlide>
            </Swiper>

            {/* Custom Pagination Container - Moved back to React for smooth transition */}
            <div className="custom-pagination">
                <div className="fraction">{activeIndex} / {totalSlides}</div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ height: `${thumbHeight}%`, top: `${thumbTop}%` }}></div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="nav-buttons">
                <button className="up-btn"><span><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.52366 16.2646L13.2713 11.517L18.019 16.2646L19.5827 14.7009L13.2713 8.38951L6.95991 14.7009L8.52366 16.2646Z" fill="#636466" />
                </svg>
                </span></button>
                <button className="down-btn"><span><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.52366 16.2646L13.2713 11.517L18.019 16.2646L19.5827 14.7009L13.2713 8.38951L6.95991 14.7009L8.52366 16.2646Z" fill="#636466" />
                </svg>
                </span></button>
            </div>
        </div>
    );
}
