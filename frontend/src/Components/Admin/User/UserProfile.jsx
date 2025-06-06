import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import LoaderAll from "../../OtherComponents/LoaderAll";
import Alert from "../../OtherComponents/Alert";
import {
  ChevronLeft,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  MapPin,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import axios from "axios";

const UserProfile = () => {
  const { users, projects, fetchUsers, electricaURL } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null); // Store which user’s dropdown is open

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1900); // Reduced timeout for better UX
  }, []);

  // Handle Remove User API Call
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
        setAlert({ type: response.data.type, message: response.data.message });
        fetchUsers(); // Refresh users list
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    }
  };

  // Close dropdown when clicking outside
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <h1 className="text-white text-3xl">No users found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between flex-col lg:space-y-0 space-y-3 lg:flex-row mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors bg-white/25 px-4 py-2 rounded-lg backdrop-blur-lg border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-blue-400 font-bold">Back</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-blue-600">
            User Profiles
          </h1>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {users.map((user) => {
            const userProjects = projects.filter((p) => p.user === user._id);

            return (
              <div key={user._id} className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-purple-500/30 shadow-lg">
                            <img
                              src={user.profileImg}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500/80 p-1 rounded-full">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {user.name}
                          </h2>
                          <p className="text-purple-400">{user.role}</p>
                        </div>
                      </div>

                      {/* Three Dots Dropdown */}
                      <div className="relative dropdown-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(
                              showDropdown === user._id ? null : user._id
                            );
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Content */}
                        {showDropdown === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-md rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                setUserToRemove(user);
                                setShowModal(true);
                                setShowDropdown(null); // Close dropdown
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-950"
                            >
                              Remove User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm text-gray-500">
                            {user.city || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm text-cyan-900">
                            {userProjects.length} Projects
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="mt-6 w-full bg-gradient-to-r from-gray-500 to-indigo-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 group border border-white/10">
                      <Link
                        to={`/db_au_admn/userprofile/${user._id}`}
                        className="flex items-center space-x-1"
                      >
                        <span>View Full Profile</span>
                        <ExternalLink className="w-4 h-4 transition-transform transform group-hover:translate-x-1" />
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remove User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm bg-opacity-50">
          <div className="bg-white/20 backdrop-blur-2xl border border-gray-200/15 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Remove User</h2>
            <p>Are you sure you want to remove {userToRemove.name}?</p>
            <div className="mt-4 flex space-x-4 justify-center">
              <button
                onClick={() => handleRemoveUser(userToRemove._id, true)}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 px-4 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
