import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";




const Hero = () => {
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);

  return (
    <section className=" min-h-screen flex flex-col  px-6">
       <div
      className=" p-4 w-full h-full flex justify-between "
    >
      <div className="w-6/12  ">
        <img src="/src/assets/hero.svg" alt="Hero" className="w-full size-136" />
      </div>
      <div className=" w-5/12 flex flex-col pl-5 justify-center mb-8">
         <Typography 
        variant="h1"
        component="h1"
        gutterBottom
        color="primary"
        sx={{marginBottom: "2rem"}}
       >
           Drowning in goals, but not getting anything done? 
         

      </Typography>
  
      <Typography
        variant="h4"
        component="p"
        gutterBottom
        color="text.secondary"
        sx={{marginBottom: "0.8rem"}}
        >
       Meet Juma, he has big ideas — maybe too many.

        </Typography>
        <Typography
        variant="body1"
        component="p"
        gutterBottom
        color="text.secondary"

        >
       
       He stays up late making plans, watching productivity videos, and jotting goals on sticky notes.
       </Typography>
      
         <Typography
        variant="body1"
        component="p"
        gutterBottom
        color="text.secondary"

        >
      He’s trying, but he’s tired. His to-dos keep piling up, and progress feels like a moving target.
        </Typography>
      
      </div>
  
   
    </div>
    </section>
  );
};

export default Hero;
