// Topbar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme"; 

// Accept clipRadius as a prop
const Topbar = ({ clipRadius }) => { 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 1. Logic for Text/Logo Color Synchronization (uses clipRadius from Hero2)
  const startTransitionRadius = 200;
  const endTransitionRadius = 500;
  
  const textTransitionFactor = Math.min(
      1,
      Math.max(
          0,
          (clipRadius - startTransitionRadius) / (endTransitionRadius - startTransitionRadius)
      )
  );

  // 2. Logic for Topbar Background Opacity (uses scrollY)
  // We want the background to be transparent until the user scrolls past, say, 500px.
  const bgTransitionStartScroll = 100; // Start transitioning the background after 400px of scroll
  const bgTransitionEndScroll = 550;   // Fully opaque by 550px of scroll
  
  const bgOpacityFactor = Math.min(
      1,
      Math.max(
          0,
          (scrollY - bgTransitionStartScroll) / (bgTransitionEndScroll - bgTransitionStartScroll)
      )
  );
  
  // Calculate Colors
  const finalBg = 'rgba(255, 255, 255, 0.95)'; 
  const currentBgColor = `rgba(255, 255, 255, ${0.95 * bgOpacityFactor})`; // Fades from transparent (0) to 0.95 opacity

  const initialLogoColor = '#FFFFFF'; 
  const finalLogoColor = '#4F378A'; 

  // Helper function remains the same...
  const interpolateColor = (color1, color2, factor) => {
    const hexToRgb = hex => [
      parseInt(hex.substring(1, 3), 16),
      parseInt(hex.substring(3, 5), 16),
      parseInt(hex.substring(5, 7), 16)
    ];
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * factor);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * factor);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Determine the final colors for Topbar elements
  // Use the 'textTransitionFactor' for text and logo color
  const currentLogoColor = interpolateColor(initialLogoColor, finalLogoColor, textTransitionFactor);
  const currentLinkColor = currentLogoColor;
  const isDarkBackground = textTransitionFactor < 0.5; // Determine if the content below is still mostly dark


  return (
    // Make the Topbar fixed and wider to cover the dark background fully
    <nav 
      className="fixed top-0 left-0 right-0 w-full z-[100] px-6 py-3 flex items-center justify-between transition-all duration-300 ease-linear"
      style={{ 
        backgroundColor: currentBgColor, 
        // Add shadow only when the background is light
        boxShadow: isDarkBackground ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      
      {/* Logo */}
      <Link 
        to="/" 
        className="md:text-3xl text-2xl flex gap-2 justify-center items-center font-semibold "
        style={{ color: currentLogoColor }} // Dynamic Logo text color
      >
        {/* SVG color is handled separately or can be set to the logo color */}
        <svg width="32" height="54" viewBox="0 0 64 109" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Note: If the SVG colors are hardcoded, they must be changed 
             to currentColor or wrapped in a condition to follow the theme. 
             We'll keep the blue/cyan shades but ensure the text is readable.
          */}
          <path d="M31.3536 23.1342C34.3679 23.1342 37.323 24.3064 39.7619 26.4697L58.6992 43.2663C61.2882 45.5627 61.723 49.9273 59.6425 52.7347L47.2048 69.5176L1.9344 25.0352C1.2727 24.385 1.63573 23.1344 2.48617 23.1344L31.3536 23.1342Z" fill={isDarkBackground ? '#10D3F1' : '#10D3F1'}/>
          <path d="M43.4496 73.9714C44.652 72.3814 44.4661 69.8997 43.0416 68.5204L28.0595 54.0145L2.18288 88.8602C1.92488 89.2077 2.14331 89.7605 2.53851 89.7605L12.0044 89.7609L28.486 89.761C30.4094 89.761 32.2284 88.8057 33.4972 87.1284L43.4496 73.9714Z" fill={isDarkBackground ? '#20A0E6' : '#20A0E6'} stroke={isDarkBackground ? '#10D3F1' : '#10D3F1'}/>
        </svg>
        Kommitly
      </Link>

      {/* Desktop Auth Buttons */}
      <div className="hidden sm:flex gap-4">
        {/* Login Link: Uses dynamic color */}
        <Link
        to="/registration?tab=login"
        className="px-4 py-2 border border-white text-white rounded-xl hover:bg-gray-100 hover:!text-[#2C1D57] transition-colors 2xl:text-xl xl:text-base lg:text-base"
      >
        Login
      </Link>

        {/* Sign Up Link: Colors remain static purple/white for contrast */}
        <Link
          to="/registration?tab=signup"
          className="bg-[#4F378A] text-white px-4 py-2 rounded-xl shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-base lg:text-base"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Toggle Button: Uses dynamic color */}
      <button
        aria-label="Menu"
        className="sm:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ color: currentLinkColor }}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-6 shadow-lg rounded-xl p-4 flex flex-col gap-4 sm:hidden z-50" style={{ backgroundColor: colors.background.paper }}>
          {/* Mobile Links: Use theme colors, which are dark */}
          <Link
            to="/registration?tab=login"
            className="text-[#6F2DA8] px-4 py-2  hover:bg-gray-100 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/registration?tab=signup"
            className="bg-[#4F378A] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#6F2DA8] transition"
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