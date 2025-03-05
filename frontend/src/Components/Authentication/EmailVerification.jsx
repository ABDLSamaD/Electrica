import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalVerificationEmail from "../OtherComponents/GlobalVerificationEmail";

const EmailVerification = () => {
  const navigate = useNavigate();
  const cookieEmail = Cookies.get("signup_email");

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
      const response = await axios.post(
        `${electricaURL}/api/auth/verify-otp`,
        {
          otp: otpString,
          email: cookieEmail,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        Cookies.remove("signup_email");
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });

        setTimeout(() => navigate(response.data.redirectUrl), 1300);
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
  // const handleEmailChange = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       `${electricaURL}/api/auth/change-email`,
  //       {
  //         email: localStorage.getItem("us-em-temporary"),
  //         newEmail,
  //       }
  //     );

  //     if (response.status === 201) {
  //       localStorage.removeItem("us-em-temporary");
  //       localStorage.removeItem("tkn-at-udb");
  //       setAlert({
  //         type: response.data.type,
  //         message: response.data.message,
  //       });

  //       setTimeout(() => navigate(response.data.redirectUrl), 1300);
  //     } else {
  //       setAlert({
  //         type: response.data.type,
  //         message: response.data.message,
  //       });
  //     }
  //   } catch (err) {
  //     setAlert({
  //       type: err.response?.data?.type,
  //       message: err.response?.data?.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
