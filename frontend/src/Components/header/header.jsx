import React from "react";
import { Link } from "react-router-dom";

const header = () => {
  const toogleNav = (e) => {
    document.querySelector(".navbar").classList.toggle("shownavbar");
  };

  return (
    <header className="relative top-4 shadow-sm bg-[rgba(255,255,255,0.1)] backdrop-blur-xl w-full rounded-lg h-auto p-2">
      <div className="flex items-center justify-between font-sans">
        <div className="logo">
          <h2 className="text-cyan-800 text-3xl cursor-pointer hover:text-cyan-600 transition-all">
            <Link to="/">
              Electrica
              <span className="text-xs text-cyan-950 relative top-2 -left-4">
                web
              </span>
            </Link>
          </h2>
        </div>
        <nav className="navbar hidden md:block">
          <ul className="list md:inline-flex md:flex-row flex flex-col gap-12 text-cyan-950 uppercase">
            <li>
              <Link
                to="/"
                className="p-3 md:p-0 md:text-lg text-2xl mx-2 font-medium tracking-wide hover:text-indigo-800"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-2xl mx-2 font-medium tracking-wide hover:text-indigo-800"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-2xl mx-2 font-medium tracking-wide hover:text-indigo-800"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/service"
                className="p-3 md:p-0 md:bg-inherit md:text-lg text-2xl  mx-2 font-medium tracking-wide hover:text-indigo-800"
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
        <div className="buttons">
          <button className="button-login"><Link to="/signin">Sign In</Link></button>
        </div>
      </div>
    </header>
  );
};

export default header;
