import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import "../dashboard.css";
import Alert from "../../OtherComponents/Alert";
import LoaderAll from "../../OtherComponents/LoaderAll";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();

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
    projectPics: null, // Handle file uploads here
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      projectPics: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        clientName,
        clientNumber,
        projectDescription,
        projectAddress,
        projectName,
        projectCity,
        projectPics,
      } = formData;

      const response = await axios.post(
        "http://localhost:5120/api/auth/project",
        {
          clientName,
          clientNumber,
          projectDescription,
          projectAddress,
          projectName,
          projectCity,
          projectPics,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        setTimeout(() => {
          navigate("/db-au-user/checkstatus");
        }, 2301);
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (error) {
      setAlert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderAll />
      </div>
    );
  }

  return (
    <div className="p-4 mt-2 animate-fade-in">
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
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={faCamera}
                className="text-4xl text-gray-500 mb-2"
              />
              <p className="text-gray-600 font-medium animate-pulse">
                Click to upload images
              </p>
            </div>
          </div>
        </div>
        <button type="submit" className="buttons">
          <p>Submit project</p>
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
