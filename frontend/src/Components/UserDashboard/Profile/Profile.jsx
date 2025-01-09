import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import { FaUserAlt, FaPhoneAlt, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = () => {
  const navigate = useNavigate();
  // const auth = localStorage.getItem("dshbrd_usr_tkn"); // get token auth

  const { user, fetchUser } = useOutletContext();
  // States Start
  const [profileImg, setProfileImg] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
  );
  const [isEditable, setIsEditable] = useState(false); // Control input fields
  const [isImageSaved, setIsImageSaved] = useState(true); // Control image save button
  const [loading, setLoading] = useState(false); // Loading state
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
  // States End

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
        "http://localhost:5120/api/auth/adduser-details",
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
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
        setIsEditable(false);
        fetchUser();
      } else {
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message);
      setALert(err.response?.data?.type, err.response?.data?.message);
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

    if (profileImg.type === "image/jpeg" || profileImg.type === "image/png") {
      const data = new FormData();
      data.append("file", profileImg);
      data.append("upload_preset", "electrica-profile");
      data.append("cloud_name", "dchie2dvi");
      fetch("https://api.cloudinary.com/v1_1/dchie2dvi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileImg(data.url.toString());
          setIsImageSaved(false);
        })
        .catch((err) => {
          setMessage(err.message);
        });
    } else {
      return setPicMessage("Please Select a Valid Image (JPEG/PNG)");
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5120/api/auth/adduser-profileImg",
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
      setLoading(false);
    }
  };
  if (alert) {
    return (
      <Alert type={type} message={message} onClose={() => setALert(null)} />
    );
  }
  if (loading) {
    return <div className="spinner-overlay">Loading...</div>;
  }

  return (
    <div className="relative top-2 h-auto flex flex-wrap items-center bg-opacity-50 rounded-xl shadow-md backdrop-blur-md">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-300 hover:scale-110 transition px-5 my-7"
        title="Go Back"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>
      {message && <p> {message}</p>}
      <div className="px-4 w-full">
        <div className="flex flex-col w-full gap-6">
          {/* Left Side: Profile Card */}
          <div className="space-y-3 bg-[rgba(1,1,1,0.2)] backdrop-blur-lg rounded-lg shadow-md p-8 w-full max-w-full">
            <h1 className="text-gray-400">Upload an image</h1>
            <img
              src={user?.profileImg || profileImg}
              alt="Profile"
              className="w-32 h-32 rounded-full shadow-lg object-cover"
            />
            <h2 className="text-xl text-gray-300 font-semibold">
              {user?.name}
            </h2>
            <p className="text-gray-50 flex items-center gap-2">
              <FaCity /> {user?.city || "default city"}
            </p>
            <p className="text-gray-50">
              Account created {new Date(user.Date).toLocaleDateString()}
            </p>
            <input
              className="text-blue-500 hover:underline"
              type="file"
              name="profileImg"
              onChange={(e) => postDetails(e.target.files[0])}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-500"
              onClick={handleImage}
              id="imagesavebtn"
              disabled={isImageSaved}
            >
              Save Image
            </button>
          </div>

          {/* Right Side: Editable Profile Form */}
          <div className="bg-[rgba(1,1,1,0.2)] backdrop-blur-lg rounded-lg shadow-md p-8 w-full max-w-full">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Update your personal information below.
            </p>
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
                  Full Name *
                </label>
                <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                  <FaUserAlt className="text-gray-400 text-lg mx-2" />
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
                  Email Address *
                </label>
                <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-sm">
                  <AiOutlineMail className="text-gray-400 text-lg mx-2" />
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
                <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                  <FaPhoneAlt className="text-gray-400 text-lg mx-2" />
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
                <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                  <FaCity className="text-gray-400 text-lg mx-2" />
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
                <div className="flex items-center bg-gray-700 p-2 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                  <FaMapMarkerAlt className="text-gray-400 text-lg mx-2" />
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
              <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
                {!isEditable ? (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500"
                  >
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
