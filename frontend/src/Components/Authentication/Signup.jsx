import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "../OtherComponents/Alert";
import PasswordChecker from "../OtherComponents/PasswordChecker";
import Loader from "../OtherComponents/Loader";
import axios from "axios";

const Signup = (props) => {
  const navigate = useNavigate(); //navigation then wiil true on page to another

  // states start
  const [credentials, setCredenetials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // for password show hide
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  // states end

  // this for password check requriements
  const passwordRules = [
    {
      id: "length",
      test: (pwd) => pwd.length >= 8,
      label: "At least 8 characters",
    },
    {
      id: "uppercase",
      test: (pwd) => /[A-Z]/.test(pwd),
      label: "One uppercase letter",
    },
    { id: "number", test: (pwd) => /\d/.test(pwd), label: "One number" },
  ];
  // Check if all requirements met
  const allRequirementsMet = passwordRules.every((rule) =>
    rule.test(credentials.password)
  );

  const togglePasswordVisibility = () => {
    // password toogle show hide
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setCredenetials({ ...credentials, [name]: value });
  };

  // handle Signup form of user create an account secure
  const signupUser = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password } = credentials;
      setLoading(true);
      // fetch api of signup user form from backend
      const response = await axios.post(
        "http://localhost:5120/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("us-em-temporary", email);
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
        // if submission successfull remove cookie
        setLoading(true);
        setTimeout(() => {
          navigate("/otpverify");
        }, 3000);
      } else {
        setLoading(false);
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message || "Failed to verify OTP");
      setAlert(
        err.response?.data?.type,
        err.response?.data?.message || "Failed to verify OTP"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen z-50 bg-zinc-100 backdrop-blur-xl">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div id="signup">
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <div className="relative w-full h-full flex items-center justify-center flex-col backdrop-blur-xl bg-[rgba(255,255,255,0.01)] transition-all">
          <form
            onSubmit={signupUser}
            className="relative my-3 form_container rounded-xl w-fit h-fit flex flex-col items-center justify-center gap-2"
          >
            <div className="back relative w-full text-2xl text-gray-200">
              <Link to="/signin" title="Go back">
                <FontAwesomeIcon icon={faArrowLeft} size="2xs" />
              </Link>
            </div>
            <div className="title_container flex items-center justify-center flex-col gap-3">
              <p className="title m-0 text-4xl font-bold text-gray-950">
                Create new account
              </p>
              <span
                style={{ maxWidth: "80%" }}
                className="subtitle text-xs text-center text-gray-400 leading-5"
              >
                Please register by filling in your personal data
              </span>
            </div>
            {/* name */}
            <div className="input_form flex flex-col w-full relative">
              <label htmlFor="name" className="text-gray-500 text-sm">
                Name
              </label>
              <input
                type="text"
                className="input_field outline-none mt-1 border border-solid border-blue-900 p-3 rounded-xl"
                id="name"
                required
                onChange={onChange}
                name="name"
              />
              <FontAwesomeIcon icon={faUser} id="emailiconsignup" />
            </div>
            {/* email */}
            <div className="relative input_form flex flex-col w-full">
              <label htmlFor="email" className="text-gray-500 text-sm">
                Email
              </label>
              <input
                type="email"
                className="input_field outline-none mt-1 border border-solid border-blue-900 p-3 rounded-xl"
                id="email"
                required
                placeholder="name@email.com"
                onChange={onChange}
                name="email"
              />
              <FontAwesomeIcon icon={faEnvelope} id="emailiconsignup" />
            </div>
            {/* password */}
            <div className="relative input_form flex flex-col w-full">
              <label htmlFor="password" className="text-gray-500 text-sm">
                Password
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="input_field outline-none mt-1 border border-solid border-blue-900 p-3 rounded-xl"
                id="password"
                required
                onChange={onChange}
                name="password"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <FontAwesomeIcon icon={faLock} id="passwordiconsignup" />
              <div
                onClick={togglePasswordVisibility}
                className="show-pass-s absolute cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                  id={isPasswordVisible ? "hideeye" : "showeye"}
                />
              </div>
              {/* password requirement box */}
              {!allRequirementsMet && isFocused && (
                <PasswordChecker
                  password={credentials.password}
                  passwordRules={passwordRules}
                />
              )}
            </div>
            <label className="flex items-center w-full justify-start p-1">
              <input type="checkbox" placeholder="check" />
              <div className="ml-1 text-xs cursor-pointer">
                I accept the <b className="text-cyan-500">Privacy Policy</b>
              </div>
            </label>
            <button
              type="submit"
              className="w-full rounded-md p-2 bg-gray-800 focus:scale-105"
            >
              <span className="text-gray-300 font-mono font-bold text-lg">
                Signup
              </span>
              <FontAwesomeIcon
                className="ml-2 text-center text-gray-300"
                icon={faUserPlus}
              />
            </button>
            <p className="text-gray-700 text-sm">
              Aleready have an account?
              <Link className="text-cyan-600" to="/signin">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
