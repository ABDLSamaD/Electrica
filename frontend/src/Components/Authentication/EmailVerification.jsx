import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalVerificationEmail from "../OtherComponents/GlobalVerificationEmail";
import Loader from "../OtherComponents/Loader";

const EmailVerification = () => {
  const navigate = useNavigate();

  // State management
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post(
        "http://localhost:5120/api/auth/verify-otp",
        { otp: otpString, email: localStorage.getItem("us-em-temporary") }
      );

      if (response.status === 200) {
        localStorage.removeItem("us-em-temporary");
        localStorage.removeItem("tkn-at-udb");
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });

        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    } finally {
      setLoading(false);
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
      } else {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
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
