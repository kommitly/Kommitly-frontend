import React from "react";
import { ColorModeContext, useMode } from "../theme";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./shared/Sidebar/DashboardSidebar";
import Navbar from "./shared/Navbar/Navbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';




const Dashboard = () => {
  const muiTheme = useTheme();
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(true);
   const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isLg = useMediaQuery(theme.breakpoints.only("lg"));
    const isXl = useMediaQuery(theme.breakpoints.only("xl"));
    const isMd = useMediaQuery(theme.breakpoints.only("md"));
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));
    const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
    const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));




  return (
    <div className="flex h-screen relative w-full ">
      {/* Sidebar (Fixed on the left) */}
      {/*className=" md:w-64 lg:w-60 xl:w-56 2xl:w-66  text-white fixed inset-y-0 transform translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0"*/}
    <div className="w-auto">

      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

    
    </div>

    

        {/* Push Outlet Content Below Navbar */}
        <main
          className="   w-full scrollbar-hide "
          style={{
            paddingLeft: isCollapsed
      ? ( isXl ? '40px' : isXs ? '40px' : isSm ? '100px' : isLg ? '28px': isMd ? '6px' : isXxl ? '40px' : isXsDown ? 0 : 0) : (
              isXs ? '40px' : isSm ? '100px' : isLg ? '10px': isMd ? '0px' : isXxl ? '40px' : isXsDown ? 0 : 0
            
      ),
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
