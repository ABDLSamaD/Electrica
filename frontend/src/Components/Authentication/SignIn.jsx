import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../OtherComponents/Alert";
import axios from "axios";
import InputForm from "./InputForm";
import { UAParser } from "ua-parser-js";
import LoaderAll from "../OtherComponents/LoaderAll";
import Cookies from "js-cookie";
import LoginOtpVerification from "./LoginOtpVerification";
import { FaArrowLeft } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  // States
  const [alert, setAlert] = useState(null);
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
          setAlert({ type: "success", message: response.data.message });
          Cookies.set("ez-em-01e", JSON.stringify(email), { expires: 1 / 144 });
        } else {
          setMiniLoader(false);
          setLoginSuccess(true);
          setAlert({
            type: response.data.type,
            message: response.data.message,
          });

          setTimeout(() => {
            navigate("/db-au-user");
            setLoading(false);
            setLoginSuccess(false);
          }, 1500);
        }
      } else {
        setLoading(false);
        setMiniLoader(false);
        setAlert({ type: response.data.type, message: response.data.message });
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

          setAlert({
            type: "error",
            message: message || "Invalid credentials",
          });
        } else {
          setAlert({
            type: "error",
            message: err.response.data?.message || "An error occurred",
          });
        }
      } else {
        setAlert({
          type: "error",
          message: "Network Error",
        });
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
        setAlert({ type: response.data.type, message: response.data.message });
        Cookies.remove("ez-em-01e");
        setTimeout(() => {
          navigate("/db-au-user");
          setLoading(false);
        }, 800);
      } else {
        setLoading(false);
        setMiniLoader(false);
        setAlert({
          type: response.data.type,
          message: response.data.message,
        });
      }
    } catch (err) {
      setLoading(false);
      setMiniLoader(false);
      setAlert({
        type: err.response?.data?.type || "error",
        message: err.response?.data?.message || "Network Error",
      });
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

      {/* Alert notification */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
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
