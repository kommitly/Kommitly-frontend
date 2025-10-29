import React from 'react';

const Button = ({ text = "Button", onClick, className = "" , children}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#4F378A] gap-2 flex justify-center items-center  text-white px-4 md:py-2 py-2 text-xs  md:rounded-xl rounded-lg shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-base lg:text-base ${className}`}
    >
      {children}
      {text}
    </button>
  );
};

export default Button;
