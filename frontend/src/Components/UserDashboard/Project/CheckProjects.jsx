import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowLeft,
  PlusCircle,
  Search,
  CheckCircle2,
  ClipboardList,
  User,
  Building2,
  DollarSign,
  Loader2,
  Trash2,
  Eye,
  CheckSquare,
  BookUserIcon,
} from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// Helper function to highlight matching text
const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-300 text-black px-1 rounded">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const CheckProjects = () => {
  const { user, projects, fetchProject, electricaURL } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (projects && projects.length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
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

  const projectAdd = () => {
    navigate("/db-au-user/project/prjfrom");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen relative top-8 mb-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between flex-wrap gap-4">
        <motion.div className="group flex items-center">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <Link
            className="text-white ml-2 text-sm hover:scale-105 mr-1"
            to={-1}
          >
            home
          </Link>{" "}
          /<span className="text-gray-400 ml-1 text-sm">checkProject</span>
        </motion.div>
        <motion.button
          className="flex items-center md:w-auto w-max space-x-2 bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          onClick={projectAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Search and Title Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              <span className="text-blue-600 text-2xl">{user.name}</span>{" "}
              projects
            </h1>
            <motion.div
              className="relative w-full lg:w-auto"
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full lg:w-80 bg-white/5 text-white pl-12 pr-4 py-3 rounded-xl backdrop-blur-lg outline-none border border-white/10 focus:border-indigo-500/50 transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </motion.div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects
                .filter((project) => project.user === user._id)
                .map((project, index) => (
                  <motion.div
                    key={project._id}
                    className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-indigo-500/30 transition-all overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {project.stages.every(
                            (stage) => stage.isCompleted
                          ) && (
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full mb-2">
                              <CheckSquare className="w-4 h-4" />
                              Completed
                            </span>
                          )}
                          {highlightText(project.projectName, searchQuery)}
                        </h2>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()} -
                          {new Date(project.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {project.status === "Accepted" && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4 mb-6">
                      <p className="text-gray-300 line-clamp-2 flex items-center gap-1">
                        <BookUserIcon />
                        {highlightText(project.projectDescription, searchQuery)}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-400">
                            {highlightText(project.clientName, searchQuery)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-400">
                            {highlightText(project.projectCity, searchQuery)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-400">
                            Rs-{project.totalCost}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                          project.status === "approved"
                            ? "bg-green-500/20 text-green-300"
                            : project.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            project.status === "approved"
                              ? "bg-green-400"
                              : project.status === "pending"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        />
                        {project.status}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <motion.button
                        onClick={() =>
                          navigate(
                            `/db-au-user/checkstatus/projectreview-1-9&/${project._id}`
                          )
                        }
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-indigo-600/80 hover:bg-indigo-500 px-4 py-2.5 rounded-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      {project.billRequired && (
                        <motion.button
                          onClick={() =>
                            navigate(
                              `/db-au-user/checkstatus/complete/prj/${project._id}`
                            )
                          }
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-gray-950/80 hover:bg-gray-900/90 px-4 py-2.5 rounded-lg transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckSquare className="w-4 h-4" />
                          check bill&Pay
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => removeProject(project._id)}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-500 px-4 py-2.5 rounded-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No projects match your search criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckProjects;
