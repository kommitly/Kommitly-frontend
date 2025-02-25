import Lottie from "lottie-react";
import trophyAnimation from "../../../animations/trophy3.json"; // Adjust path if needed

export default function GoalTrophyAnimation() {
  return (
    <div className="flex flex-col items-center">

      <Lottie animationData={trophyAnimation} loop={true} style={{ width: 200, height: 200 }} />
    </div>
  );
}


