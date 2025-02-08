import React from "react";

const Background = React.memo(({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle,rgba(10,25,47,0.9),rgba(0,0,0,1))]">
      {/* Animated blurred orbs */}
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[8%] h-24 w-24 sm:h-32 sm:w-32 md:h-56 md:w-56 rounded-full bg-blue-900/75 blur-md sm:blur-lg md:blur-xl will-change-transform" />
        <div className="absolute right-[8%] top-[8%] h-24 w-24 sm:h-32 sm:w-32 md:h-56 md:w-56 rounded-full bg-green-900/75 blur-md sm:blur-lg md:blur-xl will-change-transform" />
        <div className="absolute bottom-[8%] left-[8%] h-24 w-24 sm:h-32 sm:w-32 md:h-56 md:w-56 rounded-full bg-purple-900/75 blur-md sm:blur-lg md:blur-xl will-change-transform" />
        <div className="absolute bottom-[8%] right-[8%] h-24 w-24 sm:h-32 sm:w-32 md:h-56 md:w-56 rounded-full bg-cyan-900/75 blur-md sm:blur-lg md:blur-xl will-change-transform" />
      </div>

      {/* Center divider with blur effect */}
      <div className="absolute left-1/2 h-full w-12 sm:w-24 md:w-36 lg:w-48 -translate-x-1/2 bg-black/25 sm:bg-black/50 md:bg-black/75 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md will-change-transform" />

      {/* Content container */}
      <div className="relative z-10 p-4 sm:p-8">{children}</div>
    </div>
  );
});

export { Background };
