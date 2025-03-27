import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VerificationReminder from "./VerificationReminder";

const CheckSignupProgress = () => {
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const signupEmail = Cookies.get("signup_email");
    if (signupEmail) {
      setEmail(signupEmail);
      setShowReminder(true);
    }
  }, []);

  const handleClose = () => {
    setShowReminder(false);
  };

  return (
    <>
      {showReminder && (
        <VerificationReminder email={email} onClose={handleClose} />
      )}
    </>
  );
};

export default CheckSignupProgress;
