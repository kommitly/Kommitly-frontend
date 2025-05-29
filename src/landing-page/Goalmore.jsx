import React from 'react'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from '@mui/material'
import goalmore from "../assets/goalmore1.svg"; // Ensure the path is correct
import goalmore2 from "../assets/goalmore2.svg"; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import { Icon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Ensure the path is correct
import Divider from '@mui/material/Divider';

const Goalmore = () => {
  const [showAlt, setShowAlt] = useState(false);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  
  useEffect(() => {
  const interval = setInterval(() => {
    setShowAlt(prev => !prev);
  }, 5000); // switch every 5 seconds

  return () => clearInterval(interval);
}, []);


  return (
    <section className=" justify-center items-center   flex flex-col  md:px-6 px-2 w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full">
     
      <AnimatePresence mode="wait">
        {!showAlt ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
           className="p-4  w-full h-full flex flex-col-reverse md:flex-row mt-8 sm:w-full md:space-x-8 justify-between">
             <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
              <img src={goalmore} alt="Goalmore" className="w-full h-auto" />
            </div>
            </div>
            <div className=" md:w-6/12 sm:w-full flex flex-col md:pl-5  pl-0 sm:justify-center sm:items-center md:items-start md:mb-8 ">
                     <div className="md:w-11/12 sm:w-full flex flex-col sm:justify-center  sm:items-center  md:items-start">
                      <Typography 
                                                  variant="h2"
                                                  component="h2"
                                                  gutterBottom
                                                  color="primary"
                                                  sx={{
                                                    marginBottom: "2rem",
                                                    fontWeight: 'medium',
                                                    fontSize: {
                                                      xs: '1.8rem',
                                                      sm: '1rem',
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
                Every goal feels like a mountain.
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
       
                Juma’s got the vision — but the "how" is giving ✨mystery novel✨.  </Typography>

           </div>
           <Divider variant='middle' sx={{  margin: '1rem 0' }} />  
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
        Every step feels like a bold guess… and Google isn’t helping. </Typography>

           </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
           className="p-4  w-full h-full flex flex-col-reverse md:flex-row mt-8 sm:w-full md:space-x-8 justify-between">
           <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
              <img src={goalmore2} alt="Goalmore2" className="w-full " />
              </div>
            </div>
            <div className=" md:w-6/12 sm:w-full flex flex-col md:pl-5  pl-0 sm:justify-center sm:items-center md:items-start md:mb-8 ">
                     <div className="md:w-11/12 sm:w-full flex flex-col sm:justify-center  sm:items-center  md:items-start">
                      <Typography 
                                                  variant="h2"
                                                  component="h2"
                                                  gutterBottom
                                                  color="primary"
                                                  sx={{
                                                    marginBottom: "2rem",
                                                    fontWeight: 'medium',
                                                    fontSize: {
                                                      xs: '1.8rem',
                                                      sm: '1rem',
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
                The climb gets easier with a partner.
              </Typography>
              </div>
             
               <div className="flex w-full items-center  gap-4 ">
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
       
              But Juma doesn’t have to climb alone.
              </Typography>
              </div>
              <Divider variant='middle' sx={{  margin: '1rem 0' }} />  
              
                <div className="flex w-full items-center  gap-4 ">
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
       
                Just when the mountain starts to feel too steep, help arrives.
              </Typography>
              </div>
              <Divider variant='middle' sx={{  margin: '1rem 0' }} />  

                <div className="flex w-full items-center  gap-4 ">
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
       
                Meet Kommitly — not just a guide, but a smart accountability buddy who actually gets it.
              </Typography>
              </div>
             

           </div>
          </motion.div>
        )}
      </AnimatePresence>
     
    </section>
  );
};

export default Goalmore