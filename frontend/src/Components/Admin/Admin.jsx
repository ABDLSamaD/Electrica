import React, { useEffect, useState } from "react";
import Sidebar from "./Headers/Sidebars";
import { Outlet } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const [admin, setAdmin] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  // fetch admin data
  const fetchAdmin = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/adminAuth/get_admin`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setTimeout(() => {
          setAdmin(response.data);
        }, 1080);
      } else {
        setAdmin("");
      }
    } catch (error) {
      setAdmin("");
      setMessage(error.response?.data?.message);
    }
  };

  // fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/adminAuth/get_all_users`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTimeout(() => {
          setUsers(response.data);
        }, 1001);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
      setMessage(error.response?.data?.message);
    }
  };
  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/adminauth/project-details`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTimeout(() => {
          setProjects(response.data);
        }, 1001);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
      setMessage(error.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchAdmin();
    fetchUsers();
    fetchProject();
  }, []);
  // console.log(users);
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Sidebar connection={electricaURL} admin={admin} />
      <main className="flex-1 p-1 lg:p-2 ml-[67px] lg:ml-[60px] overflow-y-auto">
        <div className="max-w-full mx-auto">
          <div className="backdrop-blur-md bg-white/10 shadow-lg min-h-screen md:p-5 p-2">
            {message && <p>{message}</p>}
            <Outlet
              context={{
                admin,
                users,
                projects,
                fetchUsers,
                fetchProject,
                electricaURL,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
