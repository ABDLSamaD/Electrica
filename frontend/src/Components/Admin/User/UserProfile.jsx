import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoaderAll from "../../OtherComponents/LoaderAll";
import {
  ChevronLeft,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  MapPin,
  User,
  ExternalLink,
} from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const { users, projects } = useOutletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1900); // Reduced timeout for better UX
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
    <div className="min-h-screen bg-[#0d1117] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-col lg:space-y-0 space-y-3 lg:flex-row mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors relative group bg-white/5 px-4 py-2 rounded-lg backdrop-blur-lg border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
            <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            User Profiles
          </h1>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {users.map((user) => {
            const userProjects = projects.filter((p) => p.user === user._id);

            return (
              <div key={user._id} className="group relative">
                {/* 3D Tilt Effect Container */}
                <div className="transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1">
                  {/* Glass Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative p-6">
                      {/* Header */}
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
                              <div className="absolute -bottom-1 -right-1 bg-green-500/80 backdrop-blur-sm text-white p-1 rounded-full">
                                <Shield className="w-4 h-4" />
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

                      {/* Action Button */}
                      <button className="mt-6 w-full bg-gradient-to-r from-gray-500 to-indigo-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2 group border border-white/10">
                        <Link
                          to={`/db_au_admn/userprofile/${user._id}`}
                          className="flex p-1 space-x-1"
                        >
                          <span>View Full Profile</span>
                          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
