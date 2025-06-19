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
  const [isCollapsed, setIsCollapsed] = useState(true);
   const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
    const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    useEffect(() => {
  if (isMobile && !isCollapsed) {
    setIsCollapsed(false);
  }
}, [location.pathname]);

 




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
          className=" w-full scrollbar-hide "
         
          style={{
  paddingLeft: !isMobile
    ? (isCollapsed
        ? (isXl ? '40px' : '80px')
        : (isXl ? '20px' : '20px'))
    : '0px',
    position: isMobile ? 'fixed' : 'relative',

}}
        >
           <div className="relative mt-2  z-50 w-full ">
          <Navbar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

        </div>
          <div
  className="mt-14   "

>
          <div className=" h-screen w-full  ">
            <Outlet  />
          </div>
          </div>
          </main>
    
    </div>
  );
};

export default Dashboard;
