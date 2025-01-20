import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPassword from "../../OtherComponents/ForgotPassword";

const ForgotAdminPassword = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminAuth/forgt-paswrd`,
        { email }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        localStorage.setItem("admn_resttokn", response.data.token);
        localStorage.setItem("email-forgotadmn", email);
        setTimeout(() => {
          navigate("/verifyOTPADMIN");
        }, 1200);
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message || "Failed to send OTP",
      });
    }
  };
  return (
    <ForgotPassword
      alert={alert}
      setAlert={setAlert}
      linkprevious={"/admn-sign"}
      handleForgotPassword={handleForgotPassword}
      email={email}
      setEmail={setEmail}
    />
  );
};

export default ForgotAdminPassword;
