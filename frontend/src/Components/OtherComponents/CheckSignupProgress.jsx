import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CheckSignupProgress = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signupEmail = Cookies.get("signup_email");
    if (signupEmail) {
      navigate("/otpverify"); // Redirect to OTP verification page
    }
  }, []);

  return null; // This component does not render anything
};

export default CheckSignupProgress;
