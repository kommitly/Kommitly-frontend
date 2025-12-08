import * as React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { ProfileContext } from '../../../context/ProfileContext';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Profile from './Profile';
import Password from './Password';
import Billing from './Billing';
import Subscription from './Subscription';
import { tokens } from "../../../theme";
import { useMediaQuery } from '@mui/material';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const Settings = () => {
  
  const location = useLocation();
  
    // Determine the initial tab based on the query parameter
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") === "Profile" ? 0 :
    queryParams.get("tab") === "Password" ? 1 : 
    queryParams.get("tab") === "Subscription" ? 2 :
    queryParams.get("tab") === "Billing" ? 3 : 0;
  
    const [value, setValue] = React.useState(initialTab);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  return (
    <div className='w-full  text-black flex flex-col min-h-screen'>
      <div className="flex md:p-4 p-2 min-h-screen w-full h-full flex-col items-start   relative">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Settings Tabs">
             <Tab label="Profile" {...a11yProps(0)} sx={{ textTransform: "none" }} />
  <Tab label="Password" {...a11yProps(1)} sx={{ textTransform: "none" }} />
            {/* {<Tab label="Subscription" {...a11yProps(2)} />
            <Tab label="Billing" {...a11yProps(3)} />} */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} className="w-full ">
          <Profile />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="w-full">
          <Password />
        </CustomTabPanel>
         {/* {
        <CustomTabPanel value={value} index={2} className="w-full">
          <Subscription />
        </CustomTabPanel>
       <CustomTabPanel value={value} index={3} className="w-full">
          <Billing />
        </CustomTabPanel>} */}
      </div>
    
    
    </div>
  );
};

export default Settings;
