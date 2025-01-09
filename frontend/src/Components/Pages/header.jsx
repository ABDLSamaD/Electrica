import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const header = ({ isAuthenticatedAdmin }) => {
  // const auth = localStorage.getItem("dshbrd_usr_tkn");
  const toogleNav = (e) => {
    document.querySelector(".navbar").classList.toggle("shownavbar");
  };
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);

  // for checking user auth
  useEffect(() => {
    axios
      .get("http://localhost:5120/api/auth/check-auth", {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticatedUser(response.data.role === "user");
      })
      .catch((error) => {
        setIsAuthenticatedUser(false);
      });
  }, []);

  return (
    <header className="fixed top-8 left-0 right-0 z-50 shadow-sm w-full h-auto">
      <div
        style={{ background: "hsl(242deg 88.4% 66.3% / 12%)" }}
        className="container p-2 flex items-center justify-around font-sans rounded-xl backdrop-blur-lg"
      >
        <div className="logo">
          <h2 className="text-gray-200 text-2xl hover:text-gray-600 transition-all">
            <Link to="/">
              Electrica
              <span className="text-xs text-cyan-950 relative top-2 -left-4">
                web
              </span>
            </Link>
          </h2>
        </div>
        <nav className="navbar hidden md:block">
          <ul className="list md:inline-flex md:flex-row flex flex-col gap-12 text-gray-200">
            <li>
              <Link
                to="/"
                className="p-3 md:p-0 md:text-lg text-xl mx-2 font-medium tracking-wider hover:text-indigo-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-xl mx-2 font-medium tracking-wider hover:text-indigo-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-xl mx-2 font-medium tracking-wider hover:text-indigo-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/service"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-xl mx-2 font-medium tracking-wider hover:text-indigo-300"
              >
                Services
              </Link>
            </li>
          </ul>
        </nav>
        <div
          onClick={toogleNav}
          className="buttons-toggle md:hidden w-10 md:w-8 md:h-10 h-8 cursor-pointer flex items-center flex-col"
        >
          <span className="bg-yellow-950 w-12 h-2 my-1"></span>
          <span className="bg-yellow-950 w-12 h-2 my-1"></span>
          <span className="bg-yellow-950 w-12 h-2 my-1"></span>
        </div>
        {isAuthenticatedAdmin ? (
          <button className="button-86">
            <Link to="/db_au_admn">Admin Dashboard</Link>
          </button>
        ) : isAuthenticatedUser ? (
          <button className="button-86">
            <Link to="/db-au-user">Dashboard</Link>
          </button>
        ) : (
          <button className="button-86">
            <Link to="/signin">Sign In</Link>
          </button>
        )}
      </div>
    </header>
  );
};

export default header;
