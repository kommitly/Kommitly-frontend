import React from 'react'
import { Typography } from '@mui/material'
import partner from "../assets/partner.svg"; // Ensure the path is correct

const Partner = () => {
  return (
    <section className=" min-h-[72vh] flex flex-col items-center justify-center px-6">
          <div
         className=" w-full h-full flex justify-between items-center"
       >
        <div className="min-h-[72vh] w-5/12  flex flex-col pl-5 justify-center mb-8">
            <Typography 
           variant="h1"
           component="h1"
           gutterBottom
           color="primary"
          >
            Stay on track, even when life’s doing the most.
            
   
         </Typography>
     
         <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
          Kommitly gently reminds Juma when it’s time to take action, celebrate a win, or refocus — like a personal productivity sidekick who’s always got his back, never annoying</Typography>
         </div>
         <div className="w-1/2 mr-4 flex justify-center items-center">
           <img src={partner} alt="Partner" className="w-full h-auto" />
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Partner