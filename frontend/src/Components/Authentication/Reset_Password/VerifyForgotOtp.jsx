import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalVerificationEmail from "../../OtherComponents/GlobalVerificationEmail";
import Loader from "../../OtherComponents/Loader";

const VerifyForgotOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // local storage
  const resetToken = localStorage.getItem("reset_token_forgot");
  const emailForgot = localStorage.getItem("email-forgot");

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/verify-forgototp`,
        { otp: otpString, resetToken, email: emailForgot }
      );
      if (response.status === 200) {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/reset-password");
        }, 1200);
      } else {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    }
  };
  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/resend-forgot-otp`,
        { email: emailForgot }
      );
      if (response.status === 200) {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setLoading(false);
      } else {
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message,
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <GlobalVerificationEmail
        alert={alert}
        setAlert={setAlert}
        handleOtpForm={handleVerifyOtp}
        otp={otp}
        handleChange={handleChange}
        onkeyDown={handleKeyDown}
        loading={loading}
        resendForgotOtp={resendOtp}
      />
    </>
  );
};

export default VerifyForgotOtp;
