import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import LoaderAll from "../../OtherComponents/LoaderAll";
import ProjectCard from "./ProjectCard";

const ProjectUsers = () => {
  const { users, localhost, fetchUsers, projects, fetchProject } =
    useOutletContext();
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  // Update projects whenever `users` changes
  useEffect(() => {
    const fetchData = () => {
      if (users && users.length > 0) {
        const allProjects = projects.flatMap((prj) => prj);
        setProject(allProjects);
        setLoading(false);
      } else {
        setProject([]);
      }
    };

    setTimeout(() => fetchData(), 1570);
  }, [users, projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-white text-3xl text-center">No users found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-3">
      <h1 className="text-center text-4xl font-bold mb-8 text-gray-100">
        All User Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) =>
          project.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              userId={user._id}
              localhost={localhost}
              refreshProjects={fetchProject}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectUsers;
