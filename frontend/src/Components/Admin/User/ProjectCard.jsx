import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Circle, House, XCircle } from "lucide-react";
import axios from "axios";

const ProjectCard = ({
  project,
  userId,
  electricaURL,
  refreshProjects,
  searchQuery,
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(project.startStage);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  const startUserProject = async (projectId) => {
    setIsStarting(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminauth/start-project`,
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

  const handleStageClick = (stage) => {
    setActiveStage(stage);
    setModalOpen(true);
  };

  // Highlight search term
  const highlightSearch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
  };

  const renderStages = () => {
    return project.stages?.map((stage, index) => (
      <div
        key={index}
        className={`flex items-center lg:flex-row flex-col lg:justify-between justify-start lg:p-3 p-1 mb-3 rounded-lg transition-transform transform ${
          stage.isCompleted ? "bg-green-100" : "bg-gray-100"
        } shadow-sm hover:scale-105`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
            stage.isCompleted
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {stage.isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
        </div>
        <div className="ml-4 flex-1">
          <h5 className="font-medium text-gray-800 lg:text-base text-sm my-2">
            {stage.name}
          </h5>
        </div>
        {stage.updates && stage.updates.length > 0 && (
          <button
            onClick={() => handleStageClick(stage)}
            className="lg:ml-4 ml-0 bg-blue-600 text-white text-xs py-1 px-3 rounded-lg hover:bg-blue-700 transition"
          >
            View Updates
          </button>
        )}
      </div>
    ));
  };

  return (
    <div
      className={`lg:p-6 p-1 rounded-lg shadow-xl transition-transform transform ${
        project.status === "approved"
          ? "bg-gradient-to-r from-indigo-900/70 to-indigo-950/80  "
          : "bg-gradient-to-r from-gray-700 to-gray-600"
      }`}
    >
      <div className="flex flex-col justify-center items-center gap-2">
        <House style={{ color: "#ffa" }} />
        <h1
          className="text-2xl font-bold text-white mb-4 text-center"
          dangerouslySetInnerHTML={{
            __html: highlightSearch(project.projectName || "Untitled Project"),
          }}
        ></h1>
      </div>

      <h4
        className={`text-center font-semibold mb-4 ${
          project.status === "approved" ? "text-green-500" : "text-yellow-300"
        }`}
      >
        {`Status: ${project.status}`}
      </h4>

      {project.status !== "approved" ? (
        <div className="text-center mt-4">
          <Link
            to={`/db_au_admn/userprofile/${userId}/projectreview/${project._id}`}
            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Review & Approve Project
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          {hasStarted ? (
            <div>
              <Link
                to={`/db_au_admn/projectusers/stageone/${project._id}`}
                className="mb-4 block text-center text-sm bg-indigo-600/80 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Visit Project
              </Link>
              <div className="mt-4">
                <h5 className="text-white font-semibold mb-4">
                  Project Stages
                </h5>
                {project.stages && project.stages.length > 0 ? (
                  renderStages()
                ) : (
                  <p className="text-gray-400">
                    No stages defined for this project.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button
                onClick={() => startUserProject(project._id)}
                className={`text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                  isStarting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isStarting}
              >
                {isStarting ? "Starting Project..." : "Start Project"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* modal open for daily updates details of stage */}
      {modalOpen && activeStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Updates for {activeStage.name}
            </h2>
            <ul className="space-y-3">
              {activeStage.updates.map((update, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg shadow-sm text-sm text-gray-700"
                >
                  <h4 className="font-bold text-gray-950 mb-2">
                    {new Date(update.date).toLocaleDateString()} -{" "}
                    {new Date(update.date).toLocaleTimeString()}
                  </h4>
                  {update.description && (
                    <p className="mb-2 text-gray-600">{update.description}</p>
                  )}

                  {update.materialsUsed && update.materialsUsed.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-semibold text-gray-800">
                        Materials Used:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600">
                        {update.materialsUsed.map((material, materialIndex) => (
                          <li key={materialIndex}>
                            {material.name} - Quantity: {material.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {update.workers && update.workers.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Workers Involved:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600">
                        {update.workers.map((worker, workerIndex) => (
                          <li key={workerIndex}>
                            {worker.name} - dailyWage: {worker.dailyWage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
