import React from 'react';
import Topbar from './Topbar';
import Hero from './Hero';
import Footer from './Footer';
import hero from '../assets/hero.svg'; // Ensure the path is correct


const LandingPage = () => {
  return (
    <div
      className="bg-[#1E1A2A] bg-no-repeat bg-contain bg-center min-h-screen flex flex-col items-center w-full" 
      style={{ backgroundImage: `url(${hero})` }}
    >
      <Topbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default LandingPage;