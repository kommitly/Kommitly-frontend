import Lottie from "lottie-react";
import trophyAnimation from "../../../animations/trophy3.json"; // Adjust path if needed
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";


export default function GoalTrophyAnimation() {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  

  return (
    <div className="flex w-full flex-col items-center " style={{backgroundColor: colors.menu}}>

      <Lottie animationData={trophyAnimation} loop={true} style={{ width: 200, height: 200 }} />
    </div>
  );
}


