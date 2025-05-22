import React from 'react'
import { Typography } from '@mui/material'
import breakdown from "../assets/breakdown.svg"; // Ensure the path is correct

const Breakdown = () => {
  return (
     <section className=" min-h-[82vh] flex flex-col items-center justify-center px-6">
          <div
         className=" p-4 w-full h-full flex justify-between items-center"
       >
        <div className="min-h-[82vh] w-5/12  flex flex-col pl-5 justify-center mb-8">
            <Typography 
           variant="h1"
           component="h1"
           gutterBottom
           color="primary"
          >
            Clarity sparks action.
            
   
         </Typography>
     
         <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
           Big goals often feel intimidating — until you break them down.
           Kommitly transforms your dream into clear, doable steps.
            No more guessing what to do next. Just focused, guided progress — one step at a time
            </Typography>
         </div>
         <div className="w-7/12 flex justify-center items-center">
           <img src={breakdown} alt="Breakdown" className="w-full h-auto" />
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Breakdown