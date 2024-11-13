import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./menu/Home";
import About from "./menu/About";
// import Header from "./header/header";
import SignIn from "./Authentication/SignIn";
import Signup from "./Authentication/Signup";
import DashboardLayout from "./UserDashboard/DashboardLayout";
import DashboardAbout from "./UserDashboard/DashboardAbout";
import EmailVerification from "./Authentication/EmailVerification";
import PrivateRoute from './Private/PrivateRoute'
import Forgot from "./Authentication/Reset_Password/Forgot";
import VerifyForgotOtp from "./Authentication/Reset_Password/VerifyForgotOtp";
import PrivateRouteResetPass from "./Private/PrivateRouteResetPass";
import ResetPassword from "./Authentication/Reset_Password/ResetPassword";
import Private from "./Private/Private";

const Main = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot_password" element={<Forgot />} />
        <Route path="/veify_forgot_otp" element={<PrivateRouteResetPass><VerifyForgotOtp /></PrivateRouteResetPass>} />
        <Route path="/reset-password" element={<PrivateRouteResetPass><ResetPassword /></PrivateRouteResetPass>} />
        <Route path="/otpverify" element={<Private><EmailVerification /></Private>} />
        <Route path="/db-au-user" element={<PrivateRoute><DashboardLayout /></PrivateRoute>} />
        <Route path="/db-au-user-about" element={<PrivateRoute><DashboardAbout /></PrivateRoute>} />
      </Routes>
  );
};

export default Main;
