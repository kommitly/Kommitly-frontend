import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import AnimatedLines from "../dashboard/components/AnimatedLines";
import breakdown from "../assets/breakdown2.svg";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { useMediaQuery } from "@mui/material";
import banner from "../assets/banner.svg";


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

const Registration = () => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Determine the initial tab based on the query parameter
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "signup" ? 1 : 0;

  const [value, setValue] = React.useState(initialTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="flex items-center p-2 h-screen">
      <div className="flex   rounded-xl w-full items-center h-full">
        <Box className="w-full h-full   bg-[#D6CFFF]  items-center justify-center bg-no-repeat bg-cover bg-center rounded-xl">

       {/* { <AnimatedLines />} */}
       <Box 
       sx={{ padding: 4, marginBottom: 4}}>
        <div className="flex items-center gap-6 ">
          <div className=" mt-10 h-full">
              <Typography
          variant="h1"
          component="h1"
          gutterBottom
          color="primary"
          className="text-2xl font-bold  "
          sx={{ fontSize: "2.5rem", fontWeight: "regular", marginTop: "20px" }}
        >
           Welcome to 
        </Typography>
          </div>
         <img
          src={banner}
          alt="Logo"
          className="justify-end w-36 h-auto -mt-8"  
        />
        
        </div>
       

        <Typography
          variant="body1"
          component="p"
          gutterBottom
          color="primary"
          className=" mb-4"
        >
          Your journey to achieving your goals starts here.
        </Typography>
    
       </Box>
        <div className="flex justify-center items-center  w-full">
         <img
          src={breakdown}
          alt="Logo"
          className="justify-end w-10/12 h-auto "
        />
     </div>
      </Box>
     





     <div className="flex w-full bg-[#FBF9FF] h-full  rounded-xl flex-col items-center">
       <div className="flex    w-full h-full flex-col items-center relative">
        <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "#FBF9FF", marginTop: "20px",width: "90%", borderRadius: "8px", justifyContent: "center",  display: "flex" }}>
          <Tabs value={value} onChange={handleChange} aria-label="Login and Signup Tabs">
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="Signup" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} className="w-full">
          <Login />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="w-full">
          <Signup />
        </CustomTabPanel>
      </div>
     </div>
      </div>
    </Box>
  );
};

export default Registration;