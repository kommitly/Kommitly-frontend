import Lottie from "lottie-react";
import trophyAnimation from "../../../animations/trophy2.json"; // Adjust path if needed
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function TrophyAnimation() {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold" style={{color: colors.text.primary}}>Task Completed! 🎉</p>
      <Lottie animationData={trophyAnimation} loop={false} style={{ width: 200, height: 200 }} />
    </div>
  );
}
