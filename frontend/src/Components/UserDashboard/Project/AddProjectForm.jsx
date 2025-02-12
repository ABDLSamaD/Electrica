import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../dashboard.css";
import Alert from "../../OtherComponents/Alert";
import LoginLoader from "../../OtherComponents/LoginLoader";

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

  // Upload images to Cloudinary
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
      } = formData;

      const newFormData = new FormData(); // Create a new FormData instance

      // Append text fields to the FormData object
      newFormData.append("clientName", clientName);
      newFormData.append("clientNumber", clientNumber);
      newFormData.append("projectDescription", projectDescription);
      newFormData.append("projectAddress", projectAddress);
      newFormData.append("projectName", projectName);
      newFormData.append("projectCity", projectCity);

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
    <div className="p-4 min-h-screen relative top-10 mb-16 animate-fade-in">
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
      <div className="text mb-8 animate-slide-in-left">
        <h2 className="text-3xl text-cyan-50 font-semibold leading-10 mb-2">
          Add New Project
        </h2>
        <p className="text-cyan-50 font-normal">
          A comprehensive project involving electric roof wiring, concealed
          fittings, and troubleshooting installations. You want to create a
          project.
        </p>
      </div>
      {/* ```jsx */}
      <form
        onSubmit={handleSubmit}
        className="gap-10 grid grid-cols-1 md:grid-cols-2 text-white animate-slide-in-up"
      >
        <div className="group">
          <input
            type="text"
            name="clientName"
            className="inputes animate-appear"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Name</label>
        </div>

        <div className="group">
          <input
            type="number"
            name="clientNumber"
            value={formData.clientNumber}
            onChange={handleInputChange}
            className="inputes animate-appear"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Client Number:</label>
        </div>

        <div className="group">
          <input
            type="text"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            className="inputes animate-appear"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Project Description:</label>
        </div>

        <div className="group">
          <input
            type="text"
            name="projectAddress"
            value={formData.projectAddress}
            onChange={handleInputChange}
            className="inputes animate-appear"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Project Address:</label>
        </div>

        <div className="group">
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className="inputes animate-appear"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Project Name:</label>
        </div>

        <div className="group">
          <input
            type="text"
            name="projectCity"
            value={formData.projectCity}
            onChange={handleInputChange}
            className="inputes animate-appear"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Project City:</label>
        </div>

        <div className="p-1 rounded-lg shadow-md group animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Project Images
          </h2>
          <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-300">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={!uploadImage && faCamera}
                className="text-4xl text-gray-500 mb-2"
              />
              <p className="text-gray-600 font-medium animate-pulse">
                {uploadImage ? "Uploading..." : "Upload Project Images"}
              </p>
            </div>
          </div>
          {/* Image Previews */}
          {formData.projectPics.length > 0 &&
            (uploadImage ? (
              "wait image load"
            ) : (
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.projectPics.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)} // Create a preview URL for the image
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>

        <button type="submit" className="buttons" disabled={loading}>
          <p>{loading ? <LoginLoader /> : "Submit"}</p>
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
