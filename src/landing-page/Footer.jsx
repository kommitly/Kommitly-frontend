import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#4F378A] w-full text-white py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Kommitly. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
