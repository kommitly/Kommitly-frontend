import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";




const Hero = () => {
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);

  return (
    <section className=" min-h-[82vh] flex flex-col items-center justify-center px-6">
       <div
      className="bg-[#1E1A2A]/10 p-4 w-full h-full flex flex-col backdrop-blur-sm rounded-2xl shadow-lg shadow-[#1E1A2A] border border-white/30"
    >
   <Typography 
        variant="h1"
        component="h1"
        gutterBottom
        color="secondary"
       >
           Achieve Your Goals with <span className="text-primary">Kommitly</span>
         

      </Typography>
  
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        color="text.secondary"

        >
        Break down your big dreams into small, actionable steps. Track your
        progress, stay accountable, and make success a habit.

        </Typography>
      {/* {<div className="mt-6 flex gap-4">
        <Link to="/signup">
          <button className="bg-[#6F2DA8] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#4F378A] transition">
            Get Started
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="bg-white text-[#6F2DA8] px-6 py-3 rounded-lg border border-[#6F2DA8] shadow-lg hover:bg-[#E9E4FF] transition">
            View Dashboard
          </button>
        </Link>
      </div>} */}
    </div>
    </section>
  );
};

export default Hero;
