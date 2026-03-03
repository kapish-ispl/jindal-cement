"use client";

import React, { ReactElement, ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ZoomChildProps {
  children?: ReactNode[];
}

type ZoomChildElement = ReactElement<ZoomChildProps>;

interface CustomZoomEffectProps {
  videourl?: string;
  data?: ReactNode[];
}



const CustomZoomEffect = ({ videourl, data = [] }: CustomZoomEffectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = data.filter((item): item is ZoomChildElement =>
    React.isValidElement(item)
  );

  /* --------------------------------
      GSAP ANIMATION
  -------------------------------- */
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            scrub: 1,
            pin: true,
            start: "top top",
            end: "+=1000",
          },
        });

        tl.to(".text-highlighter", {
          scale: 300,
          ease: "none",
        });

        tl.to(".header-text", {
          opacity: 0,
          ease: "power2.out",
        });

        tl.to(
          ".video-bg",
          {
            scale: 1,
            zIndex: 1,
            ease: "power2.out",
          },
          "<"
        );
      }, containerRef);

      return () => ctx.revert();
    },
    { dependencies: [] }
  );

  return (
    <div ref={containerRef}>
      <div className="zoom-container">
        <video autoPlay loop muted playsInline className="video-bg">
          <source src={videourl} type="video/mp4" />
        </video>

        {/* Render valid children */}
        {filteredItems}
      </div>
    </div>
  );
};

export default CustomZoomEffect;
