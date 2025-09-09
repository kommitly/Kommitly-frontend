import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";

const SearchResults = ({ results = [], onClose, onSelectTask }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        onClose(); // Close the results when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);


  return (
    results?.length > 0 && (
        
      <div
        ref={resultsRef}
        className="  md:w-full w-72 h-auto max-h-40 overflow-y-auto shadow-xl no-scrollbar rounded-lg p-2"
        style={{ backgroundColor: colors.background.paper }}
      >
        {results.map((item, index) => {
          const isTask = item.hasOwnProperty("is_task") && item.is_task;
         

          return (

  <Typography
    className={`block p-2 border-b last:border-0 text-sm cursor-pointer transition-all duration-200 rounded-md`}
    key={index}
    sx={{
      color: colors.text.primary,
      "&:hover": {
        backgroundColor: colors.background.default,
        color: colors.text.primary, // Optional: change to contrast color if needed
      },
      "&:active": {
        backgroundColor: colors.primary[500],
        color: colors.primary[100],
      },
    }}
    onClick={() => {
                if (isTask) {
                  onSelectTask(item); // ✅ call back to Calendar
                }
                onClose();
              }}
  >
    {item.title}
  </Typography>


          );
        })}
      </div>
    )
  );
};

export default SearchResults;
