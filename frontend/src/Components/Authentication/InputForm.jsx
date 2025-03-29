import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import MiniLoader from "../OtherComponents/Miniloader";

const InputForm = ({
  hanldeLogin,
  onChange,
  credential,
  passLink,
  miniLoader,
  disabled,
  errors,
}) => {
  return (
    <form onSubmit={hanldeLogin} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-gray-300 text-sm">
          Email
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={disabled}
            className={`w-full pl-10 p-3 bg-gray-700/70 border border-solid rounded-lg text-white placeholder:text-gray-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800
      ${
        errors.email ? "border-red-500 animate-border-pulse" : "border-gray-600"
      }
    `}
            placeholder="name@email.com"
            onChange={onChange}
            value={credential.email}
          />
          {errors.email && (
            <p className="absolute left-0 mt-1 text-red-500 text-sm pb-2">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center relative">
          <label htmlFor="password" className="text-gray-300 text-sm">
            Password
          </label>
          <Link
            to={passLink}
            className={`text-blue-400 hover:text-blue-300 text-xs ${
              disabled ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled={disabled}
            className={`w-full pl-10 p-3 bg-gray-700/70 border border-solid rounded-lg text-white placeholder:text-gray-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800
      ${
        errors.password
          ? "border-red-500 animate-border-pulse"
          : "border-gray-600"
      }
    `}
            placeholder="Enter your password"
            onChange={onChange}
            value={credential.password}
          />
          {errors.password && (
            <p className="absolute left-0 mt-1 text-red-500 text-sm mb-3">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-orange-600 focus:ring-orange-500 focus:ring-offset-gray-900"
          onChange={onChange}
          checked={credential.rememberMe}
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-400">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all transform hover:scale-105 focus:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {miniLoader ? (
          <div className="flex items-center justify-center">
            <MiniLoader />
          </div>
        ) : (
          <>
            Sign In
            <FontAwesomeIcon icon={faRightToBracket} className="ml-2" />
          </>
        )}
      </button>
    </form>
  );
};

export default InputForm;
