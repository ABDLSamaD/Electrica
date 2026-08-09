"use client";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Heart,
  Eye,
  Settings,
  UserCheck,
  Info,
  X,
  Award,
} from "lucide-react";

import { useAlert } from "../../OtherComponents/AlertProvider";

const DEFAULT_PROFILE_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png";

const Profile = () => {
  const navigate = useNavigate();
  const { electricaURL } = useOutletContext();
  const { success, warning, error } = useAlert();
  const queryClient = useQueryClient();

  // --------------------------------------------------
  // Local UI state
  // --------------------------------------------------

  const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMAGE);
  const [isEditable, setIsEditable] = useState(false);
  const [isImageSaved, setIsImageSaved] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [picMessage, setPicMessage] = useState(null);
  const [message, setMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const [credentials, setCredentials] = useState({
    fullName: "",
    address: "",
    phone: "",
    city: "",
  });

  // --------------------------------------------------
  // Fetch user with React Query
  // --------------------------------------------------

  const {
    data: user = {},
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user"],

    queryFn: async () => {
      const response = await fetch(
        `${electricaURL}/api/auth/user-info`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const data = await response.json();

      if (!data.encryptedData) {
        return {};
      }

      // Keep the same DecryptData implementation
      // if your backend still returns encrypted data.
      // Import it if required by your project.
      return data.encryptedData;
    },

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // --------------------------------------------------
  // Update local form values when user data is available
  // --------------------------------------------------

  const syncCredentials = () => {
    setCredentials({
      fullName: user?.fullName || user?.name || "",
      address: user?.address || "",
      phone: user?.phone || "",
      city: user?.city || "",
    });
  };

  // --------------------------------------------------
  // Profile details mutation
  // --------------------------------------------------

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await fetch(
        `${electricaURL}/api/auth/adduser-details`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong!");
      }

      return data;
    },

    onSuccess: (data) => {
      success(data.message);

      setIsEditable(false);

      // Refresh user data from backend
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },

    onError: (err) => {
      error(err.message || "Something went wrong!");
    },
  });

  // --------------------------------------------------
  // Update profile details
  // --------------------------------------------------

  const handleUpdate = (e) => {
    e.preventDefault();

    syncCredentials();
    setIsEditable(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfileMutation.mutate({
      fullName: credentials.fullName,
      address: credentials.address,
      phone: credentials.phone,
      city: credentials.city,
    });
  };

  const onChange = (e) => {
    setCredentials((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // --------------------------------------------------
  // Cloudinary image upload
  // --------------------------------------------------

  const postDetails = async (selectedImage) => {
    if (!selectedImage) {
      setPicMessage("Please Select an Image");
      return;
    }

    setPicMessage(null);

    if (
      selectedImage.type !== "image/jpeg" &&
      selectedImage.type !== "image/png"
    ) {
      setPicMessage("Please Select a Valid Image (JPEG/PNG)");
      return;
    }

    // 5MB validation
    if (selectedImage.size > 5 * 1024 * 1024) {
      setPicMessage("Image size must be less than 5MB");
      return;
    }

    setImageLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", selectedImage);
      formData.append("upload_preset", "electrica-profile");
      formData.append("cloud_name", "dchie2dvi");

      const response = await fetch(
        import.meta.env.VITE_CLOUDINARY_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      setProfileImg(data.url);
      setIsImageSaved(false);
    } catch (err) {
      setMessage(err.message || "Image upload failed");
    } finally {
      setImageLoading(false);
    }
  };

  // --------------------------------------------------
  // Save profile image
  // --------------------------------------------------

  const saveImageMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${electricaURL}/api/auth/adduser-profileImg`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileImg,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save profile image");
      }

      return data;
    },

    onSuccess: (data) => {
      setIsImageSaved(true);
      setMessage(data.message);

      success(data.message);

      // Refresh cached user
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },

    onError: (err) => {
      setMessage(err.message);
      error(err.message);
    },
  });

  const handleImage = (e) => {
    e.preventDefault();

    if (isImageSaved || imageLoading) {
      return;
    }

    saveImageMutation.mutate();
  };

  // --------------------------------------------------
  // Profile completion
  // --------------------------------------------------

  const getCompletionPercentage = () => {
    const fields = [
      user?.fullName || user?.name,
      user?.phone,
      user?.city,
      user?.address,
      user?.profileImg,
    ];

    const completed = fields.filter(
      (field) =>
        field &&
        typeof field === "string" &&
        field.trim() !== ""
    ).length;

    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  const displayName =
    user?.fullName || user?.name || "Not provided";

  const displayProfileImage =
    user?.profileImg || profileImg || DEFAULT_PROFILE_IMAGE;

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/70">
          <div className="w-5 h-5 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isUserError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium">
            Unable to load your profile.
          </p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["user"],
              })
            }
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Profile
              </h1>

              <p className="text-white/60 mt-1 text-sm">
                Manage your personal information and account details.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mb-8 bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Award className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Profile Completion
                </h3>

                <p className="text-white/50 text-sm">
                  Complete your profile to unlock all features.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-[width] duration-300"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              <span className="text-white font-semibold">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-400" />
              <p className="text-blue-300 text-sm font-medium">
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Profile Overview */}
        <section className="mb-8 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">

          <div className="p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-7">
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <User className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Profile Overview
                </h2>

                <p className="text-white/50 text-sm">
                  Your personal information and account details.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Profile Image */}
              <div className="lg:w-1/3">
                <div className="text-center">

                  <div className="relative inline-block mb-5">

                    <button
                      type="button"
                      onClick={() => setShowImagePreview(true)}
                      className="relative block rounded-2xl overflow-hidden"
                    >
                      <img
                        src={displayProfileImage}
                        alt="Profile"
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-white/10"
                      />

                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
                      </div>
                    </button>

                    {user?.isVerified && (
                      <div className="absolute -top-2 -right-2 p-2 bg-green-500/15 border border-green-400/20 rounded-full">
                        <Shield className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload */}
                  <div className="space-y-3">

                    <label
                      htmlFor="profile-upload"
                      className="flex items-center justify-center gap-2 w-full p-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80 text-sm font-medium">
                        Choose New Image
                      </span>
                    </label>

                    <input
                      id="profile-upload"
                      className="hidden"
                      type="file"
                      name="profileImg"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) =>
                        postDetails(e.target.files?.[0])
                      }
                    />

                    {picMessage && (
                      <div className="p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <p className="text-red-300 text-sm">
                            {picMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleImage}
                      disabled={
                        isImageSaved ||
                        imageLoading ||
                        saveImageMutation.isPending
                      }
                      className={`w-full p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                        isImageSaved
                          ? "bg-white/[0.03] border border-white/10 text-white/30 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {imageLoading ||
                      saveImageMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Image</span>
                        </>
                      )}
                    </button>

                    <p className="text-white/40 text-xs">
                      JPEG or PNG. Maximum 5MB. Recommended 400x400px.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:w-2/3 space-y-6">

                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                    Basic Information
                  </h3>

                  <div className="space-y-3">

                    {/* Name */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.025] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-400" />

                        <div>
                          <p className="text-white/50 text-xs">
                            Full Name
                          </p>

                          <p className="text-white font-medium">
                            {displayName}
                          </p>
                        </div>
                      </div>

                      {displayName !== "Not provided" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.025] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />

                        <div>
                          <p className="text-white/50 text-xs">
                            Email Address
                          </p>

                          <p className="text-white font-medium break-all">
                            {user?.email || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    </div>

                    {/* Member Since */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.025] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-400" />

                        <div>
                          <p className="text-white/50 text-xs">
                            Member Since
                          </p>

                          <p className="text-white font-medium">
                            {user?.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not available"}
                          </p>
                        </div>
                      </div>

                      {user?.createdAt && (
                        <span className="flex items-center gap-1 text-white/50 text-xs">
                          <Star className="w-4 h-4 text-blue-400" />
                          {Math.floor(
                            (Date.now() -
                              new Date(user.createdAt)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    Account Status
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="p-4 bg-white/[0.025] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          {user?.isVerified ? (
                            <Shield className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-400" />
                          )}
                        </div>

                        <div>
                          <p className="text-white/50 text-xs">
                            Verification
                          </p>

                          <p
                            className={`font-medium ${
                              user?.isVerified
                                ? "text-green-400"
                                : "text-orange-400"
                            }`}
                          >
                            {user?.isVerified
                              ? "Verified"
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.025] border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Heart className="w-4 h-4 text-blue-400" />
                        </div>

                        <div>
                          <p className="text-white/50 text-xs">
                            Account Type
                          </p>

                          <p className="text-blue-400 font-medium">
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
        </section>

        {/* Personal Information */}
        <section className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">

          <div className="p-5 sm:p-7">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7 pb-5 border-b border-white/10">

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Personal Details
                  </h2>

                  <p className="text-white/50 text-sm">
                    Update your personal and contact information.
                  </p>
                </div>
              </div>

              {!isEditable && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <form
              className="space-y-7"
              onSubmit={handleSubmit}
            >

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Personal Information
                </h3>

                <div className="space-y-5">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Full Name{" "}
                      <span className="text-red-400">*</span>
                    </label>

                    <div
                      className={`flex items-center bg-white/[0.025] border rounded-lg px-4 py-3 transition-colors ${
                        isEditable
                          ? "border-blue-400/40 focus-within:border-blue-400"
                          : "border-white/10"
                      }`}
                    >
                      <User className="w-5 h-5 text-blue-400 mr-3" />

                      <input
                        type="text"
                        name="fullName"
                        value={credentials.fullName}
                        onChange={onChange}
                        placeholder="Enter your full name"
                        className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
                        disabled={!isEditable}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email Address{" "}
                      <span className="text-green-400">✓</span>
                    </label>

                    <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-lg px-4 py-3">
                      <Mail className="w-5 h-5 text-blue-400 mr-3" />

                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="flex-1 bg-transparent text-white/60 outline-none"
                      />

                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-400" />
                  Contact Information
                </h3>

                <div className="space-y-5">

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Phone Number
                    </label>

                    <div
                      className={`flex items-center bg-white/[0.025] border rounded-lg px-4 py-3 transition-colors ${
                        isEditable
                          ? "border-blue-400/40 focus-within:border-blue-400"
                          : "border-white/10"
                      }`}
                    >
                      <Phone className="w-5 h-5 text-blue-400 mr-3" />

                      <input
                        type="tel"
                        name="phone"
                        value={credentials.phone}
                        onChange={onChange}
                        placeholder="Enter your phone number"
                        className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
                        disabled={!isEditable}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      City
                    </label>

                    <div
                      className={`flex items-center bg-white/[0.025] border rounded-lg px-4 py-3 transition-colors ${
                        isEditable
                          ? "border-blue-400/40 focus-within:border-blue-400"
                          : "border-white/10"
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-blue-400 mr-3" />

                      <input
                        type="text"
                        name="city"
                        value={credentials.city}
                        onChange={onChange}
                        placeholder="Enter your city"
                        className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-400" />
                  Address Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Complete Address
                  </label>

                  <div
                    className={`flex items-start bg-white/[0.025] border rounded-lg px-4 py-3 transition-colors ${
                      isEditable
                        ? "border-blue-400/40 focus-within:border-blue-400"
                        : "border-white/10"
                    }`}
                  >
                    <Home className="w-5 h-5 text-blue-400 mr-3 mt-1" />

                    <textarea
                      name="address"
                      value={credentials.address}
                      onChange={onChange}
                      placeholder="Enter your complete address"
                      rows={3}
                      className="flex-1 bg-transparent text-white placeholder-white/30 outline-none resize-none"
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isEditable && (
                <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-white/10">

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      syncCredentials();
                      setIsEditable(false);
                    }}
                    className="flex items-center justify-center gap-2 px-7 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel Changes
                  </button>
                </div>
              )}

              {/* Help */}
              {isEditable && (
                <div className="p-4 bg-blue-500/5 border border-blue-400/10 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />

                    <div>
                      <h4 className="text-white font-medium mb-2">
                        Profile Update Guidelines
                      </h4>

                      <ul className="text-white/50 text-sm space-y-1">
                        <li>• Ensure all information is accurate.</li>
                        <li>• Use your legal name for verification.</li>
                        <li>• Provide a valid phone number.</li>
                        <li>• Keep your address up to date.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Image Preview */}
        {showImagePreview && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowImagePreview(false)}
          >
            <div
              className="relative max-w-2xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayProfileImage}
                alt="Profile Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />

              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
