import React from 'react'
import { Typography } from '@mui/material'
import partner from "../assets/partner.svg"; // Ensure the path is correct
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import Icon from '@mui/material/Icon';
const Partner = () => {
   const theme = useTheme();
      const colors =tokens(theme.palette.mode);
    
    
  return (
     <section className=" flex flex-col md:mb-18 mb-8  md:px-6 px-2">
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
            Stay on track, even when life’s doing the most.
            
   
         </Typography>

      {/* {  <div className="flex w-full items-center  gap-4 mb-4">
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
          Kommitly gently reminds Juma when it’s time to take action, celebrate a win, or refocus — like a personal productivity sidekick who’s always got his back, never annoying</Typography>
         </div>} */}
         </div>
          </div>
          <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
           <img src={partner} alt="Partner" className="w-full h-auto" />
         </div>
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Partner