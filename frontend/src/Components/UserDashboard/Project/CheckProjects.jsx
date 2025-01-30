import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faCheckCircle,
  faSpinner,
  faTasks,
  faUser,
  faCity,
  faDollarSign,
  faPlus,
  faSearch, // Add search icon
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

// Helper function to highlight matching text
const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-300">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const CheckProjects = () => {
  const { user, fetchUser, projects, fetchProject, electricaURL } =
    useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (projects && projects.length > 0) {
      setLoading(false);
      fetchUser();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  const removeProject = async (projectId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this project? This action cannot be undone."
    );
    if (!confirmRemove) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${electricaURL}api/auth/remove-project`,
        { projectId, removeProject: true },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchProject();
        navigate("/db-au-user/project");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove project.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const projectAdd = () => {
    navigate("/db-au-user/project/prjfrom");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 text-white bg-[rgba(1,1,1,0.1)] backdrop-blur-lg min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={goBack}
          className="flex items-center text-gray-400 hover:text-gray-300 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="mr-2" /> Go
          Back
        </button>
        <button
          className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          onClick={projectAdd}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-3" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-white animate-spin"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center lg:flex-row flex-col lg:gap-0 gap-4">
            <h1 className="text-3xl font-bold text-white">Your Projects</h1>
            <div className="flex items-center bg-gray-700 text-white lg:px-2 px-4 lg:py-1 py-2 rounded-lg">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              <input
                type="text"
                placeholder="Search by name, client, or city..."
                className="bg-transparent text-white placeholder-gray-300 outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects
                .filter((project) => project.user === user._id) // Filter user's projects
                .map((project) => (
                  <div
                    key={project._id}
                    className="p-6 rounded-lg shadow-lg bg-gray-800 relative overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                  >
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-white truncate">
                        {project.stages.every((stage) => stage.isCompleted) && (
                          <span className="bg-green-600 text-white text-sm px-2 py-1 rounded-full mr-2">
                            Project Complete
                          </span>
                        )}
                        {highlightText(project.projectName, searchQuery)}
                      </h2>
                      {project.status === "Accepted" && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-400 text-3xl"
                        />
                      )}
                    </div>

                    {/* Project Details */}
                    <p className="text-sm text-gray-400 mb-4 flex items-center">
                      <FontAwesomeIcon icon={faTasks} className="mr-2" />
                      Created:{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 mb-6">
                      {highlightText(project.projectDescription, searchQuery)}
                    </p>

                    {/* Status Badge */}
                    <div
                      className={`py-2 px-4 rounded-full font-medium text-sm text-center inline-block mb-6`}
                      style={{
                        backgroundColor:
                          project.status === "Accepted"
                            ? "#a5f3d3aa"
                            : project.status === "Pending"
                            ? "#fde36e"
                            : "#fcd6d6",
                        color:
                          project.status === "Accepted"
                            ? "#065f46"
                            : project.status === "Pending"
                            ? "#e0a800"
                            : "#d63b3b",
                      }}
                    >
                      Status: {project.status}
                    </div>

                    {/* Client and Project Info */}
                    <div className="space-y-3 mb-6">
                      <p className="flex items-center text-sm text-gray-400">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        <span className="font-medium text-gray-100 mr-1">
                          Client:
                        </span>{" "}
                        {highlightText(project.clientName, searchQuery)}
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <FontAwesomeIcon icon={faCity} className="mr-2" />
                        <span className="font-medium text-gray-100 mr-1">
                          City:
                        </span>{" "}
                        {highlightText(project.projectCity, searchQuery)}
                      </p>
                      <p className="flex items-center text-sm text-gray-400">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        <span className="font-medium text-gray-100 mr-1">
                          Total Cost:
                        </span>{" "}
                        ${project.totalCost}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/db-au-user/checkstatus/projectreview-1-9&/${project._id}`
                          )
                        }
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center"
                      >
                        Check Project
                      </button>
                      <button
                        onClick={() => removeProject(project._id)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />{" "}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No projects match your search criteria or no projects available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckProjects;
