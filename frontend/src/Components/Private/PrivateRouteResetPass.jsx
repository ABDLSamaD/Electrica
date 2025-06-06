import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteResetPass = ({ children }) => {
  const auth = localStorage.getItem("reset_token_forgot");

  return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRouteResetPass;
