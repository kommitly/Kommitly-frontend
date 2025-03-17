import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[#F4F1FF] min-h-[82vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-[#4F378A] mb-4">
        Achieve Your Goals with <span className="text-[#6F2DA8]">Kommitly</span>
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl">
        Break down your big dreams into small, actionable steps. Track your
        progress, stay accountable, and make success a habit.
      </p>
      <div className="mt-6 flex gap-4">
        <Link to="/signup">
          <button className="bg-[#6F2DA8] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#4F378A] transition">
            Get Started
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="bg-white text-[#6F2DA8] px-6 py-3 rounded-lg border border-[#6F2DA8] shadow-lg hover:bg-[#E9E4FF] transition">
            View Dashboard
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
