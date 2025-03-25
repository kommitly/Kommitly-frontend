import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens based on mode
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#D6CFFF", // Muted Lavender
          200: "#A89FE3", // Dusty Periwinkle
          300: "#6D5BA6", // Deep Violet
          400: "#4F378A", // Rich Purple
          500: "#2C2640", // Muted Eggplant (Surface)
          600: "#1E1A2A", // Deep Midnight Purple (Background)
        },
        text: {
          primary: "#F4F1FF", // Soft Lavender-White
          secondary: "#D6CFFF", // Muted Lavender
        },
        background: {
          default: "#1E1A2A", // Dark mode background
          paper: "#2C2640", // Darker surface
        },
      }
    : {
        primary: {
          100: "#F6F3F3", // Soft Lavender-White
          200: "#D6CFFF", // Muted Lavender
          300: "#A89FE3", // Dusty Periwinkle
          400: "#6D5BA6", // Deep Violet
          500: "#4F378A", // Rich Purple
        },
        text: {
          primary: "#1E1A2A", // Dark Purple (for contrast in light mode)
          secondary: "#6D5BA6", //Deep Violet
        },
        background: {
          default: "#FBF9FF", // Light mode background
          paper: "#D6CFFF", // Muted Lavender (for surfaces)
        },
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.primary[300],
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontSize: 32,
        fontWeight: 600, // SemiBold
      },
      h2: {
        fontSize: 24,
        fontWeight: 600,
      },
      h3: {
        fontSize: 20,
        fontWeight: 600, // Medium
      },
      h4: {
        fontSize: 16,
        fontWeight: 500,
      },
      h5: {
        fontSize: 14,
        fontWeight: 400, // Regular
      },
      h6: {
        fontSize: 12,
        fontWeight: 300,
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
  };
}    

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
