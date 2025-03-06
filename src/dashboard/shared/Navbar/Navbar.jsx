
import { IconButton } from '@mui/material';


export const Navbar = () => {
  return (
    <div className="fixed   top-0 left-64 2xl:left-70 right-0 2xl:p-4 p-2 xl:p-2.5 flex items-center justify-end  z-10 bg-white">


        <div className='flex items-center gap-4 '>
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
        </IconButton>
        <div className='flex items-center bg-[#EADDFF] p-2 rounded-full'>
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
       
        </div>
        </div>
        
  )
}

export default Navbar
