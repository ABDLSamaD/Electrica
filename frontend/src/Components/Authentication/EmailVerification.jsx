import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalVerificationEmail from "../OtherComponents/GlobalVerificationEmail";

const EmailVerification = () => {
  const navigate = useNavigate();

  // State management
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const { key } = e;
    if (key === "Backspace" && index > 0 && !otp[index]) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOtpForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join("");

    try {
      const response = await axios.post(`${electricaURL}/api/auth/verify-otp`, {
        otp: otpString,
        email: localStorage.getItem("us-em-temporary"),
      });

      if (response.status === 200) {
        localStorage.removeItem("us-em-temporary");
        localStorage.removeItem("tkn-at-udb");
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });

        setTimeout(() => navigate("/db-au-user"), 1200);
      } else {
        setLoading(false);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const authEmail = localStorage.getItem("us-em-temporary");
      const response = await axios.post(
        "http://localhost:5120/api/auth/resend-otp",
        { email: authEmail }
      );

      if (response.status === 200) {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setLoading(false);
      } else {
        setLoading(false);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    }
  };

  return (
    <div>
      <GlobalVerificationEmail
        alert={alert}
        setAlert={setAlert}
        handleOtpForm={handleOtpForm}
        otp={otp}
        handleChange={handleChange}
        resendOtp={handleResendOtp}
        loading={loading}
        onkeyDown={handleKeyDown}
      />
    </div>
  );
};

export default EmailVerification;
