import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../OtherComponents/Alert";

const VerifyADMNOTP = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [alert, setAlert] = useState(null);

  // local storage
  const resetToken = localStorage.getItem("admn_resttokn");
  const emailForgot = localStorage.getItem("email-forgotadmn");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminAuth/verify-forgotOTP`,
        { otp },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      if (response.status === 200) {
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
        setTimeout(() => {
          navigate("/reset_adminPssWord");
        }, 2300);
      } else {
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message);
      setAlert(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md mt-10">
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <div className="flex item-center flex-col justify-center w-full">
        <FontAwesomeIcon
          icon={faEnvelope}
          size="2xl"
          style={{ color: "#4b4949" }}
        />
        <h2 className="text-4xl text-center text-gray-800 mb-5">Verify OTP</h2>
        <p className="text-gray-500 mb-5 text-center mr-2">
          we sent a code to
          <span className="font-bold text-xl text-gray-900">{emailForgot}</span>
        </p>
      </div>
      <form onSubmit={handleVerifyOtp}>
        <input
          type="number"
          id="otp"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          required
          className="w-full p-2 border border-solid border-blue-500 rounded-lg mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Verify OTP
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
  );
};

export default VerifyADMNOTP;
