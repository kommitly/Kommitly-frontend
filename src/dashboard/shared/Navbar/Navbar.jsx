import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Box, Button, IconButton, Typography, useTheme, Menu, MenuItem, TextField } from "@mui/material";
import  {tokens} from "../../../theme";
import { ProfileContext } from '../../../context/ProfileContext';
import { IoSearch } from "react-icons/io5";
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchResults from './SearchResults';
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


export const Navbar = ({setIsCollapsed, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, setProfile } = useContext(ProfileContext);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
 
  const [anchorEl, setAnchorEl] = useState(null); // For the filter menu
  const [searchType, setSearchType] = useState(""); // "goal" or "task"
  const [searchQuery, setSearchQuery] = useState(""); // User's search input
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isXxl = useMediaQuery(theme.breakpoints.up("xl"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const goals = [
    ...(profile?.goals?.map(goal => ({ ...goal, is_ai_goal: false })) || []),
    ...(profile?.ai_goals?.map(goal => ({ ...goal, is_ai_goal: true })) || [])
  ];

  

  const tasks = [...(profile?.tasks || []), ...(profile?.ai_goals.ai_tasks || [])];

  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleFilterClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleSearchType = (type) => {
    setSearchType(type); // Set the search type to "goal" or "task"
    setAnchorEl(null); // Close the menu
  };

  const quotes = [
    "A goal without a plan is just a wish. ",
    "You don’t have to be great to start, but you have to start to be great.",
    "Small steps every day lead to big changes."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];


  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }
  
    let results = [];
  
    if (searchType === "goal") {
      results = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === "task") {
      results = tasks
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(task => ({ ...task, is_task: true })); // Ensure is_task is true
    } 
    else {
      results = [
        ...goals.filter(goal => goal.title.toLowerCase().includes(searchQuery.toLowerCase())),
        ...tasks
          .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(task => ({ ...task, is_task: true })) // Ensure is_task is true for tasks
      ];
    }
  
    if (results.length > 0) {
      setFilteredResults(results);
      
    } else {
      setFilteredResults([]);
      alert("No matching results found.");
    }
  };
  

  const handleLogout = () => {
    // Clear authentication tokens or user session
    localStorage.removeItem("authToken"); // Adjust based on how you're storing auth info
    sessionStorage.removeItem("authToken");
  
    // Redirect to login page or homepage
    window.location.href = "/"; // Adjust the path as needed
  };

  useEffect(() => {
    if (filteredResults.length > 0) {
      setIsSearchExpanded(true);
    }
  }, [filteredResults]);
  

  useEffect(() => {
    console.log("Navbar isCollapsed:", isCollapsed);
  }, [isCollapsed]); // Run this whenever isCollapsed changes

  
  return (
  <div className={`fixed top-0   ${isCollapsed ? 'md:left-26 xs:left-0 ' : 'left-62'}  right-0 z-50 transition-width duration-300 ease-in-out `} style={{backgroundColor: colors.background.default}}>

      <Box className=" items-center w-full"  display = "flex" justifyContent="space-between" pl={4} pr={2} py={1.5} sx={{paddingLeft: isXs ? 5 : isSm ? 2 : isMd ? 2 : isLg ? 2 : isXl ? 4 : isXxl ? 2 : 2, paddingRight: isXs ? 1 : isSm ? 1 : isMd ? 1 : isLg ? 1 : isXl ? 1 : isXxl ? 4 : 4, width: isCollapsed? "100%" : isXs ? "100%" : isSm ? "100%" : isMd ? "100%" : isLg ? "100%" : isXl ? "100%" : isXxl ? "100%" : "100%"  }}>
      {/* Logo */}
      <div className='flex items-center    grid grid-cols-12   w-full ' style={{ paddingRight: isCollapsed ? 0 : isXs ? 0 : isSm ? 0 : isMd ? 0 : isLg ? 0 : isXl ? 0 : isXxl ? 0 : 0 }}>
          <Box className='col-span-5 md:col-span-5 flex items-center'
            sx={{
              gridColumn: isXs ? 'span 8' : isSm ? 'span 4' : isMd ? 'span 4' : isLg ? 'span 5' : isXl ? 'span 5' : isXxl ? 'span 5' : 'span 5',
            }}
          >
              <IconButton onClick={()=> setIsCollapsed(!isCollapsed)} sx={{alignItems: "center",  color: colors.primary,  display: {
      xs: 'flex',  // show on mobile
      md: 'none',  // hide on medium and larger screens
    },}}>
                    <MapOutlinedIcon/>
                </IconButton>
              <div className='flex flex-col mb-0'>
                  {profile.user && (
                <h1 className=' space-x-1 font-semibold text-xl mb-0'>
                  <span >
                    <Typography
                  component="span"
                  variant="h3"
                  className=" text-semibold"
                  color='text.primary' 
                >
                Hello
      
                </Typography>
             
      
              </span>
              <span className='text-secondary'>
              <Typography
                  component="span"
                  variant="h3"
                  className=" text-semibold"
                  
                  sx={{ color: colors.primary[400] }}
                >
                 {profile.user.first_name}
      
                </Typography>
      
             
      
              </span>
              <span role="img" aria-label="waving hand" className='ml-2'>
            👋
              </span>
             </h1>
              )}
            
           {/* {   <Typography
                  component="span"
                  variant="h5"
                  color='text.secondary' 
                  
                  
                >
                 Let's take a dive into your goals
      
                </Typography>} */}
            {/* {     <motion.p
          className="text-secondary italic text-xs font-regular  "
          style={{color: colors.primary[500]}}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {randomQuote}
        </motion.p>} */}
                
                        
                        
                     
              
            

                  </div>
               
             </Box>
           {!isXs && (
              <Box
              className=" col-span-6 md:col-span-6   flex w-full justify-end  "
              sx={{
                paddingRight: isXs ? 4: isSm ? 4 : isMd ? 4 : isLg ? 4 : isXl ? 4 : isXxl ? 4 : 4,
              }
              
              }
             
            >
              <motion.div
                initial={{ width: 36,height: 36, justifyContent: "center", alignItems: "center"  }}
                animate={{ width: isSearchExpanded ? "100%" : 36, justifyContent: "space-between", alignItems: "center", height: 36 }}
                transition={{ duration: 0.3 }}
                className="rounded-full bg-[#F4F1FF] flex  p-1  items-center  w-full relative overflow-hidden "
                style={{ backgroundColor: colors.background.paper, overflow:"visible" }}
                onMouseEnter={() => setIsSearchExpanded(true)}
                onMouseLeave={() => {
                  if (filteredResults.length === 0) {
                    setIsSearchExpanded(false);
                  }
                }}
                
              >
            
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isSearchExpanded ? "auto" : 0, opacity: isSearchExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex items-center gap-2"
              >
                <IconButton onClick={handleFilterClick}>
                  <FilterListOutlinedIcon sx={{ fontSize: "16px", color: colors.primary[500] }} />
                </IconButton>
            
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
                  <MenuItem onClick={() => handleSearchType("goal")}>Goal</MenuItem>
                  <MenuItem onClick={() => handleSearchType("task")}>Task</MenuItem>
                </Menu>
            
                <TextField
                  variant="standard"
                  placeholder={`Search ${searchType || "goals or tasks"}`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchExpanded(true);
                  }}
                  onFocus={() => setIsSearchExpanded(true)}
                  InputProps={{
                    disableUnderline: true,
                    style: { color: colors.primary[500], fontSize: "12px" },
                  }}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </motion.div>
                
                {/* Search Icon - Always Visible */}
                <IconButton className="p-0.5 " onClick={handleSearch}>
                  <IoSearch size={16} className="text-[#4F378A]" />
                </IconButton>
            
              
            
                <SearchResults
                          results={filteredResults || []}
                          
                        
                          onClose={() => setFilteredResults([])}
                        />
              </motion.div>
            </Box>
            )}



         <Box className='flex col-span-1 md:col-span-1 justify-end items-center space-x-2 '
         sx={{
          gridColumn: isXs ? 'span 1' : isSm ? 'span 1' : isMd ? 'span 2' : isLg ? 'span 1' : isXl ? 'span 1' : isXxl ? 'span 1' : 'span 1',
         }}>
            <Link to="/dashboard/notifications">
                 <IconButton>


                <NotificationsNoneIcon sx={{ fontSize: "20px", color: colors.primary[400] }} />
                  </IconButton>
                  </Link>
                <div className='flex items-center  rounded-full cursor-pointer'
                onClick={() => setIsOpen(!isOpen)}>
                  <IconButton>
                  <AccountCircleOutlinedIcon sx={{ fontSize: "20px", color: colors.primary[400] }}/>
                    </IconButton>
                    
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
              
          </Box>

                      

      </div>
     
       
    </Box>
    </div>
        
  )
}

export default Navbar
