"use client";

import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import { FaUserAlt, FaPhoneAlt, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniLoader from "../../OtherComponents/Miniloader";

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

  return (
    <div className="relative top-12 mb-12 overflow-hidden min-h-screen flex flex-wrap items-start p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-300 hover:scale-110 transition px-5 my-7 mx-2 absolute top-0 left-0"
        title="Go Back"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      {message && (
        <p className="w-full text-center text-gray-200 mb-4">{message}</p>
      )}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setALert(null)}
        />
      )}

      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          {/* Left Side: Profile Card */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-xl p-8 w-full lg:w-1/3 transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-4">
                Profile Photo
              </h2>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-900 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <img
                    src={user?.profileImg || profileImg}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border-4 border-gray-700"
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="w-10 h-10 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl text-gray-200 font-semibold">
                  {user?.name}
                </h2>
                <p className="text-gray-400 flex items-center justify-center gap-2 mt-2">
                  <FaCity className="text-indigo-400" />{" "}
                  {user?.city || "default city"}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* image input */}
              <div className="w-full space-y-4 mt-4">
                <div className="relative group w-full">
                  <label
                    htmlFor="profile-upload"
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg cursor-pointer transition-all duration-300"
                  >
                    <span className="mr-2">Choose Image</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                  <input
                    id="profile-upload"
                    className="hidden"
                    type="file"
                    name="profileImg"
                    onChange={(e) => postDetails(e.target.files[0])}
                  />
                </div>

                {picMessage && (
                  <p className="text-red-400 text-sm text-center">
                    {picMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className={`w-full px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isImageSaved
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                  }`}
                  onClick={handleImage}
                  id="imagesavebtn"
                  disabled={isImageSaved || imageLoading}
                >
                  {imageLoading ? (
                    <div className="w-6 h-6 border-2 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {imageLoading ? "Saving..." : "Save Image"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Editable Profile Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-8 w-full lg:w-2/3 transition-all duration-300 hover:shadow-2xl">
            <div className="border-b border-gray-700 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-200">
                Personal Information
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Update your profile details below
              </p>
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div className="relative">
                <label
                  htmlFor="fullname"
                  className="text-sm font-medium text-gray-400 block mb-2"
                >
                  Full Name <span className="text-indigo-400">*</span>
                </label>
                <div
                  className={`flex items-center bg-gray-700 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                    isEditable ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <FaUserAlt className="text-indigo-400 text-lg mx-2" />
                  <input
                    type="text"
                    id="fullname"
                    name="fullName"
                    onChange={onChange}
                    placeholder="Enter full name"
                    className="flex-grow bg-transparent text-gray-200 outline-none focus:ring-0"
                    defaultValue={user.fullName}
                    disabled={!isEditable}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-400 block mb-2"
                >
                  Email Address <span className="text-indigo-400">*</span>
                </label>
                <div className="flex items-center bg-gray-700 p-3 rounded-lg shadow-sm">
                  <AiOutlineMail className="text-indigo-400 text-lg mx-2" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    className="flex-grow bg-transparent text-gray-400 outline-none focus:ring-0"
                    defaultValue={user.email}
                    disabled
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-400 block mb-2"
                >
                  Phone Number
                </label>
                <div
                  className={`flex items-center bg-gray-700 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                    isEditable ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <FaPhoneAlt className="text-indigo-400 text-lg mx-2" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    onChange={onChange}
                    placeholder="Enter phone number"
                    className="flex-grow bg-transparent text-gray-200 outline-none focus:ring-0"
                    defaultValue={user.phone}
                    disabled={!isEditable}
                  />
                </div>
              </div>

              {/* City */}
              <div className="relative">
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-400 block mb-2"
                >
                  City
                </label>
                <div
                  className={`flex items-center bg-gray-700 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                    isEditable ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <FaCity className="text-indigo-400 text-lg mx-2" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    onChange={onChange}
                    placeholder="Enter city"
                    className="flex-grow bg-transparent text-gray-200 outline-none focus:ring-0"
                    defaultValue={user.city}
                    disabled={!isEditable}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="relative col-span-1 md:col-span-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-400 block mb-2"
                >
                  Address
                </label>
                <div
                  className={`flex items-center bg-gray-700 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                    isEditable ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <FaMapMarkerAlt className="text-indigo-400 text-lg mx-2" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={onChange}
                    placeholder="Enter address"
                    className="flex-grow bg-transparent text-gray-200 outline-none focus:ring-0"
                    defaultValue={user.address}
                    disabled={!isEditable}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
                {!isEditable ? (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
                  >
                    Update Profile
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 flex items-center"
                    disabled={loading}
                  >
                    {loading ? <MiniLoader /> : null}
                    Save Details
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
