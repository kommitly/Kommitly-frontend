import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const SlidingButton2 = ({ options, selected, onChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const index = options.indexOf(selected);
  const width = 100 / options.length;

  return (
    <div className="flex mt-4 relative px-1 rounded-md md:w-11/12 w-full" style={{backgroundColor: colors.tag.primary}} >

 
                  <div className='relative w-full'>
      {/* Sliding Background */}
      <div
    
        className="absolute top-1   bottom-1  w-1/2 bg-[#4F378A] shadow-sm shadow-[#4F378A] rounded-sm transition-all duration-300 ease-in-out"
        style={{
          left: `${index * width}%`,
          width: `${width}%`,
        }}
      />

      {/* Buttons */}
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            ${options.length} relative z-10 w-1/2  px-4 py-2 text-sm lg:text-xs  2xl:text-base   text-center transition-colors duration-200 cursor-pointer hover:text-[#6D5BA6]
            ${selected === option ? "text-white" : colors.text.primary}
          `}
        >
          {option === "inProgress"
            ? "In Progress"
            : option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
     </div>
  );
};

export default SlidingButton2;
