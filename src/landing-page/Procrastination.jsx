import React, {useState} from 'react'
import { Typography, Icon } from '@mui/material'
import procrastination from "../assets/procrastination.svg"; // Ensure the path is correct
import FlareIcon from '@mui/icons-material/Flare';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Ensure the path is correct
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

const Procrastination = () => {
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);
    const [showMore, setShowMore] = useState(false);
  
  
  return (
     <section className=" flex flex-col   md:px-6 px-2">
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
              One vague goal. Ten distractions later…
            
   
         </Typography>

         
     
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
           Juma doesn’t talk about his goals — he keeps them in his Notes app
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
            He scrolls past motivation reels at night, whispering “soon.”
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

          
          But when tasks feel vague or too big, he freezes. He’s not lazy — he’s just stuck and unsure where to begin. </Typography>

           </div>
             </div>
          )}
        </div>
        {/* Toggle Button */}
      <div className="w-11/12  mb-12 flex justify-end">
        <button onClick={() => setShowMore(!showMore)}>
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
              <RemoveIcon sx={{ color: colors.primary[500] , }} />
            ) : (
              <AddIcon sx={{ color: colors.primary[500] }} />
            )}
          </Icon>
        </button>
      </div>

           
           

          
        
         </div>
         <div className="md:w-6/12 sm:w-full flex justify-center  items-center ">
        <div className="w-10/12 sm:w-full ">
           <img src={procrastination} alt="Procrastination" className=" w-full" />
         </div>
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Procrastination