import React from 'react';
import Topbar from './Topbar';
import Hero from './Hero';
import Footer from './Footer';
import hero from '../assets/hero.svg'; // Ensure the path is correct
import Procrastination from './Procrastination';
import Goalmore from './Goalmore';
import Partner from './Partner';
import Graveyard from './Graveyard';
import Breakdown from './Breakdown';
import Success from './Success';

const LandingPage = () => {
  return (
    <div
      className=" bg-no-repeat bg-contain bg-center min-h-screen flex flex-col items-center w-full" 
      
    >
      <Topbar />
      <Hero />
      <Procrastination />
      <Goalmore />
      <Partner/>
      <Graveyard/>
      <Breakdown/>
      <Success/>
      <Footer />
    </div>
  );
};

export default LandingPage;