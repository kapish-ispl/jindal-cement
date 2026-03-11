"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SustainabilityScroll() {
  // Specify <HTMLDivElement> so TypeScript knows it has 'scrollWidth'
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;

    // FIX: Add this guard clause
    if (!section || !trigger) return;

    // Now TypeScript knows 'section' and 'trigger' are not null
    const pin = gsap.to(section, {
      x: () => -(section.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + (section.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true,
      },
    });

    return () => {
      pin.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    /* Main wrapper: added bg-white to match your image */
    <div className="scroll-outer-overflow bg-white" ref={triggerRef}>
      <div ref={sectionRef} className="scroll-inner-flex">

        {/* PART 1: Steel By-Products (Your provided markup) */}
        <div className="scroll-part-section">
          <div className="commonSection-lg c-scrollSection h-100 pt-5 pb-0">
            <div className="container-fluid main-container h-100 d-flex flex-column">

              <div className="container cus-container content-area ">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-12">
                    <div className="hw">
                      <div className="c-content-20 ft_bold lh_1-4 clr-gray mb-2">Sustainability</div>
                      <div className="c-heading-60 ft_bold lh_1-1 mb-1"><span className="clr-gray">Manufacturing Cement, </span><span className="clr-green">The Responsible Way.</span></div>
                      <div className="c-content-20 ft_regular lh_1-6 clr-gray">Sustainability at Jindal Cement is built through circular manufacturing. Steel by-products
                        are recovered, transported to our cement plants, and transformed into Portland Slag
                        Cement solutions that deliver lower carbon impact and long-life durability.</div>
                    </div>

                  </div>

                  <div className="col-lg-5 col-12">
                    <div className="pt-5 d-flex align-items-lg-end justify-content-lg-end">
                      <div className="genric__content">
                        <div className="c-content-24 ft_bold clr-green lh_1-6">Steel By-Products Recovered</div>
                        <div className="c-content-20 clr-gray ft_regular lh_1-6">Slag is collected from steel manufacturing.</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="c-scrollSection__image">
                <img src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773145033_SustainabilityJourney-13.png" alt="Factory Illustration" className="factory-image" />
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: Loaded for Transport */}
        <div className="scroll-part-section">
          <div className="commonSection-lg c-scrollSection">
            <div className="container-fluid main-container">

              <div className="container cus-container content-area">
                <div className="row align-items-center">
                  <div className=" col-12">
                    <div className="pt-5">
                      <div className="genric__content">
                        <div className="c-content-24 ft_bold clr-green lh_1-6">Loaded for Transport</div>
                        <div className="c-content-20 clr-gray ft_regular lh_1-6">Moved efficiently through controlled logistics</div>
                      </div>

                    </div>
                  </div>


                </div>
              </div>
              <div className="c-scrollSection__image">
                <img src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773144778_SustainabilityJourney-2.png" alt="Factory Illustration" className="factory-image" />
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: Transformed at Cement Plants */}
        <div className="scroll-part-section">
          <div className="commonSection-lg c-scrollSection">
            <div className="container-fluid main-container">

              <div className="container cus-container content-area">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-12">


                  </div>

                  <div className="col-lg-5 col-12">
                    <div className="pt-5 d-flex align-items-lg-end justify-content-lg-end">
                      <div className="genric__content">
                        <div className="c-content-24 ft_bold clr-green lh_1-6">Transformed at Cement Plants</div>
                        <div className="c-content-20 clr-gray ft_regular lh_1-6">Converted into Green Cement (Portland Slag Cement).</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="c-scrollSection__image">
                <img src="https://d2lptvt2jijg6f.cloudfront.net/document/126/1773144778_SustainabilityJourney-3.png" alt="Factory Illustration" className="factory-image" />
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-part-section">
          <div className="commonSection-lg c-scrollSection">
            <div className="container-fluid main-container">

              <div className="container cus-container content-area">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-12">
                    <div className="genric__content">
                      <div className="c-heading-60 clr-green ft_light lh_1-1 mb-2 width-627">Lower Carbon, Longer Performance</div>
                      <div className="c-content-20 ft_regular lh_1-6 width-453"><span className="clr-gray">A circular manufacturing process that transforms industrial by-products into</span><span className="clr-green">Green Cement for sustainable construction.</span></div>
                    </div>

                  </div>


                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}