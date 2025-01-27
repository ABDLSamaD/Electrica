import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoaderAll from "../../OtherComponents/LoaderAll";
import ProjectCard from "./ProjectCard";

const ProjectUsers = () => {
  const { users, projects, fetchProject, electricaURL } = useOutletContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
      setTimeout(() => {
        setLoading(false);
      }, 1900);
    }
  }, [users]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) => {
      const userProjects = projects.filter(
        (project) => project.user === user._id
      );
      const matchesUser = user.name.toLowerCase().includes(query);
      const matchesProject = userProjects.some((project) =>
        project.projectName.toLowerCase().includes(query)
      );
      return matchesUser || matchesProject;
    });

    setFilteredUsers(filtered);
  };

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
    <div className="min-h-screen text-white p-3 lg:p-1">
      <h1 className="text-center text-4xl font-bold mb-6 text-gray-100">
        All User Projects
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by user or project name..."
          className="w-full py-2 px-4 text-gray-200 rounded-lg border bg-white/10 backdrop-blur-xl border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {filteredUsers.map((user) => {
        const userProjects = projects.filter(
          (project) => project.user === user._id
        );

        return (
          <div key={user._id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              <span
                className={`${
                  user.name.toLowerCase().includes(searchQuery)
                    ? "bg-yellow-300 text-gray-900 px-1 rounded"
                    : ""
                }`}
              >
                {user.name}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.length > 0 ? (
                userProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    userId={user._id}
                    electricaURL={electricaURL}
                    refreshProjects={fetchProject}
                    searchQuery={searchQuery}
                  />
                ))
              ) : (
                <p className="text-gray-400">No projects for this user.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectUsers;
