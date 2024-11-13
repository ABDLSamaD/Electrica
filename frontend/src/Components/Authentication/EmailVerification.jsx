import React, { useState } from "react";
import Alert from "../OtherComponents/Alert";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const EmailVerification = () => {
  // navigate
  const navigate = useNavigate();

  // states start
  // const [otps, setOtps] = useState({otp: ""});
  const [otp, setOtp] = useState("");
  
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  // states end

  // otp verification form function
  const handleOtpForm = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("tkn-at-udb");

    // headers set for user to verify with token
    const myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    try {
      const response = await axios.post(
        "http://localhost:5120/api/auth/verify-otp",
        {
          otp
        },
        {headers: {
          Authorization: `Bearer ${authToken}`}
        }
      );
      const data = await response.data;
      if (response.status === 200) {
        localStorage.removeItem("us-em-temporary")
        let type = "success";
        let message = data.message;
        setType(type);
        setMessage(message);
        setAlert(type, message);
        setTimeout(() => {
          navigate("/db-au-user");
        }, 3000);
      } else {
        let type = "error";
        let message = data.message;
        setType(type);
        setMessage(message);
        setAlert(type, message);
        console.log(data.message);
      }
    } catch (err) {
      console.error(err);
      const type = "error";
      const message = err.response.data.message;
      setType(type);
      setMessage(message);
      setAlert(type, message);
    }
  };

  // resend otp
  const resendOtp = async (e)=>{
    e.preventDefault()
    try {
      const authEmail = localStorage.getItem("us-em-temporary");
      const response = await axios.post("http://localhost:5120/api/auth/resend-otp",
        {
          email: authEmail
        }
      )
      const data = await response.data
      if(response.status === 200){
        localStorage.removeItem("us-em-temporary");
        let type = "success";
        let message = data.message;
        setType(type);
        setMessage(message);
        setAlert(type, message);
      }else{
        let type = "error";
        let message = data.message;
        setType(type);
        setMessage(message);
        setAlert(type, message);
      }
      
    } catch (err) {
      console.log(err);
      const type = "error";
      const message = err.response.data.message;
      setType(type);
      setMessage(message);
      setAlert(type, message);
    }
  }

  return (
    <div id="emailverify">
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <div className="container flex items-center justify-center flex-col gap-5">
        <div className="row w-96 h-72 flex items-center justify-center flex-col gap-10">
          <div className="text text-center">
            <h1 className="text-4xl mb-3 text-gray-400">OTP VERIFICATION</h1>
            <p className="text-gray-400">Enter the OTP we just sent to you.</p>
          </div>
          <form className="relative" onSubmit={handleOtpForm}>
            <input
              type="text"
              required
              placeholder="otp@otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp_input"
              autoComplete="off"
            />
            <button type="submit" className="sign-in_btn focus:scale-105 mt-4">
              Confirm
            </button>
            <div className="resend">
              <button className="underline text-gray-500 mt-2 text-sm" onClick={resendOtp}>Resend Otp</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
