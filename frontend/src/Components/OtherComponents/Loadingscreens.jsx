import React from "react";
import { Html, useProgress } from "@react-three/drei";

export const Loadingscreens = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-2xl">
          Loading... {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
};
