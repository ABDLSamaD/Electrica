"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Trash2,
  Upload,
  User,
  MapPin,
  Zap,
  DollarSign,
  FileText,
  Building,
  Phone,
  Home,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  X,
  Eye,
} from "lucide-react";
// import Alert from "../../OtherComponents/Alert";
import { useAlert } from "../../OtherComponents/AlertProvider";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const { user, fetchUser, fetchProject, electricaURL } = useOutletContext();

  const handleBack = () => {
    navigate(-1);
  };

  const { success, error, info, warning } = useAlert();

  const [formData, setFormData] = useState({
    clientName: user.fullName || "",
    clientNumber: user.phone || "",
    projectDescription: "",
    projectAddress: user.address || "",
    projectName: "",
    projectCity: user.city || "",
    category: "",
    voltageType: "",
    phases: "",
    estimatedBudget: "",
    advancePaid: "",
    projectPics: [],
  });

  // const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picMessage, setPicMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showImagePreview, setShowImagePreview] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Client Info",
      icon: User,
      description: "Basic client details",
    },
    {
      id: 2,
      title: "Project Details",
      icon: FileText,
      description: "Project information",
    },
    {
      id: 3,
      title: "Technical Specs",
      icon: Zap,
      description: "Technical requirements",
    },
    {
      id: 4,
      title: "Financial",
      icon: DollarSign,
      description: "Budget & payments",
    },
    { id: 5, title: "Images", icon: Camera, description: "Project photos" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) {
      setPicMessage("Please select at least one image.");
      return [];
    }

    setUploadImage(true);
    setPicMessage(null);

    const uploadPromises = files.map(async (file) => {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "electrica-profile");
        data.append("cloud_name", "dchie2dvi");

        try {
          const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
            method: "POST",
            body: data,
          });
          const responseData = await res.json();
          return responseData.secure_url;
        } catch (error) {
          setPicMessage("Error uploading images. Please try again.");
          return null;
        }
      } else {
        setPicMessage("Invalid file type. Please select JPEG or PNG.");
        return null;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);
    setUploadImage(false);
    return imageUrls.filter((url) => url !== null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      projectPics: files,
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.projectPics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      projectPics: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrls = await uploadImagesToCloudinary(formData.projectPics);
    if (imageUrls.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const {
        clientName,
        clientNumber,
        projectDescription,
        projectAddress,
        projectName,
        projectCity,
        category,
        voltageType,
        phases,
        estimatedBudget,
        advancePaid,
      } = formData;

      const newFormData = new FormData();
      newFormData.append("clientName", clientName);
      newFormData.append("clientNumber", clientNumber);
      newFormData.append("projectDescription", projectDescription);
      newFormData.append("projectAddress", projectAddress);
      newFormData.append("projectName", projectName);
      newFormData.append("projectCity", projectCity);
      newFormData.append("category", category);
      newFormData.append("voltageType", voltageType);
      newFormData.append("phases", phases);
      newFormData.append("estimatedBudget", estimatedBudget);
      newFormData.append("advancePaid", advancePaid);

      imageUrls.forEach((url) => {
        newFormData.append("projectPics", url);
      });

      const response = await axios.post(
        `${electricaURL}/api/auth/project`,
        newFormData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // setAlert({ type: response.data.type, message: response.data.message });
        success(response.data.message);
        setLoading(false);
        fetchUser();
        fetchProject();
        setTimeout(() => {
          navigate("/db-au-user/checkstatus");
        }, 2301);
      } else {
        warning(response.data.message);
        setLoading(false);
        // setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      error(error.response?.data?.message);
      setLoading(false);
      // setAlert({
      //   type: error.response?.data?.type,
      //   message: error.response?.data?.message,
      // });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepValidation = (step) => {
    switch (step) {
      case 1:
        return formData.clientName && formData.clientNumber;
      case 2:
        return (
          formData.projectName &&
          formData.projectDescription &&
          formData.projectAddress &&
          formData.projectCity
        );
      case 3:
        return formData.category && formData.voltageType && formData.phases;
      case 4:
        return formData.estimatedBudget && formData.advancePaid;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900/80 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-16 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-16 right-12 w-2 h-2 bg-green-400/30 rounded-full animate-pulse delay-700"></div>

      <h1 onClick={handleAlert} className="text-white text-center">
        hello
      </h1>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Alert */}
        {/* <AnimatePresence>
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
                onClose={() => setAlert(null)}
              />
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Enhanced Header */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <motion.button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-xl group w-fit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium text-white">Back</span>
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                Create New Project
              </h1>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                Submit your electrical project requirements including wiring
                installations, panel upgrades, lighting systems, and electrical
                troubleshooting. Our expert team will review and provide
                professional solutions tailored to your specific needs.
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <motion.div
            className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-4 sm:p-6 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? "bg-blue-500/20 border-blue-400/50 text-blue-400"
                          : "bg-white/10 border-white/20 text-white/60"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                      {getStepValidation(step.id) &&
                        currentStep !== step.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                    </motion.div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? "text-white"
                            : "text-white/60"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-white/50 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                        currentStep > step.id ? "bg-blue-400" : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01]"></div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Client Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          Client Information
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                          Provide the primary contact details for this
                          electrical project
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Client Name <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Full name of the client or property owner requesting
                          electrical services
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-blue-400/50 transition-all duration-300">
                            <User className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                            <input
                              type="text"
                              name="clientName"
                              value={formData.clientName}
                              onChange={handleInputChange}
                              placeholder="Enter client's full name"
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Contact Number <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Primary phone number for project coordination and
                          updates
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-green-400/50 transition-all duration-300">
                            <Phone className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            <input
                              type="tel"
                              name="clientNumber"
                              value={formData.clientNumber}
                              onChange={handleInputChange}
                              placeholder="Enter contact number"
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-green-500/20 rounded-2xl border border-green-400/30">
                        <FileText className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          Project Details
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                          Describe your electrical project requirements and
                          location details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-white/90">
                            Project Name <span className="text-red-400">*</span>
                          </label>
                          <p className="text-white/60 text-xs mb-3">
                            A descriptive name for your electrical project
                            (what's you call your contract name. and this is
                            optional. )
                          </p>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-purple-400/50 transition-all duration-300">
                              <Building className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                              <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                placeholder="e.g., Complete House Rewiring"
                                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-white/90">
                            Project City <span className="text-red-400">*</span>
                          </label>
                          <p className="text-white/60 text-xs mb-3">
                            City where the electrical work will be performed
                          </p>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-cyan-400/50 transition-all duration-300">
                              <MapPin className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                              <input
                                type="text"
                                name="projectCity"
                                value={formData.projectCity}
                                onChange={handleInputChange}
                                placeholder="Enter project city"
                                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Project Description{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Detailed description of electrical work needed (e.g.,
                          full work scope, specific tasks, and what you add in
                          your contract)
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-start bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-orange-400/50 transition-all duration-300">
                            <FileText className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                            <textarea
                              name="projectDescription"
                              value={formData.projectDescription}
                              onChange={handleInputChange}
                              placeholder="Describe the electrical work needed: new wiring installation, outlet additions, lighting fixtures, electrical panel upgrades, troubleshooting, etc."
                              rows={4}
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none resize-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Project Address{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Complete address where electrical work will be
                          performed
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-start bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-teal-400/50 transition-all duration-300">
                            <Home className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0 mt-1" />
                            <textarea
                              name="projectAddress"
                              value={formData.projectAddress}
                              onChange={handleInputChange}
                              placeholder="Enter complete address including street, area, and postal code"
                              rows={3}
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none resize-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Technical Specifications */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-400/30">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          Technical Specifications
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                          Specify the technical requirements for your electrical
                          project
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Project Category{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Type of property requiring electrical work
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-blue-400/50 transition-all duration-300">
                            <Building className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="flex-1 bg-transparent text-white outline-none appearance-none"
                              required
                            >
                              <option value="" className="bg-gray-800">
                                Select Category
                              </option>
                              <option
                                value="Residential"
                                className="bg-gray-800"
                              >
                                Residential (Home/Apartment)
                              </option>
                              <option
                                value="Commercial"
                                className="bg-gray-800"
                              >
                                Commercial (Office/Shop)
                              </option>
                              <option
                                value="Industrial"
                                className="bg-gray-800"
                              >
                                Industrial (Factory/Warehouse)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Voltage Type <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Required voltage level for the electrical system
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-purple-400/50 transition-all duration-300">
                            <Zap className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                            <select
                              name="voltageType"
                              value={formData.voltageType}
                              onChange={handleInputChange}
                              className="flex-1 bg-transparent text-white outline-none appearance-none"
                              required
                            >
                              <option value="" className="bg-gray-800">
                                Select Voltage
                              </option>
                              <option value="Low" className="bg-gray-800">
                                Low Voltage (120-240V)
                              </option>
                              <option value="Medium" className="bg-gray-800">
                                Medium Voltage (480-600V)
                              </option>
                              <option value="High" className="bg-gray-800">
                                High Voltage (Above 1000V)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Phase Configuration{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Electrical phase setup required
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-green-400/50 transition-all duration-300">
                            <Zap className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            <select
                              name="phases"
                              value={formData.phases}
                              onChange={handleInputChange}
                              className="flex-1 bg-transparent text-white outline-none appearance-none"
                              required
                            >
                              <option value="" className="bg-gray-800">
                                Select Phases
                              </option>
                              <option value={1} className="bg-gray-800">
                                Single Phase (Residential)
                              </option>
                              <option value={3} className="bg-gray-800">
                                Three Phase (Commercial/Industrial)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Info Cards */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <Info className="w-5 h-5 text-blue-400" />
                          <h4 className="text-white font-medium">
                            Residential
                          </h4>
                        </div>
                        <p className="text-white/70 text-sm">
                          Standard home electrical work including outlets,
                          lighting, and basic wiring
                        </p>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <Info className="w-5 h-5 text-purple-400" />
                          <h4 className="text-white font-medium">Commercial</h4>
                        </div>
                        <p className="text-white/70 text-sm">
                          Business electrical systems, lighting, and power
                          distribution
                        </p>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-xl">
                        <div className="flex items-center space-x-3 mb-2">
                          <Info className="w-5 h-5 text-green-400" />
                          <h4 className="text-white font-medium">Industrial</h4>
                        </div>
                        <p className="text-white/70 text-sm">
                          Heavy-duty electrical installations and machinery
                          connections
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Financial Information */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                        <DollarSign className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          Financial Information
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                          Provide budget estimates and advance payment details
                          for the project
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Estimated Budget{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Your estimated budget for the complete electrical
                          project. or (you want to add 0 value if you want talk
                          face to face of budget)
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-emerald-400/50 transition-all duration-300">
                            <DollarSign className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                            <input
                              type="number"
                              name="estimatedBudget"
                              value={formData.estimatedBudget}
                              onChange={handleInputChange}
                              placeholder="Enter estimated budget"
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white/90">
                          Advance Payment{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <p className="text-white/60 text-xs mb-3">
                          Amount you're willing to pay in advance to start the
                          project. or (same as above, you want to add 0 value if
                          you want talk face to face of advance payment)
                        </p>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-xl p-4 focus-within:border-blue-400/50 transition-all duration-300">
                            <DollarSign className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                            <input
                              type="number"
                              name="advancePaid"
                              value={formData.advancePaid}
                              onChange={handleInputChange}
                              placeholder="Enter advance amount"
                              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Guidelines */}
                    <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-2">
                            Budget Guidelines
                          </h4>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>
                              • Typical residential electrical work based on
                              house: 20000 - 350,000 pkr
                            </li>
                            <li>• Commercial projects: 50,000 - 200,000</li>
                            <li>• Industrial installations: 100,0000+</li>
                            <li>
                              • Advance payment typically 20-30% of total budget
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Image Upload */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-400/30">
                        <Camera className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          Project Images
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                          Upload photos of the current electrical setup, problem
                          areas, or reference images
                        </p>
                      </div>
                    </div>

                    {/* Upload Area */}
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="group cursor-pointer block p-8 border-2 border-dashed border-white/30 hover:border-white/50 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                        >
                          <div className="text-center">
                            <motion.div
                              className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              {uploadImage ? (
                                <div className="w-6 h-6 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin"></div>
                              ) : (
                                <Upload className="w-8 h-8 text-pink-400" />
                              )}
                            </motion.div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {uploadImage
                                ? "Uploading Images..."
                                : "Upload Project Images"}
                            </h3>
                            <p className="text-white/60 text-sm mb-4">
                              Drag and drop files here or click to browse
                            </p>
                            <div className="flex items-center justify-center space-x-4 text-xs text-white/50">
                              <span>PNG, JPG, JPEG</span>
                              <span>•</span>
                              <span>Max 10MB per file</span>
                              <span>•</span>
                              <span>Up to 10 images</span>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Error Message */}
                      {picMessage && (
                        <motion.div
                          className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-300 font-medium">
                              {picMessage}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Image Previews */}
                      {formData.projectPics.length > 0 && (
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h4 className="text-lg font-semibold text-white flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                            Selected Images ({formData.projectPics.length})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {formData.projectPics.map((file, index) => (
                              <motion.div
                                key={index}
                                className="relative group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="relative overflow-hidden rounded-xl bg-white/10 border border-white/20">
                                  <img
                                    src={
                                      URL.createObjectURL(file) ||
                                      "/placeholder.svg"
                                    }
                                    alt={`preview-${index}`}
                                    className="w-full h-24 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowImagePreview(
                                          URL.createObjectURL(file)
                                        )
                                      }
                                      className="p-1.5 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-colors duration-300"
                                    >
                                      <Eye className="w-4 h-4 text-white" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors duration-300"
                                    >
                                      <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-white/60 mt-1 truncate">
                                  {file.name}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Image Guidelines */}
                      <div className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-white font-medium mb-2">
                              Image Guidelines
                            </h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>
                                • Take clear photos of existing electrical
                                panels, outlets, and problem areas
                              </li>
                              <li>
                                • Include wide shots showing the overall space
                                and close-ups of specific issues
                              </li>
                              <li>
                                • Photos help our electricians understand the
                                scope and prepare accordingly
                              </li>
                              <li>
                                • Reference images of desired outcomes are also
                                helpful
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-8 border-t border-white/10">
                <div className="flex space-x-4">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </motion.button>
                  )}
                </div>

                <div className="flex space-x-4">
                  {currentStep < 5 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!getStepValidation(currentStep)}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_0_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={
                        getStepValidation(currentStep) ? { scale: 1.02 } : {}
                      }
                      whileTap={
                        getStepValidation(currentStep) ? { scale: 0.98 } : {}
                      }
                    >
                      <span>Continue</span>
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={loading || !getStepValidation(currentStep)}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_8px_32px_0_rgba(34,197,94,0.3)] hover:shadow-[0_12px_40px_0_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={
                        !loading && getStepValidation(currentStep)
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={
                        !loading && getStepValidation(currentStep)
                          ? { scale: 0.98 }
                          : {}
                      }
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Submit Project</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </form>
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
              onClick={() => setShowImagePreview(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[80vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={showImagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-2xl"
                />
                <button
                  onClick={() => setShowImagePreview(null)}
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

export default AddProjectForm;
