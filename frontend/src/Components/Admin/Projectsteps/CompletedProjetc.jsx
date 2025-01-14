import React, { useEffect, useState } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";

const CompletedProjetc = () => {
  const projectId = useParams();
  const { projects, fetchProject } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  useEffect(() => {
    const fetchProject = () => {
      if (project && project.length > 0) {
        const matchedProject = projects.find((proj) => proj._id === projectId);
        setProject(matchedProject);
        setLoading(false);
      }
    };
    setTimeout(fetchProject, 2200);
  }, [project]);
  if (!project) {
    return (
      <div className="text-2xl flex gap-2 text-orange-2 flex-col items-center justify-center">
        <span className="text-white">Project Not Found</span>
        <span className="text-cyan-800 underline">
          <Link to={-1}>Previous</Link>
        </span>
      </div>
    );
  }
  if (project.status !== "approved") {
    return (
      <div className="text-2xl flex gap-2 text-orange-2 flex-col items-center justify-center">
        <span className="text-white">Project No tApproved Yet</span>
        <span className="text-cyan-800 underline">
          <Link to={-1}>Previous</Link>
        </span>
      </div>
    );
  }
  // Loading and error handling
  if (loading) {
    return (
      <div className="grid place-content-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }
  return <div>{project.clientName}</div>;
};

export default CompletedProjetc;
