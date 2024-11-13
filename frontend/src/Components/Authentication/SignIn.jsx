import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../OtherComponents/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Signin = () => {
  // naviagation
  const navigate = useNavigate();

  // States start
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // for password show hide
  // States end

  const togglePasswordVisibility = () => {
    // password toogle show hide
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = credentials;
      const response = await axios.post(
        "http://localhost:5120/api/auth/signin",
        {
          email,
          password,
          rememberMe,
        },
        { withCredentials: true }
      );
      const data = await response.data;
      if (response.status === 200) {
        localStorage.setItem("dshbrd_usr_tkn", data.token);
        setType(data.type);
        setMessage(data.message);
        setAlert(data.type, data.message);
        setTimeout(() => {
          navigate("/db-au-user");
        }, 4000);
      } else {
        setType(data.type);
        setMessage(data.message);
        setAlert(data.type, data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message || "Failed to verify OTP");
      setAlert(
        err.response?.data?.type,
        err.response?.data?.message || "Failed to verify OTP"
      );
      console.error(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div id="signin">
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <div className="back relative w-full text-3xl transition-all">
        <Link to="/" className="mx-2" title="Go back">
          <FontAwesomeIcon icon={faArrowLeft} size="2xs" />
        </Link>
      </div>
      <div className="container w-90 h-full flex items-center justify-center flex-col bg-[rgb(255,255,255)]">
        <form
          onSubmit={handleSignin}
          className="my-3 form_container rounded-xl w-fit h-fit flex flex-col items-center justify-center gap-4"
        >
          <div className="title_container flex items-center justify-center flex-col gap-3">
            <p className="title m-0 text-4xl font-bold text-neutral-800">
              Login to your account
            </p>
            <span
              style={{ maxWidth: "80%" }}
              className="subtitle text-xs text-center text-gray-400 leading-5"
            >
              Get started with our app, just sigin an account and enjoy the
              experience.
            </span>
          </div>
          <div className="relative input_form flex flex-col w-full">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={onChange}
              name="email"
              value={credentials.email}
              className="input_field outline-none mt-1 border border-solid border-blue-900 p-3 rounded-xl"
              id="email"
              placeholder="name@email.com"
              autoComplete="off"
              required
            />
            <FontAwesomeIcon icon={faEnvelope} id="emailicon" />
          </div>
          <div className="relative input_form flex flex-col w-full">
            <label htmlFor="password">Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              onChange={onChange}
              name="password"
              value={credentials.password}
              className="input_field outline-none mt-1 border border-solid border-blue-900 p-3 rounded-xl"
              id="password"
              autoComplete="off"
              required
            />
            <FontAwesomeIcon icon={faLock} id="passwordicon" />
            <div
              onClick={togglePasswordVisibility}
              className="show-pass absolute cursor-pointer"
            >
              <FontAwesomeIcon
                icon={isPasswordVisible ? faEyeSlash : faEye}
                id={isPasswordVisible ? "hideeye" : "showeye"}
              />
            </div>
          </div>
          <div className="forgot-password w-full flex justify-between">
            <label className="flex items-center w-auto p-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="ml-1 font-bold">Remember Me</span>
            </label>
            <Link
              to="/forgot_password"
              className="text-cyan-600 hover:text-cyan-900 text-sm font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="w-full rounded-md p-2 focus:scale-105 bg-gray-800">
            <span className="text-xl text-white font-mono font-bold">Sign In</span> <FontAwesomeIcon icon={faSignInAlt} className="text-gray-600" size="1x" />
          </button>
          <div className="option flex items-center w-full justify-center">
            <p>Don't have an account?</p>
            <Link to="/signup" className="text-cyan-600 text-sm ml-1 hover:text-cyan-400">
              SignUp
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
