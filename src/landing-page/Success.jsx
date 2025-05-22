import React from 'react'
import { Typography } from '@mui/material'
import success from "../assets/success.svg"; // Ensure the path is correct

const Success = () => {
  return (
     <section className=" min-h-[82vh] flex flex-col items-center justify-center px-6">
          <div
         className=" p-4 w-full h-full flex justify-between items-center"
       >
           <div className="w-1/2 flex justify-center items-center">
           <img src={success} alt="Procrastination" className="w-full h-auto" />
         </div>
        <div className="min-h-[82vh] w-1/2  flex flex-col pl-5 justify-center mb-8">
            <Typography 
           variant="h1"
           component="h1"
           gutterBottom
           color="primary"
          >
              Progress worth celebrating.
            
   
         </Typography>
     
         <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
           Juma showed up. He stayed on track.
            Now the milestones he once dreamed of? They're real.
            With Kommitly by his side, progress isn't just possible, it's sustainable.
           </Typography>
         </div>
      
         
     
       
       </div>
       </section>
  )
}

export default Success