import React, { useContext } from "react";
import { motion } from "framer-motion";
import login from "../assets/login.gif";
import { FaGoogle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Login = () => {
  const { userGoogleLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleSign = (e) => {
    e.preventDefault();
    userGoogleLogin()
      .then((result) => {
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        // console.log("Goo: ", err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#19377B] to-[#3A104C]">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center mx-4 bg-white rounded-lg p-6 shadow-lg max-w-4xl"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center w-full md:w-1/2">
          <img src={login} alt="login-image" />
        </div>

        <motion.div
          className="md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:mt-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Task Management Application
            </h1>
            <p className="text-sm text-gray-600 py-3">
              Streamline Your Workflow with Efficient Task Organization and
              Collaboration
            </p>
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSign}
              className="w-full cursor-pointer flex items-center justify-center mt-2 md:mt-16 py-3 bg-[#FF4500] text-white rounded-md hover:bg-[#FF633C] focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaGoogle className="mr-2 text-lg" />
              Sign in with Google
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
