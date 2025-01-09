import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdmnRoute = ({ children }) => {
  const adminAuth = localStorage.getItem("admn_resttokn");
  return adminAuth ? children : <Navigate to="/admn-sign" />;
};
export default PrivateAdmnRoute;
