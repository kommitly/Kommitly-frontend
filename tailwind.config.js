// tailwind.config.js
import { tokens } from "./src/theme"; // Use "import" instead of "require"

module.exports = {
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
  
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
  
      colors: {
        primary: {
          light: "#4F378A", // Rich Purple (light mode)
          dark: "#2C2640", // Muted Eggplant (dark mode)
        },
        secondary: {
          light: "#A89FE3", // Dusty Periwinkle
          dark: "#6D5BA6", // Deep Violet
        },
        background: {
          light: "#F4F1FF", // Light mode background
          dark: "#1E1A2A", // Dark mode background
        },
        text: {
          light: "#1E1A2A", // Dark Purple for contrast
          dark: "#F4F1FF", // Soft Lavender-White
        },
      },
    },
  },
  plugins: [],
};
