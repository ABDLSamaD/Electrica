"use client";
import { useState } from "react"; // Import useState
import {
  BookUserIcon,
  Building2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  DollarSign,
  Eye,
  Trash2,
  User,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectsGrid({
  processedProjects,
  searchQuery,
  user,
  navigate,
  removeProjects,
  highlightText,
}) {
  const [removingProjectId, setRemovingProjectId] = useState(null); // State to track which project is being removed

  const handleRemoveClick = async (projectId) => {
    setRemovingProjectId(projectId); // Set loading state for this specific project
    try {
      await removeProjects(projectId); // Call the passed removeProjects function
    } finally {
      setRemovingProjectId(null); // Clear loading state
    }
  };

  return (
    <div className="space-y-8">
      {/* Projects Grid */}
      {processedProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {processedProjects
            .filter((project) => project.user === user._id)
            .map((project, index) => (
              <motion.div
                key={project._id}
                className="group relative p-6 rounded-2xl
                           bg-gradient-to-br from-white/10 to-white/5
                           backdrop-blur-xl border border-white/20
                           shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                           hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)]
                           hover:border-indigo-500/40
                           transform hover:translate-y-[-3px]
                           transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }} // Staggered entry animation
              >
                {/* Glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Project Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {project.stages.every((stage) => stage.isCompleted) && (
                        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full mb-2 backdrop-blur-md border border-green-500/20">
                          <CheckSquare className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {highlightText(project.projectName, searchQuery)}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString()}
                      <span className="text-gray-500">•</span>
                      <Clock className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  {project.status === "approved" && (
                    <CheckCircle2 className="w-6 h-6 text-green-400 drop-shadow-[0_0_3px_rgba(74,222,128,0.5)]" />
                  )}
                </div>
                {/* Project Details */}
                <div className="space-y-4 mb-6 relative z-10">
                  <p className="text-gray-300 line-clamp-2 flex items-center gap-2">
                    <BookUserIcon className="w-4 h-4 flex-shrink-0" />
                    {highlightText(project.projectDescription, searchQuery)}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-indigo-500/10 p-3 rounded-lg backdrop-blur-md border border-indigo-500/20 shadow-[0_4px_10px_rgba(79,70,229,0.1)]">
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-300 font-medium">
                      Rs-{project.totalCost.toLocaleString()}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-md border ${
                      project.status === "approved"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : project.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
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
                <div className="grid grid-cols-1 gap-3 relative z-10">
                  <button
                    onClick={() =>
                      navigate(
                        `/db-au-user/checkstatus/projectreview-1-9&/${project._id}`
                      )
                    }
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2
                               bg-gradient-to-r from-indigo-600/90 to-indigo-700/90
                               hover:from-indigo-700 hover:to-indigo-800
                               px-4 py-2.5 rounded-lg transition-all duration-200
                               shadow-[0_4px_10px_rgba(79,70,229,0.3)]
                               border border-indigo-500/30 text-white font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {project.billRequired && (
                    <button
                      onClick={() =>
                        navigate(
                          `/db-au-user/checkstatus/complete/prj/${project._id}`
                        )
                      }
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-2
                                 bg-gradient-to-r from-gray-800/90 to-gray-900/90
                                 hover:from-gray-700 hover:to-gray-800
                                 px-4 py-2.5 rounded-lg transition-all duration-200
                                 shadow-[0_4px_10px_rgba(0,0,0,0.3)]
                                 border border-gray-700/30 text-white font-medium"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Check Bill & Pay
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveClick(project._id)}
                    disabled={removingProjectId === project._id} // Disable button during removal
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2
                               bg-gradient-to-r from-red-600/90 to-red-700/90
                               hover:from-red-700 hover:to-red-800
                               px-4 py-2.5 rounded-lg transition-all duration-200
                               shadow-[0_4px_10px_rgba(220,38,38,0.3)]
                               border border-red-500/30 text-white font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {removingProjectId === project._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {removingProjectId === project._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div
          className="text-center py-12
                     bg-gradient-to-br from-white/10 to-white/5
                     backdrop-blur-xl border border-white/20
                     shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                     rounded-2xl"
        >
          <p className="text-gray-400 text-lg">
            No projects match your search criteria.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
