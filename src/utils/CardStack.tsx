'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CardStack({ data }: any) {
    const triggerRef = useRef<any>(null);

    // useLayoutEffect(() => {
    //     const cards = gsap.utils.toArray('.stacked-card');

    //     // Initially hide cards 2-5 below the screen
    //     gsap.set(cards.slice(1), { yPercent: 120, opacity: 0 });

    //     let tl = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: triggerRef.current,
    //             pin: true,
    //             start: "top 15%",
    //             end: "+=4000",
    //             scrub: 1,
    //         }
    //     });

    //     cards.forEach((card: any, index: number) => {
    //         if (index === 0) return;

    //         tl.to(card, {
    //             yPercent: 0,
    //             opacity: 1,
    //             duration: 1
    //         })
    //             .to(cards.slice(0, index), {
    //                 // Keep horizontal fan
    //                 x: (i: number) => (index - i) * 30,
    //                 // Move previous cards UP significantly so headers stay visible
    //                 // 70px is roughly the height of your header area
    //                 y: (i: number) => (index - i) * -70,
    //                 scale: (i: number) => 1 - (index - i) * 0.04,
    //                 opacity: 1, // Keep headers fully visible
    //                 duration: 1
    //             }, "<");
    //     });

    //     return () => {
    //         ScrollTrigger.getAll().forEach(t => t.kill());
    //     };
    // }, []);


    useLayoutEffect(() => {
    if (!triggerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        triggerRef.current!.querySelectorAll('.stacked-card')
      );

      if (cards.length === 0) return;

      // Hide cards except first
      gsap.set(cards.slice(1), { yPercent: 120, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          start: 'top 15%',
          end: '+=4000',
          scrub: 1,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        tl.to(card, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
        }).to(
          cards.slice(0, index),
          {
            x: (i: number) => (index - i) * 30,
            y: (i: number) => (index - i) * -70,
            scale: (i: number) => 1 - (index - i) * 0.04,
            opacity: 1,
            duration: 1,
          },
          '<'
        );
      });
    }, triggerRef);

    return () => ctx.revert(); // 🔥 cleanup only this instance
  }, []);

    return (
        <div className="stack-wrapper" ref={triggerRef}>
            <div className="card-stack-container">
                {data.filter((items: any, index: any) => items.props !== undefined).map((item:any, index:number) => {
                    return(
                        <div
                        key={item.id}
                        className="stacked-card"
                        style={{ zIndex: index + 1 }}
                    >
                        <div className="card-header">
                            <span>{item.props.title}</span>
                        </div>
                        <div className="card-image">
                            <img src={item.props.img} alt={item.props.title} />
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}