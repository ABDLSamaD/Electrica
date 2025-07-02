import React, { useEffect, useState } from "react";
import Sidebar from "./Headers/Sidebars";
import { Outlet } from "react-router-dom";
import axios from "axios";
import DecryptData from "../UserDashboard/Setting/DecryptData";

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
      if (response.status === 200 && response.data.encryptedData) {
        const decryptedUser = DecryptData(response.data.encryptedData);
        setTimeout(() => {
          setAdmin(decryptedUser);
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
      if (response.status === 200 && response.data.encryptedData) {
        const decryptedUser = DecryptData(response.data.encryptedData);
        setTimeout(() => {
          setUsers(decryptedUser);
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
      if (response.status === 200 && response.data.encryptedData) {
        const decryptedUser = DecryptData(response.data.encryptedData);
        setTimeout(() => {
          setProjects(decryptedUser);
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
    <div className="flex flex-col min-h-screen text-white">
      {/* Top Bar */}
      <Sidebar connection={electricaURL} admin={admin} />

      {/* Main Content */}
      <main className="flex-1 p-1 lg:p-2 mt-8">
        {" "}
        {/* mt-16 to account for the height of the TopBar */}
        <div className="max-w-full mx-auto">
          <div className="md:p-5 p-2">
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
