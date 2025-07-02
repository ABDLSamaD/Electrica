"use client";

import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Mail,
  ArrowLeft,
  Camera,
  Edit3,
  Save,
  Upload,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Home,
  Clock,
  Star,
  Award,
  Heart,
  Eye,
  Settings,
  UserCheck,
  Info,
  X,
} from "lucide-react";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUser, electricaURL } = useOutletContext();

  // States
  const [profileImg, setProfileImg] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
  );
  const [isEditable, setIsEditable] = useState(false);
  const [isImageSaved, setIsImageSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setALert] = useState(null);
  const [picMessage, setPicMessage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [credentials, setCredentials] = useState({
    fullName: user.fullName || "",
    address: user.address || "",
    phone: user.phone || "",
    city: user.city || "",
  });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditable(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fullName, address, phone, city } = credentials;
      const response = await axios.post(
        `${electricaURL}/api/auth/adduser-details`,
        {
          fullName,
          address,
          phone,
          city,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setALert({ type: response.data.type, message: response.data.message });
        setIsEditable(false);
        fetchUser();
      } else {
        setALert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setALert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // image update
  const postDetails = (profileImg) => {
    if (
      profileImg ===
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
    ) {
      return setPicMessage("Please Select an Image");
    }
    setPicMessage(null);
    setImageLoading(true);
    if (profileImg.type === "image/jpeg" || profileImg.type === "image/png") {
      const data = new FormData();
      data.append("file", profileImg);
      data.append("upload_preset", "electrica-profile");
      data.append("cloud_name", "dchie2dvi");
      fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileImg(data.url.toString());
          setIsImageSaved(false);
          setImageLoading(false);
        })
        .catch((err) => {
          setMessage(err.message);
          setImageLoading(false);
        });
    } else {
      setImageLoading(false);
      return setPicMessage("Please Select a Valid Image (JPEG/PNG)");
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/adduser-profileImg`,
        {
          profileImg,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setIsImageSaved(true);
        setMessage(response.data.message);
        fetchUser();
      }
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message);
    } finally {
      setImageLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      user.fullName,
      user.phone,
      user.city,
      user.address,
      user.profileImg,
    ];
    const completed = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-16 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-16 right-12 w-2 h-2 bg-green-400/30 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-8 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-300"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Header */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-xl group w-fit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium text-white">Back</span>
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                Profile Management
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Customize your personal information, upload your profile
                picture, and manage your account preferences with our advanced
                profile management system.
              </p>
            </div>
          </div>

          {/* Profile Completion Progress */}
          <motion.div
            className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-4 sm:p-6 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Profile Completion
                  </h3>
                  <p className="text-white/60 text-sm">
                    Complete your profile to unlock all features
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 sm:w-32 bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-white font-bold text-lg">
                  {getCompletionPercentage()}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-blue-400" />
                <p className="text-blue-300 font-medium">{message}</p>
              </div>
            </motion.div>
          )}

          {alert && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setALert(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Information Section */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01]"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              {/* Profile Header */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Profile Overview
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base">
                    Your personal information and account details
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:space-x-12 space-y-8 lg:space-y-0">
                {/* Profile Image Section */}
                <div className="lg:w-1/3">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <motion.div
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setShowImagePreview(true)}
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
                        <div className="relative">
                          <img
                            src={user?.profileImg || profileImg}
                            alt="Profile"
                            className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover border-4 border-white/20 shadow-2xl backdrop-blur-xl"
                          />
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl backdrop-blur-sm">
                              <div className="flex flex-col items-center space-y-3">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="text-white text-sm font-medium">
                                  Uploading...
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="absolute -bottom-3 -right-3 p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-xl group-hover:bg-blue-500/30 transition-colors duration-300">
                            <Camera className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      {user?.isVerified && (
                        <motion.div
                          className="absolute -top-2 -right-2 p-2 bg-green-500/20 rounded-full border border-green-400/30 backdrop-blur-xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <Shield className="w-5 h-5 text-green-400" />
                        </motion.div>
                      )}
                    </div>

                    {/* Image Upload Controls */}
                    <div className="space-y-4">
                      <div className="relative">
                        <label
                          htmlFor="profile-upload"
                          className="group flex items-center justify-center space-x-3 w-full p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl"
                        >
                          <Upload className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                          <span className="text-white/70 group-hover:text-white font-medium transition-colors duration-300">
                            Choose New Image
                          </span>
                        </label>
                        <input
                          id="profile-upload"
                          className="hidden"
                          type="file"
                          name="profileImg"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(e) => postDetails(e.target.files[0])}
                        />
                      </div>

                      {picMessage && (
                        <motion.div
                          className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-xl"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <p className="text-red-300 text-sm font-medium">
                              {picMessage}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        className={`w-full p-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-xl ${
                          isImageSaved
                            ? "bg-white/[0.03] border border-white/10 text-white/40 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-blue-500/50 text-white shadow-[0_8px_32px_0_rgba(59,130,246,0.3)]"
                        }`}
                        onClick={handleImage}
                        disabled={isImageSaved || imageLoading}
                        whileHover={
                          !isImageSaved && !imageLoading ? { scale: 1.02 } : {}
                        }
                        whileTap={
                          !isImageSaved && !imageLoading ? { scale: 0.98 } : {}
                        }
                      >
                        {imageLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-white">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span className="text-white">Save Image</span>
                          </>
                        )}
                      </motion.button>

                      <p className="text-white/50 text-xs leading-relaxed">
                        Supported formats: JPEG, PNG. Maximum file size: 5MB.
                        Recommended dimensions: 400x400px for best quality.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="lg:w-2/3">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-green-400" />
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <User className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-white/60 text-sm">Full Name</p>
                              <p className="text-white font-semibold text-lg">
                                {user?.name || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user?.name ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-orange-400" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                user?.name
                                  ? "text-green-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {user?.name ? "Completed" : "Required"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <Mail className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-white/60 text-sm">
                                Email Address
                              </p>
                              <p className="text-white font-semibold">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-medium text-green-400">
                              Verified
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <div>
                              <p className="text-white/60 text-sm">
                                Member Since
                              </p>
                              <p className="text-white font-semibold">
                                {new Date(user?.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-400">
                              {Math.floor(
                                (Date.now() - new Date(user?.createdAt)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-purple-400" />
                        Account Status
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                user?.isVerified
                                  ? "bg-green-500/20 border border-green-400/30"
                                  : "bg-orange-500/20 border border-orange-400/30"
                              }`}
                            >
                              {user?.isVerified ? (
                                <Shield className="w-4 h-4 text-green-400" />
                              ) : (
                                <Clock className="w-4 h-4 text-orange-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">
                                Verification
                              </p>
                              <p
                                className={`font-semibold ${
                                  user?.isVerified
                                    ? "text-green-400"
                                    : "text-orange-400"
                                }`}
                              >
                                {user?.isVerified ? "Verified" : "Pending"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                              <Heart className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">
                                Account Type
                              </p>
                              <p className="text-blue-400 font-semibold">
                                Premium User
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01]"></div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                    <Edit3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      Personal Details
                    </h2>
                    <p className="text-white/60 text-sm sm:text-base">
                      Update your personal information and contact details to
                      keep your profile current and complete.
                    </p>
                  </div>
                </div>

                {!isEditable && (
                  <motion.button
                    type="button"
                    onClick={handleUpdate}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl w-fit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-white">Edit Profile</span>
                  </motion.button>
                )}
              </div>

              {/* Enhanced Form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    Personal Information
                  </h3>
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <p className="text-white/60 text-xs mb-3">
                        Enter your complete legal name as it appears on official
                        documents
                      </p>
                      <div
                        className={`relative group ${
                          isEditable ? "ring-2 ring-blue-400/50" : ""
                        } rounded-xl transition-all duration-300`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-blue-400/50 transition-all duration-300">
                          <User className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                          <input
                            type="text"
                            name="fullName"
                            onChange={onChange}
                            placeholder="Enter your full name"
                            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none disabled:text-white/60"
                            defaultValue={user.fullName}
                            disabled={!isEditable}
                          />
                          {isEditable && (
                            <div className="ml-2 p-1 bg-blue-500/20 rounded border border-blue-400/30">
                              <Edit3 className="w-3 h-3 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email Address (Read-only) */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Email Address <span className="text-green-400">✓</span>
                      </label>
                      <p className="text-white/60 text-xs mb-3">
                        Your verified email address used for account
                        authentication and notifications
                      </p>
                      <div className="relative group">
                        <div className="flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
                          <Mail className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <input
                            type="email"
                            placeholder="Email address"
                            className="flex-1 bg-transparent text-white/80 outline-none"
                            defaultValue={user.email}
                            disabled
                          />
                          <div className="ml-2 p-1 bg-green-500/20 rounded border border-green-400/30">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        Phone Number
                      </label>
                      <p className="text-white/60 text-xs mb-3">
                        Your primary contact number for important account
                        notifications and support
                      </p>
                      <div
                        className={`relative group ${
                          isEditable ? "ring-2 ring-green-400/50" : ""
                        } rounded-xl transition-all duration-300`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-green-400/50 transition-all duration-300">
                          <Phone className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <input
                            type="tel"
                            name="phone"
                            onChange={onChange}
                            placeholder="Enter your phone number"
                            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none disabled:text-white/60"
                            defaultValue={user.phone}
                            disabled={!isEditable}
                          />
                          {isEditable && (
                            <div className="ml-2 p-1 bg-green-500/20 rounded border border-green-400/30">
                              <Edit3 className="w-3 h-3 text-green-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90">
                        City
                      </label>
                      <p className="text-white/60 text-xs mb-3">
                        Your current city of residence for location-based
                        services and local content
                      </p>
                      <div
                        className={`relative group ${
                          isEditable ? "ring-2 ring-purple-400/50" : ""
                        } rounded-xl transition-all duration-300`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-purple-400/50 transition-all duration-300">
                          <MapPin className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                          <input
                            type="text"
                            name="city"
                            onChange={onChange}
                            placeholder="Enter your city"
                            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none disabled:text-white/60"
                            defaultValue={user.city}
                            disabled={!isEditable}
                          />
                          {isEditable && (
                            <div className="ml-2 p-1 bg-purple-500/20 rounded border border-purple-400/30">
                              <Edit3 className="w-3 h-3 text-purple-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-orange-400" />
                    Address Information
                  </h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90">
                      Complete Address
                    </label>
                    <p className="text-white/60 text-xs mb-3">
                      Your full residential address including street, area,
                      city, and postal code for delivery and verification
                      purposes
                    </p>
                    <div
                      className={`relative group ${
                        isEditable ? "ring-2 ring-orange-400/50" : ""
                      } rounded-xl transition-all duration-300`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-orange-400/50 transition-all duration-300">
                        <Home className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                        <textarea
                          name="address"
                          onChange={onChange}
                          placeholder="Enter your complete address including street, area, city, and postal code"
                          rows={3}
                          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none resize-none disabled:text-white/60"
                          defaultValue={user.address}
                          disabled={!isEditable}
                        />
                        {isEditable && (
                          <div className="ml-2 p-1 bg-orange-500/20 rounded border border-orange-400/30">
                            <Edit3 className="w-3 h-3 text-orange-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditable && (
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      type="submit"
                      className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-[0_8px_32px_0_rgba(34,197,94,0.3)] hover:shadow-[0_12px_40px_0_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-white">Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span className="text-white">Save Changes</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setIsEditable(false)}
                      className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-2xl font-semibold transition-all duration-300 backdrop-blur-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-white">Cancel Changes</span>
                    </motion.button>
                  </motion.div>
                )}

                {/* Help Text */}
                {isEditable && (
                  <motion.div
                    className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          Profile Update Guidelines
                        </h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>
                            • Ensure all information is accurate and up-to-date
                          </li>
                          <li>
                            • Use your legal name for verification purposes
                          </li>
                          <li>
                            • Provide a valid phone number for account security
                          </li>
                          <li>
                            • Complete address helps with location-based
                            services
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {showImagePreview && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImagePreview(false)}
            >
              <motion.div
                className="relative max-w-2xl max-h-[80vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={user?.profileImg || profileImg}
                  alt="Profile Preview"
                  className="w-full h-full object-contain rounded-2xl"
                />
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
