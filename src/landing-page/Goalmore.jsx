import React from 'react'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from '@mui/material'
import goalmore from "../assets/goalmore1.svg"; // Ensure the path is correct
import goalmore2 from "../assets/goalmore2.svg"; // Ensure the path is correct

const Goalmore = () => {
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
  const interval = setInterval(() => {
    setShowAlt(prev => !prev);
  }, 5000); // switch every 5 seconds

  return () => clearInterval(interval);
}, []);


  return (
    <section className=" flex flex-col  px-6">
      <AnimatePresence mode="wait">
        {!showAlt ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className=" w-full h-full flex justify-between items-center"
          >
            <div className="w-1/2 flex justify-center items-center">
              <img src={goalmore} alt="Goalmore" className="w-full h-auto" />
            </div>
            <div className="min-h-[72vh] w-5/12 flex flex-col pl-5 justify-center mb-8">
              <Typography variant="h1" component="h1" gutterBottom color="primary">
                Every goal feels like a mountain.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom color="text.secondary">
                Juma’s got the vision — but the "how" is giving ✨mystery novel✨. Every step feels like a bold guess… and Google isn’t helping. </Typography>


            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className=" w-full h-full flex justify-between items-center"
          >
            <div className="w-1/2 flex justify-center items-center">
              <img src={goalmore2} alt="Goalmore2" className="w-full h-auto" />
            </div>
            <div className="min-h-[72vh] w-5/12 flex flex-col pl-5 justify-center mb-8">
              <Typography variant="h1" component="h1" gutterBottom color="primary">
                The climb gets easier with a partner.
              </Typography>
              <Typography variant="h4" component="p" gutterBottom color="text.secondary">
              But Juma doesn’t have to climb alone.
              </Typography>
               <Typography variant="body1" component="p" gutterBottom color="text.secondary">
                Just when the mountain starts to feel too steep, help arrives.
              </Typography>
               <Typography variant="body1" component="p" gutterBottom color="text.secondary">
                Meet Kommitly — not just a guide, but a smart accountability buddy who actually gets it.
              </Typography>
               <Typography variant="body1" component="p" gutterBottom color="text.secondary">
                  No fluff. Just clear, doable steps and a little nudge when it matters most.
             </Typography>


           </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Goalmore