import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import landing from "../assets/landing6.png"; // Ensure the path is correct
import { MdOutlineArrowOutward } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";



const Hero2 = () => {
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);

  return (
    <section className=" flex flex-col container md:pt-0 pt-12 md:mb-8 mb-8">
       <div
      className="  w-full h-full md:flex mt-8 sm:w-full justify-between"
    >
    
      <div className=" md:w-6/12  sm:w-full flex flex-col pl-5 sm:justify-center sm:items-center md:items-start md:mb-8 sm:mb-8 ">
         <div className="md:w-full md:p-8 p-0  sm:w-full flex flex-col sm:justify-center  sm:items-center md:items-start">
            <Typography 
  variant="h1"
  component="h1"
  gutterBottom
  color="primary"
  sx={{
    marginBottom: "3rem",
    fontWeight: 'medium',
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '2.4rem',
      lg: '2.8rem',
      xl: '4rem',
      '2xl': '4rem'
    },
    textAlign: {
      xs: 'center',
      md: 'left'
    }
  }}
>
  Clear Mind <br/>  Focused Day <br/> Real Progress.
</Typography>
  
 

        <div className="flex gap-4 mb-8 md:mb-0 mt-4 sm:w-full md:w-full md:justify-start justify-center  md:mb-8">
             <Link
                  to="/registration?tab=signup" // Pass query parameter for Sign Up
                  className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition 2xl:text-xl xl:text-base lg:text-base"
                >
                  Get Started
                  <MdOutlineArrowOutward className="inline ml-2" />
                </Link>

                 <button
                 aria-label="How-it-works"
                 
                  className=" text-[#6F2DA8] px-4 py-2  cursor-pointer hover:text-[#4F378A] transition 2xl:text-xl xl:text-base lg:text-base sm:text-xs"
                >
                     <FaCirclePlay  className="inline mr-2" />
                  See How It Works
                 
                </button>
        </div>
         </div>
        
      
      </div>

        <div className="md:w-6/12 sm:w-full  -mt-8 flex justify-center  items-center ">
        <div className="w-full sm:w-full     aspect-[3/2]">
         <img src={landing}
          alt="Hero"
          
          fetchpriority="high"
          decoding="async" 
         
          className="w-full h-full  object-contain item-start"/>
        </div>
       
      </div>
  
   
    </div>
    </section>
  );
};

export default Hero2;
