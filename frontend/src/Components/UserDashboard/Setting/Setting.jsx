import axios from "axios";
import React, { useState } from "react";
import Alert from "../../OtherComponents/Alert";

const Setting = () => {
  // State for notifications
  const [emailNotifications, setEmailNotifications] = useState({
    productUpdates: true,
    securityUpdates: false,
  });
  const [phoneNotifications, setPhoneNotifications] = useState({
    email: true,
    securityUpdates: false,
  });

  // State for password fields
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setALert] = useState(null);

  const [errors, setErrors] = useState({});

  // Validation and submission for passwords
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    const validationErrors = {};
    if (!passwords.oldPassword)
      validationErrors.oldPassword = "Old password is required.";
    if (!passwords.newPassword)
      validationErrors.newPassword = "New password is required.";
    if (passwords.newPassword !== passwords.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    const { oldPassword, newPassword } = passwords;
    e.preventDefault();
    if (validatePasswords()) {
      // Submit password change logic
      try {
        const response = await axios.post(
          "http://localhost:5120/api/auth/change-password",
          {
            oldPassword,
            newPassword,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setType(response.data.type);
          setMessage(response.data.message);
          setALert(response.data.type, response.data.message);
          setPasswords("");
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
    }
  };

  return (
    <>
      {alert && (
        <Alert type={type} message={message} onClose={() => setALert(null)} />
      )}
      <div className="p-6 bg-gray-50">
        {/* Settings Header */}
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Notifications Section */}
        <div className="bg-white shadow p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <p className="text-sm text-gray-500 mb-4">Manage the notifications</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Email Notifications */}
            <div>
              <h3 className="font-medium mb-2">Email</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={emailNotifications.productUpdates}
                  onChange={() =>
                    setEmailNotifications((prev) => ({
                      ...prev,
                      productUpdates: !prev.productUpdates,
                    }))
                  }
                  className="form-checkbox text-indigo-600"
                />
                <span>Product updates</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={emailNotifications.securityUpdates}
                  onChange={() =>
                    setEmailNotifications((prev) => ({
                      ...prev,
                      securityUpdates: !prev.securityUpdates,
                    }))
                  }
                  className="form-checkbox text-indigo-600"
                />
                <span>Security updates</span>
              </label>
            </div>

            {/* Phone Notifications */}
            <div>
              <h3 className="font-medium mb-2">Phone</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={phoneNotifications.email}
                  onChange={() =>
                    setPhoneNotifications((prev) => ({
                      ...prev,
                      email: !prev.email,
                    }))
                  }
                  className="form-checkbox text-indigo-600"
                />
                <span>Email</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={phoneNotifications.securityUpdates}
                  onChange={() =>
                    setPhoneNotifications((prev) => ({
                      ...prev,
                      securityUpdates: !prev.securityUpdates,
                    }))
                  }
                  className="form-checkbox text-indigo-600"
                />
                <span>Security updates</span>
              </label>
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Save changes
          </button>
        </div>

        {/* Password Update Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Password</h2>
          <p className="text-sm text-gray-500 mb-4">Update password</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.oldPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter old password"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Setting;
