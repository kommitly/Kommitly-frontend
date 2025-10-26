import React from 'react';

const Button = ({ text = "Button", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition 2xl:text-xl xl:text-base lg:text-base ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
