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
    <div className="flex h-screen relative">
      {/* Sidebar (Fixed on the left) */}
      {/*className=" md:w-64 lg:w-60 xl:w-56 2xl:w-66  text-white fixed inset-y-0 transform translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0"*/}
    
        <DashboardSidebar  isCollapsed={isCollapsed}/>
    

    

        {/* Push Outlet Content Below Navbar */}
        <main
  className="flex-1 w-full"
  style={{
    marginLeft: isXl ? 0 : isXs ? 74 : isSm ? 88 : isLg ? 10 : isMd ? 10 : isXxl ? 0 : isXsDown ? 0 : 0,
  }}
> <Navbar setIsCollapsed={setIsCollapsed}/>
            <Outlet  />
          </main>
    
    </div>
  );
};

export default Dashboard;
