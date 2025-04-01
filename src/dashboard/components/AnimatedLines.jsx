import { motion } from "framer-motion";
import { Box } from "@mui/material";

const AnimatedLines = () => {
  const lines = Array.from({ length: 36 }); // Create an array for 8 lines

  return (
    <Box
      className="w-full h-full bg-[#1E1A2A] py-4 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center relative overflow-hidden"
    >
      {lines.map((_, index) => (
        <motion.div
          key={index}
          initial={{ y: "-100%" }} // Start above the viewport
          animate={{ y: "100%" }} // Move to below the viewport
          transition={{
            duration: 2, // Duration of the animation
            delay: index * 0.3, // Delay each line by 0.3s
            repeat: Infinity, // Repeat the animation infinitely
            repeatType: "loop",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${index * 2}cm`, // Space each line 5cm apart
            width: "2px", // Line width
            height: "100%", // Line height
            backgroundColor: "#6F2DA8", // Line color
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedLines;