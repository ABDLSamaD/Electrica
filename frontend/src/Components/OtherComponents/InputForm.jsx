import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginLoader from "./LoginLoader";
import { Mail, Eye, EyeOff, Lock, LogIn } from "lucide-react";

const InputForm = ({
  hanldeLogin,
  onChange,
  credential,
  passLink,
  miniLoader,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    // password toogle show hide
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={hanldeLogin}>
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-300">
          Login to your account
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto mt-2">
          Get started with our app, just sign in to your account and enjoy the
          experience.
        </p>
      </div>
      <div className="relative mt-3 w-full">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input_field outline-none mt-1 border border-solid border-blue-200 p-3 rounded-xl w-full pl-8"
          placeholder="Enter your email"
          onChange={onChange}
          name="email"
          value={credential.email}
          autoComplete="off"
          required
          disabled={miniLoader}
        />
        <Mail className="absolute left-3 top-10 text-gray-950 w-5 h-5" />
      </div>
      <div className="relative w-full mt-3">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 traking-wider"
        >
          Password
        </label>
        <input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          className="input_field outline-none mt-1 border border-solid border-blue-200 p-3 rounded-xl w-full pl-8"
          onChange={onChange}
          name="password"
          value={credential.password}
          autoComplete="off"
          required
          disabled={miniLoader}
        />
        <Lock className="absolute left-3 top-10 text-gray-950 w-5 h-5" />
        <div
          onClick={togglePasswordVisibility}
          className="show-pass absolute cursor-pointer"
        >
          {isPasswordVisible ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center w-full text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            onChange={onChange}
            checked={credential.rememberMe}
            disabled={miniLoader}
          />
          <span
            className={`ml-2 text-gray-500 ${
              miniLoader ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Remember Me
          </span>
        </label>
        <Link
          to={passLink}
          className={`text-cyan-600 hover:underline font-semibold ${
            miniLoader ? "pointer-events-none opacity-60" : ""
          }`}
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        className={`w-full p-3 tracking-wider flex items-center justify-center gap-2 rounded-md text-white font-bold transition-all duration-300 ${
          miniLoader
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gray-950 hover:bg-gray-800"
        }`}
        disabled={miniLoader}
      >
        {miniLoader ? <LoginLoader /> : "Sign In"}
        {!miniLoader && <LogIn className="w-5 h-5" />}
      </button>
    </form>
  );
};

export default InputForm;
