import React, { useState, useEffect } from 'react'; // <-- Import useState and useEffect
import Topbar from './Topbar';
import Footer from './Footer';
import hero from '../assets/hero.svg';
import Feature from './Feature';
import Goalmore from './Goalmore';
import Partner from './Partner';
import Graveyard from './Graveyard';
import HowItWorks from './HowItWorks';
import Waitlist from './Waitlist';
import Hero2 from './Hero2';
import Painpoint from './Painpoint';

const LandingPage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const clipRadius = Math.min(
        100 + scrollPosition * 3,
        3000
    );

    return (
        <div
            className="min-h-screen p-0  flex flex-col items-center w-full"
            style={{
                backgroundColor: '#4F378A', 
                overflowX: 'hidden'
            }}
        >
            {/* PASS clipRadius TO TOPBAR */}
            <Topbar clipRadius={clipRadius} /> 
            
            <Hero2 clipRadius={clipRadius} bgColor="#FFFFFF" initialColor="#4F378A"  />
            
            {/* ... rest of the components */}
            <Painpoint/>
            <Feature />
            
          
            <HowItWorks/>
            <Waitlist/>
            <Footer />
        </div>
    );
};

export default LandingPage;