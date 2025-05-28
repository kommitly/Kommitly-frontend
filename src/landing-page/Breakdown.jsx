import React from 'react'
import { Typography } from '@mui/material'
import breakdown from "../assets/breakdown.svg"; // Ensure the path is correct
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import Icon from '@mui/material/Icon';

const Breakdown = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
     <section className=" justify-center items-center   flex flex-col  md:px-6 sm:px-2 w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full">
           <div
                  className="p-4 w-full h-full md:flex mt-8 sm:w-full justify-between  "
                >
                    <div className=" md:w-6/12 sm:w-full flex flex-col md:pl-5  pl-0 sm:justify-center sm:items-center md:items-start md:mb-8 ">
                             <div className="md:w-11/12 sm:w-full flex flex-col sm:justify-center  sm:items-center  md:items-start">
                              <Typography 
                               variant="h2"
                               component="h2"
                               gutterBottom
                               color="primary"
                               sx={{
                                 marginBottom: "2rem",
                                 fontWeight: 'light',
                                 fontSize: {
                                   xs: '2rem',
                                   sm: '2rem',
                                   md: '1.8rem',
                                   lg: '2.2rem',
                                   xl: '3rem',
                                   '2xl': '3rem'
                                 },
                                 textAlign: {
                                   xs: 'center',
                                   md: 'left'
                                 }
                               }}
                             >
            Clarity sparks action.
            
   
         </Typography>
         </div>
     
       <div className="flex w-full items-center  gap-4 mb-4">
                      <Icon
                sx={{
                  padding: "1.2rem",
                  backgroundColor: colors.primary[300],
                  borderRadius: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FlareIcon sx={{ color: colors.primary[500] }} />
              </Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
               
               sx={{color: '#000000', fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
           Big goals often feel intimidating — until you break them down.
          
            </Typography>
            </div>
             <div className="flex w-full items-center  gap-4 mb-4">
                      <Icon
                sx={{
                  padding: "1.2rem",
                  backgroundColor: colors.primary[300],
                  borderRadius: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FlareIcon sx={{ color: colors.primary[500] }} />
              </Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
               
               sx={{color: '#000000', fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
          
           Kommitly transforms your dream into clear, doable steps.
           
            </Typography>
            </div>
             <div className="flex w-full items-center  gap-4 mb-4">
                      <Icon
                sx={{
                  padding: "1.2rem",
                  backgroundColor: colors.primary[300],
                  borderRadius: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FlareIcon sx={{ color: colors.primary[500] }} />
              </Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
               
               sx={{color: '#000000', fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
          
            No more guessing what to do next. Just focused, guided progress — one step at a time
            </Typography>
            </div>
         </div>
          <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
           <img src={breakdown} alt="Breakdown" className="w-full h-auto" />
         </div>
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Breakdown