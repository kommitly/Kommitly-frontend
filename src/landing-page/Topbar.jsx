import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "./Signup";
import { Menu, X } from "lucide-react"; // or use any icons you prefer
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme"; // Ensure the path is correct

const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <nav className="w-full sm:w-full rounded-md mt-2 shadow-[#4F378A] px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-3xl fredoka-semibold font-bold text-[#4F378A]">
        Kommitly
      </Link>

      {/* Desktop Auth Buttons */}
      <div className="hidden sm:flex gap-4">
        <Link
          to="/registration?tab=login"
          className="text-[#6F2DA8] px-4 py-2 rounded-lg hover:bg-gray-100 transition 2xl:text-xl xl:text-base lg:text-base"
        >
          Login
        </Link>
        <Link
          to="/registration?tab=signup"
          className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition 2xl:text-xl xl:text-base lg:text-base"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        className="sm:hidden text-[#4F378A]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-6  shadow-lg rounded-lg p-4 flex flex-col gap-4 sm:hidden z-50" style={{ backgroundColor: colors.background.paper }}>
          <Link
            to="/registration?tab=login"
            className="text-[#6F2DA8] px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/registration?tab=signup"
            className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Topbar;
