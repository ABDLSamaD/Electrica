import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import TopLoadingBar from "./OtherComponents/TopLoadingBar";
import Home from "./menu/Home";
import About from "./menu/About";
import SignIn from "./Authentication/SignIn";
import Signup from "./Authentication/Signup";
import EmailVerification from "./Authentication/EmailVerification";
import PrivateRoute from "./Private/PrivateRoute";
import Forgot from "./Authentication/Reset_Password/Forgot";
import VerifyForgotOtp from "./Authentication/Reset_Password/VerifyForgotOtp";
import PrivateRouteResetPass from "./Private/PrivateRouteResetPass";
import ResetPassword from "./Authentication/Reset_Password/ResetPassword";
import Private from "./Private/Private";
import Errornotfound from "./OtherComponents/Errornotfound";
import DashboardHome from "./UserDashboard/DashboardHome";
import DashboardAbout from "./UserDashboard/DashboardAbout";
import DashboardLayout from "./UserDashboard/DashboardLayout";
import Profile from "./UserDashboard/Profile/Profile";
import Setting from "./UserDashboard/Setting/Setting";

const Main = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <TopLoadingBar isLoading={isLoading} />
      {!isLoading && (
        <CSSTransition key={location.pathname} timeout={500} classNames="fade">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot_password" element={<Forgot />} />
            <Route path="*" element={<Errornotfound />} />
            <Route
              path="/veify_forgot_otp"
              element={
                <PrivateRouteResetPass>
                  <VerifyForgotOtp />
                </PrivateRouteResetPass>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PrivateRouteResetPass>
                  <ResetPassword />
                </PrivateRouteResetPass>
              }
            />
            <Route
              path="/otpverify"
              element={
                <Private>
                  <EmailVerification />
                </Private>
              }
            />

            {/* User dashboard routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/db-au-user" element={<DashboardLayout />}>
                <Route path="dbauhome" element={<DashboardHome />} />
                <Route path="dbauabout" element={<DashboardAbout />} />
                <Route path="db-au-profile" element={<Profile />} />
                <Route path="db-au-setting" element={<Setting />} />
              </Route>
            </Route>
          </Routes>
        </CSSTransition>
      )}
    </>
  );
};

export default Main;
