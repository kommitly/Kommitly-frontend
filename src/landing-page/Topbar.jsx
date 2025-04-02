import React from "react";
import { Link } from "react-router-dom";
import Signup from "./Signup";

const Topbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-[#4F378A]">
        Kommitly
      </Link>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="text-[#6F2DA8] px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Topbar;
