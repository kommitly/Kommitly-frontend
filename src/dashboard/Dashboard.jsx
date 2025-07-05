import React, {useEffect} from "react";
import { ColorModeContext, useMode } from "../theme";
import { tokens } from "../theme";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./shared/Sidebar/DashboardSidebar";
import Navbar from "./shared/Navbar/Navbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';



const Dashboard = () => {
  const muiTheme = useTheme();
  const colorMode = useMode();
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
   const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
    const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  useEffect(() => {
  if (isMobile) {
    setIsCollapsed(true);  // collapsed on mobile
  } else {
    setIsCollapsed(false); // expanded on desktop/laptop
  }
}, [isMobile]);


 




  return (
    <div className="flex h-screen relative w-full ">
      
     <div className=" ">
    {isMobile && !isCollapsed &&  (
  <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, position: 'fixed' })}
    open={!isCollapsed}
    onClick={() => setIsCollapsed(true)}
  />
)}



      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

    
    </div>

    

        {/* Push Outlet Content Below Navbar */}
        <main
  className="w-full scrollbar-hide"
  style={{
 
    paddingLeft: !isMobile
      ? isCollapsed
        ? (isXl ? '60px' : '20px')
        : (isXl ? '60px' : '0px')
      : '0px',
    position: isMobile ? 'fixed' : 'relative',
    height: isMobile ? '100vh' : 'auto',
    overflowY: isMobile ? 'auto' : 'visible', // 💡 allows scroll on mobile
  }}
>

           <div className="relative  mt-2  z-50 w-full ">
          <Navbar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

        </div>
          <div
  className="mt-14  relative "

>
          <div className=" h-screen w-full  relative">
            <Outlet  />
          </div>
          </div>
          </main>
    
    </div>
  );
};

export default Dashboard;
