import React from 'react'
import { color, motion } from "framer-motion";




const Loading = () => {
  return (
     <div className="w-11/12 p-8  min-h-screen flex justify-center items-center no-scrollbar">
               <motion.div className="flex space-x-2">
           {[0, 1, 2].map((i) => (
             <motion.div
               key={i}
               className="w-2 h-2 bg-[#65558F] rounded-full"
               initial={{ y: -10 }}
               animate={{ y: [0, 10, 0] }}
               transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
             />
           ))}
         </motion.div>
         
               </div>
  )
}

export default Loading