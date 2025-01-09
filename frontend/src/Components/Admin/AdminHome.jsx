import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

const AdminHome = () => {
  const { admin, users } = useOutletContext();

  const [user, setUser] = useState([]);
  const [loginTime, setLoginTime] = useState([]);
  useEffect(() => {
    users.map((data) => {
      setUser(data);
      setLoginTime(data.loginAttempt);
    });
  }, [users]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <p className="text-lg mb-4 text-gray-300">
        Hello
        <span className="text-cyan-600 font-semibold text-xl ml-1 mr-2 tracking-wider">
          {admin.username}
        </span>
        Welcome to your futuristic admin dashboard. This is where you'll find
        all the important information and controls for your application.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-2 text-purple-400">
            Recent Activity
          </h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>
              User {user.name} logged in
              {/* user login time */}
              <details>
                <summary>{user.name} Login time</summary>
                {loginTime.map((time) => {
                  return (
                    <summary key={time.timestamp}>
                      {new Date(time.timestamp).toLocaleDateString()}
                    </summary>
                  );
                })}
              </details>
            </li>
            {user.project && user.project.length > 0 && (
              <li>
                User projects
                <Link
                  className="text-cyan-700 text-lg ml-2"
                  to={"/db_au_admn/projectusers"}
                >
                  Projects
                </Link>
              </li>
            )}
            <li>Product inventory updated</li>
          </ul>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-2 text-purple-400">
            Quick Stats
          </h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Active Users: 1,234</li>
            <li>Total Orders: 5,678</li>
            <li>Revenue: $98,765</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
