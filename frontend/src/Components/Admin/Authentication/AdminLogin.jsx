import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "../../OtherComponents/InputForm";
import { FaArrowLeft } from "react-icons/fa";
import { useAlert } from "../../OtherComponents/AlertProvider";

const AdminLogin = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const { success, error, warning } = useAlert();
  //   State Start
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [miniLoader, setMiniLoader] = useState(false);
  //   State End

  //   onchange event on input value
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //   handle Login Admin
  const hanldeLogin = async (e) => {
    e.preventDefault();
    setMiniLoader(true);
    try {
      const { email, password } = credentials;
      const response = await axios.post(
        `${electricaURL}/api/adminauth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMiniLoader(false);
        localStorage.setItem("dshbrd_admn_tkn", response.data.token);
        success(response.data.message);
        setTimeout(() => {
          navigate("/db_au_admn");
        }, 1800);
      } else {
        setMiniLoader(false);
        warning(response.data.message);
      }
    } catch (err) {
      setMiniLoader(false);
      error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div
        id="signin"
        className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8"
      >
        <div className="w-max form_container rounded-xl p-6 sm:p-8 bg-gray-900/80 shadow">
          <div className="back relative w-full text-3xl transition-all">
            <Link to="/" className="mx-2" title="Go back">
              <FaArrowLeft className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
          <InputForm
            hanldeLogin={hanldeLogin}
            onChange={onChange}
            credential={credentials}
            passLink={"/admn-forgot_pswrd"}
            miniLoader={miniLoader}
          />
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
