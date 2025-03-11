"use client";

import React, { useEffect, useRef, useState } from "react";

const Background = React.memo(({ children }) => {
  const backgroundRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Get sizes based on screen width
  const getOrbSize = () => {
    if (windowWidth >= 768) return "14rem";
    if (windowWidth >= 640) return "8rem";
    return "6rem";
  };

  const getDividerWidth = () => {
    if (windowWidth >= 1024) return "12rem";
    if (windowWidth >= 768) return "9rem";
    if (windowWidth >= 640) return "6rem";
    return "3rem";
  };

  // Use effect to optimize rendering and handle scrolling
  useEffect(() => {
    // Add a solid background color to the body to prevent white flashes
    document.body.style.backgroundColor = "#000";

    // Create and inject global styles properly
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .scrolling .blur-md,
      .scrolling .blur-lg,
      .scrolling .blur-xl,
      .scrolling .backdrop-blur-md {
        /* Reduce blur during scroll for better performance */
        filter: blur(4px) !important;
        backdrop-filter: blur(4px) !important;
        transition: filter 0.5s ease-out, backdrop-filter 0.5s ease-out;
      }
      
      /* Ensure body has a dark background to prevent white flashes */
      body {
        background-color: #000;
      }
    `;
    document.head.appendChild(styleElement);

    // Optional: Reduce animations during scroll for better performance
    let scrollTimer = null;
    const handleScroll = () => {
      if (!backgroundRef.current) return;

      // Add a class to reduce animations during scroll
      backgroundRef.current.classList.add("scrolling");

      // Clear previous timeout
      if (scrollTimer) clearTimeout(scrollTimer);

      // Remove the class after scrolling stops
      scrollTimer = setTimeout(() => {
        if (backgroundRef.current) {
          backgroundRef.current.classList.remove("scrolling");
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Get current sizes
  const orbSize = getOrbSize();
  const dividerWidth = getDividerWidth();

  return (
    <div
      ref={backgroundRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        // Hardware-accelerated background gradient
        backgroundImage:
          "radial-gradient(circle, rgba(10,25,47,0.9), rgba(0,0,0,1))",
      }}
    >
      {/* Animated blurred orbs with improved performance */}
      <div className="absolute inset-0">
        {/* Top left orb */}
        <div
          className="absolute left-[8%] top-[8%] rounded-full bg-blue-900/75 blur-md sm:blur-lg md:blur-xl"
          style={{
            width: orbSize,
            height: orbSize,
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Top right orb */}
        <div
          className="absolute right-[8%] top-[8%] rounded-full bg-green-900/75 blur-md sm:blur-lg md:blur-xl"
          style={{
            width: orbSize,
            height: orbSize,
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Bottom left orb */}
        <div
          className="absolute bottom-[8%] left-[8%] rounded-full bg-purple-900/75 blur-md sm:blur-lg md:blur-xl"
          style={{
            width: orbSize,
            height: orbSize,
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Bottom right orb */}
        <div
          className="absolute bottom-[8%] right-[8%] rounded-full bg-cyan-900/75 blur-md sm:blur-lg md:blur-xl"
          style={{
            width: orbSize,
            height: orbSize,
            transform: "translate3d(0,0,0)",
          }}
        />
      </div>

      {/* Center divider with blur effect - optimized with transform */}
      <div
        className="absolute left-1/2 h-full bg-black/25 sm:bg-black/50 md:bg-black/75 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md"
        style={{
          width: dividerWidth,
          transform: "translate3d(-50%, 0, 0)",
        }}
      />

      {/* Content container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

Background.displayName = "Background";

export { Background };
