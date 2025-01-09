import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const InputForm = ({ hanldeLogin, onChange, credential, passLink }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    // password toogle show hide
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <form
      className="my-3 form_container rounded-xl w-fit h-fit flex flex-col items-center justify-center gap-4"
      onSubmit={hanldeLogin}
    >
      <div className="title_container flex items-center justify-center flex-col gap-3">
        <h1 className="title m-0 text-4xl font-bold text-gray-950">
          Login to your account
        </h1>
        <span
          style={{ maxWidth: "80%" }}
          className="subtitle text-xs text-center text-gray-400 leading-5"
        >
          Get started with our app, just sigin an account and enjoy the
          experience.
        </span>
      </div>
      <div className="relative input_form flex flex-col w-full">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-400 traking-wider"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input_field outline-none mt-1 border border-solid border-blue-200 p-3 rounded-xl"
          placeholder="Enter your email"
          onChange={onChange}
          name="email"
          value={credential.email}
          autoComplete="off"
          required
        />
        <FontAwesomeIcon icon={faEnvelope} id="emailicon" />
      </div>
      <div className="relative input_form flex flex-col w-full">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-400 traking-wider"
        >
          Password
        </label>
        <input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          className="input_field outline-none mt-1 border border-solid border-blue-200 p-3 rounded-xl"
          onChange={onChange}
          name="password"
          value={credential.password}
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
            onChange={onChange}
            type="checkbox"
            name="rememberMe"
            checked={credential.rememberMe} // Sync state with checkbox
          />
          <span className="ml-1 font-bold text-gray-400">Remember Me</span>
        </label>
        <Link
          to={passLink}
          className="text-cyan-600 hover:underline text-sm font-semibold"
        >
          forgot password ?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full rounded-md p-2 focus:scale-105 bg-gray-800 hover:bg-gray-900 transition-all duration-300"
      >
        <span className="text-xl text-white font-mono font-bold mr-2">
          Sign In
        </span>
        <FontAwesomeIcon
          icon={faSignInAlt}
          className="text-gray-600"
          size="1x"
        />
      </button>
    </form>
  );
};

export default InputForm;
