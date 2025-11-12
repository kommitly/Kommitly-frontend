// context/SidebarContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook to use context easily
export const useSidebar = () => useContext(SidebarContext);
