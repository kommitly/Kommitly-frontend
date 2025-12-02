import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Box, Button, IconButton, Typography, useTheme, Menu, MenuItem, TextField } from "@mui/material";
import  {tokens} from "../../../theme";
import { fetchAllNotifications } from '../../../utils/Api';
import notificationSound from "/notification.mp3";
import { AuthContext } from '../../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import { IoSearch } from "react-icons/io5";
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchResults from './SearchResults';
import MenuIcon from '@mui/icons-material/Menu';
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notifications from '../../components/Notifications';
import Badge from '@mui/material/Badge';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import { useSidebar } from '../../../context/SidebarContext';


export const Navbar = () => {
  const audioRef = useRef(null);
  const prevUnreadCount = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const {user, logout} = useContext(AuthContext);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null);
  const notifRef = useRef(null); // For the notifications dropdown
  const searchRef = useRef(null);
  const filterMenuRef = useRef(null);
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
    ...(user?.goals?.map(goal => ({ ...goal, is_ai_goal: false })) || []),
    ...(user?.ai_goals?.map(goal => ({ ...goal, is_ai_goal: true })) || [])
  ];
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();

  

  const tasks = [...(user?.tasks || []), ...(user?.ai_goals.ai_tasks || [])];

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

   useEffect(() => {
      const fetchNotificationsData = async () => {
        try {
          const data = await fetchAllNotifications()
          setNotifications(data)
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      }
  
      fetchNotificationsData()

       // Poll every 15 seconds
  const interval = setInterval(() => {
   fetchNotificationsData();
  }, 15000);

  return () => clearInterval(interval); // cleanup on unmount
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

     useEffect(() => {
    // play sound only when unread count increases
    if (unreadCount > prevUnreadCount.current) {
      audioRef.current?.play().catch(() => {});
    }

    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);
  

  const handleLogout = () => {
    logout();
    
  
   
  };

  useEffect(() => {
    if (filteredResults.length > 0) {
      setIsSearchExpanded(true);
    }
  }, [filteredResults]);
  


 useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }

    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setIsNotifOpen(false);
    }

    const clickedInsideSearch =
      searchRef.current && searchRef.current.contains(event.target);

    const clickedFilterMenu =
      filterMenuRef.current && filterMenuRef.current.contains(event.target);

    // If click is outside both search and filter menus
    if (!clickedInsideSearch && !clickedFilterMenu) {
      // Step 1: Clear the search results
      setFilteredResults([]);

      // Step 2: Collapse search bar after a short delay (e.g., 100ms)
      setTimeout(() => {
        setIsSearchExpanded(false);
      }, 100); 
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  
  return (
    <div className={`relative  ${isCollapsed ?  ' w-11/12' : 'w-10/12' }`}>
       <div className={`fixed top-0   ${isCollapsed ? 'md:left-28 xs:left-0 lg:left-24 xl:left-24  2xl:left-38' : 'md:left-58 lg:left-62 xl:left-62 2xl:left-80  left-50'}  right-0 z-50 transition-width  `} style={{backgroundColor: colors.background.default}}>

      <Box className=" items-center w-full"  display = "flex" justifyContent="space-between" pl={4} pr={2} py={1.5} sx={{paddingLeft: {
      xs: isCollapsed ? 1 : 8,
      sm: isCollapsed ? 2 : 3,
      md: isCollapsed ? 0 : 2,
      lg: isCollapsed ? 2 : 2,
      xl: isCollapsed ? 0 : 4,
      xxl: isCollapsed ? 0 : 2,
    }, paddingRight: isXs ? 1 : isSm ? 1 : isMd ? 1 : isLg ? 1 : isXl ? 1 : isXxl ? 4 : 4, width: isCollapsed? "100%" : isXs ? "100%" : isSm ? "100%" : isMd ? "100%" : isLg ? "100%" : isXl ? "100%" : isXxl ? "100%" : "100%"  }}>
      {/* Logo */}
      <div className='flex items-center  grid grid-cols-12   w-full ' style={{ paddingRight: isCollapsed ? 0 : isXs ? 0 : isSm ? 0 : isMd ? 0 : isLg ? 0 : isXl ? 0 : isXxl ? 0 : 0 }}>
          <Box className='col-span-5  flex items-center'
            sx={{
              gridColumn: isXs ? 'span 11' : isSm ? 'span 5' : isMd ? 'span 5' : isLg ? 'span 5' : isXl ? 'span 5' : isXxl ? 'span 5' : 'span 5',
            }}
          >
              <IconButton onClick={()=> setIsCollapsed(!isCollapsed)} sx={{alignItems: "center",  color: colors.primary,  display: {
      xs: 'flex',  // show on mobile
      sm: 'none',  // hide on medium and larger screens
    },}}>
                <MenuIcon sx={{ fontSize: {
                            xs: "20px",  // extra-small screens
                            sm: "18px",  // small screens
                            md: "20px",  // medium screens
                            lg: "24px",  // large screens
                            xl: "36px",  // extra-large screens
                            
                          }, color: colors.text.primary }} />
                </IconButton>
              <div className='flex space-x-1  mb-0'>
                  {user.user && (
                    <>
                     <span className=' items-center'>
                    <p
                 
                  style={{ color: colors.text.primary }}
                  className=' font-regular mb-0 md:text-base text-lg 2xl:text-xl lg:text-lg xl:text-xl'
                >
                Hello
      
                </p>
             

              </span>
              <span className='text-secondary'>
              <p
                  style={{ color: colors.primary[500] }}
                  className='font-regular mb-0 text-lg 2xl:text-xl md:text-base lg:text-lg xl:text-xl'
                >
                 {user.user.first_name}
      
                </p>
      
             
      
              </span>
              <span role="img" aria-label="waving hand" className='ml-2 text-lg 2xl:text-xl xl:text-base md:text-base lg:text-lg'>
            👋
              </span>
          
                    </>
             
                 
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
                paddingRight: isXs ? 4: isSm ? 6 : isMd ? 6 : isLg ? 4 : isXl ? 5 : isXxl ? 5 : 4,
              }
              
              }
             
            >
              <motion.div
                ref={searchRef}
                initial={{ justifyContent: "center", alignItems: "center" }}
                animate={{
                  width: isSearchExpanded ? "100%" : undefined,
                  height: isSearchExpanded ? undefined : undefined,
                  display: "flex",
                  alignItems: "center",
                }}

                transition={{ duration: 0.3 }}
                className={`rounded-full bg-[#F4F1FF]  w-8 h-8                    
                sm:w-10 sm:h-10            // small
                md:w-6 md:h-6            // medium
                lg:w-8 lg:h-8            // large
                xl:w-9 xl:h-9           // extra large
                2xl:w-12 2xl:h-12
                3xl:w-12 3xl:h-12
                 ${isSearchExpanded ? 'w-full' : ''}`}
                style={{ backgroundColor: colors.background.paper, overflow:"visible" }}
                onMouseEnter={() => setIsSearchExpanded(true)}
              
                
              >
            
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isSearchExpanded ? "100%" : 0, opacity: isSearchExpanded ? 1 : 0, }}
                transition={{ duration: 0.3 }}
                 className="overflow-hidden flex items-center gap-2 flex-grow "
              >
                <IconButton  onClick={handleFilterClick}>
                  <FilterListOutlinedIcon sx={{ fontSize: {
                             xs: "20px",  // extra-small screens
                          sm: "16px",  // small screens
                         md: "20px",  // medium screens
                          lg: "20px",  // large screens
                          xl: "28px",  // extra-large screens
                          
                        }, color: colors.primary[500] }} />
                </IconButton>
            
                <Menu ref={filterMenuRef} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose} className="mt-1">
                    <MenuItem
                      onClick={() => handleSearchType("goal")}
                      selected={searchType === "goal"}
                      className='gap-4 flex items-center '
                    >
                      Goal
                      {searchType === "goal" && (
                        <CheckIcon sx={{ fontSize: 16, color: colors.primary[500] }} />
                      )}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSearchType("task")}
                      selected={searchType === "task"}
                      className='gap-4 flex items-center '
                    >
                      Task
                      {searchType === "task" && (
                        <CheckIcon sx={{ fontSize: 16,  color: colors.primary[500] }} />
                      )}
                    </MenuItem>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    disableUnderline: true,
                  sx: { color: colors.primary[500], fontSize: {
                            xs: "12px",  // extra-small screens
                            sm: "10px",  // small screens
                            md: "12px",  // medium screens
                            lg: "12px",  // large screens
                            xl: "18px",  // extra-large screens
                    } },
                  }}
                  className="bg-transparent  outline-none text-sm  w-full"
               
                />
              </motion.div>
                
                {/* Search Icon - Always Visible */}
             <div className='flex items-center justify-center h-full w-9 md:w-10 2xl:w-12'>
                <div className={`${isSearchExpanded ? 'justify-end w-auto ' : 'justify-center w-full' } flex items-center h-full transition-all duration-300 ease-in-out`}
>
                <SearchIcon  onClick={handleSearch} sx={{fontSize: {
                           xs: "20px",  // extra-small screens
                          sm: "16px",  // small screens
                          md: "20px",  // medium screens
                          lg: "20px",  // large screens
                          xl: "28px",  // extra-large screens
                          
                        },
                        color: colors.primary[500] }}/>

               </div>
             </div>

              <audio ref={audioRef} src={notificationSound} preload="auto" />
                  
               
            
              
            
                <SearchResults
                          results={filteredResults || []}
                        
                          
                        
                          onClose={() => setFilteredResults([])}
                        />
              </motion.div>
            </Box>
            )}



                <div className='flex  col-span-1 md:col-span-1 justify-end items-center xl:space-x-6 md:space-x-6  2xl:space-x-8  space-x-4  xl:pr-6 lg:pr-6 md:pr-4 2xl:pr-8 pr-4'
                style={{
                  gridColumn: isXs ? 'span 1' : isSm ? 'span 1' : isMd ? 'span 1' : isLg ? 'span 1' : isXl ? 'span 1' : isXxl ? 'span 1' : 'span 1',
                }}>
                  
                        <div className="cursor-pointer" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                          <Badge badgeContent={unreadCount} color="error">
                            {isNotifOpen ? (
                              <NotificationsIcon sx={{ fontSize: {
                           xs: "20px",  // extra-small screens
                          sm: "18px",  // small screens
                          md: "20px",  // medium screens
                          lg: "24px",  // large screens
                          xl: "36px",  // extra-large screens
                          
                        }, color: colors.primary[500] }} />
                            ) : (
                              <NotificationsNoneIcon sx={{ fontSize: {
                           xs: "20px",  // extra-small screens
                          sm: "18px",  // small screens
                          md: "20px",  // medium screens
                          lg: "24px",  // large screens
                          xl: "36px",  // extra-large screens
                          
                        }, color: colors.primary[500] }} />
                            )}
                          </Badge>
                        </div>


                     {isNotifOpen && (
                <div    ref={notifRef} className="absolute md:right-2 right-2 top-1/2 mt-8 md:w-96 w-86  shadow-lg rounded-lg  z-50" style={{ backgroundColor: colors.background.default }}>
                  <Notifications
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                </div>
              )}


                 
               <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center rounded-full cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}

                  >
                    {isOpen ? (
                      <PersonIcon sx={{
                        fontSize: {
                           xs: "20px",  // extra-small screens
                          sm: "18px",  // small screens
                          md: "20px",  // medium screens
                          lg: "24px",  // large screens
                          xl: "36px",  // extra-large screens
                          
                        }, color: colors.primary[500] }} />
                    ) : (
                      <PersonOutlineIcon sx={{ fontSize: {
                          xs: "20px",  // extra-small screens
                          sm: "18px",  // small screens
                          md: "20px",  // medium screens
                          lg: "24px",  // large screens
                          xl: "36px",  // extra-large screens
                          

                        }, color: colors.primary[500] }} />
                    )}
                   
                  </div>

                  {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-32  shadow-lg rounded-lg   z-50" style={{ backgroundColor: colors.background.default }}>
                      <Link to="/dashboard/settings">
                        <Button className="block w-full  py-2 text-sm cursor-pointer" sx={{ color: colors.text.primary, '&:hover': { color: colors.text.secondary }, textTransform: "none",  gap: "10px"  } }>
                          ⚙️ Settings
                        </Button>
                      </Link>

                      <Button
                        onClick={handleLogout}
                        className="block w-full   py-2 text-sm cursor-pointer hover:text-[#6D5BA6]" sx={{ color: colors.text.primary, '&:hover': { color: colors.text.secondary }, textTransform: "none", gap: "10px" } }
                        >
                      
                        🚪 Logout
                      </Button>
                    </div>
                  )}
                </div>
                

              
          </div>

                      

      </div>
     
       
    </Box>
    </div>

    </div>
 
        
  )
}

export default Navbar
