import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const WasteToValueSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const path1Ref = useRef<SVGPathElement>(null);
    const path2Ref = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!path1Ref.current || !path2Ref.current || !sectionRef.current) return;

        // Get lengths for both paths
        const length1 = path1Ref.current.getTotalLength();
        const length2 = path2Ref.current.getTotalLength();

        // Initialize: Hide both paths
        gsap.set(path1Ref.current, { strokeDasharray: length1, strokeDashoffset: length1 });
        gsap.set(path2Ref.current, { strokeDasharray: length2, strokeDashoffset: length2 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 20%",
                end: "bottom 80%",
                scrub: 1.5,
                markers: false,
            }
        });

        // Sequential Animation: Path 1 draws, THEN Path 2 starts
        tl.to(path1Ref.current, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "none"
        })
            .to(path2Ref.current, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "none"
            });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="commonSection-lg c-twoColumnContainer overflow-hidden position-relative">
            <div className="container cus-container relative">

                {/* SVG 1: Top Right Curve */}
                <div className="svg-container-1">
                    <svg width="546" height="374" viewBox="0 0 546 374" fill="none" xmlns="http://www.w3.org/2000/svg"> <path ref={path1Ref} d="M0 1H522C534.703 1 545 11.2975 545 24V350C545 362.703 534.703 373 522 373H0" stroke="#636466" strokeWidth="2" fill="none" /> </svg>
                </div>

                {/* SVG 2: Bottom Left Curve */}
                <div className="svg-container-2">
                    <svg width="546" height="315" viewBox="0 0 546 315" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            ref={path2Ref}
                            d="M546 1H24C11.2974 1 1 11.2975 1 24V291C1 303.703 11.2974 314 24 314H546"
                            stroke="#636466"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="c-growth-wrapper relative">
                            {/* BLOCK 1: Top Section */}
                            <div className="c-growth-wrapper__header">
                                <div className="row">
                                    <div className="col-12 col-md-5">
                                        <div className="hw">
                                            <div className="c-content-20 ft_bold clr-gray text-uppar lh_1-4">RESOURCE RESPONSIBILITY</div>
                                            <div className="c-heading-60 ft_bold clr-gray lh_1-1">Waste to Value</div>
                                            <div className="genric__content mt-3">
                                                <p className="c-content-20 clr-gray lh_1-6 ft_regular">Industrial by-products from steel manufacturing are responsibly recovered and transformed into Green Cement materials.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                        <div className="c-growth-wrapper__img-node">
                                            <img className="img-fluid" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773207727_2451908c8ca0cbafdb601f69eb082053d40d36ca.png" alt="Factory" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BLOCK 2: Middle Section */}
                            <div className="row">
                                <div className="col-12 col-lg-7 m-auto">
                                    <div className="c-growth-wrapper__img-node text-center">
                                        <img className="img-fluid" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773220262_1773212682_imge-node-2.png" alt="Truck" />
                                    </div>
                                </div>
                            </div>

                            {/* BLOCK 3: Bottom Section */}
                            <div className="row align-items-center">
                                <div className="col-12 col-md-7">
                                    <div className="c-growth-wrapper__img-node">
                                        <img className="img-fluid" src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773207759_198e5ad0014ec59260e8bae94bb34c0b59285c57.png" alt="Plant" />
                                    </div>
                                </div>
                                <div className="col-12 col-md-5">
                                    <div className="c-growth-wrapper__footer-text">
                                        <p className="c-content-20 ft_light">By converting steel slag into <span className="clr-green ft_medium">Green Cement</span>, Jindal Cement reduces waste.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style {...{ jsx: "true" } as any}>{`
                .svg-container-1 {
                    position: absolute;
                        top: 27.8%;
    right: 0;
                    z-index: 1;
                    pointer-events: none;
                }
                .svg-container-2 {
                    position: absolute;
                    top: 61%;
    left: 0;
                    z-index: 1;
                    pointer-events: none;
                }
                .c-growth-wrapper__img-node {
                    position: relative;
                    z-index: 2;
                }
                .relative { position: relative; }
            `}</style>
        </section>
    );
};

export default WasteToValueSection;