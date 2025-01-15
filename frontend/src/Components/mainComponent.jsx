import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { CSSTransition } from "react-transition-group";
// import TopLoadingBar from "./OtherComponents/TopLoadingBar";
const Home = React.lazy(() => import("./Pages/Home"));
const About = React.lazy(() => import("./Pages/About"));
const SignIn = React.lazy(() => import("./Authentication/SignIn"));
const SignUp = React.lazy(() => import("./Authentication/SignUp"));
import EmailVerification from "./Authentication/EmailVerification";
import PrivateRoute from "./Private/PrivateRoute";
import Forgot from "./Authentication/Reset_Password/Forgot";
import VerifyForgotOtp from "./Authentication/Reset_Password/VerifyForgotOtp";
import PrivateRouteResetPass from "./Private/PrivateRouteResetPass";
import ResetPassword from "./Authentication/Reset_Password/ResetPassword";
import Errornotfound from "./OtherComponents/Errornotfound";
import DashboardHome from "./UserDashboard/DashboardHome";
import DashboardAbout from "./UserDashboard/DashboardAbout";
const DashboardLayout = React.lazy(() =>
  import("./UserDashboard/DashboardLayout")
);
import Profile from "./UserDashboard/Profile/Profile";
import Setting from "./UserDashboard/Setting/Setting";
import AdminLogin from "./Admin/Authentication/AdminLogin";
import ForgotAdminPassword from "./Admin/Authentication/ForgotAdminPassword";
import VerifyADMNOTP from "./Admin/Authentication/VerifyADMNOTP";
import PrivateAdmnRoute from "./Private/PrivateAdmnRoute";
const Admin = React.lazy(() => import("./Admin/Admin"));
import ResetAdminPassword from "./Admin/Authentication/ResetAdminPassword";
import AdminPrivateRoute from "./Private/AdminPrivateroute";
import AddProjectForm from "./UserDashboard/Project/AddProjectForm";
import CheckProjects from "./UserDashboard/Project/CheckProjects";
import ProjectDoc from "./UserDashboard/Project/ProjectDocumentation/ProjectDoc";
const StageManagement = React.lazy(() =>
  import("./UserDashboard/Project/Userprojectreview")
);
import AdminHome from "./Admin/AdminHome";
import UserProfile from "./Admin/User/UserProfile";
import EachProfile from "./Admin/User/EachProfile";
import ProjectReview from "./Admin/User/ProjectReview";
import ProjectsUser from "./Admin/User/ProjectsUser";
const Stepone = React.lazy(() => import("./Admin/Projectsteps/Stepone"));
import AddMaterial from "./Admin/Projectsteps/AddMaterial";
import NotifyClientModal from "./Admin/Projectsteps/NotifyClientModal";
import axios from "axios";
import ProjectDetails from "./Pages/ProjectsDetails";
import AdminPublicRoute from "./Private/AdminPublicRoute";
import UserPublicRoute from "./Private/UserPublicRoute";

const Main = () => {
  // const location = useLocation();
  // const [isLoading, setIsLoading] = useState(false);

  // const dashboardPaths = ["/db-au-user", "/db_au_admn"];
  // const isDashboard = dashboardPaths.some((path) =>
  //   location.pathname.startsWith(path)
  // );

  // Simulate loading state changes
  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [location]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticatedAdmin, setAuthenticatedAdmin] = useState(false);

  // for checking admin auth
  useEffect(() => {
    // check admin auth
    const fecthData = async () => {
      axios
        .get("http://localhost:5120/api/adminauth/check-adminauth", {
          withCredentials: true,
        })
        .then((response) => {
          setAuthenticatedAdmin(response.data.isAuthenticated);
          setIsAdmin(response.data.role === "admin");
        })
        .catch((error) => {
          setIsAdmin(false);
        });
    };
    if (isAuthenticatedAdmin) {
      fecthData();
    }
  }, [isAuthenticatedAdmin]);

  return (
    <>
      {/* {!isDashboard && <TopLoadingBar isLoading={isLoading} />}

      {!isLoading && (
        <CSSTransition key={location.pathname} timeout={3000} classNames="fade"> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home isAuthenticatedAdmin={isAdmin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route
            path="/signin"
            element={
              <UserPublicRoute>
                <SignIn />
              </UserPublicRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          {/* User forgot password */}
          <Route path="/forgot_password" element={<Forgot />} />
          <Route path="*" element={<Errornotfound />} />

          {/* Admin Authentication Routes */}
          <Route
            path="/admn-sign"
            element={
              <AdminPublicRoute>
                <AdminLogin />
              </AdminPublicRoute>
            }
          />
          <Route path="/admn-forgot_pswrd" element={<ForgotAdminPassword />} />
          <Route
            path="/verifyOTPADMIN"
            element={
              <PrivateAdmnRoute>
                <VerifyADMNOTP />
              </PrivateAdmnRoute>
            }
          />
          <Route
            path="/reset_adminPssWord"
            element={
              <PrivateAdmnRoute>
                <ResetAdminPassword />
              </PrivateAdmnRoute>
            }
          />

          {/* User Forgot Password */}
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
          <Route path="/otpverify" element={<EmailVerification />} />

          {/* User Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/db-au-user" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="dbauabout" element={<DashboardAbout />} />
              <Route path="project" element={<ProjectDoc />} />
              <Route path="checkstatus" element={<CheckProjects />} />
              <Route
                path="checkstatus/projectreview-1-9&/:projectId"
                element={<StageManagement />}
              />
              <Route path="project/prjfrom" element={<AddProjectForm />} />
              <Route path="db-au-profile" element={<Profile />} />
              <Route path="db-au-setting" element={<Setting />} />
            </Route>
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/db_au_admn" element={<Admin />}>
              <Route index element={<AdminHome />} />
              <Route path="userprofile" element={<UserProfile />} />
              <Route path="projectusers" element={<ProjectsUser />} />
              <Route
                path="projectusers/stageone/:projectId"
                element={<Stepone />}
              />
              <Route
                path="projectusers/stageone/:projectId/addmaterial/:stageName/notify-client"
                element={<NotifyClientModal />}
              />
              <Route
                path="projectusers/stageone/:projectId/addmaterial/:stageName"
                element={<AddMaterial />}
              />
              <Route
                path="userprofile/:userId/projectreview/:projectId"
                element={<ProjectReview />}
              />
              <Route path="userprofile/:userId" element={<EachProfile />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      {/* </CSSTransition> */}
      {/* )} */}
    </>
  );
};

export default Main;
