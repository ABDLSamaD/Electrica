import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";

const Profile = () => {
  const auth = localStorage.getItem("dshbrd_usr_tkn"); //get token auth

  const { user } = useOutletContext();
  // States Start
  const [profileImg, setProfileImg] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
  );
  const [isEditable, setIsEditable] = useState(false); // Control input fields
  const [isImageSaved, setIsImageSaved] = useState(true); // Control image save button
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
    // try {
    //   const { fullName, address, phone, city } = credentials;
    //   const response = await axios.put(
    //     "http://localhost:5120/api/auth/updateuser-details",
    //     {
    //       fullName,
    //       address,
    //       phone,
    //       city,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${auth}`,
    //       },
    //     }
    //   );
    //   if (response.status === 200) {
    //     setType(response.data.type);
    //     setMessage(response.data.message);
    //     setALert(response.data.type, response.data.message);
    //     setIsEditable(false);
    //   } else {
    //     setType(response.data.type);
    //     setMessage(response.data.message);
    //     setALert(response.data.type, response.data.message);
    //   }
    // } catch (err) {
    //   setType(err.response?.data?.type);
    //   setMessage(err.response?.data?.message);
    //   setALert(err.response?.data?.type, err.response?.data?.message);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
        setIsEditable(false);
      } else {
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message);
      setALert(err.response?.data?.type, err.response?.data?.message);
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
        // mode: "no-cors",
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileImg(data.url.toString());
          setType(data.type);
          setMessage(data.message);
          setALert(data.type, data.message);
          setIsImageSaved(false);
        })
        .catch((err) => {
          console.log(err);
          setType(err.type);
          setMessage(err.message);
          setALert(err.type, err.message);
        });
      // https://api.cloudinary.com/v1_1/dq76oaoqh
    } else {
      return setPicMessage("Please Select a Valid Image (JPEG/PNG)");
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5120/api/auth/adduser-profileImg",
        {
          profileImg,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      if (response.status === 200) {
        setIsImageSaved(true);
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
      } else {
        setType(response.data.type);
        setMessage(response.data.message);
        setALert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message);
      setALert(err.response?.data?.type, err.response?.data?.message);
    }
  };

  return (
    <div className="relative top-10 h-auto flex items-center">
      {alert && (
        <Alert type={type} message={message} onClose={() => setALert(null)} />
      )}
      <div className="container mx-auto px-4">
        <h1 className="text-3xl text-gray-700 p-2">Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {picMessage && (
              <Alert
                type={type}
                message={message}
                onClose={() => setALert(null)}
              />
            )}
            <div className="flex flex-col items-center justify-between gap-2">
              <img
                src={user?.profileImg || profileImg}
                alt="Profile"
                className="w-32 h-32 rounded-full shadow-lg object-cover"
              />
              <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
              <p className="text-gray-500">{user?.city || "default city"}</p>
              <p className="text-gray-500">
                {new Date(user.Date).toLocaleDateString()}
              </p>
              <input
                className="mt-4 text-blue-500 hover:underline"
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
          </div>

          {/* Right Side: Editable Profile Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm text-gray-500 mb-6">
              The information can be edited
            </p>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name *
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullName"
                  onChange={onChange}
                  placeholder="Full name"
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={user.fullName}
                  disabled={!isEditable}
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address *
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={user.email}
                  disabled
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={onChange}
                  placeholder="Phone number"
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={user.phone}
                  disabled={!isEditable}
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <select
                  id="state"
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Select state</option>
                  <option>California</option>
                  <option>Texas</option>
                  <option>Florida</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  onChange={onChange}
                  placeholder="City"
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={user.city}
                  disabled={!isEditable}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={onChange}
                  placeholder="address"
                  className="mt-1 w-full border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={user.address}
                  disabled={!isEditable}
                />
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-between gap-4">
                {!isEditable ? (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-500"
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
