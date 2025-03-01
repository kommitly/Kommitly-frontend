import Lottie from "lottie-react";
import trophyAnimation from "../../../animations/trophy2.json"; // Adjust path if needed

export default function GoalBadgeAnimation() {
  return (
    <div className="flex flex-col items-center">

      <Lottie animationData={trophyAnimation} loop={true} style={{ width: 50, height: 50 }} />
    </div>
  );
}


