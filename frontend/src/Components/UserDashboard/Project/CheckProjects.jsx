"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  PlusCircle,
  Search,
  CheckSquare,
  BarChart,
  Filter,
  Loader2,
  Clock,
} from "lucide-react";
import ProjectsGrid from "./ProjectsGrid";
import { useAlert } from "../../OtherComponents/AlertProvider"; // Assuming this path is correct

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
  const { success, error, info, warning } = useAlert();
  const [loading, setLoading] = useState(true); // For initial data load
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 600); // Simulate loading for a smoother transition
    } else {
      setLoading(false);
    }
  }, [projects]);

  const removeProjects = async (projectId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this project? This action cannot be undone."
    );
    if (!confirmRemove) return;

    // The loading state for individual project removal will be handled in ProjectsGrid
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/remove-project`,
        { projectId: projectId, confirmRemoval: confirmRemove },
        { withCredentials: true }
      );
      if (response.status === 200) {
        success(response.data.message);
        fetchProject(); // Re-fetch projects to update the list
      } else {
        warning(response.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to remove project.");
      console.error("Error removing project:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort projects
  const processedProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectCity.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.projectName.localeCompare(b.projectName);
        case "cost":
          return b.totalCost - a.totalCost;
        case "date":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const projectStats = {
    total: projects.filter((p) => p.user === user._id).length,
    completed: projects.filter(
      (p) => p.user === user._id && p.stages.every((s) => s.isCompleted)
    ).length,
    inProgress: projects.filter(
      (p) => p.user === user._id && !p.stages.every((s) => s.isCompleted)
    ).length,
  };

  return (
    <div className="p-6 text-white min-h-screen relative top-8 mb-12">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          className="group flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <Link
            className="text-white ml-2 text-sm hover:scale-105 mr-1"
            to={-1}
          >
            home
          </Link>{" "}
          /<span className="text-gray-400 ml-1 text-sm">checkProject</span>
        </motion.div>

        {/* Project Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-white/10 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Total Projects</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {projectStats.total}
            </p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-white/10 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {projectStats.completed}
            </p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl border border-white/10 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold">In Progress</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {projectStats.inProgress}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons and Search/Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.button
            className="flex items-center space-x-2 bg-indigo-600/90 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            onClick={() => navigate("/db-au-user/project/prjfrom")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-white">New Project</span>
          </motion.button>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <motion.div
              className="relative flex-1 md:flex-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full md:w-80 bg-white/5 text-white pl-12 pr-4 py-3 rounded-xl backdrop-blur-lg outline-none border border-white/10 focus:border-indigo-500/50 transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </motion.div>
            <motion.button
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all"
              onClick={() => setShowFilters(!showFilters)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Filter className="w-5 h-5" />
              <span className="text-white">Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Filter Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-black/5 rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 focus:border-indigo-500/50 outline-none appearance-none pr-8"
                  >
                    <option value="date" className="bg-gray-800 text-white">
                      Date
                    </option>
                    <option value="name" className="bg-gray-800 text-white">
                      Name
                    </option>
                    <option value="cost" className="bg-gray-800 text-white">
                      Cost
                    </option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 focus:border-indigo-500/50 outline-none appearance-none pr-8"
                  >
                    <option value="all" className="bg-gray-800 text-white">
                      All
                    </option>
                    <option value="approved" className="bg-gray-800 text-white">
                      Approved
                    </option>
                    <option
                      value="submitted"
                      className="bg-gray-800 text-white"
                    >
                      Submitted
                    </option>
                    <option value="pending" className="bg-gray-800 text-white">
                      Pending
                    </option>
                    <option value="rejected" className="bg-gray-800 text-white">
                      Rejected
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading State for initial fetch */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <ProjectsGrid
          processedProjects={processedProjects}
          searchQuery={searchQuery}
          user={user}
          navigate={navigate}
          removeProjects={removeProjects}
          highlightText={highlightText}
        />
      )}
    </div>
  );
};

export default CheckProjects;
