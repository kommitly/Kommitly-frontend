// Dashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Backdrop from "@mui/material/Backdrop";

import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import DashboardSidebar from "./shared/Sidebar/DashboardSidebar";
import Navbar from "./shared/Navbar/Navbar";
import { tokens } from "../theme";

const DashboardContent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isXxl = useMediaQuery(theme.breakpoints.only("xxl"));
  const isXxxl = useMediaQuery(theme.breakpoints.only("xxxl"));

  return (
    <div className="flex h-screen  relative w-full">
      {/* Backdrop for mobile when sidebar is expanded */}
      {isMobile && !isCollapsed && (
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1,
            position: "fixed",
          })}
          open={!isCollapsed}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
  
       <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
       

  
      {/* Main content */}
      <main
        className="w-full  no-scrollbar"
        style={{
          paddingLeft: !isMobile
            ? isCollapsed
              ? isXl
                ? "60px"
                : isXxxl
              ? "70px"
              : isXxl
              ? "50px"
                : "20px"

              : isXl
              ? "100px"
              : isXxxl
              ? "210px"
              : isXxl
              ? "100px"
              : isMd
              ? "0px"
              : isSm
              ? "60px"
               : isLg
              ? "0px"
              : "80px"
            : "0px",
          position: isMobile ? "fixed" : "relative",
          height: isMobile ? "100vh" : "auto",
          overflowY: isMobile ? "auto" : "visible",
        }}
      >
        {/* Navbar */}
        <div className="relative mt-2 z-50 w-full" >
          <Navbar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
        </div>

        {/* Page content */}
        <div className="mt-14 relative">
          <div className="h-screen w-full relative">
            <Outlet context={{ isCollapsed, isMobile }} />
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap DashboardContent with SidebarProvider so all pages can access isCollapsed
const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;
