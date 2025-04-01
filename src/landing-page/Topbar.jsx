import React from "react";
import { Link } from "react-router-dom";
import Signup from "./Signup";

const Topbar = () => {
  return (
    <nav className=" shadow-md w-10/12 bg-[#1E1A2A] rounded-md mt-2 shadow-[#4F378A] px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-[#4F378A]">
        Kommitly
      </Link>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        <Link
          to="/registration?tab=login" // Pass query parameter for Login
          className="text-[#6F2DA8] px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/registration?tab=signup" // Pass query parameter for Sign Up
          className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Topbar;
