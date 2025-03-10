import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Camera, Trash2 } from "lucide-react";
import "../dashboard.css";
import Alert from "../../OtherComponents/Alert";
import MiniLoader from "../../OtherComponents/Miniloader";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const { user, fetchUser, fetchProject, electricaURL } = useOutletContext();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous route
  };

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
    projectPics: [], // Handle file uploads here
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picMessage, setPicMessage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);

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
          return responseData.secure_url; // Use `secure_url` for HTTPS
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

    return imageUrls.filter((url) => url !== null); // Remove failed uploads
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

      const newFormData = new FormData(); // Create a new FormData instance

      // Append text fields to the FormData object
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

      // Append files to FormData
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
        setAlert({ type: response.data.type, message: response.data.message });
        setLoading(false);
        fetchUser();
        fetchProject();
        setTimeout(() => {
          navigate("/db-au-user/checkstatus");
        }, 2301);
      } else {
        setLoading(false);
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen relative top-10 mb-16">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="text-white hover:text-gray-400 transition-colors duration-300"
          title="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>
      <div className="text mb-8">
        <h2 className="text-3xl text-cyan-50 font-semibold leading-10 mb-2">
          Add New Project
        </h2>
        <p className="text-cyan-50 font-normal">
          A comprehensive project involving electric roof wiring, concealed
          fittings, and troubleshooting installations. You want to create a
          project.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information Section */}
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Client Number
              </label>
              <input
                type="number"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Project Description
              </label>
              <input
                type="text"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Project Address
              </label>
              <input
                type="text"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Project City
              </label>
              <input
                type="text"
                name="projectCity"
                value={formData.projectCity}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Voltage Type
              </label>
              <select
                name="voltageType"
                value={formData.voltageType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Voltage Type</option>
                <option value="Low">Low Voltage</option>
                <option value="Medium">Medium Voltage</option>
                <option value="High">High Voltage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Phases
              </label>
              <select
                name="phases"
                value={formData.phases}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Phases</option>
                <option value={1}>Single Phase</option>
                <option value={3}>Three Phase</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Estimated Budget
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Advance Paid
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="advancePaid"
                  value={formData.advancePaid}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
            Project Images
          </h3>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-800 dark:hover:bg-gray-750 transition-colors">
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
              className="cursor-pointer flex flex-col items-center"
            >
              <Camera className="h-10 w-10 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {uploadImage
                  ? "Uploading..."
                  : "Drag and drop files or click to upload"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </span>
            </label>
          </div>

          {/* Image Previews */}
          {formData.projectPics.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.projectPics.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <MiniLoader />
              <span>Processing...</span>
            </div>
          ) : (
            "Submit Project"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
