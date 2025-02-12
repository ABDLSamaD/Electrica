import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import LoaderAll from "../../../OtherComponents/LoaderAll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NextProcess = () => {
  const { projects } = useOutletContext();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      if (!Array.isArray(projects)) {
        setError("Invalid project data. Please refresh the page.");
        setLoading(false);
        return;
      }

      const selectedProject = projects.find(
        (project) => project._id === projectId
      );
      setProject(selectedProject);

      if (!selectedProject) {
        setError("Project not found.");
        return;
      }
      setLoading(false);
    };

    setTimeout(() => fetchData(), 1800);
  }, [projects, projectId]);
  console.log(projects.find((project) => project._id === projectId));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <LoaderAll />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center text-2xl bg-gray-800 min-h-screen flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="relative text-white md:p-6 p-0 min-h-screen">
      {/* Back Button */}
      <button
        className="text-white hover:scale-110 transition mb-4 p-3 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
        title="Go back"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>
      <span>{project.city}</span>
    </div>
  );
};

export default NextProcess;
