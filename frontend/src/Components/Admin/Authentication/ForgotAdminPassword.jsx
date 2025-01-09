import { faArrowLeft, faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";

const ForgotAdminPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5120/api/adminAuth/forgt-paswrd",
        { email }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        localStorage.setItem("admn_resttokn", response.data.token);
        localStorage.setItem("email-forgotadmn", email);
        setTimeout(() => {
          navigate("/verifyOTPADMIN");
        }, 3000);
      } else {
        setMessage(message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
      setType(err.response?.data?.type);
      setAlert(type, err.response?.data?.message || "Failed to send OTP");
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 flex h-screen flex-col justify-center">
      <div className="container shadow-xl p-4">
        <div className="flex items-center justify-center flex-col gap-2">
          <FontAwesomeIcon icon={faFingerprint} size="4x" />
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-5">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-5">
            No worries, we'll send you reset instruction
          </p>
        </div>
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-solid border-blue-500 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Send OTP
          </button>
          <div
            className="flex items-center justify-center mt-4"
            title="back to login"
          >
            <Link to="/signin">
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              <span className="mx-2">back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotAdminPassword;
