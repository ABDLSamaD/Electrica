import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "./InputForm";
import { UAParser } from "ua-parser-js";
import LoaderAll from "../OtherComponents/LoaderAll";
import Cookies from "js-cookie";
import LoginOtpVerification from "./LoginOtpVerification";
import { FaArrowLeft } from "react-icons/fa";
import { useAlert } from "../OtherComponents/AlertProvider";

const SignIn = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const { success, error, warning } = useAlert();

  // States
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [passwords, setPasswords] = useState("");
  const [miniLoader, setMiniLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false); // Show OTP field if needed
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (errors.email || errors.password) {
      const timer = setTimeout(() => {
        setErrors({ email: "", password: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleSignin = async (e) => {
    e.preventDefault();
    setMiniLoader(true);
    setLoading(true);
    setErrors({ email: "", password: "" });

    const { email, password, rememberMe } = credentials;

    try {
      // Step 1: Get IP address
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipResponse.data.ip;

      // Step 2: Get device details using UAParser
      const parser = new UAParser();
      const userAgent = navigator.userAgent;
      const deviceInfo = parser.setUA(userAgent).getResult();

      // Step 3: Hit API
      const response = await axios.post(
        `${electricaURL}/api/auth/signin`,
        { email, password, rememberMe, ipAddress, deviceInfo },
        { withCredentials: true }
      );

      if (response.status === 200) {
        if (response.data.type === "otp_required") {
          setPasswords(password);
          setOtpRequired(true);
          setLoading(false);
          setMiniLoader(false);
          success(response.data.message);
          Cookies.set("ez-em-01e", JSON.stringify(email), { expires: 1 / 144 });
        } else {
          setMiniLoader(false);
          setLoginSuccess(true);
          warning(response.data.message);

          setTimeout(() => {
            navigate("/db-au-user");
            setLoading(false);
            setLoginSuccess(false);
          }, 1500);
        }
      } else {
        setLoading(false);
        setMiniLoader(false);
        error(response.data.message);
      }
    } catch (err) {
      setLoading(false);
      setMiniLoader(false);
      if (err.response) {
        const { message, field } = err.response.data;
        if (err.response.status === 400 || err.response.status === 404) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: message,
          }));

          error(message);
        } else {
          error(
            err.response?.data?.message ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        error("Network Error. Please check your connection.");
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMiniLoader(true);
    setLoading(true);
    const password = passwords;
    const otpString = otp.join("");

    const email = Cookies.get("ez-em-01e");
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/signin`,
        { email: JSON.parse(email), password: password, otp: otpString },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMiniLoader(false);
        setLoginSuccess(true);
        success(response.data.message);
        Cookies.remove("ez-em-01e");
        setTimeout(() => {
          navigate("/db-au-user");
          setLoading(false);
        }, 800);
      } else {
        setLoading(false);
        setMiniLoader(false);
        warning(response.data.message);
      }
    } catch (err) {
      setLoading(false);
      setMiniLoader(false);
      error(err.response?.data?.message);
    }
  };

  return (
    <div
      id="signin"
      className="flex items-center justify-center relative overflow-hidden p-4 sm:p-8 z-50"
    >
      {/* Show loader when login is successful */}
      {loginSuccess && (
        <div className="fixed inset-0 flex items-start pt-[20%] justify-center z-50 backdrop-blur-md">
          <LoaderAll />
        </div>
      )}

      {!otpRequired ? (
        <div
          className={`w-full max-w-md relative bg-gray-900/80 border border-solid border-gray-300/20 text-white shadow-2xl rounded-xl p-8 backdrop-blur-md ${
            loginSuccess ? "opacity-50 pointer-events-none filter blur-sm" : ""
          }`}
        >
          <div className="mb-6">
            <Link
              to="/"
              className="inline-block text-blue-400 hover:text-blue-300 transition-colors"
              title="Go back"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-400" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to access your Electrica dashboard
            </p>
          </div>

          <InputForm
            hanldeLogin={handleSignin}
            onChange={onChange}
            credential={credentials}
            passLink={"/forgot_password"}
            miniLoader={miniLoader}
            disabled={loading || loginSuccess}
            errors={errors}
          />

          <div className="mt-6 h-auto bg-gray-700/40 p-4 rounded-lg text-sm">
            <p className="text-center text-gray-300">
              Not a member?{" "}
              <Link
                to="/signup"
                className={`text-blue-400 hover:text-blue-300 font-medium hover:underline ${
                  loading || loginSuccess
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <LoginOtpVerification
          handleOtpSubmit={handleOtpSubmit}
          setOtp={setOtp}
          otp={otp}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SignIn;

// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "backend/index.js",
//       "use": "@vercel/node"
//     },
//     {
//       "src": "frontend/dist/**",
//       "use": "@vercel/static"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/api/(.*)",
//       "dest": "backend/index.js"
//     },
//     {
//       "handle": "filesystem"
//     },
//     {
//       "src": "/assets/(.*)",
//       "headers": { "Cache-Control": "public, max-age=31536000, immutable" },
//       "dest": "/frontend/dist/assets/$1"
//     },
//     {
//       "src": "/(.*\\.css)",
//       "headers": { "Content-Type": "text/css" },
//       "dest": "/frontend/dist/$1"
//     },
//     {
//       "src": "/(.*\\.js)",
//       "headers": { "Content-Type": "application/javascript" },
//       "dest": "/frontend/dist/$1"
//     },
//     {
//       "src": "/(.*)",
//       "dest": "/frontend/dist/index.html",
//       "status": 200
//     }
//   ]
// }
