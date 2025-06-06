import React, { useEffect, useRef, useState } from "react";
import "./extracss.css";

const Background = React.memo(({ children }) => {
  const backgroundRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOrbSize = () =>
    windowWidth >= 768 ? "14rem" : windowWidth >= 640 ? "8rem" : "6rem";
  const getDividerWidth = () =>
    windowWidth >= 1024
      ? "12rem"
      : windowWidth >= 768
      ? "9rem"
      : windowWidth >= 640
      ? "6rem"
      : "3rem";

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.style.backgroundColor = "#000";

    let scrollTimer = null;
    const handleScroll = () => {
      if (!backgroundRef.current) return;
      backgroundRef.current.classList.add("scrolling");

      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (backgroundRef.current)
          backgroundRef.current.classList.remove("scrolling");
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      className="background-container relative min-h-screen w-full overflow-hidden bg-black"
    >
      {/* Animated blurred orbs */}
      <div className="absolute inset-0">
        <div
          className="background-orb left-[8%] top-[8%] bg-blue-900/75 sm:blur-lg md:blur-xl"
          style={{ width: getOrbSize(), height: getOrbSize() }}
        />
        <div
          className="background-orb right-[8%] top-[8%] bg-green-900/75 sm:blur-lg md:blur-xl"
          style={{ width: getOrbSize(), height: getOrbSize() }}
        />
        <div
          className="background-orb bottom-[8%] left-[8%] bg-purple-900/75 sm:blur-lg md:blur-xl"
          style={{ width: getOrbSize(), height: getOrbSize() }}
        />
        <div
          className="background-orb bottom-[8%] right-[8%] bg-cyan-900/75 sm:blur-lg md:blur-xl"
          style={{ width: getOrbSize(), height: getOrbSize() }}
        />
      </div>

      {/* Center divider */}
      <div className="center-divider" style={{ width: getDividerWidth() }} />

      {/* Content container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

Background.displayName = "Background";

export { Background };
