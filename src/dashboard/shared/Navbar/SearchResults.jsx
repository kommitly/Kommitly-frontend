import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";

const SearchResults = ({ results = [], onClose }) => {
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
        
      <Box
        ref={resultsRef}
        className="absolute mt-2 top-12 w-130 h-auto max-h-40 overflow-y-auto shadow-md no-scrollbar rounded-lg p-2"
        sx={{ backgroundColor: colors.primary[200] }}
      >
        {results.map((item, index) => {
          const isTask = item.hasOwnProperty("is_task") && item.is_task;
          const path = isTask
            ? `/dashboard/task/${item.id}`
            : `/dashboard/${item.is_ai_goal ? "ai-goal" : "goal"}/${item.id}`;

          return (
            <Link to={path} key={index} onClick={onClose} style={{ textDecoration: "none" }}    >
              <Typography
                className="block p-2 border-b last:border-0 text-sm cursor-pointer hover:text-[#65558F]"
              >
                {item.title}
              </Typography>
            </Link>
          );
        })}
      </Box>
    )
  );
};

export default SearchResults;
