import React from 'react'
import { Typography } from '@mui/material'
import grave from "../assets/grave.svg"; // Ensure the path is correct
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import Icon from '@mui/material/Icon';
const Graveyard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
  <section className="flex w-full bg-[#6D5BA6]  justify-center items-center   flex flex-col  md:px-6 px-2 w-full sm:w-full xs:w-full lg:w-full xl:w-full 2xl:w-full">
    
     <div className="p-4  w-full h-full flex flex-col-reverse md:flex-row mt-8 sm:w-full md:space-x-8 justify-between">

            <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
      <img
        src={grave}
        alt="grave"
        className="w-full"
      />

        </div>
      </div>

      <div className=" md:w-6/12 sm:w-full flex flex-col md:pl-5  pl-0 sm:justify-center sm:items-center md:items-start md:mb-8 ">
               <div className="md:w-11/12 sm:w-full flex flex-col sm:justify-center  sm:items-center  md:items-start">
                <Typography 
                 variant="h2"
                 component="h2"
                 gutterBottom
                 
                 sx={{
                  color: '#FFFFFF',
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
          Welcome to the land of I'll do it later
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
               
               sx={{color: '#ffffff', fontSize: {
             xs: '1rem',   // extra-small screens
             sm: '1rem', // small screens
             md: '0.9rem',   // medium screens
             lg: '1rem',  // large screens and up
             xl: '1.4rem' , // extra-large screens
             '2xl': '1rem' // 2xl screens
           } }}
               >
          Don't worry, we've all been here. Kommitly gives your goals a second life with clarity, planning, and action.
        </Typography>
        </div>
      </div>
    </div>

</section>
  )
   
  
}

export default Graveyard