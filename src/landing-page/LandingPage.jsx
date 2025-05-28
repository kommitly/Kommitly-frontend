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
import Hero2 from './Hero2'; // Import Hero2 component

const LandingPage = () => {
  return (
    <div
      className=" bg-no-repeat bg-contain bg-center min-h-screen flex flex-col items-center w-full xs:w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full" 
      
    >
      <Topbar />
      <Hero2 />
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