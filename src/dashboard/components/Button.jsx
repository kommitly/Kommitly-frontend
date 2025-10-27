import React from 'react';

const Button = ({ text = "Button", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#4F378A] text-white px-4 md:py-2 py-2 text-xs  rounded-md shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-xs lg:text-xs ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
