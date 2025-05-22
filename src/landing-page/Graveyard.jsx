import React from 'react'
import { Typography } from '@mui/material'
import grave from "../assets/grave.svg"; // Ensure the path is correct

const Graveyard = () => {

  return (
  <section className="flex w-full   flex-col items-center justify-center">
 
    <div className="w-full flex gap-4 p-4 bg-[#6D5BA6] overflow-hidden">
      <img
        src={grave}
        alt="grave"
        className="w-6/12 object-cover "
      />
      <div className=' justify-center items-center flex flex-col w-5/12'>
        <Typography
          variant="h4"
          className=" text-white  "
          sx={{ marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}
        >
          Welcome to the land of I'll do it later
        </Typography>
        <Typography
          variant="body1"
          className=" text-white mt-2"
        >
          Don't worry, we've all been here. Kommitly gives your goals a second life with clarity, planning, and action.
        </Typography>
      </div>
    </div>

</section>
  )
   
  
}

export default Graveyard