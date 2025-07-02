import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import { tokens } from "../theme";
import getLocationAndTimezone from "../utils/location";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { TextField} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { use } from "react";

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  timezone: "Africa/Nairobi",
  
};

const userSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  
});



const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setDialogOpen(true);
        setEmail(values.email);
        setPassword(values.password);
        setIsCheckingVerification(true);
        getLocationAndTimezone();

      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Signup failed. Try again.");
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    }
  };

 
  useEffect(() => {
    let interval;
    if (isCheckingVerification) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://kommitly-backend.onrender.com/api/users/check-verification-status/${email}/`);
          if (!res.ok) throw new Error("Failed to check verification status");
  
          const data = await res.json();
          if (data.verified === true) {
            clearInterval(interval);
  
            // 🔥 Get access token using the token generation API
            const tokenRes = await fetch("https://kommitly-backend.onrender.com/api/token/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password}), // Send user credentials
            });
  
            if (tokenRes.ok) {
              const tokenData = await tokenRes.json();
              login(tokenData.access); // Call login from AuthContext
            } else {
              navigate("/login"); // Fallback if token generation fails
            }
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isCheckingVerification, email, password, navigate]);

 
  return (
    <div className="flex w-full   flex-col items-center  ">
   

 
      
     
        {message && <p style={{color:colors.background.warning}}>{message}</p>}

        <div className="h-8/12 w-10/12 flex flex-col items-center justify-center">

        <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
        >
            {({
                values,
                errors, 
                touched, 
                handleBlur, 
                handleChange, 
                handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
              <Box 
              display="grid" 
              gap="30px" 
              gridTemplateColumns="repeat(4,minmax(0,1fr))"
              sx={{
                  "& > div": {gridColumn: isNonMobile ? undefined : "span 4" },
              }}
              >
                  <TextField 
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{gridColumn: "span 2"}}
                  InputProps={{ style: { color: "#fff" } }} 

                  />
                    <TextField 
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Last Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.last_name}
                        name="last_name"
                        error={!!touched.first_name && !!errors.last_name}
                        helperText={touched.first_name && errors.last_name}
                        sx={{ gridColumn: "span 2" }}
                        InputProps={{ style: { color: "#fff" } }} 
                        />
                        <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                        fullWidth
                        variant="filled"
                        type="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={!!touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                        InputProps={{ style: { color: "#fff" } }} 
                        />



                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" width="100%"  >
                        <Button type="submit" color="secondary" variant="contained"  sx={{width: '100%', padding: 1.5 }}>
                            Create New User
                        </Button>
                    </Box>

                </form>
            )}
        </Formik>

      

    
          <Backdrop 
               sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={dialogOpen}
          onClick={() => setDialogOpen(false)}
          >
             <Box className=" w-11/12 space-y-4 p-4 max-h-full rounded-xl mt-4 " sx={{ backgroundColor: colors.background.paper }}>
              <div className="flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <p>Signup successful! Please check your email to verify your account.</p>
             
            </div>
          </div>
             
             
             
             </Box>


          
          </Backdrop>
      </div>
    </div>
  );
};

export default Signup;