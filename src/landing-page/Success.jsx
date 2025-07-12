import React, {useState} from 'react'
import { Box, Button, Icon, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import hero from "../assets/hero.svg"; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import Divider from '@mui/material/Divider';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import success from "../assets/success.svg"; // Ensure the path is correct


const Success = () => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [showMore, setShowMore] = useState(false);
  
  
  return (
      <section className="rounded-t-4xl justify-center items-center pb-8   flex flex-col  md:px-6 px-2 w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full" style={{ backgroundColor: colors.background.paper }}>
      <div className="p-4  w-full h-full flex flex-col-reverse md:flex-row mt-8 sm:w-full md:space-x-8 justify-between">

            <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
           <img src={success} alt="Procrastination" className="w-full " />
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
              Progress worth celebrating.
            
   
         </Typography>
         

         

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
  <FlareIcon sx={{ color: colors.text.secondary }}  />
</Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
               color='textPrimary'
               sx={{fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
           Juma showed up. He stayed on track.
            
           </Typography>
           </div>
              {showMore && (
           <div>
            <Divider variant="middle" sx={{ margin: "1rem 0" }} />  
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
  <FlareIcon sx={{ color: colors.text.secondary }}  />
</Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
               color='textPrimary'
               sx={{fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
           
            Now the milestones he once dreamed of? They're real.
           
           </Typography>
           </div>
            <Divider variant="middle" sx={{ margin: "1rem 0" }} />  
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
  <FlareIcon sx={{ color: colors.text.secondary }}  />
</Icon>

             <Typography
               variant="body"
               component="p"
               gutterBottom
                color='textPrimary'
               
               sx={{ fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
          
            With Kommitly by his side, progress isn't just possible, it's sustainable.
           </Typography>
           </div>
            </div>
          )}
        </div>
        {/* Toggle Button */}
      <div className="w-11/12  mb-12 flex justify-end">
        <button
        aria-label="Expand"
         onClick={() => setShowMore(!showMore)}>
          <Icon
            sx={{
             backgroundColor: colors.primary[300],
              padding: "1.2rem",
              borderRadius: "30%",
             
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              
            }}
          >
            {showMore ? (
              <RemoveIcon sx={{ color: colors.text.secondary }}  />
            ) : (
              <AddIcon sx={{ color: colors.text.secondary }}  />
            )}
          </Icon>
        </button>
      </div>

    </div>


   </div>
      
     </section>
  )
}

export default Success