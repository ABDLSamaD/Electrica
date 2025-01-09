import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import "../dashboard.css";
import Alert from "../../OtherComponents/Alert";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  console.log(user);

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
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [alert, setAlert] = useState(null);

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

      console.log(formData);

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
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        setTimeout(() => {
          navigate("checkstatus");
        }, 2301);
      } else {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (error) {
      setType(error.response?.data?.type);
      setMessage(error.response?.data?.message || "An error occured");
      setAlert(
        error.response?.data?.type,
        error.response?.data?.message || "An error occured"
      );
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg shadow-lg p-8 mt-2">
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="rounded-e-full transition-all p-2 hover:bg-fuchsia-400 h-full"
          title="go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </button>
      </div>
      <div className="text mb-8">
        <h2 className="text-3xl text-cyan-950 font-semibold leading-10 mb-2">
          Add New Project
        </h2>
        <p className="text-cyan-950 font-normal">
          A comprehensive project involving electric roof wiring, concealed
          fittings, and troubleshooting installations. you want to create an
          project
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="gap-10 grid grid-cols-1 md:grid-cols-2"
      >
        <div className="group">
          <input
            type="text"
            name="clientName"
            className="inputes"
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
            className="inputes"
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
            className="inputes"
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
            className="inputes"
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
            className="inputes"
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
            className="inputes"
            required
          />
          <span className="highlight" />
          <span className="bar" />
          <label className="labled">Project City:</label>
        </div>

        <div className="bg-white p-1 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Images
          </h2>
          <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 hover:bg-gray-50 transition">
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
              <p className="text-gray-600 font-medium">
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
