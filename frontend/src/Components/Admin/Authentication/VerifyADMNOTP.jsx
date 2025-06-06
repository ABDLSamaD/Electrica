import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import { FaArrowLeft } from "react-icons/fa";
import { Mail } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <div className="flex flex-col items-center justify-center space-y-4">
          <Mail className="w-5 h-5 text-orange-600" />
          <h2 className="text-3xl font-bold text-orange-500">Verify OTP</h2>
          <p className="text-gray-300 text-center">
            We sent a code to{" "}
            <span className="font-bold text-orange-500">{emailForgot}</span>
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
          <input
            type="number"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Verify OTP
          </button>
          <div className="flex items-center justify-center mt-4">
            <Link
              to="/admn-sign"
              className="flex items-center text-gray-300 hover:text-orange-500 transition duration-300"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-400" />
              <span className="ml-2">Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyADMNOTP;
