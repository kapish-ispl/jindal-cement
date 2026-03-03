"use client";

import React, { useEffect, useRef, useState } from "react";

type Card = {
  id: number;
  title?: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
};

const cardData: Card[] = [
  {
    id: 1,
    title: "Paid Search & Shopping",
    imageUrl:
      "https://d2lptvt2jijg6f.cloudfront.net/124/1759830750_Rectangle542.png",
  },
  {
    id: 2,
    title: "Creative & Content",
    imageUrl:
      "https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle540.png",
  },
  {
    id: 3,
    title: "Marketing Analytics",
    imageUrl:
      "https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle541.png",
  },
  {
    id: 4,
    title: "Paid Social & Influencer",
    imageUrl:
      "https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle545.png",
  },
  {
    id: 5,
    title: "Email Marketing",
    imageUrl:
      "https://d2lptvt2jijg6f.cloudfront.net/124/1759830791_Rectangle546.png",
  },
];

const CardItem = React.memo(function CardItem({
  card,
  index,
  activeIndex,
  onClick,
  videoRef,
}: {
  card: Card;
  index: number;
  activeIndex: number;
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
}) {
  const totalCards = cardData.length;
  let offset = index - activeIndex;
  if (offset > totalCards / 2) offset -= totalCards;
  else if (offset < -totalCards / 2) offset += totalCards;

  const absOffset = Math.abs(offset);

  const dynamicStyles: React.CSSProperties = {
    "--tx": `${offset * 25}%`,
    "--scale": 1 - absOffset * 0.15,
    "--tz": `-${absOffset * 100}px`,
    "--rotateY": `${offset * -4}deg`,
    "--zIndex": totalCards - absOffset,
  } as React.CSSProperties;

  return (
    <div className="card-item" style={dynamicStyles} onClick={onClick}>
      {card.videoUrl ? (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          loop
          className="card-item__background"
        >
          <source src={card.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="ratio ratio-3x4">
          <img src={card.imageUrl} className="img-fluid" />
        </div>
      )}
      {index !== activeIndex && <div className="card-item__overlay" />}
    </div>
  );
});

export default function CardStackSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const resumeAutoplayAfterDelay = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, cardData.length);
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  const handleCardClick = (index: number) => {
    setIsPaused(true);
    setActiveIndex(index);
    resumeAutoplayAfterDelay();
  };

  const handlePrev = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
    resumeAutoplayAfterDelay();
  };

  const handleNext = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev + 1) % cardData.length);
    resumeAutoplayAfterDelay();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // ✅ Autoplay loop
  useEffect(() => {
    if (!isPaused) {
      autoplayInterval.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % cardData.length);
      }, 5000);
    }
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    };
  }, [isPaused]);

  // ✅ Controlled video playback
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.load();
        const playVideo = async () => {
          try {
            await video.play();
          } catch {}
        };
        if (video.readyState >= 2) playVideo();
        else video.addEventListener("loadeddata", playVideo, { once: true });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  // 🆕 ---- DRAG / SWIPE HANDLING ----
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    setIsPaused(true);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };

  const handleDragEnd = () => {
    if (dragStartX.current === null) return;
    const threshold = 50; // px threshold to change slide
    if (dragDelta.current > threshold) {
      handlePrev();
    } else if (dragDelta.current < -threshold) {
      handleNext();
    }
    dragStartX.current = null;
    dragDelta.current = 0;
  };
  // 🆕 ---- END DRAG / SWIPE ----

  return (
    <div className="card-stack-slider-container">
      <div
        className="card-stack-visual"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handleDragStart} // 🆕
        onPointerMove={handleDragMove} // 🆕
        onPointerUp={handleDragEnd} // 🆕
        onPointerLeave={handleDragEnd} // 🆕
      >
        <div className="card-stack-visual__perspective-root">
          {cardData.map((card, i) => (
            <CardItem
              key={card.id}
              card={card}
              index={i}
              activeIndex={activeIndex}
              onClick={() => handleCardClick(i)}
              videoRef={(el) => {
                videoRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
