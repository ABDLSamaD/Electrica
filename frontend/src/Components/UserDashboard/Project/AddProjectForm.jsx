"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  X,
  Eye,
} from "lucide-react";
import { useAlert } from "../../OtherComponents/AlertProvider";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Null-safe context extraction
  const outletContext = useOutletContext() || {};
  const { user = {}, electricaURL = "" } = outletContext;

  const { success, error, warning } = useAlert();

  // Safe user object
  const safeUser =
    user && typeof user === "object" ? user : {};

  const [formData, setFormData] = useState({
    clientName: safeUser.fullName || safeUser.name || "",
    clientNumber: safeUser.phone || "",
    projectDescription: "",
    projectAddress: safeUser.address || "",
    projectName: "",
    projectCity: safeUser.city || "",
    category: "",
    voltageType: "",
    phases: "",
    estimatedBudget: "",
    advancePaid: "",
    projectPics: [],
  });

  const [picMessage, setPicMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Keep user information synchronized
  useEffect(() => {
    const latestSafeUser =
      user && typeof user === "object" ? user : {};

    setFormData((previous) => ({
      ...previous,
      clientName:
        latestSafeUser.fullName ||
        latestSafeUser.name ||
        previous.clientName,
      clientNumber:
        latestSafeUser.phone ||
        previous.clientNumber,
      projectAddress:
        latestSafeUser.address ||
        previous.projectAddress,
      projectCity:
        latestSafeUser.city ||
        previous.projectCity,
    }));
  }, [user]);

  // Create image previews
  useEffect(() => {
    if (!formData.projectPics.length) {
      setImagePreviews([]);
      return;
    }

    const previews = formData.projectPics.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach(({ url }) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [formData.projectPics]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const uploadImagesToCloudinary = async (files) => {
    if (!files?.length) {
      return [];
    }

    setUploadImage(true);
    setPicMessage("");

    try {
      const uploadPromises = files.map(async (file) => {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          throw new Error(
            "Invalid file type. Please select JPEG or PNG images."
          );
        }

        const data = new FormData();

        data.append("file", file);
        data.append("upload_preset", "electrica-profile");
        data.append("cloud_name", "dchie2dvi");

        const response = await fetch(
          import.meta.env.VITE_CLOUDINARY_URL,
          {
            method: "POST",
            body: data,
          }
        );

        const responseData = await response.json();

        if (!response.ok || !responseData.secure_url) {
          throw new Error("Failed to upload image.");
        }

        return responseData.secure_url;
      });

      return await Promise.all(uploadPromises);
    } catch (uploadError) {
      setPicMessage(
        uploadError.message || "Error uploading images. Please try again."
      );

      throw uploadError;
    } finally {
      setUploadImage(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    // Max 10 images validation
    if (files.length > 10) {
      warning("You can upload a maximum of 10 images.");
      event.target.value = "";
      return;
    }

    // File type validation
    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png"].includes(file.type)
    );

    if (invalidFile) {
      warning("Only JPEG and PNG images are allowed.");
      event.target.value = "";
      return;
    }

    setPicMessage("");

    setFormData((previous) => ({
      ...previous,
      projectPics: files,
    }));

    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      projectPics: previous.projectPics.filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }));
  };

  const createProject = async () => {
    let imageUrls = [];

    if (formData.projectPics.length > 0) {
      imageUrls =
        await uploadImagesToCloudinary(
          formData.projectPics
        );
    }

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
    newFormData.append(
      "projectDescription",
      projectDescription
    );
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

    const response = await fetch(
      `${electricaURL}/api/auth/project`,
      {
        method: "POST",
        body: newFormData,
        credentials: "include",
      }
    );

    let responseData = {};

    try {
      responseData = await response.json();
    } catch {
      responseData = {};
    }

    if (!response.ok) {
      throw new Error(
        responseData.message || "Unable to create project."
      );
    }

    return responseData;
  };

  const { mutate: submitProject, isPending: loading } =
    useMutation({
      mutationFn: createProject,

      onSuccess: (data) => {
        success(data.message);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        });

        queryClient.invalidateQueries({
          queryKey: ["user"],
        });

        // Navigate immediately after success
        navigate("/db-au-user/checkstatus");
      },

      onError: (submitError) => {
        error(
          submitError.message ||
            "Something went wrong while creating the project."
        );
      },
    });

  const validateForm = () => {
    // projectDescription is now OPTIONAL
    const requiredFields = [
      ["clientName", "Client name"],
      ["clientNumber", "Contact number"],
      ["projectName", "Project name"],
      ["projectAddress", "Project address"],
      ["projectCity", "Project city"],
      ["category", "Project category"],
      ["voltageType", "Voltage type"],
      ["phases", "Phase configuration"],
      ["estimatedBudget", "Estimated budget"],
      ["advancePaid", "Advance payment"],
    ];

    const missingField = requiredFields.find(
      ([field]) => !String(formData[field]).trim()
    );

    if (missingField) {
      warning(`${missingField[1]} is required.`);
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    submitProject();
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Create New Project
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Add the client, project, technical, financial, and
              optional image details for your electrical
              project.
            </p>
          </div>

          {/* Required field information */}
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />

            <div className="text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">
                Required fields
              </p>

              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Fields marked with{" "}
                <span className="font-semibold text-red-500">
                  #
                </span>{" "}
                are mandatory. Project images and
                description are optional.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Client Information */}
          <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Client Information
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Basic contact details
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">

              {/* Client Name */}
              <FormField
                label="Client Name"
                required
                description="Full name of the client or property owner."
                icon={<User className="h-4 w-4" />}
              >
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client's full name"
                  required
                  className={inputClass}
                />
              </FormField>

              {/* Client Number */}
              <FormField
                label="Contact Number"
                required
                description="Primary phone number for project coordination."
                icon={<Phone className="h-4 w-4" />}
              >
                <input
                  type="tel"
                  name="clientNumber"
                  value={formData.clientNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  required
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          {/* Project Details */}
          <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-500/10">
                  <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Project Details
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Project name, location and description
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Project Name */}
                <FormField
                  label="Project Name"
                  required
                  description="Name you want to use for this project or contract."
                  icon={<Building className="h-4 w-4" />}
                >
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="e.g. Complete House Rewiring"
                    required
                    className={inputClass}
                  />
                </FormField>

                {/* Project City */}
                <FormField
                  label="Project City"
                  required
                  description="City where the electrical work will be performed."
                  icon={<MapPin className="h-4 w-4" />}
                >
                  <input
                    type="text"
                    name="projectCity"
                    value={formData.projectCity}
                    onChange={handleInputChange}
                    placeholder="Enter project city"
                    required
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Address */}
              <FormField
                label="Project Address"
                required
                description="Complete address where the electrical work will be performed."
                icon={<Home className="h-4 w-4" />}
              >
                <textarea
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete address including street and area"
                  rows={3}
                  required
                  className={`${inputClass} resize-y`}
                />
              </FormField>

              {/* Description - OPTIONAL */}
              <FormField
                label="Project Description"
                description="Briefly describe the electrical work, scope and specific tasks."
                icon={<FileText className="h-4 w-4" />}
              >
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the electrical work if needed..."
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-500/10">
                  <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Technical Specifications
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Electrical requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">

              {/* Category */}
              <FormField
                label="Project Category"
                required
                description="Type of property requiring electrical work."
                icon={<Building className="h-4 w-4" />}
              >
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className={selectClass}
                >
                  <option value="">Select Category</option>
                  <option value="Residential">
                    Residential (Home/Apartment)
                  </option>
                  <option value="Commercial">
                    Commercial (Office/Shop)
                  </option>
                  <option value="Industrial">
                    Industrial (Factory/Warehouse)
                  </option>
                </select>
              </FormField>

              {/* Voltage */}
              <FormField
                label="Voltage Type"
                required
                description="Required voltage level."
                icon={<Zap className="h-4 w-4" />}
              >
                <select
                  name="voltageType"
                  value={formData.voltageType}
                  onChange={handleInputChange}
                  required
                  className={selectClass}
                >
                  <option value="">Select Voltage</option>
                  <option value="Low">
                    Low Voltage (120-240V)
                  </option>
                  <option value="Medium">
                    Medium Voltage (480-600V)
                  </option>
                  <option value="High">
                    High Voltage (Above 1000V)
                  </option>
                </select>
              </FormField>

              {/* Phases */}
              <FormField
                label="Phase Configuration"
                required
                description="Electrical phase setup."
                icon={<Zap className="h-4 w-4" />}
              >
                <select
                  name="phases"
                  value={formData.phases}
                  onChange={handleInputChange}
                  required
                  className={selectClass}
                >
                  <option value="">Select Phases</option>
                  <option value={1}>
                    Single Phase (Residential)
                  </option>
                  <option value={3}>
                    Three Phase (Commercial/Industrial)
                  </option>
                </select>
              </FormField>
            </div>
          </section>

          {/* Financial Information */}
          <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Financial Information
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Budget and advance payment
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">

              {/* Budget */}
              <FormField
                label="Estimated Budget"
                required
                description="Estimated budget for the complete project. Use 0 if you want to discuss the budget face-to-face."
                icon={<DollarSign className="h-4 w-4" />}
              >
                <input
                  type="number"
                  min="0"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleInputChange}
                  placeholder="Enter estimated budget"
                  required
                  className={inputClass}
                />
              </FormField>

              {/* Advance */}
              <FormField
                label="Advance Payment"
                required
                description="Advance amount to start the project. Use 0 if you want to discuss it face-to-face."
                icon={<DollarSign className="h-4 w-4" />}
              >
                <input
                  type="number"
                  min="0"
                  name="advancePaid"
                  value={formData.advancePaid}
                  onChange={handleInputChange}
                  placeholder="Enter advance amount"
                  required
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="mx-5 mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Budget Guidelines
                  </h4>

                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      • Residential electrical work: 20,000 -
                      350,000 PKR
                    </li>
                    <li>
                      • Commercial projects: 50,000 - 200,000
                      PKR
                    </li>
                    <li>
                      • Industrial installations: 100,000+ PKR
                    </li>
                    <li>
                      • Advance payment is typically 20-30%
                      of total budget
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Project Images
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      Optional
                    </span>
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add photos of the existing setup, problem
                    areas or reference images.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
                id="project-image-upload"
              />

              <label
                htmlFor="project-image-upload"
                className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-gray-600"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-900">
                  {uploadImage ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                  {uploadImage
                    ? "Uploading images..."
                    : "Upload project images"}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG or JPG • Optional • Up to 10 images
                </p>
              </label>

              {picMessage && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                  <AlertCircle className="h-5 w-5 text-red-500" />

                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    {picMessage}
                  </p>
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />

                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Selected Images (
                      {imagePreviews.length})
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {imagePreviews.map(
                      ({ file, url }, index) => (
                        <div
                          key={`${file.name}-${index}`}
                        >
                          <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowImagePreview(url)
                                }
                                className="rounded-lg bg-white/90 p-2 text-gray-800 hover:bg-white"
                                aria-label="Preview image"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImage(index)
                                }
                                className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                                aria-label="Remove image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                            {file.name}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Image tips
                    </p>

                    <ul className="mt-2 space-y-1">
                      <li>
                        • Take clear photos of electrical
                        panels and problem areas.
                      </li>
                      <li>
                        • Include both wide shots and
                        close-ups when useful.
                      </li>
                      <li>
                        • Reference images can also be
                        added.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-red-500">
                #
              </span>{" "}
              Required fields must be completed before
              submitting.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Image Preview Modal */}
        {showImagePreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowImagePreview(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={showImagePreview}
                alt="Project preview"
                className="max-h-[85vh] max-w-full rounded-lg object-contain"
              />

              <button
                type="button"
                onClick={() => setShowImagePreview(null)}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/*
 * Reusable field wrapper
 */
const FormField = ({
  label,
  required = false,
  description,
  icon,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        {icon && (
          <span className="text-gray-500 dark:text-gray-400">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span
            className="text-red-500"
            title="Required field"
          >
            #
          </span>
        )}
      </label>

      {description && (
        <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {children}
    </div>
  );
};

// Simplified input styling - no blue focus ring
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-700";

const selectClass = inputClass;

export default AddProjectForm;