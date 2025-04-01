import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1E1A2A] w-full text-white py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Kommitly. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
