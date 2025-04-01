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

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, setProfile } = useContext(ProfileContext);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null); // For the filter menu
  const [searchType, setSearchType] = useState(""); // "goal" or "task"
  const [searchQuery, setSearchQuery] = useState(""); // User's search input
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
    "A goal without a plan is just a wish. – Antoine de Saint-Exupéry",
    "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
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
  



  
  return (
    <Box className="border-b border-b-[#CFC8FF] items-center w-full  "  display = "flex" justifyContent="space-between" px={1.5} py={1}>
      <div className='flex items-center justify-between grid grid-cols-12  w-full'>
          <div className='col-span-6 flex items-center'>
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
                  
                  sx={{ color: colors.primary[500] }}
                >
                 {profile.user.first_name}
      
                </Typography>
      
             
      
              </span>
              <span role="img" aria-label="waving hand" className='ml-2'>
            👋
              </span>
             </h1>
              )}
              <p className=''>
           {/* {   <Typography
                  component="span"
                  variant="h5"
                  color='text.secondary' 
                  
                  
                >
                 Let's take a dive into your goals
      
                </Typography>} */}
                
                        
                        
                      </p>
              
            

                  </div>
               
             </div>
             <Box
  className=" col-span-5  flex w-full justify-end "
 
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


              <div className='flex col-span-1 justify-end items-center gap-2 '>
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
              
          </div>

                      

      </div>
     
       
    </Box>
        
  )
}

export default Navbar
