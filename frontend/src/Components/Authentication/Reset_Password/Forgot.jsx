import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../../OtherComponents/ForgotPassword";
import { useAlert } from "../../OtherComponents/AlertProvider";

const Forgot = () => {
  const navigate = useNavigate();
  const { success, error, warning } = useAlert();

  const [email, setEmail] = useState("");
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
        success(response.data.message);
        localStorage.setItem("reset_token_forgot", response.data.resetToken);
        localStorage.setItem("email-forgot", email);
        setTimeout(() => {
          navigate("/veify_forgot_otp");
        }, 1200);
      } else {
        warning(response.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPassword
      handleForgotPassword={handleForgotPassword}
      email={email}
      setEmail={setEmail}
      linkprevious="/signin"
      loading={loading}
    />
  );
};

export default Forgot;
