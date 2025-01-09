import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProjectCard = ({ project, userId, localhost, refreshProjects }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(project.startStage);

  const startUserProject = async (projectId) => {
    setIsStarting(true);
    try {
      const response = await axios.post(
        `${localhost}/api/adminauth/start-project`,
        {
          projectId,
          startMessage: "Project started by admin.",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setHasStarted(true);
        refreshProjects();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start project.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div
      key={project._id}
      className={`p-4 rounded-md shadow-lg ${
        project.status === "approved"
          ? "bg-gradient-to-r from-green-700 to-teal-600"
          : "bg-gradient-to-r from-gray-700 to-gray-600"
      }`}
    >
      <h3 className="text-lg font-medium text-white mb-2 text-center">
        {project.projectName || "Untitled Project"}
      </h3>

      <h4
        className={`text-center font-semibold mb-3 ${
          project.status === "approved" ? "text-emerald-300" : "text-yellow-300"
        }`}
      >
        {`Status: ${project.status}`}
      </h4>

      {project.status !== "approved" ? (
        <div className="text-center mt-4">
          <Link
            to={`/db_au_admn/userprofile/${userId}/projectreview/${project._id}`}
            className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition transform hover:-translate-y-1 shadow-md"
          >
            Review & Approve Project
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center">
          {hasStarted ? (
            // Show "Visit Project" button if the project has started
            <Link
              to={`/db_au_admn/projectusers/stageone/${project._id}`}
              className="mb-2 text-center text-sm bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg transition transform hover:-translate-y-1 shadow-md"
            >
              Visit Project
            </Link>
          ) : (
            // Show "Start Project" button if the project hasn't started
            <button
              onClick={() => startUserProject(project._id)}
              className={`text-sm bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition transform hover:-translate-y-1 shadow-md ${
                isStarting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isStarting}
            >
              {isStarting ? "Starting Project..." : "Start Project"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
