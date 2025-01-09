import React from "react";
import Documentation from "./Documentation";
import "../../dashboard.css";

const ProjectDoc = () => {
  return (
    <div className="main flex content-center m-2 flex-col p-5 bg-[rgba(255,255,255,0.08)] rounded-lg shadow-lg backdrop-blur-lg">
      <Documentation />
    </div>
  );
};

export default ProjectDoc;
