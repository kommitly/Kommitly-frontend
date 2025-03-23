import Lottie from "lottie-react";
import trophyAnimation from "../../../animations/trophy2.json"; // Adjust path if needed

export default function TrophyAnimation() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold">Task Completed! 🎉</p>
      <Lottie animationData={trophyAnimation} loop={false} style={{ width: 200, height: 200 }} />
    </div>
  );
}


