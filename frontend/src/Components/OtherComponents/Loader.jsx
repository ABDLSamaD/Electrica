import React from "react";

const Loader = () => {
  return (
    <div className="mainhoney h-screen w-screen bg-[rgba(0,0,0,0.1)] fixed top-0 left-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="honeycomb h-6 w-6 relative">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Loader;
