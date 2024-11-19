import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faCog,
  faPalette,
  faChartLine,
  faBolt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";

const Sidebar = (props) => {
  const { user } = props;

  return (
    <div className="w-32 md:w-64 bg-gray-800 text-white flex flex-col h-screen fixed">
      <Link to="/db-au-user" className="w-auto block">
        <div className="py-4 px-2 md:px-4 font-bold text-centerborder-b border-gray-700">
          <FontAwesomeIcon icon={faBolt} />
          <span className="ml-2 text-cyan-300 text-xl">Electrica</span>
        </div>
      </Link>
      <nav className="flex flex-col mt-5 space-y-2">
        <SidebarLink to="/db-au-user" icon={faHome} label="Dashboard" />
        <SidebarLink to="/db-au-pages" icon={faFileAlt} label="Pages" />
        <SidebarLink
          to="/db-au-user/db-au-profile"
          icon={faUser}
          label="Account"
        />
        <SidebarLink to="/db-au-utilities" icon={faPalette} label="Utilities" />
        <SidebarLink to="/analytics" icon={faChartLine} label="Analytics" />
        <SidebarLink
          to="/db-au-user/db-au-setting"
          icon={faCog}
          label="Settings"
        />
      </nav>
      <div className="version relative -bottom-40 left-2">
        <p>v-3</p>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center md:px-4 md:py-5 px-2 py-3 text-sm hover:bg-gray-700 ${
        isActive ? "bg-cyan-700" : ""
      }`
    }
  >
    <FontAwesomeIcon icon={icon} className="mr-3 text-lg" />
    {label}
  </NavLink>
);

export default Sidebar;
