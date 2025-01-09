import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import InputForm from "../../OtherComponents/InputForm";
import Loader from "../../OtherComponents/Loader";

const AdminLogin = () => {
  const navigate = useNavigate();
  //   State Start
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  //   State End

  //   onchange event on input value
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //   handle Login Admin
  const hanldeLogin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = credentials;
      const response = await axios.post(
        "http://localhost:5120/api/adminauth/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setLoader(true);
        localStorage.setItem("dshbrd_admn_tkn", response.data.token);
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
        setTimeout(() => {
          navigate("/db_au_admn");
        }, 5000);
      } else {
        setType(response.data.type);
        setMessage(response.data.message);
        setAlert(response.data.type, response.data.message);
      }
    } catch (err) {
      setType(err.response?.data?.type);
      setMessage(err.response?.data?.message);
      setAlert(err.response?.data?.type, err.response?.data?.message);
    } finally {
      setLoader(false);
    }
  };
  if (alert) {
    return (
      <Alert type={type} message={message} onClose={() => setAlert(null)} />
    );
  }

  return (
    <>
      {loader === true ? <Loader /> : null}
      <div id="adminsignin">
        <div className="back relative w-full text-3xl transition-all">
          <Link to="/" className="mx-2" title="Go back">
            <FontAwesomeIcon icon={faArrowLeft} size="2xs" />
          </Link>
        </div>
        <div className="w-90 h-full flex items-center justify-center flex-col">
          <InputForm
            hanldeLogin={hanldeLogin}
            onChange={onChange}
            credential={credentials}
            passLink={"/admn-forgot_pswrd"}
          />
          <p className="mt-4 text-center text-sm text-gray-600">
            Not a member?
            <Link to="#signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
