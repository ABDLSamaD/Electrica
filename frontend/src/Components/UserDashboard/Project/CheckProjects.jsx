import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

const CheckProjects = () => {
  const { fetchUser, projects, fetchProject } = useOutletContext(); // Projects are fetched and passed here
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    if (projects && projects.length > 0) {
      setLoading(false); // Stop loading immediately if projects are available
      fetchUser();
    } else {
      setLoading(true); // Show loading if no projects
      const timer = setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
      }, 4000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or dependency change
    }
  }, [projects]);

  const removeProject = async (projectId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this project? This action cannot be undone."
    );
    if (!confirmRemove) return;

    try {
      setLoading(true); // Show loader
      const response = await axios.post(
        "http://localhost:5120/api/auth/remove-project",
        { projectId, removeProject: true, reason },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchProject(); // Reload page to update the UI after removal
        if (!userProject) {
          navigate("/db-au-user/project");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove project.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return loading ? (
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] flex justify-center items-center min-h-screen z-50 backdrop-blur-md">
      <div className="text-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-5xl text-white animate-spin mb-4"
        />
        <p className="text-white text-lg font-semibold">
          Processing your request...
        </p>
      </div>
    </div>
  ) : (
    <div className="p-2 text-gray-100">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={goBack}
          className="text-gray-300 hover:scale-110 transition"
          title="Go Back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="1x" /> Go back
        </button>
      </div>

      {/* Check if there are any projects */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {projects.map((project) => (
            <div
              key={project._id}
              className={`p-6 rounded-lg shadow-md border-t-4 
                ${
                  project.status === "Accepted"
                    ? "border-green-500 bg-[rgba(255,255,255,0.1)]"
                    : project.status === "Pending"
                    ? "border-yellow-500 bg-[rgba(255,255,255,0.1)]"
                    : "border-red-500 bg-[rgba(255,255,255,0.1)]"
                }`}
            >
              {/* Project Title and Status */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{project.projectName}</h2>
                {project.status === "Accepted" && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-400 text-xl"
                  />
                )}
              </div>
              <p className="text-sm text-gray-400 my-2">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-200">{project.projectDescription}</p>
              <div
                className={`py-1 px-3 rounded-md font-medium text-sm text-center mt-3 
                  ${
                    project.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : project.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                Status: {project.status}
              </div>

              {/* Additional Information */}
              <div className="text-sm mt-4">
                <p>
                  <span className="font-medium text-gray-400">Client:</span>{" "}
                  {project.clientName}
                </p>
                <p>
                  <span className="font-medium text-gray-400">City:</span>{" "}
                  {project.projectCity}
                </p>
                <p>
                  <span className="font-medium text-gray-400">Total Cost:</span>{" "}
                  ${project.totalCost}
                </p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() =>
                  navigate(
                    `/db-au-user/checkstatus/projectreview-1-9&/${project._id}`
                  )
                }
                className="mt-4 text-sm font-medium bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition w-full"
              >
                Check Project
              </button>
              <button
                onClick={() => removeProject(project._id)}
                className="mt-4 text-sm font-medium bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          You have no projects. Add a project to get started!
        </p>
      )}
    </div>
  );
};

export default CheckProjects;
