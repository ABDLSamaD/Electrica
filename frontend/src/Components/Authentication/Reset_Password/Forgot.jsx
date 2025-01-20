import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../OtherComponents/ForgotPassword";

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/forgot-password`,
        { email }
      );
      if (response.status === 200) {
        setAlert({ type: response.data.type, message: response.data.message });
        localStorage.setItem("reset_token_forgot", response.data.resetToken);
        localStorage.setItem("email-forgot", email);
        setTimeout(() => {
          navigate("/veify_forgot_otp");
        }, 1200);
      } else {
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setAlert({
        type: err.response?.data?.type,
        message: err.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPassword
      alert={alert}
      setAlert={setAlert}
      handleForgotPassword={handleForgotPassword}
      email={email}
      setEmail={setEmail}
      linkprevious="/signin"
      loading={loading}
    />
  );
};

export default Forgot;
