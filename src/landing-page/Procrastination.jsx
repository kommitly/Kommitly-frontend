import React from 'react'
import { Typography } from '@mui/material'
import procrastination from "../assets/procrastination.svg"; // Ensure the path is correct

const Procrastination = () => {
  return (
    <section className=" min-h-[60] flex flex-col px-6">
          <div
         className="  w-full  flex justify-between "
       >
        <div className=" w-5/12  flex flex-col pl-5 justify-center mb-8">
            <Typography 
           variant="h1"
           component="h1"
           gutterBottom
           color="primary"
          >
              One vague goal. Ten distractions later…
            
   
         </Typography>
     
         <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
           Juma doesn’t talk about his goals — he keeps them in his Notes app
           </Typography>
            <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
            He scrolls past motivation reels at night, whispering “soon.”
           </Typography>

             <Typography
           variant="body1"
           component="p"
           gutterBottom
           color="text.secondary"
   
           >
          But when tasks feel vague or too big, he freezes. He’s not lazy — he’s just stuck and unsure where to begin. </Typography>


          
         </div>
         <div className="w-1/2 flex justify-center items-center">
           <img src={procrastination} alt="Procrastination" className=" size-142" />
         </div>
         
     
       
       </div>
       </section>
  )
}

export default Procrastination