import React, { useState } from 'react'
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear authentication tokens or user session
    localStorage.removeItem("authToken"); // Adjust based on how you're storing auth info
    sessionStorage.removeItem("authToken");
  
    // Redirect to login page or homepage
    window.location.href = "/login"; // Adjust the path as needed
  };

  
  return (
    <div className="border-b border-[#CFC8FF] ml-56 right-0 2xl:p-4 p-2 xl:p-2.5 flex items-center justify-end z-10  h-12">
     
        <div className='flex items-center gap-4 '>
      <Link to="/dashboard/notifications">
      <IconButton>


<svg
xmlns="http://www.w3.org/2000/svg"
width="16"
height="16"
viewBox="0 0 24 24"
fill="none"
stroke="#65558F"
strokeWidth="3"
strokeLinecap="round"
strokeLinejoin="round"
className="text-[#65558F]"
>
<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
</svg>
</IconButton></Link>
        <div className='flex items-center bg-[#EADDFF] p-2 rounded-full cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}>
               <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#65558F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#65558F]"
        >
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M5.5 21a9 9 0 0 1 13 0"></path>
        </svg>
        </div>
         {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-2 mt-32 w-40 bg-white shadow-lg rounded-lg border border-gray-200">
          <Link
                to="/dashboard/settings">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            ⚙️ Settings
          </button>

                </Link>
                
        
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}
       
        </div>
        </div>
        
  )
}

export default Navbar
