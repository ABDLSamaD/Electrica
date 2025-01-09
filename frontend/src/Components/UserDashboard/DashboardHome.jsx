import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoaderAll from "../OtherComponents/LoaderAll";

const DashboardHome = () => {
  const navigate = useNavigate();

  const { user, userProject } = useOutletContext();
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(false);

  useEffect(() => {
    setPage(false);
    if (!userProject || userProject.length === 0) {
      setPage(false);
    } else {
      setPage(true);
    }
    if (!user) {
      setLoader(false);
      setData(null);
      setPage(false);
      setError("User data fetching soon...");
      return;
    }

    setLoader(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        setData(user);
        setLoader(false);
      } catch (err) {
        setError("Failed to load user data.");
        setLoader(false);
      }
    }, 4300);

    return () => clearTimeout(timer);
  }, [user, userProject]);

  return (
    <div className="relative top-10 p-3 text-gray-200">
      {loader ? (
        <LoaderAll />
      ) : error ? (
        <div className="text-red-300 text-xs">{error}</div>
      ) : (
        <h1 className="text-2xl font-bold">Welcome, {data?.name || "User"}!</h1>
      )}
      <div className="mt-2 space-y-2">
        <p>
          This is your dashboard. Use the navigation links on the sidebar to
          explore the app.
        </p>

        {page === true ? (
          <div className="flex gap-2 items-center">
            <p>Check your status of project</p>
            <button className="buttons" onClick={() => navigate("checkstatus")}>
              <p>Check status</p>
            </button>
          </div>
        ) : (
          <>
            <p>Create an project</p>
            <button
              className="buttons"
              onClick={() => navigate("/db-au-user/project")}
            >
              <p>Project</p>
            </button>
          </>
        )}
      </div>

      {/* Electrica Details Section */}
      <div className="mt-6 p-4">
        <h2 className="text-xl font-semibold">About Electrica</h2>
        <p className="mt-2">
          Electrica is your comprehensive solution for managing and monitoring
          projects efficiently. From initiation to completion, Electrica ensures
          every step of your project is streamlined for success. Our platform
          offers:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>Real-time project tracking and updates.</li>
          <li>Seamless collaboration with team members.</li>
          <li>Comprehensive analytics and insights.</li>
          <li>Customizable workflows to suit your needs.</li>
        </ul>
        <p className="mt-3">
          Discover the power of Electrica by starting your first project today!
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
