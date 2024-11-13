import React from "react";

const PasswordChecker = ({ password, passwordRules }) => {
  

  // absolute top-80 left-40 tailwindcss class 
  return (
    <div className="password-length w-auto h-auto p-3 transition-opacity duration-300 ease-in-out opacity-100">
      <h3 className="text-lg font-semibold">Password must have:</h3>
      <ul>
        {passwordRules.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center mt-2 ${
              rule.test(password) ? "text-green-600" : "text-red-500"
            }`}
          >
            <span
              className={`mr-2 w-4 h-4 rounded-full ${
                rule.test(password) ? "bg-green-600" : "bg-red-500"
              }`}
            ></span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordChecker;
