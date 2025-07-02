"use client";

import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  MapPin,
  ExternalLink,
  MoreVertical,
  Search,
  Filter,
  Users,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

function Alert({ type, message, onClose }) {
  const alertStyles = {
    success: "bg-green-500/20 border-green-400/30 text-green-100",
    error: "bg-red-500/20 border-red-400/30 text-red-100",
    warning: "bg-yellow-500/20 border-yellow-400/30 text-yellow-100",
    info: "bg-blue-500/20 border-blue-400/30 text-blue-100",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Users className="w-5 h-5" />,
  };

  return (
    <motion.div
      className={`fixed top-6 right-6 z-50 flex items-center space-x-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${alertStyles[type]}`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {icons[type]}
      <span className="font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animation-delay-150"></div>
      </motion.div>
    </div>
  );
}

const UserProfile = () => {
  const { users, projects, fetchUsers, electricaURL } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Filter and search users
  const filteredUsers = users
    ?.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "projects":
          const aProjects = projects.filter((p) => p.user === a._id).length;
          const bProjects = projects.filter((p) => p.user === b._id).length;
          return bProjects - aProjects;
        default:
          return 0;
      }
    });

  const handleRemoveUser = async (userId, remove) => {
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminauth/remove-user`,
        { userId, remove },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowModal(false);
        setUserToRemove(null);
        setAlert({ type: "success", message: response.data.message });
        fetchUsers();
      } else {
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to remove user",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white/60" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">No Users Found</h1>
          <p className="text-white/60 text-lg">
            There are currently no users in the system.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        <AnimatePresence>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <motion.button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </motion.button>

                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    User Profiles
                  </h1>
                  <p className="text-white/60 text-lg">
                    Manage and view all registered users (
                    {filteredUsers?.length || 0} users)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                  <Users className="w-5 h-5 text-white/60" />
                  <span className="text-white font-semibold">
                    {users?.length || 0}
                  </span>
                  <span className="text-white/60 text-sm">Total Users</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-6 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 placeholder-white/40"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 appearance-none"
                >
                  <option value="all" className="bg-gray-800">
                    All Roles
                  </option>
                  <option value="user" className="bg-gray-800">
                    User
                  </option>
                  <option value="admin" className="bg-gray-800">
                    Admin
                  </option>
                  <option value="moderator" className="bg-gray-800">
                    Moderator
                  </option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 appearance-none"
                >
                  <option value="name" className="bg-gray-800">
                    Sort by Name
                  </option>
                  <option value="date" className="bg-gray-800">
                    Sort by Date
                  </option>
                  <option value="projects" className="bg-gray-800">
                    Sort by Projects
                  </option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {filteredUsers?.map((user, index) => {
            const userProjects = projects.filter((p) => p.user === user._id);

            return (
              <motion.div
                key={user._id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-8">
                    {/* Header with Avatar and Actions */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <motion.div
                            className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img
                              src={
                                user.profileImg ||
                                "/placeholder.svg?height=64&width=64"
                              }
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>

                          {user.isVerified && (
                            <motion.div
                              className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-2 border-white/20"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                              <Shield className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {user.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative dropdown-menu">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(
                              showDropdown === user._id ? null : user._id
                            );
                          }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </motion.button>

                        <AnimatePresence>
                          {showDropdown === user._id && (
                            <motion.div
                              className="absolute right-0 mt-2 w-48 bg-gray-500/75 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_0_rgba(0,0,0,0.3)] border border-white/20 z-20 overflow-hidden"
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                to={`/db_au_admn/userprofile/${user._id}`}
                                className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-cyan-300/50 transition-all duration-200"
                                onClick={() => setShowDropdown(null)}
                              >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  View Profile
                                </span>
                              </Link>
                              <button
                                onClick={() => {
                                  setUserToRemove(user);
                                  setShowModal(true);
                                  setShowDropdown(null);
                                }}
                                className="flex items-center space-x-3 w-full px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-800/40 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Remove User
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* User Information */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-3 text-white/70">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm truncate text-white/80">
                          {user.email}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-white/70">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-white/80">
                          {user.city || "Location not specified"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 text-white/70">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Joined</p>
                            <p className="text-sm font-medium text-white">
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-white/70">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-white/50">Projects</p>
                            <p className="text-sm font-medium text-white">
                              {userProjects.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/db_au_admn/userprofile/${user._id}`}>
                      <motion.button
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group border border-white/20 hover:border-white/30 backdrop-blur-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>View Full Profile</span>
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {filteredUsers?.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No Users Found
            </h3>
            <p className="text-white/60 text-lg">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* Enhanced Remove User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/[0.05] backdrop-blur-3xl p-8 rounded-3xl shadow-[0_20px_40px_0_rgba(0,0,0,0.5)] text-center max-w-md w-full border border-white/20 relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl mx-auto mb-6 border border-red-400/30">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Remove User
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Are you sure you want to remove{" "}
                  <span className="text-white font-semibold">
                    {userToRemove?.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleRemoveUser(userToRemove._id, true)}
                    className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes, Remove
                  </motion.button>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/80 hover:text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
