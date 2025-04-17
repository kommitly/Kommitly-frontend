import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const TypingText = ({ color, onComplete }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const phrases = ["Turn Your Dreams into a reality", "Break Down Your Goals into Actionable Steps"];
  const [phraseIndex, setPhraseIndex] = useState(0); // Tracks the current phrase
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [deleting, setDeleting] = useState(false); // Controls deleting effect
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));


  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
  
    if (!deleting && currentIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentPhrase[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else if (!deleting && currentIndex === currentPhrase.length) {
      setTimeout(() => setDeleting(true), 2000);
      
      // Ensure onComplete is called when typing finishes
      if (onComplete) {
        onComplete();
      }
  
    } else if (deleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (deleting && currentIndex === 0) {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }
  }, [currentIndex, deleting]);
  

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Typography variant="h1" sx={{
      color,
      fontWeight: "semibold",
      fontSize: isXs
        ? "0.8rem" // Smallest size for XS
        : isSm
        ? "1rem" // Medium size for SM
        : isMd
        ? "2rem" // Medium size for MD
        : isLg
        ? "2rem" // Large size for LG
        : isXl
        ? "3rem"
        : isXxl
        ? "3rem" // Extra large size for XL
        : "2rem", // Default size for larger screens (or the largest)
    }}>
      <motion.span>
        {displayedText}
        {showCursor && (
          <motion.span
            style={{ fontWeight: "200", color: colors.primary[500] }}
          >
            |
          </motion.span>
        )}
      </motion.span>
    </Typography>
  );
};

export default TypingText;
