import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import AnimatedLines from "../dashboard/components/AnimatedLines";

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

  // Determine the initial tab based on the query parameter
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") === "signup" ? 1 : 0;

  const [value, setValue] = React.useState(initialTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="flex items-center h-screen">
      <Box className="w-full h-full bg-[#1E1A2A] py-4 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center">
        <AnimatedLines />
      </Box>
      <div className="flex bg-[#1E1A2A] min-h-screen w-full h-full flex-col items-center relative">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
    </Box>
  );
};

export default Registration;