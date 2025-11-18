import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { sub } from "date-fns";

// Color design tokens based on mode
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#D6CFFF", // Muted Lavender
          200: "#A89FE3", // Dusty Periwinkle
          300: "#6D5BA6", // Deep Violet
          400: "#6D5BA6", // Rich Purple
          500: "#6D5BA6", // Muted Eggplant (Surface)
          600: "#F6F3F3", // Deep Midnight Purple (Background)
          700: "#2C2640"
        },
        text: {
          primary: "#F4F1FF", // Soft Lavender-White
          secondary: "#D6CFFF", // Muted Lavender
          placeholder: "#B4B4B4",
          subtitle: "#A89FE3",
          tertiary: "#A89FE3"  // Dusty Periwinkle (for contrast in dark mode)    
        },
        background: {
          sidebar: "#2C1D57",
          // default: "#1E1A2A", // Dark mode background
          default: "#13101B",
          paper: "#2C2640", // Darker surface
          warning: "#E60178",
        },
        tag:{
          primary: "#1E1A2A"
        },
         empty:{
          primary: "#2C2640",
          secondary: "#6D5BA6",
          tertiary: "#4F378A",
          clips: "#F4F1FF",
          paper: "#A89FE3",
          cut: "#13101B"
          
        },
           menu:{
          primary: "#3F375C",
          header: "#3F375C",
          content: "#13101B",
        }
      }

    : {
        primary: {
          100: "#F6F3F3", // Soft Lavender-White
          200: "#D6CFFF", // Muted Lavender
          300: "#A89FE3", // Dusty Periwinkle
          400: "#6D5BA6", // Deep Violet
          500: "#4F378A", // Rich Purple
          600: "#2C2640", // Muted Eggplant (Surface)
          700: "#F6F3F3",
        },
        text: {
          primary: "#1E1A2A", // Dark Purple (for contrast in light mode)
          secondary: "#4F378A", //Deep Violet
          placeholder: "#636363", // Placeholder text color
          subtitle: "#4F378A",
          tertiary: "#1E1A2A" // Deep Violet (for contrast in light mode)

        },
        background: {
          default: "#FBF9FF", // Light mode background
          paper: "#D6CFFF", // Muted Lavender (for surfaces)
          warning: "#E60178",
          sidebar: "#4F378A"
        },
         tag:{
          primary: "#EEEEEE"
        },
           menu:{
          primary: "#FFFFFF",
          header: "#F6F3F3",
          content: "#FFFFFF",
        },
           empty:{
          primary: "#EAE6FF",
          secondary: "#6D5BA6",
          tertiary: "#4F378A",
          clips: "#F4F1FF",
          paper: "#A89FE3",
          cut: "#FFFFFF"
          
        },


      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      primary: { main: colors.primary[500] },
      secondary: { main: colors.primary[300] },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
        sidebar: colors.background.sidebar,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },

    typography: {
      fontFamily: ["cereal", "sans-serif"].join(","),
      fontSize: 12,
      h1: { fontSize: 32, fontWeight: 600 },
      h2: { fontSize: 24, fontWeight: 600 },
      h3: { fontSize: 20, fontWeight: 600 },
      h4: { fontSize: 16, fontWeight: 500 },
      h5: { fontSize: 14, fontWeight: 400 },
      h6: { fontSize: 12, fontWeight: 300 },
      body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      body2: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1920,
        xxxl: 2360,
      },
    },
  };
};
  

// Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light"); // Default to light mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
