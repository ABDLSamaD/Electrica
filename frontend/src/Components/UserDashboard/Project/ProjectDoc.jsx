import React from "react";
import Documentation from "./Documentation";
import { Link, useNavigate } from "react-router-dom";
import "../dashboard.css";

const ProjectDoc = () => {
  const navigate = useNavigate();
  const projectForm = () => {
    navigate("prjfrom");
  };
  return (
    <div className="main flex content-center m-2 flex-col p-5 bg-[rgba(255,255,255,0.08)] rounded-lg shadow-lg backdrop-blur-lg">
      <Documentation />
      <div className="relative mt-7">
        <h3 className="text-2xl font-semibold mb-3 text-gray-100">
          Add new project
        </h3>
        <button className="buttons" onClick={projectForm}>
          <p>Project</p>
        </button>
      </div>
    </div>
  );
};

export default ProjectDoc;
