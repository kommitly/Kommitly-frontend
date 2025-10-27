import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import FlareIcon from '@mui/icons-material/Flare';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle'; // New icon for 'Idea'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // New icon for 'Automation'
import { MdOutlineArrowOutward } from "react-icons/md";

const Painpoint = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
   
  return (
   <section className=" w-full py-6 md:py-12 " style={{ backgroundColor: colors.background.paper }}>
        <div className=" w-full py-6 md:py-10  px-6 md:px-8" >
          <div className="max-w-7xl mx-auto container">

            {/* SECTION HEADER */}
            <Typography 
                variant="h3" 
                component="h2" 
                textAlign="center" 
                gutterBottom 
                sx={{ 
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontWeight: 'semibold', 
                    color: colors.text.primary,
                    mb: {xs: 6, md: 10} // Increased margin bottom to separate header from content
                }}
            >
                Before You Commit, Get Clear
            </Typography>

            {/* CONTENT GRID: Problem vs. Solution */}
            <Box 
                className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
            >
                {/* 1. THE PROBLEM  */}
                <Box className="space-y-6 p-6 md:p-8 rounded-xl" sx={{ backgroundColor: colors.menu.primary }}>
                    <LightbulbCircleIcon 
                        sx={{ fontSize: 48, color: '#FFB800' }} 
                    />
                    
                    <Typography 
                        variant="h4" 
                        component="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: colors.text.primary, 
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                            marginBottom: "1rem" 
                        }}
                    >
                        You’re not lazy, your system is broken.
                    </Typography>
                    
                    <Typography variant="h4" sx={{ color: colors.text.secondary, lineHeight: 1.8, marginBottom: "1rem" }}>
                    You don’t lack discipline, just clarity. Endless lists and decisions drain your focus before real progress begins.
                  </Typography>
                    
                    <ul className="list-disc pl-5 text-sm space-y-2" style={{ color: colors.text.secondary }}>
                        <li>Struggle to turn goals into clear, doable steps.</li>
                        <li>Overwhelmed by scattered thoughts and unfinished plans.</li>
                        <li>Each day ends with effort, but not real progress.</li>
                    </ul>
                </Box>

                {/* 2. THE SOLUTION (Kommitly AI) */}
                <Box 
                    className="space-y-6 p-6 md:p-8 rounded-xl shadow-2xl" 
                    sx={{ backgroundColor: '#2C1D57', color: 'white' }} // Purple background for high contrast
                >
                    <AutoAwesomeIcon 
                        sx={{ fontSize: 48, color: '#10D3F1' }} // Bright accent color
                    />
                    
                    <Typography 
                        variant="h4" 
                        component="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '1.5rem', md: '1.75rem' } ,
                            marginBottom: "1rem"
                        }}
                    >
                        Kommitly helps you move from intention to action.
                    </Typography>
                    
                    <Typography variant="h4" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8, marginBottom: "1rem" }}>
                       Kommitly transforms goals into step-by-step actions, giving you a clear plan without the mental overload.
                    </Typography>

                    <ul className="list-disc pl-5 text-sm space-y-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                         <li>Relief from mental clutter.</li>
                        <li>Clarity and confidence in what to do next.</li>
                        <li>A sense of progress and completion.</li>
                        <li>A system designed to guide, not burden</li>
                                            
                    </ul>

                    {/* Simple CTA */}
                    <Box pt={2}>
                         <Link
                                                    to="/registration?tab=signup"
                                                    className="bg-[#4F378A]  text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-base lg:text-base"
                                                >
                                                    Get Started
                                                    <MdOutlineArrowOutward className="inline ml-2" />
                                                </Link>
                                                
                    </Box>
                </Box>
            </Box>
        </div>
        </div>
    </section>
  );
};

export default Painpoint;