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
  const { fetchUser, projects, fetchProject, electricaURL } =
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
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="p-6 rounded-lg shadow-md bg-gray-800 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">
                      {project.stages.every(
                        (stage) => stage.isCompleted && "Project Complete"
                      )}
                      {highlightText(project.projectName, searchQuery)}{" "}
                      {/* Highlight project name */}
                    </h2>
                    {project.status === "Accepted" && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-400 text-3xl"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 my-2 flex items-center">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" />
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 mb-4">
                    {highlightText(project.projectDescription, searchQuery)}{" "}
                    {/* Highlight project description */}
                  </p>
                  <div
                    className={`py-2 px-4 rounded-md font-medium text-sm text-center mt-3`}
                    style={{
                      backgroundColor:
                        project.status === "Accepted"
                          ? "#a5f3d3aa"
                          : project.status === "Pending"
                          ? "#fde36e"
                          : "#fcd6d6",
                      color:
                        project.status === "Accepted"
                          ? "bg-green-600"
                          : project.status === "Pending"
                          ? "#e0a800"
                          : "#d63b3b",
                    }}
                  >
                    Status: {project.status}
                  </div>
                  <div className="text-sm mt-6">
                    <p className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      <span className="font-medium text-gray-400">
                        Client:
                      </span>{" "}
                      {highlightText(project.clientName, searchQuery)}{" "}
                      {/* Highlight client name */}
                    </p>
                    <p className="flex items-center">
                      <FontAwesomeIcon icon={faCity} className="mr-2" />
                      <span className="font-medium text-gray-400">
                        City:
                      </span>{" "}
                      {highlightText(project.projectCity, searchQuery)}{" "}
                      {/* Highlight project city */}
                    </p>
                    <p className="flex items-center">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      <span className="font-medium text-gray-400">
                        Total Cost:
                      </span>{" "}
                      ${project.totalCost}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/db-au-user/checkstatus/projectreview-1-9&/${project._id}`
                      )
                    }
                    className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Check Project
                  </button>
                  <button
                    onClick={() => removeProject(project._id)}
                    className="mt-3 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-3" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No projects match your search criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckProjects;
