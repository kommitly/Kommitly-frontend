import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { motion } from "framer-motion";
import { Target, Check, ArrowRight, Star, Bell, Calendar, LineChart } from 'lucide-react';
import { MdOutlineArrowOutward } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";
import HeroComponent from "./upgrade/HeroComponent";

const FloatingIcon = ({ icon: Icon, delay, size, top, left, right, className }) => {
  return (
    <motion.div
      className={`absolute z-0 opacity-50 ${className}`}
      style={{ top, left, right }} // ✅ include right here
      initial={{ y: 0 }}
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon size={size} color="#6F2DA8" />
    </motion.div>
  );
};

// Accept the dynamic clipRadius and colors as props
const Hero2 = ({ clipRadius, bgColor, initialColor }) => { 
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);

    // --- COLOR LOGIC ---
    // 1. Define the colors
    const darkTextColor = colors.text.primary || '#000000'; // Default to black or theme's dark text
    const lightTextColor = '#FFFFFF'; // White text for the dark background

    // 2. Define the scroll/radius threshold for the transition
    // Transition starts when clipRadius hits 200px and ends at 500px.
    const startTransitionRadius = 200;
    const endTransitionRadius = 500;
    
    // 3. Calculate the interpolation factor (0 to 1)
    const transitionFactor = Math.min(
        1,
        Math.max(
            0,
            (clipRadius - startTransitionRadius) / (endTransitionRadius - startTransitionRadius)
        )
    );

    // 4. Determine the dynamic text color (for elements that need the change)
    // We'll use this factor to blend colors in CSS (using opacity/color transition).
    // For simplicity, let's just use opacity to fade out the white text and reveal dark text.

    // Opacity for the light text (fades out as factor goes from 0 to 1)
    const lightTextOpacity = 1 - transitionFactor;

    // Opacity for the dark text (fades in as factor goes from 0 to 1)
    const darkTextOpacity = transitionFactor;

    // --- END COLOR LOGIC ---

  return (
    <section className="flex  m-0 flex-col mt-24  md:pt-0 pt-12 relative w-full">
      
         {/* ABSOLUTE LAYER: The White Background Reveal */}
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: bgColor,
                clipPath: `circle(${clipRadius}px at 50% 100%)`,
                transition: 'clip-path 0.05s linear'

            }}
        />

        {/* --- FLOATING SVGS --- */}
    <FloatingIcon icon={Target} size={30} delay={0} top="5%" left="15%" />
    <FloatingIcon icon={Check} size={25} delay={1.5} top="35%" left="3%" />
    <FloatingIcon icon={ArrowRight} size={35} delay={3} top="50%" right="2%" className="rotate-45" />
   {/* { <FloatingIcon icon={Star} size={20} delay={0.8} top="35%" right="4%" />} */}
   <FloatingIcon icon={Bell} size={28} delay={2} top="15%" left="30%" />
    <FloatingIcon icon={Calendar} size={32} delay={0.5} top="10%" right="5%" />
    <FloatingIcon icon={LineChart} size={35} delay={3.5} top="18%" right="30%" />

        {/* CONTENT LAYER: All content goes here */}
        <div className="relative  z-10 w-full h-full flex flex-col justify-center items-center">
            <div className="md:w-8/12 w-full flex flex-col pl-5 justify-center items-center md:mb-8 mb-8">
                <div className="w-full md:p-8 p-0 flex flex-col justify-center items-center">
                    
                    {/* TYPOGRAPHY: Two layers for smooth color transition */}
                    <div className="relative w-full text-center" style={{ marginBottom: "3rem" }}>
                        
                        {/* 1. DARK TEXT (Fades In) */}
                        <Typography 
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                opacity: darkTextOpacity,
                                color: darkTextColor, // Dark color
                                fontWeight: 'medium',
                                transition: 'opacity 0.2s',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.4rem', lg: '2.8rem', xl: '4rem', '2xl': '4rem' },
                                textAlign: 'center',
                            }}
                        >
                            Where ideas meet action and actually get finished.
                        </Typography>

                        {/* 2. LIGHT TEXT (Fades Out) - Must be visible when dark background is active */}
                        <Typography 
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                opacity: lightTextOpacity,
                                color: lightTextColor, // Light color (White)
                                fontWeight: 'medium',
                                transition: 'opacity 0.2s',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.4rem', lg: '2.8rem', xl: '4rem', '2xl': '4rem' },
                                textAlign: 'center',
                            }}
                        >
                            Where ideas meet action and actually get finished.
                        </Typography>
                    </div>
                    
                    {/* BUTTONS: Simple transition for the 'See How It Works' text */}
                    <div className="flex gap-4 w-full justify-center items-center">
                        <Link
                            to="/registration?tab=signup"
                            className="bg-[#4F378A] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-base lg:text-base"
                        >
                            Get Started
                            <MdOutlineArrowOutward className="inline ml-2" />
                        </Link>
                        
                        <button
                            aria-label="How-it-works"
                            className="px-4 py-2 cursor-pointer transition 2xl:text-xl xl:text-base lg:text-base sm:text-xs"
                            // Smoothly transition the button text color from white to the primary purple color
                            style={{
                                color: `rgb(
                                    ${255 - transitionFactor * (255 - 111)}, 
                                    ${255 - transitionFactor * (255 - 45)}, 
                                    ${255 - transitionFactor * (255 - 168)}
                                )`
                            }}
                        >
                            <FaCirclePlay className="inline mr-2" />
                            See How It Works
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-10/12 flex justify-center items-center">
                <HeroComponent/>
            </div>
        </div>
    
    </section>
  );
};

export default Hero2;